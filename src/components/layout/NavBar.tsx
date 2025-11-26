export const NavBar = () => {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark bg-component-light/80 dark:bg-component-dark/80 px-4 sm:px-6 lg:px-8 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 text-text-light dark:text-text-dark">
          <span className="material-symbols-outlined text-primary text-3xl">trophy</span>
          <h2 className="text-xl font-bold tracking-tighter">Pokémon Runs DB</h2>
        </div>
      </div>
      <div className="hidden md:flex flex-1 justify-center px-8" />
      <div className="flex flex-1 justify-end gap-4 sm:gap-6">
        <div className="hidden sm:flex items-center gap-6">
          <a className="text-sm font-medium hover:text-primary transition-colors" href="#">Leaderboard</a>
          <a className="text-sm font-medium hover:text-primary transition-colors" href="#">About</a>
        </div>
        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary text-background-dark text-sm font-bold tracking-wide hover:bg-primary/90 transition-colors">
          <span className="truncate">Submit Run</span>
        </button>
      </div>
    </header>
  )
}

export default NavBar
