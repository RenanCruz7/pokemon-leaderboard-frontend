import { NavBar, LeaderboardTable, Footer } from './components'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 max-w-7xl mx-auto">
            <div className="flex flex-col gap-1 text-center">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tighter">Pokémon Runs Leaderboard</h1>
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-base">Check out the best times submitted by the community.</p>
            </div>
            <LeaderboardTable />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
