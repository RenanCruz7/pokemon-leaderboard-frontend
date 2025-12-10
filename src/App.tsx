import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { NavBar, Footer } from './components/layout';
import { ToastContainer } from './components/ui/ToastContainer';
import { LeaderboardPage } from './features/leaderboard';
import { RunDetailsPage } from './features/run-details';
import { SubmitRunPage } from './features/submit-run';
import { LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage } from './features/auth';
import { EditProfilePage } from './features/profile/EditProfilePage';
import { MyRunsPage } from './features/my-runs';
import { StatsPage } from './features/stats';
import { MovesPage } from './features/moves';
import { PokemonPage } from './features/pokemon';

export const App = () => {
  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <NavBar />
          <Routes>
            <Route path="/" element={<LeaderboardPage />} />
            <Route path="/run/:id" element={<RunDetailsPage />} />
            <Route path="/submit" element={<SubmitRunPage />} />
            <Route path="/my-runs" element={<MyRunsPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/moves" element={<MovesPage />} />
            <Route path="/pokemon" element={<PokemonPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/profile" element={<EditProfilePage />} />
          </Routes>
          <Footer />
          <ToastContainer />
          </div>
        </Router>
      </ToastProvider>
  );
};
