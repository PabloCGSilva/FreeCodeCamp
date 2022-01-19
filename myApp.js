/*var dotenv = require('dotenv')
dotenv.config()*/

import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

const { Schema } = mongoose;

  const personSchema = new Schema({
    name:  String,
    age: Number,
    favoriteFoods: [],
  });
  let Person = mongoose.model('Person', personSchema);

//let Person;

const createAndSavePerson = (done) => {
  var person = new Person({
    name:'john',
    age:'21',
    favoriteFoods:['fish','beer']
  })
  person.save((err, data)=>{
    if (err){
      throw err;
    }
    console.log(data)
    return done(null, data);
  });
};

const createManyPeople = (arrayOfPeople, done) => {
  arrayOfPeople.create((data)=>{
    console.log(data)
    return done(null, data);
  });
};

const findPeopleByName = (personName, done) => {
  done(null /*, data*/);
};

const findOneByFood = (food, done) => {
  done(null /*, data*/);
};

const findPersonById = (personId, done) => {
  done(null /*, data*/);
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  done(null /*, data*/);
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  done(null /*, data*/);personModel
};

const removeById = (personId, done) => {
  done(null /*, data*/);
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

  done(null /*, data*/);
};

const queryChain = (done) => {
  const foodToSearch = "burrito";

  done(null /*, data*/);
};

export const PersonModel = Person;
const _createAndSavePerson = createAndSavePerson;
export { _createAndSavePerson as createAndSavePerson };
const _findPeopleByName = findPeopleByName;
export { _findPeopleByName as findPeopleByName };
const _findOneByFood = findOneByFood;
export { _findOneByFood as findOneByFood };
const _findPersonById = findPersonById;
export { _findPersonById as findPersonById };
const _findEditThenSave = findEditThenSave;
export { _findEditThenSave as findEditThenSave };
const _findAndUpdate = findAndUpdate;
export { _findAndUpdate as findAndUpdate };
const _createManyPeople = createManyPeople;
export { _createManyPeople as createManyPeople };
const _removeById = removeById;
export { _removeById as removeById };
const _removeManyPeople = removeManyPeople;
export { _removeManyPeople as removeManyPeople };
const _queryChain = queryChain;
export { _queryChain as queryChain };
