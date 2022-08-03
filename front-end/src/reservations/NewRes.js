import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import { formatAsDate, formatAsTime } from "../utils/date-time";
import ResForm from "./ResForm";

export default function NewRes() {
  const history = useHistory();

  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errorMessage, setErrorMessage] = useState(null);

  const changeHandler = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const abort = new AbortController();

    const formatedData = {
      ...formData,
      people: parseInt(formData.people),
      reservation_date: formatAsDate(formData.reservation_date),
      reservation_time: formatAsTime(formData.reservation_time),
    };

    try {
      await createReservation(formatedData, abort.signal);
      history.push(`/dashboard?date=${formData.reservation_date}`);
    } catch (error) {
      setErrorMessage(error);
    }
  };

  const cancelHandler = (event) => {
    event.preventDefault();
    history.goBack();
  };

  const errorElement = () => {
    return (
      <div className="alert alert-danger">
        <p>ERROR: {errorMessage.message}</p>
      </div>
    );
  };

  return (
    <>
      <ResForm
        formData={formData}
        changeHandler={changeHandler}
        errorMessage={errorMessage}
        errorElement={errorElement}
        submitHandler={submitHandler}
        cancelHandler={cancelHandler}
      />
    </>
  );
}
