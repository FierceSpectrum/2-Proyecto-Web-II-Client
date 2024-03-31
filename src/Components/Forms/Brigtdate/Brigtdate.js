import React, { useState, useEffect } from "react";
import "./Brigtdate.scss";

function Brigtdate(props) {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const [days, setDays] = useState([]);
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);

  const generateDaysOptions = () => {
    const days = [];
    const numDays = 31;
    for (let i = 1; i <= numDays; i++) {
      days.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    setDays(days);
  };

  const generateMonthsOptions = () => {
    const months = [];
    for (let i = 1; i <= 12; i++) {
      months.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    setMonths(months);
  };

  const generateYearsOptions = () => {
    const years = [];
    const today = new Date();
    const currentYear = today.getFullYear();
    for (let i = currentYear; i >= currentYear - 100; i--) {
      years.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    setYears(years);
  };

  useEffect(() => {
    if (!days.length) {
      generateDaysOptions();
    }
    if (!months.length) {
      generateMonthsOptions();
    }
    if (!years.length) {
      generateYearsOptions();
    }
  }, []);

  useEffect(() => {
    validateDate();
  }, [day, month, year]);

  const validateDate = () => {
    const numericDay = parseInt(day);
    const numericMonth = parseInt(month);
    const numericYear = parseInt(year);

    const nan = !(
      isNaN(numericDay) ||
      isNaN(numericMonth) ||
      isNaN(numericYear)
    );
    const today = new Date();
    const txt = !(!day || !month || !year);
    if (nan && txt) {
      if (numericYear < 1900 || numericYear > today.getFullYear()) {
        props.setErrorDate("Año inválido");
      } else if (numericMonth < 1 || numericMonth > 12) {
        props.setErrorDate("Mes inválido");
      } else {
        const maxDays = new Date(numericYear, numericMonth, 0).getDate();
        if (numericDay < 1 || numericDay > maxDays) {
          props.setErrorDate("Día inválido");
        } else {
          props.setErrorDate("");
          const birthdate = new Date(numericYear, numericMonth - 1, numericDay);
          props.setBirthdate(birthdate);
          validAge(birthdate);
        }
      }
    } else {
      props.setErrorDate("");
    }
  };

  const validAge = (birthdate) => {
    if (isNaN(birthdate) || calculateAge(birthdate) < 18) {
      props.setErrorDate("Deves de ser mayor de edad");
    }
  };

  function calculateAge(birthdate) {
    const today = new Date();
    const diff = today - birthdate;
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }

  return (
    <>
      <div className="birthdate">
      <p className="Error">{props.errorDate}</p>
        <select
          type="select"
          onChange={(ev) => setDay(ev.target.value)}
          value={day}
          required
          name="day"
          id="day"
          autoComplete="birthdate"
        >
          <option value="">Day</option>
          {days}
        </select>
        <select
          type="select"
          onChange={(ev) => setMonth(ev.target.value)}
          value={month}
          required
          name="month"
          id="month"
          autoComplete="birthdate"
        >
          <option value="">Month</option>
          {months}
        </select>
        <select
          type="select"
          onChange={(ev) => setYear(ev.target.value)}
          value={year}
          required
          name="year"
          id="year"
          autoComplete="birthdate"
        >
          <option value="">Year</option>
          {years}
        </select>
      </div>
    </>
  );
}

export default Brigtdate;
