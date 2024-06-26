'use server'

import type { AttendanceStatus } from './enums'
import fetcher from './fetcher'
import type { AttendanceList, AttendanceStatistic } from './types/attendance'
import type { Roster, RosterList } from './types/roster'
import type { ScheduleList, ScheduleListItem } from './types/schedule'
import type {
  SurveyGroupList,
  SurveyGroupListItem,
  SurveyGroupWithSchedules,
  SurveyUnsubmitList
} from './types/survey'
import type { UserList, UserProfile } from './types/user'
import { PAGINATION_LIMIT_DEFAULT } from './vars'

export const getCurrentUserProfile = async (): Promise<UserProfile> => {
  return await fetcher.get<UserProfile>('/user')
}

export const getUsers = async (page: number): Promise<UserList> => {
  return await fetcher.get<UserList>(
    `/user/list?page=${page}&limit=${PAGINATION_LIMIT_DEFAULT}`
  )
}

export const getRoster = async (rosterId: number): Promise<Roster> => {
  return await fetcher.get<Roster>(`/rosters/${rosterId}`)
}

export const getRosters = async (
  page: number,
  searchTerm: string
): Promise<RosterList> => {
  return await fetcher.get<RosterList>(
    `/rosters?page=${page}&limit=${PAGINATION_LIMIT_DEFAULT}&filter=Enable&searchTerm=${searchTerm}`
  )
}

export const getSurveyGroup = async (
  surveyGroupId: number
): Promise<SurveyGroupListItem> => {
  return await fetcher.get(`/surveys/groups/${surveyGroupId}`)
}

export const getSurveyGroups = async (
  page: number
): Promise<SurveyGroupList> => {
  return await fetcher.get<SurveyGroupList>(
    `/surveys/groups?page=${page}&limit=${PAGINATION_LIMIT_DEFAULT}`
  )
}

export const getIsEndedSurvey = async (
  surveyGroupId: number
): Promise<{ ended: boolean }> => {
  return await fetcher.get<{ ended: boolean }>(
    `/surveys/groups/${surveyGroupId}/is-ended`,
    false
  )
}

export const getSurveyGroupWithSchedules = async (
  surveyGroupId: number
): Promise<SurveyGroupWithSchedules> => {
  return await fetcher.get<SurveyGroupWithSchedules>(
    `/surveys/groups/${surveyGroupId}/schedules`
  )
}

export const getSchedules = async (page: number): Promise<ScheduleList> => {
  return await fetcher.get<ScheduleList>(
    `/surveys/schedules?page=${page}&limit=${PAGINATION_LIMIT_DEFAULT}`
  )
}

export const getSchedule = async (
  scheduleId: number
): Promise<ScheduleListItem> => {
  return await fetcher.get<ScheduleListItem>(`/surveys/schedules/${scheduleId}`)
}

export const getAttendances = async (
  scheduleId: number,
  page: number,
  rosterType: string,
  searchTerm: string,
  newbie: string,
  limit?: number
): Promise<AttendanceList> => {
  return await fetcher.get<AttendanceList>(
    `/attendances?scheduleId=${scheduleId}&page=${page}&rosterType=${rosterType}&searchTerm=${searchTerm}&newbie=${newbie}&limit=${limit ? limit : PAGINATION_LIMIT_DEFAULT}`
  )
}

export const getUncheckedAttendances = async (
  scheduleId: number,
  page: number,
  response: AttendanceStatus,
  limit?: number
): Promise<AttendanceList> => {
  return await fetcher.get<AttendanceList>(
    `/attendances/unchecked?scheduleId=${scheduleId}&page=${page}&response=${response}&limit=${limit ? limit : PAGINATION_LIMIT_DEFAULT}`
  )
}

export const getAttendanceStatistic = async (
  scheduleId: number
): Promise<AttendanceStatistic> => {
  return await fetcher.get<AttendanceStatistic>(
    `/attendances/statistic?scheduleId=${scheduleId}`
  )
}

export const getSurveyUnsubmits = async (surveyGroupId: number) => {
  return await fetcher.get<SurveyUnsubmitList>(
    `/surveys/groups/${surveyGroupId}/unsubmits`
  )
}
