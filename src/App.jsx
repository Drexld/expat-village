import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import GetThingsDone from './pages/GetThingsDone'
import InsuranceHealth from './pages/InsuranceHealth'
import JobsCareers from './pages/JobsCareers'
import LiveYourLife from './pages/LiveYourLife'
import Housing from './pages/Housing'
import TownHall from './pages/TownHall'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="get-things-done" element={<GetThingsDone />} />
          <Route path="insurance-health" element={<InsuranceHealth />} />
          <Route path="/jobs-careers" element={<JobsCareers />} />
          <Route path="live-your-life" element={<LiveYourLife />} />
          <Route path="housing" element={<Housing />} />
          <Route path="town-hall" element={<TownHall />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App