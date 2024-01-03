import React, { useEffect, useState } from "react";

function CustomerBottomInfoContainer(props) {

  // Udviklet fælles i gruppen

  const [amountOfChosenProducts, setAmountOfChosenProducts] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (props.amount && props.price) {
      setAmountOfChosenProducts(props.amount);
      setTotalPrice(props.price);
    }
  }, [props]);

  return (
    <>
      {amountOfChosenProducts !== 0 && (
        <div className="z-20 bg-dark h-20 p-3 fixed bottom-0 w-screen flex justify-center gap-10 items-center">
          <div className="flex flex-col text-white leading-none">
            {props.showAmount && amountOfChosenProducts != 0 && <p>{amountOfChosenProducts} stk.</p>}
            <p className="text-3xl font-semibold">{totalPrice} kr.</p>
          </div>

          <button onClick={props.function}>
            <div className="text-white bg-primary px-8 py-2 rounded-full font-semibold">{props.text}</div>
          </button>
        </div>
      )}
    </>
  );
}

export default CustomerBottomInfoContainer;
