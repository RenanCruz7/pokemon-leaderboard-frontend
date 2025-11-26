import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { NavBar, Footer } from './components/layout'
import { LeaderboardPage } from './features/leaderboard'
import { RunDetailsPage } from './features/run-details'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <Routes>
          <Route path="/" element={<LeaderboardPage />} />
          <Route path="/run/:id" element={<RunDetailsPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
