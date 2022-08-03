import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { formatAsDate, formatAsTime } from "../utils/date-time";
import { readReservation, updateReservation } from "../utils/api";
import ResForm from "./ResForm";

export default function EditRes() {
  const history = useHistory();
  const params = useParams();

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

  useEffect(() => {
    const abort = new AbortController();

    async function readRes() {
      try {
        const response = await readReservation(
          params.reservation_id,
          abort.signal,
        );
        setFormData({
          ...response,
          reservation_date: formatAsDate(response.reservation_date),
        });
      } catch (error) {
        setErrorMessage(error);
      }
    }

    readRes();
    return () => abort.abort();
  }, [params.reservation_id]);

  const changeHandler = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const cancelHandler = (event) => {
    event.preventDefault();
    history.goBack();
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
      await updateReservation(formatedData, abort.signal);
      history.push(`/dashboard?date=${formData.reservation_date}`);
    } catch (error) {
      setErrorMessage(error);
    }
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
