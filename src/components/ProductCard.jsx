
import React, { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";

const ProductCard = (props) => {

  // Udviklet fælles i gruppen

  const [loadedImage, setLoadedImage] = useState(false)

  useEffect(() => {
    if(props?.setLoadingImg === true) {
      setLoadedImage(true)
    }
  }, [props.setLoadingImg, props.imageSource])

  return (
    <>
      <div className={`h-full drop-shadow-md flex flex-col gap-2 bg-primary justify-between rounded-xl overflow-clip text-white hover:drop-shadow-lg ${loadedImage ? null : 'blur-lg'} ${props.setLoadingImg ? 'w-[400px]' : undefined}`}>
        <img
          loading="lazy"
          className={`h-28 aspect-video object-cover`}
          src={props.imageSource}
          alt={`Billede af ${props.imageName}`}
          onLoad={() => { setLoadedImage(true) }}
        />
        
          <h3 className="font-bold px-5 customBalance">{props.productName}</h3>
          <div className=" flex flex-col justify-evenly w-full px-5 py-3 xs:pt-0 ">
            <button onClick={props.function} className="bg-white text-dark font-semibold p-1.5 w-full rounded-md text-lg">
              {props.text} {props.icon && <i className={props.icon}></i>}
            </button>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
