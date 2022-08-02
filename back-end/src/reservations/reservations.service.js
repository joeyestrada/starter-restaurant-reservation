const knex = require("../db/connection");

function list(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date, status: "booked" || "seated" })
    .orderBy("reservation_time");
}

function create(reservation) {
  return knex("reservations")
    .insert(reservation, "*")
    .then((reservations) => reservations[0]);
}

function read(id) {
  return knex("reservations").select("*").where({ reservation_id: id }).first();
}

function update(data) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: data.resId })
    .update(data, "*")
    .then((reservations) => reservations[0]);
}

module.exports = {
  list,
  create,
  read,
  update,
};
