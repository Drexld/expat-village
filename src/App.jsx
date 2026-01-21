import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import MyChecklist from './pages/MyChecklist'
import GetThingsDone from './pages/GetThingsDone'
import InsuranceHealth from './pages/InsuranceHealth'
import JobsCareers from './pages/JobsCareers'
import LiveYourLife from './pages/LiveYourLife'
import Housing from './pages/Housing'
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
          <Route path="get-things-done" element={<GetThingsDone />} />
          <Route path="insurance-health" element={<InsuranceHealth />} />
          <Route path="/jobs-careers" element={<JobsCareers />} />
          <Route path="live-your-life" element={<LiveYourLife />} />
          <Route path="housing" element={<Housing />} />
          <Route path="/getting-around" element={<GettingAround />} />
          <Route path="town-hall" element={<TownHall />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App