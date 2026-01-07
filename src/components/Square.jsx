import React from "react";

const Square = ({ data }) => {

    

    const handleclick = () => { 
        console.log("clicked",data.square)
     }
   
    return (
        <div onClick={handleclick}
            className={`
        flex items-center justify-center
        w-[12.5%] aspect-square
        ${data.color === "b" ? data.isSelected ? "bg-[#9CA3Af]":  "bg-[#242733]" : data.isSelected?"bg-[#9CA3Af]": "bg-[#343849]"}
        
      `}
        >
            {data.isValid && (
                <div className="w-[20%] aspect-square rounded-full bg-[#9CA3AF]" />
            )}
        </div>
    );
};

export default Square;
