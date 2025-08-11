import {
  Component,
  signal,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ScheduleService } from '../services/schedule.service';
import { ShiftSchedule } from '../models/schedule.model';

@Component({
  selector: 'app-schedule-setup',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900" i18n="@@setup.title">
            Create Shift Schedule
          </h1>
          <p class="mt-2 text-gray-600" i18n="@@setup.description">
            Set up your work schedule and get a shareable link
          </p>
        </div>

        <div class="card">
          <form [formGroup]="scheduleForm" (ngSubmit)="onSubmit()">
            <div class="space-y-6">
              <!-- Schedule Name -->
              <div>
                <label
                  for="name"
                  class="block text-sm font-medium text-gray-700"
                  i18n="@@setup.name.label"
                >
                  Schedule Name (Optional)
                </label>
                <input
                  type="text"
                  id="name"
                  formControlName="name"
                  class="form-input mt-1"
                  i18n-placeholder="@@setup.name.placeholder"
                  placeholder="My Work Schedule"
                />
              </div>

              <!-- Start Date -->
              <div>
                <label
                  for="startDate"
                  class="block text-sm font-medium text-gray-700"
                  i18n="@@setup.startDate.label"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  formControlName="startDate"
                  class="form-input mt-1"
                  required
                />
                @if (scheduleForm.get('startDate')?.invalid &&
                scheduleForm.get('startDate')?.touched) {
                <p
                  class="mt-1 text-sm text-red-600"
                  i18n="@@setup.startDate.error"
                >
                  Start date is required
                </p>
                }
              </div>

              <!-- Work Days -->
              <div>
                <label
                  for="workDays"
                  class="block text-sm font-medium text-gray-700"
                  i18n="@@setup.workDays.label"
                >
                  Working Days
                </label>
                <input
                  type="number"
                  id="workDays"
                  formControlName="workDays"
                  class="form-input mt-1"
                  min="1"
                  max="365"
                  required
                />
                @if (scheduleForm.get('workDays')?.invalid &&
                scheduleForm.get('workDays')?.touched) {
                <p
                  class="mt-1 text-sm text-red-600"
                  i18n="@@setup.workDays.error"
                >
                  Number of working days must be between 1 and 365
                </p>
                }
              </div>

              <!-- Rest Days -->
              <div>
                <label
                  for="restDays"
                  class="block text-sm font-medium text-gray-700"
                  i18n="@@setup.restDays.label"
                >
                  Rest Days
                </label>
                <input
                  type="number"
                  id="restDays"
                  formControlName="restDays"
                  class="form-input mt-1"
                  min="1"
                  max="365"
                  required
                />
                @if (scheduleForm.get('restDays')?.invalid &&
                scheduleForm.get('restDays')?.touched) {
                <p
                  class="mt-1 text-sm text-red-600"
                  i18n="@@setup.restDays.error"
                >
                  Number of rest days must be between 1 and 365
                </p>
                }
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                [disabled]="scheduleForm.invalid"
                class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                i18n="@@setup.create.button"
              >
                Create Schedule
              </button>
            </div>
          </form>

          @if (generatedUrl()) {
          <div class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3
              class="text-sm font-medium text-green-800 mb-2"
              i18n="@@setup.success.title"
            >
              Schedule Created Successfully!
            </h3>
            <div class="space-y-3">
              <div>
                <label
                  class="block text-xs font-medium text-green-700 mb-1"
                  i18n="@@setup.success.url.label"
                >
                  Schedule URL:
                </label>
                <div class="flex items-center space-x-2">
                  <input
                    type="text"
                    [value]="generatedUrl()"
                    readonly
                    class="flex-1 text-xs p-2 border border-green-300 rounded bg-white"
                  />
                  <button
                    type="button"
                    (click)="copyUrl()"
                    class="px-3 py-2 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                    i18n="@@setup.success.copy.button"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div class="flex space-x-2">
                <button
                  type="button"
                  (click)="viewSchedule()"
                  class="flex-1 btn-primary text-sm"
                  i18n="@@setup.success.view.button"
                >
                  View Schedule
                </button>
                <button
                  type="button"
                  (click)="createNew()"
                  class="flex-1 btn-secondary text-sm"
                  i18n="@@setup.success.new.button"
                >
                  Create New
                </button>
              </div>
            </div>
          </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class ScheduleSetupComponent {
  private fb = inject(FormBuilder);
  private scheduleService = inject(ScheduleService);

  generatedUrl = signal<string>('');
  currentSchedule = signal<ShiftSchedule | null>(null);

  scheduleForm = this.fb.group({
    name: [''],
    startDate: [this.getToday(), Validators.required],
    workDays: [
      2,
      [Validators.required, Validators.min(1), Validators.max(365)],
    ],
    restDays: [
      2,
      [Validators.required, Validators.min(1), Validators.max(365)],
    ],
  });

  private getToday(): string {
    return new Date().toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.scheduleForm.valid) {
      const formValue = this.scheduleForm.value;

      const schedule: ShiftSchedule = {
        startDate: new Date(formValue.startDate!),
        workDays: formValue.workDays!,
        restDays: formValue.restDays!,
        name: formValue.name || undefined,
      };

      this.currentSchedule.set(schedule);
      const url = this.scheduleService.generateScheduleUrl(schedule);
      this.generatedUrl.set(url);
    }
  }

  copyUrl(): void {
    navigator.clipboard.writeText(this.generatedUrl());
  }

  viewSchedule(): void {
    const schedule = this.currentSchedule();
    if (schedule) {
      this.scheduleService.navigateToSchedule(schedule);
    }
  }

  createNew(): void {
    this.generatedUrl.set('');
    this.currentSchedule.set(null);
    this.scheduleForm.reset({
      name: '',
      startDate: this.getToday(),
      workDays: 2,
      restDays: 2,
    });
  }
}
