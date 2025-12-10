import { LeaderboardTable } from './LeaderboardTable';

export const LeaderboardPage = () => {
  return (
    <div className="flex-1">
      {/* Leaderboard Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LeaderboardTable />
      </div>
    </div>
  );
};
