import React from 'react';
import ReactApexChart from 'react-apexcharts';

const CandidatesChart = () => {
  const currentYear = new Date().getFullYear();
  
  // Données pour les candidats spontanés par mois
  const candidatesData = [
    { month: 'Jan', count: 22, year: currentYear, details: [
      { department: 'Informatique', count: 8 },
      { department: 'Marketing', count: 6 },
      { department: 'Finance', count: 4 },
      { department: 'RH', count: 4 }
    ]},
    { month: 'Fév', count: 18, year: currentYear, details: [
      { department: 'Informatique', count: 7 },
      { department: 'Marketing', count: 5 },
      { department: 'Finance', count: 3 },
      { department: 'RH', count: 3 }
    ]},
    { month: 'Mar', count: 25, year: currentYear, details: [
      { department: 'Informatique', count: 10 },
      { department: 'Marketing', count: 7 },
      { department: 'Finance', count: 4 },
      { department: 'RH', count: 4 }
    ]},
    { month: 'Avr', count: 30, year: currentYear, details: [
      { department: 'Informatique', count: 12 },
      { department: 'Marketing', count: 8 },
      { department: 'Finance', count: 5 },
      { department: 'RH', count: 5 }
    ]},
    { month: 'Mai', count: 28, year: currentYear, details: [
      { department: 'Informatique', count: 11 },
      { department: 'Marketing', count: 7 },
      { department: 'Finance', count: 5 },
      { department: 'RH', count: 5 }
    ]},
    { month: 'Juin', count: 35, year: currentYear, details: [
      { department: 'Informatique', count: 14 },
      { department: 'Marketing', count: 9 },
      { department: 'Finance', count: 6 },
      { department: 'RH', count: 6 }
    ]},
    { month: 'Juil', count: 32, year: currentYear, details: [
      { department: 'Informatique', count: 13 },
      { department: 'Marketing', count: 8 },
      { department: 'Finance', count: 6 },
      { department: 'RH', count: 5 }
    ]},
    { month: 'Août', count: 20, year: currentYear, details: [
      { department: 'Informatique', count: 8 },
      { department: 'Marketing', count: 5 },
      { department: 'Finance', count: 4 },
      { department: 'RH', count: 3 }
    ]},
    { month: 'Sep', count: 38, year: currentYear, details: [
      { department: 'Informatique', count: 15 },
      { department: 'Marketing', count: 10 },
      { department: 'Finance', count: 7 },
      { department: 'RH', count: 6 }
    ]},
    { month: 'Oct', count: 42, year: currentYear, details: [
      { department: 'Informatique', count: 17 },
      { department: 'Marketing', count: 11 },
      { department: 'Finance', count: 8 },
      { department: 'RH', count: 6 }
    ]},
    { month: 'Nov', count: 36, year: currentYear, details: [
      { department: 'Informatique', count: 14 },
      { department: 'Marketing', count: 10 },
      { department: 'Finance', count: 7 },
      { department: 'RH', count: 5 }
    ]},
    { month: 'Déc', count: 30, year: currentYear, details: [
      { department: 'Informatique', count: 12 },
      { department: 'Marketing', count: 8 },
      { department: 'Finance', count: 6 },
      { department: 'RH', count: 4 }
    ]}
  ];

  // Préparer les données pour ApexCharts
  const series = [
    {
      name: 'Informatique',
      data: candidatesData.map(item => item.details[0].count)
    },
    {
      name: 'Marketing',
      data: candidatesData.map(item => item.details[1].count)
    },
    {
      name: 'Finance',
      data: candidatesData.map(item => item.details[2].count)
    },
    {
      name: 'RH',
      data: candidatesData.map(item => item.details[3].count)
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
      categories: candidatesData.map(item => item.month),
      labels: {
        style: {
          fontFamily: "'Open Sans', sans-serif",
        }
      }
    },
    yaxis: {
      title: {
        text: 'Nombre de candidats',
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
    colors: ['#10b981', '#059669', '#047857', '#065f46'],
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " candidats"
        }
      },
      theme: 'dark'
    },
    dataLabels: {
      enabled: false
    },
    title: {
      text: `Candidats spontanés par mois en ${currentYear}`,
      align: 'center',
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        fontFamily: "'Open Sans', sans-serif",
        color: '#334155'
      }
    }
  };

  // Calculer le total des candidats
  const totalCandidates = candidatesData.reduce((sum, item) => sum + item.count, 0);
  const totalByDepartment = {
    'Informatique': candidatesData.reduce((sum, item) => sum + item.details[0].count, 0),
    'Marketing': candidatesData.reduce((sum, item) => sum + item.details[1].count, 0),
    'Finance': candidatesData.reduce((sum, item) => sum + item.details[2].count, 0),
    'RH': candidatesData.reduce((sum, item) => sum + item.details[3].count, 0)
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
        <div>Total: <span className="font-semibold">{totalCandidates}</span> candidats spontanés en {currentYear}</div>
        <div className="flex flex-wrap justify-center mt-2 text-xs">
          <div className="flex items-center mx-2 mb-1">
            <div className="w-3 h-3 bg-emerald-500 rounded-full mr-1"></div>
            <span>Informatique: {totalByDepartment['Informatique']}</span>
          </div>
          <div className="flex items-center mx-2 mb-1">
            <div className="w-3 h-3 bg-emerald-600 rounded-full mr-1"></div>
            <span>Marketing: {totalByDepartment['Marketing']}</span>
          </div>
          <div className="flex items-center mx-2 mb-1">
            <div className="w-3 h-3 bg-emerald-700 rounded-full mr-1"></div>
            <span>Finance: {totalByDepartment['Finance']}</span>
          </div>
          <div className="flex items-center mx-2 mb-1">
            <div className="w-3 h-3 bg-emerald-800 rounded-full mr-1"></div>
            <span>RH: {totalByDepartment['RH']}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatesChart; 