const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function create(table) {
  return knex("tables")
    .insert(table, "*")
    .then((tables) => tables[0]);
}

async function update(resId, tableId) {
  function updateTables() {
    const tablesTable = { reservation_id: resId };
    return knex("tables")
      .select("*")
      .where({ table_id: tableId })
      .update(tablesTable, "*");
  }

  function updateReservations() {
    const resTable = { status: "seated" };
    return knex("reservations")
      .select("*")
      .where({ reservation_id: resId })
      .update(resTable, "*");
  }

  await updateTables();
  await updateReservations();
}

async function finish(tableId) {
  const { reservation_id } = await knex("tables")
    .select("reservation_id")
    .where({ table_id: tableId })
    .first();

  function updateTable() {
    const table = { reservation_id: null };
    return knex("tables")
      .select("*")
      .where({ table_id: tableId })
      .update(table, "*");
  }

  function updateRes() {
    const reversationsTable = { status: "finished" };
    return knex("reservations")
      .where({ reservation_id: reservation_id })
      .update(reversationsTable, "*")
  }

  await updateTable();
  await updateRes();
}

function readRes(resId) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: resId })
    .first();
}

function readTable(tableId) {
  return knex("tables").select("*").where({ table_id: tableId }).first();
}

module.exports = { list, create, update, readRes, readTable, finish };
