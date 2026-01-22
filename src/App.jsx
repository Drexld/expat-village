import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import PersonalityOnboarding from './pages/PersonalityOnboarding'
import MyChecklist from './pages/MyChecklist'
import Directory from './pages/Directory'
import Rewards from './pages/Rewards'
import Alerts from './pages/Alerts'
import GetThingsDone from './pages/GetThingsDone'
import InsuranceHealth from './pages/InsuranceHealth'
import VillageVibes from './pages/VillageVibes'
import JobsCareers from './pages/JobsCareers'
import StudentHub from './pages/StudentHub'
import LiveYourLife from './pages/LiveYourLife'
import Housing from './pages/Housing'
import ContractAnalyzer from './pages/ContractAnalyzer'
import DocumentAnalyzer from './pages/DocumentAnalyzer'
import GettingAround from './pages/GettingAround'
import TownHall from './pages/TownHall'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/my-checklist" element={<MyChecklist />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/onboarding" element={<PersonalityOnboarding />} />
          <Route path="/village-vibes" element={<VillageVibes />} />
          <Route path="get-things-done" element={<GetThingsDone />} />
          <Route path="insurance-health" element={<InsuranceHealth />} />
          <Route path="/jobs-careers" element={<JobsCareers />} />
          <Route path="/student-hub" element={<StudentHub />} />
          <Route path="live-your-life" element={<LiveYourLife />} />
          <Route path="housing" element={<Housing />} />
          <Route path="/contract-analyzer" element={<ContractAnalyzer />} />
          <Route path="/document-analyzer" element={<DocumentAnalyzer />} />
          <Route path="/getting-around" element={<GettingAround />} />
          <Route path="town-hall" element={<TownHall />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App