'use strict'
const mongoose = require("../connection");
var Schema = mongoose.Schema;
var cursoSchema = Schema({
  codigoCurso : String,
  lugar : String,
  fecinicio : String,
  fectermino : String
});
var curso = mongoose.model("curso", cursoSchema);
module.exports = curso;
