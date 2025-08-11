export interface ShiftSchedule {
  startDate: Date;
  workDays: number;
  restDays: number;
  name?: string;
}

export interface CalendarDay {
  date: Date;
  isWorking: boolean;
  isCurrentDay: boolean;
  isCurrentMonth: boolean;
}

export interface ScheduleParams {
  start: string; // YYYY-MM-DD format
  work: number;
  rest: number;
  name?: string;
}
