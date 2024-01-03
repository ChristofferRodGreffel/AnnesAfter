import React, { useState, useEffect } from "react";

const OpeningHoursSelect = (props) => {

  // Udviklet primært af Sebastian

  const [openingHours, setOpeningHours] = useState([]);
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = new Date().getDay(); // 0 for Sunday, 1 for Monday, and so on
  const todayHour = new Date().getHours();
  const todayMinute = new Date().getMinutes();

  const currentDate = new Date();

  const shopClosingTime = 1830;

  const handleChangeTime = (e) => {
    e.preventDefault();
    const time = e.target.value;
    props.setChosenCollectionTime(time);
  };

  useEffect(() => {
    // Function to calculate the opening hours based on the current day
    const calculateOpeningHours = () => {
      const currentDay = daysOfWeek[today];
      // Tjekker om det er weekend
      let isWeekend =
        props.chosenCollectionDate.getDay() === 0 ||
        props.chosenCollectionDate.getDay() === 6; // Sunday or Saturday

      // Define opening hours based on the current day
      // Kl. 7 på hverdage og 10 i weekender
      const startHour = !isWeekend ? 7 : 10;
      const endHour = 18;

      // Hvis man har valgt den aktuelle dag og nurværende time er større eller lig med åbningstimen
      // får man mulighed for at vælge "Hurtigst muligt"
      const openingHoursArray = currentDate.toLocaleDateString() === props.chosenCollectionDate.toLocaleDateString() && todayHour >= startHour ? ["Hurtigst muligt"] : [];

      for (let hour = startHour; hour <= endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 10) {
          // Stopper listen efter 18.40
          if (hour === endHour && minute > 45) {
            break;
          }

          // Tjekker om man har valgt den akutelle dag
          if (currentDate.toLocaleDateString() === props.chosenCollectionDate.toLocaleDateString()) {
            // sørger for at man ikke kan vælge en tid om mindre end 10 min.
            if (hour < todayHour || (hour === todayHour && minute < todayMinute + 10)) {
              // Kører videre i stedet for at hoppe helt ud af funktionen
              continue;
            }
          }

          // Formaterer tiden, så den ser pæn ud
          const formattedHour = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
          openingHoursArray.push(formattedHour);
        }
      }
      setOpeningHours(openingHoursArray);
    };

    calculateOpeningHours();
  }, [props]);

  return (
    <div className="flex flex-col gap-2">
      {props.shopIsClosed ? (
        <>
          <p className="text-sm italic">Det er desværre for sent at bestille til i dag.</p>
        </>
      ) : (
        <>
          <label className="font-semibold">Vælg afhentningstid*</label>
          <select
            className="px-4 py-2 border-2 border-dark rounded-lg"
            onChange={(e) => {
              handleChangeTime(e);
            }}
            value={props.chosenCollectionTime}
          >
            {openingHours.map((hour, index) => (
              <option key={index} value={hour}>
                {hour}
              </option>
            ))}
          </select>
          {props.chosenCollectionTime == "Hurtigst muligt" && (
            <p className="text-sm italic max-w-readable">
              Vi begynder på ordren så snart vi har tid, og du får besked når den er klar. Oftest tager det 5-20 min.
              afhængig af størrelsen & antallet af bestillinger i butikken.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default OpeningHoursSelect;
