import React from "react";
import { PulseLoader } from "react-spinners";

const StatisticsCard = (props) => {
  return (
    <div className="flex flex-col justify-between h-40 rounded-xl p-5 bg-dark text-white min-w-full  md:min-w-[300px] w-fit">
      <h2>{props.property}</h2>
      {props.bigText ? (
        props.loading ? (
          <div className="text-center">
            <PulseLoader color="#ffffff" size={13} />
          </div>
        ) : (
          <p className="font-bold text-5xl">{props.value}</p>
        )
      ) : props.loading ? (
        <div className="text-center">
          <PulseLoader color="#ffffff" size={13} />
        </div>
      ) : (
        <p className="font-bold text-5xl">{props.value}</p>
      )}
    </div>
  );
};

export default StatisticsCard;
