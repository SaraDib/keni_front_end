import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const AppointmentsChart = () => {
  const currentYear = new Date().getFullYear();
  const [appointmentsData, setAppointments] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
  axios
    .get("http://127.0.0.1:8000/api/rendez-vous", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
    .then((res) => {
      // Tableau fixe de tous les mois en français
      const allMonths = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 
                         'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

      // Initialiser mappedData avec tous les mois
      const mappedData = {};
      allMonths.forEach(m => {
        mappedData[m] = { 
          month: m, 
          details: [
            { type: 'Privé', count: 0 },
            { type: 'Statutaire', count: 0 }
          ]
        };
      });

      // Parcourir les données récupérées et ajouter les counts aux mois correspondants
      res.data.forEach(item => {
        const date = new Date(item.created_at);
        const monthIndex = date.getMonth(); // 0 = Janvier, 1 = Février, ...
        const month = allMonths[monthIndex]; // récupère le mois en français

        if (!mappedData[month]) return;

        if (item.Type_recette === 'Privé') mappedData[month].details[0].count += item.nombre;
        else if (item.Type_recette === 'Statutaire') mappedData[month].details[1].count += item.nombre;
      });

      // Mettre à jour le state avec toutes les données des mois
      setAppointments(Object.values(mappedData));
    })
    .catch(err => console.error("Erreur lors du chargement des rendez-vous :", err));
}, [token]);



 const series = [
    {
      name: 'Privé',
      data: appointmentsData.map(item => item.details?.[0]?.count || 0)
    },
    {
      name: 'Statutaire',
      data: appointmentsData.map(item => item.details?.[1]?.count || 0)
    }
  ];


  const options = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "'Open Sans', sans-serif",
    },
    plotOptions: { bar: { horizontal: false, borderRadius: 5, columnWidth: '60%' } },
    xaxis: { categories: appointmentsData.map(item => item.month) },
    yaxis: { title: { text: 'Nombre de rendez-vous' } },
    legend: { position: 'bottom' },
    colors: ['#3b82f6', '#1d4ed8', '#1e3a8a'],
    fill: { opacity: 1 },
    tooltip: { y: { formatter: val => val + " rendez-vous" } },
    dataLabels: { enabled: false },
    title: { text: `Rendez-vous par mois en ${currentYear}`, align: 'center' },
  };

  const totalAppointments = appointmentsData.reduce((sum, item) => 
    sum + (item.details?.[0]?.count || 0) + (item.details?.[1]?.count || 0) + (item.details?.[2]?.count || 0), 0
  );

   const totalByType = {
    'Privé': appointmentsData.reduce((sum, item) => sum + (item.details?.[0]?.count || 0), 0),
    'Statutaire': appointmentsData.reduce((sum, item) => sum + (item.details?.[1]?.count || 0), 0)
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1">
        <ReactApexChart options={options} series={series} type="bar" height="100%" />
      </div>
      <div className="mt-2 text-center text-sm text-gray-500">
        <div>Total: <span className="font-semibold">{totalAppointments}</span> rendez-vous en {currentYear}</div>
        <div className="flex flex-wrap justify-center mt-2 text-xs">
          <div className="flex items-center mx-2 mb-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
            <span>Privé: {totalByType['Privé']}</span>
          </div>
          <div className="flex items-center mx-2 mb-1">
            <div className="w-3 h-3 bg-blue-900 rounded-full mr-1"></div>
            <span>Statutaire: {totalByType['Statutaire']}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsChart;
