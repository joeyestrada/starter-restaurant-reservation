import React from "react";

export default function ResForm({
  formData,
  changeHandler,
  errorMessage,
  errorElement,
  submitHandler,
  cancelHandler
}) {
  return (
    <>
      <h1>Edit Reservation</h1>
      {errorMessage && errorElement()}
      <form onSubmit={submitHandler}>
        <div className="row mt-3">
          <div className="col">
            <input
              type="text"
              name="first_name"
              className="form-control"
              placeholder="First name"
              required={true}
              onChange={changeHandler}
              value={formData.first_name}
            />
          </div>
          <div className="col">
            <input
              type="text"
              name="last_name"
              className="form-control"
              placeholder="Last name"
              required={true}
              onChange={changeHandler}
              value={formData.last_name}
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col">
            <input
              type="tel"
              name="mobile_number"
              className="form-control"
              placeholder="Mobile number"
              required={true}
              onChange={changeHandler}
              value={formData.mobile_number}
            />
          </div>
          <div className="col">
            <input
              type="date"
              name="reservation_date"
              className="form-control"
              required={true}
              onChange={changeHandler}
              value={formData.reservation_date}
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col">
            <input
              type="time"
              name="reservation_time"
              className="form-control"
              required={true}
              onChange={changeHandler}
              value={formData.reservation_time}
            />
          </div>
          <div className="col">
            <input
              type="number"
              name="people"
              className="form-control"
              min="1"
              placeholder="Number of people in party"
              required={true}
              onChange={changeHandler}
              value={formData.people}
            />
          </div>
        </div>
        <div className="form-group row mt-3">
          <div className="col-sm-10">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <button onClick={cancelHandler} className="btn btn-secondary ml-2">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
