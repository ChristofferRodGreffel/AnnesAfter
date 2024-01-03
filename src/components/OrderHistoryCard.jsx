import React from "react";
import { timestampConvert } from "../helperfunctions/TimestampConvert";
import { useNavigate } from "react-router-dom";

const OrderHistoryCard = (props) => {
  const navigate = useNavigate();

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    props.order.order.forEach((item) => {
      totalPrice += item.price;
    });
    if (props.order.bagged) {
      totalPrice += 4;
    }
    return totalPrice;
  };

  return (
    <div
      className="bg-mainGrey rounded-b-lg cursor-pointer"
      onClick={() => navigate(`/følg-bestilling/${props.order?.orderDocId}`)}
    >
      {props.order?.status === "recieved" && <div className="h-3 bg-grey"></div>}
      {props.order?.status === "accepted" && <div className="h-3 bg-yellow-600"></div>}
      {props.order?.status === "ready" && <div className="h-3 bg-green"></div>}
      {props.order?.status === "picked" && <div className="h-3 bg-primary"></div>}
      {(props.order?.status === "userCancelled" || props.order?.status === "shopCancelled") && (
        <div className="h-3 bg-red"></div>
      )}
      <div className="flex gap-5 justify-between items-center p-5">
        <div>
          <h1 className="font-bold text-2xl">#{props.order?.orderNo}</h1>
          <p>{timestampConvert(props.order?.orderPlacedAt?.seconds, "stampToPreciseDate")}</p>
        </div>
        <div>
          <p>{props.order?.amount} stk.</p>
          <p className="font-bold text-2xl">{calculateTotalPrice()} kr.</p>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryCard;
