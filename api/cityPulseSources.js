export const CITY_PULSE_SOURCES = [
  // Public safety / consumer alerts (UOKiK RSS)
  {
    id: 'uokik-news',
    name: 'UOKiK Aktualności i wydarzenia',
    format: 'rss',
    url: 'https://uokik.gov.pl/feed',
    scope: 'city',
    type: 'update',
    category: 'public-safety',
    link_text: 'UOKiK',
    mapItem: (item) => ({
      title: item.title || '',
      message: item.message || item.description || '',
      link_url: item.link_url || item.link || '',
    }),
  },
  {
    id: 'uokik-dangerous-products',
    name: 'UOKiK – Produkty niebezpieczne',
    format: 'rss',
    url: 'https://uokik.gov.pl/feed/category/12',
    scope: 'city',
    type: 'warning',
    category: 'public-safety',
    link_text: 'UOKiK',
    mapItem: (item) => ({
      title: item.title || '',
      message: item.message || item.description || '',
      link_url: item.link_url || item.link || '',
    }),
  },

  // Warsaw transport (API requires key)
  {
    id: 'warsaw-transport-vehicles',
    name: 'Warsaw – Public transport vehicles',
    format: 'json',
    url: 'https://api.um.warszawa.pl/api/action/datastore_search?resource_id=2c90544f-e4fc-4ee8-9feb-6cfd3f7e189d&limit=5',
    requiresKey: true,
    scope: 'city',
    type: 'update',
    category: 'transport',
    link_text: 'Open Data Warsaw',
    mapItems: (json) => json?.result?.records || [],
    mapItem: (item) => ({
      title: `Transport update: ${item?.Lines || item?.Line || 'Vehicle activity'}`,
      message: `Vehicle ${item?.VehicleNumber || item?.Vehicle || '—'} · ${item?.Brigade || '—'} · ${item?.Time || ''}`.trim(),
      link_url: 'https://api.um.warszawa.pl/',
    }),
  },

  // TODO: Add immigration/legal updates feed (UdSC RSS or official feed)
  // {
  //   id: 'udsc-news',
  //   name: 'UdSC Aktualności',
  //   format: 'rss',
  //   url: 'https://.../rss',
  //   scope: 'city',
  //   type: 'update',
  //   category: 'immigration',
  //   link_text: 'UdSC',
  // }

  // Warsaw culture/events (API requires key)
  {
    id: 'warsaw-events',
    name: 'Warsaw – Events calendar',
    format: 'json',
    url: 'https://api.um.warszawa.pl/api/action/datastore_search?resource_id=fbf95b7b-ff95-48bc-afda-a16e968cc9a6&limit=5',
    requiresKey: true,
    scope: 'city',
    type: 'event',
    category: 'events',
    link_text: 'Open Data Warsaw',
    mapItems: (json) => json?.result?.records || [],
    mapItem: (item) => ({
      title: item?.Nazwa || item?.Name || 'City event',
      message: `${item?.Adres || item?.Address || ''} ${item?.Data || item?.Date || ''}`.trim(),
      link_url: item?.WWW || item?.Website || 'https://api.um.warszawa.pl/',
    }),
  },

  // TODO: Add weather warnings feed (must be commercial-use licensed)
]
