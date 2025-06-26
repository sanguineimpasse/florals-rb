import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

function getCorrelationText(value: number) {
  const abs = Math.abs(value);
  const direction = value < 0 ? "Negative" : "Positive";

  if (abs >= 0.75) return `High ${direction}`;
  if (abs >= 0.5) return `Moderate ${direction}`;
  if (abs >= 0.3) return `Low ${direction}`;
  return "No Correlation";
}

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface Props {
  data: { respondent: string; value: number }[];
}

const ITEMS_PER_PAGE = 10;

const CorrelationChart: React.FC<Props> = ({ data }) => {
  const [page, setPage] = React.useState(0);
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const paginated = data.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  const chartData = {
    labels: paginated.map((d) => d.respondent),
    datasets: [
      {
        label: "Physical-Nutrition Correlation",
        data: paginated.map((d) => d.value),
        backgroundColor: "#4C93FF",
      },
    ],
  };

  return (
    <div className="flex flex-col gap-4">
      <Bar data={chartData} options={{ responsive: true }} />
      <div className="grid grid-cols-2 gap-2 px-4 text-sm">
  {paginated.map((entry, index) => (
    <div key={index} className="flex justify-between border-b py-1">
      <span>{entry.respondent}</span>
      <span className="text-muted-foreground">
        Correlation: {getCorrelationText(entry.value)} (r = {entry.value.toFixed(2)})
      </span>
    </div>
  ))}
</div>
      <div className="flex justify-between items-center px-4">
        <button
          className="px-2 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
        >
          Prev
        </button>
        <span className="text-sm text-muted-foreground">
          Page {page + 1} of {totalPages}
        </span>
        <button
          className="px-2 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={page + 1 >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CorrelationChart;
