import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase-config";

// Bruges ikke.

export async function manuallyChangeOfStatus(orderDocId, newStatus) {

    const orderRef = doc(FIREBASE_DB, "orders", orderDocId);

    await updateDoc(orderRef, {
        status: newStatus
    });
}
