/********************************************
 * DO NOT EDIT THIS FILE
 * the verification process may break
 *******************************************/

import express, { Router } from "express";
const app = express();
import mongoose from 'mongoose';
/*try {
  mongoose = require("mongoose");
} catch (e) {
  console.log(e);
}*/
import { readFile } from "fs";
import { join } from "path";
import pkg from 'body-parser';
const { urlencoded, json } = pkg;
const router = Router();
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function enableCORS(req, res, next) {
  if (!process.env.DISABLE_XORIGIN) {
    const allowedOrigins = ["https://www.freecodecamp.org"];
    const origin = req.headers.origin;
    if (!process.env.XORIGIN_RESTRICT || allowedOrigins.indexOf(origin) > -1) {
      console.log(req.method);
      res.set({
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
      });
    }
  }
  next();
}

// global setting for safety timeouts to handle possible
// wrong callbacks that will never be called
const TIMEOUT = 10000;

app.use(urlencoded({ extended: "false" }));
app.use(json());

app.get("/", function (req, res) {
  res.sendFile(join(__dirname, "views", "index.html"));
});

router.get("/file/*?", function (req, res, next) {
  if (req.params[0] === ".env") {
    return next({ status: 401, message: "ACCESS DENIED" });
  }
  readFile(join(__dirname, req.params[0]), function (err, data) {
    if (err) {
      return next(err);
    }
    res.type("txt").send(data.toString());
  });
});

router.get("/is-mongoose-ok", function (req, res) {
  if (mongoose) {
    res.json({ isMongooseOk: !!mongoose.connection.readyState });
  } else {
    res.json({ isMongooseOk: false });
  }
});

import { PersonModel as Person } from "./myApp.js";

router.use(function (req, res, next) {
  if (req.method !== "OPTIONS" && Person.modelName !== "Person") {
    return next({ message: "Person Model is not correct" });
  }
  next();
});

router.post("/mongoose-model", function (req, res, next) {
  // try to create a new instance based on their model
  // verify it's correctly defined in some way
  var p;
  p = new Person(req.body);
  res.json(p);
});

import { createAndSavePerson as createPerson } from "./myApp.js";
router.get("/create-and-save-person", function (req, res, next) {
  // in case of incorrect function use wait timeout then respond
  var t = setTimeout(() => {
    next({ message: "timeout" });
  }, TIMEOUT);
  createPerson(function (err, data) {
    clearTimeout(t);
    if (err) {
      return next(err);
    }
    if (!data) {
      console.log("Missing `done()` argument");
      return next({ message: "Missing callback argument" });
    }
    Person.findById(data._id, function (err, pers) {
      if (err) {
        return next(err);
      }
      res.json(pers);
      pers.remove();
    });
  });
});

import { createManyPeople as createPeople } from "./myApp.js";
router.post("/create-many-people", function (req, res, next) {
  Person.remove({}, function (err) {
    if (err) {
      return next(err);
    }
    // in case of incorrect function use wait timeout then respond
    var t = setTimeout(() => {
      next({ message: "timeout" });
    }, TIMEOUT);
    createPeople(req.body, function (err, data) {
      clearTimeout(t);
      if (err) {
        return next(err);
      }
      if (!data) {
        console.log("Missing `done()` argument");
        return next({ message: "Missing callback argument" });
      }
      Person.find({}, function (err, pers) {
        if (err) {
          return next(err);
        }
        res.json(pers);
        Person.remove().exec();
      });
    });
  });
});

import { findPeopleByName as findByName } from "./myApp.js";
router.post("/find-all-by-name", function (req, res, next) {
  var t = setTimeout(() => {
    next({ message: "timeout" });
  }, TIMEOUT);
  Person.create(req.body, function (err, pers) {
    if (err) {
      return next(err);
    }
    findByName(pers.name, function (err, data) {
      clearTimeout(t);
      if (err) {
        return next(err);
      }
      if (!data) {
        console.log("Missing `done()` argument");
        return next({ message: "Missing callback argument" });
      }
      res.json(data);
      Person.remove().exec();
    });
  });
});

import { findOneByFood as findByFood } from "./myApp.js";
router.post("/find-one-by-food", function (req, res, next) {
  var t = setTimeout(() => {
    next({ message: "timeout" });
  }, TIMEOUT);
  var p = new Person(req.body);
  p.save(function (err, pers) {
    if (err) {
      return next(err);
    }
    findByFood(pers.favoriteFoods[0], function (err, data) {
      clearTimeout(t);
      if (err) {
        return next(err);
      }
      if (!data) {
        console.log("Missing `done()` argument");
        return next({ message: "Missing callback argument" });
      }
      res.json(data);
      p.remove();
    });
  });
});

import { findPersonById as findById } from "./myApp.js";
router.get("/find-by-id", function (req, res, next) {
  var t = setTimeout(() => {
    next({ message: "timeout" });
  }, TIMEOUT);
  var p = new Person({ name: "test", age: 0, favoriteFoods: ["none"] });
  p.save(function (err, pers) {
    if (err) {
      return next(err);
    }
    findById(pers._id, function (err, data) {
      clearTimeout(t);
      if (err) {
        return next(err);
      }
      if (!data) {
        console.log("Missing `done()` argument");
        return next({ message: "Missing callback argument" });
      }
      res.json(data);
      p.remove();
    });
  });
});

import { findEditThenSave as findEdit } from "./myApp.js";
router.post("/find-edit-save", function (req, res, next) {
  var t = setTimeout(() => {
    next({ message: "timeout" });
  }, TIMEOUT);
  var p = new Person(req.body);
  p.save(function (err, pers) {
    if (err) {
      return next(err);
    }
    try {
      findEdit(pers._id, function (err, data) {
        clearTimeout(t);
        if (err) {
          return next(err);
        }
        if (!data) {
          console.log("Missing `done()` argument");
          return next({ message: "Missing callback argument" });
        }
        res.json(data);
        p.remove();
      });
    } catch (e) {
      console.log(e);
      return next(e);
    }
  });
});

import { findAndUpdate as update } from "./myApp.js";
router.post("/find-one-update", function (req, res, next) {
  var t = setTimeout(() => {
    next({ message: "timeout" });
  }, TIMEOUT);
  var p = new Person(req.body);
  p.save(function (err, pers) {
    if (err) {
      return next(err);
    }
    try {
      update(pers.name, function (err, data) {
        clearTimeout(t);
        if (err) {
          return next(err);
        }
        if (!data) {
          console.log("Missing `done()` argument");
          return next({ message: "Missing callback argument" });
        }
        res.json(data);
        p.remove();
      });
    } catch (e) {
      console.log(e);
      return next(e);
    }
  });
});

import { removeById as removeOne } from "./myApp.js";
router.post("/remove-one-person", function (req, res, next) {
  Person.remove({}, function (err) {
    if (err) {
      return next(err);
    }
    var t = setTimeout(() => {
      next({ message: "timeout" });
    }, TIMEOUT);
    var p = new Person(req.body);
    p.save(function (err, pers) {
      if (err) {
        return next(err);
      }
      try {
        removeOne(pers._id, function (err, data) {
          clearTimeout(t);
          if (err) {
            return next(err);
          }
          if (!data) {
            console.log("Missing `done()` argument");
            return next({ message: "Missing callback argument" });
          }
          console.log(data);
          Person.count(function (err, cnt) {
            if (err) {
              return next(err);
            }
            data = data.toObject();
            data.count = cnt;
            console.log(data);
            res.json(data);
          });
        });
      } catch (e) {
        console.log(e);
        return next(e);
      }
    });
  });
});

import { removeManyPeople as removeMany } from "./myApp.js";
router.post("/remove-many-people", function (req, res, next) {
  Person.remove({}, function (err) {
    if (err) {
      return next(err);
    }
    var t = setTimeout(() => {
      next({ message: "timeout" });
    }, TIMEOUT);
    Person.create(req.body, function (err, pers) {
      if (err) {
        return next(err);
      }
      try {
        removeMany(function (err, data) {
          clearTimeout(t);
          if (err) {
            return next(err);
          }
          if (!data) {
            console.log("Missing `done()` argument");
            return next({ message: "Missing callback argument" });
          }
          Person.count(function (err, cnt) {
            if (err) {
              return next(err);
            }
            if (data.ok === undefined) {
              // for mongoose v4
              try {
                data = JSON.parse(data);
              } catch (e) {
                console.log(e);
                return next(e);
              }
            }
            res.json({
              n: data.n,
              count: cnt,
              ok: data.ok,
            });
          });
        });
      } catch (e) {
        console.log(e);
        return next(e);
      }
    });
  });
});

import { queryChain as chain } from "./myApp.js";
router.post("/query-tools", function (req, res, next) {
  var t = setTimeout(() => {
    next({ message: "timeout" });
  }, TIMEOUT);
  Person.remove({}, function (err) {
    if (err) {
      return next(err);
    }
    Person.create(req.body, function (err, pers) {
      if (err) {
        return next(err);
      }
      try {
        chain(function (err, data) {
          clearTimeout(t);
          if (err) {
            return next(err);
          }
          if (!data) {
            console.log("Missing `done()` argument");
            return next({ message: "Missing callback argument" });
          }
          res.json(data);
        });
      } catch (e) {
        console.log(e);
        return next(e);
      }
    });
  });
});

app.use("/_api", enableCORS, router);

// Error handler
app.use(function (err, req, res, next) {
  if (err) {
    res
      .status(err.status || 500)
      .type("txt")
      .send(err.message || "SERVER ERROR");
  }
});

// Unmatched routes handler
app.use(function (req, res) {
  if (req.method.toLowerCase() === "options") {
    res.end();
  } else {
    res.status(404).type("txt").send("Not Found");
  }
});

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

/********************************************
 * DO NOT EDIT THIS FILE
 * the verification process may break
 *******************************************/
