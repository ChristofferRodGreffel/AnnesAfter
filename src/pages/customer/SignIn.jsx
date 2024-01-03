import React, { useRef, useState } from "react";
import CustomerHeader from "../../components/CustomerHeader";
import PageWrapperContainer from "../../components/PageWrapperContainer";
import CustomButton from "../../components/CustomButton";
import BackButtonWithArrow from "../../components/BackButtonWithArrow";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { firebaseErrorsCodes } from "../../../firebaseErrorCodes";
import { toast } from "react-toastify";
import { DefaultToastifySettings } from "../../helperfunctions/DefaultToastSettings";
import { collection, getDocs } from "firebase/firestore";

// Udviklet fælles i gruppen

const SignIn = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const userSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    const userEmail = formRef.current.email.value;
    const userPassword = formRef.current.password.value;

    signInWithEmailAndPassword(FIREBASE_AUTH, userEmail, userPassword)
      .then((userCredential) => {
        // Signed in
        checkAdminStatus(userCredential.user.uid);
      })
      .catch((error) => {
        setLoading(false);
        const errorCode = error.code;
        // Finder den korresponderende fejlkode og viser den tilhørende
        // tekst til brugeren med en toast.
        const errorMessage = firebaseErrorsCodes[errorCode];
        toast.error(errorMessage, DefaultToastifySettings);
      });
  };

  // Tjekker om brugeren er admin eller ej, derefter navigeres som nødvendigt
  const checkAdminStatus = async (user) => {
    const querySnapshot = await getDocs(collection(FIREBASE_DB, "admin"));

    let isAdmin = false;

    querySnapshot.forEach((doc) => {
      if (doc.id === user) {
        isAdmin = true;
        navigate("/ordre-oversigt");
        setLoading(false);
      }
    });

    if (!isAdmin) {
      navigate("/bestil-online");
      setLoading(false);
    }
  };

  // Ændrer input feltets type og ikon når man klikker på øjet.
  const handleShowPassword = () => {
    const passwordInput = formRef.current.password;
    const eyeIcon = document.querySelector("#eyeIcon");
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      eyeIcon.setAttribute("class", "fa-solid fa-eye-slash absolute right-5 top-2.5 text-xl");
    } else {
      passwordInput.type = "password";
      eyeIcon.setAttribute("class", "fa-solid fa-eye absolute right-5 top-2.5 text-xl");
    }
  };

  return (
    <>
      <CustomerHeader nav={false} />
      <PageWrapperContainer>
        <div className="mt-16">
          <BackButtonWithArrow linkText="Fortsæt uden log ind" linkTo="/bestil-online" />
          <div className="mb-5">
            <h1 className="font-bold text-3xl">Velkommen tilbage</h1>
            <p className="text-left">Her kan du logge ind</p>
          </div>
          <form ref={formRef} onSubmit={userSignIn} className="flex flex-col gap-5">
            <div className="flex flex-col">
              <label htmlFor="email">Email</label>
              <input type="text" required name="email" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password">Adgangskode</label>
              <div className="flex flex-col relative">
                <input type="password" required name="password" />
                <i
                  id="eyeIcon"
                  onClick={handleShowPassword}
                  className="fa-solid fa-eye absolute right-5 top-2.5 text-xl"
                ></i>
              </div>
            </div>
            {loading ? (
              <>
                <CustomButton
                  disabled={true}
                  title={<PulseLoader color="#FFFFFF" size={11} className="p-1" />}
                  function={userSignIn}
                />
              </>
            ) : (
              <>
                <CustomButton title="Log ind" function={userSignIn} />
              </>
            )}
          </form>
        </div>
        <p className="text-center mt-10 w-full">
          Har du ikke en bruger?{" "}
          <Link className="underline" to={"/opret-profil"}>
            Opret dig her
          </Link>
        </p>
      </PageWrapperContainer>
    </>
  );
};

export default SignIn;
