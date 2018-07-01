var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var multer = require("multer");
var fs = require("fs");

var UsersUI = require("../../../database/collections/prueba");
var Alumno = require("../../../database/collections/alumno");
var Curso = require("../../../database/collections/curso");
var CursoAlumno = require("../../../database/collections/cursoalumno");

var storage = multer.diskStorage({
  destination : (req, file, cb) => {
    cb(null, "./public/avatars/");
  },
  filename : (req, file, cb) => {
    cb(null, "IMG-" + Date.now() + ".jpg");
  }
});

var fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var upload = multer({ 
  storage : storage,
  limits : {
    fileSize : 1024 * 1024 * 5
  },
  fileFilter : fileFilter
}).single('img')

router.post('/user', upload, (req, res, next) => {
  console.log(req.file);
  var users = {
    _id : new mongoose.Types.ObjectId(),
    name : req.body.name,
    lastname : req.body.lastname,
    imagesUser : req.file.path
  };
  var host = "http://127.0.0.1:7777/prueba/";
  var usersData = new UsersUI(users);
  usersData.save()
    .then((usersData) => {
      console.log(usersData);
      res.status(201).json({
        message : "User register successfully",
        registerUser : {
          name : usersData.name,
          lastname : usersData.lastname,
          _id : usersData._id,
          request : {
            type : 'GET',
            url : host + usersData._id
          }
        }
      });
    }).catch(err => {
      console.log(err);
      res.status(500).json({
        error : err
      });
    });
});

router.get('/user', (req, res, next) => {
  UsersUI.find()
  .select(" name lastname _id imagesUser")
  .exec()
  .then(docs => {
    const response = {
      count : docs.length,
      Users : docs.map(doc => {
        return {
          lastname : doc.lastname,
          name : doc.name,
          imagesUser : doc.imagesUser,
          request : {
            type : 'GET',
            url : "http://127.0.0.1:7777/prueba/" + doc._id
          }
        };
      })
    }
    res.status(200).json(response);
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      error : err
    });
  });
});

router.get('/users/', (req, res , next) => {
  var keyword = req.query.search;
  console.log(keyword);
  var expreg = new RegExp(keyword);
  UsersUI.find( { 'name' : expreg }).exec( (err, usuario) => {
    if (err){
      res.status(500).json({
        error : err
      });
    } else {
      if(usuario == ""){
        res.status(404).json({
          message : 'No existe el recurso'
        });
      } else {
        res.status(200).json({
          usuarios : usuario,
          message : 'palabra clave ' + keyword + ' buscada.'
        }); 
      }
    }
  });
});

router.get('/use/', (req, res, next) => {
  var name = req.query.name;
  var lastname = req.query.lastname;
  console.log(name);
  console.log(lastname);
  var nam = new RegExp(name);
  var lastnam = new RegExp(lastname);
  UsersUI.findOne({ 'name' : nam, 'lastname' : lastnam }).exec( (err, usuarios) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json({
        info : usuarios,
        user : {
          nombre : name,
          apellido : lastname,
          imagendeUsuario : usuarios.imagesUser
        }
      });
    }
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ApirestPruebAServive' });
});
router.get('/cursoalumno', (req, res) => {
  CursoAlumno.find().populate({path : 'rutalumno'}).exec((err, cursoalumno) => {
    if (err) {
      res.status(500).send({message : 'error de conexion a la DB'});
    }else {
      if (!cursoalumno) {
        res.status(404).send({message : 'No existe el curso'});
      }else {
        Curso.populate(cursoalumno, {path : 'codigocurso'}, (err, docingreso) => {
          if (err) {
            res.status(500).send({message : 'Error en la peticion a la DB'});
          }else {
            res.status(200).send(cursoalumno);
          }
        });
      }
    }
  });
});
/* POST home page. */

router.post('/alumno', (req, res) => {
  var alumno = {
    rut : req.body.rut,
    nombre : req.body.nombre,
    edad : req.body.edad,
    nacionalidad : req.body.nacionalidad
  };
  var alumnoData = new Alumno(alumno);
  alumnoData.save().then((alumnoData) => {
    res.status(200).json({
      msn : 'Alumon reg. exitosamente',
      datos : alumnoData
    });
  }).catch(err => {
    res.status(500).json({
      error : err
    });
  });
});

module.exports = router;
