import React from 'react';
import ReactApexChart from 'react-apexcharts';

const WebsiteVisitsChart = () => {
  const currentYear = new Date().getFullYear();
  
  // Données pour les visites du site web
  const websiteData = [
    { month: 'Jan', visits: 1240, uniqueVisitors: 890, pageViews: 3200 },
    { month: 'Fév', visits: 1350, uniqueVisitors: 950, pageViews: 3400 },
    { month: 'Mar', visits: 1480, uniqueVisitors: 1020, pageViews: 3800 },
    { month: 'Avr', visits: 1620, uniqueVisitors: 1150, pageViews: 4100 },
    { month: 'Mai', visits: 1750, uniqueVisitors: 1220, pageViews: 4500 },
    { month: 'Juin', visits: 1980, uniqueVisitors: 1380, pageViews: 5200 },
    { month: 'Juil', visits: 2150, uniqueVisitors: 1480, pageViews: 5600 },
    { month: 'Août', visits: 1890, uniqueVisitors: 1320, pageViews: 4900 },
    { month: 'Sep', visits: 2050, uniqueVisitors: 1420, pageViews: 5300 },
    { month: 'Oct', visits: 2280, uniqueVisitors: 1580, pageViews: 5900 },
    { month: 'Nov', visits: 2450, uniqueVisitors: 1680, pageViews: 6300 },
    { month: 'Déc', visits: 2320, uniqueVisitors: 1590, pageViews: 6000 }
  ];

  // Préparer les données pour ApexCharts
  const series = [
    {
      name: 'Visites',
      data: websiteData.map(item => item.visits)
    },
    {
      name: 'Visiteurs uniques',
      data: websiteData.map(item => item.uniqueVisitors)
    },
    {
      name: 'Pages vues',
      data: websiteData.map(item => item.pageViews)
    }
  ];

  const options = {
    chart: {
      type: 'area',
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
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: websiteData.map(item => item.month),
      labels: {
        style: {
          fontFamily: "'Open Sans', sans-serif",
        }
      }
    },
    yaxis: {
      title: {
        text: 'Nombre',
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
    colors: ['#6366f1', '#8b5cf6', '#a855f7'],
    tooltip: {
      y: {
        formatter: function (val) {
          return val
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
      text: `Trafic du site web en ${currentYear}`,
      align: 'center',
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        fontFamily: "'Open Sans', sans-serif",
        color: '#334155'
      }
    }
  };

  // Calculer les totaux
  const totalVisits = websiteData.reduce((sum, item) => sum + item.visits, 0);
  const totalUniqueVisitors = websiteData.reduce((sum, item) => sum + item.uniqueVisitors, 0);
  const totalPageViews = websiteData.reduce((sum, item) => sum + item.pageViews, 0);
  const bounceRate = Math.round((totalVisits - totalUniqueVisitors) / totalVisits * 100);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1">
        <ReactApexChart 
          options={options} 
          series={series} 
          type="area" 
          height="100%" 
        />
      </div>
      <div className="grid grid-cols-4 gap-2 mt-2 text-center text-xs">
        <div className="bg-indigo-50 p-2 rounded">
          <div className="font-semibold text-indigo-600">{totalVisits.toLocaleString()}</div>
          <div className="text-gray-500">Visites</div>
        </div>
        <div className="bg-purple-50 p-2 rounded">
          <div className="font-semibold text-purple-600">{totalUniqueVisitors.toLocaleString()}</div>
          <div className="text-gray-500">Visiteurs uniques</div>
        </div>
        <div className="bg-fuchsia-50 p-2 rounded">
          <div className="font-semibold text-fuchsia-600">{totalPageViews.toLocaleString()}</div>
          <div className="text-gray-500">Pages vues</div>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <div className="font-semibold text-gray-600">{bounceRate}%</div>
          <div className="text-gray-500">Taux de rebond</div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteVisitsChart; 