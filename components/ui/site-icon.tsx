import type { ReactNode, SVGProps } from "react";

type Drawing = () => ReactNode;

const book: Drawing = () => <><path d="M4 5.5A3.5 3.5 0 0 1 7.5 3H11v16H7.5A3.5 3.5 0 0 0 4 21.5z"/><path d="M20 5.5A3.5 3.5 0 0 0 16.5 3H13v16h3.5a3.5 3.5 0 0 1 3.5 2.5z"/></>;
const target: Drawing = () => <><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="m14 10 6-6m-3 0h3v3"/></>;
const swords: Drawing = () => <><path d="m5 4 6 6-2 2-6-6V4zm14 0-6 6 2 2 6-6V4zM8 15l-3 3m11-3 3 3M5 18l2 2m12-2-2 2"/></>;
const speed: Drawing = () => <><path d="M4 8h8M2 12h8m-6 4h8"/><path d="M14 6a7 7 0 1 1-1 12m5-6-4 2 2-5"/></>;
const alert: Drawing = () => <><path d="M12 3 2.8 20h18.4z"/><path d="M12 8v5m0 3.5v.1"/></>;
const weather: Drawing = () => <><circle cx="8" cy="8" r="3"/><path d="M8 2V1m0 14v-1m6-6h1M1 8h1m1.8-4.2-.7-.7m9.1.7.7-.7"/><path d="M8 18h9a3 3 0 0 0 .2-6A5 5 0 0 0 8 14"/></>;
const heart: Drawing = () => <path d="M12 20S4 15.5 4 9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.5 12 20 12 20z"/>;
const cycle: Drawing = () => <><path d="M7 5h8a4 4 0 0 1 4 4v1"/><path d="m16 7 3 3 3-3M17 19H9a4 4 0 0 1-4-4v-1"/><path d="m8 17-3-3-3 3"/></>;
const chat: Drawing = () => <><path d="M4 4h16v12H9l-5 4z"/><path d="M8 9h8m-8 3h5"/></>;
const shield: Drawing = () => <path d="M12 3 5 6v5c0 4.8 2.8 8 7 10 4.2-2 7-5.2 7-10V6z"/>;
const scale: Drawing = () => <><path d="M12 3v17M6 6h12M4 9l3 5 3-5m4 0 3 5 3-5"/><path d="M3.5 14h7m3 0h7M8 20h8"/></>;
const chart: Drawing = () => <><path d="M4 20V9m6 11V4m6 16v-7m4 7H2"/><path d="m3 7 6-4 6 7 6-5"/></>;
const bolt: Drawing = () => <path d="m13 2-7 11h6l-1 9 7-12h-6z"/>;
const flame: Drawing = () => <path d="M13 2c1 5-3 6-1 10 1-2 3-2 4-4 3 3 4 6 2 9a7 7 0 0 1-12 0c-2-4 1-8 4-11 0 3 1 4 3 5"/>;
const moon: Drawing = () => <path d="M19 15.5A8 8 0 0 1 8.5 5 8 8 0 1 0 19 15.5z"/>;
const snow: Drawing = () => <><path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7"/><path d="m9 4 3 3 3-3M9 20l3-3 3 3"/></>;
const cloudRain: Drawing = () => <><path d="M6 15a4 4 0 0 1 .5-8A6 6 0 0 1 18 9a3 3 0 0 1 0 6z"/><path d="m8 18-1 2m5-2-1 2m5-2-1 2"/></>;
const sun: Drawing = () => <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/></>;
const wind: Drawing = () => <><path d="M3 8h11a2.5 2.5 0 1 0-2.3-3.5M3 12h16a2.5 2.5 0 1 1-2.3 3.5M3 16h7"/><circle cx="18" cy="7" r=".8" fill="currentColor" stroke="none"/><circle cx="7" cy="19" r=".8" fill="currentColor" stroke="none"/></>;
const field: Drawing = () => <><path d="M3 8c5-3 13-3 18 0v10c-5 3-13 3-18 0z"/><path d="M3 13c5 3 13 3 18 0M12 5v16"/></>;
const rocks: Drawing = () => <><path d="m4 17 3-8 4 8zm8 1 3-12 5 12z"/><path d="M3 21h18"/></>;
const droplet: Drawing = () => <><path d="M12 2s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12z"/><circle cx="10" cy="13" r="1"/><circle cx="14" cy="16" r="1"/></>;
const arrows: Drawing = () => <><path d="M4 8h13m-3-3 3 3-3 3M20 16H7m3-3-3 3 3 3"/></>;
const clock: Drawing = () => <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>;
const dice: Drawing = () => <><rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="8" cy="8" r="1" fill="currentColor" stroke="none"/><circle cx="16" cy="8" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="8" cy="16" r="1" fill="currentColor" stroke="none"/><circle cx="16" cy="16" r="1" fill="currentColor" stroke="none"/></>;
const layers: Drawing = () => <><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></>;

export const siteIconDrawings = {
  book,
  target,
  "team-selection": layers,
  "type-matchup": scale,
  "type-stab": target,
  "physical-special": swords,
  stats: chart,
  speed,
  ability: bolt,
  item: shield,
  status: alert,
  "stat-stage": chart,
  switch: arrows,
  roles: layers,
  matchup: scale,
  "win-condition": target,
  damage: swords,
  "critical-hit": target,
  "random-range": dice,
  "ko-count": heart,
  "move-power": swords,
  "speed-tie": clock,
  priority: layers,
  "priority-move": bolt,
  "speed-change": speed,
  "trick-room": clock,
  burn: flame,
  paralysis: bolt,
  poison: droplet,
  sleep: moon,
  setup: chart,
  weather,
  "weather-sun": sun,
  "weather-rain": cloudRain,
  "weather-sand": wind,
  "weather-snow": snow,
  terrain: field,
  "stealth-rock": rocks,
  "hp-parity": heart,
  substitute: shield,
  recovery: heart,
  cycle,
  "setup-opportunity": chart,
  "coverage-path": arrows,
  terms: chat,
} as const satisfies Record<string, Drawing>;

export type SiteIconName = keyof typeof siteIconDrawings;
export const siteIconNames = Object.freeze(Object.keys(siteIconDrawings) as SiteIconName[]);

export function SiteIcon({ name, title, ...props }: { name: SiteIconName; title?: string } & Omit<SVGProps<SVGSVGElement>, "name">) {
  const Drawing = siteIconDrawings[name];
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden={title ? undefined : true} role={title ? "img" : undefined} {...props}>
    {title ? <title>{title}</title> : null}
    <Drawing />
  </svg>;
}
