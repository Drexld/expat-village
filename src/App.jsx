// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/AuthContext'
import ScrollToTop from './components/ScrollToTop'
import { useDeviceDetection } from './hooks/useDeviceDetection'

// Layouts
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'

// Admin Components
import AdminRoute from './components/AdminRoute'

// Pages
import Home from './pages/Home'
import About from './pages/About'
import Privacy from './pages/Privacy'
import DesktopRedirect from './pages/DesktopRedirect'
import ExpatOnboarding from './pages/ExpatOnboarding'

// Main Sections
import GetThingsDone from './pages/GetThingsDone'
import InsuranceHealth from './pages/InsuranceHealth'
import Housing from './pages/Housing'
import JobsCareers from './pages/JobsCareers'
import LiveYourLife from './pages/LiveYourLife'
import GettingAround from './pages/GettingAround'

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
import Settings from './pages/Settings'
import Pricing from './pages/Pricing'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminAnnouncements from './pages/admin/Announcements'
import AdminAlerts from './pages/admin/Alerts'
import AdminListings from './pages/admin/Listings'
import AdminDirectoryListings from './pages/admin/DirectoryListings'
import AdminUsers from './pages/admin/Users'

import './App.css'

// Component to check device and redirect desktop users
function DeviceCheck({ children }) {
  const { isDesktop, isChecking } = useDeviceDetection()

  // Check if user has bypassed the redirect
  const hasBypassed = localStorage.getItem('bypass_desktop_redirect') === 'true'

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="min-h-screen bg-terra-bg flex items-center justify-center">
        <div className="text-terra-primary">Loading...</div>
      </div>
    )
  }

  // Redirect desktop users to desktop page (unless bypassed)
  if (isDesktop && !hasBypassed) {
    return <Navigate to="/desktop" replace />
  }

  return children
}

function HomeEntry() {
  const { loading, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-terra-bg flex items-center justify-center">
        <div className="text-terra-primary">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/expat-onboarding" replace />
  }

  return <Home />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Desktop redirect page (no MainLayout) */}
          <Route path="/desktop" element={<DesktopRedirect />} />
          <Route path="/expat-onboarding" element={<ExpatOnboarding />} />
          <Route path="/spark-onboarding" element={<Navigate to="/expat-onboarding" replace />} />
          <Route path="/explore" element={<Navigate to="/live-your-life" replace />} />

          {/* Admin routes (protected, separate layout) */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
            <Route path="alerts" element={<AdminAlerts />} />
            <Route path="listings" element={<AdminListings />} />
            <Route path="directory" element={<AdminDirectoryListings />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>

          {/* Main app routes with device check */}
          <Route path="/" element={<DeviceCheck><MainLayout /></DeviceCheck>}>
            {/* Home */}
            <Route index element={<HomeEntry />} />
            
            {/* About & Legal */}
            <Route path="about" element={<About />} />
            <Route path="privacy" element={<Privacy />} />
            
            {/* Main Sections */}
            <Route path="get-things-done" element={<GetThingsDone />} />
            <Route path="insurance-health" element={<InsuranceHealth />} />
            <Route path="housing" element={<Housing />} />
            <Route path="jobs-careers" element={<JobsCareers />} />
            <Route path="live-your-life" element={<LiveYourLife />} />
            <Route path="getting-around" element={<GettingAround />} />
            
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
            <Route path="settings" element={<Settings />} />
            <Route path="pricing" element={<Pricing />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
