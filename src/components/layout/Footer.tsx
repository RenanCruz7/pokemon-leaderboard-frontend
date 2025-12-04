import { memo } from 'react';

export const Footer = memo(() => {
  return (
    <footer className="w-full border-t border-border-light dark:border-border-dark bg-component-light dark:bg-component-dark mt-12">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">© 2024 Pokémon Runs DB. All rights reserved.</p>
        <div className="flex gap-4 text-text-secondary-light dark:text-text-secondary-dark">
          <a className="hover:text-primary" href="#">Terms of Service</a>
          <a className="hover:text-primary" href="#">Contact</a>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
