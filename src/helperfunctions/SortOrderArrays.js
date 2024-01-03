// Udviklet fælles i gruppen
// Bruges til at sortere ordre på admin-siden


export function sortOrderArrays(allArrays, sortType) {
  // Fjerner kategorier som ikke indeholder ordre
  const allArraysNotUndefined = allArrays.filter((arr) => arr.state !== undefined);

  switch (sortType) {
    case "nyesteFørst":
      return allArraysNotUndefined.map((arr) => {
        return {
          ...arr,
          // Sorterer efter de nyeste først
          state: arr.state.slice().sort((a, b) => {
            return b.orderPlacedAt - a.orderPlacedAt;
          }),
        };
      });
      break;

    case "ældsteFørst":
      return allArraysNotUndefined.map((arr) => {
        return {
          ...arr,
          // Sorterer efter de ældste først
          state: arr.state.slice().sort((a, b) => {
            return a.orderPlacedAt - b.orderPlacedAt;
          }),
        };
      });
      break;

    case "afhentesFørst":
      return allArraysNotUndefined.map((arr) => {
        return {
          ...arr,
          // Sorterer efter afhentes først. Hvis der er valgt 
          // "Hurtigst muligt", bliver de sat først
          state: arr.state.slice().sort((a, b) => {
            if (a.pickup.time === "Hurtigst muligt") {
              return -1;
            } else if (b.pickup.time === "Hurtigst muligt") {
              return 1;
            } else {
              return a.pickup.time - b.pickup.time;
            }
          }),
        };
      });
      break;

    default:
      return allArraysNotUndefined;
  }
}
