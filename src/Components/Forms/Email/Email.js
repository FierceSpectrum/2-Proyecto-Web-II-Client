import React from "react";
import "./Email.scss";

function Email(props) {
  return (
    <div className="Email">
      <p className="Error">{props.errorEmail}</p>
      <input
        required
        onChange={(ev) => props.setEmail(ev.target.value)}
        className="input"
        type="email"
        name="email"
        id="email"
        placeholder="E-mail"
      />
    </div>
  );
}

export default Email;
