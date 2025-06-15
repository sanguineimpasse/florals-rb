import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

type Response = {
  [id: string]: string
}

type ChartProps = {
  rawData: Response
  type?: string
}

function keyRenamer(key:string){
  switch(key){
    case "1":
      return "Never"
    case "2":
      return "Seldom"
    case "3":
      return "Often"
    case "4":
      return "Always"
    default:
      return key;
  }
}

const ResponseChart = ({
  rawData,
  type
}: ChartProps) => {

  const [chartData, setChartData] = React.useState<Response[]>();

  React.useEffect(()=>{
    if(type==="survresponses"){
      const converted = Object.entries(rawData).map(([key, value]) => ({
        name: keyRenamer(key),
        value,
      }));
      setChartData(converted);
    }else{
      const converted = Object.entries(rawData).map(([key, value]) => ({
        name: key,
        value,
      }));
      setChartData(converted);
    }
    
    //console.log(chartData);
  },[rawData]);

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

  return(
    <div className="w-full h-100">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {chartData &&
            <Pie 
              data={chartData}
              dataKey="value" 
              cx="50%" 
              cy="50%" 
              outerRadius="80%" 
              label
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
          }
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
  </div>
  )
};

export default ResponseChart;