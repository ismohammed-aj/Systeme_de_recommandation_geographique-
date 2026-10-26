import axiosClient from './axiosClient'

const resourcePath = '/lignes'

export const getAll = () => axiosClient.get(resourcePath)

export const getById = (id) => axiosClient.get(`${resourcePath}/${id}`)

export const getArretsByLigneId = (idLigne) =>
  axiosClient.get(`${resourcePath}/${idLigne}/arrets`)

export const getAllWithArrets = () =>
  axiosClient.get(`${resourcePath}/with-arrets`)

export const create = (data) => axiosClient.post(resourcePath, data)

export const update = (id, data) =>
  axiosClient.put(`${resourcePath}/${id}`, data)

export const remove = (id) => axiosClient.delete(`${resourcePath}/${id}`)

const ligneApi = {
  getAll,
  getById,
  getArretsByLigneId,
  getAllWithArrets,
  create,
  update,
  remove,
}

export default ligneApi
