import React from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const getGroup = (x: number, y: number): string => {
  const highX = x >= 3;
  const highY = y >= 3;

  if (highX && highY) return 'High Physical - High Nutrition';
  if (highX && !highY) return 'High Physical - Low Nutrition';
  if (!highX && highY) return 'Low Physical - High Nutrition';
  return 'Low Physical - Low Nutrition';
};

const ClusterScatterChart = ({
  data,
}: {
  data: { x: number; y: number }[];
}) => {
  const [colors, setColors] = React.useState<string[]>([]);
    
  const getShadcnColor = (name: string): string => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(`--${name}`)
      .trim();
  };

  React.useEffect(() => {
    const updateColors = () => {
      setColors([
        getShadcnColor("chart-1"),
        getShadcnColor("chart-2"),
        getShadcnColor("chart-3"),
        getShadcnColor("chart-4"),
        getShadcnColor("chart-5"),
      ]);
    };

    updateColors();

    // Optional: Update colors if user toggles dark mode
    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  // Group colors
  const groupColors: Record<string, string> = {
    'High Physical - High Nutrition': colors[0],
    'High Physical - Low Nutrition': colors[1],
    'Low Physical - High Nutrition': colors[2],
    'Low Physical - Low Nutrition': colors[3],
  };

  // Group the data
  const groupedData: Record<string, { x: number; y: number }[]> = {};

  data.forEach((point) => {
    const group = getGroup(point.x, point.y);
    if (!groupedData[group]) {
      groupedData[group] = [];
    }
    groupedData[group].push(point);
  });

  const datasets = Object.entries(groupedData).map(([group, points]) => ({
    label: `${group} (${points.length})`,
    data: points,
    backgroundColor: groupColors[group],
    pointRadius: 6,
  }));

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Scatter
        data={{ datasets }}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          layout: {
            padding: 20,
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const raw = ctx.raw as { x: number; y: number };
                  const groupLabel = ctx.dataset.label;
                  return [
                    `Group: ${groupLabel}`,
                    `x: ${raw.x.toFixed(2)}, y: ${raw.y.toFixed(2)}`,
                  ];
                },
              },
            },
            legend: { position: 'top' },
          },
          scales: {
            x: {
              title: { display: true, text: 'Physical Score Avg' },
              min: 1,
              max: 4,
              ticks: {
                stepSize: 1,
                precision: 0,
              },
            },
            y: {
              title: { display: true, text: 'Nutrition Score Avg' },
              min: 1,
              max: 4,
              ticks: {
                stepSize: 1,
                precision: 0,
              },
            },
          },
        }}
      />
    </div>
  );
};

export default ClusterScatterChart;