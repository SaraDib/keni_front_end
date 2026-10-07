import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import API_BASE_URL from '../../config';
import { Spinner } from '../ui';

// Palette et styles communs aux graphiques du back-office
const CHART_COLORS = ['#1E3A8A', '#9FB873', '#3C5DB5', '#8EA6DD', '#F59E0B', '#14B8A6'];
const FONT_FAMILY = "'Open Sans', sans-serif";

const StatTile = ({ value, label }) => (
  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
    <div className="truncate text-sm font-semibold text-gray-900">{value}</div>
    <div className="mt-0.5 truncate text-xs text-gray-500">{label}</div>
  </div>
);

const TrafficSourcesChart = () => {
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);

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
      toolbar: { show: false },
      fontFamily: FONT_FAMILY,
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: { enabled: true, delay: 150 },
        dynamicAnimation: { enabled: true, speed: 350 }
      }
    },
    labels: labels,
    colors: CHART_COLORS,
    stroke: { width: 2, colors: ['#fff'] },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: true,
            name: { color: '#6B7280', fontSize: '12px', fontFamily: FONT_FAMILY },
            value: { color: '#111827', fontSize: '20px', fontWeight: 600, fontFamily: FONT_FAMILY },
            total: {
              show: true,
              label: 'Total',
              color: '#6B7280',
              fontSize: '12px',
              fontWeight: 500,
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
        fontFamily: FONT_FAMILY,
        fontSize: '11px',
        fontWeight: 600,
        colors: ['#fff']
      },
      dropShadow: { enabled: false }
    },
    legend: {
      position: 'bottom',
      fontFamily: FONT_FAMILY,
      fontSize: '12px',
      labels: { colors: '#4B5563' },
      markers: { radius: 12 },
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
      }
    },
  };

  // Trouver le pays top
  const topIndex = series.indexOf(Math.max(...series));
  const topCountry = labels[topIndex] || '';
  const topValue = series[topIndex] || 0;
  const topPercent = totalVisitors > 0 ? ((topValue / totalVisitors) * 100).toFixed(1) : 0;

  return (
    <div className="flex h-full w-full flex-col">
      <div className="min-h-0 flex-1">
        {series.length > 0 ? (
          <ReactApexChart options={options} series={series} type="donut" height="100%" width="100%" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Spinner />
          </div>
        )}
      </div>

      {/* Stats sous le chart */}
      {series.length > 0 && (
        <div className="mt-2 grid grid-cols-2 gap-2 text-center md:grid-cols-4">
          <StatTile value={totalVisitors} label="Visiteurs totaux" />
          <StatTile value={topCountry} label={`Pays principal (${topPercent}%)`} />
          {labels.slice(0, 2).map((pays, i) => {
            const percent = totalVisitors > 0 ? ((series[i] / totalVisitors) * 100).toFixed(1) : 0;
            return <StatTile key={i} value={`${percent}%`} label={pays} />;
          })}
        </div>
      )}
    </div>
  );
};

export default TrafficSourcesChart;
