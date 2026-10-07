import React from 'react';
import { BarChart, LineChart, Users, DollarSign, TrendingUp, Lightbulb } from 'lucide-react';
import TeamAnalyticsChart from '../components/TeamAnalyticsChart';
import ServiceRevenueChart from '../components/ServiceRevenueChart';
import { PageHeader, Card, StatCard } from '../ui';

const ServiceAnalytics = () => {
  // Données pour les statistiques générales
  const stats = [
    {
      id: 1,
      title: 'Total clients',
      value: '2,845',
      change: '+12.5%',
      isPositive: true,
      icon: Users,
      tone: 'brand'
    },
    {
      id: 2,
      title: 'Revenus mensuels',
      value: '78,450 €',
      change: '+8.2%',
      isPositive: true,
      icon: DollarSign,
      tone: 'green'
    },
    {
      id: 3,
      title: 'Services actifs',
      value: '5',
      change: '+1',
      isPositive: true,
      icon: BarChart,
      tone: 'amber'
    },
    {
      id: 4,
      title: 'Taux de satisfaction',
      value: '94.8%',
      change: '+2.3%',
      isPositive: true,
      icon: LineChart,
      tone: 'brand'
    }
  ];

  return (
    <div>
      <PageHeader
        icon={BarChart}
        title="Analytics des services"
        description="Visualisez les performances de vos services et l'activité de votre équipe."
      />

      <div className="space-y-6">
        {/* Statistiques générales */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.id}
              label={stat.title}
              value={stat.value}
              icon={stat.icon}
              tone={stat.tone}
              hint={
                <>
                  <span className={`font-medium ${stat.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>{' '}
                  depuis le mois dernier
                </>
              }
            />
          ))}
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card title="Clients par service" icon={Users}>
            <div className="relative flex h-80 items-center justify-center">
              <TeamAnalyticsChart />
            </div>
          </Card>

          <Card title="Revenus par service" icon={DollarSign}>
            <div className="relative flex h-80 items-center justify-center">
              <ServiceRevenueChart />
            </div>
          </Card>
        </div>

        {/* Informations supplémentaires */}
        <Card title="Analyse des performances" icon={LineChart}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
                <TrendingUp size={16} className="text-emerald-600" />
                Points forts
              </h3>
              <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                <li>Le service de Chirurgie génère le plus de revenus</li>
                <li>Le service de Consultation attire le plus grand nombre de clients</li>
                <li>Croissance constante des revenus sur les 6 derniers mois</li>
                <li>Taux de satisfaction client en hausse pour tous les services</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Lightbulb size={16} className="text-amber-600" />
                Opportunités d'amélioration
              </h3>
              <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                <li>Le service de Physiothérapie pourrait être développé davantage</li>
                <li>Optimiser les horaires pour les services les plus demandés</li>
                <li>Envisager l'ajout de nouveaux services complémentaires</li>
                <li>Améliorer la coordination entre les différents services</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ServiceAnalytics;
