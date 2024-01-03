import React from "react";

const OrderButton = (props) => {
  // Udviklet fælles i gruppen

  return (
    <button
      className={`border-2 rounded-lg text-dark px-8 py-2 w-full font-semibold transition-all ${
        props.green
          ? "border-green bg-lightGreen hover:bg-green hover:text-white"
          : "border-red bg-lightRed hover:bg-red hover:text-white"
      }`}
      onClick={props.function}
    >
      {props.text}
    </button>
  );
};

export default OrderButton;
