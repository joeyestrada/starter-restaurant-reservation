const knex = require("../db/connection");

function list(data) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: data, status: "booked" })
    .orWhere({ reservation_date: data, status: "seated" })
    .orderBy("reservation_time");
}

function listByNumber(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`,
    )
    .orderBy("reservation_date");
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
    .where({ reservation_id: data.reservation_id })
    .update(data, "*")
    .then((reservations) => reservations[0]);
}

function edit(data, resId) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: resId })
    .update(data, "*")
    .then((reservations) => reservations[0]);
}

module.exports = {
  list,
  create,
  read,
  update,
  listByNumber,
  edit,
};
