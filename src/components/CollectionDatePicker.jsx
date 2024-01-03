import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import da from "date-fns/locale/da";

function CollectionDatePicker(props) {

  // Udviklet fælles i gruppen
  
  registerLocale("da", da);

  return (
    <div className="my-5">
      <p className="font-semibold mb-2">Vælg afhentningsdato</p>
      <DatePicker
        locale="da"
        dateFormat={"dd/MM/yyyy"}
        minDate={new Date()}
        registerLocale="da"
        selected={props.chosenCollectionDate}
        onChange={(date) => props.setChosenCollectionDate(date)}
      />
    </div>
  );
}

export default CollectionDatePicker;
