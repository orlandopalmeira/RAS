const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const passport = require('passport')

// Controller to the dbs
const users = require('../controllers/users.js');
var usersModel = require('../models/users')
const auth = require('../auth/auth');
const { hash } = require("bcrypt");

function paginatedResults(model) {
  return async (req, res, next) => {
    const queries = []
    const match = {
      $match: {}
    }
    queries.push(match)

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    try {
      res.paginatedResults = results;

      const aggregation = model.aggregate(queries);
      var total = await model.aggregate([...queries, { $count: 'count' }]).exec();
      total = total.length > 0 ? total[0].count : 0
      results.results = await aggregation.skip(startIndex).limit(limit).exec();

      if (endIndex < total) {
        results.next = {
          page: page + 1,
          limit: limit
        }
      }

      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit
        }
      }

      next();
    } catch (error) {
      res.status(500).json({ error: error, message: error.message });
    }
  }
}

/*function verifyActiveStatus(req, res, next) {
  usersModel.findOne({ email: req.body.email })
    .then(response => {
      if (response.active === false) {
        res.status(501).jsonp({ error: "User is not active", message: "User is not active" })
      }
      else {
        next()
      }
    })
    .catch(err => {
      res.status(500).jsonp({ error: err, message: "Login error: " + err })
    })

}*/

/**
 * POST route to register a user
 */
router.post('/register', function (req, res) {
  var d = new Date().toISOString().substring(0, 19)
  usersModel.findOne({ email: req.body.email })
    .then(dados => {
      if (dados) {
        res.status(500).jsonp({ error: 'Email already in use' });

      } else {
        usersModel.register(new usersModel({
          username: req.body.username,
          numMecanografico: req.body.numMecanografico,
          email: req.body.email,
          type: req.body.type
        }),
          req.body.password,
          async (err, user) => {
            if (err)
              res.jsonp({ error: err, message: "Register error: " + err })
            else {
              passport.authenticate("local")(req, res, () => {
                jwt.sign({
                  email: req.user.email, type: req.user.type, username: req.user.name, numMecanografico: req.user.numMecanografico,
                  sub: 'User registered', id: req.user._id
                },
                  process.env.SECRET_KEY,
                  { expiresIn: "1h" },
                  function (e, token) {
                    if (e) res.status(500).jsonp({ error: "Erro na geração do token: " + e })
                    else res.status(201).jsonp({ token: token })
                  });
              })
            }
          })
      }

    })
    .catch(err => {
      res.status(500).jsonp({ error: err, message: err.message });
    })
})

/**
 * POST route to login a user
 */
router.post('/login', passport.authenticate('local'), function (req, res) {
  console.log({
    email: req.user.email, type: req.user.type, numMecanografico: req.user.numMecanografico,
    sub: 'User logged in',
    id: req.user._id
  })
  jwt.sign({
    email: req.user.email, type: req.user.type, numMecanografico: req.user.numMecanografico,
    sub: 'User logged in',
    id: req.user._id
  },
    process.env.SECRET_KEY,
    { expiresIn: "1h" },
    function (e, token) {
      if (e) res.status(500).jsonp({ error: "Erro na geração do token: " + e })
      else res.status(201).jsonp({ "token": token })
    });
})

router.get('/', paginatedResults(usersModel), function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json(res.paginatedResults);
})

router.get('/:id', function (req, res) {
  users.getUser(req.params.id)
    .then(dados => res.status(200).jsonp({ dados: dados }))
    .catch(e => res.status(500).jsonp({ error: e }))
})

/**
 * GET verify if the student exists given the Mecanopgrahic number
 */

router.get('/alunos/:numMecanografico', (req, res) => {
  users.verifyAluno(req.params.numMecanografico)
        .then(data  => res.status(200).json(data))
        .catch(error => res.status(521).json({ error: error, message: "Could not obtain the student" }))
});

/**
 * GET the current maximum ID for a student
 */
router.get('/currentIdAluno', (req, res) => {
  users.getCurrentIdAluno()
    .then(data => res.status(200).json(data))
    .catch(error => res.status(522).json({ error: error, message: "Could not obtain the current id" }))
});

/**
 * POST which checks whether a list of student mechanographic numbers is valid (all students on the list exist in the DB)
 */
router.post('/alunos/verify', function (req,res,next) {
  let numsMecanograficos = req.body.alunos
  console.log(numsMecanograficos)
  users.checkAlunosList(numsMecanograficos)
      .then(data => res.jsonp(data))
      .catch(error => res.status(526).json({ error: error, message: error }))
})

module.exports = router;

