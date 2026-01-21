import { Link } from 'react-router-dom'
import { useState } from 'react'

function GettingAround() {
  const [activeCategory, setActiveCategory] = useState(null)

  const categories = [
    {
      id: 'public-transport',
      icon: '🚇',
      title: 'Public Transport Basics',
      shortDesc: 'Metro, trams, buses - how it all works',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'Polish cities have excellent public transport. Warsaw has metro, trams, and buses all integrated into one system (ZTM). Kraków, Wrocław, Gdańsk, and other cities have trams and buses. It\'s cheap, reliable, and covers most areas you\'ll need.',
        whyItMatters: 'Public transport is often faster than driving in city centers, and way cheaper than taxis. Understanding the system saves you money and stress. Plus, ticket inspectors (kontrolerzy) are active - getting caught without a valid ticket means a 280+ PLN fine.',
        steps: [
          {
            step: 1,
            title: 'Understand your city\'s system',
            details: 'Warsaw: ZTM runs metro (2 lines), trams, and buses. One ticket works on all. Kraków: MPK runs trams and buses. Wrocław: MPK. Gdańsk/Gdynia/Sopot: ZTM Trójmiasto covers the tri-city area.'
          },
          {
            step: 2,
            title: 'Get the right ticket',
            details: 'Options: Single ride (20 min, 75 min), 24-hour, 3-day, monthly passes. Warsaw monthly is ~110 PLN for zones 1-2. Buy at machines (at stops/stations), kiosks (Żabka, Relay), or via apps.'
          },
          {
            step: 3,
            title: 'Validate your ticket',
            details: 'Paper tickets MUST be validated in the yellow machines when you board. The timestamp starts your time window. Unvalidated ticket = no ticket = fine. App tickets validate automatically when purchased.'
          },
          {
            step: 4,
            title: 'Know the zones',
            details: 'Most cities have Zone 1 (city center) and Zone 2 (suburbs). Your ticket must cover the zones you travel through. Warsaw airport (Chopin) is Zone 1. Modlin airport needs a separate ticket.'
          }
        ],
        whatNext: 'Get a monthly pass if you\'ll use transport regularly - it pays off after ~35 single rides. Consider the Warsaw City Card if you\'re also visiting museums. Register your pass online to block it if lost.',
        proTips: [
          'Apps like Jakdojade show real-time arrivals and plan routes perfectly',
          'Night buses (marked "N") run after regular service ends - different routes',
          'First/last metro times: ~5:00 AM to ~midnight (varies by line)',
          'Ticket inspectors work in plain clothes - always have valid ticket ready',
          'Monthly passes are cheaper if bought by the 10th of the month'
        ],
        sources: [
          { name: 'ZTM Warsaw', url: 'https://www.ztm.waw.pl' },
          { name: 'Jakdojade App', url: 'https://jakdojade.pl' },
          { name: 'MPK Kraków', url: 'https://mpk.krakow.pl' }
        ]
      }
    },
    {
      id: 'transport-apps',
      icon: '📱',
      title: 'Transport Apps',
      shortDesc: 'Essential apps for getting around Poland',
      lastUpdated: 'January 2025',
      featured: true,
      content: {
        whatIsIt: 'Poland has great transport apps that make life easier. From buying tickets to planning routes to booking rides - there\'s an app for everything. Most work in English and accept international cards.',
        whyItMatters: 'Having the right apps means no fumbling for cash, no missed connections, and no surprises. You can plan, pay, and track everything from your phone. Essential for daily life.',
        steps: [
          {
            step: 1,
            title: 'Download Jakdojade (must-have)',
            details: 'Best route planner for all Polish cities. Real-time arrivals, delay alerts, and you can buy tickets directly in the app. Works offline for maps. Free with optional premium features.'
          },
          {
            step: 2,
            title: 'Get ride-hailing apps',
            details: 'Uber works everywhere. Bolt is often cheaper (popular in Poland). FreeNow also operates. All accept cards. Download at least two - compare prices, one might surge while other doesn\'t.'
          },
          {
            step: 3,
            title: 'Install city-specific apps',
            details: 'Warsaw: mPay or SkyCash for parking. Veturilo for city bikes. Kraków: Wavelo for bikes. Most cities have official transport apps too (ZTM Warsaw app, etc.).'
          },
          {
            step: 4,
            title: 'Long-distance travel apps',
            details: 'PKP Intercity app for trains (or e-podroznik.pl). Flixbus app for buses. PolskiBus (now Flixbus). Koleo app shows all train options. Book in advance for best prices.'
          }
        ],
        whatNext: 'Set up payment methods in all apps before you need them urgently. Enable notifications in Jakdojade for your regular routes to get delay alerts. Save your home and work addresses.',
        proTips: [
          'Jakdojade ticket purchases work as proof - no paper needed',
          'Bolt often has promo codes for new users - Google before signing up',
          'Train tickets are cheaper bought 30 days in advance on PKP app',
          'Google Maps works but Jakdojade is more accurate for Polish transit',
          'Uber/Bolt prices spike during rain and rush hour - check both apps'
        ],
        sources: [
          { name: 'Jakdojade', url: 'https://jakdojade.pl' },
          { name: 'Bolt', url: 'https://bolt.eu' },
          { name: 'PKP Intercity', url: 'https://www.intercity.pl' }
        ]
      }
    },
    {
      id: 'tickets-fines',
      icon: '🎫',
      title: 'Tickets & Fines',
      shortDesc: 'Don\'t get caught - ticket rules and penalties',
      lastUpdated: 'January 2025',
      isWarning: true,
      content: {
        whatIsIt: 'Ticket inspectors (kontrolerzy biletów) regularly check passengers on public transport. They work in plain clothes and can check your ticket at any time. No valid ticket = fine on the spot. The system relies on trust but enforces strictly.',
        whyItMatters: 'Fines are hefty: 280+ PLN for no ticket or invalid ticket. Inspectors don\'t accept excuses ("I didn\'t know", "machine was broken"). Ignorance isn\'t a defense. Getting this wrong is an expensive lesson.',
        steps: [
          {
            step: 1,
            title: 'Always have a valid ticket',
            details: 'Buy before boarding or immediately via app. Paper tickets must be validated. Time-based tickets must cover your entire journey. Keep your ticket until you exit the vehicle/station.'
          },
          {
            step: 2,
            title: 'Know what inspectors can do',
            details: 'They can ask for ID and ticket. They can issue fines on the spot. They can call police if you refuse to cooperate. They cannot physically detain you but police can. Stay calm and cooperate.'
          },
          {
            step: 3,
            title: 'If you get fined',
            details: 'You\'ll get a paper fine (mandat). Pay within 7 days for reduced rate (~200 PLN). After 7 days, full rate applies (~280 PLN). You can appeal but rarely successful without proof of valid ticket.'
          },
          {
            step: 4,
            title: 'Avoid common mistakes',
            details: 'Unvalidated paper ticket = invalid. Expired ticket = invalid. Wrong zone = invalid. Ticket on phone with dead battery = problem (screenshot beforehand). Student discounts need valid student ID shown.'
          }
        ],
        whatNext: 'Get a monthly pass if you travel regularly - no validation needed, just show it. Use app tickets when possible - they\'re timestamped automatically. Keep receipts/confirmations for 90 days.',
        proTips: [
          'Inspectors often board at popular stops - but can appear anywhere',
          'They wear civilian clothes but have ID badges they must show',
          'If your app crashes, screenshot your ticket immediately after purchase',
          'Student/senior discounts require showing valid ID - international student cards work',
          '"I\'m a tourist" doesn\'t reduce fines - rules apply to everyone'
        ],
        sources: [
          { name: 'ZTM Warsaw Fines', url: 'https://www.ztm.waw.pl/en/' },
          { name: 'Passenger Rights Poland', url: 'https://www.gov.pl' }
        ]
      }
    },
    {
      id: 'driving-license',
      icon: '🚗',
      title: 'Driving in Poland',
      shortDesc: 'License rules, exchanging permits, and road tips',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'Poland recognizes EU driving licenses indefinitely. Non-EU licenses are valid for 6 months after establishing residence, then you need to exchange or get a Polish license. Driving rules are similar to other European countries - drive on the right, speed limits in km/h.',
        whyItMatters: 'Driving without a valid license is a serious offense. Understanding when your foreign license expires and how to exchange it prevents legal problems. Polish roads are good but drivers can be aggressive - knowing local habits keeps you safe.',
        steps: [
          {
            step: 1,
            title: 'Check your license validity',
            details: 'EU/EEA license: Valid indefinitely in Poland. UK (post-Brexit): Valid 6 months after residency. US/other: Valid 6 months, then must exchange. International Driving Permit extends some licenses but check specifics.'
          },
          {
            step: 2,
            title: 'Exchange if required',
            details: 'Apply at your local Urząd Miasta/Gminy. Need: application form, current license, photos, proof of residence, medical certificate (for some categories). Fee: ~100 PLN. Processing: 2-4 weeks.'
          },
          {
            step: 3,
            title: 'Know the rules',
            details: 'Speed limits: 50 km/h urban (60 km/h at night), 90 km/h rural, 120 km/h expressways, 140 km/h highways. Headlights must be on 24/7. Zero tolerance for phone use. Blood alcohol limit: 0.02% (effectively zero).'
          },
          {
            step: 4,
            title: 'Handle parking',
            details: 'Paid parking zones in city centers (8:00-20:00 typically). Pay via machines or apps (mPay, SkyCash). Blue zones = residents only. Wheel clamps and towing are used. Fines: 50-500 PLN depending on violation.'
          }
        ],
        whatNext: 'If you need to exchange your license, start early - bureaucracy takes time. Consider if you actually need a car - public transport + occasional Uber might be cheaper and less hassle in major cities.',
        proTips: [
          'Radar speed cameras are everywhere - Yanosik app warns you (legal to use)',
          'Polish drivers flash headlights to warn of police ahead',
          'Right turns on red are NOT allowed unless signed',
          'Trams ALWAYS have priority - never block tram tracks',
          'Winter tires are not legally required but highly recommended Nov-Mar'
        ],
        sources: [
          { name: 'Gov.pl Driving License', url: 'https://www.gov.pl/web/gov/wymien-zagraniczne-prawo-jazdy' },
          { name: 'Polish Road Code', url: 'https://www.prawojazdy.com.pl' }
        ]
      }
    },
    {
      id: 'trains-intercity',
      icon: '🚄',
      title: 'Trains & Intercity Travel',
      shortDesc: 'PKP trains, booking, and tips for longer trips',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'Poland has an extensive rail network operated mainly by PKP Intercity (long-distance) and regional carriers. Trains connect all major cities. The Pendolino (EIP) is the fastest, followed by Express (EIC/IC), then TLK (cheaper, slower). Quality has improved dramatically.',
        whyItMatters: 'Trains are often faster than driving between cities (no traffic, parking hassle). Warsaw-Kraków is 2.5 hours by Pendolino. Prices are reasonable, especially if booked early. Understanding the system saves money and gets you better seats.',
        steps: [
          {
            step: 1,
            title: 'Know the train types',
            details: 'EIP (Pendolino): Fastest, most expensive, seat reservation required. EIC/IC: Fast, comfortable, reservation recommended. TLK: Slower but cheaper, no reservation needed. Regional (Regio/KM): Local routes, very cheap.'
          },
          {
            step: 2,
            title: 'Book tickets',
            details: 'Best: PKP Intercity app or intercity.pl (English available). Also: e-podroznik.pl for all operators, Koleo app. Book 30 days ahead for cheapest prices. Print ticket or show on phone.'
          },
          {
            step: 3,
            title: 'Choose the right ticket',
            details: 'Normal = full price. Promo = advance discount (non-refundable). Tani bilet = cheapest but very limited. Students get 51% off with valid ID. EU senior cards give discounts too.'
          },
          {
            step: 4,
            title: 'Navigate stations',
            details: 'Główny = main station. Platforms (perony) numbered. Check departure boards for platform number. Arrive 15-20 min early for Pendolino. Stations have shops, food, and luggage storage.'
          }
        ],
        whatNext: 'Sign up for PKP Intercity newsletter for flash sales. Check platform number close to departure - it can change. For Warsaw, know the difference between Warszawa Centralna and Warszawa Zachodnia stations.',
        proTips: [
          'Pendolino tickets bought 30 days early can be 50% cheaper',
          'First class is often only 20-30 PLN more - worth it for long trips',
          'Quiet cars (wagon cichy) exist on Pendolino - no phone calls allowed',
          'WiFi on trains is often slow - download content beforehand',
          'Delays are tracked in apps - check before heading to station'
        ],
        sources: [
          { name: 'PKP Intercity', url: 'https://www.intercity.pl/en' },
          { name: 'e-podroznik.pl', url: 'https://www.e-podroznik.pl' },
          { name: 'Koleo App', url: 'https://koleo.pl' }
        ]
      }
    },
    {
      id: 'bikes-scooters',
      icon: '🚲',
      title: 'Bikes & Scooters',
      shortDesc: 'City bikes, e-scooters, and rental options',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'Polish cities have embraced micro-mobility. City bike systems (Veturilo in Warsaw, Wavelo in Kraków), e-scooter rentals (Bolt, Lime, Tier), and growing cycling infrastructure make two-wheeled transport a viable option, especially in good weather.',
        whyItMatters: 'Bikes and scooters can be faster than public transport for short trips, especially during rush hour. City bikes are very cheap (often first 20 min free). Good for health, environment, and avoiding crowded trams.',
        steps: [
          {
            step: 1,
            title: 'Try city bikes',
            details: 'Warsaw: Veturilo - register online, first 20 min free, then 1-4 PLN per 20 min. Stations everywhere. Kraków: Wavelo - similar system. Download the app, add payment method, find nearest station, unlock bike.'
          },
          {
            step: 2,
            title: 'Use e-scooter apps',
            details: 'Bolt, Lime, Tier all operate in Polish cities. Download app, scan QR code on scooter, ride. End trip in allowed zone. Prices: ~2.50 PLN to start + 0.50-0.70 PLN per minute. Park responsibly.'
          },
          {
            step: 3,
            title: 'Know the rules',
            details: 'Bikes: Use bike lanes where available, otherwise road. Lights required after dark. E-scooters: Max 20 km/h, ride in bike lanes or road (not sidewalk since 2021), no passengers, helmet recommended.'
          },
          {
            step: 4,
            title: 'Stay safe',
            details: 'Polish drivers aren\'t always bike-aware. Use dedicated lanes. Watch for tram tracks (cross at angle to avoid getting stuck). Lock personal bikes very securely - theft happens. Helmet always recommended.'
          }
        ],
        whatNext: 'For regular use, consider buying a used bike (OLX.pl, Facebook Marketplace). Good bikes start around 500 PLN. Register it and get a strong lock. Some employers offer bike subsidies or storage.',
        proTips: [
          'Veturilo first 20 min is free - perfect for short hops',
          'E-scooters often have promo codes for first ride - check online',
          'Cycling paths along Vistula river are great for recreation',
          'Winter cycling is possible but be careful on icy paths',
          'Download multiple scooter apps - sometimes one brand isn\'t nearby'
        ],
        sources: [
          { name: 'Veturilo Warsaw', url: 'https://www.veturilo.waw.pl' },
          { name: 'Bolt Scooters', url: 'https://bolt.eu/en/scooters/' },
          { name: 'Warsaw Bike Map', url: 'https://mapa.um.warszawa.pl' }
        ]
      }
    }
  ]

  const activeContent = categories.find(c => c.id === activeCategory)

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        ← Back to Home
      </Link>

      {!activeCategory ? (
        <>
          {/* Section Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🚇</span>
              <h1 className="text-3xl font-bold text-white">Getting Around</h1>
            </div>
            <p className="text-slate-400 text-lg">
              Transport, tickets, trains, and everything you need to move around Poland.
            </p>
          </header>

          {/* Apps Promo Card */}
          <div className="bg-gradient-to-r from-green-900/40 to-teal-900/40 border border-green-700/50 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl">📱</span>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-white">Essential Apps</h3>
                  <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">Download First</span>
                </div>
                <p className="text-slate-300 text-sm mb-3">
                  Get these before you need them: Jakdojade for routes & tickets, Bolt/Uber for rides, PKP Intercity for trains.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-green-900/50 text-green-300 px-2 py-1 rounded">🗺️ Jakdojade</span>
                  <span className="text-xs bg-green-900/50 text-green-300 px-2 py-1 rounded">🚕 Bolt</span>
                  <span className="text-xs bg-green-900/50 text-green-300 px-2 py-1 rounded">🚄 PKP</span>
                  <span className="text-xs bg-green-900/50 text-green-300 px-2 py-1 rounded">🅿️ mPay</span>
                </div>
              </div>
            </div>
          </div>

          {/* Fine Warning */}
          <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-5 mb-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="text-lg font-semibold text-red-400 mb-1">Ticket Inspectors Are Active</h3>
                <p className="text-slate-300 text-sm">
                  No valid ticket = 280+ PLN fine. No excuses accepted. Always validate paper tickets or use app tickets. Inspectors wear plain clothes.
                </p>
              </div>
            </div>
          </div>

          {/* Category List */}
          <div className="space-y-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full text-left bg-slate-800 hover:bg-slate-750 border rounded-xl p-5 transition-all group ${
                  category.isWarning 
                    ? 'border-red-700/50 hover:border-red-600' 
                    : category.featured 
                    ? 'border-green-700/50 hover:border-green-600'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{category.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {category.title}
                      </h3>
                      {category.isWarning && (
                        <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">Know This</span>
                      )}
                      {category.featured && (
                        <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">Essential</span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm">{category.shortDesc}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 group-hover:text-slate-300 transition-colors">→</span>
                    <p className="text-xs text-slate-500 mt-1">Updated {category.lastUpdated}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Coming Soon */}
          <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Coming Soon</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">🗺️</span>
                <div>
                  <h4 className="font-medium text-white">Interactive Transport Map</h4>
                  <p className="text-slate-400 text-sm">Live metro, tram, and bus locations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">💰</span>
                <div>
                  <h4 className="font-medium text-white">Ticket Price Calculator</h4>
                  <p className="text-slate-400 text-sm">Find the cheapest option for your travel pattern</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Detailed Guide View */
        <article>
          {/* Guide Header */}
          <header className="mb-8">
            <button 
              onClick={() => setActiveCategory(null)}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors"
            >
              ← Back to Getting Around
            </button>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{activeContent.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold text-white">{activeContent.title}</h1>
                  {activeContent.isWarning && (
                    <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">Know This</span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-slate-400">Last updated: {activeContent.lastUpdated}</p>
          </header>

          {/* What Is It */}
          <section className="mb-8">
            <h2 className={`text-xl font-semibold mb-3 ${activeContent.isWarning ? 'text-red-400' : 'text-emerald-400'}`}>What is it?</h2>
            <p className="text-slate-300 leading-relaxed">{activeContent.content.whatIsIt}</p>
          </section>

          {/* Why It Matters */}
          <section className="mb-8">
            <h2 className={`text-xl font-semibold mb-3 ${activeContent.isWarning ? 'text-red-400' : 'text-emerald-400'}`}>Why it matters</h2>
            <p className="text-slate-300 leading-relaxed">{activeContent.content.whyItMatters}</p>
          </section>

          {/* How To Do It */}
          <section className="mb-8">
            <h2 className={`text-xl font-semibold mb-3 ${activeContent.isWarning ? 'text-red-400' : 'text-emerald-400'}`}>How to do it</h2>
            <div className="space-y-4">
              {activeContent.content.steps.map((step) => (
                <div key={step.step} className={`bg-slate-800 border rounded-lg p-4 ${
                  activeContent.isWarning ? 'border-red-700/50' : 'border-slate-700'
                }`}>
                  <div className="flex gap-4">
                    <span className={`w-8 h-8 ${
                      activeContent.isWarning ? 'bg-red-600' : 'bg-emerald-600'
                    } text-white rounded-full flex items-center justify-center font-bold text-sm`}>
                      {step.step}
                    </span>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{step.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{step.details}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* What Next */}
          <section className="mb-8">
            <h2 className={`text-xl font-semibold mb-3 ${activeContent.isWarning ? 'text-red-400' : 'text-emerald-400'}`}>What to do next</h2>
            <div className={`bg-slate-800 border rounded-lg p-4 ${
              activeContent.isWarning ? 'border-red-700/50' : 'border-emerald-700/50'
            }`}>
              <p className="text-slate-300 leading-relaxed">{activeContent.content.whatNext}</p>
            </div>
          </section>

          {/* Pro Tips */}
          <section className="mb-8">
            <h2 className={`text-xl font-semibold mb-3 ${activeContent.isWarning ? 'text-red-400' : 'text-emerald-400'}`}>Pro Tips</h2>
            <ul className="space-y-2">
              {activeContent.content.proTips.map((tip, index) => (
                <li key={index} className="flex gap-2 text-slate-300">
                  <span className={activeContent.isWarning ? 'text-red-400' : 'text-emerald-400'}>•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Sources */}
          <section className="border-t border-slate-700 pt-6">
            <h2 className="text-sm font-semibold text-slate-500 mb-3">Sources and Official Links</h2>
            <div className="flex flex-wrap gap-3">
              {activeContent.content.sources.map((source, index) => (
                <a
                  key={index}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm underline ${
                    activeContent.isWarning 
                      ? 'text-red-400 hover:text-red-300' 
                      : 'text-emerald-400 hover:text-emerald-300'
                  }`}
                >
                  {source.name}
                </a>
              ))}
            </div>
          </section>
        </article>
      )}
    </div>
  )
}

export default GettingAround
