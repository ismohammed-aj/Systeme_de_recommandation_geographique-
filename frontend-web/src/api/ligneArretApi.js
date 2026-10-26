import axiosClient from './axiosClient'

const resourcePath = '/ligne-arrets'

export const getAll = () => axiosClient.get(resourcePath)

export const getById = (id) => axiosClient.get(`${resourcePath}/${id}`)

export const create = (data) => axiosClient.post(resourcePath, data)

export const createLigneArret = (data) => create(data)

export const update = (id, data) =>
  axiosClient.put(`${resourcePath}/${id}`, data)

export const remove = (id) => axiosClient.delete(`${resourcePath}/${id}`)

export const getByLigneId = (idLigne) =>
  axiosClient.get(`${resourcePath}/ligne/${idLigne}`)

export const getLigneArretsByLigneId = (idLigne) => getByLigneId(idLigne)

const ligneArretApi = {
  getAll,
  getById,
  create,
  createLigneArret,
  update,
  remove,
  getByLigneId,
  getLigneArretsByLigneId,
}

export default ligneArretApi
