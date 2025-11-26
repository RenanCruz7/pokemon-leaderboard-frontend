interface RunCardProps {
  gameName: string;
  isMyRun?: boolean;
  time: string;
  pokedex: number;
  team: string[];
  notes: string;
}

export const RunCard = ({
  gameName,
  isMyRun = false,
  time,
  pokedex,
  team,
  notes,
}: RunCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md border-t-4 border-pink-500 p-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-bold text-gray-800">{gameName}</h3>
        {isMyRun && (
          <span className="bg-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Minha Run
          </span>
        )}
      </div>

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-1 text-gray-600">
          <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-xs text-gray-500">Tempo</p>
            <p className="font-semibold">{time}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-gray-600">
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <div>
            <p className="text-xs text-gray-500">Pokédex</p>
            <p className="font-semibold">{pokedex}</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          <p className="text-sm font-semibold text-gray-700">Time Pokemon</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {team.map((pokemon, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full border border-gray-200"
            >
              {pokemon}
            </span>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-600 italic">{notes}</p>
    </div>
  );
};

export default RunCard
