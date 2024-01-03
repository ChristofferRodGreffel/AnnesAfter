import React from "react";
import { Link } from "react-router-dom";

const MenuCategoryLink = (props) => {

  //  Udviklet fælles i gruppen

  return (
    <Link
      to={props.link}
      className="bg-primary text-white flex justify-between items-center p-7 rounded-xl font-medium text-xl"
    >
      {props.title}
      <i className={`${props.icon} text-3xl`}></i>
    </Link>
  );
};

export default MenuCategoryLink;
