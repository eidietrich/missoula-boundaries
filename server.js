const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mtBoundaryMaps')

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  const kittySchema = mongoose.Schema({
    name: String
  });
  kittySchema.methods.speak = function() {
    var greeting = this.name
      ? "Meow name is " + this.name
      : "I don't have a name";
      console.log(greeting);
  }
  const Kitten = mongoose.model('Kitten', kittySchema)
  const silence = new Kitten({ name: 'Silence' })
  const fluffy = new Kitten({ name: 'fluffy' });

  fluffy.save(function(err, fluffy) {
    if (err) return console.error(err);
    silence.speak();
  });
})

// const app = express();

// app.listen(3000, () => console.log('Listening on port 3000'))