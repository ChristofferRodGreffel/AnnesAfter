// Udviklet fælles i gruppen

export default function localStorageBasket(newProduct, productIndex) {
  const basketFromStorage = localStorage.getItem("customerCheckout");

  // Hvis brugeren allerede har produkter i kurven eller ej
  if (basketFromStorage) {
    let newBasket = JSON.parse(basketFromStorage)

    // Hvis en bruger har trykket på "ret" i kurven, har produktet et productIndex
    // Dette bliver brugt til at fjerne den gamle version af produktet
    // når man gemmer opdateringer
    if (productIndex >= 0) {
      newBasket = newBasket.slice(0, productIndex).concat(newBasket.slice(productIndex + 1))
    }
    // Sætter det nye produkt i ordren
    newBasket.push(newProduct)
    localStorage.setItem("customerCheckout", JSON.stringify(newBasket));
  } else {
    localStorage.setItem("customerCheckout", JSON.stringify([newProduct]));
  }
}
