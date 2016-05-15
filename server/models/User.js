'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema( { 
   name:String, 
   email:String, 
   age:Number, 
   male:Boolean, 
   skills:[String], 
   others: { 
   age:Number, 
   name:String, 
   istime:Boolean
   }, 
   wh:[ { 
   333:Boolean, 
   yy:Number, 
   ueueu:String
   }]
   });
mongoose.model('User', UserSchema);
