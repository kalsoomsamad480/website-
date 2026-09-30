import { OPENING_HOURS } from './constants';

const toMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/** "22:00" -> "10 pm", "08:30" -> "8:30 am" */
export function formatTime(time) {
  const [hours, minutes] = time.split(':').map(Number);
  const suffix = hours >= 12 ? 'pm' : 'am';
  const hour = hours % 12 || 12;
  return minutes ? `${hour}:${String(minutes).padStart(2, '0')} ${suffix}` : `${hour} ${suffix}`;
}

export function getHoursForDay(dayIndex) {
  return OPENING_HOURS.find((entry) => entry.dayIndex === dayIndex);
}

export function getOpenStatus(now = new Date()) {
  const today = getHoursForDay(now.getDay());
  const minutes = now.getHours() * 60 + now.getMinutes();

  if (minutes >= toMinutes(today.open) && minutes < toMinutes(today.close)) {
    return { isOpen: true, label: `Open until ${formatTime(today.close)}` };
  }
  if (minutes < toMinutes(today.open)) {
    return { isOpen: false, label: `Opens ${formatTime(today.open)} today` };
  }
  const tomorrow = getHoursForDay((now.getDay() + 1) % 7);
  return { isOpen: false, label: `Opens ${formatTime(tomorrow.open)} tomorrow` };
}

/** Groups consecutive days that share the same hours, e.g. "Monday to Saturday". */
export function getGroupedHours() {
  const groups = [];
  OPENING_HOURS.forEach((entry) => {
    const last = groups[groups.length - 1];
    if (last && last.open === entry.open && last.close === entry.close) {
      last.days.push(entry);
    } else {
      groups.push({ open: entry.open, close: entry.close, days: [entry] });
    }
  });

  return groups.map((group) => {
    const first = group.days[0].day;
    const last = group.days[group.days.length - 1].day;
    return {
      label: first === last ? first : `${first} to ${last}`,
      hours: `${formatTime(group.open)} to ${formatTime(group.close)}`,
      dayIndexes: group.days.map((day) => day.dayIndex),
    };
  });
}
