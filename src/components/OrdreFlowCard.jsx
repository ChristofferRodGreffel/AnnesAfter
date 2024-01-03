import React from "react";
import { useNavigate } from "react-router-dom";

const OrdreFlowCard = (props) => {
  const navigate = useNavigate();

  const handleOpenOrder = (docId) => {
    navigate(`/ordre-oversigt/ordredetaljer/${docId}`);
  };

  return (
    <>
      {props.status === "recieved" && (
        <div
          onClick={() => handleOpenOrder(props.docId)}
          className="flex gap-2 justify-center items-center py-2 px-5 bg-lightGrey w-28 font-medium border-dark border-2 cursor-pointer rounded-r-lg text-lg"
        >
          <i className="fa-solid fa-file-lines text-xl text-dark"></i>#{props.orderNo}
        </div>
      )}
      {props.status === "accepted" && (
        <div
          onClick={() => handleOpenOrder(props.docId)}
          className="flex gap-2 justify-center items-center py-2 px-5 bg-yellow-100 w-28 font-medium border-yellow-600 border-2 cursor-pointer rounded-lg text-yellow-700 text-lg"
        >
          <i className="fa-solid fa-clock text-lg text-yellow-700"></i>#{props.orderNo}
        </div>
      )}
      {props.status === "ready" && (
        <div
          onClick={() => handleOpenOrder(props.docId)}
          className="flex gap-2 items-center py-2 px-5 bg-lightGreen w-28 font-medium min-w-fit border-green border-2 cursor-pointer rounded-lg text-green text-lg"
        >
          <i className="fa-solid fa-check text-xl text-green"></i>#{props.orderNo}
        </div>
      )}
      {(props.status === "userCancelled" || props.status === "shopCancelled") && (
        <div
          onClick={() => handleOpenOrder(props.docId)}
          className="flex gap-2 items-center py-2 px-5 bg-lightRed w-28 font-medium min-w-fit border-red border-2 cursor-pointer rounded-lg text-red text-lg"
        >
          <i className="fa-solid fa-xmark text-xl text-red"></i>#{props.orderNo}
        </div>
      )}
    </>
  );
};

export default OrdreFlowCard;
