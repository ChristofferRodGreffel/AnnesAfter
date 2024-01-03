import React, { useRef, useState } from "react";
import CustomerHeader from "../../components/CustomerHeader";
import PageWrapperContainer from "../../components/PageWrapperContainer";
import CustomButton from "../../components/CustomButton";
import { firebaseErrorsCodes } from "../../../firebaseErrorCodes";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DefaultToastifySettings } from "../../helperfunctions/DefaultToastSettings";
import { PulseLoader } from "react-spinners";
import { doc, setDoc } from "firebase/firestore";

// Udviklet fælles i gruppen

const SignUp = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Skifter typen af input feltet når man trykker på øjet
  // og ændrer samtidig ikonet.
  const handleShowPassword = () => {
    const passwordInput = formRef.current.password;
    const eyeIcon = document.querySelector("#eyeIcon");
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      eyeIcon.setAttribute("class", "fa-solid fa-eye absolute right-5 top-3.5");
    } else {
      passwordInput.type = "password";
      eyeIcon.setAttribute("class", "fa-solid fa-eye-slash absolute right-5 top-3.5");
    }
  };

  // Henter email og password og opretter en profil med firebase auth.
  const userSignUp = (e) => {
    e.preventDefault();
    setLoading(true);
    const userEmail = formRef.current.email.value;
    const userPassword = formRef.current.password.value;

    createUserWithEmailAndPassword(FIREBASE_AUTH, userEmail, userPassword)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user.uid;
        addUserData(user);
      })
      .then(() => {
        navigate("/bestil-online");
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        const errorCode = error.code;
        const errorMessage = firebaseErrorsCodes[errorCode];
        toast.error(errorMessage, DefaultToastifySettings);
      });
  };

  // Tilføjer brugerdata til firestore
  const addUserData = async (user) => {
    const username = formRef.current.name.value;
    const tel = formRef.current.phone.value;

    await setDoc(doc(FIREBASE_DB, "users", user), {
      name: username,
      phone: tel,
    });
  };

  return (
    <>
      <CustomerHeader nav={false} />
      <PageWrapperContainer>
        <div className="mt-14">
          <div className="mb-5">
            <h1 className="font-bold text-3xl">Tak fordi du er her! </h1>
            <p className="text-left">Her kan du oprette en konto</p>
          </div>
          <form ref={formRef} onSubmit={userSignUp} className="flex flex-col gap-5">
            <div className="flex flex-col">
              <label htmlFor="name">Dit navn</label>
              <input type="text" required name="name" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="phone">Dit telefonnr.</label>
              <input type="tel" required name="phone" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email">Din email</label>
              <input type="email" required name="email" />
              {/* <p className="italic text-sm">*Du modtager en mail med verifikation</p> */}
            </div>

            <div className="flex flex-col">
              <label htmlFor="password">Adgangskode**</label>
              <div className="flex flex-col relative">
                <input type="password" required name="password" />
                <i
                  id="eyeIcon"
                  onClick={handleShowPassword}
                  className="fa-solid fa-eye-slash absolute right-5 top-3.5"
                ></i>
              </div>
              <p className="italic text-sm">**Skal være mindst (6) karakterer</p>
            </div>
            {loading ? (
              <>
                <CustomButton title={<PulseLoader color="#FFFFFF" size={11} className="p-1" />} function={userSignUp} />
              </>
            ) : (
              <>
                <CustomButton title="Opret profil" function={userSignUp} />
              </>
            )}
          </form>
        </div>
        <p className="text-center mt-10 w-full">
          Har du allerede en profil?{" "}
          <Link className="underline" to={"/log-ind"}>
            Log ind her
          </Link>
        </p>
      </PageWrapperContainer>
    </>
  );
};

export default SignUp;
