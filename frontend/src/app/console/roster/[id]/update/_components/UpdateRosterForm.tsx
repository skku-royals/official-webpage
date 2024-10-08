'use client'

import { ImageInput } from '@/components/ImageInput'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { RosterStatus, RosterType } from '@/lib/enums'
import fetcher from '@/lib/fetcher'
import { RosterFormSchema } from '@/lib/forms'
import type { Roster } from '@/lib/types/roster'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

export default function UpdateRosterForm({ roster }: { roster: Roster }) {
  const [isFetching, setIsFetching] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
  }

  const router = useRouter()

  const UpdateRosterFormSchema = RosterFormSchema.omit({ id: true })

  const form = useForm<z.infer<typeof UpdateRosterFormSchema>>({
    resolver: zodResolver(UpdateRosterFormSchema),
    defaultValues: {
      ...roster,
      offPosition:
        roster.type === RosterType.Athlete
          ? (roster.offPosition ?? undefined)
          : undefined,
      defPosition:
        roster.type === RosterType.Athlete
          ? (roster.defPosition ?? undefined)
          : undefined,
      splPosition:
        roster.type === RosterType.Athlete
          ? (roster.splPosition ?? undefined)
          : undefined
    }
  })

  const onSubmit = async (data: z.infer<typeof UpdateRosterFormSchema>) => {
    try {
      setIsFetching(true)
      await fetcher.put(
        `/rosters/${roster.id}`,
        {
          ...data,
          class: data.class === '' ? '없음' : data.class,
          offPosition:
            data.type !== RosterType.Athlete ? data.type : data.offPosition
        },
        false
      )

      if (selectedFile) {
        const formData = new FormData()
        formData.append('image', selectedFile)
        await fetcher.put(
          `/rosters/${roster.id}/profile-image`,
          formData,
          false
        )
      }

      router.push('/console/roster?revalidate=true')
      router.refresh()
      toast.success('부원정보가 업데이트 되었습니다')
    } catch (error) {
      console.log(error)
      toast.error('부원을 업데이트하지 못했습니다')
    } finally {
      setIsFetching(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-12 gap-5"
      >
        <div className="col-span-12">
          <p className="text-sm font-medium leading-6 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            프로필 이미지 변경
          </p>
          <ImageInput onFileSelect={handleFileSelect} />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>학번 (코치진의 경우 전화번호 뒤 4자리)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="10자리 (ex 2024310000)" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>구분</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="로스터 종류를 선택해주세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={RosterType.Athlete}>선수</SelectItem>
                    <SelectItem value={RosterType.Staff}>스태프</SelectItem>
                    <SelectItem value={RosterType.HeadCoach}>감독</SelectItem>
                    <SelectItem value={RosterType.Coach}>코치</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>상태</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="부원의 상태를 선택해주세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={RosterStatus.Enable}>활성</SelectItem>
                    <SelectItem value={RosterStatus.Absence}>휴학</SelectItem>
                    <SelectItem value={RosterStatus.Military}>군대</SelectItem>
                    <SelectItem value={RosterStatus.Alumni}>졸업</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <FormField
            control={form.control}
            name="registerYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>입부년도 (미식축구부에 입부한 년도)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="4자리 (ex 2024)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <FormField
            control={form.control}
            name="admissionYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>입학년도 (학교에 입학한 년도)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="4자리 (ex 2024)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
          <FormField
            control={form.control}
            name="class"
            render={({ field }) => (
              <FormItem>
                <FormLabel>직책 (선택)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="(ex 주장, 주무)" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {form.getValues('type') === RosterType.Athlete && (
          <>
            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
              <FormField
                control={form.control}
                name="offPosition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>오펜스포지션</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
              <FormField
                control={form.control}
                name="defPosition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>디펜스포지션</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
              <FormField
                control={form.control}
                name="splPosition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>스페셜포지션</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )}
        <div className="col-span-12 flex space-x-1">
          <Button type="submit" disabled={isFetching}>
            수정하기
          </Button>
          <Button
            type="button"
            variant={'outline'}
            onClick={() => router.back()}
          >
            목록으로
          </Button>
        </div>
      </form>
    </Form>
  )
}
