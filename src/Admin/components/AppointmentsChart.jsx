import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const AppointmentsChart = () => {
  const currentYear = new Date().getFullYear();
  
  // Données pour les rendez-vous par mois
  const appointmentsData = [
    { month: 'Jan', count: 45, year: currentYear, details: [
      { type: 'Entretien initial', count: 25 },
      { type: 'Suivi', count: 15 },
      { type: 'Évaluation', count: 5 }
    ]},
    { month: 'Fév', count: 38, year: currentYear, details: [
      { type: 'Entretien initial', count: 18 },
      { type: 'Suivi', count: 12 },
      { type: 'Évaluation', count: 8 }
    ]},
    { month: 'Mar', count: 52, year: currentYear, details: [
      { type: 'Entretien initial', count: 30 },
      { type: 'Suivi', count: 17 },
      { type: 'Évaluation', count: 5 }
    ]},
    { month: 'Avr', count: 65, year: currentYear, details: [
      { type: 'Entretien initial', count: 35 },
      { type: 'Suivi', count: 20 },
      { type: 'Évaluation', count: 10 }
    ]},
    { month: 'Mai', count: 48, year: currentYear, details: [
      { type: 'Entretien initial', count: 22 },
      { type: 'Suivi', count: 18 },
      { type: 'Évaluation', count: 8 }
    ]},
    { month: 'Juin', count: 70, year: currentYear, details: [
      { type: 'Entretien initial', count: 40 },
      { type: 'Suivi', count: 22 },
      { type: 'Évaluation', count: 8 }
    ]},
    { month: 'Juil', count: 55, year: currentYear, details: [
      { type: 'Entretien initial', count: 28 },
      { type: 'Suivi', count: 20 },
      { type: 'Évaluation', count: 7 }
    ]},
    { month: 'Août', count: 42, year: currentYear, details: [
      { type: 'Entretien initial', count: 20 },
      { type: 'Suivi', count: 15 },
      { type: 'Évaluation', count: 7 }
    ]},
    { month: 'Sep', count: 60, year: currentYear, details: [
      { type: 'Entretien initial', count: 32 },
      { type: 'Suivi', count: 20 },
      { type: 'Évaluation', count: 8 }
    ]},
    { month: 'Oct', count: 75, year: currentYear, details: [
      { type: 'Entretien initial', count: 42 },
      { type: 'Suivi', count: 25 },
      { type: 'Évaluation', count: 8 }
    ]},
    { month: 'Nov', count: 58, year: currentYear, details: [
      { type: 'Entretien initial', count: 30 },
      { type: 'Suivi', count: 20 },
      { type: 'Évaluation', count: 8 }
    ]},
    { month: 'Déc', count: 50, year: currentYear, details: [
      { type: 'Entretien initial', count: 25 },
      { type: 'Suivi', count: 18 },
      { type: 'Évaluation', count: 7 }
    ]}
  ];

  // Préparer les données pour ApexCharts
  const series = [
    {
      name: 'Entretien initial',
      data: appointmentsData.map(item => item.details[0].count)
    },
    {
      name: 'Suivi',
      data: appointmentsData.map(item => item.details[1].count)
    },
    {
      name: 'Évaluation',
      data: appointmentsData.map(item => item.details[2].count)
    }
  ];

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      },
      fontFamily: "'Open Sans', sans-serif",
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 5,
        columnWidth: '60%',
      },
    },
    xaxis: {
      categories: appointmentsData.map(item => item.month),
      labels: {
        style: {
          fontFamily: "'Open Sans', sans-serif",
        }
      }
    },
    yaxis: {
      title: {
        text: 'Nombre de rendez-vous',
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
    legend: {
      position: 'bottom',
      offsetY: 10,
      fontFamily: "'Open Sans', sans-serif",
    },
    fill: {
      opacity: 1
    },
    colors: ['#3b82f6', '#1d4ed8', '#1e3a8a'],
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " rendez-vous"
        }
      },
      theme: 'dark'
    },
    dataLabels: {
      enabled: false
    },
    title: {
      text: `Rendez-vous par mois en ${currentYear}`,
      align: 'center',
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        fontFamily: "'Open Sans', sans-serif",
        color: '#334155'
      }
    }
  };

  // Calculer le total des rendez-vous
  const totalAppointments = appointmentsData.reduce((sum, item) => sum + item.count, 0);
  const totalByType = {
    'Entretien initial': appointmentsData.reduce((sum, item) => sum + item.details[0].count, 0),
    'Suivi': appointmentsData.reduce((sum, item) => sum + item.details[1].count, 0),
    'Évaluation': appointmentsData.reduce((sum, item) => sum + item.details[2].count, 0)
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1">
        <ReactApexChart 
          options={options} 
          series={series} 
          type="bar" 
          height="100%" 
        />
      </div>
      <div className="mt-2 text-center text-sm text-gray-500">
        <div>Total: <span className="font-semibold">{totalAppointments}</span> rendez-vous en {currentYear}</div>
        <div className="flex flex-wrap justify-center mt-2 text-xs">
          <div className="flex items-center mx-2 mb-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
            <span>Entretien initial: {totalByType['Entretien initial']}</span>
          </div>
          <div className="flex items-center mx-2 mb-1">
            <div className="w-3 h-3 bg-blue-700 rounded-full mr-1"></div>
            <span>Suivi: {totalByType['Suivi']}</span>
          </div>
          <div className="flex items-center mx-2 mb-1">
            <div className="w-3 h-3 bg-blue-900 rounded-full mr-1"></div>
            <span>Évaluation: {totalByType['Évaluation']}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsChart; 