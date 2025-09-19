import axios from 'axios'
const baseUrl = 'http://localhost:5173/api/notes'

const getAll = () => {
    const request =  axios.get(baseUrl)
    const nonExisting = {
        id: 1000,
        content: 'This is not saved to server',
        important: true,
    }
    return request.then(resp => resp.data.concat(nonExisting))
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