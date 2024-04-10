import React, { useState, useRef } from "react";
import "./VerificCode.scss";

function VerificCode(props) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < code.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!code[index] && index > 0) {
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePrintCode = () => {
    const codeString = code.join("");
    console.log("Code:", codeString);
    return codeString;
  };

  return (
    <div className="verificCode">
      <form
        className="form"
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          props.setCode(handlePrintCode);
          props.ValidarCode()
        }}
      >
        <span className="close" onClick={props.closePopup}>
          X
        </span>

        <div className="info">
          <span className="title">Enter the Code</span>
          <p className="description">{props.errorMessage}</p>
        </div>
        <div className="input-fields">
          {code.map((value, index) => (
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
              setCode(["", "", "", "", "", ""]);
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

export default VerificCode;
