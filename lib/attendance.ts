import type { SupabaseClient } from '@supabase/supabase-js'
import type { AttendanceStatus, Subject, TimetableSlot, ExtraLecture, SpecialDay } from './types'

// ─── Types ────────────────────────────────────────────────────────────────────

export type AttendanceStatStatus = 'safe' | 'borderline' | 'at_risk'

export interface SubjectStats {
  subjectId: string
  totalScheduled: number
  attended: number
  missed: number
  cancelled: number
  attendancePercent: number
  target: number
  lecturesNeeded: number
  lecturesSafeToMiss: number
  status: AttendanceStatStatus
}

export type LectureType = 'slot' | 'extra'

export interface DayLecture {
  id: string
  type: LectureType
  subjectId: string
  subjectName: string
  shortCode: string
  color: string
  startTime: string
  endTime: string
  room: string | null
  faculty: string | null
  reason: string | null
  attendance: {
    recordId: string | null
    status: AttendanceStatus | null
    note: string | null
  }
}

export type DayScheduleResult =
  | { kind: 'holiday'; label: string; specialDayId: string }
  | { kind: 'no_college'; label: string; specialDayId: string }
  | { kind: 'schedule'; lectures: DayLecture[]; specialDay: SpecialDay | null }

export interface DayCalendarCell {
  date: string
  status: 'attended' | 'partial' | 'missed' | 'holiday' | 'no_college' | 'none' | 'future'
  lectureCount: number
  subjectColors: string[]
}

export interface OverallStats {
  overallPercent: number
  subjectsAtRisk: number
  totalScheduled: number
  totalAttended: number
  totalMissed: number
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function calcStats(
  subjectId: string,
  target: number,
  attended: number,
  missed: number,
  cancelled: number,
): SubjectStats {
  const totalScheduled = attended + missed
  const t = target / 100
  const attendancePercent = totalScheduled > 0 ? Math.round((attended / totalScheduled) * 100) : 0
  const lecturesNeeded = Math.max(0, Math.ceil((t * totalScheduled - attended) / (1 - t)))
  const lecturesSafeToMiss = totalScheduled > 0 ? Math.max(0, Math.floor((attended - t * totalScheduled) / t)) : 0
  const status: AttendanceStatStatus =
    attendancePercent >= target ? 'safe' : attendancePercent >= 65 ? 'borderline' : 'at_risk'
  return { subjectId, totalScheduled, attended, missed, cancelled, attendancePercent, target, lecturesNeeded, lecturesSafeToMiss, status }
}

// ─── getAllSubjectStats ────────────────────────────────────────────────────────
// Replaces N*5 queries with exactly 3 queries for all subjects in a semester.

export async function getAllSubjectStats(
  supabase: SupabaseClient,
  semesterId: string,
  userId: string,
): Promise<SubjectStats[]> {
  // Query 1: subjects
  const { data: subjectsRaw } = await supabase
    .from('subjects')
    .select('id, attendance_target_percent')
    .eq('semester_id', semesterId)
  const subjects = (subjectsRaw ?? []) as Pick<Subject, 'id' | 'attendance_target_percent'>[]
  if (!subjects.length) return []

  const subjectIds = subjects.map(s => s.id)

  // Query 2: all slots for these subjects
  const { data: slotsRaw } = await supabase
    .from('timetable_slots')
    .select('id, subject_id')
    .in('subject_id', subjectIds)
  const slots = (slotsRaw ?? []) as { id: string; subject_id: string }[]
  const slotIds = slots.map(s => s.id)
  const slotToSubject = new Map(slots.map(s => [s.id, s.subject_id]))

  // Query 3: all extra lectures for these subjects
  const { data: extrasRaw } = await supabase
    .from('extra_lectures')
    .select('id, subject_id')
    .in('subject_id', subjectIds)
    .eq('user_id', userId)
  const extras = (extrasRaw ?? []) as { id: string; subject_id: string }[]
  const extraIds = extras.map(e => e.id)
  const extraToSubject = new Map(extras.map(e => [e.id, e.subject_id]))

  // Query 4: all attendance records in one shot
  const allRecords: { status: string; timetable_slot_id: string | null; extra_lecture_id: string | null }[] = []

  if (slotIds.length > 0 || extraIds.length > 0) {
    // Fetch slot records
    if (slotIds.length > 0) {
      const { data } = await supabase
        .from('attendance_records')
        .select('status, timetable_slot_id, extra_lecture_id')
        .eq('user_id', userId)
        .in('timetable_slot_id', slotIds)
      for (const r of data ?? []) allRecords.push(r as typeof allRecords[0])
    }
    // Fetch extra records
    if (extraIds.length > 0) {
      const { data } = await supabase
        .from('attendance_records')
        .select('status, timetable_slot_id, extra_lecture_id')
        .eq('user_id', userId)
        .in('extra_lecture_id', extraIds)
      for (const r of data ?? []) allRecords.push(r as typeof allRecords[0])
    }
  }

  // Tally per subject
  const attendedMap = new Map<string, number>(subjectIds.map(id => [id, 0]))
  const missedMap = new Map<string, number>(subjectIds.map(id => [id, 0]))
  const cancelledMap = new Map<string, number>(subjectIds.map(id => [id, 0]))

  for (const r of allRecords) {
    const sid = r.timetable_slot_id
      ? slotToSubject.get(r.timetable_slot_id)
      : r.extra_lecture_id
        ? extraToSubject.get(r.extra_lecture_id)
        : null
    if (!sid) continue
    if (r.status === 'attended') attendedMap.set(sid, (attendedMap.get(sid) ?? 0) + 1)
    else if (r.status === 'missed') missedMap.set(sid, (missedMap.get(sid) ?? 0) + 1)
    else if (r.status === 'cancelled') cancelledMap.set(sid, (cancelledMap.get(sid) ?? 0) + 1)
  }

  return subjects.map(s =>
    calcStats(
      s.id,
      s.attendance_target_percent,
      attendedMap.get(s.id) ?? 0,
      missedMap.get(s.id) ?? 0,
      cancelledMap.get(s.id) ?? 0,
    )
  )
}

// ─── getSubjectStats (single subject — kept for DaySlideOver/LectureRow use) ──

export async function getSubjectStats(
  supabase: SupabaseClient,
  subjectId: string,
  userId: string,
): Promise<SubjectStats> {
  // Direct single-subject queries
  const { data: subjectRaw } = await supabase
    .from('subjects')
    .select('attendance_target_percent')
    .eq('id', subjectId)
    .single()
  const target = (subjectRaw as Pick<Subject, 'attendance_target_percent'> | null)?.attendance_target_percent ?? 80

  const { data: slotsRaw } = await supabase.from('timetable_slots').select('id').eq('subject_id', subjectId)
  const slotIds = (slotsRaw ?? []).map((s: { id: string }) => s.id)

  const { data: extrasRaw } = await supabase.from('extra_lectures').select('id').eq('subject_id', subjectId).eq('user_id', userId)
  const extraIds = (extrasRaw ?? []).map((e: { id: string }) => e.id)

  let attended = 0, missed = 0, cancelled = 0

  if (slotIds.length) {
    const { data } = await supabase.from('attendance_records').select('status').in('timetable_slot_id', slotIds).eq('user_id', userId)
    for (const r of data ?? []) {
      if (r.status === 'attended') attended++
      else if (r.status === 'missed') missed++
      else if (r.status === 'cancelled') cancelled++
    }
  }
  if (extraIds.length) {
    const { data } = await supabase.from('attendance_records').select('status').in('extra_lecture_id', extraIds).eq('user_id', userId)
    for (const r of data ?? []) {
      if (r.status === 'attended') attended++
      else if (r.status === 'missed') missed++
      else if (r.status === 'cancelled') cancelled++
    }
  }

  return calcStats(subjectId, target, attended, missed, cancelled)
}

// ─── getDaySchedule ───────────────────────────────────────────────────────────

export async function getDaySchedule(
  supabase: SupabaseClient,
  date: string,
  userId: string,
  semesterId: string,
): Promise<DayScheduleResult> {
  const jsDay = new Date(date + 'T12:00:00').getDay()
  const dayOfWeek = jsDay === 0 ? 7 : jsDay

  // 3 parallel queries instead of sequential
  const [specialDayRes, slotsRes, extrasRes] = await Promise.all([
    supabase.from('special_days').select('*').eq('date', date).eq('semester_id', semesterId).maybeSingle(),
    supabase.from('timetable_slots').select('*, subjects(id, name, short_code, color)').eq('semester_id', semesterId).eq('day_of_week', dayOfWeek <= 6 ? dayOfWeek : 0).order('start_time'),
    supabase.from('extra_lectures').select('*, subjects(id, name, short_code, color)').eq('date', date).eq('semester_id', semesterId).order('start_time'),
  ])

  const sd = specialDayRes.data as SpecialDay | null
  if (sd && (sd.type === 'holiday' || sd.type === 'no_college')) {
    return { kind: sd.type, label: sd.label, specialDayId: sd.id }
  }

  const slots = (slotsRes.data ?? []) as (TimetableSlot & { subjects: Subject | null })[]
  const extras = (extrasRes.data ?? []) as (ExtraLecture & { subjects: Subject | null })[]
  const slotIds = slots.map(s => s.id)
  const extraIds = extras.map(e => e.id)

  // 2 parallel record fetches
  const [slotRecsRes, extraRecsRes] = await Promise.all([
    slotIds.length
      ? supabase.from('attendance_records').select('id, timetable_slot_id, status, note').eq('date', date).eq('user_id', userId).in('timetable_slot_id', slotIds)
      : Promise.resolve({ data: [] }),
    extraIds.length
      ? supabase.from('attendance_records').select('id, extra_lecture_id, status, note').eq('user_id', userId).in('extra_lecture_id', extraIds)
      : Promise.resolve({ data: [] }),
  ])

  const slotRecordMap = new Map<string, { id: string; status: AttendanceStatus; note: string | null }>()
  for (const r of slotRecsRes.data ?? []) slotRecordMap.set(r.timetable_slot_id, { id: r.id, status: r.status, note: r.note })

  const extraRecordMap = new Map<string, { id: string; status: AttendanceStatus; note: string | null }>()
  for (const r of extraRecsRes.data ?? []) extraRecordMap.set(r.extra_lecture_id, { id: r.id, status: r.status, note: r.note })

  const lectures: DayLecture[] = [
    ...slots.map(s => {
      const rec = slotRecordMap.get(s.id)
      return {
        id: s.id, type: 'slot' as LectureType,
        subjectId: s.subjects?.id ?? s.subject_id,
        subjectName: s.subjects?.name ?? 'Unknown',
        shortCode: s.subjects?.short_code ?? '',
        color: s.subjects?.color ?? '#5B5BD6',
        startTime: s.start_time, endTime: s.end_time,
        room: s.room, faculty: s.faculty, reason: null,
        attendance: { recordId: rec?.id ?? null, status: rec?.status ?? null, note: rec?.note ?? null },
      }
    }),
    ...extras.map(e => {
      const rec = extraRecordMap.get(e.id)
      return {
        id: e.id, type: 'extra' as LectureType,
        subjectId: e.subjects?.id ?? e.subject_id,
        subjectName: e.subjects?.name ?? 'Unknown',
        shortCode: e.subjects?.short_code ?? '',
        color: e.subjects?.color ?? '#5B5BD6',
        startTime: e.start_time, endTime: e.end_time,
        room: null, faculty: null, reason: e.reason,
        attendance: { recordId: rec?.id ?? null, status: rec?.status ?? null, note: rec?.note ?? null },
      }
    }),
  ]

  lectures.sort((a, b) => a.startTime.localeCompare(b.startTime))
  return { kind: 'schedule', lectures, specialDay: sd }
}

// ─── getMonthCalendarData ─────────────────────────────────────────────────────

export async function getMonthCalendarData(
  supabase: SupabaseClient,
  year: number,
  month: number,
  userId: string,
  semesterId: string,
): Promise<Record<string, DayCalendarCell>> {
  const today = new Date().toISOString().split('T')[0]
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startStr = firstDay.toISOString().split('T')[0]
  const endStr = lastDay.toISOString().split('T')[0]

  // 4 parallel queries
  const [specialRes, slotsRes, extrasRes, recordsRes] = await Promise.all([
    supabase.from('special_days').select('date, type, label').eq('semester_id', semesterId).gte('date', startStr).lte('date', endStr),
    supabase.from('timetable_slots').select('id, day_of_week, subject_id, subjects(color)').eq('semester_id', semesterId),
    supabase.from('extra_lectures').select('id, date, subject_id, subjects(color)').eq('semester_id', semesterId).gte('date', startStr).lte('date', endStr),
    supabase.from('attendance_records').select('date, status, timetable_slot_id, extra_lecture_id').eq('user_id', userId).gte('date', startStr).lte('date', endStr),
  ])

  const specialDayMap = new Map<string, { type: string; label: string }>()
  for (const sd of specialRes.data ?? []) specialDayMap.set(sd.date, sd)

  const slots = (slotsRes.data ?? []) as unknown as (TimetableSlot & { subjects: { color: string } | null })[]

  const extrasMap = new Map<string, { id: string; color: string }[]>()
  for (const e of extrasRes.data ?? []) {
    const color = (e as unknown as { subjects: { color: string } | null }).subjects?.color ?? '#5B5BD6'
    const arr = extrasMap.get((e as { date: string }).date) ?? []
    arr.push({ id: (e as { id: string }).id, color })
    extrasMap.set((e as { date: string }).date, arr)
  }

  const recordsByDate = new Map<string, { status: string; slotId: string | null; extraId: string | null }[]>()
  for (const r of recordsRes.data ?? []) {
    const arr = recordsByDate.get(r.date) ?? []
    arr.push({ status: r.status, slotId: r.timetable_slot_id, extraId: r.extra_lecture_id })
    recordsByDate.set(r.date, arr)
  }

  const result: Record<string, DayCalendarCell> = {}
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateObj = new Date(year, month, d)
    const dateStr = dateObj.toISOString().split('T')[0]
    const jsDay = dateObj.getDay()
    const dayOfWeek = jsDay === 0 ? 7 : jsDay
    const isFuture = dateStr > today

    const sd = specialDayMap.get(dateStr)
    if (sd && (sd.type === 'holiday' || sd.type === 'no_college')) {
      result[dateStr] = { date: dateStr, status: sd.type as 'holiday' | 'no_college', lectureCount: 0, subjectColors: [] }
      continue
    }

    const daySlots = dayOfWeek <= 6 ? slots.filter(s => s.day_of_week === dayOfWeek) : []
    const slotColors = daySlots.map(s => s.subjects?.color ?? '#5B5BD6')
    const dayExtras = extrasMap.get(dateStr) ?? []
    const extraColors = dayExtras.map(e => e.color)
    const allColors = [...slotColors, ...extraColors]
    const lectureCount = allColors.length

    if (!lectureCount) { result[dateStr] = { date: dateStr, status: 'none', lectureCount: 0, subjectColors: [] }; continue }
    if (isFuture) { result[dateStr] = { date: dateStr, status: 'future', lectureCount, subjectColors: allColors.slice(0, 3) }; continue }

    const records = recordsByDate.get(dateStr) ?? []
    const slotIdSet = new Set(daySlots.map(s => s.id))
    const extraIdSet = new Set(dayExtras.map(e => e.id))
    const relevant = records.filter(r => (r.slotId && slotIdSet.has(r.slotId)) || (r.extraId && extraIdSet.has(r.extraId)))
    const attended = relevant.filter(r => r.status === 'attended').length
    const missed = relevant.filter(r => r.status === 'missed').length

    let status: DayCalendarCell['status'] = 'none'
    if (attended > 0 && missed === 0) status = 'attended'
    else if (attended > 0 && missed > 0) status = 'partial'
    else if (missed > 0 && attended === 0) status = 'missed'

    result[dateStr] = { date: dateStr, status, lectureCount, subjectColors: allColors.slice(0, 3) }
  }
  return result
}

// ─── markAttendance ───────────────────────────────────────────────────────────

export async function markAttendance(
  supabase: SupabaseClient,
  params: { userId: string; date: string; slotId?: string; extraLectureId?: string; status: AttendanceStatus; note?: string }
): Promise<void> {
  const { userId, date, slotId, extraLectureId, status, note } = params
  if (!slotId && !extraLectureId) throw new Error('Provide slotId or extraLectureId')
  const filter = slotId ? { timetable_slot_id: slotId } : { extra_lecture_id: extraLectureId! }
  const { data: existing } = await supabase.from('attendance_records').select('id').eq('date', date).eq('user_id', userId).match(filter).maybeSingle()
  const payload = { ...filter, user_id: userId, date, status, note: note ?? null, updated_at: new Date().toISOString() }
  if (existing) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await supabase.from('attendance_records').update(payload as any).eq('id', (existing as any).id)
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await supabase.from('attendance_records').insert(payload as any)
  }
}

// ─── deleteAttendance ─────────────────────────────────────────────────────────

export async function deleteAttendance(
  supabase: SupabaseClient,
  params: { userId: string; date: string; slotId?: string; extraLectureId?: string }
): Promise<void> {
  const { userId, date, slotId, extraLectureId } = params
  const filter = slotId ? { timetable_slot_id: slotId } : { extra_lecture_id: extraLectureId! }
  await supabase.from('attendance_records').delete().eq('date', date).eq('user_id', userId).match(filter)
}

// ─── getOverallStats ──────────────────────────────────────────────────────────

export async function getOverallStats(
  supabase: SupabaseClient,
  semesterId: string,
  userId: string,
): Promise<OverallStats> {
  const stats = await getAllSubjectStats(supabase, semesterId, userId)
  const totalAttended = stats.reduce((a, s) => a + s.attended, 0)
  const totalMissed = stats.reduce((a, s) => a + s.missed, 0)
  const totalScheduled = stats.reduce((a, s) => a + s.totalScheduled, 0)
  const overallPercent = totalScheduled ? Math.round((totalAttended / totalScheduled) * 100) : 0
  const subjectsAtRisk = stats.filter(s => s.status === 'at_risk').length
  return { overallPercent, subjectsAtRisk, totalScheduled, totalAttended, totalMissed }
}
