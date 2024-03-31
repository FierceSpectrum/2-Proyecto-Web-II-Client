import React from "react";
import "./Password.scss";
function Password(props) {
  return (
    <div className="Confirm-Password">
      <p className="Error">{props.errorPassword}</p>
      <input
        required
        onChange={(ev) => {
          props.setPassword(ev.target.value);
          if (props.requiredConfirmPassword) {
            props.setErrorPassword("");
          }
        }}
        className="input"
        type="password"
        name="password"
        id="password"
        placeholder="Password"
      />
      {props.requiredConfirmPassword ? (
        <input
          required
          onChange={(ev) => {
            props.setConfirmPassword(ev.target.value);
            props.setErrorPassword("");
          }}
          className="input"
          type="password"
          name="password"
          id="Cpassword"
          placeholder="Confirm Password"
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default Password;
