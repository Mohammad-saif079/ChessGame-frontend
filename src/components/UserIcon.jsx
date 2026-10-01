import React from 'react';

const UserIcon = ({ size = 30, color = "white", strokeWidth = 1.5, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.0002 17.1252C8.50862 17.8323 7.24757 18.9471 6.36273 20.3406C5.47789 21.7341 5.00538 23.3495 4.99979 25.0002C4.99979 25.1644 5.03213 25.3269 5.09498 25.4786C5.15782 25.6303 5.24994 25.7681 5.36606 25.8842C5.48217 26.0002 5.62002 26.0923 5.77172 26.155C5.92343 26.2178 6.08601 26.2501 6.25019 26.25H23.7498C24.0813 26.25 24.3993 26.1183 24.6337 25.884C24.8682 25.6496 25 25.3317 25.0002 25.0002C25.0017 23.3431 24.5326 21.7196 23.6473 20.3188C22.7621 18.9179 21.4971 17.7973 19.9998 17.0874"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 18.75C19.1424 18.75 22.5 15.3924 22.5 11.25C22.5 7.1076 19.1424 3.75 15 3.75C10.8576 3.75 7.5 7.1076 7.5 11.25C7.5 15.3924 10.8576 18.75 15 18.75Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default UserIcon;