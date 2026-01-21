import { Link } from 'react-router-dom'
import { useState } from 'react'

function JobsCareers() {
  const [activeCategory, setActiveCategory] = useState(null)

  const categories = [
    {
      id: 'work-permits',
      icon: '📄',
      title: 'Work Permits & Visas',
      shortDesc: 'Legal requirements for working in Poland',
      lastUpdated: 'January 2025',
      isImportant: true,
      content: {
        whatIsIt: 'To work legally in Poland, non-EU citizens need a work permit (zezwolenie na pracę) or a residence permit with work authorization. EU/EEA citizens can work freely but should register their stay. The rules depend on your nationality, job type, and how long you plan to stay.',
        whyItMatters: 'Working without proper authorization is illegal and can result in deportation, fines, and being banned from Poland/Schengen. Your employer can also face serious penalties. Getting this right protects you and your career.',
        steps: [
          {
            step: 1,
            title: 'Determine your status',
            details: 'EU/EEA/Swiss citizens: You can work immediately, just register stay after 3 months. Non-EU: You need either a work permit (employer applies) or a single permit (combines residence + work). Some nationalities qualify for simplified procedures.'
          },
          {
            step: 2,
            title: 'Employer initiates work permit',
            details: 'Your employer must apply for your work permit at the Voivodeship Office (Urząd Wojewódzki). They need to prove no Polish/EU candidate was available (labor market test). Processing takes 1-3 months typically.'
          },
          {
            step: 3,
            title: 'Apply for residence permit',
            details: 'Once you have a work permit (or apply for single permit), submit your residence application at Urząd Wojewódzki. You\'ll need: passport, photos, proof of accommodation, health insurance, work permit/contract, and fees (~440 PLN).'
          },
          {
            step: 4,
            title: 'Collect your card',
            details: 'After approval (can take 3-6 months), you\'ll get a residence card (karta pobytu). This is your ID in Poland - carry it always. It shows your work authorization and validity period.'
          }
        ],
        whatNext: 'Keep track of your permit expiration dates - start renewal 3-4 months before expiry. If changing employers, you may need a new work permit. Consider applying for permanent residence after 5 years.',
        proTips: [
          'IT specialists and some professions have simplified "oświadczenie" procedure - much faster',
          'Ukrainian citizens have special rules since 2022 - check current regulations',
          'Blue Card (Niebieska Karta) is available for highly-skilled workers - better conditions',
          'Keep copies of ALL documents - originals can get lost in bureaucracy',
          'Use an immigration lawyer for complex cases - worth the 500-2000 PLN fee'
        ],
        sources: [
          { name: 'Gov.pl Work Permits', url: 'https://www.gov.pl/web/uw-mazowiecki/zezwolenie-na-prace' },
          { name: 'Migrant.info.pl', url: 'https://www.migrant.info.pl/work-permit.html' },
          { name: 'EU Blue Card Poland', url: 'https://www.gov.pl/web/uw-mazowiecki/niebieska-karta-ue' }
        ]
      }
    },
    {
      id: 'job-hunting',
      icon: '🔍',
      title: 'Job Hunting in Poland',
      shortDesc: 'Where to find jobs and how to apply',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'The Polish job market is active, especially in IT, finance, shared services, and manufacturing. Warsaw, Kraków, Wrocław, and Gdańsk are the main hubs. English-speaking roles exist but Polish language opens many more doors.',
        whyItMatters: 'Knowing where to look and how Polish recruitment works saves you months of frustration. The process differs from Western countries - personal connections matter more, and some great jobs are never publicly advertised.',
        steps: [
          {
            step: 1,
            title: 'Set up your profiles',
            details: 'LinkedIn is essential - Polish recruiters use it heavily. Also create profiles on Pracuj.pl (biggest Polish job board), NoFluffJobs (IT), JustJoin.it (IT/tech), and RocketJobs (startups/marketing).'
          },
          {
            step: 2,
            title: 'Target the right companies',
            details: 'Multinationals and shared service centers (SSC/BPO) often hire English speakers: Google, Amazon, Goldman Sachs, HSBC, Shell, and hundreds more have offices in Poland. Search "SSC Poland" for lists.'
          },
          {
            step: 3,
            title: 'Apply strategically',
            details: 'Customize your CV for each role (Polish employers notice). Write cover letters even if "optional." Apply directly on company websites when possible - better than job boards. Follow up after 1-2 weeks.'
          },
          {
            step: 4,
            title: 'Prepare for interviews',
            details: 'Expect 2-4 interview rounds: HR screening, technical/skills test, hiring manager, sometimes team fit. Video calls are common for initial rounds. Research the company thoroughly - Poles appreciate preparation.'
          }
        ],
        whatNext: 'Network actively - attend meetups, join LinkedIn groups, connect with recruiters. Many jobs are filled through referrals. Update your LinkedIn weekly to stay visible in recruiter searches.',
        proTips: [
          'NoFluffJobs shows salary ranges upfront - rare in Poland, use it to benchmark',
          'Recruiters on LinkedIn are aggressive - set your status to "Open to Work" privately',
          'Contract types matter: Umowa o pracę (employment) vs B2B (freelance) - know the difference',
          'Salary negotiations are expected - first offer is rarely final',
          'Check company reviews on GoWork.pl (Polish Glassdoor equivalent)'
        ],
        sources: [
          { name: 'Pracuj.pl', url: 'https://www.pracuj.pl' },
          { name: 'NoFluffJobs', url: 'https://nofluffjobs.com' },
          { name: 'JustJoin.it', url: 'https://justjoin.it' },
          { name: 'LinkedIn Jobs Poland', url: 'https://www.linkedin.com/jobs' }
        ]
      }
    },
    {
      id: 'it-tech-scene',
      icon: '💻',
      title: 'IT & Tech Scene',
      shortDesc: 'Poland\'s booming tech industry explained',
      lastUpdated: 'January 2025',
      featured: true,
      content: {
        whatIsIt: 'Poland is one of Europe\'s top tech hubs with 400,000+ IT professionals. The scene is mature, salaries are competitive (often €4,000-10,000/month for seniors), and English is the working language at most tech companies. Warsaw, Kraków, Wrocław, and Gdańsk lead the market.',
        whyItMatters: 'If you\'re in tech, Poland offers excellent opportunities: lower cost of living than Western Europe, growing startup ecosystem, major tech companies, and a culture that values work-life balance more than Silicon Valley.',
        steps: [
          {
            step: 1,
            title: 'Understand the market',
            details: 'Hot skills: Python, Java, JavaScript/React, cloud (AWS/Azure/GCP), data engineering, DevOps. Remote-friendly culture. B2B contracts dominate senior roles (tax benefits). English-only roles are common.'
          },
          {
            step: 2,
            title: 'Choose your path',
            details: 'Product companies: Allegro, CD Projekt Red, DocPlanner, Booksy. Software houses: STX Next, Netguru, 10Clouds. Big tech: Google, Microsoft, Amazon (all have Poland offices). Startups: Check Startup Poland ecosystem.'
          },
          {
            step: 3,
            title: 'Use tech-specific job boards',
            details: 'NoFluffJobs and JustJoin.it are the go-to sites. Both show salaries and tech stacks. BulldogJob for remote. LinkedIn for senior roles. GitHub Jobs and Stack Overflow for niche positions.'
          },
          {
            step: 4,
            title: 'Negotiate properly',
            details: 'B2B rates are quoted as NET monthly (you handle taxes). Employment (UoP) is quoted GROSS. Always clarify which. B2B typically pays 20-40% more but no paid leave/sick days. Calculate your effective rate.'
          }
        ],
        whatNext: 'Join tech communities: meet.js, Warsaw AI, Python Poland, local AWS/GCP user groups. Attend conferences: Infoshare, Element Talks, local hackathons. Build your network - the Polish tech community is tight-knit.',
        proTips: [
          'Senior devs on B2B can earn 25,000-35,000 PLN/month NET in Warsaw',
          'Most IT roles don\'t require Polish - English is the working language',
          'Remote work is standard - many companies are remote-first post-COVID',
          'B2B vs UoP calculator: kalkulator-b2b.pl shows real take-home differences',
          'Tech recruitment is fast - expect offers within 2-3 weeks of first contact'
        ],
        sources: [
          { name: 'NoFluffJobs', url: 'https://nofluffjobs.com' },
          { name: 'JustJoin.it', url: 'https://justjoin.it' },
          { name: 'Startup Poland', url: 'https://startuppoland.org' },
          { name: 'B2B Calculator', url: 'https://www.kalkulator-b2b.pl' }
        ]
      }
    },
    {
      id: 'freelancing-b2b',
      icon: '🚀',
      title: 'Freelancing & B2B',
      shortDesc: 'Self-employment and contract work in Poland',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'B2B (business-to-business) contracts are extremely popular in Poland, especially in IT. Instead of being an employee, you run your own company (działalność gospodarcza) and invoice your client. It\'s legal, common, and often financially beneficial.',
        whyItMatters: 'B2B can mean 20-40% higher take-home pay compared to employment contracts. But it comes with responsibilities: you handle your own taxes, ZUS contributions, accounting, and have no paid leave. Understanding this system is crucial for maximizing your income.',
        steps: [
          {
            step: 1,
            title: 'Decide if B2B is right for you',
            details: 'B2B pros: Higher net income, tax deductions, flexibility. Cons: No paid vacation (26 days), no paid sick leave, handle your own accounting, less job security. Best for: established professionals earning 15,000+ PLN/month.'
          },
          {
            step: 2,
            title: 'Register your business',
            details: 'Register sole proprietorship (JDG) at CEIDG.gov.pl - it\'s free and can be done online (if you have Polish ID) or at the local Urząd Miasta. Choose your PKD codes (business activity types) carefully.'
          },
          {
            step: 3,
            title: 'Set up accounting',
            details: 'Hire an accountant (księgowa) - costs 200-500 PLN/month for simple businesses. They handle VAT declarations, ZUS filings, annual tax returns. Popular online options: inFakt, Taxe.pl, or traditional local accountants.'
          },
          {
            step: 4,
            title: 'Understand your obligations',
            details: 'ZUS contributions: ~1,600 PLN/month (first 6 months discounted to ~400 PLN). Tax: choose flat 19% (podatek liniowy) or scale (12%/32%). VAT: register if earning over 200,000 PLN/year or if clients require it.'
          }
        ],
        whatNext: 'Track all business expenses (equipment, software, phone, workspace) - they reduce your taxable income. Consider IP Box tax relief if you create software (only 5% tax on qualifying income). Review your setup yearly with your accountant.',
        proTips: [
          'First 6 months: "Ulga na start" = no ZUS. Next 24 months: reduced ZUS (~400 PLN)',
          'IP Box regime can reduce tax to 5% for software developers - ask your accountant',
          'Keep 25-30% of income aside for taxes and ZUS - don\'t get caught short',
          'inFakt app makes invoicing easy - integrates with accounting',
          'You can switch between B2B and employment (UoP) - not locked in forever'
        ],
        sources: [
          { name: 'CEIDG Business Registration', url: 'https://www.biznes.gov.pl/en/firma/doing-business-in-poland' },
          { name: 'ZUS (Social Insurance)', url: 'https://www.zus.pl' },
          { name: 'inFakt', url: 'https://www.infakt.pl' },
          { name: 'B2B Calculator', url: 'https://www.kalkulator-b2b.pl' }
        ]
      }
    },
    {
      id: 'cv-interviews',
      icon: '📝',
      title: 'CV & Interview Tips',
      shortDesc: 'Polish recruitment expectations and how to stand out',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'Polish recruitment has its own norms. CVs should include a photo and personal details (yes, really). Interviews are formal but friendly. Understanding local expectations helps you stand out from other international candidates.',
        whyItMatters: 'Your CV might be great by US/UK standards but miss what Polish recruiters expect. Small adjustments can significantly improve your response rate. Same with interviews - knowing the culture prevents awkward moments.',
        steps: [
          {
            step: 1,
            title: 'Format your CV correctly',
            details: 'Include: professional photo (headshot), date of birth, nationality. 2 pages max. Reverse chronological order. Skills section prominent. RODO clause required: "Wyrażam zgodę na przetwarzanie moich danych osobowych..." (data consent).'
          },
          {
            step: 2,
            title: 'Tailor for each application',
            details: 'Polish recruiters notice generic CVs. Match your skills to job requirements explicitly. Use keywords from the job posting. Quantify achievements (increased sales by 30%, managed team of 5, etc.).'
          },
          {
            step: 3,
            title: 'Prepare for interviews',
            details: 'Research the company thoroughly - Poles appreciate preparation. Prepare questions to ask. Dress formally unless told otherwise (tech is more casual). Be on time - punctuality matters. Bring CV copies.'
          },
          {
            step: 4,
            title: 'Navigate salary discussions',
            details: 'Salary expectations are usually asked early (even in first call). Know your number. Specify: gross or net, employment (UoP) or B2B. Negotiation is expected - first offer isn\'t final. Benefits are negotiable too.'
          }
        ],
        whatNext: 'After interviews, send a brief thank-you email (not common in Poland but makes you memorable). Follow up if you haven\'t heard back in the stated timeframe. Ask for feedback if rejected - most will provide it.',
        proTips: [
          'RODO clause is legally required - CV without it may be rejected automatically',
          'Photos should be professional - business attire, neutral background, recent',
          'Europass CV format is recognized but bland - custom designs stand out more',
          'Language skills: be honest about Polish level - they\'ll test it if relevant',
          '"Why Poland?" - have a good answer ready, you\'ll be asked this often'
        ],
        sources: [
          { name: 'Europass CV Creator', url: 'https://europa.eu/europass/en/create-europass-cv' },
          { name: 'Pracuj.pl Career Advice', url: 'https://porady.pracuj.pl' },
          { name: 'GoWork Company Reviews', url: 'https://www.gowork.pl' }
        ]
      }
    },
    {
      id: 'workplace-culture',
      icon: '🏢',
      title: 'Workplace Culture',
      shortDesc: 'What to expect working in Poland',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'Polish workplace culture blends Western business practices with local traditions. Hierarchy exists but is softening. Work-life balance is valued. The culture differs between Polish companies, multinationals, and startups.',
        whyItMatters: 'Understanding workplace norms helps you integrate faster, avoid misunderstandings, and build better relationships with colleagues. What\'s normal in your home country might be unusual here, and vice versa.',
        steps: [
          {
            step: 1,
            title: 'Understand communication styles',
            details: 'Poles are direct but polite. Feedback is given straightforwardly - don\'t take it personally. Small talk is less common than in US/UK. Emails are formal initially ("Szanowni Państwo" = Dear Sir/Madam). Loosen up once relationships form.'
          },
          {
            step: 2,
            title: 'Know the hierarchy',
            details: 'Titles matter in traditional Polish companies. Use Pan/Pani (Mr/Ms) until invited to use first names. Multinationals are more casual. Decisions may need manager approval even for small things. Patience helps.'
          },
          {
            step: 3,
            title: 'Navigate work-life balance',
            details: 'Standard hours: 8:00-16:00 or 9:00-17:00. Overtime exists but not glorified like US. 26 days paid vacation (employment contract). Poles take summer holidays seriously - August is quiet. Friday afternoons often wind down early.'
          },
          {
            step: 4,
            title: 'Build relationships',
            details: 'Relationships matter for getting things done. Coffee breaks and lunches build bonds. Name day celebrations (imieniny) are a thing - bring cake on yours. Christmas (Wigilia) and company events are important for bonding.'
          }
        ],
        whatNext: 'Learn basic Polish greetings and phrases - colleagues appreciate the effort even if work is in English. Participate in team events. Understand that trust is built over time - Poles warm up once they know you.',
        proTips: [
          'Bringing cake on your birthday/name day is expected - don\'t skip it',
          '"Na Pan/Pani" → "Na ty" transition (formal to informal) is a milestone in relationships',
          'Complaining about work is a Polish bonding ritual - join in moderately',
          'Multinationals often have better benefits but Polish companies may offer more job security',
          'Learn to drink (or politely decline) during work events - it\'s part of culture'
        ],
        sources: [
          { name: 'Culture Atlas - Poland', url: 'https://culturalatlas.sbs.com.au/polish-culture' },
          { name: 'Expat Guide to Polish Business', url: 'https://www.expatfocus.com/poland/guide/working-in-poland' }
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
              <span className="text-4xl">💼</span>
              <h1 className="text-3xl font-bold text-white">Jobs & Careers</h1>
            </div>
            <p className="text-slate-400 text-lg">
              Find work, understand contracts, and build your career in Poland.
            </p>
          </header>

          {/* Work Permit Alert */}
          <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-5 mb-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="text-lg font-semibold text-amber-400 mb-1">Work Authorization Required</h3>
                <p className="text-slate-300 text-sm">
                  Non-EU citizens need a work permit before starting employment. Working illegally risks deportation and bans. Check your requirements first!
                </p>
              </div>
            </div>
          </div>

          {/* IT Scene Promo */}
          <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border border-blue-700/50 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl">💻</span>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-white">Poland's Tech Boom</h3>
                  <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">Hot Market</span>
                </div>
                <p className="text-slate-300 text-sm mb-3">
                  400,000+ IT professionals. Top European tech hub. English-speaking roles. Remote-friendly culture. Senior devs earning €5,000-10,000/month.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded">🐍 Python</span>
                  <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded">⚛️ React</span>
                  <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded">☁️ Cloud</span>
                  <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded">📊 Data</span>
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
                  category.isImportant 
                    ? 'border-amber-700/50 hover:border-amber-600' 
                    : category.featured 
                    ? 'border-blue-700/50 hover:border-blue-600'
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
                      {category.isImportant && (
                        <span className="bg-amber-600 text-white text-xs px-2 py-0.5 rounded-full">Important</span>
                      )}
                      {category.featured && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">Hot</span>
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

          {/* Salary Calculator Promo */}
          <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🧮</span>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-white">Salary Calculator</h3>
                  <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full">Coming Soon</span>
                </div>
                <p className="text-slate-400 text-sm">
                  B2B vs Employment comparison. See your real take-home pay after taxes and ZUS. Compare offers properly.
                </p>
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
              ← Back to Jobs & Careers
            </button>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{activeContent.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold text-white">{activeContent.title}</h1>
                  {activeContent.isImportant && (
                    <span className="bg-amber-600 text-white text-xs px-2 py-0.5 rounded-full">Important</span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-slate-400">Last updated: {activeContent.lastUpdated}</p>
          </header>

          {/* What Is It */}
          <section className="mb-8">
            <h2 className={`text-xl font-semibold mb-3 ${activeContent.isImportant ? 'text-amber-400' : 'text-emerald-400'}`}>What is it?</h2>
            <p className="text-slate-300 leading-relaxed">{activeContent.content.whatIsIt}</p>
          </section>

          {/* Why It Matters */}
          <section className="mb-8">
            <h2 className={`text-xl font-semibold mb-3 ${activeContent.isImportant ? 'text-amber-400' : 'text-emerald-400'}`}>Why it matters</h2>
            <p className="text-slate-300 leading-relaxed">{activeContent.content.whyItMatters}</p>
          </section>

          {/* How To Do It */}
          <section className="mb-8">
            <h2 className={`text-xl font-semibold mb-3 ${activeContent.isImportant ? 'text-amber-400' : 'text-emerald-400'}`}>How to do it</h2>
            <div className="space-y-4">
              {activeContent.content.steps.map((step) => (
                <div key={step.step} className={`bg-slate-800 border rounded-lg p-4 ${
                  activeContent.isImportant ? 'border-amber-700/50' : 'border-slate-700'
                }`}>
                  <div className="flex gap-4">
                    <span className={`w-8 h-8 ${
                      activeContent.isImportant ? 'bg-amber-600' : 'bg-emerald-600'
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
            <h2 className={`text-xl font-semibold mb-3 ${activeContent.isImportant ? 'text-amber-400' : 'text-emerald-400'}`}>What to do next</h2>
            <div className={`bg-slate-800 border rounded-lg p-4 ${
              activeContent.isImportant ? 'border-amber-700/50' : 'border-emerald-700/50'
            }`}>
              <p className="text-slate-300 leading-relaxed">{activeContent.content.whatNext}</p>
            </div>
          </section>

          {/* Pro Tips */}
          <section className="mb-8">
            <h2 className={`text-xl font-semibold mb-3 ${activeContent.isImportant ? 'text-amber-400' : 'text-emerald-400'}`}>Pro Tips</h2>
            <ul className="space-y-2">
              {activeContent.content.proTips.map((tip, index) => (
                <li key={index} className="flex gap-2 text-slate-300">
                  <span className={activeContent.isImportant ? 'text-amber-400' : 'text-emerald-400'}>•</span>
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
                    activeContent.isImportant 
                      ? 'text-amber-400 hover:text-amber-300' 
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

export default JobsCareers
