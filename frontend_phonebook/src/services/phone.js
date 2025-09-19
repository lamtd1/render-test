import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/persons'

const getAll = async () => {
  const resp = await axios.get(baseUrl)
  return resp.data
}

const create = async (personObj) => {
  const resp = await axios.post(baseUrl, personObj)
  return resp.data
}

const remove = async (id) => {
  await axios.delete(`${baseUrl}/${String(id)}`)
  return id
}

const update = async ({ id, updatePerson }) => {
    console.log(id, updatePerson)
  const resp = await axios.put(`${baseUrl}/${String(id)}`, updatePerson)
  return resp.data
}

export default { getAll, create, remove, update }
