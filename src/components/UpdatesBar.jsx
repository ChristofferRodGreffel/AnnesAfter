import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FIREBASE_DB } from "../../firebase-config";
import { timestampConvert } from "../helperfunctions/TimestampConvert";

const UpdatesBar = (props) => {
  // Udviklet primært af Christoffer
  // Bruges i OrderStatus

  const [updates, setUpdates] = useState();

  // Get updates from firestore
  useEffect(() => {
    const unsub = onSnapshot(doc(FIREBASE_DB, "orders", props.orderId), (doc) => {
      if (doc.data()?.updates) {
        setUpdates(doc.data().updates);
      }
    });
  }, []);

  return (
    <div className="flex flex-col-reverse">
      {updates?.map((updt, key) => {
        return (
          <div key={key} className="flex items-start gap-3">
            <div className="flex flex-col-reverse">
              <div className="flex flex-col items-center">
                {updt.type !== "cancel" ? (
                  <>
                    {key + 1 !== updates.length ? (
                      <div className="bg-dark w-5 h-5 rounded-full"></div>
                    ) : (
                      <div className="bg-primary w-5 h-5 rounded-full"></div>
                    )}
                  </>
                ) : (
                  <div className="bg-red w-5 h-5 rounded-full"></div>
                )}

                {key !== 0 && <div className="border-2 border-dark h-10"></div>}
              </div>
            </div>
            <div className="flex justify-between place-items-start w-full">
              <p className="font-semibold text-md leading-5">{updt.context}</p>
              <p>{timestampConvert(updt.time, "stampToHourMinute")}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UpdatesBar;
