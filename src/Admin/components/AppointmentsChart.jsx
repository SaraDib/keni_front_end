import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import API_BASE_URL from '../../config';

const AppointmentsChart = () => {
  const currentYear = new Date().getFullYear();
  const [appointmentsData, setAppointments] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesRes, apptsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/types-recette`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_BASE_URL}/rendez-vous`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          })
        ]);

        const allMonths = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
          'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

        // Filtrer par année en cours d'abord pour extraire les types pertinents
        const currentYearData = apptsRes.data.filter(item => {
          const date = new Date(item.created_at);
          return date.getFullYear() === currentYear;
        });

        // Extraire les types uniquement présents dans les données de l'année en cours
        const activeTypesInYear = [...new Set(currentYearData.map(item => item.Type_recette).filter(Boolean))];

        // Si aucun type n'is found for the current year, we stick to the types defined in the database
        const finalTypes = activeTypesInYear.length > 0
          ? activeTypesInYear
          : typesRes.data.map(t => t.nom);

        console.log('>>> All Appointments from API:', apptsRes.data);
        console.log('>>> Current Year for filter:', currentYear);

        // Initialiser mappedData avec tous les mois et les types détectés
        const mappedData = {};
        allMonths.forEach(m => {
          mappedData[m] = {
            month: m,
            details: finalTypes.map(type => ({ type, count: 0 }))
          };
        });

        // Compter les rendez-vous pour l'année en cours
        currentYearData.forEach(item => {
          const date = new Date(item.created_at);
          const monthIndex = date.getMonth();
          const month = allMonths[monthIndex];

          if (!mappedData[month]) return;

          const typeEntry = mappedData[month].details.find(d => d.type === item.Type_recette);
          if (typeEntry) {
            typeEntry.count += (item.nombre || 1);
          }
        });

        setAppointments(Object.values(mappedData));
      } catch (err) {
        console.error("Erreur lors du chargement des données du dashboard :", err);
      }
    };

    fetchData();
  }, [token, currentYear]);

  // Déduire les types dynamiques à partir des données
  const types = appointmentsData[0]?.details.map(d => d.type) || [];

  const series = types.map((type, index) => ({
    name: type,
    data: appointmentsData.map(item => {
      const found = item.details.find(d => d.type === type);
      return found ? found.count : 0;
    })
  }));

  // Palette de couleurs plus variée pour distinguer les types
  const chartColors = ['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308'];

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
    colors: chartColors,
    fill: { opacity: 1 },
    tooltip: { y: { formatter: val => val + " rendez-vous" } },
    dataLabels: { enabled: false },
    title: { text: `Historique complet des rendez-vous par mois`, align: 'center' },
  };

  const totalAppointments = appointmentsData.reduce((sum, month) =>
    sum + month.details.reduce((mSum, d) => mSum + d.count, 0), 0
  );

  const totalByType = types.reduce((acc, type) => {
    acc[type] = appointmentsData.reduce((sum, month) => {
      const found = month.details.find(d => d.type === type);
      return sum + (found ? found.count : 0);
    }, 0);
    return acc;
  }, {});

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1">
        <ReactApexChart options={options} series={series} type="bar" height="100%" />
      </div>
      <div className="mt-2 text-center text-sm text-gray-500">
        <div>Total: <span className="font-semibold">{totalAppointments}</span> rendez-vous en {currentYear}</div>
        <div className="flex flex-wrap justify-center mt-2 text-xs">
          {types.map((type, idx) => (
            <div key={type} className="flex items-center mx-2 mb-1">
              <div
                className="w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: chartColors[idx % chartColors.length] }}
              ></div>
              <span>{type}: {totalByType[type]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsChart;
