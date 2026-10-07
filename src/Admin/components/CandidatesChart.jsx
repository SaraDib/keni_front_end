import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import API_BASE_URL from '../../config';
import { Spinner, EmptyState } from '../ui';

// Palette et styles communs aux graphiques du back-office
const CHART_COLORS = ['#1E3A8A', '#9FB873', '#3C5DB5', '#8EA6DD', '#F59E0B', '#14B8A6'];
const FONT_FAMILY = "'Open Sans', sans-serif";
const AXIS_LABEL_STYLE = { colors: '#6B7280', fontSize: '12px', fontFamily: FONT_FAMILY };

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
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Extraire les départements dynamiquement
  const departments = candidatesData[0]?.details.map(d => d.department) || [];

  if (departments.length === 0) {
    return <EmptyState title="Aucune donnée disponible" compact />;
  }

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
      stacked: true,
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: FONT_FAMILY,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        columnWidth: '60%',
      },
    },
    xaxis: {
      categories: candidatesData.map(item => item.month),
      labels: { style: AXIS_LABEL_STYLE },
      axisBorder: { color: '#E5E7EB' },
      axisTicks: { color: '#E5E7EB' },
    },
    yaxis: { labels: { style: AXIS_LABEL_STYLE } },
    grid: { borderColor: '#E5E7EB', strokeDashArray: 4 },
    // La légende (avec les totaux par département) est rendue sous le graphique
    legend: { show: false },
    fill: { opacity: 1 },
    colors: CHART_COLORS,
    tooltip: {
      y: { formatter: val => val + " candidats" },
    },
    dataLabels: { enabled: false },
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
    <div className="flex h-full w-full flex-col">
      <div className="min-h-0 flex-1">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height="100%"
          width="100%"
        />
      </div>
      <div className="mt-2 text-center text-xs text-gray-500">
        <div>
          Total : <span className="font-semibold text-gray-900">{totalCandidates}</span> candidats spontanés en {currentYear}
        </div>
        <div className="mt-1.5 flex flex-wrap justify-center gap-x-4 gap-y-1 text-gray-600">
          {departments.map((dep, idx) => (
            <div key={dep} className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
              />
              <span>
                {dep} : <span className="font-semibold text-gray-900">{totalByDepartment[dep]}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidatesChart;
