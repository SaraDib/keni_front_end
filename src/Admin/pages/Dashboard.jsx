import React from 'react';
import { Calendar, UserPlus, Globe, PieChart } from 'lucide-react';
import AppointmentsChart from '../components/AppointmentsChart';
import CandidatesChart from '../components/CandidatesChart';
import WebsiteVisitsChart from '../components/WebsiteVisitsChart';
import TrafficSourcesChart from '../components/TrafficSourcesChart';

const Dashboard = () => {
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold">Tableau de bord</h1>
      <p className="mt-4 mb-6">Bienvenue sur votre tableau de bord administrateur!</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* First Chart - Rendez-vous par mois */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Calendar className="text-blue-500 mr-2" size={20} />
            <h2 className="text-lg font-semibold">Rendez-vous par mois</h2>
          </div>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded border relative">
            <AppointmentsChart />
          </div>
        </div>
        
        {/* Second Chart - Candidats spontanés par mois */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <UserPlus className="text-green-500 mr-2" size={20} />
            <h2 className="text-lg font-semibold">Candidats spontanés par mois</h2>
          </div>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded border relative">
            <CandidatesChart />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Third Chart - Visites du site web */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Globe className="text-indigo-500 mr-2" size={20} />
            <h2 className="text-lg font-semibold">Trafic du site web</h2>
          </div>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded border relative">
            <WebsiteVisitsChart />
          </div>
        </div>
        
        {/* Fourth Chart - Sources de trafic */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <PieChart className="text-rose-500 mr-2" size={20} />
            <h2 className="text-lg font-semibold">Sources de trafic</h2>
          </div>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded border relative">
            <TrafficSourcesChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 