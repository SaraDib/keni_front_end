import React from 'react';
import ReactApexChart from 'react-apexcharts';

const TeamAnalyticsChart = () => {
  const currentYear = new Date().getFullYear();
  
  // Données pour les services et le nombre de clients par mois
  const services = ['Consultation', 'Chirurgie', 'Radiologie', 'Laboratoire', 'Physiothérapie'];
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  
  // Générer des données réalistes pour chaque service
  const generateServiceData = (baseLine, variance) => {
    return months.map(() => Math.floor(baseLine + Math.random() * variance));
  };
  
  const seriesData = [
    {
      name: 'Consultation',
      data: generateServiceData(45, 20)
    },
    {
      name: 'Chirurgie',
      data: generateServiceData(25, 15)
    },
    {
      name: 'Radiologie',
      data: generateServiceData(35, 18)
    },
    {
      name: 'Laboratoire',
      data: generateServiceData(40, 22)
    },
    {
      name: 'Physiothérapie',
      data: generateServiceData(30, 16)
    }
  ];
  
  // Calculer les totaux par service
  const serviceTotals = seriesData.map(service => ({
    name: service.name,
    total: service.data.reduce((sum, count) => sum + count, 0)
  }));
  
  // Trouver le service le plus populaire
  const topService = serviceTotals.reduce((prev, current) => 
    (prev.total > current.total) ? prev : current
  );
  
  // Calculer le total de tous les clients
  const totalClients = serviceTotals.reduce((sum, service) => sum + service.total, 0);
  
  // Calculer la moyenne mensuelle de clients
  const monthlyAverage = Math.round(totalClients / 12);
  
  const options = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
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
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        columnWidth: '70%',
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: '13px',
              fontWeight: 900
            }
          }
        }
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 1,
      colors: ['#fff']
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
        text: 'Nombre de clients',
        style: {
          fontFamily: "'Open Sans', sans-serif",
        }
      },
      labels: {
        style: {
          fontFamily: "'Open Sans', sans-serif",
        }
      }
    },
    fill: {
      opacity: 1
    },
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ec4899'],
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " clients"
        }
      },
      theme: 'dark'
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
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
      text: `Clients par service en ${currentYear}`,
      align: 'center',
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        fontFamily: "'Open Sans', sans-serif",
        color: '#334155'
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1">
        <ReactApexChart 
          options={options} 
          series={seriesData} 
          type="bar" 
          height="100%" 
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-center text-xs">
        <div className="bg-blue-50 p-2 rounded">
          <div className="font-semibold text-blue-600">{totalClients.toLocaleString()}</div>
          <div className="text-gray-500">Total clients</div>
        </div>
        <div className="bg-green-50 p-2 rounded">
          <div className="font-semibold text-green-600">{topService.name}</div>
          <div className="text-gray-500">Service le plus populaire</div>
        </div>
        <div className="bg-amber-50 p-2 rounded">
          <div className="font-semibold text-amber-600">{topService.total.toLocaleString()}</div>
          <div className="text-gray-500">Clients {topService.name}</div>
        </div>
        <div className="bg-indigo-50 p-2 rounded">
          <div className="font-semibold text-indigo-600">{monthlyAverage}</div>
          <div className="text-gray-500">Moyenne mensuelle</div>
        </div>
      </div>
    </div>
  );
};

export default TeamAnalyticsChart; 