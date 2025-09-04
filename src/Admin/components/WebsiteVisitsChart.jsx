import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const WebsiteVisitsChart = () => {
  const currentYear = new Date().getFullYear();

  const [monthlyData, setMonthlyData] = useState([]);
  const [totals, setTotals] = useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    pageViews: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('token'); // Récupère le token

    

    // Récupérer le résumé global
    axios.get('http://127.0.0.1:8000/api/visits-summary', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setTotals({
        totalVisits: res.data.totalVisits,
        uniqueVisitors: res.data.uniqueVisitors,
        pageViews: res.data.pageViews || res.data.totalVisits
      });
    })
    .catch(console.error);

    // Récupérer les données par mois
    axios.get('http://127.0.0.1:8000/api/visits-monthly', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const monthsFr = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
      const data = monthsFr.map((m, idx) => {
        const monthData = res.data.find(d => d.month === idx + 1);
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
      height: 350,
      toolbar: { show: false },
      fontFamily: "'Open Sans', sans-serif",
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: { enabled: true, delay: 150 },
        dynamicAnimation: { enabled: true, speed: 350 }
      }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3, stops: [0, 90, 100] } },
    xaxis: { categories: monthlyData.map(item => item.month), labels: { style: { fontFamily: "'Open Sans', sans-serif" } } },
    yaxis: { title: { text: 'Nombre', style: { fontFamily: "'Open Sans', sans-serif" } }, labels: { style: { fontFamily: "'Open Sans', sans-serif" } } },
    colors: ['#6366f1', '#8b5cf6', '#a855f7'],
    tooltip: { y: { formatter: val => val }, theme: 'dark' },
    legend: { position: 'top', horizontalAlign: 'right', fontFamily: "'Open Sans', sans-serif" },
    grid: { borderColor: '#f1f1f1', row: { colors: ['transparent', 'transparent'], opacity: 0.5 } },
    title: { text: `Trafic du site web en ${currentYear}`, align: 'center', style: { fontSize: '14px', fontWeight: 'bold', fontFamily: "'Open Sans', sans-serif", color: '#334155' } }
  };

  const bounceRate = totals.totalVisits
    ? Math.round((totals.totalVisits - totals.uniqueVisitors) / totals.totalVisits * 100)
    : 0;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1">
        <ReactApexChart options={options} series={series} type="area" height="100%" />
      </div>
      <div className="grid grid-cols-4 gap-2 mt-2 text-center text-xs">
        <div className="bg-indigo-50 p-2 rounded">
          <div className="font-semibold text-indigo-600">{totals.totalVisits.toLocaleString()}</div>
          <div className="text-gray-500">Visites</div>
        </div>
        <div className="bg-purple-50 p-2 rounded">
          <div className="font-semibold text-purple-600">{totals.uniqueVisitors.toLocaleString()}</div>
          <div className="text-gray-500">Visiteurs uniques</div>
        </div>
        <div className="bg-fuchsia-50 p-2 rounded">
          <div className="font-semibold text-fuchsia-600">{totals.pageViews.toLocaleString()}</div>
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
