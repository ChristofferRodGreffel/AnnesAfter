import React from "react";

const CheckoutProduct = (props) => {
  // Udviklet fælles i gruppen

  return (
    <div>
      <div className={`py-4 border-t-2 border-dark font-medium ${props.index + 1 === props.length && "border-b-2"}`}>
        <div className="flex justify-between items-center mb-3 gap-1">
          <h2 className="text-xl font-bold">{props.product.name}</h2>
          <div className="flex items-center justify-between min-w-[95px] select-none mt-1">
            <i
              onClick={() => props.decrease(props.product)}
              className={`fa-solid fa-circle-minus text-xl cursor-pointer ${props.product.amount === 1 && `text-grey`}`}
            ></i>
            <p className="font-bold text-2xl">{props.product.amount}</p>
            <i
              onClick={() => props.increase(props.product)}
              className="fa-solid fa-circle-plus text-xl cursor-pointer"
            ></i>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <p>
              <b>Brød:</b> {props.product.bread}
            </p>
            <p>
              <b>Dressing Top:</b> {props.product.dressing.top}
            </p>
            <p>
              <b>Dressing Bund:</b> {props.product.dressing.bottom}
            </p>
          </div>
          <div className="flex min-w-max whitespace-pre-wrap">
            <div>
              <div>
                {props.product?.added?.map((ingredient, key) => {
                  return (
                    <div key={key} className="flex items-center gap-1">
                      <i className="fa-solid fa-circle-plus text-green"></i>
                      <p>{ingredient}</p>
                    </div>
                  );
                })}
              </div>
              <div>
                {props.product?.removed?.map((ingredient, key) => {
                  return (
                    <div key={key} className="flex items-center gap-1">
                      <i className="fa-solid fa-circle-minus text-red"></i>
                      <p>{ingredient}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-3 items-center">
          <div className="flex gap-2 text-white">
            <button
              className="font-semibold px-10 py-2 bg-primary rounded-3xl"
              onClick={() => {
                props.handleEditProduct(props);
              }}
            >
              Ret
            </button>
            <button
              onClick={() => props.handleDeleteProduct(props.index)}
              className="font-semibold px-6 py-2 bg-red rounded-3xl"
            >
              Slet
            </button>
          </div>
          <div>
            <p className="font-bold text-2xl">
              {(props.product.singlePrice * props.product.amount).toLocaleString("da-DK")} kr.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProduct;
