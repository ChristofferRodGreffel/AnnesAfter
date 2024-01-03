// Udviklet primært af Christoffer

export function timestampConvert(stamp, type) {
  let unixTimestamp = stamp;

  // Convert to milliseconds and
  // then create a new Date object
  let dateObj = new Date(unixTimestamp * 1000);

  let date = dateObj.toLocaleDateString("en-GB");

  // Get hours from the timestamp
  let hours = dateObj.getHours();

  // Get minutes part from the timestamp
  let minutes = dateObj.getMinutes();

  // Get seconds part from the timestamp
  let seconds = dateObj.getSeconds();

  // Formaterer til det resultat, som vi ønsker
  switch (type) {
    case "stampToHourMinute":
      return hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0");
      break;

    case "stampToHourMinuteSeconds":
      return (
        hours.toString().padStart(2, "0") +
        ":" +
        minutes.toString().padStart(2, "0") +
        ":" +
        seconds.toString().padStart(2, "0")
      );
      break;

    case "stampToDate":
      return date;
      break;

    case "stampToDateAndHourMinute":
      return date + ", " + hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0");
      break;

    case "stampToPreciseDate":
      return date + ", " + "kl. " + hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0");
      break;

    default:
      break;
  }
}
