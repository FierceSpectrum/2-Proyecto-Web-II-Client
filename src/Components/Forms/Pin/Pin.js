import React from "react";
import "./Pin.scss";

function Pin(props) {
  const handlePinChange = (event) => {
    const value = event.target.value.replace(/\D/g, "");
    if (value === event.target.value) {
      props.setErrorPin("");
    }
    props.setPin(value);
  };

  return (
    <>
      <div className="Pin">
        <p className="Error">{props.errorPin}</p>
        <input
          value={props.pin}
          onChange={handlePinChange}
          required
          className="pin"
          type="pin"
          name="pin"
          id="pin"
          placeholder="Pin"
          pattern="\d*"
          maxLength="6"
        />
      </div>
    </>
  );
}

export default Pin;
