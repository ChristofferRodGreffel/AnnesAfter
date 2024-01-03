import React, { useEffect, useRef, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminContentWrapper from "../../components/AdminContentWrapper";
import PageH1Title from "../../components/PageH1Title";
import BackButtonWithArrow from "../../components/BackButtonWithArrow";
import OrderCard from "../../components/OrderCard";
import { receiveFilteredOrders } from "../../helperfunctions/ReceiveFilteredOrders";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebase-config";
import { useNavigate } from "react-router-dom";

// Udviklet fælles i gruppen

const OrderHistory = () => {
  const navigate = useNavigate();

  const [allOrderNumbersWithName, setAllOrderNumbersWithName] = useState();
  const [filteredOrdersInput, setFilteredOrdersInput] = useState();
  const [filteredOrdersArray, setFilteredOrdersArray] = useState();
  const [pickedOrders, setPickedOrders] = useState();

  useEffect(() => {
    const getAllOrderNumbersWithName = async () => {
      const q = query(collection(FIREBASE_DB, "orders"), where("status", "==", "picked"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let resultArray = [];
        querySnapshot.forEach((doc) => {
          if (doc.data()?.orderNo && doc.data()?.customerInfo?.name) {
            let obj = {
              orderNo: doc.data()?.orderNo,
              name: doc.data()?.customerInfo?.name,
              docId: doc.id,
            };
            resultArray.push(obj);
          }
        });
        setAllOrderNumbersWithName(resultArray);
      });
    };
    getAllOrderNumbersWithName();
  }, []);

  useEffect(() => {
    // Get different orders based on filters and sets them in correct useState
    receiveFilteredOrders(setPickedOrders, "status", "picked");
  }, []);

  const handleShowFilteredOrders = async (e) => {
    const inputValue = e.target.value.toLowerCase();
    if (inputValue) {
      const filtered = allOrderNumbersWithName.filter(
        (order) => order.name.toLowerCase().includes(inputValue) || order.orderNo.toString().includes(inputValue)
      );
      setFilteredOrdersArray(filtered);
    } else {
      setFilteredOrdersArray();
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <AdminSidebar />
        <AdminContentWrapper>
          <BackButtonWithArrow linkText="Tilbage til ordre oversigt" linkTo="/ordre-oversigt" />
          <PageH1Title>Tidligere ordrer (afsluttede)</PageH1Title>

          <input
            type="text"
            name="searchForOrderInOrderHistory"
            value={filteredOrdersInput}
            onChange={(e) => {
              handleShowFilteredOrders(e);
            }}
            id="searchForOrderInOrderHistoryId"
            placeholder="Søg efter ordre..."
          ></input>

          {filteredOrdersArray && (
            <>
              {filteredOrdersArray.length !== 0 ? (
                <>
                  <p className="font-medium text-lg mb-2">Resultat:</p>
                </>
              ) : (
                <>
                  <p className="font-medium text-lg mt-3">Ingen ordrer matcher denne søgning</p>
                </>
              )}
              <div className="flex gap-2 flex-wrap mb-10">
                {filteredOrdersArray?.map((order) => {
                  return (
                    <div
                      key={order.orderNo}
                      className="cursor-pointer border-2 p-2 border-primary rounded-lg transition-all duration-100 ease-in-out hover:bg-primary hover:text-white"
                      onClick={() => navigate(`/ordre-oversigt/ordredetaljer/${order.docId}`)}
                    >
                      <p>
                        <b>Navn:</b> {order.name}
                      </p>
                      <p>
                        <b>Ordre nr.</b> {order.orderNo}
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <div>
            <h2 className="font-bold text-xl mb-1 mt-5">Afhentede ordre</h2>
            <hr className="border-b-2 border-dark mb-5" />
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {pickedOrders?.map((order, key) => {
                return (
                  <div key={key}>
                    <OrderCard order={order} />
                  </div>
                );
              })}
            </div>
          </div>
        </AdminContentWrapper>
      </div>
    </>
  );
};

export default OrderHistory;
