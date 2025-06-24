import React from 'react';
import { BarChart, LineChart, Users, DollarSign } from 'lucide-react';
import TeamAnalyticsChart from '../components/TeamAnalyticsChart';
import ServiceRevenueChart from '../components/ServiceRevenueChart';

const ServiceAnalytics = () => {
  // Données pour les statistiques générales
  const stats = [
    { 
      id: 1, 
      title: 'Total Clients', 
      value: '2,845', 
      change: '+12.5%', 
      isPositive: true,
      icon: <Users className="text-blue-500" size={24} />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      id: 2, 
      title: 'Revenus Mensuels', 
      value: '78,450 €', 
      change: '+8.2%', 
      isPositive: true,
      icon: <DollarSign className="text-green-500" size={24} />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    { 
      id: 3, 
      title: 'Services Actifs', 
      value: '5', 
      change: '+1', 
      isPositive: true,
      icon: <BarChart className="text-amber-500" size={24} />,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    },
    { 
      id: 4, 
      title: 'Taux de Satisfaction', 
      value: '94.8%', 
      change: '+2.3%', 
      isPositive: true,
      icon: <LineChart className="text-indigo-500" size={24} />,
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    }
  ];

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold">Analytics des Services</h1>
      <p className="mt-4 mb-6">Visualisez les performances de vos services et l'activité de votre équipe.</p>
      
      {/* Statistiques générales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.id} className={`${stat.bgColor} p-4 rounded-lg shadow`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <h3 className={`${stat.textColor} text-2xl font-bold mt-1`}>{stat.value}</h3>
              </div>
              <div className="p-2 rounded-full bg-white shadow-sm">
                {stat.icon}
              </div>
            </div>
            <div className="mt-2">
              <span className={`text-xs font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
              <span className="text-xs text-gray-500 ml-1">depuis le mois dernier</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Premier graphique - Clients par service */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Users className="text-blue-500 mr-2" size={20} />
            <h2 className="text-lg font-semibold">Clients par service</h2>
          </div>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded border relative">
            <TeamAnalyticsChart />
          </div>
        </div>
        
        {/* Deuxième graphique - Revenus par service */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <DollarSign className="text-green-500 mr-2" size={20} />
            <h2 className="text-lg font-semibold">Revenus par service</h2>
          </div>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded border relative">
            <ServiceRevenueChart />
          </div>
        </div>
      </div>
      
      {/* Informations supplémentaires */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Analyse des performances</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-2">Points forts</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Le service de Chirurgie génère le plus de revenus</li>
              <li>Le service de Consultation attire le plus grand nombre de clients</li>
              <li>Croissance constante des revenus sur les 6 derniers mois</li>
              <li>Taux de satisfaction client en hausse pour tous les services</li>
            </ul>
          </div>
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-2">Opportunités d'amélioration</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Le service de Physiothérapie pourrait être développé davantage</li>
              <li>Optimiser les horaires pour les services les plus demandés</li>
              <li>Envisager l'ajout de nouveaux services complémentaires</li>
              <li>Améliorer la coordination entre les différents services</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceAnalytics; 