const mongoose = require("../connection");
var Schema = mongoose.Schema;
var userSchema = new Schema({
    _id : { type : Schema.Types.ObjectId},
    name : { type : String, required : true},
    lastname : { type : String, required : true},
    imagesUser : { type : String, required : true }
});
var user = mongoose.model('Users', userSchema);
module.exports = user;