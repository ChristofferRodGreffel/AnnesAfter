import { collection, query, where, onSnapshot, updateDoc, doc, orderBy } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase-config";
import { useEffect } from "react";
import { sortOrderArrays } from "./SortOrderArrays";

// Udviklet fælles i gruppen

export function receiveFilteredOrders(setOrders, filterByOption, filterByValue) {
  //  recieve all orders with provided option and value

  // Henter alle ordre ud fra en specifik status og sorterer efter dato
  // For hver ordre bliver de sat i et midlertidig array
  // Som til sidst bliver sat i dens useState.
  const q = query(
    collection(FIREBASE_DB, "orders"),
    where(filterByOption, "==", filterByValue),
    orderBy("orderPlacedAt")
  );
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    if (querySnapshot.empty) {
    } else {
      let resultArray = [];
      querySnapshot.forEach((doc) => {
        resultArray.push(doc.data());
      });
      setOrders(resultArray.reverse());
    }
  });
}
