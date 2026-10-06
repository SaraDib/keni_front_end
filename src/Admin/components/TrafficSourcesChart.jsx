import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import API_BASE_URL from '../../config';

const TrafficSourcesChart = () => {
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);

  // 🎨 Générer N couleurs distinctes automatiquement
  const generateColors = (n) => {
    return Array.from({ length: n }, (_, i) =>
      `hsl(${(i * 360) / n}, 70%, 55%)`
    );
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${API_BASE_URL}/pays-data`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const data = res.data || [];

        // Nettoyer et transformer les données
        const values = data.map(item => Number(item.total) || 0);
        const pays = data.map(item => item.pays ?? "Inconnu");

        setSeries(values);
        setLabels(pays);
      })
      .catch(err => console.error(err));
  }, []);

  const totalVisitors = series.reduce((a, b) => a + b, 0);

  const options = {
    chart: {
      type: 'donut',
      fontFamily: "'Open Sans', sans-serif",
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: { enabled: true, delay: 150 },
        dynamicAnimation: { enabled: true, speed: 350 }
      }
    },
    labels: labels,
    colors: generateColors(labels.length), // ✅ couleurs dynamiques
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
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(1) + '%';
      },
      style: {
        fontFamily: "'Open Sans', sans-serif",
        fontSize: '12px',
        fontWeight: 'bold',
        colors: ['#fff']
      },
      dropShadow: { enabled: true, blur: 3, opacity: 0.5 }
    },
    legend: {
      position: 'bottom',
      fontFamily: "'Open Sans', sans-serif",
      fontSize: '12px',
      formatter: function (seriesName, opts) {
        const value = opts.w.globals.series[opts.seriesIndex];
        const percent = ((value / totalVisitors) * 100).toFixed(1);
        return `${seriesName} - ${value} (${percent}%)`;
      }
    },
    tooltip: {
      y: {
        formatter: function (val, opts) {
          const percent = ((val / totalVisitors) * 100).toFixed(1);
          return `${val} visiteurs (${percent}%)`;
        }
      },
      theme: 'dark'
    },
    title: {
      text: 'Visiteurs par Pays',
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
        chart: { height: 300 },
        legend: { position: 'bottom' }
      }
    }]
  };

  // Trouver le pays top
  const topIndex = series.indexOf(Math.max(...series));
  const topCountry = labels[topIndex] || '';
  const topValue = series[topIndex] || 0;
  const topPercent = totalVisitors > 0 ? ((topValue / totalVisitors) * 100).toFixed(1) : 0;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1">
        {series.length > 0 ? (
          <ReactApexChart options={options} series={series} type="donut" height="100%" />
        ) : (
          <div className="text-center text-gray-500 p-4">Chargement...</div>
        )}
      </div>

      {/* Stats sous le chart */}
      {series.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-center text-xs">
          <div className="bg-rose-50 p-2 rounded">
            <div className="font-semibold text-rose-600">{totalVisitors}</div>
            <div className="text-gray-500">Visiteurs totaux</div>
          </div>
          <div className="bg-pink-50 p-2 rounded">
            <div className="font-semibold text-pink-600">{topCountry}</div>
            <div className="text-gray-500">Pays principal ({topPercent}%)</div>
          </div>
          {labels.slice(0, 2).map((pays, i) => {
            const percent = totalVisitors > 0 ? ((series[i] / totalVisitors) * 100).toFixed(1) : 0;
            return (
              <div key={i} className="bg-purple-50 p-2 rounded">
                <div className="font-semibold text-purple-600">{percent}%</div>
                <div className="text-gray-500">{pays}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrafficSourcesChart;
