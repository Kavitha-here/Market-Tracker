import React, { useMemo } from 'react';
import { HistoricalDataPoint } from '../types';

interface HistoricalChartProps {
  data: HistoricalDataPoint[];
}

const HistoricalChart: React.FC<HistoricalChartProps> = ({ data }) => {
  const width = 800;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // FIX: Extract yScale from useMemo to make it accessible in the render method,
  // and add a check to prevent division by zero.
  const { minPrice, maxPrice, path, areaPath, gradientId, yScale } = useMemo(() => {
    if (data.length < 2) return { minPrice: 0, maxPrice: 0, path: '', areaPath: '', gradientId: '', yScale: (_: number) => 0 };

    const prices = data.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const xScale = (index: number) => (index / (data.length - 1)) * innerWidth;
    const yScale = (price: number) => {
        if (maxPrice === minPrice) return innerHeight / 2;
        return innerHeight - ((price - minPrice) / (maxPrice - minPrice)) * innerHeight;
    };
    
    const pathData = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xScale(i)},${yScale(d.price)}`).join(' ');
    
    const areaPathData = `${pathData} V${innerHeight} L${xScale(0)},${innerHeight} Z`;

    const isPositive = data[data.length - 1].price >= data[0].price;
    const gradientId = isPositive ? 'chart-gradient-positive' : 'chart-gradient-negative';

    return { minPrice, maxPrice, path: pathData, areaPath: areaPathData, gradientId, yScale };
  }, [data, innerWidth, innerHeight]);

  if (data.length < 2) {
    return <div className="flex items-center justify-center h-full text-gray-500">Not enough data to display chart.</div>;
  }
  
  const strokeColor = data[data.length - 1].price >= data[0].price ? '#4ade80' : '#f87171';

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      <defs>
        <linearGradient id="chart-gradient-positive" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="chart-gradient-negative" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f87171" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#f87171" stopOpacity={0} />
        </linearGradient>
      </defs>

      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {/* Y-axis labels */}
        <text x={-10} y={yScale(maxPrice)} dy="0.32em" textAnchor="end" fill="#9ca3af" fontSize="12">
          {maxPrice.toFixed(2)}
        </text>
        <text x={-10} y={yScale(minPrice)} textAnchor="end" fill="#9ca3af" fontSize="12">
          {minPrice.toFixed(2)}
        </text>

        {/* X-axis labels */}
        <text x={0} y={innerHeight + 20} textAnchor="start" fill="#9ca3af" fontSize="12">
          {new Date(data[0].date).toLocaleDateString()}
        </text>
        <text x={innerWidth} y={innerHeight + 20} textAnchor="end" fill="#9ca3af" fontSize="12">
          {new Date(data[data.length - 1].date).toLocaleDateString()}
        </text>

        <path d={areaPath} fill={`url(#${gradientId})`} />
        
        <path d={path} fill="none" stroke={strokeColor} strokeWidth="2" />
      </g>
    </svg>
  );
};

export default HistoricalChart;