import React from "react";

const CustomButton = (props) => {
  // Udviklet fælles i gruppen
  // Bruges som knaper

  return (
    <button
      className={`flex cursor-pointer justify-center items-center w-full gap-2 rounded-lg p-3 md:p-2 text-white font-semibold ${
        props.customWidth && props.customWidth
      } ${props.customColor ? props.customColor : "bg-primary"}`}
      onClick={props.function}
      disabled={props.disabled ? true : false}
      type={props.type}
    >
      {props.iconRight ? (
        <>
          {props.title}
          {props.icon && <i className={`${props.icon} text-lg`}></i>}
        </>
      ) : (
        <>
          {props.icon && <i className={`${props.icon} text-lg`}></i>}
          {props.title}
        </>
      )}
    </button>
  );
};

export default CustomButton;
