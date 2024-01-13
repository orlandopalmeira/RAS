import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    email: string,
    type: string,
    username: string,
    numMecanografico: string
}

const isDocente = () => {
    if (Cookies.get('token')) {
        const cookieToken = Cookies.get('token') || ''
        const token = jwtDecode(cookieToken) as JwtPayload
        return token.type === 'Docente' || token.type === 'D'
    }
    return false
};

const isAluno = () => {
    if (Cookies.get('token')) {
        const cookieToken = Cookies.get('token') || ''
        const token = jwtDecode(cookieToken) as JwtPayload
        return token.type === 'Aluno' || token.type === 'A'
    }
    return false
};

const isTecnico = () => {
    if (Cookies.get('token')) {
        const cookieToken = Cookies.get('token') || ''
        const token = jwtDecode(cookieToken) as JwtPayload
        return token.type === 'Tecnico';
    }
    return false
};

const isAuthenticated = () => {
    return Cookies.get('token') ? true : false
}

const numMecanografico = () => {
    if(Cookies.get('token')){
        const cookieToken = Cookies.get('token') || '';
        const token = jwtDecode(cookieToken) as JwtPayload
        return token.numMecanografico
    }
    return ''
}

const logout = () => {
    Cookies.remove('token')
}

export {
    isDocente,
    isAluno,
    isTecnico,
    isAuthenticated,
    numMecanografico,
    logout,
}