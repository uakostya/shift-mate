import {
  Component,
  signal,
  computed,
  inject,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ScheduleService } from '../services/schedule.service';
import { ShiftSchedule, CalendarDay } from '../models/schedule.model';

@Component({
  selector: 'app-schedule-view',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-6">
          @if (schedule()?.name) {
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {{ schedule()?.name }}
          </h1>
          }
        </div>

        @if (!schedule()) {
        <!-- Error Message -->
        <div class="card max-w-md mx-auto text-center">
          <div class="text-red-600 mb-4">
            <svg
              class="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z"
              ></path>
            </svg>
          </div>
          <h3
            class="text-lg font-medium text-gray-900 mb-2"
            i18n="@@calendar.error.title"
          >
            Неправильні Параметри Графіку
          </h3>
          <p class="text-gray-600 mb-4" i18n="@@calendar.error.description">
            Параметри графіку в URL неправильні або відсутні.
          </p>
          <button
            (click)="goToSetup()"
            class="btn-primary"
            i18n="@@calendar.error.button"
          >
            Створити Новий Графік
          </button>
        </div>
        } @else {
        <!-- Calendar Navigation -->
        <div class="card mb-6">
          <div class="flex items-center justify-between">
            <button
              (click)="previousMonth()"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              i18n-aria-label="@@calendar.previous.month"
              aria-label="Попередній місяць"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
            </button>

            <h3 class="text-xl font-semibold text-gray-900">
              {{ currentMonth() | date : 'LLLL yyyy' | titlecase }}
            </h3>

            <button
              (click)="nextMonth()"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              i18n-aria-label="@@calendar.next.month"
              aria-label="Наступний місяць"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Calendar -->
        <div class="card">
          <!-- Day headers -->
          <div class="grid grid-cols-7 gap-1 mb-4">
            @for (day of dayHeaders; track day) {
            <div class="text-center text-xl font-medium text-gray-500 py-2">
              {{ day }}
            </div>
            }
          </div>

          <!-- Calendar days -->
          <div class="grid grid-cols-7 gap-1">
            @for (day of calendarDays(); track day.date.getTime()) {
            <div
              class="aspect-square flex items-center justify-center text-3xl border rounded-lg transition-all duration-200"
              [class]="getDayClasses(day)"
            >
              <span class="font-medium">{{ day.date.getDate() }}</span>
            </div>
            }
          </div>

          <!-- Legend -->
          <div class="mt-6 pt-4 border-t border-gray-200">
            <div class="flex flex-wrap gap-4 justify-center">
              <div class="flex items-center space-x-2">
                <div class="w-4 h-4 bg-red-500 border rounded"></div>
                <span
                  class="text-sm text-gray-600"
                  i18n="@@calendar.legend.working"
                  >Робочий День</span
                >
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-4 h-4 bg-gray-300 border rounded"></div>
                <span class="text-sm text-gray-600" i18n="@@calendar.legend.off"
                  >Вихідний</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            (click)="goToSetup()"
            class="btn-secondary"
            i18n="@@calendar.actions.new"
          >
            Створити Новий Графік
          </button>
          <button
            (click)="shareSchedule()"
            class="btn-primary"
            i18n="@@calendar.actions.share"
          >
            Поділитися Графіком
          </button>
        </div>
        }
      </div>
    </div>
  `,
})
export class ScheduleViewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly scheduleService = inject(ScheduleService);

  schedule = signal<ShiftSchedule | null>(null);
  currentMonth = signal<Date>(new Date());

  dayHeaders = [
    $localize`:@@calendar.days.mon:Пн`,
    $localize`:@@calendar.days.tue:Вт`,
    $localize`:@@calendar.days.wed:Ср`,
    $localize`:@@calendar.days.thu:Чт`,
    $localize`:@@calendar.days.fri:Пт`,
    $localize`:@@calendar.days.sat:Сб`,
    $localize`:@@calendar.days.sun:Нд`,
  ];

  calendarDays = computed(() => {
    const schedule = this.schedule();
    const month = this.currentMonth();

    if (!schedule) return [];

    return this.scheduleService.calculateCalendarMonth(schedule, month);
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const urlParams = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        urlParams.set(key, params[key]);
      });

      const schedule = this.scheduleService.parseScheduleFromUrl(urlParams);
      this.schedule.set(schedule);
    });
  }

  previousMonth(): void {
    const current = this.currentMonth();
    this.currentMonth.set(
      new Date(current.getFullYear(), current.getMonth() - 1, 1)
    );
  }

  nextMonth(): void {
    const current = this.currentMonth();
    this.currentMonth.set(
      new Date(current.getFullYear(), current.getMonth() + 1, 1)
    );
  }

  getDayClasses(day: CalendarDay): string {
    const classes = ['cursor-default'];

    if (!day.isCurrentMonth) {
      classes.push('text-gray-400', 'bg-gray-50');
    } else if (day.isWorking) {
      classes.push('bg-red-500', 'text-white');
    } else {
      classes.push('bg-gray-300', 'text-gray-800');
    }

    if (day.isCurrentDay && day.isCurrentMonth) {
      classes.push('ring-2', 'ring-blue-500', 'ring-offset-1');
    }

    return classes.join(' ');
  }

  goToSetup(): void {
    this.router.navigate(['/']);
  }

  shareSchedule(): void {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert(
        $localize`:@@calendar.alert.scheduleCopied:Посилання скопійовано в буфер обміну!`
      );
    });
  }
}
