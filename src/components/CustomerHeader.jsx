import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import CustomerNavigation from "./CustomerNavigation";

const CustomerHeader = (props) => {

  // Udviklet primært af Christoffer

  const navigate = useNavigate();
  const [amountFromBasket, setAmountFromBasket] = useState(0);

  // Åbner menuen
  const handleOpenNavigation = () => {
    const customerNav = document.querySelector("#customerNav");
    customerNav.style.left = "0";
  };

  // Går en skærm tilbage hvis man ikke har givet et link
  const handleGoBack = () => {
    if (props.customLink) {
      navigate(props.customLink);
    } else {
      navigate(-1);
    }
  };

  // Sætter antallet af produkter i kurven
  useEffect(() => {
    const basketFromStorage = JSON.parse(localStorage.getItem("customerCheckout"));

    if (basketFromStorage) {
      let totalAmountFromBasket = 0;
      basketFromStorage.forEach((subData) => (totalAmountFromBasket += subData.amount));
      setAmountFromBasket(totalAmountFromBasket);
    }
  }, []);

  return (
    <>
      <CustomerNavigation />
      <header className="sticky z-50 pb-5 top-0 bg-white flex justify-around md:justify-between md:px-14 items-center w-full pt-5">
        {props.iconLeft && (
          <i
            onClick={props.nav == true ? handleOpenNavigation : handleGoBack}
            className={`${props.iconLeft} text-3xl p-2 cursor-pointer`}
          ></i>
        )}

        <Link to={"/"} className="md:m-auto">
          <img src={logo} alt="logo" className="w-40" />
        </Link>

        {props.iconRight && (
          <Link to={"/kurv"} className={`${props.hideRightIcon && "pointer-events-none opacity-0"} relative`}>
            {props.iconRight && <i className={`${props.iconRight} text-3xl p-2 cursor-pointer`}></i>}
            {amountFromBasket !== 0 && (
              <div className="absolute top-0 right-0 bg-primaryLow text-white font-semibold w-6 h-6 flex justify-center items-center rounded-full animate-slowZoom">
                <p>{amountFromBasket}</p>
              </div>
            )}
          </Link>
        )}
      </header>
    </>
  );
};

export default CustomerHeader;
