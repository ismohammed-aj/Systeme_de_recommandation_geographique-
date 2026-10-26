import axiosClient from './axiosClient'

const resourcePath = '/arrets'

export const getAll = () => axiosClient.get(resourcePath)

export const getById = (id) => axiosClient.get(`${resourcePath}/${id}`)

export const create = (data) => axiosClient.post(resourcePath, data)

export const createArret = (data) => create(data)

export const update = (id, data) =>
  axiosClient.put(`${resourcePath}/${id}`, data)

export const remove = (id) => axiosClient.delete(`${resourcePath}/${id}`)

const arretApi = { getAll, getById, create, createArret, update, remove }

export default arretApi
