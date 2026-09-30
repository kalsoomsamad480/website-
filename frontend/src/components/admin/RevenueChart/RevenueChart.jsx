import { useState } from 'react';
import formatPrice from '../../../utils/formatPrice';
import { parseDateString } from '../../../utils/formatDate';
import styles from './RevenueChart.module.css';

const WIDTH = 560;
const HEIGHT = 220;
const PAD = { top: 28, right: 8, bottom: 28, left: 44 };
const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
const longDay = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'short',
  day: 'numeric',
});

/** Rounds the axis max up to a friendly step so gridlines land on clean numbers. */
function niceMax(value) {
  if (value <= 0) return 10;
  const step = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / (step / 2)) * (step / 2);
}

/**
 * Single-series bar chart of daily revenue. One series = one color and no legend (the title names it).
 * Hover or focus a bar for its exact value; a visually hidden table carries the same data.
 */
function RevenueChart({ days }) {
  const [active, setActive] = useState(null);
  const max = niceMax(Math.max(...days.map((d) => d.revenue)));
  const plotW = WIDTH - PAD.left - PAD.right;
  const plotH = HEIGHT - PAD.top - PAD.bottom;
  const slot = plotW / days.length;
  const barW = Math.min(44, slot - 2 * 2 - 18); // thin bars with a clear gap
  const y = (value) => PAD.top + plotH - (value / max) * plotH;
  const ticks = [0, max / 2, max];
  const lastIndex = days.length - 1;

  return (
    <figure className={styles.figure}>
      <div className={styles.chart}>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label="Revenue per day for the last 7 days"
        >
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={PAD.left}
                x2={WIDTH - PAD.right}
                y1={y(tick)}
                y2={y(tick)}
                className={tick === 0 ? styles.baseline : styles.grid}
              />
              <text
                x={PAD.left - 8}
                y={y(tick)}
                className={styles.axisText}
                textAnchor="end"
                dominantBaseline="middle"
              >
                ${tick % 1 ? tick.toFixed(1) : tick}
              </text>
            </g>
          ))}

          {days.map((day, index) => {
            const x = PAD.left + index * slot + (slot - barW) / 2;
            const top = y(day.revenue);
            const h = Math.max(0, PAD.top + plotH - top);
            const r = Math.min(4, h); // 4px rounded data end, square at the baseline
            const isActive = active === index;
            const label = `${longDay.format(parseDateString(day.date))}: ${formatPrice(day.revenue)} from ${day.orders} ${day.orders === 1 ? 'order' : 'orders'}`;
            return (
              <g
                key={day.date}
                tabIndex={0}
                role="img"
                aria-label={label}
                onMouseEnter={() => setActive(index)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(index)}
                onBlur={() => setActive(null)}
                className={styles.barGroup}
              >
                {/* Hit target wider and taller than the bar */}
                <rect
                  x={PAD.left + index * slot}
                  y={PAD.top}
                  width={slot}
                  height={plotH}
                  className={styles.hit}
                />
                {h > 0 && (
                  <path
                    d={`M${x},${top + h} V${top + r} Q${x},${top} ${x + r},${top} H${x + barW - r} Q${x + barW},${top} ${x + barW},${top + r} V${top + h} Z`}
                    className={`${styles.bar} ${isActive ? styles.barActive : ''} ${active !== null && !isActive ? styles.barDim : ''}`}
                  />
                )}
                <text
                  x={x + barW / 2}
                  y={HEIGHT - 8}
                  textAnchor="middle"
                  className={styles.axisText}
                >
                  {index === lastIndex ? 'Today' : weekday.format(parseDateString(day.date))}
                </text>
                {/* Selective direct label: today's value only */}
                {index === lastIndex && active === null && (
                  <text
                    x={x + barW / 2}
                    y={top - 8}
                    textAnchor="middle"
                    className={styles.valueText}
                  >
                    {formatPrice(day.revenue)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {active !== null && (
          <div
            className={styles.tooltip}
            style={{ left: `${((PAD.left + active * slot + slot / 2) / WIDTH) * 100}%` }}
            role="status"
          >
            <strong>{formatPrice(days[active].revenue)}</strong>
            <span>
              {longDay.format(parseDateString(days[active].date))}, {days[active].orders}{' '}
              {days[active].orders === 1 ? 'order' : 'orders'}
            </span>
          </div>
        )}
      </div>

      <table className="visually-hidden">
        <caption>Revenue per day, last 7 days</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Revenue</th>
            <th scope="col">Orders</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day.date}>
              <th scope="row">{longDay.format(parseDateString(day.date))}</th>
              <td>{formatPrice(day.revenue)}</td>
              <td>{day.orders}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

export default RevenueChart;
