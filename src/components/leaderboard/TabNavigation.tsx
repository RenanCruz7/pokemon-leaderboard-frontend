interface TabNavigationProps {
  activeTab: 'minhas' | 'todas';
  onTabChange: (tab: 'minhas' | 'todas') => void;
}

export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="flex justify-center gap-4 mb-8">
      <button
        onClick={() => onTabChange('minhas')}
        className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
          activeTab === 'minhas'
            ? 'bg-pink-600 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        Minhas Runs
      </button>
      <button
        onClick={() => onTabChange('todas')}
        className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
          activeTab === 'todas'
            ? 'bg-pink-600 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        Todas as Runs
      </button>
    </div>
  );
};

export default TabNavigation
