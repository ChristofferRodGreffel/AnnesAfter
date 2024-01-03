import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomerHeader from "../../components/CustomerHeader";
import PageWrapperContainer from "../../components/PageWrapperContainer";
import { FIREBASE_DB } from "../../../firebase-config";
import { doc, onSnapshot } from "firebase/firestore";
import IngredientCheckbox from "../../components/IngredientCheckbox";
import { toast } from "react-toastify";
import { DefaultToastifySettings } from "../../helperfunctions/DefaultToastSettings";
import CustomerBottomInfoContainer from "../../components/CustomerBottomInfoContainer";
import localStorageBasket from "../../helperfunctions/LocalStorageBasket";
import { PulseLoader } from "react-spinners";
import { compare } from "../../helperfunctions/Compare";

// Udviklet fælles i gruppen

const CustomizeProduct = () => {
  const { productName } = useParams();
  const [productInfo, setProductInfo] = useState();
  const [defaultIngredients, setDefaultIngredients] = useState();
  const [allIngredients, setAllIngredients] = useState();
  const [amount, setAmount] = useState(1);
  const [chosenBread, setChosenBread] = useState("Mørkt");
  const [dressingTop, setDressingTop] = useState("Mayo");
  const [dressingBottom, setDressingBottom] = useState("Mayo");
  const [totalPrice, setTotalPrice] = useState();
  const [productPrice, setProductPrice] = useState();
  const [loadedImage, setLoadedImage] = useState(false);
  const navigate = useNavigate();

  // Bliver brugt hvis kunden ønsker at redigere sit product
  const [customerWantsToEditProduct, setCustomerWantsToEditProduct] = useState(false);
  // Vi bruger useLocation til at hente det data vi giver med fra 'CheckoutOverview' (kurven)
  const location = useLocation();
  const data = location.state?.product;
  const productIndex = location.state?.productIndex;

  // Hvis kunden har valgt at rette et produkt der allerede er i kurven, bruges denne useEffect
  // til at sætte checkboxes og andre valg til det i forvejen valgte, så kunden ikke skal starte forfra.
  useEffect(() => {
    if (location && data && productIndex >= 0) {
      setCustomerWantsToEditProduct(true);
      setAmount(data.amount);
      setDressingTop(data.dressing.top);
      setDressingBottom(data.dressing.bottom);
      const dressingTopSelect = document.getElementById("dressingSelectTop");
      const dressingBottomSelect = document.getElementById("dressingSelectBottom");
      if (dressingTopSelect && dressingBottomSelect) {
        dressingTopSelect.value = data.dressing.top;
        dressingBottomSelect.value = data.dressing.bottom;
        prevDressingRefTop.current = data.dressing.top;
        prevDressingRefBottom.current = data.dressing.bottom;
      }
      setProductPrice(data.singlePrice);
      setChosenBread(data.bread);

      const defaultIngredientsCheckbox = document.querySelectorAll("#defaultIngredients input[type='checkbox']");
      const extraIngredientsForm = document.querySelectorAll("#extraIngredients input[type='checkbox']");

      data.removed.forEach((removed) => {
        defaultIngredientsCheckbox?.forEach((box) => {
          if (box.name === removed) {
            box.checked = false;
          }
        });
      });
      data.added.forEach((added) => {
        extraIngredientsForm?.forEach((box) => {
          if (box.name.toLowerCase().includes(added.toLowerCase())) {
            box.checked = true;
          }
        });
      });
    }
  }, [data, defaultIngredients, productIndex]);

  // Hvis kunden ikke kommer fra kurven men direkte fra forsiden, tjekker denne useEffect om
  // titlen indeholder pesto og sætter dressingTop til "pesto".
  useEffect(() => {
    if (!data && !productIndex >= 0) {
      if (productInfo?.name.toLowerCase().includes("pesto")) {
        const dressingTopSelect = document.getElementById("dressingSelectTop");
        if (dressingTopSelect) {
          setDressingTop("Pesto");
          dressingTopSelect.value = "Pesto";
          prevDressingRefTop.current = "Pesto";
        }
      }
    }
  }, [productInfo]);

  // Henter information omkring produktet fra firestore og fylder vores states
  useEffect(() => {
    const getProductInfo = () => {
      const unsub = onSnapshot(doc(FIREBASE_DB, "menu", productName), (doc) => {
        setProductInfo(doc.data());

        if (!doc.data().chosenBreadTypes.includes("Mørkt")) {
          setChosenBread(doc.data().chosenBreadTypes[0]);
        }
        setDefaultIngredients(doc.data().chosenIngredients);
        setTotalPrice(doc.data().price);
        setProductPrice(doc.data().price);
      });
    };

    // Henter alle ingredienser fra firestore
    const getAllIngredients = () => {
      const unsub = onSnapshot(doc(FIREBASE_DB, "ingredients/default"), (doc) => {
        const sorted = doc.data().ingredients.sort(compare);

        setAllIngredients(sorted);
      });
    };

    getAllIngredients();
    getProductInfo();
  }, []);

  // Bruges til at øge mængden
  const handleAmountIncrease = () => {
    setAmount((amount) => amount + 1);
    setTotalPrice((price) => price + productPrice);
  };

  // Bruges til at sænke mængden, men ikke til mindre én.
  const handleAmountDecrease = () => {
    if (amount > 1) {
      setAmount((amount) => amount - 1);
      setTotalPrice((price) => price - productPrice);
    } else {
      toast.error("Du kan ikke vælge mindre end én", DefaultToastifySettings);
    }
  };

  const handleAddProduct = () => {
    const defaultIngredients = document.querySelectorAll("#defaultIngredients input[type='checkbox']");
    const extraIngredientsForm = document.querySelectorAll("#extraIngredients input[type='checkbox']");

    const removedDefaultIngredients = [];
    const extraIngredients = [];

    // Getting the value of all unchecked boxes in the defaultIngredients form
    defaultIngredients.forEach((box) => {
      if (!box.checked) {
        removedDefaultIngredients.push(box.value);
      }
    });

    extraIngredientsForm.forEach((box) => {
      if (box.checked) {
        extraIngredients.push(box.value);
      }
    });

    const completeProduct = {
      removed: removedDefaultIngredients,
      added: extraIngredients,
      dressing: {
        top: dressingTop,
        bottom: dressingBottom,
      },
      price: productPrice * amount,
      singlePrice: productPrice,
      amount: amount,
      bread: chosenBread,
      name: productName,
    };

    localStorageBasket(completeProduct, productIndex);

    if (!customerWantsToEditProduct) {
      toast.success("Produkt tilføjet", DefaultToastifySettings);
      navigate("/");
    } else {
      toast.success("Produkt opdateret", DefaultToastifySettings);
      navigate("/kurv");
    }
  };

  const handleExtraIngredientChange = (ingredient, e) => {
    if (e.target.checked) {
      if (ingredient.price !== 0) {
        setProductPrice((prevPrice) => prevPrice + ingredient.price);
      }
    } else {
      if (ingredient.price !== 0) {
        setProductPrice((prevPrice) => prevPrice - ingredient.price);
      }
    }
  };

  const prevDressingRefTop = useRef(dressingTop);
  const prevDressingRefBottom = useRef(dressingBottom);

  const changeDressing = (value, target) => {
    switch (target) {
      case "dressingTop":
        setDressingTop(value);
        if (prevDressingRefTop.current !== "Chilimayo" && value === "Chilimayo") {
          setProductPrice((price) => price + 5);
          prevDressingRefTop.current = value;
          return;
        } else if (prevDressingRefTop.current === "Chilimayo" && value !== "Chilimayo") {
          setProductPrice((price) => price - 5);
          prevDressingRefTop.current = value;
        }
        break;

      case "dressingBottom":
        setDressingBottom(value);
        if (prevDressingRefBottom.current !== "Chilimayo" && value === "Chilimayo") {
          setProductPrice((price) => price + 5);
          prevDressingRefBottom.current = value;
          return;
        } else if (prevDressingRefBottom.current === "Chilimayo" && value !== "Chilimayo") {
          setProductPrice((price) => price - 5);
          prevDressingRefBottom.current = value;
        }
        break;

      default:
        break;
    }
  };

  return (
    <>
      <CustomerHeader iconLeft="fa-solid fa-circle-arrow-left" iconRight="fa-solid fa-basket-shopping" />
      <img
        className={`w-full md:w-3/4 h-44 sm:h-56 md:h-64 object-cover lg:h-96 lg:w-2/4 md:mx-auto md:rounded-b-lg ${
          loadedImage ? null : "blur-lg"
        }`}
        src={productInfo?.imageURL}
        alt={`Billede af ${productInfo?.name}`}
        onLoad={() => {
          setLoadedImage(true);
        }}
      />
      <PageWrapperContainer>
        {productInfo ? (
          <>
            <div className="breakout mb-28 md:w-3/6 md:mx-auto items-center md:flex md:flex-col">
              <div className="mt-8">
                <h1 className="text-3xl font-bold ">{productInfo?.name}</h1>
                <div className="flex flex-col w-fit mt-5">
                  <label className="text-lg font-semibold mb-1" htmlFor="breadSelect">
                    Vælg brød
                  </label>
                  <select
                    className="border-2 border-dark rounded-full w-full py-1 px-3 font-medium"
                    name="breadSelect"
                    id="breadSelect"
                    value={chosenBread}
                    onChange={(e) => setChosenBread(e.target.value)}
                  >
                    {productInfo?.chosenBreadTypes?.map((bread, key) => {
                      return (
                        <option key={key} value={bread}>
                          {bread}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="mt-5">
                  <label className="text-lg font-semibold" htmlFor="ingredientsForm">
                    Standard ingredienser
                  </label>
                  <form
                    name="ingredientsForm"
                    id="defaultIngredients"
                    className="grid grid-cols-2 w-full gap-4 xs:w-max mt-1"
                  >
                    {defaultIngredients?.map((ingredient, key) => {
                      return (
                        <div key={key} className="flex items-center gap-1 py-2 md:py-1">
                          <input
                            type="checkbox"
                            name={ingredient}
                            value={ingredient}
                            id={`${ingredient}`}
                            defaultChecked
                          />
                          <label
                            className="font-medium hover:text-primary hover:font-semibold cursor-pointer"
                            htmlFor={ingredient}
                          >
                            {ingredient}
                          </label>
                        </div>
                      );
                    })}
                  </form>
                </div>
                <div className="mt-5">
                  <h2 className="mb-2 text-lg font-semibold">Vælg dressing</h2>
                  <div className="flex flex-col gap-3 w-2/3 xs:w-max">
                    <div className="flex flex-row w-full items-center justify-between gap-3">
                      <label htmlFor="dressingSelectTop">Top</label>
                      <select
                        className="border-2 border-dark rounded-full py-1 px-3 font-medium w-fit"
                        name="dressingTop"
                        id="dressingSelectTop"
                        defaultValue={"Mayo"}
                        onChange={(e) => changeDressing(e.target.value, e.target.name)}
                      >
                        <option value="Fravalgt">Ingen dressing</option>
                        <option value="Mayo">Mayo</option>
                        <option value="Karry">Karry</option>
                        <option value="Pesto">Grøn pesto</option>
                        <option value="Chilimayo">Chilimayo +5 kr.</option>
                      </select>
                    </div>
                    <div className="flex flex-row w-full xs:w-max items-center justify-between gap-3">
                      <label htmlFor="dressingSelectBottom">Bund</label>
                      <select
                        className="border-2 border-dark rounded-full w-fit py-1 px-3 font-medium"
                        name="dressingBottom"
                        id="dressingSelectBottom"
                        defaultValue="Mayo"
                        onChange={(e) => changeDressing(e.target.value, e.target.name)}
                      >
                        <option value="Fravalgt">Ingen dressing</option>
                        <option value="Mayo">Mayo</option>
                        <option value="Karry">Karry</option>
                        <option value="Pesto">Grøn pesto</option>
                        <option value="Chilimayo">Chilimayo +5 kr.</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <h2 className="text-lg font-semibold">Ekstra fyld*</h2>
                  <form id="extraIngredients" className="grid grid-cols-2 w-full xs:w-max mt-2 gap-2 xs:gap-6">
                    {allIngredients?.map((ingredient, key) => {
                      return (
                        <div key={key}>
                          <IngredientCheckbox
                            ingredient={ingredient}
                            value={ingredient}
                            onChange={handleExtraIngredientChange}
                          />
                        </div>
                      );
                    })}
                  </form>
                  <p className="mt-3 max-w-readable">
                    *Ved mange tilvalg på bestillingen kan der forekomme merpris ved betaling.
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <h2 className="text-lg font-semibold">Vælg antal</h2>
                <div className="flex items-center justify-between min-w-[95px] w-fit select-none mt-1">
                  <i
                    onClick={handleAmountDecrease}
                    className={`fa-solid fa-circle-minus text-xl cursor-pointer ${amount === 1 && `text-grey`}`}
                  ></i>
                  <p className="font-bold text-2xl">{amount}</p>
                  <i onClick={handleAmountIncrease} className="fa-solid fa-circle-plus text-xl cursor-pointer"></i>
                </div>
              </div>
            </div>
            <CustomerBottomInfoContainer
              function={handleAddProduct}
              customNavigate={navigate}
              showAmount={false}
              text={!customerWantsToEditProduct ? "Tilføj til kurv" : "Gem ændringer"}
              price={productPrice * amount}
              amount={amount}
            />
          </>
        ) : (
          <>
            <div className="flex mt-10 flex-col justify-center w-full mx-auto items-center gap-1">
              <p className="font-medium text-xl">Indlæser produkt</p>
              <PulseLoader color="#373737" size={13} />
            </div>
          </>
        )}
      </PageWrapperContainer>
    </>
  );
};

export default CustomizeProduct;
