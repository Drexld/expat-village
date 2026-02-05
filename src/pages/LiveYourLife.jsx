import { Link } from 'react-router-dom'
import { useState } from 'react'
import Icon from '../components/Icon'

function LiveYourLife() {
  const [activeCategory, setActiveCategory] = useState(null)

  const categories = [
    {
      id: 'salons-barbers',
      icon: 'user',
      title: 'Salons and Barbers',
      shortDesc: 'English-speaking stylists and what to expect',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'Finding a good hairdresser or barber in Poland where you can communicate in English can be tricky. Many salons cater to expats, especially in Warsaw, Krakow, and other major cities. Prices are generally lower than Western Europe, but quality varies widely.',
        whyItMatters: 'A bad haircut is universal suffering. Language barriers make it worse - imagine trying to explain "just a trim" and ending up with a buzz cut. Finding an English-friendly salon saves you stress and potential hair disasters.',
        steps: [
          {
            step: 1,
            title: 'Search expat-recommended spots',
            details: 'Facebook groups like "Warsaw Expats" and "Foreigners in Warsaw" have regular threads about salons. Google Maps reviews mentioning "English" help too.'
          },
          {
            step: 2,
            title: 'Book via app or call',
            details: 'Many salons use Booksy (popular Polish booking app) or Fresha. You can see prices, services, and book without calling. Some places require deposits.'
          },
          {
            step: 3,
            title: 'Bring reference photos',
            details: 'Even with English-speaking staff, photos eliminate confusion. Show exactly what you want - length, style, color. Polish stylists are skilled but may have different terminology.'
          },
          {
            step: 4,
            title: 'Tip appropriately',
            details: 'Tipping is appreciated but not mandatory in Poland. 10-15% or rounding up is common. Some salons include service charge - check before adding extra.'
          }
        ],
        whatNext: 'Once you find a good stylist, stick with them. Building a relationship means they will remember your preferences. Ask for their direct booking link or WhatsApp for future appointments.',
        proTips: [
          'Booksy app shows real-time availability and prices - download it',
          'High-end salons in Mokotow and Srodmiescie often have English-speaking staff',
          'Men: Turkish barbers are everywhere and usually affordable (30-50 PLN)',
          'Women: Expect to pay 150-400 PLN for cut and color at mid-range salons',
          'Avoid walk-ins on Saturdays - book ahead for weekends'
        ],
        sources: [
          { name: 'Booksy App', url: 'https://booksy.com' },
          { name: 'Fresha', url: 'https://www.fresha.com' },
          { name: 'Warsaw Expats Facebook', url: 'https://www.facebook.com/groups/warsawexpats' }
        ]
      }
    },
    {
      id: 'gyms-fitness',
      icon: 'dumbbell',
      title: 'Gyms and Fitness',
      shortDesc: 'Gym chains, classes, and MultiSport card',
      lastUpdated: 'January 2025',
      featured: true,
      content: {
        whatIsIt: 'Poland has a thriving fitness culture with modern gym chains, boutique studios, and the famous MultiSport card that many employers provide. Options range from budget (50 PLN/month) to premium (300+ PLN/month).',
        whyItMatters: 'If your employer offers MultiSport, you are leaving money on the table if you do not use it. It gives you access to hundreds of gyms, pools, climbing walls, and fitness classes across Poland - often free as a job benefit.',
        steps: [
          {
            step: 1,
            title: 'Check if you have MultiSport',
            details: 'Ask HR if your company offers MultiSport or Medicover Sport cards. Many Polish employers include this as a benefit - it is very common. The card costs them ~100-150 PLN/month but gives you access to 4,500+ facilities.'
          },
          {
            step: 2,
            title: 'Choose your gym type',
            details: 'Budget chains: Zdrofit, CityFit (24/7 access, basic equipment). Mid-range: Pure Jatomi, Fitness World. Premium: Holmes Place, Harbour Club. Boutique: CrossFit boxes, yoga studios, F45.'
          },
          {
            step: 3,
            title: 'Visit and compare',
            details: 'Most gyms offer free trial visits or day passes. Check crowd levels at your preferred workout time. Ask about contract length - avoid 12-month lock-ins if you might move.'
          },
          {
            step: 4,
            title: 'Sign up',
            details: 'Bring ID (passport or residence card). Some gyms require Polish bank account for direct debit. Month-to-month contracts cost more but offer flexibility.'
          }
        ],
        whatNext: 'Download the gym app for class bookings and entry. If using MultiSport, download the MultiSport app to find participating facilities near you - you might discover pools, saunas, and climbing walls you did not know were included.',
        proTips: [
          'MultiSport Plus includes premium gyms like Holmes Place - worth the upgrade',
          'CityFit and Zdrofit have 24/7 access - great for odd schedules',
          'Many gyms are empty 6-7 AM and after 9 PM - avoid the 5-7 PM rush',
          'F45 and CrossFit have English-speaking coaches at most locations',
          'Swimming pools often require a swim cap (czepek) - buy one before you go'
        ],
        sources: [
          { name: 'MultiSport Facility Finder', url: 'https://www.benefitsystems.pl/multisport' },
          { name: 'Zdrofit', url: 'https://zdrofit.pl' },
          { name: 'Pure Jatomi', url: 'https://purejatomi.pl' }
        ]
      }
    },
    {
      id: 'restaurants-food',
      icon: 'utensils',
      title: 'Restaurants and Food Scene',
      shortDesc: 'Where to eat, apps to use, and Polish cuisine',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'Poland food scene has exploded in the last decade. Warsaw alone has Michelin-starred restaurants, incredible street food, and everything in between. Polish cuisine is hearty and delicious, but international options are everywhere.',
        whyItMatters: 'Food is a huge part of settling in. Knowing where to eat, how to order, and what apps to use makes daily life easier. Plus, trying Polish food is part of the experience - pierogi, zurek, and bigos are waiting for you.',
        steps: [
          {
            step: 1,
            title: 'Download the essential apps',
            details: 'Pyszne.pl (Takeaway.com owned) and Glovo for delivery. Uber Eats works too. For reservations: TheFork, Google Maps, or call directly. Many restaurants do not use booking apps.'
          },
          {
            step: 2,
            title: 'Explore Polish classics',
            details: 'Try: Pierogi (dumplings), zurek (sour rye soup), bigos (hunter stew), placki ziemniaczane (potato pancakes), kotlet schabowy (breaded pork cutlet). Milk bars (bar mleczny) serve cheap, authentic Polish food.'
          },
          {
            step: 3,
            title: 'Find your neighborhoods',
            details: 'Warsaw: Mokotow, Powisle, Praga for dining out. Krakow: Kazimierz, Podgorze. Each area has its vibe - trendy brunch spots, traditional restaurants, or late-night food.'
          },
          {
            step: 4,
            title: 'Learn basic ordering',
            details: '"Poprosze..." (I would like...) + point at menu works. Most urban restaurants have English menus or staff. Lunch deals (12:00-15:00) offer great value - look for "lunch" or "zestaw obiadowy".'
          }
        ],
        whatNext: 'Build your list of go-to spots for different occasions: quick lunch, date night, family dinner, late-night food. Follow local food bloggers and Instagram accounts for new openings.',
        proTips: [
          'Lunch menus (zestaw obiadowy) are 25-45 PLN for soup + main - incredible value',
          'Milk bars (Bar Mleczny) serve full meals for 15-25 PLN - cash only usually',
          'Tipping: 10% is standard, leave cash on table or tell server "reszta dla Pana/Pani"',
          'Service charge ("serwis") is sometimes included - check before tipping',
          'Restaurants close kitchens early by Western standards - order by 21:00-21:30'
        ],
        sources: [
          { name: 'Pyszne.pl', url: 'https://www.pyszne.pl' },
          { name: 'TheFork Poland', url: 'https://www.thefork.pl' },
          { name: 'Warsaw Foodie (blog)', url: 'https://warsawfoodie.pl' }
        ]
      }
    },
    {
      id: 'events-nightlife',
      icon: 'ticket',
      title: 'Events and Nightlife',
      shortDesc: 'What is on, where to party, and how to find events',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'Poland has a vibrant events scene - from techno clubs and jazz bars to cultural festivals and expat meetups. Warsaw and Krakow especially have international-quality nightlife and regular English-friendly events.',
        whyItMatters: 'Meeting people and having fun is essential to feeling at home. Knowing where to find events - both expat-focused and local - helps you build a social life and experience Polish culture beyond work.',
        steps: [
          {
            step: 1,
            title: 'Find event listings',
            details: 'Facebook Events is still king in Poland. Follow venue pages you like. Other sources: Yelp Warsaw, Going.pl, Eventbrite Poland, Meetup.com for interest groups.'
          },
          {
            step: 2,
            title: 'Join expat communities',
            details: 'InterNations hosts regular events (paid membership but worth it). Couchsurfing meetups are free. Facebook groups post weekly event roundups. Language exchange events are great for meeting people.'
          },
          {
            step: 3,
            title: 'Explore nightlife areas',
            details: 'Warsaw: Mazowiecka/Nowy Swiat for clubs, Praga for alternative scene, Powisle for bars. Krakow: Kazimierz for bars, Plac Nowy for late night. Clubs peak at 1-2 AM, not midnight.'
          },
          {
            step: 4,
            title: 'Know the culture',
            details: 'Dress codes exist at upscale clubs - no sneakers/sportswear. Pre-gaming (domowka) is common before going out. Clubs are open until 4-6 AM. Uber home is easy and affordable.'
          }
        ],
        whatNext: 'Follow 3-4 venues you like on Facebook/Instagram for event updates. Join at least one expat group and one interest-based group (hiking, photography, etc.) to diversify your social options.',
        proTips: [
          'Clubs have guest lists - RSVP on Facebook events or message promoters for free entry',
          'Thursday is a big going-out night - many people have flexible Fridays',
          'Summer: rooftop bars and outdoor events everywhere, check Powisle area',
          'Winter: Christmas markets (Nov-Dec) are magical, ice skating rinks pop up',
          'Concerts: check Progresja, Stodola, Palladium for international acts'
        ],
        sources: [
          { name: 'InterNations Warsaw', url: 'https://www.internations.org/warsaw-expats' },
          { name: 'Going.pl', url: 'https://going.pl' },
          { name: 'Meetup Warsaw', url: 'https://www.meetup.com/cities/pl/warsaw' }
        ]
      }
    },
    {
      id: 'entertainment',
      icon: 'star',
      title: 'Entertainment and Culture',
      shortDesc: 'Cinema, theater, museums, and things to do',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'Poland offers world-class cultural experiences at a fraction of Western European prices. From Hollywood blockbusters in English to stunning opera, and from free museum days to unique Polish theater - there is always something to do.',
        whyItMatters: 'Entertainment helps you decompress and connect with local culture. Knowing where to find English-friendly options and how to get cheap tickets makes enjoying Poland much easier.',
        steps: [
          {
            step: 1,
            title: 'Cinema: Find English screenings',
            details: 'Look for "napisy" (subtitles) not "dubbing" (dubbed). Cinema City, Multikino, and Helios show most films in original language with Polish subtitles. IMAX and premium screens available.'
          },
          {
            step: 2,
            title: 'Museums: Plan your visits',
            details: 'Many museums have free days (usually one day per week). National Museum, POLIN (Jewish history), Warsaw Rising Museum are must-sees. English audio guides usually available.'
          },
          {
            step: 3,
            title: 'Theater and Opera: Book ahead',
            details: 'Teatr Wielki (National Opera) has stunning productions at fair prices. Some theaters offer English subtitles - check listings. TR Warszawa does contemporary work with surtitles.'
          },
          {
            step: 4,
            title: 'Day trips and experiences',
            details: 'Escape rooms are huge in Poland (many in English). Day trips: Malbork Castle, Gdansk coast, Zakopane mountains, Wieliczka Salt Mine. Flixbus and trains are cheap.'
          }
        ],
        whatNext: 'Get a "Karta Duzej Rodziny" if you have 3+ kids - big discounts everywhere. Sign up for museum newsletters for exhibition openings. Check Groupon Poland for experience deals.',
        proTips: [
          'Cinema tickets are 50% off on Tuesdays at most chains',
          'Warsaw Rising Museum is free on Sundays (but crowded)',
          'Opera and ballet tickets start at 30 PLN for limited view - still worth it',
          'Escape rooms: Lock.me, Exit19, and Let Me Out have English games',
          'Filharmonia Narodowa (Philharmonic) has 20 PLN tickets for under-26s'
        ],
        sources: [
          { name: 'Cinema City', url: 'https://www.cinema-city.pl' },
          { name: 'Teatr Wielki (Opera)', url: 'https://teatrwielki.pl/en' },
          { name: 'POLIN Museum', url: 'https://www.polin.pl/en' }
        ]
      }
    },
    {
      id: 'social-dating',
      icon: 'heart',
      title: 'Social Life and Dating',
      shortDesc: 'Making friends, dating apps, and social norms',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'Building a social life as an expat takes effort but Poland makes it easier than many countries. Poles can seem reserved at first but are warm once you are friends. Dating apps are popular, and the expat community is welcoming.',
        whyItMatters: 'Loneliness is the hidden challenge of expat life. Having strategies to meet people - both other expats and locals - is crucial for your wellbeing and making Poland feel like home.',
        steps: [
          {
            step: 1,
            title: 'Join communities immediately',
            details: 'Do not wait until you are lonely. Join InterNations, Meetup groups, sports clubs, or hobby groups in your first month. The earlier you start, the faster you will build a network.'
          },
          {
            step: 2,
            title: 'Try language exchange',
            details: 'Tandem events and apps connect you with Poles wanting to practice English. It is a natural way to meet locals, learn Polish, and make friends. Check Tandem app or Facebook events.'
          },
          {
            step: 3,
            title: 'Dating apps if single',
            details: 'Tinder and Bumble work well in Poland. Hinge is growing. Badoo is popular with locals. Be clear about being an expat - some people specifically want to meet foreigners, others do not.'
          },
          {
            step: 4,
            title: 'Understand social norms',
            details: 'Poles value directness but may seem formal initially. Name days (imieniny) are celebrated like birthdays. Bringing flowers or wine to someone home is expected. Small talk is less common than in US/UK.'
          }
        ],
        whatNext: 'Commit to one social activity per week minimum. Say yes to invitations even when tired. Host a small gathering once you are settled - Poles appreciate being invited to someone home.',
        proTips: [
          'Poles open up over vodka - accepting a drink is a bonding ritual',
          'Sports clubs (running groups, volleyball, climbing) are great for meeting active locals',
          'Expat bubbles are comfortable but try to make Polish friends too',
          'Dating: Poles tend to move from dating to relationship faster than Western norms',
          'Winter is hard socially - plan indoor activities and do not isolate'
        ],
        sources: [
          { name: 'InterNations', url: 'https://www.internations.org' },
          { name: 'Meetup', url: 'https://www.meetup.com' },
          { name: 'Tandem App', url: 'https://www.tandem.net' }
        ]
      }
    }
  ]

  const activeContent = categories.find(c => c.id === activeCategory)

  return (
    <div className="min-h-screen space-y-8">
      {activeCategory ? (
        <button
          onClick={() => setActiveCategory(null)}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <Icon name="arrowLeft" size={16} />
          Back to Live Your Life
        </button>
      ) : (
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <Icon name="arrowLeft" size={16} />
          Back to Home
        </Link>
      )}

      {!activeCategory ? (
        <>
          <header className="glass-panel rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="glass-panel flex h-12 w-12 items-center justify-center rounded-2xl">
                <Icon name="sun" size={22} className="text-slate-100" />
              </div>
              <h1 className="text-3xl font-semibold text-white">Live Your Life</h1>
            </div>
            <p className="text-slate-400 text-lg">
              Beyond paperwork - gyms, food, fun, and building your social life in Poland.
            </p>
          </header>

          <div className="glass-3d rounded-3xl p-6 hover-tilt">
            <div className="flex items-start gap-4">
              <div className="glass-panel flex h-12 w-12 items-center justify-center rounded-2xl">
                <Icon name="dumbbell" size={20} className="text-slate-100" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-white">MultiSport Card</h3>
                  <span className="glass-chip text-xs px-2 py-0.5 rounded-full text-slate-100">Ask Your Employer</span>
                </div>
                <p className="text-slate-300 text-sm mb-3">
                  Access 4,500+ gyms, pools, and fitness facilities across Poland. Many employers offer this as a free or subsidized benefit.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Gyms', 'Pools', 'Yoga Studios', 'Climbing Walls'].map((tag) => (
                    <span key={tag} className="glass-chip text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full text-left glass-panel hover-tilt rounded-2xl p-5 transition-all ${
                  category.featured
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
                      <h3 className="text-lg font-semibold text-white">{category.title}</h3>
                      {category.featured && (
                        <span className="glass-chip text-xs px-2 py-0.5 rounded-full text-emerald-100">Popular</span>
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
                  <Icon name="search" size={18} className="text-slate-100" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Verified Directory</h4>
                  <p className="text-slate-400 text-sm">Expat-rated salons, gyms, restaurants with real reviews</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="glass-panel flex h-10 w-10 items-center justify-center rounded-xl">
                  <Icon name="calendar" size={18} className="text-slate-100" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Events Calendar</h4>
                  <p className="text-slate-400 text-sm">Weekly roundup of English-friendly events in your city</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <article className="space-y-6">
          <header className="glass-panel rounded-3xl p-6">
            <div className="flex items-center gap-3">
              <div className="glass-panel flex h-12 w-12 items-center justify-center rounded-2xl">
                <Icon name={activeContent.icon} size={22} className="text-slate-100" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-white">{activeContent.title}</h1>
                <p className="text-slate-400 text-sm">Last updated: {activeContent.lastUpdated}</p>
              </div>
            </div>
          </header>

          <section className="glass-panel rounded-2xl p-5">
            <h2 className="text-xl font-semibold text-slate-100 mb-3">What is it?</h2>
            <p className="text-slate-300 leading-relaxed">{activeContent.content.whatIsIt}</p>
          </section>

          <section className="glass-panel rounded-2xl p-5">
            <h2 className="text-xl font-semibold text-slate-100 mb-3">Why it matters</h2>
            <p className="text-slate-300 leading-relaxed">{activeContent.content.whyItMatters}</p>
          </section>

          <section className="glass-panel rounded-2xl p-5">
            <h2 className="text-xl font-semibold text-slate-100 mb-3">How to do it</h2>
            <div className="space-y-4">
              {activeContent.content.steps.map((step) => (
                <div key={step.step} className="glass-chip rounded-2xl p-4">
                  <div className="flex gap-4">
                    <span className="w-8 h-8 bg-slate-600/60 text-white rounded-full flex items-center justify-center font-bold text-sm">
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
            <h2 className="text-xl font-semibold text-slate-100 mb-3">What to do next</h2>
            <p className="text-slate-300 leading-relaxed">{activeContent.content.whatNext}</p>
          </section>

          <section className="glass-panel rounded-2xl p-5">
            <h2 className="text-xl font-semibold text-slate-100 mb-3">Pro Tips</h2>
            <ul className="space-y-2">
              {activeContent.content.proTips.map((tip, index) => (
                <li key={index} className="flex gap-2 text-slate-300">
                  <Icon name="spark" size={14} className="text-slate-400" />
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

export default LiveYourLife
