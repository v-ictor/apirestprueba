const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/prueba", (error, db) => {
  if(error){
    console.log('Unable to connect to server. Please start the server. Error', error);
  }else{
    console.log('Connection successful the server mongo!!!!');
  }
});
module.exports = mongoose;
