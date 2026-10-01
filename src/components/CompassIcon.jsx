import React from 'react';

const CompassIcon = ({ size = 67, color = "white", strokeWidth = 1.4, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 67 67"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >

      <path
        d="M27.5232 13.2604V25.2785L33.1624 31.3197L39.0514 25.3413V13.2604H27.5232ZM53.2582 28.2684V39.3513H42.2284L36.0588 33.7163L41.5444 28.2684H53.2582ZM33.1624 36.4898L38.9886 42.2197V53.7395H27.8973V42.2197L33.1624 36.4898ZM25.1461 28.0185L30.4112 33.7163L25.0205 39.6011H13.7422V28.0185H25.1461Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CompassIcon;