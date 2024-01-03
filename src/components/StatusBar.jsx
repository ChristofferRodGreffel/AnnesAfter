import React from "react";

const StatusBar = (props) => {

  // Udviklet primært af Christoffer
  // Bruges i Orderstatus

  return (
    <div className="flex items-center w-auto max-w-[1500px] m-auto">
      <div className="flex items-center w-full">
        <div className="relative">
          <div
            className={`h-7 w-7 rounded-full bg-grey flex justify-center items-center text-white after:content-['Modtaget'] after:text-dark after:absolute after:text-sm after:top-8 after:font-medium ${
              props.status !== "pending" && "!bg-green"
            }`}
          >
            {props.status !== "pending" && <i className="fa-solid fa-check text-lg"></i>}
          </div>
        </div>
        <hr
          className={`border-2 border-grey w-full ${
            props.status !== "pending" && props.status !== "recieved" && "!border-green"
          }`}
        />
      </div>

      <div className="flex items-center w-full">
        <div className="relative">
          <div
            className={`h-7 w-7 rounded-full bg-grey flex justify-center items-center text-white after:content-['Godkendt'] after:text-dark after:absolute after:text-sm after:bottom-8 after:font-medium ${
              props.status !== "recieved" && props.status !== "pending" && "!bg-green"
            } `}
          >
            {props.status !== "recieved" && props.status !== "pending" && <i className="fa-solid fa-check text-lg"></i>}
          </div>
        </div>
        <hr
          className={`border-2 border-grey w-full ${
            props.status !== "pending" && props.status !== "recieved" && props.status !== "accepted" && "!border-green"
          }`}
        />
      </div>

      <div className="flex items-center w-full">
        <div className="relative">
          <div
            className={`h-7 w-7 rounded-full bg-grey flex justify-center items-center text-white after:content-['Klar_i_butik'] after:text-dark after:absolute after:text-sm after:top-8 after:font-medium after:w-max ${
              props.status !== "recieved" && props.status !== "pending" && props.status !== "accepted" && "!bg-green"
            } `}
          >
            {props.status !== "recieved" && props.status !== "pending" && props.status !== "accepted" && (
              <i className="fa-solid fa-check text-lg"></i>
            )}
          </div>
        </div>
        <hr
          className={`border-2 border-grey w-full ${
            props.status !== "pending" &&
            props.status !== "recieved" &&
            props.status !== "accepted" &&
            props.status !== "ready" &&
            "!border-green"
          }`}
        />
      </div>

      <div className="flex items-center">
        <div className="relative">
          <div
            className={`h-7 w-7 rounded-full bg-grey flex justify-center items-center text-white after:content-['Afhentet'] after:text-dark after:absolute after:text-sm after:bottom-8 after:font-medium ${
              props.status !== "recieved" &&
              props.status !== "pending" &&
              props.status !== "accepted" &&
              props.status !== "ready" &&
              "!bg-green"
            } `}
          >
            {props.status !== "recieved" &&
              props.status !== "pending" &&
              props.status !== "accepted" &&
              props.status !== "ready" && <i className="fa-solid fa-check text-lg"></i>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
