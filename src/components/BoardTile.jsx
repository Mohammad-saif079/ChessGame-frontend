import React from 'react';

const BoardTileIcon = ({ 
  size = 42, 
  lightColor = "#1F2937", // Slate Gray
  darkColor = "#111827",  // Midnight Blue-Black
  ...props 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
     
      {...props}
    >
      {/* Bottom Right */}
      <rect x="21" y="21" width="21" height="21" fill={lightColor} />
      {/* Bottom Left */}
      <rect y="21" width="21" height="21" fill={darkColor} />
      {/* Top Left */}
      <rect width="21" height="21" fill={lightColor} />
      {/* Top Right */}
      <rect x="21" width="21" height="21" fill={darkColor} />
    </svg>
  );
};

export default BoardTileIcon;