'use client';

import React from 'react';

interface TriangleOutlineProps {
  direction?: 'left' | 'right';
  color?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
  dash?: string;
}

const TriangleOutline: React.FC<TriangleOutlineProps> = ({
  direction = 'right',
  color = 'rgba(156, 152, 152, 0.8)', 
  width = 150,
  height = 250, 
  strokeWidth = 1,
  dash = '4,4',
}) => {
  const points =
    direction === 'right'
      ? `0,0 ${width},${height / 2} 0,${height}`
      : `${width},0 0,${height / 2} ${width},${height}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon
        points={points}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={dash}
      />
    </svg>
  );
};

export default TriangleOutline;
