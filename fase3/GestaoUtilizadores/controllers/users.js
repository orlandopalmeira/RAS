/**
 * Module to add and update documents in the databases
 */

// Model that makes the connection with the mongoDB database
var users = require('../models/users.js')

// Controller that provides functionality to connect with the algolia database
// var Algolia = require('./algolia.js')

/**
 * Retrieve a student from the BD given its id
 * RETRIEVE
 * @param {*} id - the id of the student
 * @returns The student or an error
 */
module.exports.getAluno = id => {
  return users
          .find({_id: id, type: 'A'})
          .then(resp => {
            return resp
          })
          .catch(error => {
            console.log("Controller mongoDB: " + error)
            return error
          })
}

/**
 * Verify if a student exists in the BD given its id
 * RETRIEVE
 * @param {*} id - the id of the student
 * @returns True if the student exists, false otherwise
 */

module.exports.verifyAluno = numAluno => {
    return users
        .findOne({numMecanografico: numAluno, type: 'A'})
        .then(resp => {
            if (resp) {
                return true
            } else {
                return false
            }
        })
}

/**
 * Retrieve all teachers from the BD
 * RETRIEVE
 * @returns The teachers or an error
 */
module.exports.listDocentes = () => {
    return users
        .find({type: 'D'})
        .then(resp => {
            return resp
        })
        .catch(error => {
            console.log("Controller mongoDB: " + error)
            return error
        })
}

/**
 * Retrieve a teacher from the BD given its id
 * RETRIEVE
 * @param {*} id - the id of the teacher
 * @returns The teacher or an error
 */
module.exports.getDocente = id => {
    return users
        .find({_id: id, type: 'D'})
        .then(resp => {
            return resp
        })
        .catch(error => {
            console.log("Controller mongoDB: " + error)
            return error
        })
}

/**
 * Retrieve a technician from the BD given its id
 * RETRIEVE
 * @param {*} id - the id of the technician
 * @returns The technician or an error
 */
module.exports.getTecnico = id => {
    return users
        .find({_id: id, type: 'T'})
        .then(resp => {
            return resp
        })
        .catch(error => {
            console.log("Controller mongoDB: " + error)
            return error
        })
}

/**
 * Get the next id to be used in the database for a student
 * @returns the next id to be used
 */
module.exports.getCurrentIdAluno = () => {
  return users
          .find({type: 'A'}, {_id: 1})
          .sort({_id: -1}) // Sort descending
          .limit(1) // Only the maximum
          .then(resp => {
            // If there are no students in the database, start in 0
            if (resp.length === 0){
              return {_id: 0}
            }
            else{
              // Else return the maximum id +1
              return {_id: resp[0]._id+1}
            }
          })
          .catch(error => {
            console.log("Controller mongoDB: " + error)
            return error
          })
}

/**
 * Get the next id to be used in the database for a teacher
 * @returns the next id to be used
 */
module.exports.getCurrentIdDocente = () => {
    return users
        .find({type: 'D'}, {_id: 1})
        .sort({_id: -1}) // Sort descending
        .limit(1) // Only the maximum
        .then(resp => {
            // If there are no teachers in the database, start in 0
            if (resp.length === 0){
                return {_id: 0}
            }
            else{
                // Else return the maximum id +1
                return {_id: resp[0]._id+1}
            }
        })
        .catch(error => {
            console.log("Controller mongoDB: " + error)
            return error
        })
}

/**
 * Get the next id to be used in the database for a technician
 * @returns the next id to be used
 */

module.exports.getCurrentIdTecnico = () => {
    return users
        .find({type:'T'}, {_id: 1})
        .sort({_id: -1}) // Sort descending
        .limit(1) // Only the maximum
        .then(resp => {
            // If there are no technicians in the database, start in 0
            if (resp.length === 0) {
                return {_id: 0}
            } else {
                // Else return the maximum id +1
                return {_id: resp[0]._id + 1}
            }
        })
        .catch(error => {
            console.log("Controller mongoDB: " + error)
            return error
        })
}

/**
 * Add a student to the database
 * CREATE
 * @param {*} aluno - the student to be added
 * @returns The student added or an error
 */

module.exports.addAluno = aluno => {
    return users
        .create(aluno)
        .then(resp => {
            // Algolia.add(resp)
            return resp
        })
        .catch(error => {
            console.log("Controller mongoDB: " + error)
            return error
        })
}

/**
 * Add a teacher to the database
 * CREATE
 * @param {*} docente - the teacher to be added
 * @returns The teacher added or an error
 */

module.exports.addDocente = docente => {
    return users
        .create(docente)
        .then(resp => {
            // Algolia.add(resp)
            return resp
        })
        .catch(error => {
            console.log("Controller mongoDB: " + error)
            return error
        })
}

/**
 * Add a technician to the database
 * CREATE
 * @param {*} tecnico - the technician to be added
 * @returns The technician added or an error
 */

module.exports.addTecnico = tecnico => {
    return users
        .create(tecnico)
        .then(resp => {
            // Algolia.add(resp)
            return resp
        })
        .catch(error => {
            console.log("Controller mongoDB: " + error)
            return error
        })
}

/**
 * Retrieve a user from the BD
 */

module.exports.getUser = id => {
    return users.findOne({ _id: id })
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

/**
 * Check if a list of students exists in the BD
 */

module.exports.checkAlunosList = async numsMecanograficos => {
    let resultado = await users.collection.find({
        numMecanografico: {$in: numsMecanograficos},
        type: {$in: ['A','Aluno']}
    }).toArray()

    return {result: resultado.length == numsMecanograficos.length}
}

/**
 * Update a student in the database
 * UPDATE
 * @param {*} aluno - the student to be updated
 * @param {*} id - the id of the student to be updated
 * @returns The student updated or an error
 */

module.exports.updateAluno = (aluno, id) => {
    return users
        .updateOne({_id: id, type: 'A'}, aluno)
        .then(resp => {
            // Algolia.update(resp)
            return resp
        })
        .catch(error => {
            console.log("Controller mongoDB: " + error)
            return error
        })
}

/**
 * Update a teacher in the database
 * UPDATE
 * @param {*} docente - the teacher to be updated
 * @param {*} id - the id of the teacher to be updated
 * @returns The teacher updated or an error
 */

module.exports.updateDocente = (docente, id) => {
    return users
        .updateOne({_id: id, type: 'D'}, docente)
        .then(resp => {
            // Algolia.update(resp)
            return resp
        })
        .catch(error => {
            console.log("Controller mongoDB: " + error)
            return error
        })
}

/**
 * Update a technician in the database
 * UPDATE
 * @param {*} tecnico - the technician to be updated
 * @param {*} id - the id of the technician to be updated
 * @returns The technician updated or an error
 */

module.exports.updateTecnico = (tecnico, id) => {
    return users
        .updateOne({_id: id, type: 'T'}, tecnico)
        .then(resp => {
            // Algolia.update(resp)
            return resp
        })
        .catch(error => {
            console.log("Controller mongoDB: " + error)
            return error
        })
}

/**
 * Remove a student from the database
 * DELETE
 * @param {*} id - the id of the student to be removed
 * @returns The student removed or an error
 */

module.exports.deleteAluno = id => {
    return users
        .deleteOne({_id: id, type: 'A'})
        .then(resp => {
            // Algolia.remove(id)
            return resp
        })
        .catch(error => {
            console.log("Controller mongoDB: " + error)
            return error
        })
}

/**
 * Remove a teacher from the database
 * DELETE
 * @param {*} id - the id of the teacher to be removed
 * @returns The teacher removed or an error
 */

module.exports.deleteDocente = id => {
    return users
        .deleteOne({_id: id, type: 'D'})
        .then(resp => {
            // Algolia.remove(id)
            return resp
        })
        .catch(error => {
            console.log("Controller mongoDB: " + error)
            return error
        })
}

/**
 * Remove a technician from the database
 * DELETE
 * @param {*} id - the id of the technician to be removed
 * @returns The technician removed or an error
 */

module.exports.deleteTecnico = id => {
    return users
        .deleteOne({_id: id, type: 'T'})
        .then(resp => {
            // Algolia.remove(id)
            return resp
        })
        .catch(error => {
            console.log("Controller mongoDB: " + error)
            return error
        })
}

/**
 * Delete a user from the database
 */

module.exports.deleteUser = id => {
    return users.deleteOne({ _id: id })
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

module.exports.updateUserPassword = (id, pwd) => {
    return users.updateOne({ _id: id }, {password: pwd})
        .then(resposta => {
            return resposta
        })
        .catch(erro => {
            return erro
        })
}

module.exports.changePassword = (email, newPassword) => {
    return users.findOne({ email: email })
        .then(response => {
            if (!response) {
                return { error: "Email not in use" }
            } else {
                response.setPassword(newPassword, (err, user) => {
                    if (err) {
                        console.log(err.message)
                        return err;
                    } else {
                        // Salve as alterações no utilizador
                        response.save()
                            .then(response => {
                                return response
                            })
                            .catch(err => {
                                console.log(err)
                                return err;
                            })
                    }
                });

            }
        })
        .catch(err => {
            return err;
        })

};