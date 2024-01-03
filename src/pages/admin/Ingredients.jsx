import React, { useEffect, useRef, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminContentWrapper from "../../components/AdminContentWrapper";
import PageH1Title from "../../components/PageH1Title";
import BackButtonWithArrow from "../../components/BackButtonWithArrow";
import CustomInputWithLabel from "../../components/CustomInputWithLabel";
import CustomButton from "../../components/CustomButton";
import { arrayRemove, arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebase-config";
import { PulseLoader } from "react-spinners";
import { DefaultToastifySettings } from "../../helperfunctions/DefaultToastSettings";
import { toast } from "react-toastify";

// Udviklet fælles i gruppen

const Ingredients = () => {
  const [ingredient, setIngredient] = useState("");
  const [allIngredients, setAllIngredients] = useState(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    const getIngredients = () => {
      const unsub = onSnapshot(doc(FIREBASE_DB, "ingredients/default"), (doc) => {
        // console.log(doc.data().ingredients);
        setAllIngredients(doc.data().ingredients);
      });
    };
    getIngredients();
  }, []);

  const handleAddIngredient = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (ingredient == "") {
      toast.info("Tilføj en ingrediens", DefaultToastifySettings);
      setLoading(false);
      return;
    }
    const ingredientRef = doc(FIREBASE_DB, "ingredients", "default");
    const price = formRef.current.price.value;

    const ingredientObject = {
      name: ingredient,
      price: Number(price),
    };

    await updateDoc(ingredientRef, {
      ingredients: arrayUnion(ingredientObject),
    })
      .then(() => {
        setLoading(false);
        toast.success(`${ingredient} er tilføjet`, DefaultToastifySettings);
        setIngredient("");
        formRef.current.price.value = "0";
      })
      .catch((e) => {
        setLoading(false);
        console.log("An error ocurred:", e);
        toast.error("Der er desværre sket en fejl", DefaultToastifySettings);
      });
  };

  const handleDeleteIngredient = async (ingredient) => {
    const ingredientRef = doc(FIREBASE_DB, "ingredients", "default");

    await updateDoc(ingredientRef, {
      ingredients: arrayRemove(ingredient),
    }).then(() => {
      toast.success(`${ingredient.name} er slettet`, DefaultToastifySettings);
    });
  };

  return (
    <>
      <div className="flex justify-center">
        <AdminSidebar />
        <AdminContentWrapper>
          <BackButtonWithArrow linkText="Tilbage til valgmuligheder" linkTo="/menu-oversigt" />
          <PageH1Title>Ingredienser</PageH1Title>
          <p>
            Her kan du administrere listen af ingredienser som brugeren kan vælge imellem. <br />
            Du kan tilføje og slette ingredienser efter behov.
          </p>
          <div className="flex flex-col gap-10 mt-8">
            <div>
              <form ref={formRef} onSubmit={handleAddIngredient} className="flex flex-col gap-2">
                <CustomInputWithLabel
                  label="Ingrediens navn"
                  type="text"
                  value={ingredient}
                  customSetvalue={setIngredient}
                  name="addNewIngredient"
                  placeholder="Skriv ingrediens her..."
                />
                <label htmlFor="price" className="font-semibold text-lg mb-1">
                  Ingrediens pris
                </label>
                <select
                  name="price"
                  id="price"
                  className="border-2 border-dark rounded-full w-fit py-1 px-3 font-medium mb-3"
                  defaultValue={"0"}
                >
                  <option value="0">Ingen ekstra pris</option>
                  <option value="5">5 kr.</option>
                  <option value="10">10 kr.</option>
                  <option value="15">15 kr.</option>
                </select>
                {loading ? (
                  <>
                    <CustomButton disabled={true} title={<PulseLoader color="#FFFFFF" size={11} className="p-1" />} />
                  </>
                ) : (
                  <>
                    <CustomButton title="Tilføj ingrediens" type="submit" />
                  </>
                )}
              </form>
            </div>
            <div className="w-fit">
              <h2 className="text-lg font-semibold">Dine nuværende ingredienser</h2>
              <hr className="border-b-2 border-dark rounded-full" />
              <div className="mt-5">
                {allIngredients?.length != 0 ? (
                  <ul className="grid grid-cols-1  sm:grid-cols-2 gap-y-1 gap-x-16 auto-cols-min">
                    {allIngredients?.map((ingredient, key) => {
                      return (
                        <li className="flex items-center justify-between w-56" key={key}>
                          <p>
                            <b>{ingredient?.name}</b> {ingredient.price != 0 && `- ${ingredient?.price} kr.`}
                          </p>
                          <i
                            onClick={() => handleDeleteIngredient(ingredient)}
                            className="fa-solid fa-circle-minus text-red text-lg cursor-pointer"
                          ></i>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <>
                    <p className="italic">Ikke sat...</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </AdminContentWrapper>
      </div>
    </>
  );
};

export default Ingredients;
