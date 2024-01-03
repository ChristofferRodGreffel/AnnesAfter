import React, { useRef, useState, useEffect } from "react";
import PageH1Title from "../../components/PageH1Title";
import CustomInputWithLabel from "../../components/CustomInputWithLabel";
import AdminSidebar from "../../components/AdminSidebar";
import AdminContentWrapper from "../../components/AdminContentWrapper";
import { compare } from "../../helperfunctions/Compare";
import BackButtonWithArrow from "../../components/BackButtonWithArrow";
import { toast } from "react-toastify";
import ImageUpload from "../../components/ImageUpload";
import { doc, setDoc } from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_STORAGE } from "../../../firebase-config";

import { ref, uploadBytes, getDownloadURL, listAll, list, uploadBytesResumable } from "firebase/storage";
import { DefaultToastifySettings } from "../../helperfunctions/DefaultToastSettings";
import { PulseLoader } from "react-spinners";
import ProductCard from "../../components/ProductCard";

// Udviklet fælles i gruppen

function CreateMenuProduct() {
  // Sætter titlen på siden
  useEffect(() => {
    document.title = "Anne's - Opret Produkt";
  }, []);

  const formRef = useRef(null);

  const [addingProductLoader, setAddingProductLoader] = useState(false);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(59);
  const [chosenBreadTypes, setChosenBreadTypes] = useState([]);
  const [chosenIngredients, setChosenIngredients] = useState([]);
  const [images, setImages] = useState([]);

  // skal evt. komme fra Firebase
  const breadTypes = [
    { name: "Bagel" },
    { name: "Bolle" },
    { name: "Fiber bolle" },
    { name: "Glutenfri" },
    { name: "Lyst" },
    { name: "Mørkt" },
    { name: "Trekantsandwich" },
  ];

  const [checkedBreadTypes, setCheckedBreadTypes] = useState(new Array(breadTypes.length).fill(false));

  const handleOnBreadtypeChange = (position, name) => {
    const updatedCheckedState = checkedBreadTypes.map((item, index) => (index === position ? !item : item));
    setCheckedBreadTypes(updatedCheckedState);

    const addObject = {
      name: name,
      index: position,
    };

    if (updatedCheckedState[position] === true) {
      const updatedArray = [...chosenBreadTypes, addObject];
      // find compare function in helperfunctions folder "Compare.js"
      const sorted = [...updatedArray].sort(compare);
      setChosenBreadTypes(sorted);
    } else {
      setChosenBreadTypes(chosenBreadTypes.filter((item) => item.name !== addObject.name));
    }
  };

  let ingredients = [{ name: "Agurk" }, { name: "Gulerod" }, { name: "Løg" }, { name: "Salat" }, { name: "Tomat" }];

  const [checkedIngredients, setCheckedIngredients] = useState(new Array(ingredients.length).fill(false));

  const handleOnIngredientsChange = (position, name) => {
    const updatedCheckedState = checkedIngredients.map((item, index) => (index === position ? !item : item));
    setCheckedIngredients(updatedCheckedState);

    const addObject = {
      name: name,
      index: position,
    };

    if (updatedCheckedState[position] === true) {
      const updatedArray = [...chosenIngredients, addObject];
      // find compare function in helperfunctions folder "Compare.js"
      const sorted = [...updatedArray].sort(compare);
      setChosenIngredients(sorted);
    } else {
      setChosenIngredients(chosenIngredients.filter((item) => item.name !== addObject.name));
    }
  };

  const containsNumbers = (str) => {
    return /\d/.test(str);
  };

  const handleAddCustomIngredient = (e) => {
    e.preventDefault();

    let ingredient = formRef.current.customIngredientsName.value;
    if (!ingredient) {
      toast.info("Indtast en ingrediens...", DefaultToastifySettings);
      return;
    } else if (containsNumbers(ingredient)) {
      toast.info("Ingredienser må ikke indeholde tal", DefaultToastifySettings);
      return;
    }

    const capitalizedFirstLetterIngredient = ingredient.charAt(0).toUpperCase() + ingredient.slice(1).toLowerCase();

    const addObject = {
      name: capitalizedFirstLetterIngredient,
    };

    const updatedArray = [...chosenIngredients, addObject];
    // find compare function in helperfunctions folder "Compare.js"
    const sorted = [...updatedArray].sort(compare);
    setChosenIngredients(sorted);

    formRef.current.customIngredientsName.value = "";
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setAddingProductLoader(true);

    const imageName = images[0]?.file.name;

    switch (true) {
      case !productName:
        toast.info("Tilføj venligst et navn", DefaultToastifySettings);
        setAddingProductLoader(false);
        return;
      case !productPrice:
        toast.info("Tilføj venligst en pris", DefaultToastifySettings);
        setAddingProductLoader(false);
        return;
      case chosenBreadTypes.length == 0:
        toast.info("Vælg mindst én brødtype", DefaultToastifySettings);
        setAddingProductLoader(false);
        return;
      case chosenIngredients.length == 0:
        toast.info("Vælg mindst én ingrediens", DefaultToastifySettings);
        setAddingProductLoader(false);
        return;
      case !images[0]?.file || !imageName:
        toast.info("Tilføj venligst et billede", DefaultToastifySettings);
        setAddingProductLoader(false);
        return;
      default:
        break;
    }

    let chosenBreadNames = [];
    let chosenIngredientNames = [];

    chosenBreadTypes.forEach((breadName) => {
      chosenBreadNames.push(breadName.name);
    });
    chosenIngredients.forEach((ingredientName) => {
      chosenIngredientNames.push(ingredientName.name);
    });

    let storagePath = "images/" + imageName;
    const storageRef = ref(FIREBASE_STORAGE, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, images[0].file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progrss function ....
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        // error function ....
        setAddingProductLoader(false);
        console.log(error);
      },
      () => {
        // complete function ....
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            console.log("File available at", downloadURL);

            setDoc(doc(FIREBASE_DB, "menu", productName), {
              name: productName,
              price: parseInt(productPrice),
              chosenBreadTypes: chosenBreadNames,
              chosenIngredients: chosenIngredientNames,
              imageURL: downloadURL,
            });
          })
          .then(() => {
            setAddingProductLoader(false);
            toast.success("Produkt tilføjet til menu", DefaultToastifySettings);
            setProductName("");
            setProductPrice(59);
            setCheckedIngredients(new Array(breadTypes.length).fill(false));
            setCheckedBreadTypes(new Array(breadTypes.length).fill(false));
            setChosenBreadTypes([]);
            setChosenIngredients([]);
            setImages([]);
          });
      }
    );
  };

  const handleRemoveBreadType = (breadToDelete) => {
    setChosenBreadTypes(chosenBreadTypes.filter((breads) => breads.name !== breadToDelete.name));
    handleOnBreadtypeChange(breadToDelete.index, breadToDelete.name);
  };

  const handleRemoveIngredient = (ingredientToDelete) => {
    setChosenIngredients(chosenIngredients.filter((ingredient) => ingredient.name !== ingredientToDelete.name));
    handleOnIngredientsChange(ingredientToDelete.index, ingredientToDelete.name);
  };

  // Function used in the ImageUpload component.
  const onImageChange = (imageList, addUpdateIndex) => {
    // data for submit
    setImages(imageList);
  };

  return (
    <>
      <div className="flex justify-center flex-row">
        <AdminSidebar />
        <AdminContentWrapper>
          <BackButtonWithArrow linkTo="/menu-oversigt" linkText="Tilbage til valgmuligheder" />
          <PageH1Title>Tilføj nyt produkt</PageH1Title>
          <div className="flex flex-col gap-10 xl:flex-row w-2/3 min-w-productOverviewMinWidth">
            <div className="w-full">
              <div className="flex flex-col gap-7">
                <CustomInputWithLabel
                  label="Navn på produkt"
                  type="text"
                  value={productName}
                  customSetvalue={setProductName}
                  name="productName"
                  placeholder="Skriv produkt navn"
                />
                <CustomInputWithLabel
                  title="Vælg tilgængelige brødtyper"
                  type="checkbox"
                  CustomHandleChange={handleOnBreadtypeChange}
                  CustomCheckedItems={checkedBreadTypes}
                  CustomOptions={breadTypes}
                />
                <CustomInputWithLabel
                  title="Vælg basis ingredienser"
                  type="checkbox"
                  CustomHandleChange={handleOnIngredientsChange}
                  CustomCheckedItems={checkedIngredients}
                  CustomOptions={ingredients}
                />
                <form ref={formRef}>
                  <CustomInputWithLabel
                    button={true}
                    buttonText="Tilføj ingrediens"
                    customOnClick={handleAddCustomIngredient}
                    label="Tilføj ingredienser manuelt"
                    type="text"
                    name="customIngredientsName"
                    placeholder="Tilføj en ingrediens her..."
                  />
                </form>
                <CustomInputWithLabel
                  label="Tilføj pris på produkt"
                  value={productPrice}
                  customSetvalue={setProductPrice}
                  type="number"
                  name="productPrice"
                  placeholder="Pris på produkt..."
                />
                <ImageUpload onImageChange={onImageChange} imageState={images} />
                {images[0] && (
                  <ProductCard
                    setLoadingImg={true}
                    text="Tilpas"
                    imageSource={images[0].data_url}
                    productName={productName || "Navn ikke sat..."}
                    icon="fa-solid fa-utensils"
                  />
                )}
              </div>
            </div>

            <div className="xl:hidden flex flex-col justify-center items-center">
              <div className="bg-mainGrey w-full h-4/5 rounded-t-lg overflow-y-auto">
                <div className="flex flex-col gap-8 p-8">
                  <h3 className="font-semibold text-3xl border-solid border-b-2 border-grey pb-2 mb-2">
                    Produktoversigt
                  </h3>
                  <div className="flex flex-col">
                    <p className="font-semibold">Navn</p>
                    {productName ? (
                      <>
                        <p>{productName}</p>
                      </>
                    ) : (
                      <>
                        <p className="italic">Ikke sat...</p>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold">Pris</p>
                    {productPrice ? (
                      <>
                        <p>{productPrice} kr.</p>
                      </>
                    ) : (
                      <>
                        <p className="italic">Ikke sat...</p>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold">Brød</p>
                    {chosenBreadTypes.length != 0 ? (
                      <>
                        {chosenBreadTypes.map((bread, key) => {
                          return (
                            <ul className="list-disc list-inside flex items-center justify-between w-56" key={key}>
                              <li>{bread.name}</li>
                              <i
                                onClick={() => handleRemoveBreadType(bread)}
                                className="fa-solid fa-circle-minus text-red text-lg cursor-pointer"
                              ></i>
                            </ul>
                          );
                        })}
                      </>
                    ) : (
                      <>
                        <p className="italic">Ikke sat...</p>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold">Ingredienser</p>
                    {chosenIngredients.length != 0 ? (
                      <>
                        {chosenIngredients.map((ingredient, key) => {
                          return (
                            <ul className="list-disc list-inside flex items-center justify-between w-56" key={key}>
                              <li>{ingredient.name}</li>
                              <i
                                onClick={() => handleRemoveIngredient(ingredient)}
                                className="fa-solid fa-circle-minus text-red text-lg cursor-pointer"
                              ></i>
                            </ul>
                          );
                        })}
                      </>
                    ) : (
                      <>
                        <p className="italic">Ikke sat...</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddProduct}
                className="w-full bg-primary text-white text-lg rounded-b-lg font-semibold p-3"
              >
                {addingProductLoader ? (
                  <>
                    <div className="flex items-center justify-center">
                      <PulseLoader color="#FFFFFF" />
                    </div>
                  </>
                ) : (
                  <>Tilføj til menu</>
                )}
              </button>
            </div>
          </div>
        </AdminContentWrapper>

        <div className="max-xl:hidden sticky top-0 w-1/2 min-w-productOverviewMinWidth h-screen flex flex-col justify-center items-center">
          <div className="relative bg-mainGrey w-full h-4/5 rounded-tl-lg overflow-y-auto">
            <div className="flex flex-col gap-8 p-8">
              <h3 className="font-semibold text-3xl border-solid border-b-2 border-grey pb-2 mb-2">Produktoversigt</h3>
              <div className="flex flex-col">
                <p className="font-semibold">Navn</p>
                {productName ? (
                  <>
                    <p>{productName}</p>
                  </>
                ) : (
                  <>
                    <p className="italic">Ikke sat...</p>
                  </>
                )}
              </div>
              <div className="flex flex-col">
                <p className="font-semibold">Pris</p>
                {productPrice ? (
                  <>
                    <p>{productPrice} kr.</p>
                  </>
                ) : (
                  <>
                    <p className="italic">Ikke sat...</p>
                  </>
                )}
              </div>
              <div className="flex flex-col">
                <p className="font-semibold">Brød</p>
                {chosenBreadTypes.length != 0 ? (
                  <>
                    {chosenBreadTypes.map((bread, key) => {
                      return (
                        <ul className="list-disc list-inside flex items-center justify-between w-56" key={key}>
                          <li>{bread.name}</li>
                          <i
                            onClick={() => handleRemoveBreadType(bread)}
                            className="fa-solid fa-circle-minus text-red text-lg cursor-pointer"
                          ></i>
                        </ul>
                      );
                    })}
                  </>
                ) : (
                  <>
                    <p className="italic">Ikke sat...</p>
                  </>
                )}
              </div>
              <div className="flex flex-col">
                <p className="font-semibold">Ingredienser</p>
                {chosenIngredients.length != 0 ? (
                  <>
                    {chosenIngredients.map((ingredient, key) => {
                      return (
                        <ul className="list-disc list-inside flex items-center justify-between w-56" key={key}>
                          <li>{ingredient.name}</li>
                          <i
                            onClick={() => handleRemoveIngredient(ingredient)}
                            className="fa-solid fa-circle-minus text-red text-lg cursor-pointer"
                          ></i>
                        </ul>
                      );
                    })}
                  </>
                ) : (
                  <>
                    <p className="italic">Ikke sat...</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleAddProduct}
            className="w-full bg-primary text-white text-lg rounded-bl-lg font-semibold p-3"
          >
            {addingProductLoader ? (
              <>
                <div className="flex items-center justify-center">
                  <PulseLoader color="#FFFFFF" />
                </div>
              </>
            ) : (
              <>Tilføj til menu</>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default CreateMenuProduct;
