import React from "react";
import CustomButton from "./CustomButton";

function CustomInputWithLabel(props) {

  // Udviklet primært af Sebastian
  // Bruges i diverse sammenhænge hvor vi skal bruge et input. Props.type bruges til at vælge
  // Hvilken del man skal have fat i.

  return (
    <>
      {props.type == "text" && (
        <>
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-lg mb-1" htmlFor={props.name}>
              {props.label}
            </label>
            <input
              required
              maxLength={50}
              type={props.type}
              name={props.name}
              placeholder={props.placeholder}
              id={props.name}
              value={!props.button ? props.value : undefined}
              onChange={!props.button ? (e) => props.customSetvalue(e.target.value) : undefined}
            />

            {props.button && (
              <>
                <CustomButton title={props.buttonText} function={props.customOnClick} />
              </>
            )}
          </div>
        </>
      )}
      {props.type == "textarea" && (
        <>
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-lg mb-1" htmlFor={props.name}>
              {props.label}
            </label>
            <textarea
              className="py-2 px-3 rounded-xl border-2 border-dark h-40"
              maxLength={200}
              type={props.type}
              name={props.name}
              placeholder={props.placeholder}
              id={props.name}
              value={!props.button ? props.value : undefined}
              onChange={!props.button ? (e) => props.customSetvalue(e.target.value) : undefined}
            />

            {props.button && (
              <>
                <CustomButton title={props.buttonText} function={props.customOnClick} />
              </>
            )}
          </div>
        </>
      )}

      {props.type == "email" && (
        <>
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-lg mb-1" htmlFor={props.name}>
              {props.label}
            </label>
            <input
              required
              type={props.type}
              name={props.name}
              placeholder={props.placeholder}
              id={props.name}
              value={!props.button ? props.value : undefined}
              onChange={!props.button ? (e) => props.customSetvalue(e.target.value) : undefined}
            />

            {props.button && (
              <>
                <CustomButton title={props.buttonText} function={props.customOnClick} />
              </>
            )}
          </div>
        </>
      )}

      {props.type == "number" && (
        <>
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-lg mb-1" htmlFor={props.name}>
              {props.label}
            </label>
            <input
              required
              maxLength={50}
              type={props.type}
              name={props.name}
              placeholder={props.placeholder}
              id={props.name}
              value={!props.button ? props.value : undefined}
              onChange={!props.button ? (e) => props.customSetvalue(e.target.value) : undefined}
            />

            {props.button && (
              <>
                <CustomButton title={props.buttonText} function={props.customOnClick} />
              </>
            )}
          </div>
        </>
      )}
      {props.type == "tel" && (
        <>
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-lg mb-1" htmlFor={props.name}>
              {props.label}
            </label>
            <input
              required
              maxLength={50}
              type={props.type}
              name={props.name}
              placeholder={props.placeholder}
              id={props.name}
              value={!props.button ? props.value : undefined}
              onChange={!props.button ? (e) => props.customSetvalue(e.target.value) : undefined}
            />

            {props.button && (
              <>
                <CustomButton title={props.buttonText} function={props.customOnClick} />
              </>
            )}
          </div>
        </>
      )}

      {props.type == "checkbox" && (
        <div>
          <h2 className="font-semibold text-lg">{props.title}</h2>
          <ul className="grid grid-cols-2 min-w-max w-2/3 mt-1 gap-1">
            {props.CustomOptions?.map(({ name }, index) => {
              return (
                <li key={index}>
                  <div>
                    <div className="flex flex-row gap-2">
                      <input
                        type="checkbox"
                        className="bg-dark text-dark"
                        id={`custom-checkbox-${name}`}
                        name={name}
                        value={name}
                        checked={props.CustomCheckedItems[index]}
                        onChange={() => props.CustomHandleChange(index, name)}
                      />
                      <label htmlFor={`custom-checkbox-${name}`}>{name}</label>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}

export default CustomInputWithLabel;
