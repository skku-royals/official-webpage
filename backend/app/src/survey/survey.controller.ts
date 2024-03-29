import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query
} from '@nestjs/common'
import { Public, Roles } from '@libs/decorator'
import { BusinessExceptionHandler } from '@libs/exception'
import { Role, type Schedule, type SurveyGroup } from '@prisma/client'
import { CreateScheduleDTO, UpdateScheduleDTO } from './dto/schedule.dto'
import {
  CreateSurveyGroupDTO,
  UpdateSurveyGroupDTO,
  SubmitSurveyDTO
} from './dto/surveyGroup.dto'
import { SurveyService } from './survey.service'

@Controller('surveys')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Public()
  @Get('/groups/:surveyGroupId')
  async getSurveyGroup(
    @Param('surveyGroupId', ParseIntPipe) surveyGroupId: number
  ): Promise<SurveyGroup> {
    try {
      return await this.surveyService.getSurveyGroup(surveyGroupId)
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Public()
  @Get('/groups/:surveyGroupId/is-ended')
  async checkIsEndedSurvey(
    @Param('surveyGroupId', ParseIntPipe) surveyGroupId: number
  ): Promise<{ ended: boolean }> {
    try {
      return await this.surveyService.checkIsEndedSurvey(surveyGroupId)
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Public()
  @Get('/groups/:surveyGroupId/schedules')
  async getSurveyGroupWithSchedule(
    @Param('surveyGroupId', ParseIntPipe) surveyGroupId: number
  ): Promise<{
    surveyGroup: SurveyGroup
    schedules: Schedule[]
  }> {
    try {
      return await this.surveyService.getSurveyGroupWithSchedules(surveyGroupId)
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Roles(Role.Manager)
  @Get('/groups/:surveyGroupId/unsubmits')
  async getUnsubmitList(
    @Param('surveyGroupId', ParseIntPipe) surveyGroupId: number
  ) {
    try {
      return await this.surveyService.getUnsubmitList(surveyGroupId)
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Public()
  @Get('/schedules')
  async getSchedules(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ): Promise<{ schedules: Schedule[]; total: number }> {
    try {
      return await this.surveyService.getSchedules(page, limit)
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Public()
  @Get('/schedules/:scheduleId')
  async getSchedule(
    @Param('scheduleId', ParseIntPipe) scheduleId: number
  ): Promise<Schedule> {
    try {
      return await this.surveyService.getSchedule(scheduleId)
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Public()
  @Get('/groups')
  async getSurveyGroups(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ): Promise<{
    surveyGroups: SurveyGroup[]
    total: number
  }> {
    try {
      return await this.surveyService.getSurveyGroups(page, limit)
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Roles(Role.Manager)
  @Post('/groups')
  async createSurveyGroup(
    @Body() surveyGroupDTO: CreateSurveyGroupDTO
  ): Promise<SurveyGroup> {
    try {
      return await this.surveyService.createSurveyGroup(surveyGroupDTO)
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Public()
  @Post('/groups/:surveyGroupId/submit')
  async submitSurvey(
    @Param('surveyGroupId', ParseIntPipe) surveyGroupId: number,
    @Body() surveyDTO: SubmitSurveyDTO
  ): Promise<{ count: number }> {
    try {
      return await this.surveyService.submitSurvey(surveyGroupId, surveyDTO)
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Roles(Role.Manager)
  @Put('/groups/:surveyGroupId')
  async updateSurveyGroup(
    @Param('surveyGroupId', ParseIntPipe) surveyGroupId: number,
    @Body() surveyGroupDTO: UpdateSurveyGroupDTO
  ): Promise<SurveyGroup> {
    try {
      return await this.surveyService.updateSurveyGroup(
        surveyGroupId,
        surveyGroupDTO
      )
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Roles(Role.Manager)
  @Delete('/groups/:surveyGroupId')
  async deleteSurveyGroup(
    @Param('surveyGroupId', ParseIntPipe) surveyGroupId: number
  ): Promise<SurveyGroup> {
    try {
      return await this.surveyService.deleteSurveyGroup(surveyGroupId)
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Roles(Role.Manager)
  @Post('/schedules')
  async createSchedule(@Body() scheduleDTO: CreateScheduleDTO) {
    try {
      return await this.surveyService.createSchedule(scheduleDTO)
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Roles(Role.Manager)
  @Put('/schedules/:scheduleId')
  async updateSchedule(
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Body() scheduleDTO: UpdateScheduleDTO
  ): Promise<Schedule> {
    try {
      return await this.surveyService.updateSchedule(scheduleId, scheduleDTO)
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }

  @Roles(Role.Manager)
  @Delete('/schedules/:scheduleId')
  async deleteSchedule(
    @Param('scheduleId', ParseIntPipe) scheduleId: number
  ): Promise<Schedule> {
    try {
      return await this.surveyService.deleteSchedule(scheduleId)
    } catch (error) {
      BusinessExceptionHandler(error)
    }
  }
}
