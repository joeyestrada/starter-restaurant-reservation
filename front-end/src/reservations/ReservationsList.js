import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { next, previous, today } from "../utils/date-time";
import { cancelReservation } from "../utils/api";

export default function ReservationsList({
  date,
  mobile_number,
  reservations,
  loadDashboard,
}) {
  const history = useHistory();

  const reservationsList = () => {
    if (reservations.length < 1) {
      return (
        <>
          <p>No reservations found{!mobile_number && " on this date"}.</p>
        </>
      );
    }

    const cancelHandler = async (event) => {
      if (
        window.confirm(
          "Do you want to cancel this reservation? This cannot be undone.",
        )
      ) {
        const abort = new AbortController();
        try {
          await cancelReservation(
            { status: "cancelled" },
            event.target.value,
            abort.signal,
          );
          loadDashboard();
          return () => abort.abort();
        } catch (error) {
          console.log(error);
        }
      }
    };

    const list = reservations.map((reservation) => {
      return (
        <tr key={reservation.reservation_id}>
          <td>{reservation.first_name}</td>
          <td>{reservation.last_name}</td>
          <td>{reservation.mobile_number}</td>
          <td>{reservation.reservation_date}</td>
          <td>{reservation.reservation_time}</td>
          <td>{reservation.people}</td>
          <td data-reservation-id-status={reservation.reservation_id}>
            {reservation.status}
          </td>
          <td>
            {reservation.status === "booked" && (
              <Link to={`/reservations/${reservation.reservation_id}/seat`}>
                <button className="btn btn-primary mr-1">Seat</button>
              </Link>
            )}
            <Link to={`/reservations/${reservation.reservation_id}/edit`}>
              <button className="btn btn-secondary mr-1">Edit</button>
            </Link>
            <button
              className="btn btn-danger"
              data-reservation-id-cancel={reservation.reservation_id}
              value={reservation.reservation_id}
              onClick={cancelHandler}
            >
              Cancel
            </button>
          </td>
        </tr>
      );
    });

    return (
      <table className="table mt-3">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone</th>
            <th>Date</th>
            <th>Time</th>
            <th>People</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{list}</tbody>
      </table>
    );
  };

  // changes rendered reservations based on date
  const previousHandler = () => {
    history.push(`/dashboard?date=${previous(date)}`);
  };

  const todayHandler = () => {
    history.push(`/dashboard?date=${today()}`);
  };

  const nextHandler = () => {
    history.push(`/dashboard?date=${next(date)}`);
  };

  const dateButtons = () => {
    return (
      <>
        <div className="d-md-flex mb-3">
          <h4 className="mb-0">Reservations for date: {date}</h4>
        </div>
        <button className="btn btn-primary mr-1" onClick={previousHandler}>
          Previous
        </button>
        <button className="btn btn-secondary mr-1" onClick={todayHandler}>
          Today
        </button>
        <button className="btn btn-info" onClick={nextHandler}>
          Next
        </button>
      </>
    );
  };

  return (
    <>
      {!mobile_number && dateButtons()}
      {reservations && reservationsList()}
    </>
  );
}
