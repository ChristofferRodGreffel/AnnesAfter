import React, { useEffect, useState } from "react";
import { timestampConvert } from "../helperfunctions/TimestampConvert";
import PickupTimer from "./PickupTimer";
import { useNavigate } from "react-router-dom";
import { DefaultToastifySettings } from "../helperfunctions/DefaultToastSettings";
import { toast } from "react-toastify";

const OrderCard = (props) => {
  // Udviklet fælles i gruppen

  const [remainingTime, setRemainingTime] = useState();
  const [remainingHours, setRemainingHours] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    // Beregner hvornår ordren skal hentes
    const currentTime = new Date().getTime();
    const pickupTimestamp = props.order.pickup.time.seconds;
    const pickupTime = new Date(pickupTimestamp * 1000).getTime();

    const timeRemaining = pickupTime - currentTime;

    const timeRemainingInHours = Math.floor(timeRemaining / (60 * 60 * 1000));
    setRemainingHours(timeRemainingInHours);

    setRemainingTime(timeRemaining);
  }, [props]);

  const getTotalAmount = () => {
    // Sætter antallet af produkter i ordren
    let totalAmountFromBasket = 0;
    props.order.order.forEach((subData) => (totalAmountFromBasket += subData.amount));
    return totalAmountFromBasket;
  };

  const checkPickupTime = () => {
    // Tjekker om man har valgt den aktuelle dag
    const today = new Date().toLocaleDateString("en-GB");

    const dateStamp = props.order.pickup.date.seconds;
    const orderDate = new Date(dateStamp * 1000).toLocaleDateString("en-GB");

    let pickup;

    if (orderDate !== today) {
      // Find timestampConvert i helperfunctions
      pickup = timestampConvert(dateStamp, "stampToDate");
      return pickup;
    } else {
      pickup = timestampConvert(props.order.pickup.time.seconds, "stampToHourMinute");
      return pickup;
    }
  };

  const handlePrintOrder = (e) => {
    e.stopPropagation();
    toast.error("Funktionen er ikke oprettet", DefaultToastifySettings);
  };

  return (
    <>
      {props.order && (
        <div
          className="w-56 cursor-pointer transition-all duration-300 ease-in-out hover:drop-shadow-lg"
          onClick={() => navigate(`/ordre-oversigt/ordredetaljer/${props.order.orderDocId}`)}
        >
          <div className="flex flex-col justify-between bg-mainGrey h-56 rounded-lg px-4 py-3 relative">
            <div className="flex justify-between">
              <div>
                <h1 className="font-bold text-lg rounded-xl">Ordre #{props.order.orderNo}</h1>
                <div className="text-sm font-medium leading-tight font pt-0.5">
                  <p>{timestampConvert(props.order.orderPlacedAt.seconds, "stampToDateAndHourMinute")}</p>
                  <p>{props.order.customerInfo.name}</p>
                </div>
              </div>
              <i
                onClick={(e) => handlePrintOrder(e)}
                className="fa-solid fa-print text-3xl text-grey cursor-pointer transition-all duration-75 ease-in-out hover:text-dark"
              ></i>
            </div>
            <div className="flex flex-col items-center m-auto w-full">
              <p className="font-bold text-3xl border-b-2 border-primary">{getTotalAmount()} stk.</p>
              {props.order.pickup.time !== "Hurtigst muligt" ? (
                <p className="font-medium text-lg">{checkPickupTime()}</p>
              ) : (
                <p className="font-medium text-lg">Hurtigst muligt</p>
              )}
            </div>
          </div>
          {props.order.status !== "userCancelled" && props.order.status !== "shopCancelled" && (
            <div className="flex items-center justify-center relative bottom-3 bg-primary text-white text-center -z-10 pt-4 pb-2 rounded-b-lg">
              {props.order.pickup.time !== "Hurtigst muligt" ? (
                remainingHours >= 24 ? (
                  <p>Afhentes kl. {timestampConvert(props.order.pickup.time.seconds, "stampToHourMinute")}</p>
                ) : (
                  <p>
                    {remainingTime <= 0 ? (
                      "Afhentes snarest"
                    ) : (
                      <>
                        Afhentes om: <PickupTimer remainingTime={remainingTime} />
                      </>
                    )}
                  </p>
                )
              ) : (
                <p>Afhentes snarest</p>
              )}
            </div>
          )}

          {(props.order.status === "userCancelled" || props.order.status === "shopCancelled") && (
            <div className="flex items-center justify-center relative bottom-3 bg-red text-white text-center -z-10 pt-4 pb-2 rounded-b-lg">
              {props.order.status === "userCancelled" ? <p>Annulleret af kunde</p> : <p>Annulleret af butik</p>}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default OrderCard;
