import type { Course, Day } from '../types/course';
import { SPRINTS } from './sprints';
import { day01 } from './days/day-01';
import { day02 } from './days/day-02';
import { day03 } from './days/day-03';
import { day04 } from './days/day-04';
import { day05 } from './days/day-05';
import { day06 } from './days/day-06';
import { day07 } from './days/day-07';
import { day08 } from './days/day-08';
import { day09 } from './days/day-09';

export const TOTAL_COURSE_LESSONS = 9;

export const ALL_DAYS: Day[] = [
  day01,
  day02,
  day03,
  day04,
  day05,
  day06,
  day07,
  day08,
  day09,
];

export const COURSE_DATA: Course = {
  id: 'ai-creator-studio-v2',
  title: 'AI CREATOR STUDIO',
  totalDays: TOTAL_COURSE_LESSONS,
  startHere: [],
  sprints: SPRINTS,
  days: ALL_DAYS,
};
