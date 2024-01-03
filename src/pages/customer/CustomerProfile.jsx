import React, { useEffect, useRef, useState } from "react";
import PageWrapperContainer from "../../components/PageWrapperContainer";
import CustomerHeader from "../../components/CustomerHeader";
import CustomButton from "../../components/CustomButton";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../firebase-config";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, sendPasswordResetEmail, signOut } from "firebase/auth";
import PageH1Title from "../../components/PageH1Title";
import CustomInputWithLabel from "../../components/CustomInputWithLabel";
import { toast } from "react-toastify";
import { DefaultToastifySettings } from "../../helperfunctions/DefaultToastSettings";
import { collection, doc, getDoc, onSnapshot, query, updateDoc } from "firebase/firestore";
import { PulseLoader } from "react-spinners";

// Udviklet fælles i gruppen

const CustomerProfile = () => {
  const navigate = useNavigate();
  const uid = FIREBASE_AUTH.currentUser?.uid;

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerProfileMessage, setCustomerProfileMessage] = useState("");

  const newCustomerPhoneRef = useRef(null);

  useEffect(() => {
    const getCustomerProfileMessage = async () => {
      const q = query(collection(FIREBASE_DB, "admin-settings"));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.data().Message) {
            setCustomerProfileMessage(doc.data().Message);
          }
        });
      });
    };
    getCustomerProfileMessage();
  }, []);

  useEffect(() => {
    const getCustomerNameAndPhone = async () => {
      if (uid) {
        const docRef = doc(FIREBASE_DB, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCustomerName(docSnap.data().name);
          setCustomerPhone(docSnap.data().phone);
        } else {
        }
      }
    };
    getCustomerNameAndPhone();
  }, [uid]);

  const handleUserLogOut = () => {
    signOut(FIREBASE_AUTH)
      .then(() => {
        // Sign-out successful.
        navigate("/bestil-online");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const handleChangePhoneNumber = (e) => {
    e.preventDefault();

    const newPhoneNo = newCustomerPhoneRef.current?.customerPhoneNumber.value;
    const uid = FIREBASE_AUTH.currentUser?.uid;

    const userRef = doc(FIREBASE_DB, "users", uid);
    updateDoc(userRef, {
      phone: newPhoneNo,
    });
    setCustomerPhone(newPhoneNo);

    newCustomerPhoneRef.current?.reset();

    toast.success("Telefon nr. opdateret", DefaultToastifySettings);
  };

  const handleResetPassword = () => {
    const userEmail = FIREBASE_AUTH.currentUser?.email;
    const sendPasswordResetEmailPromise = new Promise(function (resolve, reject) {
      sendPasswordResetEmail(FIREBASE_AUTH, userEmail)
        .then(() => {
          // Password reset email sent!
          resolve();
        })
        .catch((error) => {
          reject();
        });
    });

    toast.promise(
      sendPasswordResetEmailPromise,
      {
        pending: `Sender email til ${userEmail}`,
        success: `Email sendt til ${userEmail}!`,
        error: "Der opstod en fejl, prøv igen...",
      },
      DefaultToastifySettings
    );
  };

  const formatPhoneNumber = (phoneNumber) => {
    // Ensure the input is a string with exactly 8 digits
    if (typeof phoneNumber === "string" && phoneNumber.length === 8 && /^\d+$/.test(phoneNumber)) {
      // Use substring to extract substrings of two characters and concatenate with a space
      return (
        phoneNumber.substring(0, 2) +
        " " +
        phoneNumber.substring(2, 4) +
        " " +
        phoneNumber.substring(4, 6) +
        " " +
        phoneNumber.substring(6, 8)
      );
    } else {
      // Handle invalid input
      console.error("Invalid phone number format. Please provide an 8-digit string.");
      return;
    }
  };

  return (
    <>
      <CustomerHeader nav={true} iconLeft="fa-solid fa-bars" iconRight="fa-solid fa-basket-shopping" />
      <PageWrapperContainer>
        {!customerName || !customerProfileMessage ? (
          <>
            <div className="m-40 text-center">
              <PulseLoader color="#373737" size={13} />
            </div>
          </>
        ) : (
          <>
            <div className="mt-20">
              <div className="flex flex-col gap-10 lg:flex-row lg:justify-center lg:gap-10">
                <div>
                  <PageH1Title>
                    <div className="flex flex-col">
                      Hej, {customerName}
                      <span className="text-sm font-normal italic">{customerProfileMessage}</span>
                    </div>
                  </PageH1Title>
                  <div className="flex flex-col gap-6 max-w-lg lg:max-w-none lg:flex-row lg:flex-wrap">
                    <CustomButton title="Vip-fordele" />
                    <CustomButton title="Indstillinger" />
                    <CustomButton title="Gå til favoritter" />
                    <CustomButton title="Gå til bestillinger" function={() => navigate("/bestillinger")} />
                  </div>
                </div>
                <div className="max-w-lg flex flex-col justify-between gap-3">
                  <form ref={newCustomerPhoneRef} onSubmit={handleChangePhoneNumber}>
                    <div>
                      <CustomInputWithLabel
                        button={true}
                        buttonText="Opdater"
                        label="Opdater telefon nr."
                        type="text"
                        name="customerPhoneNumber"
                        placeholder="Skriv dit nr. her..."
                      />
                      <p className="mt-1">
                        Nuværende telefon nr.: <b>{formatPhoneNumber(customerPhone)}</b>
                      </p>
                    </div>
                  </form>

                  <div className="flex flex-col">
                    <CustomButton title="Nulstil adgangskode" function={handleResetPassword} />
                    <p className="text-center mt-1">(Modtag en mail med instrukser - tjek evt. spam...)</p>
                  </div>

                  <div className="flex flex-col">
                    <CustomButton
                      title="Log ud"
                      function={handleUserLogOut}
                      customColor="bg-red"
                      icon="fa-solid fa-arrow-right-from-bracket"
                      iconRight={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </PageWrapperContainer>
    </>
  );
};

export default CustomerProfile;
