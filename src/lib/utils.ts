import { clsx, type ClassValue } from 'clsx';
import dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';
import dayjsTimezone from 'dayjs/plugin/timezone';
import dayjsUtc from 'dayjs/plugin/utc';
import { twMerge } from 'tailwind-merge';

dayjs.locale('zh-cn');
dayjs.extend(dayjsUtc);
dayjs.extend(dayjsTimezone);
dayjs.extend(dayjsDuration);
dayjs.tz.guess();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(data?: string) {
  if (!data) return '-';
  return dayjs(data).tz('Asia/Shanghai').format('YYYY-MM-DD');
}

export function formatTime(data?: string) {
  if (!data) return '-';
  return dayjs(data).tz('Asia/Shanghai').format('HH:mm:ss');
}

export function formatDatetime(data?: string) {
  if (!data) return '-';
  return dayjs(data).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
}

export function diffDatetime(from?: string, to?: string) {
  if (!from || !to) return '-';

  const diff = dayjs(to).diff(from);
  const duration = dayjs.duration(diff);

  return duration.minutes() + '分钟';
}
