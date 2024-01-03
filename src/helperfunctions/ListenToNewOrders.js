import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase-config";
import newOrderSound from "../assets/newOrderSound.mp3";
import ordersound2 from "../assets/ordersound2.mp3";

export function listenToNewOrders() {
  // Udviklet fælles i gruppen

  // E.g recieve new orders and mark them as "modtaget"

  const audio = new Audio(ordersound2);
  audio.preload = "auto";

  const playAudio = () => {
    audio.play();
  };

  // Lytter på opdateringer på nye ordre, og hvis der er en ordre, som er "pending", bliver der spillet en lyd
  // på admin siden
  const q = query(collection(FIREBASE_DB, "orders"), where("status", "==", "pending"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    if (!querySnapshot.empty) {
      playAudio();
    }
  });
}
