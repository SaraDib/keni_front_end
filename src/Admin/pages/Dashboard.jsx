import React from 'react';
import { Calendar, UserPlus, Globe, PieChart, LayoutDashboard } from 'lucide-react';
import AppointmentsChart from '../components/AppointmentsChart';
import CandidatesChart from '../components/CandidatesChart';
import WebsiteVisitsChart from '../components/WebsiteVisitsChart';
import TrafficSourcesChart from '../components/TrafficSourcesChart';
import { PageHeader, Card } from '../ui';

const charts = [
  { title: 'Rendez-vous par mois', icon: Calendar, Chart: AppointmentsChart },
  { title: 'Candidats spontanés par mois', icon: UserPlus, Chart: CandidatesChart },
  { title: 'Trafic du site web', icon: Globe, Chart: WebsiteVisitsChart },
  { title: 'Sources de trafic', icon: PieChart, Chart: TrafficSourcesChart },
];

const Dashboard = () => {
  return (
    <div>
      <PageHeader
        icon={LayoutDashboard}
        title="Tableau de bord"
        description="Bienvenue sur votre tableau de bord administrateur."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {charts.map(({ title, icon, Chart }) => (
          <Card key={title} title={title} icon={icon}>
            <div className="relative flex h-80 items-center justify-center">
              <Chart />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
