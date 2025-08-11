import { TestBed } from '@angular/core/testing';
import { ScheduleService } from './schedule.service';
import { ShiftSchedule } from '../models/schedule.model';

describe('ScheduleService', () => {
  let service: ScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate working days correctly', () => {
    const schedule: ShiftSchedule = {
      startDate: new Date('2025-08-11'),
      workDays: 2,
      restDays: 2,
    };

    const targetMonth = new Date('2025-08-01');
    const calendar = service.calculateCalendarMonth(schedule, targetMonth);

    expect(calendar.length).toBe(42); // 6 weeks × 7 days

    // Check if August 11th and 12th are working days (2 work days)
    const aug11 = calendar.find(
      (day) =>
        day.date.getDate() === 11 &&
        day.date.getMonth() === 7 &&
        day.isCurrentMonth
    );
    const aug12 = calendar.find(
      (day) =>
        day.date.getDate() === 12 &&
        day.date.getMonth() === 7 &&
        day.isCurrentMonth
    );

    expect(aug11?.isWorking).toBe(true);
    expect(aug12?.isWorking).toBe(true);
  });

  it('should generate valid schedule URL', () => {
    const schedule: ShiftSchedule = {
      startDate: new Date('2025-08-11'),
      workDays: 2,
      restDays: 2,
      name: 'Test Schedule',
    };

    const url = service.generateScheduleUrl(schedule);

    expect(url).toContain('start=2025-08-11');
    expect(url).toContain('work=2');
    expect(url).toContain('rest=2');
    expect(url).toContain('name=Test+Schedule');
  });

  it('should parse schedule from URL parameters', () => {
    const params = new URLSearchParams(
      'start=2025-08-11&work=2&rest=2&name=Test%20Schedule'
    );
    const schedule = service.parseScheduleFromUrl(params);

    expect(schedule).toBeTruthy();
    expect(schedule?.workDays).toBe(2);
    expect(schedule?.restDays).toBe(2);
    expect(schedule?.name).toBe('Test Schedule');
    expect(schedule?.startDate.toISOString().split('T')[0]).toBe('2025-08-11');
  });
});
