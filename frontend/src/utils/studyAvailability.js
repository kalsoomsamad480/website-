import { getHoursForDay } from './openingHours';

// Demo occupancy by hour of day. Real availability arrives with reservations (Phase 4).
const BUSY_BY_HOUR = [
  { from: 8, to: 10, level: 0.35 },
  { from: 10, to: 13, level: 0.7 },
  { from: 13, to: 15, level: 0.55 },
  { from: 15, to: 18, level: 0.8 },
  { from: 18, to: 23, level: 0.6 },
];

const ZONE_FACTOR = { 'Quiet Room': 1, 'Focus Bar': 0.9, 'Group Tables': 0.75 };

/** Returns { isOpen, zones: [{ name, seats, free }] } for the given time. */
export function getDemoAvailability(zones, date = new Date()) {
  const today = getHoursForDay(date.getDay());
  const hour = date.getHours() + date.getMinutes() / 60;
  const [openHour] = today.open.split(':').map(Number);
  const [closeHour] = today.close.split(':').map(Number);
  const isOpen = hour >= openHour && hour < closeHour;

  const busy = BUSY_BY_HOUR.find((slot) => hour >= slot.from && hour < slot.to)?.level ?? 0;
  return {
    isOpen,
    zones: zones.map((zone) => {
      const taken = isOpen ? Math.round(zone.seats * busy * (ZONE_FACTOR[zone.name] ?? 0.8)) : 0;
      return { name: zone.name, seats: zone.seats, free: zone.seats - taken };
    }),
  };
}
