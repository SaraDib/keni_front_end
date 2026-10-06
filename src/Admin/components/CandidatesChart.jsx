import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import API_BASE_URL from '../../config';

const CandidatesChart = () => {
  const currentYear = new Date().getFullYear();
  const [candidatesData, setCandidatesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  useEffect(() => {

    axios.get(`${API_BASE_URL}/candidatures/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then(response => {
        setCandidatesData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des stats :", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center p-4">Chargement des statistiques...</div>;
  }

  // Extraire les départements dynamiquement
  const departments = candidatesData[0]?.details.map(d => d.department) || [];

  // Construire les séries dynamiquement
  const series = departments.map(dep => ({
    name: dep,
    data: candidatesData.map(item => {
      const found = item.details.find(d => d.department === dep);
      return found ? found.count : 0;
    })
  }));

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "'Open Sans', sans-serif",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 5,
        columnWidth: '60%',
      },
    },
    xaxis: {
      categories: candidatesData.map(item => item.month),
      labels: { style: { fontFamily: "'Open Sans', sans-serif" } }
    },
    yaxis: {
      title: {
        text: 'Nombre de candidats',
        style: { fontFamily: "'Open Sans', sans-serif" }
      },
      labels: { style: { fontFamily: "'Open Sans', sans-serif" } }
    },
    legend: {
      position: 'bottom',
      offsetY: 10,
      fontFamily: "'Open Sans', sans-serif",
    },
    fill: { opacity: 1 },
    colors: ['#10b981', '#059669', '#047857', '#065f46'],
    tooltip: {
      y: { formatter: val => val + " candidats" },
      theme: 'dark'
    },
    dataLabels: { enabled: false },
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

  // Calculer les totaux
  const totalCandidates = candidatesData.reduce((sum, item) => sum + item.count, 0);
  const totalByDepartment = departments.reduce((acc, dep) => {
    acc[dep] = candidatesData.reduce((sum, item) => {
      const found = item.details.find(d => d.department === dep);
      return sum + (found ? found.count : 0);
    }, 0);
    return acc;
  }, {});

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
        <div>
          Total: <span className="font-semibold">{totalCandidates}</span> candidats spontanés en {currentYear}
        </div>
        <div className="flex flex-wrap justify-center mt-2 text-xs">
          {departments.map((dep, idx) => (
            <div key={dep} className="flex items-center mx-2 mb-1">
              <div className={`w-3 h-3 rounded-full mr-1`} style={{ backgroundColor: options.colors[idx % options.colors.length] }}></div>
              <span>{dep}: {totalByDepartment[dep]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidatesChart;
