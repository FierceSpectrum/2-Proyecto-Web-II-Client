import React, { useState, useEffect } from "react";
import "./Phone.scss";

function Phone(props) {
  const [codePhone, setCodePhone] = useState([]);
  const [phone, setPhone] = useState("");
  const [cca2, setCca2] = useState("CR");
  const [suffixes, setSuffixes] = useState("+506");

  useEffect(() => {
    if (!codePhone.length) {
      generateCountriesOptions();
    }
  }, []);

  const generateCountriesOptions = async () => {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const arrayCountries = data.map((country) => ({
        name: country.name.common,
        cca2: country.cca2,
        suffixes:
          country.idd.suffixes && country.idd.suffixes.length > 0
            ? country.idd.root + country.idd.suffixes[0]
            : "",
      }));
      console.log(arrayCountries);
      setCodePhone(arrayCountries);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value.replace(/\D/g, "");
    if (value === event.target.value) {
      setPhone("");
    }
    setPhone(value);
  };

  useEffect(() => {
    const updatecodes = () => {
      console.log(suffixes + phone);
      props.setPhone(suffixes + phone);
    };
    updatecodes();
  }, [suffixes, setSuffixes, phone, setPhone]);

  

  return (
    <div className="Phone">
      <div className="ui-wrapper">
        <input checked="" id="Austria" name="flag" type="radio" />
        <input id="Belgium" name="flag" type="radio" />
        <input id="Bulgaria" name="flag" type="radio" />
        <input
          className="dropdown-checkbox"
          name="dropdown"
          id="dropdown"
          type="checkbox"
        />
        <label className="dropdown-container" for="dropdown">
          {cca2}
        </label>
        <div className="input-wrapper">
          <legend>
            <label for="phonenumber">Phonenumber*</label>
          </legend>
          <div className="textfield">
            {suffixes}
            <input
              pattern="\d+"
              maxlength="11"
              id="phonenumber"
              type="text"
              value={phone}
              onChange={(e) => handleInputChange(e)}
            />
            <span className="invalid-msg">
              This is not a valid phone number
            </span>
          </div>
        </div>
        <div className="select-wrapper">
          <ul>
            {codePhone.map((contry) => (
              <li
                key={contry.cca2}
                className="Contry"
                onClick={() => {
                  setCca2(contry.cca2);
                  setSuffixes(contry.suffixes);
                }}
              >
                <label for={contry.cca2}>
                  <span>{contry.cca2}</span>
                  {`${contry.name} (${contry.suffixes})`}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Phone;
