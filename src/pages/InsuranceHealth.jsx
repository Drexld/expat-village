import { Link } from 'react-router-dom'
import { useState } from 'react'

function InsuranceHealth() {
  const [activeCategory, setActiveCategory] = useState(null)

  const categories = [
    {
      id: 'nfz',
      icon: '🏥',
      title: 'NFZ Public Healthcare',
      shortDesc: 'Free healthcare if you qualify - here is how',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'NFZ (Narodowy Fundusz Zdrowia) is Poland public healthcare system. If you are employed or pay ZUS contributions, you get free access to public hospitals, clinics, and GPs. Think of it like the NHS in UK or public healthcare in other EU countries.',
        whyItMatters: 'With NFZ: Free GP visits, hospital stays, specialists (with referral), prescriptions at reduced prices, emergency care. Without NFZ: You pay full price for everything, which can be very expensive for serious treatment.',
        howToDoIt: [
          {
            step: 1,
            title: 'Check if you are covered',
            details: 'You are covered if: You work on umowa o prace (employment contract), Your employer pays ZUS, You are self-employed and pay ZUS, You are an EU citizen with EHIC card, You are a student with insurance from your country.'
          },
          {
            step: 2,
            title: 'Get your NFZ confirmation',
            details: 'Log into PUE ZUS (pue.zus.pl) with your PESEL. Download your insurance confirmation (potwierdzenie ubezpieczenia). You can also request it from your employer HR department.'
          },
          {
            step: 3,
            title: 'Register with a local clinic (przychodnia)',
            details: 'Find a clinic near you that accepts NFZ patients. Bring: PESEL, ID, NFZ confirmation. Fill out a declaration choosing your GP (lekarz pierwszego kontaktu). You can change GP twice per year.'
          },
          {
            step: 4,
            title: 'Book appointments',
            details: 'Call your clinic or use the IKP app (Internetowe Konto Pacjenta) to book. For specialists, you need a referral (skierowanie) from your GP first, except for: gynecologist, dentist, dermatologist, psychiatrist, oncologist.'
          }
        ],
        whatNext: 'Download the IKP app (mojeIKP) - it shows your prescriptions, referrals, and lets you book appointments. Keep your NFZ confirmation saved on your phone.',
        proTips: [
          'IKP app is available in English - very useful for tracking everything',
          'Waiting times for specialists can be long (weeks to months)',
          'For emergencies, go to SOR (hospital emergency) - always free',
          'E-recepta (e-prescription) means pharmacy can find it with just your PESEL',
          'EU citizens: Your EHIC card works for temporary stays, but register properly if living here'
        ],
        sources: [
          { name: 'NFZ Official', url: 'https://www.nfz.gov.pl' },
          { name: 'IKP Patient Portal', url: 'https://pacjent.gov.pl' }
        ]
      }
    },
    {
      id: 'private-health',
      icon: '🩺',
      title: 'Private Health Insurance',
      shortDesc: 'Faster access, English-speaking doctors',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'Private health insurance (prywatne ubezpieczenie zdrowotne) gives you access to private clinics and hospitals. You pay a monthly fee and get faster appointments, English-speaking staff, and nicer facilities.',
        whyItMatters: 'NFZ is good but slow. Private insurance means: Same-day or next-day appointments, English-speaking doctors, No referrals needed for specialists, Modern facilities, Shorter waiting times for procedures.',
        howToDoIt: [
          {
            step: 1,
            title: 'Understand your options',
            details: 'Two main types: Medical packages (abonament medyczny) - monthly fee, unlimited visits to network clinics. Traditional insurance - you pay, then claim back. Most expats prefer packages for simplicity.'
          },
          {
            step: 2,
            title: 'Compare the main providers',
            details: 'Medicover - Largest network, good English support, 150-400 PLN/month. LuxMed - Very popular, wide coverage, 150-350 PLN/month. Enel-Med - Good value, solid network, 120-300 PLN/month. PZU Zdrowie - Insurance giant, good for families.'
          },
          {
            step: 3,
            title: 'Check what is included',
            details: 'Basic packages cover: GP visits, basic specialists, standard tests. Better packages add: All specialists, hospital stays, dental, mental health, rehabilitation. Read the exclusions carefully - pre-existing conditions may not be covered initially.'
          },
          {
            step: 4,
            title: 'Sign up online or through employer',
            details: 'Many employers offer private healthcare as a benefit - ask HR! If buying yourself, you can sign up online. Most have English websites. You usually get access within a few days.'
          }
        ],
        whatNext: 'Download your provider app (Medicover, LuxMed, etc.). Book a registration visit to set up your profile. Find English-speaking doctors in the app.',
        proTips: [
          'Employer-provided insurance is often much cheaper than individual',
          'Medicover and LuxMed apps let you filter by English-speaking doctors',
          'You can have BOTH NFZ and private - use private for convenience, NFZ for major surgery',
          'Family packages often offer better value than individual plans',
          'Some packages include dental - worth it if you need regular checkups'
        ],
        sources: [
          { name: 'Medicover', url: 'https://www.medicover.pl' },
          { name: 'LuxMed', url: 'https://www.luxmed.pl' },
          { name: 'Enel-Med', url: 'https://www.enel.pl' }
        ]
      }
    },
    {
      id: 'home-insurance',
      icon: '🏠',
      title: 'Apartment & Contents Insurance',
      shortDesc: 'Protect your stuff and your liability',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'Home insurance (ubezpieczenie mieszkania) covers damage to your apartment and belongings. There are two types: building insurance (for owners) and contents insurance (for renters). Many landlords require tenants to have liability insurance.',
        whyItMatters: 'Without insurance: If you flood your neighbor below, YOU pay for their damages (can be thousands). If your laptop is stolen, you lose it. If there is a fire, you lose everything. Insurance costs 200-500 PLN per year - worth it.',
        howToDoIt: [
          {
            step: 1,
            title: 'Understand what you need',
            details: 'Renters typically need: OC (liability insurance) - covers damage you cause to others, Contents insurance - covers your belongings. Owners also need: Building insurance - covers the structure itself.'
          },
          {
            step: 2,
            title: 'Check your rental contract',
            details: 'Many landlords require OC (liability) insurance. Some require proof before you move in. Check what is required and the minimum coverage amount. Usually 50,000-100,000 PLN liability coverage is expected.'
          },
          {
            step: 3,
            title: 'Compare providers',
            details: 'Main insurers: PZU - largest Polish insurer, reliable. Warta - good online process. Allianz - international, English support. Generali - good expat options. LINK4 - budget-friendly online option. Prices: 200-600 PLN/year for basic coverage.'
          },
          {
            step: 4,
            title: 'Buy online or through agent',
            details: 'Most insurers offer online purchase (some in English). You will need: Address, Apartment size (m2), Value of contents, Your PESEL. Policy starts immediately or from your chosen date. You get a PDF policy document.'
          }
        ],
        whatNext: 'Save your policy document. Send a copy to your landlord if required. Set a calendar reminder to renew before expiry. Take photos of valuable items as proof of ownership.',
        proTips: [
          'OC (liability) is the most important for renters - covers expensive accidents',
          'Contents insurance value: estimate what it would cost to replace everything',
          'Some policies cover theft only with forced entry - check the terms',
          'Bike theft can be added as an extra - useful in Warsaw',
          'Keep receipts for expensive electronics as proof of value'
        ],
        sources: [
          { name: 'PZU', url: 'https://www.pzu.pl' },
          { name: 'Warta', url: 'https://www.warta.pl' }
        ]
      }
    },
    {
      id: 'travel-insurance',
      icon: '✈️',
      title: 'Travel & Visa Insurance',
      shortDesc: 'Required for visas and smart for trips',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'Travel insurance covers medical emergencies, trip cancellation, and lost luggage when traveling. For non-EU citizens, specific travel insurance is often REQUIRED for visa applications (Schengen visa requires minimum 30,000 EUR medical coverage).',
        whyItMatters: 'For visa applications: No valid insurance = visa rejected. For travel: Medical emergency abroad without insurance can cost tens of thousands. Even within EU, your NFZ may not cover everything in other countries.',
        howToDoIt: [
          {
            step: 1,
            title: 'For Schengen visa applications',
            details: 'Requirements: Minimum 30,000 EUR medical coverage, Valid for entire stay + buffer days, Must cover all Schengen countries, Must include repatriation. Get this BEFORE your visa appointment.'
          },
          {
            step: 2,
            title: 'For regular travel from Poland',
            details: 'EU travel: EHIC/EKUZ card covers public healthcare basics. But get travel insurance too for: Private treatment, Repatriation, Trip cancellation, Lost luggage. Non-EU travel: Travel insurance is essential.'
          },
          {
            step: 3,
            title: 'Compare options',
            details: 'For visa insurance: AXA Schengen, Allianz Travel, ERV (Europaische). For regular travel: Your bank may include it with premium cards, Compare on rankomat.pl or ubea.pl. Annual policies are cheaper if you travel often.'
          },
          {
            step: 4,
            title: 'Purchase and keep documents ready',
            details: 'Buy online - instant policy document via email. For visa: Print the policy for your appointment. For travel: Keep digital copy on phone, Share with travel companion. Check claim process BEFORE you need it.'
          }
        ],
        whatNext: 'For regular travel, check if your credit card includes travel insurance (many premium cards do). Get EKUZ card for EU travel (free for NFZ members).',
        proTips: [
          'EKUZ (European Health Insurance Card) is free - apply at NFZ',
          'Schengen visa insurance must specifically state Schengen coverage',
          'Annual multi-trip policies save money if you travel 3+ times per year',
          'Check if extreme sports are covered - many basic policies exclude them',
          'COVID coverage: Most policies now include it, but verify'
        ],
        sources: [
          { name: 'EKUZ Application', url: 'https://www.nfz.gov.pl/dla-pacjenta/ekuz/' },
          { name: 'AXA Schengen', url: 'https://www.axa-schengen.com' }
        ]
      }
    },
    {
      id: 'dental',
      icon: '🦷',
      title: 'Dental Care',
      shortDesc: 'Finding good dentists without breaking the bank',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'Dental care in Poland can be through NFZ (limited, basic care) or private dentists. Most expats use private dentists because NFZ dental is very limited and waitlists are long. Good news: Private dental in Poland is much cheaper than Western Europe.',
        whyItMatters: 'NFZ dental covers basics but with long waits and limited materials. Private dental means: Modern equipment, English-speaking dentists available, No waiting months for appointments, Better materials and techniques.',
        howToDoIt: [
          {
            step: 1,
            title: 'Understand your options',
            details: 'NFZ dental: Free but limited (basic fillings, extractions), long waits, may use older materials. Private dental: Pay per visit or get dental insurance, immediate appointments, modern care. Many expats go fully private for dental.'
          },
          {
            step: 2,
            title: 'Find a good dentist',
            details: 'Ask in expat Facebook groups for recommendations. Check Google reviews. Look for clinics advertising English-speaking staff. Areas with many expats (Mokotow, Srodmiescie) have more English-friendly options.'
          },
          {
            step: 3,
            title: 'Understand typical costs',
            details: 'Checkup and cleaning: 150-300 PLN. Basic filling: 150-400 PLN. Root canal: 500-1500 PLN. Crown: 800-2000 PLN. Whitening: 500-1500 PLN. These are much cheaper than UK, US, or Western Europe.'
          },
          {
            step: 4,
            title: 'Consider dental packages',
            details: 'Medicover and LuxMed offer dental add-ons to health packages. Some standalone dental plans exist. Worth it if you need regular work. Basic dental package: 50-100 PLN/month extra.'
          }
        ],
        whatNext: 'Book a checkup to establish with a dentist before you have an emergency. Ask about payment plans for major work.',
        proTips: [
          'Dental tourism is a thing - Poland is a destination for Europeans seeking cheaper dental',
          'Get a treatment plan in writing before major work',
          'Some dentists offer payment in installments for expensive procedures',
          'NFZ dental is fine for emergencies like extractions',
          'Keep receipts - dental may be tax deductible in some cases'
        ],
        sources: [
          { name: 'Medicover Dental', url: 'https://www.medicover.pl/stomatologia/' },
          { name: 'LuxMed Dental', url: 'https://www.luxmed.pl/stomatologia' }
        ]
      }
    },
    {
      id: 'mental-health',
      icon: '🧠',
      title: 'Mental Health Support',
      shortDesc: 'Therapy and psychiatry in English',
      lastUpdated: 'January 2025',
      content: {
        whatIsIt: 'Mental health services in Poland include psychiatrists (who can prescribe medication) and psychologists/therapists (talk therapy). Both NFZ and private options exist, but English-speaking providers are mainly in the private sector.',
        whyItMatters: 'Moving abroad is stressful. Culture shock, language barriers, and being far from family can affect mental health. Having support available in your language matters. Poland mental health services have improved significantly in recent years.',
        howToDoIt: [
          {
            step: 1,
            title: 'Know the difference',
            details: 'Psychiatrist (psychiatra): Medical doctor, can diagnose and prescribe medication, needed for conditions like depression, anxiety, ADHD. Psychologist/Therapist: Talk therapy, cannot prescribe, great for stress, life transitions, ongoing support.'
          },
          {
            step: 2,
            title: 'Find English-speaking providers',
            details: 'Medicover and LuxMed have English-speaking mental health professionals. Search Psychology Today Poland (psychologytoday.com/pl) - filter by language. Ask expat groups for recommendations. Online therapy is also an option.'
          },
          {
            step: 3,
            title: 'Understand costs and coverage',
            details: 'NFZ covers psychiatry (with referral and long waits) and limited therapy. Private psychiatrist: 200-500 PLN per visit. Private therapy: 150-350 PLN per session. Some insurance packages include mental health - check yours.'
          },
          {
            step: 4,
            title: 'Book and prepare',
            details: 'First appointment is usually assessment (longer, more expensive). Be honest about your history and current situation. Ask about their approach and experience with expats. Online sessions are widely available and accepted.'
          }
        ],
        whatNext: 'Do not wait until crisis to find a therapist. Having someone established makes difficult times easier. Many therapists offer a free initial call to check fit.',
        proTips: [
          'No referral needed for psychiatrist or psychologist (unlike other specialists)',
          'Online therapy works well and gives you more English-speaking options',
          'Some employers offer EAP (Employee Assistance Programs) with free sessions',
          'Medication names may differ from your home country - bring documentation',
          'Polish pharmacies can fill psychiatric prescriptions from other EU countries'
        ],
        sources: [
          { name: 'Psychology Today Poland', url: 'https://www.psychologytoday.com/pl' },
          { name: 'Centrum Psyche (English)', url: 'https://centrumpsyche.pl/en/' }
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
            ← Back to Insurance & Health
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
              <span className="text-4xl">🏥</span>
              <h1 className="text-3xl font-bold text-white">Insurance & Health</h1>
            </div>
            <p className="text-slate-400 text-lg">
              Understanding healthcare in Poland does not have to be confusing. Here is everything you need to stay covered.
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

          <div className="mt-8 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <p className="text-slate-400 text-sm">
              💡 <strong className="text-slate-300">Tip:</strong> Most expats use a combination of NFZ (for major procedures) and private insurance (for convenience). You do not have to choose just one.
            </p>
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

export default InsuranceHealth
