import { Link } from 'react-router-dom'
import { useState } from 'react'

function Housing() {
  const [activeCategory, setActiveCategory] = useState(null)

  const categories = [
    {
      id: 'finding-apartment',
      icon: '🔍',
      title: 'Finding an Apartment',
      shortDesc: 'Where to search and what to expect',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'Finding a rental apartment in Warsaw (and Poland) usually happens through online portals, agencies, or Facebook groups. The market moves FAST - good apartments get taken within hours. Knowing where to look and how to act quickly is essential.',
        whyItMatters: 'Using the wrong platforms wastes time and exposes you to scams. The best apartments often never make it to the big portals - they get snapped up through agencies or word of mouth. Understanding the market helps you find better places faster.',
        howToDoIt: [
          {
            step: 1,
            title: 'Know the main rental portals',
            details: 'Otodom.pl - Largest and most trusted, professional listings. OLX.pl - More private landlords, cheaper but more scams. Gumtree.pl - Mixed quality. Flatio.com - Furnished, flexible terms, good for expats. Spotted by Locals - Curated, higher quality.'
          },
          {
            step: 2,
            title: 'Install NestQuest (our free tool)',
            details: 'NestQuest is our Chrome extension that analyzes any Otodom listing instantly. It translates to English, calculates TRUE costs (rent + hidden fees), detects scams, and shows commute times to your workplace. One click and you know if a listing is worth your time.'
          },
          {
            step: 3,
            title: 'Set up alerts immediately',
            details: 'On Otodom and OLX, create saved searches with alerts. Set your criteria (district, price, size) and get email/app notifications. When a good place appears, contact within MINUTES not hours.'
          },
          {
            step: 4,
            title: 'Prepare your documents in advance',
            details: 'Landlords want to know you can pay. Have ready: Proof of employment (contract or letter), Bank statements (last 2-3 months), ID/Passport copy, References from previous landlord if possible. Having these ready means you can move fast.'
          }
        ],
        whatNext: 'Once you find a place you like, move to the contract stage. Never pay anything before signing a contract and getting keys.',
        proTips: [
          'Mokotow, Srodmiescie, Zoliborz - popular with expats, more English-friendly',
          'Praga - up and coming, cheaper, more local vibe',
          'Apartments with "od zaraz" mean available immediately',
          'Kawalerka = studio, 2-pokojowe = 1 bedroom + living room',
          'Use NestQuest salary stress test to check if rent fits your budget (30% rule)'
        ],
        sources: [
          { name: 'Otodom', url: 'https://www.otodom.pl' },
          { name: 'OLX Nieruchomosci', url: 'https://www.olx.pl/nieruchomosci/mieszkania/wynajem/' },
          { name: 'Flatio', url: 'https://www.flatio.com' }
        ]
      }
    },
    {
      id: 'scam-warnings',
      icon: '🚨',
      title: 'Scam Warnings',
      shortDesc: 'Red flags and how to protect yourself',
      lastUpdated: 'January 2025',
      isAlert: true,
      content: {
        whatIsIt: 'Rental scams in Poland target expats specifically because we are unfamiliar with local norms, often desperate to find housing quickly, and may not speak Polish. Scammers are sophisticated - fake listings, fake landlords, even fake viewings.',
        whyItMatters: 'Victims lose thousands of zloty - deposits, first month rent, even multiple months paid upfront. Beyond money, you lose time and may end up homeless. Knowing the red flags protects you.',
        howToDoIt: [
          {
            step: 1,
            title: 'Use NestQuest scam detection',
            details: 'Our NestQuest tool automatically flags red flags: prices too good to be true, deposit inconsistencies, vague listings with missing details, and identifies agency vs private owner. Let AI catch what you might miss.'
          },
          {
            step: 2,
            title: 'NEVER pay before viewing in person',
            details: 'Scammer classic: "I am abroad, send deposit via Western Union/crypto and I will mail you the keys." This is ALWAYS a scam. No exceptions. Always view the apartment in person before any payment.'
          },
          {
            step: 3,
            title: 'Verify the landlord owns the property',
            details: 'Ask for: Proof of ownership (akt notarialny or ksiega wieczysta extract). Check the name matches their ID. You can verify property records at ksiegiwieczyste.pl. If they refuse to prove ownership, walk away.'
          },
          {
            step: 4,
            title: 'Watch for these RED FLAGS',
            details: 'Price too good to be true (30% below market = scam). Urgency and pressure ("many people interested, pay now"). Request for Western Union, crypto, or cash only. Landlord abroad and cannot meet. Poor Polish or English in listing. Stock photos or photos from multiple different apartments.'
          }
        ],
        whatNext: 'If you suspect a scam, do not engage further. Report fake listings to the platform. If you have been scammed, report to police (Policja) and your bank immediately.',
        proTips: [
          'NestQuest Trust Score checks 8 verification points automatically',
          'Reverse image search listing photos - scammers steal photos from other listings',
          'If the landlord only communicates via WhatsApp/Telegram and avoids calls, be suspicious',
          'Meet at the actual apartment, not a cafe or other location',
          'Legitimate landlords will happily show proof of ownership'
        ],
        sources: [
          { name: 'Report Scams - Policja', url: 'https://www.policja.pl' },
          { name: 'Verify Property - Ksiegi Wieczyste', url: 'https://ksiegiwieczyste.pl' }
        ]
      }
    },
    {
      id: 'rental-agents',
      icon: '🤝',
      title: 'Rental Agents',
      shortDesc: 'English-speaking agents and what they cost',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'Rental agents (posrednik or agent nieruchomosci) help you find apartments and handle negotiations with landlords. For expats, English-speaking agents can be invaluable - they translate, explain local norms, and filter out scams.',
        whyItMatters: 'Agents have access to listings before they go public. They handle the Polish communication. They know fair prices and can negotiate. For expats unfamiliar with the market, a good agent saves time and prevents costly mistakes.',
        howToDoIt: [
          {
            step: 1,
            title: 'Understand the fee structure',
            details: 'Agent fees are typically: One month rent (most common), or 50% of one month rent, or a fixed fee (less common). Fee is usually paid by tenant, sometimes split with landlord. Confirm the fee upfront before working with any agent.'
          },
          {
            step: 2,
            title: 'Find English-speaking agents',
            details: 'Hamilton May - Premium, English-speaking, expat-focused. Savills Poland - International agency, corporate relocations. Emmerson Realty - Wide range, some English speakers. Atlas Real Estate - Good expat reviews. Ask in expat Facebook groups for personal recommendations.'
          },
          {
            step: 3,
            title: 'Brief your agent clearly',
            details: 'Tell them: Budget (with all costs), Preferred areas, Must-haves (parking, balcony, pets allowed), Move-in date, Contract length preference. The clearer you are, the better matches they will find.'
          },
          {
            step: 4,
            title: 'What a good agent does',
            details: 'Filters listings to match your needs. Schedules and accompanies viewings. Translates and explains contract terms. Negotiates price and conditions. Handles communication with landlord. Helps with handover protocol (protokol zdawczo-odbiorczy).'
          }
        ],
        whatNext: 'Interview 2-3 agents before committing. Ask about their experience with expats, their fee, and typical timeline. A good agent should find you suitable options within 1-2 weeks.',
        proTips: [
          'Agent fee is negotiable, especially in slower months (winter)',
          'Some companies offer relocation packages that include housing search',
          'Ask your employer - many have preferred agents for relocating employees',
          'Get the agent agreement in writing before they start searching',
          'A good agent is worth the fee - they can save you from bad contracts and scams'
        ],
        sources: [
          { name: 'Hamilton May', url: 'https://www.hamiltonmay.com' },
          { name: 'Savills Poland', url: 'https://www.savills.pl' }
        ]
      }
    },
    {
      id: 'contracts',
      icon: '📝',
      title: 'Rental Contracts',
      shortDesc: 'What to check before signing',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'A rental contract (umowa najmu) is a legally binding agreement between you and your landlord. In Poland, contracts are in Polish by law for legal validity. Understanding what you are signing is crucial - bad clauses can cost you thousands.',
        whyItMatters: 'Contracts protect both parties, but landlord-friendly contracts can trap you with unfair deposit terms, impossible notice periods, or liability for things that are not your fault. 30 minutes of careful review prevents months of problems.',
        howToDoIt: [
          {
            step: 1,
            title: 'Get the contract translated',
            details: 'At minimum, use Google Translate on key sections. Better: Ask a Polish friend or colleague to review it. Best: Pay for professional translation of important clauses (deposit, termination, repairs). Our Contract Analyzer tool can help identify red flags (coming soon).'
          },
          {
            step: 2,
            title: 'Check these critical clauses',
            details: 'Deposit amount (kaucja) - should be 1-2 months max. Deposit return conditions - within 30 days of leaving. Notice period (okres wypowiedzenia) - typically 1-3 months. Termination conditions - can you leave early? At what cost? Rent increase terms - when and how much can it increase?'
          },
          {
            step: 3,
            title: 'Watch for these RED FLAGS',
            details: 'Deposit over 2 months rent. No clear deposit return conditions. Landlord can terminate with less than 1 month notice. You cannot terminate early at all. You pay for ALL repairs (normal wear should be landlord responsibility). Vague "other fees" without specification. "Najem okazjonalny" without understanding what it means.'
          },
          {
            step: 4,
            title: 'Negotiate before signing',
            details: 'Everything is negotiable until you sign. Common negotiation points: Reduce notice period, Add specific deposit return timeline, Clarify who pays for what repairs, Add inventory list as appendix, Specify included furniture/appliances.'
          }
        ],
        whatNext: 'Before signing, create a detailed inventory (protokol zdawczo-odbiorczy) with photos. This protects your deposit when you leave. Both parties should sign the inventory.',
        proTips: [
          'Umowa najmu okazjonalnego gives landlord more power to evict - understand it before signing',
          'Take timestamped photos of EVERYTHING on move-in day',
          'Keep a copy of the signed contract and all receipts',
          'Pay rent by bank transfer only - creates proof of payment',
          'If landlord refuses to put something in writing, that is a red flag'
        ],
        sources: [
          { name: 'Contract Analyzer (Coming Soon)', url: '#' }
        ]
      }
    },
    {
      id: 'flatshares',
      icon: '👥',
      title: 'Flatshares & Co-living',
      shortDesc: 'Sharing apartments and modern co-living options',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'Flatshares (wspolnajem) mean renting a room in a shared apartment with other tenants. Co-living spaces are modern, professionally managed buildings designed for young professionals with shared amenities, events, and flexible terms.',
        whyItMatters: 'Flatshares are significantly cheaper than solo apartments. Co-living is great for newcomers - you instantly have a community, everything is included, and terms are flexible. Both are excellent options when you first arrive.',
        howToDoIt: [
          {
            step: 1,
            title: 'Flatshare options',
            details: 'Facebook groups: "Pokoj do wynajecia Warszawa", "Warsaw Flatshare/Roommate". OLX.pl - Search for "pokoj" (room). Gumtree.pl - Room listings. Erasmus/student groups - Even if you are not a student, these have good options.'
          },
          {
            step: 2,
            title: 'Co-living spaces in Warsaw',
            details: 'Vonder - Premium co-living, great locations, all-inclusive. Coliving.com listings for Warsaw. Quarters Co-living - International chain with Warsaw presence. LifeX - Design-focused co-living. Prices: 2000-4000 PLN/month all-inclusive.'
          },
          {
            step: 3,
            title: 'What to check for flatshares',
            details: 'Meet ALL current flatmates before committing. Check whose name is on the main contract. Understand how bills are split. Clarify cleaning responsibilities and house rules. Ask about guest policies. Visit at different times of day if possible.'
          },
          {
            step: 4,
            title: 'Co-living advantages',
            details: 'All-inclusive: Rent, bills, wifi, cleaning, often gym. Flexible terms: Monthly contracts common. Community: Events, shared spaces, instant social network. Furnished: Move in with just a suitcase. No Polish bureaucracy: They handle everything.'
          }
        ],
        whatNext: 'Flatshares are great for your first 3-6 months while you learn the city and market. Then you can find your own place with more confidence.',
        proTips: [
          'Co-living is worth the premium when you first arrive - the community helps you settle',
          'In flatshares, insist on being added to the official contract or having a sublet agreement',
          'Check the main tenant is actually allowed to sublet (some contracts forbid it)',
          'Ask why the room is available - is someone leaving or are they trying to fill a problem room?',
          'Trust your instincts about flatmates - you will be living with these people'
        ],
        sources: [
          { name: 'Vonder Co-living', url: 'https://www.vonder.com' },
          { name: 'Coliving.com Warsaw', url: 'https://coliving.com/warsaw' }
        ]
      }
    },
    {
      id: 'costs',
      icon: '💰',
      title: 'Rental Costs Explained',
      shortDesc: 'Understanding all the fees and typical prices',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'Rental costs in Poland include more than just rent. You need to understand czynsz (rent vs admin fees), media (utilities), kaucja (deposit), and agent fees. Without knowing these, you cannot accurately budget.',
        whyItMatters: 'A listing showing "2500 PLN" might actually cost 3500 PLN/month when you add all fees. Understanding the full cost prevents budget surprises and helps you compare listings accurately.',
        howToDoIt: [
          {
            step: 1,
            title: 'Use NestQuest for true cost calculation',
            details: 'NestQuest automatically calculates your REAL monthly cost from any Otodom listing - rent + admin + utilities + hidden fees. It shows costs in both PLN and EUR. No more manual calculations or surprises.'
          },
          {
            step: 2,
            title: 'Understand czynsz (the confusing term)',
            details: 'Czynsz can mean two things: 1) Total rent to landlord, OR 2) Just the admin fee (czynsz administracyjny) to the building. Always ask: "Is czynsz included or additional?" If separate, expect 300-800 PLN/month extra for admin fees.'
          },
          {
            step: 3,
            title: 'Media (utilities) breakdown',
            details: 'Electricity (prad): 100-300 PLN/month. Gas (gaz): 50-200 PLN/month (if gas heating/cooking). Water (woda): Usually in admin fee or 50-100 PLN. Internet: 50-80 PLN/month. Heating: Often in admin fee, or 100-400 PLN in winter. Always ask what is included and what is extra.'
          },
          {
            step: 4,
            title: 'One-time costs to budget for',
            details: 'Deposit (kaucja): 1-2 months rent, refundable. Agent fee: 0.5-1 month rent, non-refundable. First month rent: Due on signing. So to move in, expect to pay: 2.5-4 months rent upfront.'
          }
        ],
        whatNext: 'When comparing apartments, calculate the TOTAL monthly cost including all fees. Ask landlords for average utility bills from previous tenants.',
        proTips: [
          'NestQuest salary stress test shows if rent fits your budget using the 30% rule',
          'Winter heating costs can be 3x summer costs - ask for winter bills',
          'New buildings often have lower admin fees than old kamienice',
          'Ground floor (parter) and top floor are usually cheaper',
          'Furnished (umeblowane) costs more than unfurnished (nieumeblowane)'
        ],
        sources: [
          { name: 'Otodom Price Trends', url: 'https://www.otodom.pl' }
        ]
      }
    }
  ]

  const activeContent = categories.find(c => c.id === activeCategory)

  return (
    <div>
      <nav className="mb-6">
        {activeCategory ? (
          <button 
            onClick={() => setActiveCategory(null)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Housing
          </button>
        ) : (
          <Link to="/" className="text-slate-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        )}
      </nav>

      {!activeCategory ? (
        <>
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🏠</span>
              <h1 className="text-3xl font-bold text-white">Housing</h1>
            </div>
            <p className="text-slate-400 text-lg">
              Find a safe, fair rental without getting scammed. Everything you need to know about renting in Poland.
            </p>
          </header>

          {/* NestQuest Feature Card */}
          <div className="mb-6 p-5 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/50 rounded-xl">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏠</span>
                <h3 className="text-xl font-bold text-white">NestQuest</h3>
                <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">Free Tool</span>
              </div>
              <p className="text-blue-100/90 text-sm">
                Your secret weapon for apartment hunting. One click on any Otodom listing and get instant English analysis with true cost breakdown, scam detection, and commute times.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-blue-800/50 text-blue-200 px-2 py-1 rounded">💰 True Cost Calculator</span>
                <span className="text-xs bg-blue-800/50 text-blue-200 px-2 py-1 rounded">🚨 Scam Detection</span>
                <span className="text-xs bg-blue-800/50 text-blue-200 px-2 py-1 rounded">🚇 Commute Times</span>
                <span className="text-xs bg-blue-800/50 text-blue-200 px-2 py-1 rounded">📊 Salary Stress Test</span>
                <span className="text-xs bg-blue-800/50 text-blue-200 px-2 py-1 rounded">⚖️ Compare Apartments</span>
              </div>
              <a
                href="https://chromewebstore.google.com/detail/polish-apartment-summariz/lmbkkgedjmcoackmbdkmdgmgenhlaako"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg transition-colors text-sm font-medium w-full sm:w-auto"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0 1 12 6.545h10.691A12 12 0 0 0 12 0zM1.931 5.47A11.943 11.943 0 0 0 0 12c0 6.012 4.42 10.991 10.189 11.864l3.953-6.847a5.45 5.45 0 0 1-6.865-2.29zm13.342 2.166a5.446 5.446 0 0 1 1.45 7.09l.002.001h-.002l-3.952 6.848A12.014 12.014 0 0 0 24 12c0-1.525-.284-2.986-.802-4.329h-7.912a5.45 5.45 0 0 1-.013 0z"/>
                </svg>
                Add to Chrome — It's Free
              </a>
            </div>
          </div>

          {/* Alert Banner */}
          <div className="mb-6 p-4 bg-amber-900/30 border border-amber-600/50 rounded-xl">
            <div className="flex gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-amber-200">Scam Alert</h3>
                <p className="text-amber-100/80 text-sm">
                  Rental scams targeting expats are common. NestQuest flags red flags automatically, but always read our scam warnings before sending any money.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full text-left border rounded-xl p-5 transition-all group ${
                  category.isAlert 
                    ? 'bg-red-900/20 hover:bg-red-900/30 border-red-700/50 hover:border-red-600/50'
                    : 'bg-slate-800 hover:bg-slate-750 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{category.icon}</span>
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold mb-1 transition-colors ${
                      category.isAlert 
                        ? 'text-red-200 group-hover:text-red-100'
                        : 'text-white group-hover:text-emerald-400'
                    }`}>
                      {category.title}
                      {category.isAlert && (
                        <span className="ml-2 text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">
                          Important
                        </span>
                      )}
                    </h3>
                    <p className={`text-sm ${category.isAlert ? 'text-red-200/70' : 'text-slate-400'}`}>
                      {category.shortDesc}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`transition-colors ${
                      category.isAlert 
                        ? 'text-red-400 group-hover:text-red-300'
                        : 'text-slate-500 group-hover:text-slate-300'
                    }`}>→</span>
                    <p className="text-xs text-slate-500 mt-1">Updated {category.lastUpdated}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Coming Soon: Contract Analyzer */}
          <div className="mt-8 p-5 bg-gradient-to-r from-emerald-900/30 to-slate-800 border border-emerald-700/50 rounded-xl">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🤖</span>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">
                  Contract Analyzer
                  <span className="ml-2 text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                    Coming Soon
                  </span>
                </h3>
                <p className="text-slate-400 text-sm mb-3">
                  Upload your rental contract and our AI will scan for red flags, unusual clauses, and potential issues - in seconds. Need a human review? Connect with our partner lawyers.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">AI-Powered</span>
                  <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">Free Scan</span>
                  <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">Lawyer Review Option</span>
                </div>
              </div>
            </div>
          </div>

          {/* NestQuest Full Features */}
          <div className="mt-6 p-5 bg-slate-800/50 border border-slate-700 rounded-xl">
            <h3 className="font-semibold text-white mb-4">What NestQuest Analyzes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex gap-3">
                <span className="text-lg">💰</span>
                <div>
                  <p className="font-medium text-slate-200">True Cost Breakdown</p>
                  <p className="text-slate-400">Real monthly cost in PLN and EUR - no hidden fees</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-lg">🚨</span>
                <div>
                  <p className="font-medium text-slate-200">Scam & Risk Detection</p>
                  <p className="text-slate-400">8-point trust score, automatic red flag alerts</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-lg">📊</span>
                <div>
                  <p className="font-medium text-slate-200">Salary Stress Test</p>
                  <p className="text-slate-400">Does this fit your budget? 30% rule check</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-lg">🚇</span>
                <div>
                  <p className="font-medium text-slate-200">Commute Calculator</p>
                  <p className="text-slate-400">Travel time to your workplace</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-lg">🏘️</span>
                <div>
                  <p className="font-medium text-slate-200">Neighborhood Vibe</p>
                  <p className="text-slate-400">District insights, expat density, price tier</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-lg">⚖️</span>
                <div>
                  <p className="font-medium text-slate-200">Compare Apartments</p>
                  <p className="text-slate-400">Side-by-side comparison with weighted scoring</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <article>
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{activeContent.icon}</span>
              <h1 className="text-3xl font-bold text-white">{activeContent.title}</h1>
              {activeContent.isAlert && (
                <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full">
                  Important
                </span>
              )}
            </div>
            <p className="text-slate-500 text-sm">Last updated: {activeContent.lastUpdated}</p>
          </header>

          {activeContent.isAlert && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-600/50 rounded-lg">
              <p className="text-red-200 text-sm">
                ⚠️ This information is critical for protecting yourself. NestQuest can help detect scams automatically, but please read this guide carefully.
              </p>
            </div>
          )}

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-emerald-400 mb-3">What is it?</h2>
            <p className="text-slate-300 leading-relaxed">{activeContent.content.whatIsIt}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-emerald-400 mb-3">Why it matters</h2>
            <p className="text-slate-300 leading-relaxed">{activeContent.content.whyItMatters}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-emerald-400 mb-4">How to do it</h2>
            <div className="space-y-4">
              {activeContent.content.howToDoIt.map((step) => (
                <div key={step.step} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <div className="flex gap-3">
                    <span className={`flex-shrink-0 w-8 h-8 ${
                      activeContent.isAlert ? 'bg-red-600' : 'bg-emerald-600'
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

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-emerald-400 mb-3">What to do next</h2>
            <div className={`rounded-lg p-4 ${
              activeContent.isAlert 
                ? 'bg-red-900/20 border border-red-700/50'
                : 'bg-slate-800 border border-emerald-700/50'
            }`}>
              <p className="text-slate-300 leading-relaxed">{activeContent.content.whatNext}</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-emerald-400 mb-3">Pro Tips</h2>
            <ul className="space-y-2">
              {activeContent.content.proTips.map((tip, index) => (
                <li key={index} className="flex gap-2 text-slate-300">
                  <span className={activeContent.isAlert ? 'text-red-400' : 'text-emerald-400'}>•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* NestQuest CTA in article view */}
          <section className="mb-8 p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-blue-200 font-medium">🏠 Make apartment hunting easier</p>
                <p className="text-blue-300/70 text-sm">Use NestQuest to analyze any Otodom listing instantly</p>
              </div>
              <a
                href="https://chromewebstore.google.com/detail/polish-apartment-summariz/lmbkkgedjmcoackmbdkmdgmgenhlaako"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium whitespace-nowrap text-center"
              >
                Get NestQuest
              </a>
            </div>
          </section>

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

export default Housing
