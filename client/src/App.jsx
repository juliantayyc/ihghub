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
import OfficialPanel from './pages/OfficialPanel';
import AdminPanel from './pages/AdminPanel';
import CreateFixture from './components/CreateFixture';
import UpdateFixture from './components/UpdateFixture';
import CreateVenue from './components/CreateVenue';
import UpdateVenue from './components/UpdateVenue';
import UploadVideo from './components/UploadVideo';
import UpdateScore from './components/UpdateScore';
import ChangeUserRole from './components/ChangeUserRole';
import { Route, Routes } from 'react-router-dom';
import EmailVerified from './pages/EmailVerified';
import Register from './pages/Register';
import RegistrationForms from './components/RegistrationForms';
import PlayerRegistration from './components/PlayerRegistration';
import UpdateRegistrationForm from './components/UpdateRegistrationForm';
import ManageRegistrations from './components/ManageRegistrations';
import RegistrationDetailsPage from './components/RegistrationDetailsPage';
import ManagerPanel from './pages/ManagerPanel';
import LineUpForms from './components/LineUpForms';
import SubmitLineUps from './components/SubmitLineUps';
import UpdateLineUps from './components/UpdateLineUps';

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
            path="/venues/*"
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
            path="/email-verified"
            element={<EmailVerified />}
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
            path="/official"
            element={<OfficialPanel />}
          />
          <Route
            path="/admin"
            element={<AdminPanel />}
          />
          <Route
            path="/uploadvideo"
            element={<UploadVideo />}
          />
          <Route
            path="/updatescore"
            element={<UpdateScore />}
          />
          <Route
            path="/createfixture"
            element={<CreateFixture />}
          />
          <Route
            path="/updatefixture"
            element={<UpdateFixture />}
          />
          <Route
            path="/createvenue"
            element={<CreateVenue />}
          />
          <Route
            path="/updatevenue"
            element={<UpdateVenue />}
          />
          <Route
            path="/changeUserRole"
            element={<ChangeUserRole />}
          ></Route>
          <Route
            path="/register"
            element={<Register />}
          ></Route>
          <Route
            path="/registrationForms"
            element={<RegistrationForms />}
          />
          <Route
            path="/submitRegistrationForm"
            element={<PlayerRegistration />}
          />
          <Route
            path="/updateRegistrationForm"
            element={<UpdateRegistrationForm />}
          />
          <Route
            path="/manageRegistrations"
            element={<ManageRegistrations />}
          />
          <Route
            path="/manageRegistrations/:fixtureId"
            element={<RegistrationDetailsPage />}
          />
          <Route
            path="/manager"
            element={<ManagerPanel />}
          ></Route>
          <Route
            path="/lineUpForms"
            element={<LineUpForms />}
          />
          <Route
            path="/submitLineUps"
            element={<SubmitLineUps />}
          />
          <Route
            path="/updateLineUps"
            element={<UpdateLineUps />}
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
