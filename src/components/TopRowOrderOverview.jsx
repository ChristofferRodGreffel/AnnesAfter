import React, { useEffect, useState } from "react";
import { Line } from "rc-progress";
import { collection, onSnapshot, query } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase-config";

function TopRowOrderOverview(props) {
  // Udviklet primært af Sebastian

  const [date, setDate] = useState(new Date());

  const [amountUntilBusy, setAmountUntilBusy] = useState(0);

  const [amountOfOpenOrders, setAmountOfOpenOrders] = useState(0);
  const [percentageOfOpenOrders, setPercentageOfOpenOrders] = useState(0);

  useEffect(() => {
    // Bruges som klokke
    const intervalId = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Henter information fra Firestore om hvor mange ordre butikken
    // kan håndterer. Kan sættes under indstillinger i Admin siderne
    const getAmountUntilBusy = async () => {
      const q = query(collection(FIREBASE_DB, "admin-settings"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.data().amount) {
            setAmountUntilBusy(doc.data().amount);
          }
        });
      });
    };
    getAmountUntilBusy();
  }, []);

  useEffect(() => {
    // Beregner antallet af åbne ordre samt procenten ift. hvor mange ordre butikken kan håndtere
    if (props) {
      let AmountOfRecivedOrders = props.recivedOrders?.length || 0;
      let AmountOfAccepteddOrders = props.acceptedOrders?.length || 0;
      let AmountOfReadyOrders = props.readyOrders?.length || 0;

      const totalNumberOfOpenOrders = AmountOfRecivedOrders + AmountOfAccepteddOrders + AmountOfReadyOrders;

      // amountUntilBusy er det tal fra Firestore
      const percentageOfOpenOrders = (totalNumberOfOpenOrders / amountUntilBusy) * 100;

      setAmountOfOpenOrders(totalNumberOfOpenOrders);
      setPercentageOfOpenOrders(percentageOfOpenOrders);
    }
  }, [props, amountUntilBusy]);

  return (
    <>
      {props && (
        <div className="flex flex-col-reverse flex-wrap gap-8 w-64 md:w-full md:flex-row md:justify-between md:gap-2 mb-8">
          <div>
            <input
              type="text"
              name="searchForOrder"
              value={props.filteredOrders}
              onChange={(e) => {
                props.handleShowFilteredOrders(e);
              }}
              id="searchForOrderId"
              placeholder="Søg efter ordre..."
            ></input>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between font-bold">
              <p>{amountOfOpenOrders > 1 ? `${amountOfOpenOrders} Åbne ordre` : `${amountOfOpenOrders} Åbne ordre`}</p>
              <p>
                {((amountOfOpenOrders / amountUntilBusy) * 100 < 33 && "Roligt") ||
                  ((amountOfOpenOrders / amountUntilBusy) * 100 > 33 &&
                    (amountOfOpenOrders / amountUntilBusy) * 100 < 66 &&
                    "Lidt travlt") ||
                  ((amountOfOpenOrders / amountUntilBusy) * 100 > 66 &&
                    (amountOfOpenOrders / amountUntilBusy) * 100 < 99 &&
                    "Meget travlt") ||
                  ((amountOfOpenOrders / amountUntilBusy) * 100 > 99 && "Max kapacitet")}
              </p>
            </div>
            <Line
              percent={percentageOfOpenOrders}
              className="h-4 w-64 rounded-full"
              strokeColor={`${
                ((amountOfOpenOrders / amountUntilBusy) * 100 < 33 && "#38773b") ||
                ((amountOfOpenOrders / amountUntilBusy) * 100 > 33 &&
                  (amountOfOpenOrders / amountUntilBusy) * 100 < 66 &&
                  "#38773b") ||
                ((amountOfOpenOrders / amountUntilBusy) * 100 > 66 &&
                  (amountOfOpenOrders / amountUntilBusy) * 100 < 99 &&
                  "#D7C310") ||
                ((amountOfOpenOrders / amountUntilBusy) * 100 > 99 && "#b72626")
              }`}
            />
          </div>
          <div className="text-center w-44">
            <p className="text-4xl font-black text-dark font-clock">{date.toLocaleTimeString("en-GB")}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default TopRowOrderOverview;
