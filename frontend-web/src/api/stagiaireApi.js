import axiosClient from './axiosClient'

const resourcePath = '/stagiaires'

export const getAll = () => axiosClient.get(resourcePath)

export const getById = (id) => axiosClient.get(`${resourcePath}/${id}`)

export const create = (data) => axiosClient.post(resourcePath, data)

export const update = (id, data) => axiosClient.put(`${resourcePath}/${id}`, data)

export const remove = (id) => axiosClient.delete(`${resourcePath}/${id}`)

export const getSharedPositions = () =>
  axiosClient.get('/admin/stagiaires/positions')

export const shareMyPosition = ({ latitude, longitude }) =>
  axiosClient.post(`${resourcePath}/me/position`, {
    latitude,
    longitude,
  })

const stagiaireApi = {
  getAll,
  getById,
  create,
  update,
  remove,
  getSharedPositions,
  shareMyPosition,
}

export default stagiaireApi
