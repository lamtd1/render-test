import axios from 'axios'
// Sửa lại link để kết nối BE
const baseUrl = '/api/notes'

const getAll = () => {
    const request =  axios.get(baseUrl)
    return request.then(resp => resp.data)
}

const create = newObj => {
    const request = axios.post(baseUrl, newObj)
    return request.then(resp => resp.data)
}

const update = (id, newObj) => {
    const request = axios.put(`${baseUrl}/${id}`, newObj)
    return request.then(resp => resp.data)
}

export default { getAll, create, update }