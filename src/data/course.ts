import type { Course, Day } from '../types/course';
import { SPRINTS } from './sprints';
import { INTRODUCTION_LESSON } from './startHere/introduction';
import { SETUP_LESSON } from './startHere/setup';
import { day01 } from './days/day-01';
import { day02 } from './days/day-02';
import { day03 } from './days/day-03';
import { day04 } from './days/day-04';
import { day05 } from './days/day-05';
import { day06 } from './days/day-06';
import { day07 } from './days/day-07';
import { day08 } from './days/day-08';
import { day09 } from './days/day-09';
import { day10 } from './days/day-10';
import { day11 } from './days/day-11';
import { day12 } from './days/day-12';
import { day13 } from './days/day-13';
import { day14 } from './days/day-14';
import { day15 } from './days/day-15';
import { day16 } from './days/day-16';
import { day17 } from './days/day-17';
import { day18 } from './days/day-18';
import { day19 } from './days/day-19';
import { day20 } from './days/day-20';
import { day21 } from './days/day-21';
import { day22 } from './days/day-22';
import { day23 } from './days/day-23';
import { day24 } from './days/day-24';
import { day25 } from './days/day-25';

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
  day10,
  day11,
  day12,
  day13,
  day14,
  day15,
  day16,
  day17,
  day18,
  day19,
  day20,
  day21,
  day22,
  day23,
  day24,
  day25,
];

export const COURSE_DATA: Course = {
  id: 'ai-creator-studio-25-day',
  title: 'AI CREATOR STUDIO',
  totalDays: 25,
  startHere: [INTRODUCTION_LESSON, SETUP_LESSON],
  sprints: SPRINTS,
  days: ALL_DAYS,
};
