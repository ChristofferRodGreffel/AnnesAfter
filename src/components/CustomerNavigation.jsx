import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../firebase-config";
import { collection, getDocs } from "firebase/firestore";

const CustomerNavigation = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const [latestOrderId, setLatestOrderId] = useState("");

  // Tjekker om man er admin
  const checkAdminStatus = async (user) => {
    const querySnapshot = await getDocs(collection(FIREBASE_DB, "admin"));
    querySnapshot.forEach((doc) => {
      if (doc.id === user) {
        setIsAdmin(true);
      }
    });
  };

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        // User is signed in
        const uid = user.uid;
        setLoggedIn(true);
        checkAdminStatus(uid);
        // ...
      } else {
        // User is signed out
        // ...
        setLoggedIn(false);
      }
    });
  }, []);

  // Lukker menuen
  const handleCloseNav = () => {
    const customerNav = document.querySelector("#customerNav");
    if (window.innerWidth > 1023) {
      customerNav.style.left = "-40%";
    } else {
      customerNav.style.left = "-80%";
    }
  };

  useEffect(() => {
    const latestOrderIdFromStorage = JSON.parse(localStorage.getItem("currentOrder"));

    if (latestOrderIdFromStorage) {
      setLatestOrderId(latestOrderIdFromStorage);
    }
  }, []);

  return (
    <nav
      id="customerNav"
      className="fixed z-[999] top-0 left-[-80%] bg-primary h-screen w-4/5 md:w-2/5 md:left-[-40%] text-white text-xl font-semibold transition-all duration-500 ease-in-out overflow-auto"
    >
      <i onClick={handleCloseNav} className="fa-solid fa-xmark text-4xl p-8 cursor-pointer"></i>
      <div className="mt-14">
        <Link to={"/bestil-online"} className="flex items-center gap-2 py-5 pl-8 cursor-pointer">
          <h3>Bestil online</h3>
          <i className="fa-solid fa-utensils"></i>
        </Link>
        <hr />
        <Link to={`/bestillinger`} className="flex items-center gap-2 py-5 pl-8 cursor-pointer">
          <h3>Mine bestillinger</h3>
          <i className="fa-solid fa-clock-rotate-left"></i>
        </Link>

        <hr />
        <Link to={"/favoritter"} className="flex items-center gap-2 py-5 pl-8 cursor-pointer">
          <h3>Favoritter</h3>
          <i className="fa-solid fa-heart"></i>
        </Link>
        <hr />
        {loggedIn ? (
          <>
            <Link to={"/profil"} className="flex items-center gap-2 py-5 pl-8 cursor-pointer">
              <h3>Profil</h3>
              <i className="fa-solid fa-user"></i>
            </Link>

            {isAdmin && (
              <>
                <hr />
                <Link to={"/ordre-oversigt"} className="flex items-center gap-2 py-7 pl-8 cursor-pointer">
                  <h3>Admin</h3>
                  <i className="fa-solid fa-unlock"></i>
                </Link>
              </>
            )}
          </>
        ) : (
          <>
            <Link to={"/log-ind"} className="flex items-center gap-2 py-7 pl-8 cursor-pointer">
              <h3>Log ind</h3>
              <i className="fa-solid fa-arrow-right-to-bracket"></i>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default CustomerNavigation;
