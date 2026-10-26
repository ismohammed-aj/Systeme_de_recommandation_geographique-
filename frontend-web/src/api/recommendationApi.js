import axiosClient from './axiosClient'

const resourcePath = '/recommendations'

export const getAll = () => axiosClient.get(resourcePath)

export const getById = (id) => axiosClient.get(`${resourcePath}/${id}`)

export const create = (data) => axiosClient.post(resourcePath, data)

export const update = (id, data) =>
  axiosClient.put(`${resourcePath}/${id}`, data)

export const remove = (id) => axiosClient.delete(`${resourcePath}/${id}`)

export const getBestLineForStagiaire = (idStagiaire) =>
  axiosClient.get(`${resourcePath}/best-line/${idStagiaire}`)

export const getBestLineByPosition = (latitude, longitude) =>
  axiosClient.post(`${resourcePath}/best-line/by-position`, {
    latitude,
    longitude,
  })

const recommendationApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  getBestLineForStagiaire,
  getBestLineByPosition,
}

export default recommendationApi
