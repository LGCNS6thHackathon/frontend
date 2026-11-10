// Events use a half-open interval: an end at midnight does not occupy the next day.
export function eventOnKoreanDay(event: { startAt: string; endAt: string }, day: string) {
  const dayStart = Date.parse(`${day}T00:00:00+09:00`);
  const dayEnd = dayStart + 24 * 60 * 60 * 1000;
  return Date.parse(event.startAt) < dayEnd && Date.parse(event.endAt) > dayStart;
}
