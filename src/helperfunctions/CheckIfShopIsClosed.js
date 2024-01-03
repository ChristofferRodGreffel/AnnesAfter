export function CheckIfShopIsClosed(chosenCollectionDate, setShopIsClosed) {

    // Udviklet primært af Sebastian

    const shopClosingTime = 1830;
    const currentDate = new Date();

    const chosenCollectionDateFormatted = chosenCollectionDate.toLocaleDateString()

    const currentDateFormatted = currentDate.toLocaleDateString()
    const currentTimeHourFormatted = currentDate.getHours().toString().padStart(2, "0")
    const currentTimeMinuteFormatted = currentDate.getMinutes().toString().padStart(2, "0")

    const currentTimeHourAndMinuteFormatted = Number(`${currentTimeHourFormatted}${currentTimeMinuteFormatted}`)


    // Hvis man har valgt samme dag og klokken er mere end lukketid
    if (
        currentDateFormatted === chosenCollectionDateFormatted &&
        currentTimeHourAndMinuteFormatted >= shopClosingTime
    ) {
        setShopIsClosed(true);
    } else {
        setShopIsClosed(false);
    }
}
