import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import API_BASE_URL from '../../config';

// Palette et styles communs aux graphiques du back-office
const CHART_COLORS = ['#1E3A8A', '#9FB873', '#3C5DB5', '#8EA6DD', '#F59E0B', '#14B8A6'];
const FONT_FAMILY = "'Open Sans', sans-serif";
const AXIS_LABEL_STYLE = { colors: '#6B7280', fontSize: '12px', fontFamily: FONT_FAMILY };

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

  const options = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: FONT_FAMILY,
    },
    plotOptions: { bar: { horizontal: false, borderRadius: 4, columnWidth: '60%' } },
    xaxis: {
      categories: appointmentsData.map(item => item.month),
      labels: { style: AXIS_LABEL_STYLE },
      axisBorder: { color: '#E5E7EB' },
      axisTicks: { color: '#E5E7EB' },
    },
    yaxis: { labels: { style: AXIS_LABEL_STYLE } },
    grid: { borderColor: '#E5E7EB', strokeDashArray: 4 },
    // La légende (avec les totaux par type) est rendue sous le graphique
    legend: { show: false },
    colors: CHART_COLORS,
    fill: { opacity: 1 },
    tooltip: { y: { formatter: val => val + " rendez-vous" } },
    dataLabels: { enabled: false },
    noData: {
      text: 'Aucune donnée disponible',
      style: { color: '#6B7280', fontSize: '13px', fontFamily: FONT_FAMILY },
    },
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
    <div className="flex h-full w-full flex-col">
      <div className="min-h-0 flex-1">
        <ReactApexChart options={options} series={series} type="bar" height="100%" width="100%" />
      </div>
      <div className="mt-2 text-center text-xs text-gray-500">
        <div>
          Total : <span className="font-semibold text-gray-900">{totalAppointments}</span> rendez-vous en {currentYear}
        </div>
        {types.length > 0 && (
          <div className="mt-1.5 flex flex-wrap justify-center gap-x-4 gap-y-1 text-gray-600">
            {types.map((type, idx) => (
              <div key={type} className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                />
                <span>
                  {type} : <span className="font-semibold text-gray-900">{totalByType[type]}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsChart;
