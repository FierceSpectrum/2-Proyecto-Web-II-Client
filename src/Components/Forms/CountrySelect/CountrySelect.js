import React, { useState, useEffect, useRef } from "react";
import "./CountrySelect.scss";

const CountrySelect = (props) => {
  const [countries, setCountries] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!countries.length) {
      generateCountriesOptions();
    }
  }, []);

  useEffect(() => {
    if (!isOpen && !inputRef.current.value.trim()) {
      props.setCountry("");
    }
  }, [isOpen, props]);

  const generateCountriesOptions = async () => {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const arrayCountries = data.map((country) => ({
        name: country.name.common,
        cca3: country.cca3,
      }));
      setCountries(arrayCountries);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const toggleSelect = () => {
    setIsOpen(!isOpen);
    if (!isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleOptionClick = (option) => {
    props.setCountry(option.name);
    setSearchTerm("");
    setIsOpen(false);
  };

  useEffect(() => {
    const filtered = countries.filter((option) =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm, countries]);

  const handleInputChange = (e) => {
    e.preventDefault();
  };

  return (
    <div className={"select-container " + (isOpen ? "isOpen" : "")}>
      <input
        required
        className="selected-option"
        placeholder="Country"
        value={props.country || ""}
        onClick={toggleSelect}
        ref={inputRef}
        onChange={handleInputChange}
        autoComplete="nope"
      />

      {isOpen && (
        <div className="select-options-container">
          <div className="select-options">
            <input
              className="search-input"
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <div className="options">
              <div className="options-list">
                {filteredOptions.map((option) => (
                  <div
                    key={option.cca3}
                    className="option"
                    onClick={() => handleOptionClick(option)}
                  >
                    {option.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelect;
