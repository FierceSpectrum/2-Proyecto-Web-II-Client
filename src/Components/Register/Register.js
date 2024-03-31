import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Country from "../Forms/CountrySelect/CountrySelect";
import Brigtdate from "../Forms/Brigtdate/Brigtdate";
import Pin from "../Forms/Pin/Pin";
import Password from "../Forms/Password/Password";
import Names from "../Forms/Names/Names";
import Email from "../Forms/Email/Email";
import "./Register.scss";

function Register() {
  const navigate = useNavigate();

  const [lastName, setLastName] = useState();
  const [name, setName] = useState();

  const [pin, setPin] = useState("");

  const [birthdate, setBirthdate] = useState();

  const [country, setCountry] = useState("");

  const [email, setEmail] = useState();

  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const [user, setUser] = useState([]);

  const [errorRegister, setErrorRegister] = useState();
  const [errorDate, setErrorDate] = useState();
  const [errorPin, setErrorPin] = useState();
  const [errorEmail, setErrorEmail] = useState();
  const [errorPassword, setErrorPassword] = useState();

  useEffect(() => {
    if (!!user.id) {
      navigate("/Login");
    }
  }, [navigate, user]);

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const Validar = async () => {
    if (pin.length !== 6) {
      setErrorPin("El PIN debe tener 6 números");
      return;
    }

    setErrorPin("");

    const validemail = validarEmail(email);
    if (!validemail) {
      setErrorEmail("Invalid email format");
      return;
    }

    setErrorEmail("");

    if (!!errorDate || !birthdate) {
      setErrorRegister("Hay un error en la fecha");
      return;
    }

    setErrorDate("");
    if (password !== confirmPassword) {
      setErrorPassword("Las contraseñas no coinsiden");
      return;
    }
    setErrorPassword("");

    const data = {
      name: name,
      last_name: lastName,
      birthdate: birthdate,
      pin: parseInt(pin),
      country: country,
      email: email,
      password: password,
    };
    console.log(data);

    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        const value = data[key];
        if (!value || (typeof value === "string" && value.trim() === "")) {
          return `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
        }
      }
    }

    const urllogin = "http://localhost:3001/api/users";

    await fetch(urllogin, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 400) {
            return response.json().then((errorData) => {
              throw new Error(errorData.error);
            });
          }
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const user = {
          id: data._id,
          email: data.email,
          pin: data.pin,
          name: data.name,
          last_name: data.last_name,
        };

        setUser(user);
      })
      .catch((err) => {
        setErrorRegister(err.message);
      });
  };

  return (
    <>
      <div className="boddyregister">
        <div className="container">
          <div className="heading">Sign Up</div>
          <form
            action=""
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              Validar();
            }}
          >
            <p className="Error">{errorRegister}</p>
            <Names setName={setName} setLastName={setLastName} />

            <Pin
              pin={pin}
              setPin={setPin}
              errorPin={errorPin}
              setErrorPin={setErrorPin}
            />

            <Brigtdate
              setBirthdate={setBirthdate}
              errorDate={errorDate}
              setErrorDate={setErrorDate}
            />

            <Country country={country} setCountry={setCountry} />

            <Email setEmail={setEmail} errorEmail={errorEmail} />

            <Password
              setPassword={setPassword}
              setConfirmPassword={setConfirmPassword}
              errorPassword={errorPassword}
              setErrorPassword={setErrorPassword}
              requiredConfirmPassword={true}
            />

            <span className="forgot-password">
              <a href="/Login">Login</a>
            </span>
            <input className="login-button" type="submit" value="Sign Up" />
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;

/* 
<section>
  <form
    onSubmit={(e) => {
      e.preventDefault();
      Validar();
    }}
  >
    <h1>Registro</h1>
    <div className="errormesage">
      <p>{errorRegister}</p>
    </div>
    <div className="divPI">
      <div className="inputbox">
        <ion-icon name="mail-outline"></ion-icon>
        <input
          type="text"
          onChange={(ev) => setName(ev.target.value)}
          required
        />
        <label htmlFor="">Name</label>
      </div>
      <div className="inputbox">
        <ion-icon name="mail-outline"></ion-icon>
        <input
          type="text"
          onChange={(ev) => setLastName(ev.target.value)}
          required
        />
        <label htmlFor="">LastName</label>
      </div>
    </div>

    <div className="errormesage">
      <p>{errorDate}</p>
    </div>
    <div className="inputbox birthdate">
      <ion-icon name="mail-outline"></ion-icon>
      <select
        type="select"
        onChange={(ev) => {
          setDay(parseInt(ev.target.value));
          setErrorDate("");
        }}
        required
        name="day"
        id="day"
        autoComplete="birthdate"
      >
        <option value="">Day</option>
        {generateDaysOptions()}
      </select>
      <select
        type="select"
        onChange={(ev) => {
          setMonth(parseInt(ev.target.value));
          setErrorDate("");
        }}
        required
        name="month"
        id="month"
        autoComplete="birthdate"
      >
        <option value="">Month</option>
        {generateMonthsOptions()}
      </select>
      <select
        type="select"
        onChange={(ev) => {
          setYear(parseInt(ev.target.value));
          setErrorDate("");
        }}
        required
        name="year"
        id="year"
        autoComplete="birthdate"
      >
        <option value="">Year</option>
        {generateYearsOptions()}
      </select>
      <label htmlFor="">Birthdate</label>
    </div>

    <div className="errormesage">
      <p>{errorPin}</p>
    </div>
    <div className="inputbox">
      <ion-icon name="mail-outline"></ion-icon>
      <input
        type="text"
        value={pin}
        onChange={handlePinChange}
        required
        inputMode="numeric"
        autoComplete="pin"
        pattern="\d*"
        maxLength="6"
      />
      <label htmlFor="">Pin</label>
    </div>

    <div className="inputbox">
      <ion-icon name="mail-outline"></ion-icon>
      <select
        type="select"
        onChange={(ev) => {
          setCountry(ev.target.value);
        }}
        required
        name="countries"
        id="countries"
        autoComplete="country"
      >
        <option value="">Country</option>
        {countries}
      </select>
    </div>

    <div className="inputbox">
      <ion-icon name="mail-outline"></ion-icon>
      <input
        type="text"
        onChange={(ev) => setEmail(ev.target.value)}
        required
        autoComplete="username"
      />
      <label htmlFor="">Email</label>
    </div>

    <div className="errormesage">
      <p>{errorPassword}</p>
    </div>
    <div className="inputbox">
      <ion-icon name="lock-closed-outline"></ion-icon>
      <input
        type="password"
        onChange={(ev) => {
          setPassword(ev.target.value);
          setErrorPassword("");
        }}
        required
        autoComplete="current-password"
      />
      <label htmlFor="">Password</label>
    </div>

    <div className="inputbox">
      <ion-icon name="lock-closed-outline"></ion-icon>
      <input
        type="password"
        onChange={(ev) => {
          setConfirmPassword(ev.target.value);
          setErrorPassword("");
        }}
        required
        autoComplete="current-password"
      />
      <label htmlFor="">Confirm Password</label>
    </div>
    <button>Registrar</button>
  </form>
</section>
*/
