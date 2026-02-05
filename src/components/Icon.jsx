// src/components/Icon.jsx
// Minimal icon system (no emojis)

const ICONS = {
  home: {
    viewBox: '0 0 24 24',
    path: 'M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 19.5zM9 21v-6h6v6',
  },
  checklist: {
    viewBox: '0 0 24 24',
    path: 'M8 6h12M8 12h12M8 18h12M3 6l1.5 1.5L7 5M3 12l1.5 1.5L7 11M3 18l1.5 1.5L7 17',
  },
  search: {
    viewBox: '0 0 24 24',
    path: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm10 2-4.3-4.3',
  },
  community: {
    viewBox: '0 0 24 24',
    path: 'M7.5 14a4 4 0 1 1 7.9 1.2M4 21a6 6 0 0 1 12 0M16.5 6.5a3 3 0 1 1 4.5 2.7',
  },
  menu: {
    viewBox: '0 0 24 24',
    path: 'M4 7h16M4 12h16M4 17h16',
  },
  bell: {
    viewBox: '0 0 24 24',
    path: 'M6 17h12l-1.5-2.5V11a4.5 4.5 0 1 0-9 0v3.5zM9.5 19a2.5 2.5 0 0 0 5 0',
  },
  settings: {
    viewBox: '0 0 24 24',
    path: 'M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm8.5 3.5-2 .6a6.8 6.8 0 0 1-.8 1.9l1.1 1.8-1.7 1.7-1.8-1.1a6.8 6.8 0 0 1-1.9.8l-.6 2h-2.4l-.6-2a6.8 6.8 0 0 1-1.9-.8l-1.8 1.1-1.7-1.7 1.1-1.8a6.8 6.8 0 0 1-.8-1.9l-2-.6v-2.4l2-.6c.2-.7.4-1.3.8-1.9L3.8 7.5l1.7-1.7 1.8 1.1c.6-.3 1.2-.6 1.9-.8l.6-2h2.4l.6 2c.7.2 1.3.4 1.9.8l1.8-1.1 1.7 1.7-1.1 1.8c.3.6.6 1.2.8 1.9l2 .6z',
  },
  trophy: {
    viewBox: '0 0 24 24',
    path: 'M7 4h10v3a5 5 0 0 1-10 0V4zm-2 1h2v2a5 5 0 0 1-5-5h3zm14 0h2a5 5 0 0 1-5 5V5zm-7 10v3m-3 2h6',
  },
  shield: {
    viewBox: '0 0 24 24',
    path: 'M12 3 20 7v6c0 5-3.5 7.5-8 8-4.5-.5-8-3-8-8V7l8-4z',
  },
  logout: {
    viewBox: '0 0 24 24',
    path: 'M14 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2m7-5H9m8-4 4 4-4 4',
  },
  info: {
    viewBox: '0 0 24 24',
    path: 'M12 8h.01M11 12h1v5M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z',
  },
  warning: {
    viewBox: '0 0 24 24',
    path: 'M12 4 2 20h20L12 4zm0 6v4m0 4h.01',
  },
  success: {
    viewBox: '0 0 24 24',
    path: 'm5 13 4 4L19 7',
  },
  alert: {
    viewBox: '0 0 24 24',
    path: 'M12 2 2 12l10 10 10-10L12 2zm0 6v5m0 4h.01',
  },
  calendar: {
    viewBox: '0 0 24 24',
    path: 'M7 3v3M17 3v3M4 9h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z',
  },
  update: {
    viewBox: '0 0 24 24',
    path: 'M12 6v6l4 2M4 11a8 8 0 1 1 2.4 5.7M4 11V7m0 4h4',
  },
  pin: {
    viewBox: '0 0 24 24',
    path: 'M12 21s7-7 7-11a7 7 0 1 0-14 0c0 4 7 11 7 11zm0-9a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  },
  star: {
    viewBox: '0 0 24 24',
    path: 'm12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 18l-5.8 3.1 1.1-6.5L2.6 9.8l6.5-.9L12 3z',
  },
  starFill: {
    viewBox: '0 0 24 24',
    filled: true,
    path: 'm12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 18l-5.8 3.1 1.1-6.5L2.6 9.8l6.5-.9L12 3z',
  },
  arrowRight: {
    viewBox: '0 0 24 24',
    path: 'M5 12h14M13 5l7 7-7 7',
  },
  arrowLeft: {
    viewBox: '0 0 24 24',
    path: 'M19 12H5m6-7-7 7 7 7',
  },
  arrowUp: {
    viewBox: '0 0 24 24',
    path: 'M12 19V5m0 0 6 6m-6-6-6 6',
  },
  chevronDown: {
    viewBox: '0 0 24 24',
    path: 'm6 9 6 6 6-6',
  },
  close: {
    viewBox: '0 0 24 24',
    path: 'M18 6 6 18M6 6l12 12',
  },
  user: {
    viewBox: '0 0 24 24',
    path: 'M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-7 9a7 7 0 0 1 14 0',
  },
  bolt: {
    viewBox: '0 0 24 24',
    path: 'M13 2 4 14h6l-1 8 9-12h-6l1-8z',
  },
  train: {
    viewBox: '0 0 24 24',
    path: 'M5 3h14a2 2 0 0 1 2 2v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V5a2 2 0 0 1 2-2zm2 15-2 3m14-3 2 3M8 14h.01M16 14h.01M7 7h10v4H7z',
  },
  car: {
    viewBox: '0 0 24 24',
    path: 'M3 13l2-5h14l2 5v6a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1v-6zm3-5h12',
  },
  bike: {
    viewBox: '0 0 24 24',
    path: 'M5 18a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 14l4-6h4l2 4h-4l-2-3-3 5',
  },
  map: {
    viewBox: '0 0 24 24',
    path: 'M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6zm6-2v14m6-12v14',
  },
  ticket: {
    viewBox: '0 0 24 24',
    path: 'M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4V7zm8 0v10',
  },
  chat: {
    viewBox: '0 0 24 24',
    path: 'M4 5h16v10H7l-3 3V5z',
  },
  mic: {
    viewBox: '0 0 24 24',
    path: 'M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zm-5 9a5 5 0 0 0 10 0M12 21v-3',
  },
  book: {
    viewBox: '0 0 24 24',
    path: 'M4 6a2 2 0 0 1 2-2h6v16H6a2 2 0 0 1-2-2zM12 4h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6V4z',
  },
  chart: {
    viewBox: '0 0 24 24',
    path: 'M4 20V6m5 14V10m5 10V4m5 16v-6',
  },
  anchor: {
    viewBox: '0 0 24 24',
    path: 'M12 3v4m-3 0h6m-7 5a7 7 0 0 0 14 0m-7 0v9',
  },
  briefcase: {
    viewBox: '0 0 24 24',
    path: 'M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1m-9 4h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2zm5 2v2',
  },
  music: {
    viewBox: '0 0 24 24',
    path: 'M9 18a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 0V6l11-2v9a2.5 2.5 0 1 1-2-2.5 2.5 2.5 0 0 1 2.5 2.5',
  },
  graduation: {
    viewBox: '0 0 24 24',
    path: 'M12 3 2 8l10 5 10-5-10-5zm-7 8v4c0 2.5 3.5 4.5 7 4.5s7-2 7-4.5v-4',
  },
  gift: {
    viewBox: '0 0 24 24',
    path: 'M3 10h18v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10zm0 0h18V7a1 1 0 0 0-1-1h-3a3 3 0 0 1-6 0H7a3 3 0 0 1 0 6',
  },
  building: {
    viewBox: '0 0 24 24',
    path: 'M4 20h16M6 20V4h12v16M9 8h2M9 12h2M9 16h2M13 8h2M13 12h2M13 16h2',
  },
  utensils: {
    viewBox: '0 0 24 24',
    path: 'M4 3v8a3 3 0 0 0 3 3v7M8 3v8M14 3v18M18 3v7a3 3 0 0 1-3 3',
  },
  health: {
    viewBox: '0 0 24 24',
    path: 'M12 3v18M3 12h18M7 7h10v10H7z',
  },
  dumbbell: {
    viewBox: '0 0 24 24',
    path: 'M4 9v6M8 7v10M16 7v10M20 9v6M8 12h8',
  },
  tools: {
    viewBox: '0 0 24 24',
    path: 'M14 7a4 4 0 0 0 5 5l-7 7-4-4 7-7a4 4 0 0 0-1-1zM5 19l-2 2',
  },
  cart: {
    viewBox: '0 0 24 24',
    path: 'M6 6h14l-2 8H8L6 6zm2 11a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm8 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z',
  },
  globe: {
    viewBox: '0 0 24 24',
    path: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 0c3 3.5 3 14.5 0 20m0-20c-3 3.5-3 14.5 0 20m-8-10h16',
  },
  sun: {
    viewBox: '0 0 24 24',
    path: 'M12 4V2m0 20v-2m8-8h2M2 12h2m14.2 5.8 1.4 1.4M4.4 4.4 5.8 5.8m12.4-1.4-1.4 1.4M4.4 19.6l1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  },
  moon: {
    viewBox: '0 0 24 24',
    path: 'M21 14.5A9 9 0 1 1 9.5 3a7 7 0 0 0 11.5 11.5z',
  },
  cloud: {
    viewBox: '0 0 24 24',
    path: 'M6 18h11a4 4 0 0 0 0-8 5.5 5.5 0 0 0-10.6 1.6A3.5 3.5 0 0 0 6 18z',
  },
  rain: {
    viewBox: '0 0 24 24',
    path: 'M6 15h11a4 4 0 0 0 0-8 5.5 5.5 0 0 0-10.6 1.6A3.5 3.5 0 0 0 6 15zm2 4-1 3m5-3-1 3m5-3-1 3',
  },
  snow: {
    viewBox: '0 0 24 24',
    path: 'M12 2v20M4.5 6.5l15 11M19.5 6.5l-15 11M7 4l10 16M7 20l10-16',
  },
  storm: {
    viewBox: '0 0 24 24',
    path: 'M7 14h9a4 4 0 0 0 0-8 5 5 0 0 0-9.5 2A3.5 3.5 0 0 0 7 14zm4 2-2 6 5-6h-3l2-4',
  },
  mist: {
    viewBox: '0 0 24 24',
    path: 'M3 7h18M5 11h14M7 15h10M4 19h16',
  },
  document: {
    viewBox: '0 0 24 24',
    path: 'M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm7 0v5h5',
  },
  upload: {
    viewBox: '0 0 24 24',
    path: 'M12 16V4m0 0 4 4m-4-4-4 4M4 20h16',
  },
  download: {
    viewBox: '0 0 24 24',
    path: 'M12 4v12m0 0 4-4m-4 4-4-4M4 20h16',
  },
  crown: {
    viewBox: '0 0 24 24',
    path: 'M4 7 8.5 12 12 5l3.5 7L20 7l-2 10H6L4 7z',
  },
  spark: {
    viewBox: '0 0 24 24',
    path: 'm12 2 1.2 3.5L17 6.7l-3 2.2 1.2 3.6-3.2-2.2-3.2 2.2 1.2-3.6-3-2.2 3.8-1.2L12 2zM5 18l1 2 2-1-1-2-2 1zm12 1 2 1 1-2-2-1-1 2z',
  },
  phone: {
    viewBox: '0 0 24 24',
    path: 'M6 3h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z',
  },
  link: {
    viewBox: '0 0 24 24',
    path: 'M10 14a4 4 0 0 1 0-6l2-2a4 4 0 0 1 6 6l-1 1M14 10a4 4 0 0 1 0 6l-2 2a4 4 0 1 1-6-6l1-1',
  },
  heart: {
    viewBox: '0 0 24 24',
    path: 'M12 21s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z',
  },
  badge: {
    viewBox: '0 0 24 24',
    path: 'M12 2 8 4v6c0 5 4 8 4 8s4-3 4-8V4l-4-2zm-4 18-2 2m10-2 2 2',
  },
}

function Icon({ name, className = '', size = 20 }) {
  const icon = ICONS[name]
  if (!icon) return null
  const { viewBox, path, filled } = icon
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  )
}

export default Icon
