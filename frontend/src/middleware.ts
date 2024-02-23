import { ACCESS_TOKEN_EXPIRE_TIME, API_BASE_URL } from '@/lib/vars'
import { encode, getToken } from 'next-auth/jwt'
import { parseCookie } from 'next/dist/compiled/@edge-runtime/cookies'
import { NextResponse, type NextRequest } from 'next/server'

const getAuthToken = (res: Response) => {
  const Authorization = res.headers.get('authorization') as string
  const parsedCookie = parseCookie(res.headers.get('set-cookie') || '')
  const refreshToken = parsedCookie.get('refresh_token') as string
  const refreshTokenExpires = parsedCookie.get('Expires') as string
  return {
    accessToken: Authorization,
    refreshToken,
    accessTokenExpires: Date.now() + ACCESS_TOKEN_EXPIRE_TIME - 30 * 1000, // 29 minutes 30 seconds
    refreshTokenExpires: Date.parse(refreshTokenExpires) - 30 * 1000 // 23 hours 59 minutes 30 seconds
  }
}

const sessionCookieName = process.env.NEXTAUTH_URL?.startsWith('https://')
  ? '__Secure-next-auth.session-token'
  : 'next-auth.session-token'

export const middleware = async (req: NextRequest) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (req.nextUrl.pathname.startsWith('/console') && !token)
    return NextResponse.redirect(new URL('/', req.url))

  if (token && token.accessTokenExpires <= Date.now()) {
    const reissueRes = await fetch(API_BASE_URL + '/auth/reissue', {
      headers: {
        cookie: `refresh_token=${token.refreshToken}`
      },
      cache: 'no-store'
    })
    if (reissueRes.ok) {
      const {
        accessToken,
        refreshToken,
        accessTokenExpires,
        refreshTokenExpires
      } = getAuthToken(reissueRes)
      const newToken = await encode({
        secret: process.env.NEXTAUTH_SECRET as string,
        token: {
          ...token,
          accessToken,
          refreshToken,
          accessTokenExpires,
          refreshTokenExpires
        },
        maxAge: 24 * 60 * 60 // 24 hours
      })
      req.cookies.set(sessionCookieName, newToken)
      const res = NextResponse.next({
        request: {
          headers: req.headers
        }
      })
      res.cookies.set(sessionCookieName, newToken, {
        maxAge: 24 * 60 * 60,
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax'
      })
      return res
    } else if (reissueRes.status == 401) {
      req.cookies.delete(sessionCookieName)
      const res = NextResponse.next({
        request: {
          headers: req.headers
        }
      })
      res.cookies.delete(sessionCookieName)
      return res
    }
  }
  return NextResponse.next({
    request: {
      headers: req.headers
    }
  })
}