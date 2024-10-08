import { Inject } from '@nestjs/common'
import { Service } from '@libs/decorator'
import {
  BusinessException,
  EntityNotExistException,
  ParameterValidationException,
  UnexpectedException
} from '@libs/exception'
import { PrismaService } from '@libs/prisma'
import { StorageService } from '@libs/storage'
import { calculatePaginationOffset, formatFileUrl } from '@libs/utils'
import { Prisma, RosterStatus, type Roster } from '@prisma/client'
import type { CreateRosterDTO, UpdateRosterDTO } from './dto/roster.dto'

@Service()
export class RosterService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('ImageStorageService')
    private readonly imageStorageService: StorageService
  ) {}

  async getRoster(rosterId: number): Promise<Roster> {
    try {
      const roster = await this.prisma.roster.findUniqueOrThrow({
        where: {
          id: rosterId
        }
      })

      if (roster.profileImageUrl) {
        roster.profileImageUrl = formatFileUrl(roster.profileImageUrl)
      }

      return roster
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('로스터가 존재하지 않습니다')
      }
      throw new UnexpectedException(error)
    }
  }

  async getRosterByStudentId(studentId: string): Promise<Roster> {
    try {
      const roster = await this.prisma.roster.findUniqueOrThrow({
        where: {
          studentId
        }
      })

      if (roster.profileImageUrl) {
        roster.profileImageUrl = formatFileUrl(roster.profileImageUrl)
      }

      return roster
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('로스터가 존재하지 않습니다')
      }
      throw new UnexpectedException(error)
    }
  }

  async getRosters(
    page: number,
    limit = 10,
    searchTerm = '',
    filter?: string
  ): Promise<{ total: number; rosters: Roster[] }> {
    try {
      const status = this.checkRosterStatus(filter)

      const rosters = await this.prisma.roster.findMany({
        where: {
          status,
          name: {
            contains: searchTerm
          }
        },
        take: limit,
        skip: calculatePaginationOffset(page, limit),
        orderBy: [
          {
            admissionYear: 'asc'
          },
          {
            name: 'asc'
          }
        ]
      })

      rosters.forEach((roster) => {
        if (roster.profileImageUrl) {
          roster.profileImageUrl = formatFileUrl(roster.profileImageUrl)
        }
      })

      const total = await this.prisma.roster.count({
        where: {
          status,
          name: {
            contains: searchTerm
          }
        }
      })

      return { total, rosters }
    } catch (error) {
      if (error instanceof BusinessException) throw error
      throw new UnexpectedException(error)
    }
  }

  async createRoster(rosterDTO: CreateRosterDTO): Promise<Roster> {
    try {
      return await this.prisma.roster.create({
        data: rosterDTO
      })
    } catch (error) {
      throw new UnexpectedException(error)
    }
  }

  async updateRoster(
    rosterId: number,
    rosterDTO: UpdateRosterDTO
  ): Promise<Roster> {
    try {
      return await this.prisma.roster.update({
        where: {
          id: rosterId
        },
        data: rosterDTO
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('로스터가 존재하지 않습니다')
      }
      throw new UnexpectedException(error)
    }
  }

  async updateRosterProfileImage(
    rosterId: number,
    image: Express.Multer.File
  ): Promise<Roster> {
    try {
      const roster = await this.prisma.roster.findUniqueOrThrow({
        where: {
          id: rosterId
        },
        select: {
          profileImageUrl: true
        }
      })

      if (roster.profileImageUrl) {
        this.imageStorageService.deleteObject(roster.profileImageUrl)
      }

      const newImageUrl = await this.imageStorageService.uploadObject(
        image,
        `rostser/${rosterId}/profile`
      )

      return await this.prisma.roster.update({
        where: {
          id: rosterId
        },
        data: {
          profileImageUrl: newImageUrl.src
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('로스터가 존재하지 않습니다')
      }
      throw new UnexpectedException(error)
    }
  }

  async deleteRoster(rosterId: number): Promise<Roster> {
    try {
      return await this.prisma.roster.delete({
        where: {
          id: rosterId
        }
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new EntityNotExistException('로스터가 존재하지 않습니다')
      }
      throw new UnexpectedException(error)
    }
  }

  private checkRosterStatus(status: string): RosterStatus {
    try {
      return RosterStatus[status]
    } catch (error) {
      console.log(error)
      throw new ParameterValidationException('status')
    }
  }
}
