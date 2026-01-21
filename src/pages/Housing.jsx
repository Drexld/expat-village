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
            details: 'Price too good to be true (30% below market = scam). Urgency and pressure ("many people interested, pay now"). Request for Western Union, crypto, or cash only. Landlord abroad and cannot meet. Poor Polish or English in listing (often foreign scammers). Stock photos or photos from multiple different apartments.'
          }
        ],
        whatNext: 'If you suspect a scam, do not engage further. Report fake listings to the platform. If you have been scammed, report to police (Policja) and your bank immediately.',
        proTips: [
          'Reverse image search listing photos - scammers steal photos from other listings',
          'If the landlord only communicates via WhatsApp/Telegram and avoids phone calls, be suspicious',
          'Meet at the actual apartment, not a cafe or other location',
          'Trust your gut - if something feels off, it probably is',
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
        whyItMatters: 'While you pay a fee (typically one month rent), a good agent saves time and reduces risk. They have access to listings before they go public, can negotiate on your behalf, and help with paperwork.',
        howToDoIt: [
          {
            step: 1,
            title: 'Understand the fee structure',
            details: 'Standard agent fee: One month rent (paid by you). Some agents charge landlord instead - ask upfront. Fee is usually due at contract signing. No legitimate agent asks for payment before you sign.'
          },
          {
            step: 2,
            title: 'Find expat-friendly agents',
            details: 'Look for agents advertising "English spoken" or listed on expat forums. Hamilton May, Spotless, and Lion\'s Bank are known for expat services. Check Google reviews and expat group recommendations.'
          },
          {
            step: 3,
            title: 'Set clear requirements',
            details: 'Tell them: Budget (total including czynsz), Move-in date, Must-haves (pet-friendly, parking, balcony), Preferred districts, Deal-breakers. The clearer you are, the less time wasted.'
          },
          {
            step: 4,
            title: 'Understand what they should do for you',
            details: 'A good agent: Filters listings to match your criteria, Arranges viewings, Translates during viewings, Explains contract terms, Helps negotiate, Is present at contract signing. If they just send you links, find a better agent.'
          }
        ],
        whatNext: 'Once you find an apartment through an agent, they should help with the contract review and signing process.',
        proTips: [
          'Ask agents about their experience with expat clients',
          'Get the fee agreement in writing before starting',
          'You can work with multiple agents - no exclusivity unless agreed',
          'Agent fee is negotiable, especially in slower market',
          'Good agents will warn you about problematic landlords'
        ],
        sources: [
          { name: 'Hamilton May', url: 'https://www.hamiltonmay.com' },
          { name: 'Spotless', url: 'https://www.spotless.pl' }
        ]
      }
    },
    {
      id: 'rental-contracts',
      icon: '📝',
      title: 'Rental Contracts',
      shortDesc: 'What to check before signing',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'Polish rental contracts (umowa najmu) are legally binding documents. Most are in Polish only, which puts expats at a disadvantage. Understanding key clauses protects you from unfair terms.',
        whyItMatters: 'Signing a bad contract can trap you in unfair conditions: excessive penalties for leaving early, no protection if landlord sells, unclear utility costs that balloon, or inability to get your deposit back.',
        howToDoIt: [
          {
            step: 1,
            title: 'Use our Contract Analyzer',
            details: 'Upload your contract to our AI-powered analyzer. It scans for red flags, unusual clauses, and potential issues in seconds. For important decisions, connect with our partner lawyers for a professional review.'
          },
          {
            step: 2,
            title: 'Check these CRITICAL clauses',
            details: 'Deposit amount (typical: 1-2 months), Notice period (typical: 1-3 months), Early termination conditions, Who pays for repairs, Utility payment structure (included? separate? capped?), Landlord entry rights (should require notice).'
          },
          {
            step: 3,
            title: 'Understand the two contract types',
            details: 'Umowa najmu okazjonalnego: Stronger landlord protections, requires notarized documents. Umowa najmu: Standard contract, more tenant-friendly. Ask which type you are signing.'
          },
          {
            step: 4,
            title: 'Negotiate before signing',
            details: 'Everything is negotiable until you sign. Common negotiations: Lower deposit, Longer notice period, Cap on utility increases, Permission for minor modifications, Pet allowance in writing.'
          }
        ],
        whatNext: 'After signing, get a copy of the signed contract, take photos/video of apartment condition, and document any existing damage.',
        proTips: [
          'If contract is Polish-only, ask for English translation or use our analyzer',
          'Take photos of EVERYTHING before moving in',
          'Protokol zdawczo-odbiorczy (handover protocol) documents apartment condition - insist on it',
          'Keep all receipts for rent and deposit payments',
          'Contracts can be modified by written annexes (aneks)'
        ],
        sources: [
          { name: 'Polish Civil Code', url: 'https://isap.sejm.gov.pl' }
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
        whatIsIt: 'Flatshares (wspolnajem) and co-living spaces offer cheaper rent and ready-made social connections. Popular with younger expats and those new to the city who want to meet people quickly.',
        whyItMatters: 'Renting alone in Warsaw center can be expensive (3000-5000 PLN). A room in a flatshare might be 1500-2500 PLN with bills included. Plus, you get instant connections in a new city.',
        howToDoIt: [
          {
            step: 1,
            title: 'Know where to search',
            details: 'Facebook groups: "Warsaw Flatshare", "Expats in Warsaw Housing". OLX.pl pokoje (rooms). Gumtree. Dedicated sites: Flatmates.pl, Roomster. Co-living: Vonder, Quarters, The Social Hub.'
          },
          {
            step: 2,
            title: 'Understand co-living options',
            details: 'Vonder (premium co-living, fully furnished, community events). Quarters (professional co-living). The Social Hub (co-working + co-living). These cost more but include everything: wifi, cleaning, bills, community.'
          },
          {
            step: 3,
            title: 'Vet your potential flatmates',
            details: 'Video call before committing. Ask: How are bills split? Cleaning schedule? Guest policy? Noise expectations? How long have others lived there? Trust your gut about compatibility.'
          },
          {
            step: 4,
            title: 'Understand your legal position',
            details: 'If your name is not on the main lease, you have fewer protections. Ask to see the main lease. Get your room arrangement in writing (even informal). Clarify notice period and deposit return process.'
          }
        ],
        whatNext: 'Once you find a suitable flatshare, arrange to meet all flatmates in person before committing.',
        proTips: [
          'Ask about the internet speed - important for remote workers',
          'Check washing machine/kitchen access arrangements',
          'Understand if landlord knows about the sublet (important legally)',
          'Co-living is great for first 3-6 months while you learn the city',
          'Join expat Facebook groups - flatshare postings are common'
        ],
        sources: [
          { name: 'Vonder', url: 'https://vondereurope.com' },
          { name: 'The Social Hub', url: 'https://www.thesocialhub.co' }
        ]
      }
    },
    {
      id: 'rental-costs',
      icon: '💰',
      title: 'Rental Costs Explained',
      shortDesc: 'Understanding all the fees and typical prices',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'Polish rental costs are confusing because "czynsz" can mean different things. Understanding the TRUE monthly cost prevents nasty surprises. NestQuest calculates this automatically for Otodom listings.',
        whyItMatters: 'An apartment listed at 2500 PLN might actually cost 3500 PLN monthly when you add administration fees, utilities, and internet. Knowing true costs helps you budget accurately.',
        howToDoIt: [
          {
            step: 1,
            title: 'Use NestQuest for true cost calculation',
            details: 'Our tool automatically calculates total monthly costs from any Otodom listing: rent + czynsz administracyjny + estimated utilities. See it in PLN and EUR.'
          },
          {
            step: 2,
            title: 'Understand czynsz (the confusing part)',
            details: 'Czynsz can mean: Just rent (czynsz najmu), OR rent + admin fee (czynsz całkowity). ALWAYS ask: "Is czynsz administracyjny included?" Admin fee covers: building maintenance, trash, water, heating (sometimes).'
          },
          {
            step: 3,
            title: 'Budget for these additional costs',
            details: 'Electricity (prąd): 100-300 PLN/month. Gas (gaz): 50-200 PLN/month if gas heating/cooking. Internet: 50-80 PLN/month. These are usually EXTRA unless explicitly included.'
          },
          {
            step: 4,
            title: 'Know typical Warsaw prices (2025)',
            details: 'Studio (kawalerka): 2000-3500 PLN. 1-bedroom (2 pokoje): 2800-4500 PLN. 2-bedroom (3 pokoje): 3500-6000 PLN. Center is 20-40% more than outer districts. These are BASE rent - add 500-1000 for total costs.'
          }
        ],
        whatNext: 'Use the 30% rule: total housing cost should not exceed 30% of your net salary. NestQuest has a salary stress test feature for this.',
        proTips: [
          'Ask for bills from previous 12 months to estimate utilities',
          'Winter heating can double utility costs in old buildings',
          'New buildings often have lower admin fees',
          'Ground floor (parter) is usually cheaper but less desirable',
          'Negotiate - listed prices are starting points'
        ],
        sources: [
          { name: 'Otodom Market Report', url: 'https://www.otodom.pl' }
        ]
      }
    }
  ]

  const activeContent = categories.find(c => c.id === activeCategory)

  const nestQuestFeatures = [
    { icon: '💰', title: 'True Cost Breakdown', desc: 'Real monthly cost in PLN and EUR - no hidden fees' },
    { icon: '🚨', title: 'Scam & Risk Detection', desc: '8-point trust score, automatic red flag alerts' },
    { icon: '📊', title: 'Salary Stress Test', desc: 'Does this fit your budget? 30% rule check' },
    { icon: '🚇', title: 'Commute Calculator', desc: 'Travel time to your workplace' },
    { icon: '🏘️', title: 'Neighborhood Vibe', desc: 'District insights, expat density, price tier' },
    { icon: '⚖️', title: 'Compare Apartments', desc: 'Side-by-side comparison with weighted scoring' }
  ]

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        ← Back to Home
      </Link>

      {/* Breadcrumb when viewing article */}
      {activeCategory && (
        <button 
          onClick={() => setActiveCategory(null)}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          ← Back to Housing
        </button>
      )}

      {!activeCategory ? (
        <>
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">🏠</span>
              <h1 className="text-3xl font-bold text-white">Housing</h1>
            </div>
            <p className="text-slate-400 text-lg">
              Finding an apartment, avoiding scams, understanding contracts.
            </p>
          </header>

          {/* NestQuest Hero Card */}
          <div className="mb-6 p-5 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-700/50 rounded-xl">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <span className="text-4xl">🏠</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white text-lg">NestQuest</h3>
                  <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Free Tool</span>
                </div>
                <p className="text-slate-300 text-sm mb-3">
                  One click on any Otodom listing and get instant English analysis with true cost breakdown, scam detection, and commute times.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-blue-800/50 text-blue-200 px-2 py-1 rounded">💰 True Cost Calculator</span>
                  <span className="text-xs bg-blue-800/50 text-blue-200 px-2 py-1 rounded">🚨 Scam Detection</span>
                  <span className="text-xs bg-blue-800/50 text-blue-200 px-2 py-1 rounded">🚇 Commute Times</span>
                  <span className="text-xs bg-blue-800/50 text-blue-200 px-2 py-1 rounded">📊 Salary Stress Test</span>
                </div>
                <a
                  href="https://chromewebstore.google.com/detail/polish-apartment-summariz/lmbkkgedjmcoackmbdkmdgmgenhlaako"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0 1 12 6.545h10.691A12 12 0 0 0 12 0zM1.931 5.47A11.943 11.943 0 0 0 0 12c0 6.012 4.42 10.991 10.189 11.864l3.953-6.847a5.45 5.45 0 0 1-6.865-2.29zm13.342 2.166a5.446 5.446 0 0 1 1.45 7.09l.002.001h-.002l-3.952 6.848A12.014 12.014 0 0 0 24 12c0-1.525-.284-2.986-.802-4.329z"/>
                  </svg>
                  Add to Chrome — It's Free
                </a>
              </div>
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

          {/* Category List */}
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

          {/* Contract Analyzer - NOW LIVE */}
          <Link 
            to="/contract-analyzer"
            className="block mt-8 p-5 bg-gradient-to-r from-emerald-900/30 to-slate-800 border border-emerald-700/50 hover:border-emerald-500 rounded-xl transition-all group"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">🤖</span>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                  Contract Analyzer
                  <span className="ml-2 text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                    New!
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
                <span className="text-emerald-400 text-sm mt-3 block group-hover:text-emerald-300">
                  Analyze your contract →
                </span>
              </div>
            </div>
          </Link>

          {/* NestQuest Features Grid */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4">What NestQuest Analyzes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {nestQuestFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg">
                  <span className="text-xl">{feature.icon}</span>
                  <div>
                    <h4 className="font-medium text-white">{feature.title}</h4>
                    <p className="text-slate-400 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Article Detail View */
        <article>
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{activeContent.icon}</span>
              <h1 className="text-2xl font-bold text-white">{activeContent.title}</h1>
            </div>
            <p className="text-slate-500 text-sm">Last updated: {activeContent.lastUpdated}</p>
          </header>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-emerald-400 mb-3">What is it?</h2>
            <p className="text-slate-300 leading-relaxed">{activeContent.content.whatIsIt}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-emerald-400 mb-3">Why it matters</h2>
            <p className="text-slate-300 leading-relaxed">{activeContent.content.whyItMatters}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-emerald-400 mb-3">How to do it</h2>
            <div className="space-y-4">
              {activeContent.content.howToDoIt.map((step) => (
                <div key={step.step} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <div className="flex gap-3">
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      activeContent.isAlert ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
                    }`}>
                      {step.step}
                    </span>
                    <div>
                      <h3 className="font-medium text-white mb-1">{step.title}</h3>
                      <p className="text-slate-400 text-sm">{step.details}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8 p-4 bg-slate-800 border border-slate-700 rounded-lg">
            <h2 className="text-lg font-semibold text-white mb-2">What to do next</h2>
            <p className="text-slate-300">{activeContent.content.whatNext}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold text-emerald-400 mb-3">Pro Tips</h2>
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
