import { Link } from 'react-router-dom'
import { useState } from 'react'
import Icon from '../components/Icon'

function GettingAround() {
  const [activeCategory, setActiveCategory] = useState(null)

  const categories = [
    {
      id: 'public-transport',
      icon: 'map',
      title: 'Public Transport Basics',
      shortDesc: 'Metro, trams, buses - how it all works',
      lastUpdated: 'Jan 2025',
      content: {
        whatIsIt: 'Polish cities have excellent public transport. Warsaw has metro, trams, and buses in one system (ZTM). Krakow, Wroclaw, Gdansk, and other cities have trams and buses. It is cheap, reliable, and covers most areas you will need.',
        whyItMatters: 'Public transport is often faster than driving in city centers and much cheaper than taxis. Understanding the system saves money and stress. Ticket inspectors are active, and no valid ticket means a fine.',
        steps: [
          {
            step: 1,
            title: 'Understand your city system',
            details: 'Warsaw: ZTM runs metro (2 lines), trams, and buses. One ticket works on all. Krakow: MPK runs trams and buses. Wroclaw: MPK. Gdansk/Gdynia/Sopot: ZTM Trojmiasto covers the tri-city area.'
          },
          {
            step: 2,
            title: 'Get the right ticket',
            details: 'Options: single ride (20 min, 75 min), 24-hour, 3-day, monthly passes. Warsaw monthly is about 110 PLN for zones 1-2. Buy at machines, kiosks (Zabka, Relay), or via apps.'
          },
          {
            step: 3,
            title: 'Validate your ticket',
            details: 'Paper tickets must be validated in the yellow machines when you board. App tickets validate automatically when purchased.'
          },
          {
            step: 4,
            title: 'Know the zones',
            details: 'Most cities have Zone 1 (center) and Zone 2 (suburbs). Your ticket must cover the zones you travel through.'
          }
        ],
        whatNext: 'Get a monthly pass if you will use transport regularly - it pays off after about 35 single rides. Consider the Warsaw City Card if you also visit museums. Register your pass online to block it if lost.',
        proTips: [
          'Jakdojade shows real-time arrivals and plans routes well',
          'Night buses (marked N) run after regular service ends',
          'First/last metro times are about 5:00 AM to midnight',
          'Ticket inspectors work in plain clothes',
          'Monthly passes are cheaper if bought by the 10th'
        ],
        sources: [
          { name: 'ZTM Warsaw', url: 'https://www.ztm.waw.pl' },
          { name: 'Jakdojade App', url: 'https://jakdojade.pl' },
          { name: 'MPK Krakow', url: 'https://mpk.krakow.pl' }
        ]
      }
    },
    {
      id: 'transport-apps',
      icon: 'phone',
      title: 'Transport Apps',
      shortDesc: 'Essential apps for getting around Poland',
      lastUpdated: 'Jan 2025',
      featured: true,
      content: {
        whatIsIt: 'Poland has great transport apps that make life easier. From buying tickets to planning routes to booking rides, there is an app for everything. Most work in English and accept international cards.',
        whyItMatters: 'Having the right apps means no fumbling for cash, no missed connections, and no surprises. You can plan, pay, and track everything from your phone.',
        steps: [
          {
            step: 1,
            title: 'Download Jakdojade',
            details: 'Best route planner for Polish cities. Real-time arrivals, delay alerts, and tickets inside the app.'
          },
          {
            step: 2,
            title: 'Get ride-hailing apps',
            details: 'Uber works everywhere. Bolt is often cheaper. FreeNow also operates. Download at least two to compare prices.'
          },
          {
            step: 3,
            title: 'Install city apps',
            details: 'Warsaw: mPay or SkyCash for parking. Veturilo for city bikes. Most cities have official transport apps too.'
          },
          {
            step: 4,
            title: 'Long-distance travel apps',
            details: 'PKP Intercity app for trains, e-podroznik.pl for all operators, and Koleo for train options.'
          }
        ],
        whatNext: 'Set up payment methods in all apps before you need them. Enable notifications for your regular routes.',
        proTips: [
          'Jakdojade tickets work as proof - no paper needed',
          'Bolt often has promo codes for new users',
          'Train tickets are cheaper 30 days in advance',
          'Google Maps works, but Jakdojade is more accurate',
          'Prices spike during rain and rush hour - check both apps'
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
      icon: 'ticket',
      title: 'Tickets and Fines',
      shortDesc: 'Do not get caught - ticket rules and penalties',
      lastUpdated: 'Jan 2025',
      isWarning: true,
      content: {
        whatIsIt: 'Ticket inspectors regularly check passengers on public transport. They work in plain clothes and can check your ticket at any time. No valid ticket means a fine on the spot.',
        whyItMatters: 'Fines are hefty: 280+ PLN for no ticket or invalid ticket. Inspectors do not accept excuses. Getting this wrong is an expensive lesson.',
        steps: [
          {
            step: 1,
            title: 'Always have a valid ticket',
            details: 'Buy before boarding or immediately via app. Paper tickets must be validated.'
          },
          {
            step: 2,
            title: 'Know what inspectors can do',
            details: 'They can ask for ID and ticket and issue fines on the spot. Police can be called if you refuse to cooperate.'
          },
          {
            step: 3,
            title: 'If you get fined',
            details: 'Pay within 7 days for reduced rate. After 7 days, full rate applies.'
          },
          {
            step: 4,
            title: 'Avoid common mistakes',
            details: 'Unvalidated paper ticket, expired ticket, wrong zone, or dead phone battery can all lead to a fine.'
          }
        ],
        whatNext: 'Get a monthly pass if you travel regularly. Use app tickets when possible. Keep receipts for 90 days.',
        proTips: [
          'Inspectors often board at popular stops, but can appear anywhere',
          'They wear civilian clothes and must show ID',
          'Screenshot your app ticket immediately after purchase',
          'Student discounts require a valid student ID',
          'Tourist status does not reduce fines'
        ],
        sources: [
          { name: 'ZTM Warsaw Fines', url: 'https://www.ztm.waw.pl/en/' },
          { name: 'Passenger Rights Poland', url: 'https://www.gov.pl' }
        ]
      }
    },
    {
      id: 'driving-license',
      icon: 'car',
      title: 'Driving in Poland',
      shortDesc: 'License rules, exchanging permits, and road tips',
      lastUpdated: 'Jan 2025',
      content: {
        whatIsIt: 'Poland recognizes EU driving licenses indefinitely. Non-EU licenses are valid for 6 months after establishing residence, then you must exchange or get a Polish license. Driving rules are similar to other European countries.',
        whyItMatters: 'Driving without a valid license is a serious offense. Understanding when your foreign license expires prevents legal problems.',
        steps: [
          {
            step: 1,
            title: 'Check your license validity',
            details: 'EU/EEA license: valid indefinitely. UK (post-Brexit): valid 6 months after residency. US and other: valid 6 months, then must exchange.'
          },
          {
            step: 2,
            title: 'Exchange if required',
            details: 'Apply at your local Urzad Miasta/Gminy. Need: application form, current license, photos, proof of residence, medical certificate (for some categories). Fee: about 100 PLN. Processing: 2-4 weeks.'
          },
          {
            step: 3,
            title: 'Know the rules',
            details: 'Speed limits: 50 km/h urban, 90 km/h rural, 120 km/h expressways, 140 km/h highways. Headlights must be on 24/7. Blood alcohol limit: 0.02%.'
          },
          {
            step: 4,
            title: 'Handle parking',
            details: 'Paid parking zones in city centers, typically 8:00-20:00. Pay via machines or apps (mPay, SkyCash).'
          }
        ],
        whatNext: 'If you need to exchange your license, start early. Consider if you actually need a car - public transport plus occasional ride-hailing can be cheaper.',
        proTips: [
          'Speed cameras are common - the Yanosik app can warn you',
          'Right turns on red are not allowed unless signed',
          'Trams always have priority - never block tram tracks',
          'Winter tires are not legally required but recommended',
          'Police checks are common near holidays'
        ],
        sources: [
          { name: 'Gov.pl Driving License', url: 'https://www.gov.pl/web/gov/wymien-zagraniczne-prawo-jazdy' },
          { name: 'Polish Road Code', url: 'https://www.prawojazdy.com.pl' }
        ]
      }
    },
    {
      id: 'trains-intercity',
      icon: 'train',
      title: 'Trains and Intercity Travel',
      shortDesc: 'PKP trains, booking, and tips for longer trips',
      lastUpdated: 'Jan 2025',
      content: {
        whatIsIt: 'Poland has an extensive rail network operated mainly by PKP Intercity (long-distance) and regional carriers. Trains connect all major cities.',
        whyItMatters: 'Trains are often faster than driving between cities. Warsaw-Krakow is about 2.5 hours by Pendolino. Prices are reasonable, especially if booked early.',
        steps: [
          {
            step: 1,
            title: 'Know the train types',
            details: 'EIP (Pendolino): fastest, most expensive, reservation required. EIC/IC: fast, comfortable. TLK: slower but cheaper. Regional: local routes, very cheap.'
          },
          {
            step: 2,
            title: 'Book tickets',
            details: 'Best: PKP Intercity app or intercity.pl. Also: e-podroznik.pl and Koleo. Book 30 days ahead for cheaper prices.'
          },
          {
            step: 3,
            title: 'Choose the right ticket',
            details: 'Normal is full price. Promo is advance discount (non-refundable). Students get 51% off with valid ID.'
          },
          {
            step: 4,
            title: 'Navigate stations',
            details: 'Glowny means main station. Platforms are numbered. Check departure boards for platform number.'
          }
        ],
        whatNext: 'Sign up for PKP Intercity newsletters for flash sales. Check platform number close to departure - it can change.',
        proTips: [
          'Pendolino tickets bought 30 days early can be much cheaper',
          'First class is often only 20-30 PLN more',
          'Quiet cars exist on Pendolino - no phone calls allowed',
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
      icon: 'bike',
      title: 'Bikes and Scooters',
      shortDesc: 'City bikes, scooters, and micro-mobility',
      lastUpdated: 'Jan 2025',
      content: {
        whatIsIt: 'Polish cities have embraced micro-mobility. City bike systems, e-scooter rentals, and growing cycling infrastructure make two-wheeled transport a viable option.',
        whyItMatters: 'Bikes and scooters are often the fastest way to move in the center, especially in good weather. They are also affordable for short distances.',
        steps: [
          {
            step: 1,
            title: 'City bikes',
            details: 'Warsaw: Veturilo - register online, first 20 minutes free, then 1-4 PLN per 20 minutes.'
          },
          {
            step: 2,
            title: 'Scooter apps',
            details: 'Bolt, Lime, and Tier are common. Scan, unlock, and pay by the minute.'
          },
          {
            step: 3,
            title: 'Know the rules',
            details: 'Scooters should be ridden in bike lanes when available. Sidewalk riding is restricted and can lead to fines.'
          },
          {
            step: 4,
            title: 'Stay safe',
            details: 'Wear a helmet if possible and use lights at night. Follow traffic rules - police do check.'
          }
        ],
        whatNext: 'Download the city bike app before spring. Check local rules for where scooters can be parked.',
        proTips: [
          'City bikes are easiest to grab in the morning',
          'Scooters get expensive for long trips - compare with metro',
          'Use lights at night - police enforce this',
          'Lock your bike properly in busy areas',
          'Avoid riding in heavy snow or ice'
        ],
        sources: [
          { name: 'Veturilo', url: 'https://www.veturilo.waw.pl' },
          { name: 'Bolt Scooters', url: 'https://bolt.eu' },
          { name: 'Lime', url: 'https://www.li.me' }
        ]
      }
    }
  ]

  const activeContent = categories.find(c => c.id === activeCategory)

  return (
    <div className="min-h-screen space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <Icon name="arrowLeft" size={16} />
        Back to Home
      </Link>

      {!activeCategory ? (
        <>
          <header className="glass-panel rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="glass-panel flex h-12 w-12 items-center justify-center rounded-2xl">
                <Icon name="train" size={22} className="text-slate-100" />
              </div>
              <h1 className="text-3xl font-semibold text-white">Getting Around</h1>
            </div>
            <p className="text-slate-400 text-lg">
              Transport, tickets, trains, and everything you need to move around Poland.
            </p>
          </header>

          <div className="glass-strong rounded-3xl p-6">
            <div className="flex items-start gap-4">
              <div className="glass-panel flex h-12 w-12 items-center justify-center rounded-2xl">
                <Icon name="phone" size={20} className="text-slate-100" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-white">Essential Apps</h3>
                  <span className="glass-chip text-xs px-2 py-0.5 rounded-full text-slate-100">Download First</span>
                </div>
                <p className="text-slate-300 text-sm mb-3">
                  Get these before you need them: Jakdojade for routes and tickets, Bolt/Uber for rides, PKP Intercity for trains.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="glass-chip text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Icon name="map" size={12} className="text-slate-200" /> Jakdojade
                  </span>
                  <span className="glass-chip text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Icon name="bolt" size={12} className="text-slate-200" /> Bolt
                  </span>
                  <span className="glass-chip text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Icon name="train" size={12} className="text-slate-200" /> PKP
                  </span>
                  <span className="glass-chip text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Icon name="cart" size={12} className="text-slate-200" /> mPay
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-red-500/30">
            <div className="flex items-start gap-4">
              <div className="glass-panel flex h-10 w-10 items-center justify-center rounded-xl">
                <Icon name="warning" size={18} className="text-red-200" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-200 mb-1">Ticket Inspectors Are Active</h3>
                <p className="text-slate-300 text-sm">
                  No valid ticket means a fine. Always validate paper tickets or use app tickets.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full text-left glass-panel hover-tilt rounded-2xl p-5 transition-all ${
                  category.isWarning
                    ? 'border border-red-500/30'
                    : category.featured
                    ? 'border border-emerald-400/30'
                    : 'border border-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="glass-panel flex h-12 w-12 items-center justify-center rounded-2xl">
                    <Icon name={category.icon} size={20} className="text-slate-100" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-white group-hover:text-slate-100">
                        {category.title}
                      </h3>
                      {category.isWarning && (
                        <span className="glass-chip text-xs px-2 py-0.5 rounded-full text-red-100">Know This</span>
                      )}
                      {category.featured && (
                        <span className="glass-chip text-xs px-2 py-0.5 rounded-full text-emerald-100">Essential</span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm">{category.shortDesc}</p>
                  </div>
                  <div className="text-right">
                    <Icon name="arrowRight" size={16} className="text-slate-400" />
                    <p className="text-xs text-slate-500 mt-1">Updated {category.lastUpdated}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Coming Soon</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="glass-panel flex h-10 w-10 items-center justify-center rounded-xl">
                  <Icon name="map" size={18} className="text-slate-100" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Interactive Transport Map</h4>
                  <p className="text-slate-400 text-sm">Live metro, tram, and bus locations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="glass-panel flex h-10 w-10 items-center justify-center rounded-xl">
                  <Icon name="document" size={18} className="text-slate-100" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Ticket Price Calculator</h4>
                  <p className="text-slate-400 text-sm">Find the cheapest option for your travel pattern</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <article className="space-y-8">
          <header className="glass-panel rounded-3xl p-6">
            <button
              onClick={() => setActiveCategory(null)}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors"
            >
              <Icon name="arrowLeft" size={16} />
              Back to Getting Around
            </button>
            <div className="flex items-center gap-3">
              <div className="glass-panel flex h-12 w-12 items-center justify-center rounded-2xl">
                <Icon name={activeContent.icon} size={22} className="text-slate-100" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-semibold text-white">{activeContent.title}</h1>
                  {activeContent.isWarning && (
                    <span className="glass-chip text-xs px-2 py-0.5 rounded-full text-red-100">Know This</span>
                  )}
                </div>
                <p className="text-slate-400 text-sm">Last updated: {activeContent.lastUpdated}</p>
              </div>
            </div>
          </header>

          <section className="glass-panel rounded-2xl p-5">
            <h2 className={`text-xl font-semibold mb-3 ${activeContent.isWarning ? 'text-red-200' : 'text-slate-100'}`}>What is it?</h2>
            <p className="text-slate-300 leading-relaxed">{activeContent.content.whatIsIt}</p>
          </section>

          <section className="glass-panel rounded-2xl p-5">
            <h2 className={`text-xl font-semibold mb-3 ${activeContent.isWarning ? 'text-red-200' : 'text-slate-100'}`}>Why it matters</h2>
            <p className="text-slate-300 leading-relaxed">{activeContent.content.whyItMatters}</p>
          </section>

          <section className="glass-panel rounded-2xl p-5">
            <h2 className={`text-xl font-semibold mb-3 ${activeContent.isWarning ? 'text-red-200' : 'text-slate-100'}`}>How to do it</h2>
            <div className="space-y-4">
              {activeContent.content.steps.map((step) => (
                <div key={step.step} className="glass-chip rounded-lg p-4">
                  <div className="flex gap-4">
                    <span className={`w-8 h-8 ${activeContent.isWarning ? 'bg-red-500/70' : 'bg-slate-600/60'} text-white rounded-full flex items-center justify-center font-bold text-sm`}>
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

          <section className="glass-panel rounded-2xl p-5">
            <h2 className={`text-xl font-semibold mb-3 ${activeContent.isWarning ? 'text-red-200' : 'text-slate-100'}`}>What to do next</h2>
            <p className="text-slate-300 leading-relaxed">{activeContent.content.whatNext}</p>
          </section>

          <section className="glass-panel rounded-2xl p-5">
            <h2 className={`text-xl font-semibold mb-3 ${activeContent.isWarning ? 'text-red-200' : 'text-slate-100'}`}>Pro Tips</h2>
            <ul className="space-y-2">
              {activeContent.content.proTips.map((tip, index) => (
                <li key={index} className="flex gap-2 text-slate-300">
                  <Icon name={activeContent.isWarning ? 'warning' : 'spark'} size={14} className="text-slate-400" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-panel rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-slate-400 mb-3">Sources and official links</h2>
            <div className="flex flex-wrap gap-3">
              {activeContent.content.sources.map((source, index) => (
                <a
                  key={index}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-200 hover:text-white underline"
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
