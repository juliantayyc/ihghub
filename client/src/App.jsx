import ButtonGradient from './assets/svg/ButtonGradient';
import Home from './pages/Home';
import Fixtures from './pages/Fixtures';
import Footer from './components/Footer';
import Header from './components/Header';
import NotFound from './pages/NotFound';
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
