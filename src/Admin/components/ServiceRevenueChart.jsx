import React from 'react';
import ReactApexChart from 'react-apexcharts';

// Palette et styles communs aux graphiques du back-office
const CHART_COLORS = ['#1E3A8A', '#9FB873', '#3C5DB5', '#8EA6DD', '#F59E0B', '#14B8A6'];
const FONT_FAMILY = "'Open Sans', sans-serif";
const AXIS_LABEL_STYLE = { colors: '#6B7280', fontSize: '12px', fontFamily: FONT_FAMILY };

const StatTile = ({ value, label }) => (
  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
    <div className="truncate text-sm font-semibold text-gray-900">{value}</div>
    <div className="mt-0.5 truncate text-xs text-gray-500">{label}</div>
  </div>
);

const ServiceRevenueChart = () => {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

  // Générer des données réalistes pour chaque service
  const generateRevenueData = (baseLine, variance) => {
    return months.map(() => Math.floor(baseLine + Math.random() * variance) * 100);
  };

  const seriesData = [
    {
      name: 'Consultation',
      data: generateRevenueData(30, 15)
    },
    {
      name: 'Chirurgie',
      data: generateRevenueData(80, 40)
    },
    {
      name: 'Radiologie',
      data: generateRevenueData(50, 25)
    },
    {
      name: 'Laboratoire',
      data: generateRevenueData(35, 20)
    },
    {
      name: 'Physiothérapie',
      data: generateRevenueData(25, 15)
    }
  ];

  // Calculer les totaux par service
  const serviceTotals = seriesData.map(service => ({
    name: service.name,
    total: service.data.reduce((sum, count) => sum + count, 0)
  }));

  // Trouver le service le plus rentable
  const topService = serviceTotals.reduce((prev, current) =>
    (prev.total > current.total) ? prev : current
  );

  // Calculer le total de tous les revenus
  const totalRevenue = serviceTotals.reduce((sum, service) => sum + service.total, 0);

  // Calculer la moyenne mensuelle de revenus
  const monthlyAverage = Math.round(totalRevenue / 12);

  const options = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: FONT_FAMILY,
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: { enabled: true, delay: 150 },
        dynamicAnimation: { enabled: true, speed: 350 }
      }
    },
    dataLabels: { enabled: false },
    stroke: { width: 2.5, curve: 'smooth' },
    xaxis: {
      categories: months,
      labels: { style: AXIS_LABEL_STYLE },
      axisBorder: { color: '#E5E7EB' },
      axisTicks: { color: '#E5E7EB' },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toLocaleString() + ' €';
        },
        style: AXIS_LABEL_STYLE,
      }
    },
    colors: CHART_COLORS,
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toLocaleString() + ' €';
        }
      }
    },
    legend: {
      position: 'bottom',
      fontFamily: FONT_FAMILY,
      fontSize: '12px',
      labels: { colors: '#4B5563' },
      markers: { radius: 12 },
    },
    grid: { borderColor: '#E5E7EB', strokeDashArray: 4 },
    markers: {
      size: 3,
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: { size: 5 }
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="min-h-0 flex-1">
        <ReactApexChart
          options={options}
          series={seriesData}
          type="line"
          height="100%"
          width="100%"
        />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-center md:grid-cols-4">
        <StatTile value={`${totalRevenue.toLocaleString()} €`} label="Revenus totaux" />
        <StatTile value={topService.name} label="Service le plus rentable" />
        <StatTile value={`${topService.total.toLocaleString()} €`} label={`Revenus ${topService.name}`} />
        <StatTile value={`${monthlyAverage.toLocaleString()} €`} label="Moyenne mensuelle" />
      </div>
    </div>
  );
};

export default ServiceRevenueChart;
