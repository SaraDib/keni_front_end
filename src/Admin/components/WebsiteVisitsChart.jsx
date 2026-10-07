import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import API_BASE_URL from '../../config';

// Palette et styles communs aux graphiques du back-office
const CHART_COLORS = ['#1E3A8A', '#9FB873', '#3C5DB5', '#8EA6DD', '#F59E0B', '#14B8A6'];
const FONT_FAMILY = "'Open Sans', sans-serif";
const AXIS_LABEL_STYLE = { colors: '#6B7280', fontSize: '12px', fontFamily: FONT_FAMILY };

const StatTile = ({ value, label }) => (
  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
    <div className="text-sm font-semibold text-gray-900">{value}</div>
    <div className="mt-0.5 truncate text-xs text-gray-500">{label}</div>
  </div>
);

const WebsiteVisitsChart = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [totals, setTotals] = useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    pageViews: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('token'); // Récupère le token



    // Récupérer le résumé global
    axios.get(`${API_BASE_URL}/visits-summary`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setTotals({
          totalVisits: res.data.totalVisits || 0,
          uniqueVisitors: res.data.uniqueVisitors || 0,
          pageViews: res.data.pageViews || res.data.totalVisits || 0
        });
      })
      .catch(console.error);

    // Récupérer les données par mois
    axios.get(`${API_BASE_URL}/visits-monthly`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const monthsFr = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        const data = monthsFr.map((m, idx) => {
          const monthData = (res.data || []).find(d => d.month === idx + 1);
          return {
            month: m,
            visits: monthData ? monthData.visits : 0,
            uniqueVisitors: monthData ? monthData.uniqueVisitors : 0,
            pageViews: monthData ? monthData.visits : 0
          };
        });
        setMonthlyData(data);
      })
      .catch(console.error);

  }, []);

  // Préparer les séries pour ApexCharts
  const series = [
    { name: 'Visites', data: monthlyData.map(item => item.visits) },
    { name: 'Visiteurs uniques', data: monthlyData.map(item => item.uniqueVisitors) },
    { name: 'Pages vues', data: monthlyData.map(item => item.pageViews) }
  ];

  const options = {
    chart: {
      type: 'area',
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
    stroke: { curve: 'smooth', width: 2.5 },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0.02, stops: [0, 90, 100] } },
    xaxis: {
      categories: monthlyData.map(item => item.month),
      labels: { style: AXIS_LABEL_STYLE },
      axisBorder: { color: '#E5E7EB' },
      axisTicks: { color: '#E5E7EB' },
    },
    yaxis: { labels: { style: AXIS_LABEL_STYLE } },
    colors: CHART_COLORS,
    tooltip: { y: { formatter: val => val } },
    legend: {
      position: 'bottom',
      fontFamily: FONT_FAMILY,
      fontSize: '12px',
      labels: { colors: '#4B5563' },
      markers: { radius: 12 },
    },
    grid: { borderColor: '#E5E7EB', strokeDashArray: 4 },
  };

  const bounceRate = totals.totalVisits
    ? Math.round((totals.totalVisits - totals.uniqueVisitors) / totals.totalVisits * 100)
    : 0;

  return (
    <div className="flex h-full w-full flex-col">
      <div className="min-h-0 flex-1">
        <ReactApexChart options={options} series={series} type="area" height="100%" width="100%" />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
        <StatTile value={totals.totalVisits.toLocaleString()} label="Visites" />
        <StatTile value={totals.uniqueVisitors.toLocaleString()} label="Visiteurs uniques" />
        <StatTile value={totals.pageViews.toLocaleString()} label="Pages vues" />
        <StatTile value={`${bounceRate}%`} label="Taux de rebond" />
      </div>
    </div>
  );
};

export default WebsiteVisitsChart;
