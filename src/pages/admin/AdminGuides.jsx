import React, { useEffect, useRef, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import AdminContentWrapper from "../../components/AdminContentWrapper";
import BackButtonWithArrow from "../../components/BackButtonWithArrow";
import PageH1Title from "../../components/PageH1Title";
import { query, collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebase-config";
import CustomInputWithLabel from "../../components/CustomInputWithLabel";
import { toast } from "react-toastify";
import { DefaultToastifySettings } from "../../helperfunctions/DefaultToastSettings";
import CustomButton from "../../components/CustomButton";

// Udviklet fælles i gruppen

const AdminGuides = () => {
    const formRef = useRef(null);
    const amountUntilBusyRef = useRef(null);

    const [amountUntilBusy, setAmountUntilBusy] = useState(0);
    const [prevAmountUntilBusy, setPrevAmountUntilBusy] = useState(0);

    const [customerProfileMessage, setCustomerProfileMessage] = useState("");
    const [prevCustomerProfileMessage, setPrevCustomerProfileMessage] = useState("");

    useEffect(() => {
        const getCustomerProfileMessage = async () => {
            const q = query(collection(FIREBASE_DB, "admin-settings"));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.data().Message) {
                        setPrevCustomerProfileMessage(doc.data().Message);
                    }
                });
            });
        };
        getCustomerProfileMessage();
    }, []);

    useEffect(() => {
        const getAmountUntilBusy = async () => {
            const q = query(collection(FIREBASE_DB, "admin-settings"));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.data().amount) {
                        setAmountUntilBusy(doc.data().amount);
                        setPrevAmountUntilBusy(doc.data().amount);
                    }
                });
            });
        };
        getAmountUntilBusy();
    }, []);

    const handleUpdateBusyAmount = (e) => {
        e.preventDefault();
        if (amountUntilBusyRef.current.amountUntilBusy.value == 0) {
            toast.error("Antallet kan ikke være nul...", DefaultToastifySettings);
            return;
        }

        const updateAmountPromise = new Promise(function (resolve, reject) {
            setDoc(doc(FIREBASE_DB, "admin-settings", "amountUntilBusy"), {
                amount: Number(amountUntilBusyRef.current.amountUntilBusy.value),
            })
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject();
                });
        });
        toast.promise(
            updateAmountPromise,
            {
                pending: `Opdater antal`,
                success: `Antal opdateret!`,
                error: "Der opstod en fejl, prøv igen...",
            },
            DefaultToastifySettings
        );
    };

    const handleUpdateCustomerProfileText = (e) => {
        e.preventDefault();
        const message = formRef.current.customerProfileMessage.value;

        if (!message) {
            toast.error("Beskeden kan ikke være tom...", DefaultToastifySettings);
            return;
        }

        const updateProfileMessagePromise = new Promise(function (resolve, reject) {
            setDoc(doc(FIREBASE_DB, "admin-settings", "profile-message"), {
                Message: message,
            })
                .then(() => {
                    resolve();
                    formRef.current.customerProfileMessage.value = "";
                    setCustomerProfileMessage("");
                })
                .catch((error) => {
                    reject();
                });
        });
        toast.promise(
            updateProfileMessagePromise,
            {
                pending: `Opdater profilbesked`,
                success: `Profilbesked opdateret!`,
                error: "Der opstod en fejl, prøv igen...",
            },
            DefaultToastifySettings
        );
    };

    return (
        <>
            <div className="flex justify-center flex-row">
                <AdminSidebar />
                <AdminContentWrapper>
                    <BackButtonWithArrow linkText="Tilbage til Ordre oversigt" linkTo="/ordre-oversigt" />
                    <PageH1Title>Sådan bruger du systemet</PageH1Title>
                    <div className="flex flex-col gap-5 mt-10">
                    <p>Siden er ikke lavet</p>

                    </div>
                </AdminContentWrapper>
            </div>
        </>
    );
};

export default AdminGuides;
