'use strict'
const mongoose = require("../connection");
var Schema = mongoose.Schema;
var alumnosSchema = Schema({
  rut : String,
  nombre : String,
  edad : Number,
  nacionalidad : String
});
var alumno = mongoose.model("alumno", alumnosSchema);
module.exports = alumno;
