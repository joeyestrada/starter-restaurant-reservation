const service = require("./reservations.service");

const dateFormat = /\d\d\d\d-\d\d-\d\d/;
const timeFormat = /\d\d:\d\d/;

function bodyDataVerification(req, res, next) {
  const toCheck = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ];

  let notValid = [];
  const { data = {} } = req.body;
  res.locals.data = data;

  // checks to see is the people parameter is an integer
  if (typeof data.people !== "number") {
    next({ status: 400, message: `people must be an integer` });
  }

  // checks to see is the reservation date is the correct format
  if (!dateFormat.test(data.reservation_date)) {
    next({
      status: 400,
      message: "reservation_date is not in the correct format",
    });
  }

  // checks to see is the reservation time is the correct format
  if (!timeFormat.test(data.reservation_time)) {
    next({
      status: 400,
      message: "reservation_time is not in the correct format",
    });
  }

  // checks to make sure all parameters are not empty
  toCheck.forEach((param) => {
    if (!data[param]) {
      notValid.push(param);
    }
  });

  if (notValid.length > 0) {
    next({
      status: 400,
      message: `Please fill in the following: ${notValid.join(", ")}`,
    });
  }
  next();
}

function ifSeated(req, res, next) {
  const toCheck = ["seated", "finished"];
  if (toCheck.includes(res.locals.data.status)) {
    next({
      status: 400,
      message: `cannot make a reservation that has a status of ${res.locals.data.status}`,
    });
  }
  next();
}

function statusCheck(req, res, next) {
  const toCheck = ["booked", "seated", "finished", "cancelled"];
  const { status } = req.body.data;
  if (!toCheck.includes(status)) {
    next({
      status: 400,
      message: `reservation is on status: ${status}`,
    });
  }

  next();
}

function isFinished(req, res, next) {
  if (res.locals.data.status === "finished") {
    next({ status: 400, message: "reservation cannot be finished" });
  }

  next();
}

function dateCheck(req, res, next) {
  const dayIncoming = new Date(res.locals.data.reservation_date);
  if (dayIncoming.getDay() === 1) {
    next({
      status: 400,
      message: "Restaurant is closed on Tuesdays, please choose another date.",
    });
  }

  if (
    res.locals.data.reservation_date.replaceAll("-", "") <
    new Date().toISOString().slice(0, 10).replaceAll("-", "")
  ) {
    next({ status: 400, message: "Only future reservations are allowed." });
  }

  next();
}

function timeCheck(req, res, next) {
  // set variable to incoming time request
  const incoming = parseInt(
    res.locals.data.reservation_time.replace(/[^0-9]+/, ""),
  );

  // set new variable to the current time
  const day = new Date();
  const minute = day.getMinutes();
  const hour = day.getHours();
  const compareCurrent = parseInt(
    `${hour.toString().length === 2 ? hour : "0" + hour}${
      minute.toString().length === 2 ? minute : "0" + minute
    }`,
  );

  if (
    Date.parse(res.locals.data.reservation_date) < Date.parse(new Date()) &&
    incoming < compareCurrent
  ) {
    next({
      status: 400,
      message: "Reservations cannot be made before the current time.",
    });
  }

  if (incoming < 1030) {
    next({
      status: 400,
      message:
        "Reservations must be made for after restaurant opening (10:30 AM).",
    });
  }

  if (incoming > 2130) {
    next({
      status: 400,
      message:
        "Reservations must be made for one hour prior to restaurant opening (9:30 PM).",
    });
  }

  next();
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const data = await service.read(reservation_id);

  if (!data) {
    next({
      status: 404,
      message: `reservation ${reservation_id} does not exist.`,
    });
  }

  res.locals.data = data;
  next();
}

async function list(req, res) {
  if (req.query.date) {
    return res.json({ data: await service.list(req.query.date) });
  }

  if (req.query.mobile_number) {
    return res.json({
      data: await service.listByNumber(req.query.mobile_number),
    });
  }
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function read(req, res) {
  res.json({ data: await service.read(req.params.reservation_id) });
}

async function update(req, res) {
  const data = await service.read(req.params.reservation_id);
  const editRes = {
    ...data,
    status: req.body.data.status,
  };

  res.status(200).json({ data: editRes });
}

async function edit(req, res) {
  const incoming = req.body.data;
  const resId = req.params.reservation_id;

  res.json({ data: await service.edit(incoming, resId) });
}

module.exports = {
  list,
  create: [bodyDataVerification, dateCheck, timeCheck, ifSeated, create],
  read: [reservationExists, read],
  update: [reservationExists, statusCheck, isFinished, update],
  edit: [reservationExists, bodyDataVerification, edit],
};
