import React from "react";

const OrderDetailsProduct = (props) => {
  // Udviklet primært af Christoffer

  // Bruges til at ændre fra det lange navn til forkortelse
  const convertBreadType = (bread) => {
    switch (bread) {
      case "Glutenfri":
        return "GF";

      case "Bolle":
        return "B";

      case "Trekantsandwich":
        return "TS";

      case "Mørkt":
        return "M";

      case "Lyst":
        return "L";

      case "Fiber bolle":
        return "FB";

      case "Bagel":
        return "BA";

      default:
        break;
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="w-56">
          <p className="text-md font-semibold max-w-[250px]">
            {props.order.amount} x {props.order.name}
          </p>
          {props.order.name.toLowerCase().includes("pesto") &&
            props.order.dressing.top !== "Pesto" &&
            props.order.dressing.bottom !== "Pesto" && <p className="text-red font-bold">OBS: Uden pesto</p>}
          <div>
            <div className="flex justify-between mt-1 gap-2">
              <p className="font-semibold">Dressing top:</p>
              <p className="text-green font-semibold">{props.order.dressing.top}</p>
            </div>
            <div className="flex justify-between gap-2">
              <p className="font-semibold">Dressing bund:</p>
              <p className="text-green font-semibold">{props.order.dressing.bottom}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-between justify-self-end w-fit min-w-[210px] border-l-2">
          {props.order.added.length == 0 && props.order.removed.length == 0 && <p>Ingen ændringer</p>}
          {props.order.added.length !== 0 && (
            <ul>
              {props.order.added.map((ingredient, key) => {
                return (
                  <li key={key}>
                    <i className="fa-solid fa-circle-plus text-green text-md pr-1"></i>
                    {ingredient}
                  </li>
                );
              })}
            </ul>
          )}
          {props.order.removed.length !== 0 && (
            <ul>
              {props.order.removed.map((ingredient, key) => {
                return (
                  <li key={key}>
                    <i className="fa-solid fa-circle-minus text-red text-md pr-1"></i>
                    {ingredient}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="flex justify-self-end w-fit">
          <p className="text-xl font-semibold p-3">{convertBreadType(props.order.bread)}</p>
        </div>
      </div>
      <hr className="border-1 border-dashed border-dark my-4" />
    </>
  );
};

export default OrderDetailsProduct;
