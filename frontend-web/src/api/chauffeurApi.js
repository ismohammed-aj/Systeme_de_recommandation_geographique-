import axiosClient from './axiosClient'

const resourcePath = '/chauffeurs'

export const getAll = () => axiosClient.get(resourcePath)

export const getById = (id) => axiosClient.get(`${resourcePath}/${id}`)

export const create = (data) => axiosClient.post(resourcePath, data)

export const update = (id, data) =>
  axiosClient.put(`${resourcePath}/${id}`, data)

export const remove = (id) => axiosClient.delete(`${resourcePath}/${id}`)

const chauffeurApi = { getAll, getById, create, update, remove }

export default chauffeurApi
