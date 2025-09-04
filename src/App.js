import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route , Navigate} from "react-router-dom";

import ScrollTop from "./Client/Component/util/ScrollTop";

import AdminLayout from './Admin/layout/AdminLayout';
import LoginPage from './Admin/Login';
import Dashboard from './Admin/pages/Dashboard';
import FAQ from './Admin/pages/FAQ';
import HealthCenter from './Admin/pages/HealthCenter';
import Contact from './Admin/pages/Contact';
import JobOffers from './Admin/pages/JobOffers';
import People from './Admin/pages/People';
import Appointments from './Admin/pages/Appointments';
import SettingsPage from './Admin/pages/SettingsPage';
import UsersPage from './Admin/pages/Users';
import Services from './Admin/pages/Services';
import Layout from "./Client/Component/Layout/Layout";
import Commencer from "./Client/Component/Commencer";
import QuiSommesNous from "./Client/Component/QuiSommeNous";
import PostesVacants from "./Client/Component/Postvacants";
import PageFAQ from './Client/Component/PageFAQ';
import PageContact from './Client/Component/util/PageContact';
import Formation from "./Client/Component/Performances/Formation";
import Prevention from "./Client/Component/Performances/Prévention";
import TRena from "./Client/Component/Performances/TRena";
import Physiotherapie from "./Client/Component/Performances/Physiothérapie";
import SportsDeReadaptation from "./Client/Component/Performances/SportsDeReadaptation";
import ConseilsNutritionnels from "./Client/Component/Performances/ConseilsNutritionnels";
import AutresServices from "./Client/Component/Performances/AutresServices";
import Ergotherapie from "./Client/Component/Performances/Ergothérapie";
import NotFound from './Client/Component/NotFound';
import ServiceTest from './Client/Component/ServiceTest';
import ServicesEN from './Client/Component/Performances/ServicesEN';
import ExpertsAdmin from './Admin/pages/ExpertsAdmin';
import UpdatesAdmin from './Admin/pages/UpdatesAdmin';
import AboutUsAdmin from './Admin/pages/AboutUsAdmin';
import axios from 'axios';
function App() {
  useEffect(() => { console.log(window.UC_UI);
    // Tracker la visite actuelle
        axios.post('http://127.0.0.1:8000/api/track-visit')
        .catch(console.error);
   }, []);

  return (
    <Router>
      <ScrollTop />
      <Routes>
  <Route key="client" path="/" element={<Layout />}>
    <Route index element={<Commencer />} />
    <Route path="service/:id" element={<ServicesEN />} />
    <Route path="physiotherapie" element={<Physiotherapie />} />
    <Route path="ergotherapie" element={<Ergotherapie />} />
    <Route path="formation" element={<Formation />} />
    <Route path="prevention" element={<Prevention />} />
    <Route path="sportsDeReadaptation" element={<SportsDeReadaptation />} />
    <Route path="TRena" element={<TRena />} />
    <Route path="conseilsNutritionnels" element={<ConseilsNutritionnels />} />
    <Route path="autresServices" element={<AutresServices />} />
    <Route path="quiSommesNous" element={<QuiSommesNous />} />
    <Route path="Offresdemploi" element={<PostesVacants />} />
    <Route path="contact" element={<PageContact />} />
    <Route path="faq" element={<PageFAQ />} />
    <Route path="ServiceTest" element={<ServiceTest />} />
    <Route path="*" element={<NotFound />} />
  </Route>

<Route path="admin">
  {/* Change from absolute path "/login" to relative path "login" */}
  <Route key="login" path="login" element={<LoginPage />} />

  <Route
    key="admin-layout"
    element={<AdminLayout />}
  >
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="experts" element={<ExpertsAdmin/>} />
    <Route path="updates" element={<UpdatesAdmin/>} />

    
    <Route path="about-us" element={<AboutUsAdmin/>} />




    <Route path="faq" element={<FAQ />} />
    <Route path="health-center" element={<HealthCenter />} />
    <Route path="contact" element={<Contact />} />
    <Route path="job-offers" element={<JobOffers />} />
    <Route path="people" element={<People />} />
    <Route path="appointments" element={<Appointments />} />
    <Route path="settings" element={<SettingsPage />} />
    <Route path="users" element={<UsersPage />} />
    <Route path="services" element={<Services />} />
    <Route path="*" element={<Navigate to="dashboard" replace />} />
  </Route>
</Route>
      </Routes>
    </Router>
  );
}

export default App;