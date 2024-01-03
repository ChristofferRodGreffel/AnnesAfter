import React, { useEffect, useState } from "react";
import CountdownTimer from "./CountdownTimer";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase-config";

// Udviklet primært af Christoffer

const CancelOrder = (props) => {
  const [elapsedTime, setElapsedTime] = useState();
  const [remainingTime, setRemainingTime] = useState(3 * 60 * 1000); // 3 minutes in milliseconds

  useEffect(() => {
    const timeNow = new Date().getTime();
    let timestamp = props.placedAt.seconds;
    let timeAtOrder = timestamp * 1000;
    const elapsedTime = timeNow - timeAtOrder;
    setElapsedTime(elapsedTime);

    // Calculate remaining time
    const newRemainingTime = Math.max(3 * 60 * 1000 - elapsedTime, 0);
    setRemainingTime(newRemainingTime);
  }, []);

  const handleCancelOrder = async () => {
    // Tjek om brugeren har lov til at annullere
    if (props.canCancel) {
      // Change status in firestore to cancelled
      const orderRef = doc(FIREBASE_DB, "orders", props.orderId);

      const updateObject = {
        context: "Ordre annulleret af kunde",
        time: new Date(),
        type: "cancel",
      };

      // To update in Firestore:
      await updateDoc(orderRef, {
        status: "userCancelled",
        canCancel: false,
        updates: arrayUnion(updateObject),
      });

      // Delete the orderId from localStorage preventing access to the page
      localStorage.removeItem("currentOrder");
    } else {
      return;
    }
  };

  return (
    <>
      <div className="w-full rounded-xl overflow-clip">
        <div
          onClick={handleCancelOrder}
          className={`${
            !props.canCancel && "!bg-grey"
          } flex items-center gap-2 justify-center p-4 bg-red text-white text-lg font-semibold cursor-pointer select-none`}
        >
          {props.canCancel ? (
            <>
              <p>Annuller bestilling</p>
              <i className="fa-solid fa-circle-xmark text-2xl"></i>
            </>
          ) : (
            <>
              <p>Kan ikke længere annulleres</p>
            </>
          )}
        </div>
        <div className={`${!props.canCancel && "!bg-dark text-white"} flex justify-center gap-1 p-1 bg-mainGrey`}>
          <>
            <p>Annuller inden:</p>
            {elapsedTime && (
              <CountdownTimer
                initialRemainingTime={remainingTime}
                orderId={props.orderId}
                canCancel={props.canCancel}
              />
            )}
          </>
        </div>
      </div>
    </>
  );
};

export default CancelOrder;
