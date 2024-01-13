const axios = require('axios');

module.exports.gestaoUtilizadoresAccessPoint = process.env.GESTAO_USERS_AP || 'http://localhost:8001';
module.exports.gestaoUtilizadoresRoute = (route) => this.gestaoUtilizadoresAccessPoint + route

module.exports.login = (email, password) => {
    return axios.post(this.gestaoUtilizadoresRoute('/users/login'), { "email": email, "password": password })
        .then((result) => {
            let resp = result.data
            if (resp != null) {
                return resp
            } else {
                throw new Error('Error: InvalidUsername -> ' + username)
            }
        }).catch((err) => {
            throw err
        });
}

module.exports.register = (userData) => {
    return axios.post(this.gestaoUtilizadoresRoute(`/users/register`), userData)
        .then((result) => {
            let resp = result.data
            if (!resp.result) {
                return resp
            } else {
                throw new Error('Error: InvalidUsername -> ' + userData.username)
            }
        }).catch((err) => {
            throw err
        });
}

module.exports.getUsers = () => {
    return axios.get(this.gestaoUtilizadoresRoute('/users'))
        .then((result) => {
            return result.data
        }).catch((err) => {
            throw err
        });
}

module.exports.verifyUser = (numMecanografico) => {
    return axios.get(this.gestaoUtilizadoresRoute(`/users/alunos/${numMecanografico}`))
        .then((result) => {
            return result.data
        }).catch((err) => {
            throw err
        });
}

module.exports.verifyAlunos = (numMecanograficos) => {
    return axios.post(this.gestaoUtilizadoresRoute('/users/alunos/verify'), numMecanograficos)
        .then((result) => {
            return result.data['result']
        }).catch((err) => {
            throw err
        });
}