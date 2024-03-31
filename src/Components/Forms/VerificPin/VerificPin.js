import React, { useState, useRef } from "react";
import "./VerificPin.scss";

function VerificPin(props) {
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      if (value && index < pin.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!pin[index] && index > 0) {
        const newPin = [...pin];
        newPin[index - 1] = "";
        setPin(newPin);
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePrintPin = () => {
    const pinString = pin.join("");
    console.log("PIN:", pinString);
    return pinString;
  };

  return (
    <div className="verificPin">
      <form
        className="form"
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          props.setPin(handlePrintPin);
        }}
      >
        <span className="close" onClick={props.closePopup}>
          X
        </span>

        <div className="info">
          <span className="title">Enter the PIN</span>
          <p className="description">{props.errorMessage}</p>
        </div>
        <div className="input-fields">
          {pin.map((value, index) => (
            <input
              key={index}
              type="tel"
              maxLength="1"
              placeholder=""
              required
              autoComplete="off"
              value={value}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(input) => (inputRefs.current[index] = input)}
            />
          ))}
        </div>
        <div className="action-btns">
          <button className="verify">Verify</button>
          <button
            type="button"
            className="clear"
            onClick={() => {
              setPin(["", "", "", "", "", ""]);
              props.setErrorMessage("");
            }}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

export default VerificPin;
