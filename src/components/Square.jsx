import React from 'react'

const Square = ({ data }) => {
  return (
    <div
      className={` flex items-center justify-center
        w-[12.5%] aspect-square
        ${data.color === "b" ? "bg-[#242733]" : "bg-[#343849]"}
      `}
    >
        <div className='w-[20%] aspect-square rounded-full bg-[#9CA3AF] ' ></div>

    </div>
  );
};

export default Square;


