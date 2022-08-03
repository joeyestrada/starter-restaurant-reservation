import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default function Search() {
  const history = useHistory();

  const [mobileNumber, setMobileNumber] = useState("");

  const submitHandler = (event) => {
    event.preventDefault();
    console.log(mobileNumber);
    history.push(`/dashboard?mobile_number=${mobileNumber}`);
  };

  const changeHandler = (event) => {
    setMobileNumber(event.target.value);
  };

  return (
    <>
      <h1>Search</h1>
      <form onSubmit={submitHandler}>
        <p>Mobile Number</p>
        <input
          className="form-control col-2"
          type="tel"
          name="mobile_number"
          value={mobileNumber}
          onChange={changeHandler}
        />
        <button className="btn btn-primary mt-2" type="submit">
          Find
        </button>
      </form>
    </>
  );
}
