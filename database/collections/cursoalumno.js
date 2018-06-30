'use strict'
const mongoose = require("../connection");
var Schema = mongoose.Schema;
var CursoAlumnoSchema = Schema({
  codigocurso : {type : Schema.ObjectId, ref : 'curso'},
  rutalumno : {type : Schema.ObjectId, ref : 'alumno'},
  licencia : String,
  saldo : String
});
var cursoalumno = mongoose.model("cursoalumno", CursoAlumnoSchema);
module.exports = cursoalumno;
