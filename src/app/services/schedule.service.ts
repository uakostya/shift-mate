import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  CalendarDay,
  ScheduleParams,
  ShiftSchedule,
} from '../models/schedule.model';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private router = inject(Router);

  generateScheduleUrl(schedule: ShiftSchedule): string {
    const params: ScheduleParams = {
      start: this.formatDate(schedule.startDate),
      work: schedule.workDays,
      rest: schedule.restDays,
    };

    if (schedule.name) {
      params.name = schedule.name;
    }

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.set(key, value.toString());
      }
    });

    const baseUrl = window.location.origin;
    return `${baseUrl}/schedule?${queryParams.toString()}`;
  }

  parseScheduleFromUrl(queryParams: URLSearchParams): ShiftSchedule | null {
    try {
      const start = queryParams.get('start');
      const work = queryParams.get('work');
      const rest = queryParams.get('rest');
      const name = queryParams.get('name');

      if (!start || !work || !rest) {
        return null;
      }

      const startDate = new Date(start);
      if (isNaN(startDate.getTime())) {
        return null;
      }

      const schedule: ShiftSchedule = {
        startDate,
        workDays: parseInt(work, 10),
        restDays: parseInt(rest, 10),
        name: name || undefined,
      };

      return schedule;
    } catch {
      return null;
    }
  }

  calculateCalendarMonth(
    schedule: ShiftSchedule,
    targetMonth: Date
  ): CalendarDay[] {
    const year = targetMonth.getFullYear();
    const month = targetMonth.getMonth();

    // Get first day of month and how many days in month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Get first day of week (0 = Sunday, 1 = Monday, etc.)
    // Convert to Monday-based week (0 = Monday, 6 = Sunday)
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7;

    // Get days from previous month to fill the calendar
    const prevMonth = new Date(year, month - 1, 0);
    const daysFromPrevMonth = firstDayOfWeek;

    // Get days from next month to fill the calendar
    const totalCells = 42; // 6 weeks × 7 days
    const daysFromNextMonth = totalCells - daysInMonth - daysFromPrevMonth;

    const calendar: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Add days from previous month
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonth.getDate() - i);
      calendar.push({
        date,
        isWorking: this.isWorkingDay(schedule, date),
        isCurrentDay: this.isSameDay(date, today),
        isCurrentMonth: false,
      });
    }

    // Add days from current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      calendar.push({
        date,
        isWorking: this.isWorkingDay(schedule, date),
        isCurrentDay: this.isSameDay(date, today),
        isCurrentMonth: true,
      });
    }

    // Add days from next month
    for (let day = 1; day <= daysFromNextMonth; day++) {
      const date = new Date(year, month + 1, day);
      calendar.push({
        date,
        isWorking: this.isWorkingDay(schedule, date),
        isCurrentDay: this.isSameDay(date, today),
        isCurrentMonth: false,
      });
    }

    return calendar;
  }

  private isWorkingDay(schedule: ShiftSchedule, date: Date): boolean {
    const daysDiff = this.getDaysDifference(schedule.startDate, date);
    if (daysDiff < 0) return false;

    const cycleLength = schedule.workDays + schedule.restDays;
    const dayInCycle = daysDiff % cycleLength;

    return dayInCycle < schedule.workDays;
  }

  private getDaysDifference(startDate: Date, targetDate: Date): number {
    const start = new Date(startDate);
    const target = new Date(targetDate);

    start.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    return Math.floor(
      (target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  navigateToSchedule(schedule: ShiftSchedule): void {
    const params: ScheduleParams = {
      start: this.formatDate(schedule.startDate),
      work: schedule.workDays,
      rest: schedule.restDays,
    };

    if (schedule.name) {
      params.name = schedule.name;
    }

    this.router.navigate(['/schedule'], { queryParams: params });
  }
}
