import { Link } from 'react-router-dom'
import { useState } from 'react'

function GetThingsDone() {
  const [activeCategory, setActiveCategory] = useState(null)

  const categories = [
    {
      id: 'banking',
      icon: '🏦',
      title: 'Open a Bank Account',
      shortDesc: 'Expat-friendly banks that speak English',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'A Polish bank account (konto bankowe) lets you receive salary, pay rent, and handle daily transactions. Without one, you will struggle with everything from paying bills to getting a phone contract.',
        whyItMatters: 'Most landlords require Polish bank transfers. Employers pay salaries to Polish accounts. Many services (phone, internet, gym) need a Polish IBAN for direct debit. Using foreign cards means fees and exchange rate losses.',
        howToDoIt: [
          {
            step: 1,
            title: 'Gather your documents',
            details: 'You need: Passport, Proof of address (rental contract or utility bill), PESEL number (some banks work without it), Phone number'
          },
          {
            step: 2,
            title: 'Choose an expat-friendly bank',
            details: 'Best options: Millennium Bank (full English app and support), mBank (good English app, modern), PKO BP (largest bank, some English), Santander (English available)'
          },
          {
            step: 3,
            title: 'Book an appointment or go online',
            details: 'Millennium and mBank allow online account opening for EU citizens. Non-EU citizens usually need to visit a branch. Call ahead to confirm English-speaking staff.'
          },
          {
            step: 4,
            title: 'Activate your account',
            details: 'You will receive a debit card in 5-7 days. Download the mobile app. Set up BLIK (Poland instant payment system - very useful!).'
          }
        ],
        whatNext: 'Once you have your account, get your IBAN for salary payments and set up BLIK for easy mobile payments everywhere in Poland.',
        proTips: [
          'BLIK is essential - it is how Poles pay for everything',
          'Millennium has the best English support in our experience',
          'You can open a basic account without PESEL at most banks',
          'Avoid Revolut as your main account - many services do not accept it'
        ],
        sources: [
          { name: 'Millennium Bank', url: 'https://www.bankmillennium.pl/en' },
          { name: 'mBank', url: 'https://www.mbank.pl/en/' }
        ]
      }
    },
    {
      id: 'pesel',
      icon: '🆔',
      title: 'Get Your PESEL Number',
      shortDesc: 'Your Polish ID number for everything',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'PESEL is an 11-digit national identification number. Think of it like a Social Security Number. It is used for taxes, healthcare, banking, and most official processes.',
        whyItMatters: 'Without PESEL: No public healthcare, complicated banking, cannot sign many contracts, tax filing is harder. With PESEL: Everything becomes easier. It is free and takes about 30 minutes to get.',
        howToDoIt: [
          {
            step: 1,
            title: 'Determine where to apply',
            details: 'EU citizens: Any Urzad Dzielnicy (district office). Non-EU citizens: Must go to the office in your registered district.'
          },
          {
            step: 2,
            title: 'Gather documents',
            details: 'Passport (original), Completed application form (available at office or online), Proof of address in Poland (rental contract), For non-EU: valid visa or residence card'
          },
          {
            step: 3,
            title: 'Visit the Urzad Dzielnicy',
            details: 'Go to the Wydzial Spraw Obywatelskich (Civil Affairs Department). Take a queue number for PESEL/Zameldowanie. Some offices allow online booking.'
          },
          {
            step: 4,
            title: 'Receive your PESEL',
            details: 'EU citizens often get it same-day. Non-EU citizens may wait 1-2 weeks. You will receive a confirmation document with your number.'
          }
        ],
        whatNext: 'Save your PESEL somewhere safe. You will need it for: opening bank accounts, signing contracts, healthcare registration, tax returns (PIT).',
        proTips: [
          'Go early morning (8-9am) to avoid long queues',
          'Some offices have English-speaking staff - call ahead',
          'The form is in Polish but staff can help you fill it',
          'Your PESEL contains your birth date - digits 1-6 are YYMMDD'
        ],
        sources: [
          { name: 'Warsaw City Hall', url: 'https://warszawa.pl' },
          { name: 'Gov.pl PESEL Info', url: 'https://www.gov.pl/web/gov/uzyskaj-numer-pesel' }
        ]
      }
    },
    {
      id: 'residency',
      icon: '📄',
      title: 'Residency Registration',
      shortDesc: 'Temporary and permanent residence permits',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'Residency registration (zameldowanie) is registering your address with authorities. For non-EU citizens, you will also need a residence permit (karta pobytu) to stay legally beyond your visa.',
        whyItMatters: 'EU citizens: Zameldowanie is technically required but rarely enforced. However, it makes getting PESEL easier. Non-EU citizens: A residence permit is REQUIRED to live and work legally.',
        howToDoIt: [
          {
            step: 1,
            title: 'EU Citizens - Register your address',
            details: 'Visit your district Urzad Dzielnicy with: passport, rental contract, landlord consent form (some offices require this). You can do this when getting PESEL.'
          },
          {
            step: 2,
            title: 'Non-EU - Gather documents for residence permit',
            details: 'You need: Completed application, 4 photos, Passport plus copies, Proof of accommodation, Health insurance, Proof of income/employment, Work permit (if applicable)'
          },
          {
            step: 3,
            title: 'Non-EU - Submit at Urzad Wojewodzki',
            details: 'Book appointment at mazowieckie.pl (for Warsaw). Submit ALL documents. Pay the fee (340-640 PLN depending on permit type).'
          },
          {
            step: 4,
            title: 'Wait and collect',
            details: 'Processing takes 1-6 months (often longer). Check status online. Once approved, collect your karta pobytu (residence card) in person.'
          }
        ],
        whatNext: 'With your residence permit, you can work legally, travel within Schengen, and access public services. Renew 3 months before expiry!',
        proTips: [
          'Start the process EARLY - delays are common',
          'Keep copies of EVERYTHING you submit',
          'The stamp in your passport lets you stay while waiting',
          'Consider hiring an immigration lawyer for complex cases'
        ],
        sources: [
          { name: 'Mazowieckie Urzad', url: 'https://mazowieckie.pl' },
          { name: 'Gov.pl Foreigners', url: 'https://www.gov.pl/web/udsc-en' }
        ]
      }
    },
    {
      id: 'contracts',
      icon: '📝',
      title: 'Rental Contract Review',
      shortDesc: 'Red flags and what to watch for',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'A rental contract (umowa najmu) is a legal agreement between you and your landlord. In Poland, contracts are usually in Polish, which puts expats at a disadvantage.',
        whyItMatters: 'Bad contracts can let landlords evict you with no notice, keep your entire deposit unfairly, charge you for damages that do not exist, or lock you in with huge penalties.',
        howToDoIt: [
          {
            step: 1,
            title: 'Get it translated (at least key sections)',
            details: 'Use Google Translate for a rough version, but for signing, get key sections properly translated. Focus on: payment terms, deposit conditions, termination clauses.'
          },
          {
            step: 2,
            title: 'Check these RED FLAGS',
            details: 'Deposit over 2 months rent (1-2 is normal). No clear deposit return conditions. Landlord can terminate with less than 1 month notice. You cannot terminate early.'
          },
          {
            step: 3,
            title: 'Negotiate before signing',
            details: 'You CAN negotiate. Common changes: reducing notice period, clarifying deposit return (should be within 30 days), adding inventory list.'
          },
          {
            step: 4,
            title: 'Document everything at move-in',
            details: 'Take photos/videos of EVERYTHING. Note existing damage. Get a signed inventory list. This protects your deposit when you leave.'
          }
        ],
        whatNext: 'Keep your signed contract safe. Pay rent on time and keep receipts. When leaving, give proper notice and request a final inspection.',
        proTips: [
          'Protokol zdawczo-odbiorczy (handover protocol) is your best friend',
          'Always pay rent by bank transfer (proof of payment)',
          'Join expat groups to check if a landlord has a bad reputation'
        ],
        sources: [
          { name: 'Polish Tenant Rights', url: 'https://www.gov.pl/web/sprawiedliwosc' }
        ]
      }
    },
    {
      id: 'lawyers',
      icon: '⚖️',
      title: 'English-Speaking Lawyers',
      shortDesc: 'Legal help when you need it',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'Sometimes you need professional legal help - for immigration issues, contract disputes, employment problems, or starting a business.',
        whyItMatters: 'Polish law is different from your home country. A good lawyer can speed up immigration cases, protect you from bad contracts, and handle disputes professionally.',
        howToDoIt: [
          {
            step: 1,
            title: 'Identify what type of lawyer you need',
            details: 'Immigration - Immigration specialist. Employment disputes - Labor law. Business/contracts - Civil law. Buying property - Real estate lawyer.'
          },
          {
            step: 2,
            title: 'Find recommendations',
            details: 'Ask in expat Facebook groups (Warsaw Expats, Foreigners in Warsaw). Check Google reviews. Your embassy may have a list.'
          },
          {
            step: 3,
            title: 'Initial consultation',
            details: 'Most lawyers offer free or cheap initial consultations (30 min). Prepare your questions. Bring all relevant documents.'
          },
          {
            step: 4,
            title: 'Agree on scope and fees',
            details: 'Get everything in writing. Immigration cases: 2,000-8,000 PLN typical. Contract review: 500-1,500 PLN. Hourly rates: 200-500 PLN.'
          }
        ],
        whatNext: 'Keep all documents organized. Respond promptly to lawyer requests.',
        proTips: [
          'Adwokat and Radca Prawny are both qualified lawyers in Poland',
          'For document translations, you need a sworn translator, not a lawyer',
          'Many immigration lawyers offer package deals'
        ],
        sources: [
          { name: 'Polish Bar Association', url: 'https://www.adwokatura.pl' }
        ]
      }
    },
    {
      id: 'zus',
      icon: '🏛️',
      title: 'ZUS and Social Security',
      shortDesc: 'Understanding Polish social insurance',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'ZUS is Poland social insurance institution. If you work in Poland, you and your employer pay into ZUS. This covers: healthcare (NFZ), pension, disability, sick leave, and maternity benefits.',
        whyItMatters: 'ZUS contributions give you access to public healthcare (NFZ), future pension rights, paid sick leave (80% of salary), and maternity/paternity leave.',
        howToDoIt: [
          {
            step: 1,
            title: 'For employees (umowa o prace)',
            details: 'Your employer handles everything. They register you with ZUS and deduct contributions from your salary. You get an NFZ card for healthcare.'
          },
          {
            step: 2,
            title: 'For self-employed',
            details: 'You must register with ZUS yourself within 7 days of starting business. First 6 months: preferential rates (around 400 PLN/month). After: full rates (around 1,600 PLN/month).'
          },
          {
            step: 3,
            title: 'For contractors (umowa zlecenie)',
            details: 'Your client should handle ZUS registration. Part-time contractors may have limited benefits.'
          },
          {
            step: 4,
            title: 'Get your ZUS account access',
            details: 'Create account at pue.zus.pl (online portal). You need: PESEL, email, phone. Here you can check contributions and documents.'
          }
        ],
        whatNext: 'Once registered, get your NFZ healthcare card. Check your PUE ZUS account regularly.',
        proTips: [
          'ZUS contributions are tax-deductible',
          'You can check if your employer is paying correctly via PUE ZUS',
          'Your pension is based on total contributions'
        ],
        sources: [
          { name: 'ZUS Official', url: 'https://www.zus.pl' },
          { name: 'PUE ZUS Portal', url: 'https://www.zus.pl/pue' }
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
            ← Back to Get Things Done
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
              <span className="text-4xl">📋</span>
              <h1 className="text-3xl font-bold text-white">Get Things Done</h1>
            </div>
            <p className="text-slate-400 text-lg">
              The essential tasks every expat needs to handle. Step by step, no confusion.
            </p>
          </header>

          <div className="space-y-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className="w-full text-left bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 rounded-xl p-5 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{category.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      {category.title}
                    </h3>
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
        </>
      ) : (
        <article>
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{activeContent.icon}</span>
              <h1 className="text-3xl font-bold text-white">{activeContent.title}</h1>
            </div>
            <p className="text-slate-500 text-sm">Last updated: {activeContent.lastUpdated}</p>
          </header>

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
                    <span className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
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
            <div className="bg-slate-800 border border-emerald-700/50 rounded-lg p-4">
              <p className="text-slate-300 leading-relaxed">{activeContent.content.whatNext}</p>
            </div>
          </section>

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

export default GetThingsDone
