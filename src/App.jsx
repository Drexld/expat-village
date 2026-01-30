// src/App.jsx
// ============
// Main application file with routing and auth

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import MainLayout from './layouts/MainLayout'

// Main Pages
import Home from './pages/Home'
import GetThingsDone from './pages/GetThingsDone'
import InsuranceHealth from './pages/InsuranceHealth'
import Housing from './pages/Housing'
import JobsCareers from './pages/JobsCareers'
import LiveYourLife from './pages/LiveYourLife'
import GettingAround from './pages/GettingAround'
import About from './pages/About'
import Privacy from './pages/Privacy'

// Interactive Features
import TownHall from './pages/TownHall'
import MyChecklist from './pages/MyChecklist'
import ContractAnalyzer from './pages/ContractAnalyzer'
import DocumentAnalyzer from './pages/DocumentAnalyzer'
import PersonalityOnboarding from './pages/PersonalityOnboarding'
import VillageVibes from './pages/VillageVibes'
import StudentHub from './pages/StudentHub'
import Directory from './pages/Directory'
import Rewards from './pages/Rewards'
import Alerts from './pages/Alerts'

import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Home */}
            <Route index element={<Home />} />
            
            {/* Main Sections */}
            <Route path="get-things-done" element={<GetThingsDone />} />
            <Route path="insurance-health" element={<InsuranceHealth />} />
            <Route path="housing" element={<Housing />} />
            <Route path="jobs-careers" element={<JobsCareers />} />
            <Route path="live-your-life" element={<LiveYourLife />} />
            <Route path="getting-around" element={<GettingAround />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            
            {/* Interactive Features */}
            <Route path="town-hall" element={<TownHall />} />
            <Route path="my-checklist" element={<MyChecklist />} />
            <Route path="contract-analyzer" element={<ContractAnalyzer />} />
            <Route path="document-analyzer" element={<DocumentAnalyzer />} />
            <Route path="onboarding" element={<PersonalityOnboarding />} />
            <Route path="village-vibes" element={<VillageVibes />} />
            <Route path="student-hub" element={<StudentHub />} />
            <Route path="directory" element={<Directory />} />
            <Route path="rewards" element={<Rewards />} />
            <Route path="alerts" element={<Alerts />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
