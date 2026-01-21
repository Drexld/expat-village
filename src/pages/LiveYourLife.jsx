import { Link } from 'react-router-dom'
import { useState } from 'react'

function LiveYourLife() {
  const [activeCategory, setActiveCategory] = useState(null)

  const categories = [
    {
      id: 'salons-barbers',
      icon: '💇',
      title: 'Salons & Barbers',
      shortDesc: 'English-speaking stylists and what to expect',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'Finding a good hairdresser or barber in Poland where you can communicate in English can be tricky. Many salons cater to expats, especially in Warsaw, Kraków, and other major cities. Prices are generally lower than Western Europe, but quality varies widely.',
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
        whatNext: 'Once you find a good stylist, stick with them! Building a relationship means they\'ll remember your preferences. Ask for their direct booking link or WhatsApp for future appointments.',
        proTips: [
          'Booksy app shows real-time availability and prices - download it',
          'High-end salons in Mokotów and Śródmieście often have English-speaking staff',
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
      icon: '🏋️',
      title: 'Gyms & Fitness',
      shortDesc: 'Gym chains, classes, and MultiSport card',
      lastUpdated: 'January 2025',
      featured: true,
      content: {
        whatIsIt: 'Poland has a thriving fitness culture with modern gym chains, boutique studios, and the famous MultiSport card that many employers provide. Options range from budget (50 PLN/month) to premium (300+ PLN/month).',
        whyItMatters: 'If your employer offers MultiSport, you\'re leaving money on the table if you don\'t use it. It gives you access to hundreds of gyms, pools, climbing walls, and fitness classes across Poland - often "free" as a job benefit.',
        steps: [
          {
            step: 1,
            title: 'Check if you have MultiSport',
            details: 'Ask HR if your company offers MultiSport or Medicover Sport cards. Many Polish employers include this as a benefit - it\'s very common. The card costs them ~100-150 PLN/month but gives you access to 4,500+ facilities.'
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
        whatNext: 'Download the gym\'s app for class bookings and entry. If using MultiSport, download the MultiSport app to find participating facilities near you - you might discover pools, saunas, and climbing walls you didn\'t know were included.',
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
      icon: '🍽️',
      title: 'Restaurants & Food Scene',
      shortDesc: 'Where to eat, apps to use, and Polish cuisine',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'Poland\'s food scene has exploded in the last decade. Warsaw alone has Michelin-starred restaurants, incredible street food, and everything in between. Polish cuisine is hearty and delicious, but international options are everywhere.',
        whyItMatters: 'Food is a huge part of settling in. Knowing where to eat, how to order, and what apps to use makes daily life easier. Plus, trying Polish food is part of the experience - pierogi, żurek, and bigos are waiting for you.',
        steps: [
          {
            step: 1,
            title: 'Download the essential apps',
            details: 'Pyszne.pl (Takeaway.com owned) and Glovo for delivery. Uber Eats works too. For reservations: TheFork, Google Maps, or call directly. Many restaurants don\'t use booking apps.'
          },
          {
            step: 2,
            title: 'Explore Polish classics',
            details: 'Try: Pierogi (dumplings), żurek (sour rye soup), bigos (hunter\'s stew), placki ziemniaczane (potato pancakes), kotlet schabowy (breaded pork cutlet). Milk bars (bar mleczny) serve cheap, authentic Polish food.'
          },
          {
            step: 3,
            title: 'Find your neighborhoods',
            details: 'Warsaw: Mokotów, Powiśle, Praga for dining out. Kraków: Kazimierz, Podgórze. Each area has its vibe - trendy brunch spots, traditional restaurants, or late-night food.'
          },
          {
            step: 4,
            title: 'Learn basic ordering',
            details: '"Poproszę..." (I\'d like...) + point at menu works. Most urban restaurants have English menus or staff. Lunch deals (12:00-15:00) offer great value - look for "lunch" or "zestaw obiadowy".'
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
      icon: '🎉',
      title: 'Events & Nightlife',
      shortDesc: 'What\'s on, where to party, and how to find events',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'Poland has a vibrant events scene - from techno clubs and jazz bars to cultural festivals and expat meetups. Warsaw and Kraków especially have international-quality nightlife and regular English-friendly events.',
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
            details: 'Warsaw: Mazowiecka/Nowy Świat for clubs, Praga for alternative scene, Powiśle for bars. Kraków: Kazimierz for bars, Plac Nowy for late night. Clubs peak at 1-2 AM, not midnight.'
          },
          {
            step: 4,
            title: 'Know the culture',
            details: 'Dress codes exist at upscale clubs - no sneakers/sportswear. Pre-gaming (domówka) is common before going out. Clubs are open until 4-6 AM. Uber home is easy and affordable.'
          }
        ],
        whatNext: 'Follow 3-4 venues you like on Facebook/Instagram for event updates. Join at least one expat group and one interest-based group (hiking, photography, etc.) to diversify your social options.',
        proTips: [
          'Clubs have guest lists - RSVP on Facebook events or message promoters for free entry',
          'Thursday is a big going-out night - many people have flexible Fridays',
          'Summer: rooftop bars and outdoor events everywhere, check Powiśle area',
          'Winter: Christmas markets (Nov-Dec) are magical, ice skating rinks pop up',
          'Concerts: check Progresja, Stodoła, Palladium for international acts'
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
      icon: '🎬',
      title: 'Entertainment & Culture',
      shortDesc: 'Cinema, theater, museums, and things to do',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'Poland offers world-class cultural experiences at a fraction of Western European prices. From Hollywood blockbusters in English to stunning opera, and from free museum days to unique Polish theater - there\'s always something to do.',
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
            title: 'Theater & Opera: Book ahead',
            details: 'Teatr Wielki (National Opera) has stunning productions at fair prices. Some theaters offer English subtitles - check listings. TR Warszawa does contemporary work with surtitles.'
          },
          {
            step: 4,
            title: 'Day trips and experiences',
            details: 'Escape rooms are huge in Poland (many in English). Day trips: Malbork Castle, Gdańsk coast, Zakopane mountains, Wieliczka Salt Mine. Flixbus and trains are cheap.'
          }
        ],
        whatNext: 'Get a "Karta Dużej Rodziny" if you have 3+ kids - big discounts everywhere. Sign up for museum newsletters for exhibition openings. Check Groupon Poland for experience deals.',
        proTips: [
          'Cinema tickets are 50% off on Tuesdays at most chains',
          'Warsaw Rising Museum is free on Sundays (but crowded)',
          'Opera/ballet tickets start at 30 PLN for limited view - still worth it',
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
      icon: '❤️',
      title: 'Social Life & Dating',
      shortDesc: 'Making friends, dating apps, and social norms',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'Building a social life as an expat takes effort but Poland makes it easier than many countries. Poles can seem reserved at first but are warm once you\'re friends. Dating apps are popular, and the expat community is welcoming.',
        whyItMatters: 'Loneliness is the hidden challenge of expat life. Having strategies to meet people - both other expats and locals - is crucial for your wellbeing and making Poland feel like home.',
        steps: [
          {
            step: 1,
            title: 'Join communities immediately',
            details: 'Don\'t wait until you\'re lonely. Join InterNations, Meetup groups, sports clubs, or hobby groups in your first month. The earlier you start, the faster you\'ll build a network.'
          },
          {
            step: 2,
            title: 'Try language exchange',
            details: 'Tandem events and apps connect you with Poles wanting to practice English. It\'s a natural way to meet locals, learn Polish, and make friends. Check Tandem app or Facebook events.'
          },
          {
            step: 3,
            title: 'Dating apps if single',
            details: 'Tinder and Bumble work well in Poland. Hinge is growing. Badoo is popular with locals. Be clear about being an expat - some people specifically want to meet foreigners, others don\'t.'
          },
          {
            step: 4,
            title: 'Understand social norms',
            details: 'Poles value directness but may seem formal initially. Name days (imieniny) are celebrated like birthdays. Bringing flowers or wine to someone\'s home is expected. Small talk is less common than in US/UK.'
          }
        ],
        whatNext: 'Commit to one social activity per week minimum. Say yes to invitations even when tired. Host a small gathering once you\'re settled - Poles appreciate being invited to someone\'s home.',
        proTips: [
          'Poles open up over vodka - accepting a drink is a bonding ritual',
          'Sports clubs (running groups, volleyball, climbing) are great for meeting active locals',
          'Expat bubbles are comfortable but try to make Polish friends too',
          'Dating: Poles tend to move from dating to relationship faster than Western norms',
          'Winter is hard socially - plan indoor activities and don\'t isolate'
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
              <span className="text-4xl">✨</span>
              <h1 className="text-3xl font-bold text-white">Live Your Life</h1>
            </div>
            <p className="text-slate-400 text-lg">
              Beyond paperwork - gyms, food, fun, and building your social life in Poland.
            </p>
          </header>

          {/* MultiSport Promo Card */}
          <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-700/50 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl">💳</span>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-white">MultiSport Card</h3>
                  <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">Ask Your Employer</span>
                </div>
                <p className="text-slate-300 text-sm mb-3">
                  Access 4,500+ gyms, pools, and fitness facilities across Poland. Many employers offer this as a free or subsidized benefit - don't leave it on the table!
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">🏋️ Gyms</span>
                  <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">🏊 Pools</span>
                  <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">🧘 Yoga Studios</span>
                  <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded">🧗 Climbing Walls</span>
                </div>
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
                  category.featured 
                    ? 'border-purple-700/50 hover:border-purple-600' 
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
                      {category.featured && (
                        <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">Popular</span>
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

          {/* Coming Soon Features */}
          <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Coming Soon</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">📍</span>
                <div>
                  <h4 className="font-medium text-white">Verified Directory</h4>
                  <p className="text-slate-400 text-sm">Expat-rated salons, gyms, restaurants with real reviews</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">📅</span>
                <div>
                  <h4 className="font-medium text-white">Events Calendar</h4>
                  <p className="text-slate-400 text-sm">Weekly roundup of English-friendly events in your city</p>
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
              ← Back to Live Your Life
            </button>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{activeContent.icon}</span>
              <h1 className="text-3xl font-bold text-white">{activeContent.title}</h1>
            </div>
            <p className="text-slate-400">Last updated: {activeContent.lastUpdated}</p>
          </header>

          {/* What Is It */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-emerald-400 mb-3">What is it?</h2>
            <p className="text-slate-300 leading-relaxed">{activeContent.content.whatIsIt}</p>
          </section>

          {/* Why It Matters */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-emerald-400 mb-3">Why it matters</h2>
            <p className="text-slate-300 leading-relaxed">{activeContent.content.whyItMatters}</p>
          </section>

          {/* How To Do It */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-emerald-400 mb-3">How to do it</h2>
            <div className="space-y-4">
              {activeContent.content.steps.map((step) => (
                <div key={step.step} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <div className="flex gap-4">
                    <span className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
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
            <h2 className="text-xl font-semibold text-emerald-400 mb-3">What to do next</h2>
            <div className="bg-slate-800 border border-emerald-700/50 rounded-lg p-4">
              <p className="text-slate-300 leading-relaxed">{activeContent.content.whatNext}</p>
            </div>
          </section>

          {/* Pro Tips */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-emerald-400 mb-3">Pro Tips</h2>
            <ul className="space-y-2">
              {activeContent.content.proTips.map((tip, index) => (
                <li key={index} className="flex gap-2 text-slate-300">
                  <span className="text-emerald-400">•</span>
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
                  className="text-sm text-emerald-400 hover:text-emerald-300 underline"
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
