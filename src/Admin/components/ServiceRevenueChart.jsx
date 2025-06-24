import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ServiceRevenueChart = () => {
  const currentYear = new Date().getFullYear();
  
  // Données pour les revenus par service
  const services = ['Consultation', 'Chirurgie', 'Radiologie', 'Laboratoire', 'Physiothérapie'];
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
      height: 350,
      toolbar: {
        show: false
      },
      fontFamily: "'Open Sans', sans-serif",
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 3,
      curve: 'smooth'
    },
    xaxis: {
      categories: months,
      labels: {
        style: {
          fontFamily: "'Open Sans', sans-serif",
        }
      }
    },
    yaxis: {
      title: {
        text: 'Revenus (€)',
        style: {
          fontFamily: "'Open Sans', sans-serif",
        }
      },
      labels: {
        formatter: function(val) {
          return val.toLocaleString() + ' €';
        },
        style: {
          fontFamily: "'Open Sans', sans-serif",
        }
      }
    },
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ec4899'],
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toLocaleString() + ' €';
        }
      },
      theme: 'dark'
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontFamily: "'Open Sans', sans-serif",
    },
    grid: {
      borderColor: '#f1f1f1',
      row: {
        colors: ['transparent', 'transparent'],
        opacity: 0.5
      }
    },
    title: {
      text: `Revenus par service en ${currentYear}`,
      align: 'center',
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        fontFamily: "'Open Sans', sans-serif",
        color: '#334155'
      }
    },
    markers: {
      size: 4,
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ec4899'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 6
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1">
        <ReactApexChart 
          options={options} 
          series={seriesData} 
          type="line" 
          height="100%" 
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-center text-xs">
        <div className="bg-blue-50 p-2 rounded">
          <div className="font-semibold text-blue-600">{totalRevenue.toLocaleString()} €</div>
          <div className="text-gray-500">Revenus totaux</div>
        </div>
        <div className="bg-green-50 p-2 rounded">
          <div className="font-semibold text-green-600">{topService.name}</div>
          <div className="text-gray-500">Service le plus rentable</div>
        </div>
        <div className="bg-amber-50 p-2 rounded">
          <div className="font-semibold text-amber-600">{topService.total.toLocaleString()} €</div>
          <div className="text-gray-500">Revenus {topService.name}</div>
        </div>
        <div className="bg-indigo-50 p-2 rounded">
          <div className="font-semibold text-indigo-600">{monthlyAverage.toLocaleString()} €</div>
          <div className="text-gray-500">Moyenne mensuelle</div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRevenueChart; 