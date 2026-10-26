import axiosClient from './axiosClient'

export const login = (email, motDePasse) =>
  axiosClient.post('/auth/login', {
    email,
    motDePasse,
  })

export const register = (data) =>
  axiosClient.post('/auth/register', {
    nom: data.nom,
    prenom: data.prenom,
    email: data.email,
    motDePasse: data.motDePasse,
  })

const authApi = { login, register }

export default authApi
