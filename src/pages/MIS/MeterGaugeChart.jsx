import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const MeterGaugeChart = ({ value = 90, label }) => {
  const data = [
    { label: "Unstainable", value: 10 },
    { label: "Volatile", value: 10 },
    { label: "Foundational", value: 10 },
    { label: "Developing", value: 10 },
    { label: "Maturing", value: 10 },
    { label: "Sustainable", value: 10 },
    { label: "High Performing", value: 10 },
  ];

  const COLORS = [
    "#d73027", "#fc8d59", "#fee08b", "#ffffbf",
    "#d9ef8b", "#91cf60", "#1a9850"
  ];

  // Slightly smaller chart dimensions
  const radius = 28;
  const centerX = 46;
  const centerY = 36;

  const angle = (180 * (100 - value)) / 100;
  const rad = (Math.PI * angle) / 180;
  const x = centerX + radius * Math.cos(rad);
  const y = centerY - radius * Math.sin(rad);

  return (
    <div style={{ width: "90px", textAlign: "center", marginLeft:"3px"}}>
      <ResponsiveContainer width="100%" height={110}>
        <PieChart>
          <Pie
            startAngle={180}
            endAngle={0}
            data={data}
            cx={centerX}
            cy={centerY}
            innerRadius={30}
            outerRadius={38}
            dataKey="value"
            paddingAngle={0}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>

          <g>
            {/* Needle */}
            <path
              d={`M${centerX - 2},${centerY} L${x},${y} L${centerX + 2},${centerY} Q${centerX},${centerY + 4} ${centerX - 2},${centerY}`}
              fill="blue"
              stroke="blue"
            />
            <circle
              cx={centerX}
              cy={centerY}
              r={2.5}
              fill="white"
              stroke="blue"
              strokeWidth="1"
            />
            <text
              x={centerX}
              y={centerY + 18}
              textAnchor="middle"
              fontSize="10"
              fill="#222"
              fontFamily="Poppins, sans-serif"
            >
              {value}%
            </text>

            {/* Label */}
            <foreignObject
              x={centerX - 45}
              y={centerY + 26}
              width={90}
              height={50}
              style={{ overflow: "visible", pointerEvents: "none" }}
            >
              <div
                xmlns="http://www.w3.org/1999/xhtml"
                style={{
                  fontSize: 8,
                  color: "#555",
                  fontFamily: "Poppins, sans-serif",
                  wordBreak: 'break-word',
                  overflowWrap: 'anywhere',
                  textAlign: "center",
                  width: "100%",
                  lineHeight: "1.1",
                  pointerEvents: "none"
                }}
              >
                {label}
              </div>
            </foreignObject>
          </g>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MeterGaugeChart;
