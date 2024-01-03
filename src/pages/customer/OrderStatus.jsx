import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FIREBASE_DB } from "../../../firebase-config";
import { doc, onSnapshot } from "firebase/firestore";
import CustomerHeader from "../../components/CustomerHeader";
import PageWrapperContainer from "../../components/PageWrapperContainer";
import StatusBar from "../../components/StatusBar";
import CancelOrder from "../../components/CancelOrder";
import CustomButton from "../../components/CustomButton";
import UpdatesBar from "../../components/UpdatesBar";
import { timestampConvert } from "../../helperfunctions/TimestampConvert";
import { toast } from "react-toastify";
import { DefaultToastifySettings } from "../../helperfunctions/DefaultToastSettings";
import { PulseLoader } from "react-spinners";

// Udviklet fælles i gruppen

const OrderStatus = () => {
  const { orderId } = useParams();
  const [currentOrderId, setCurrentOrderId] = useState("");
  const [currentOrder, setCurrentOrder] = useState();

  const [loading, setLoading] = useState(true);

  // Kig først efter ordre id'et i params, ellers i localStorage
  useEffect(() => {
    setLoading(true);
    if (!orderId) {
      setCurrentOrderId(JSON.parse(localStorage.getItem("currentOrder")));
      setLoading(false);
      return;
    }

    // Prøver først ID fra params, ellers falder den tilbage på ID fra localStorage
    const unsub = onSnapshot(doc(FIREBASE_DB, "orders", orderId), (doc) => {
      setCurrentOrder(doc.data());
      setLoading(false);
    });
  }, []);

  const handleSaveOrder = () => {
    toast.error("Funktionen er ikke lavet", DefaultToastifySettings);
  };

  const handleShareOrder = async () => {
    await navigator.clipboard.writeText(location.href).then(() => {
      toast.success(`Link kopieret ${location.href}`, DefaultToastifySettings);
    });
  };

  const totalOrderPrice = () => {
    let totalPrice = 0;
    currentOrder.order.forEach((product) => {
      totalPrice += product.price;
    });
    return totalPrice;
  };

  return (
    <>
      <CustomerHeader
        nav={false}
        iconLeft="fa-solid fa-circle-arrow-left"
        iconRight="fa-solid fa-basket-shopping"
        hideRightIcon={true}
        customLink="/bestillinger"
      />
      <PageWrapperContainer>
        {loading ? (
          <>
            <div className="text-center mt-16">
              <PulseLoader color="#000000" />
              <p>Søger efter ordre...</p>
            </div>
          </>
        ) : (
          <>
            {!currentOrder && (
              <>
                <p className="text-xl font-semibold">Der er ingen ordre med dette ID.</p>
                <p>
                  Hvis du mener det er en fejl er du velkommen til at ringe til butikken på tlf.{" "}
                  <span className="font-semibold">22 13 35 78</span>
                </p>
              </>
            )}
            {currentOrder && (
              <div className="mt-8 mb-10">
                <div className="flex justify-between items-center">
                  <h1 className="font-bold text-2xl">Ordre #{currentOrder?.orderNo}</h1>
                  <div className="flex items-center gap-2 text-lg cursor-pointer" onClick={handleShareOrder}>
                    <p className="font-semibold">Del ordre</p>
                    <i className="fa-solid fa-share-from-square text-xl"></i>
                  </div>
                </div>
                <div className="mt-12">
                  {currentOrder.status !== "userCancelled" &&
                    currentOrder.status !== "shopCancelled" &&
                    currentOrder.status !== "pending" && <StatusBar status={currentOrder?.status} />}
                </div>
                <div className="mt-16 mb-16 flex text-center w-full max-w-max m-auto text-xl relative">
                  {currentOrder?.status === "pending" && <p>"Din bestiling er sendt til butikken"</p>}
                  {currentOrder?.status === "recieved" && <p>"Din bestiling er modtaget"</p>}
                  {currentOrder?.status === "accepted" && <p>"Vi har accepteret din bestilling"</p>}
                  {currentOrder?.status === "ready" && <p>"Din bestiling er klar i butikken"</p>}
                  {currentOrder?.status === "picked" && <p>"Du har afhentet din mad, velbekomme"</p>}
                  {currentOrder?.status === "userCancelled" && <p>"Du har annulleret din ordre"</p>}
                  {currentOrder?.status === "shopCancelled" && <p>"Butikken har annulleret din ordre"</p>}
                  <i className="fa-solid fa-comment absolute -right-2 -top-5 text-8xl opacity-10 text-grey"></i>
                </div>
                <div>
                  {currentOrder?.commentsFromShop && (
                    <>
                      {currentOrder?.commentsFromShop
                        ?.slice(0)
                        .reverse()
                        .map((comment, key) => {
                          return (
                            <div key={key} className="flex flex-col gap-2 mb-4">
                              <div className="flex flex-col">
                                <p className="text-xl text-primary font-semibold">Besked fra butikken:</p>
                                <div className="p-4 border-dark border-2 rounded-xl w-full md:min-w-[300px] md:max-w-max">
                                  <p className="text-md font-medium italic max-w-readable">
                                    "{comment.messageToCustomer}"
                                  </p>
                                </div>
                              </div>
                              <p>{timestampConvert(comment.date.seconds, "stampToPreciseDate")}</p>
                            </div>
                          );
                        })}
                    </>
                  )}
                </div>
                <div className="mt-10 full-width">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">Afhentningstid</h3>
                    <p>
                      {currentOrder.pickup.time !== "Hurtigst muligt"
                        ? timestampConvert(currentOrder.pickup.time.seconds, "stampToHourMinute")
                        : "Hurtigst muligt"}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">Afhentningsdato</h3>
                    <p>{timestampConvert(currentOrder.pickup.date.seconds, "stampToDate")}</p>
                  </div>
                  <div className="flex items-center mt-5 gap-2">
                    <h3 className="font-medium">Til betaling:</h3>
                    <p className="font-bold">{totalOrderPrice()} kr.</p>
                  </div>
                  <p className="max-w-readable mt-4">
                    Har du spørgsmål, brug for hjælp eller lignende, er du velkommen til at ringe til butikken på tlf.{" "}
                    <span className="font-semibold">22 13 35 78</span>
                  </p>
                </div>
                <div className="mt-8">
                  <CancelOrder
                    placedAt={currentOrder.orderPlacedAt}
                    orderId={orderId || currentOrderId}
                    canCancel={currentOrder.canCancel}
                  />
                </div>
                <div className="mt-5">
                  <CustomButton
                    iconRight={true}
                    function={handleSaveOrder}
                    customWidth="w-full"
                    title="Gem bestilling"
                    icon={"fa-solid fa-heart"}
                  />
                </div>
                <div className="mt-10">
                  <p className="text-xl font-bold">Opdateringsoversigt</p>
                  <div className="mt-5">
                    <UpdatesBar orderId={orderId || currentOrderId} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </PageWrapperContainer>
    </>
  );
};

export default OrderStatus;
