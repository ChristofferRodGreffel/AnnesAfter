import React from "react";

const CategoryShowHideButton = (props) => {

  // Udviklet fælles i gruppen
  
  const handleChangeVisibility = () => {
    props.setState(!props.state);
  };

  return (
    <button
      onClick={handleChangeVisibility}
      className={`px-5 py-2 rounded-lg font-medium ${
        props.state ? "bg-dark text-white" : "bg-none border-2 border-dark text-dark customClassShowHideButton" 
      }`}
    >
      {props.text}
    </button>
  );
};

export default CategoryShowHideButton;
