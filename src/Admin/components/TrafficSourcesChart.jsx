import React from 'react';
import ReactApexChart from 'react-apexcharts';

const TrafficSourcesChart = () => {
  // Données pour les sources de trafic
  const trafficData = [
    { source: 'Recherche organique', value: 42 },
    { source: 'Réseaux sociaux', value: 28 },
    { source: 'Référencement direct', value: 15 },
    { source: 'Email', value: 10 },
    { source: 'Autres', value: 5 }
  ];

  // Préparer les données pour ApexCharts
  const series = trafficData.map(item => item.value);
  const labels = trafficData.map(item => item.source);

  const options = {
    chart: {
      type: 'donut',
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
    labels: labels,
    colors: ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6'],
    plotOptions: {
      pie: {
        donut: {
          size: '55%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0) + '%';
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val + '%';
      },
      style: {
        fontFamily: "'Open Sans', sans-serif",
        fontSize: '12px',
        fontWeight: 'bold',
        colors: ['#fff']
      },
      dropShadow: {
        enabled: true,
        blur: 3,
        opacity: 0.5
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 0.8,
        stops: [0, 100]
      }
    },
    legend: {
      position: 'bottom',
      fontFamily: "'Open Sans', sans-serif",
      fontSize: '12px',
      formatter: function(seriesName, opts) {
        return [seriesName, ' - ', opts.w.globals.series[opts.seriesIndex] + '%'];
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + '%';
        }
      },
      theme: 'dark'
    },
    title: {
      text: 'Sources de trafic',
      align: 'center',
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        fontFamily: "'Open Sans', sans-serif",
        color: '#334155'
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          height: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  // Calculer les statistiques
  const totalTraffic = trafficData.reduce((sum, item) => sum + item.value, 0);
  const topSource = trafficData.reduce((prev, current) => (prev.value > current.value) ? prev : current);
  const socialTraffic = trafficData.find(item => item.source === 'Réseaux sociaux')?.value || 0;
  const organicTraffic = trafficData.find(item => item.source === 'Recherche organique')?.value || 0;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1">
        <ReactApexChart 
          options={options} 
          series={series} 
          type="donut" 
          height="100%" 
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-center text-xs">
        <div className="bg-rose-50 p-2 rounded">
          <div className="font-semibold text-rose-600">{totalTraffic}%</div>
          <div className="text-gray-500">Trafic total</div>
        </div>
        <div className="bg-pink-50 p-2 rounded">
          <div className="font-semibold text-pink-600">{topSource.source}</div>
          <div className="text-gray-500">Source principale</div>
        </div>
        <div className="bg-purple-50 p-2 rounded">
          <div className="font-semibold text-purple-600">{socialTraffic}%</div>
          <div className="text-gray-500">Réseaux sociaux</div>
        </div>
        <div className="bg-indigo-50 p-2 rounded">
          <div className="font-semibold text-indigo-600">{organicTraffic}%</div>
          <div className="text-gray-500">Recherche organique</div>
        </div>
      </div>
    </div>
  );
};

export default TrafficSourcesChart; 