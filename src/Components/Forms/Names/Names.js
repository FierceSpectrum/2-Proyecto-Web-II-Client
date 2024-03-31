import React from "react";
import "./Names.scss";

function Names(props) {
  return (
    <div className="Names">
      <input
        required
        onChange={(ev) => props.setName(ev.target.value)}
        className="input"
        type="name"
        name="name"
        id="name"
        placeholder="Name"
      />
      <input
        required
        onChange={(ev) => props.setLastName(ev.target.value)}
        className="input"
        type="lastname"
        name="lastname"
        id="lastname"
        placeholder="Last Name"
      />
    </div>
  );
}

export default Names;
