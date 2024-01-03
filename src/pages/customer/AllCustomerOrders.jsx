import React, { useEffect, useState } from "react";
import PageWrapperContainer from "../../components/PageWrapperContainer";
import CustomerHeader from "../../components/CustomerHeader";
import { FIREBASE_DB } from "../../../firebase-config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import OrderHistoryCard from "../../components/OrderHistoryCard";
import { PulseLoader } from "react-spinners";
import CustomButton from "../../components/CustomButton";
import { useNavigate } from "react-router-dom";

const AllCustomerOrders = () => {
  const [userLoggedIn, setUserLoggedIn] = useState();
  const [currentUser, setCurrentUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [allCustomerOrders, setAllCustomerOrders] = useState([]);
  const [localOrder, setLocalOrder] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    // Get the current user
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user.uid);
        setUserLoggedIn(true);
      } else {
        setUserLoggedIn(false);
      }
    });

    // Get the users' orders
    if (currentUser) {
      const getUserOrders = async () => {
        const q = query(collection(FIREBASE_DB, "orders"), where("orderOwner", "==", currentUser));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const newOrders = [];
          querySnapshot.forEach((doc) => {
            newOrders.push(doc.data());
          });
          setAllCustomerOrders(newOrders);
        });
        setLoading(false);
      };

      getUserOrders();
    } else {
      getLocalOrder();
      setLoading(false);
    }
  }, [currentUser]);

  const getLocalOrder = async () => {
    const orderFromLocalStorage = await JSON.parse(localStorage.getItem("currentOrder"));
    if (orderFromLocalStorage) {
      const unsub = onSnapshot(doc(FIREBASE_DB, "orders", orderFromLocalStorage), (doc) => {
        const newLocalOrder = [];
        newLocalOrder.push(doc.data());
        setAllCustomerOrders(newLocalOrder);
      });
    }
  };

  return (
    <>
      <CustomerHeader nav={true} iconLeft="fa-solid fa-bars" iconRight="fa-solid fa-basket-shopping" />
      <PageWrapperContainer>
        {loading ? (
          <div className="text-center mt-16">
            <PulseLoader color="#373737" size={13} />
          </div>
        ) : (
          <>
            {userLoggedIn ? (
              allCustomerOrders?.length !== 0 ? (
                <>
                  <div className="breakout mt-5 mb-5">
                    <p className="font-medium text-lg">Aktive bestillinger</p>
                    <hr className="border-b-2 border-dark" />
                  </div>
                  <div className="breakout flex flex-col gap-5">
                    {allCustomerOrders?.map((order, key) => {
                      if (
                        order.status !== "picked" &&
                        order.status !== "userCancelled" &&
                        order.status !== "shopCancelled"
                      ) {
                        return (
                          <div key={key}>
                            <OrderHistoryCard order={order} />
                          </div>
                        );
                      }
                    })}
                  </div>
                  <div className="breakout mt-5 mb-5">
                    <p className="font-medium text-lg">Afsluttede bestillinger</p>
                    <hr className="border-b-2 border-dark" />
                  </div>
                  <div className="breakout flex flex-col gap-5">
                    {allCustomerOrders?.map((order, key) => {
                      if (
                        order.status === "picked" ||
                        order.status === "userCancelled" ||
                        order.status === "shopCancelled"
                      ) {
                        return (
                          <div key={key}>
                            <OrderHistoryCard order={order} />
                          </div>
                        );
                      }
                    })}
                  </div>
                </>
              ) : (
                <>
                  <h1 className="font-medium text-lg text-center mt-16">Du har endnu ingen bestillinger.</h1>
                  <div className="w-80 m-auto mt-10">
                    <CustomButton title="Bestil nu" function={() => navigate("/bestil-online")} />
                  </div>
                </>
              )
            ) : (
              <>
                <div className="breakout flex flex-col gap-5 mt-10">
                  {allCustomerOrders?.map((order, key) => {
                    return (
                      <div key={key}>
                        <OrderHistoryCard order={order} />
                      </div>
                    );
                  })}
                </div>
                {allCustomerOrders?.length === 0 ? (
                  <p className="text-center text-lg font-medium mt-16">
                    Du har ingen aktive bestillinger. <br /> Når du ikke er logget ind, kan du kun se din seneste
                    bestilling.
                  </p>
                ) : (
                  <p className="text-center text-lg font-medium mt-16">
                    Da du ikke er logget ind, viser vi kun din seneste bestilling.
                  </p>
                )}

                <div className="breakout mt-10">
                  <CustomButton
                    title="Opret profil"
                    iconRight={true}
                    icon="fa-solid fa-user-plus"
                    function={() => navigate("/opret-profil")}
                  />
                </div>
              </>
            )}
          </>
        )}
      </PageWrapperContainer>
    </>
  );
};

export default AllCustomerOrders;
