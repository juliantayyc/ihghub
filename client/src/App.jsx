import ButtonGradient from './assets/svg/ButtonGradient';
import Home from './pages/Home';
import Fixtures from './pages/Fixtures';
import Venues from './pages/Venues';
import VenueDetails from './components/VenueDetails';
import Footer from './components/Footer';
import Header from './components/Header';
import NotFound from './pages/NotFound';
import NotYetAdded from './pages/NotYetAdded';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Live from './pages/Live';
import GameDetail from './components/GameDetail';
import GameSummary from './components/GameSummary';
import AdminPanel from './components/AdminPanel';
import { Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Routes>
          {/* Client side routes */}
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/home"
            element={<Home />}
          />
          <Route
            path="/fixtures"
            element={<Fixtures />}
          />
          <Route
            path="/venues"
            element={<Venues />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/signup"
            element={<Signup />}
          />
          <Route
            path="/venues/:id"
            element={<VenueDetails />}
          />
          <Route
            path="/live"
            element={<Live />}
          />
          <Route
            path="/game/:id"
            element={<GameDetail />}
          />
          <Route
            path="/summary/:id"
            element={<GameSummary />}
          />
          <Route
            path="/admin"
            element={<AdminPanel />}
          />
          {/* 501 page */}

          {/* 404 page */}
          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
        <Footer />
      </div>
      <ButtonGradient />
    </>
  );
};

export default App;
