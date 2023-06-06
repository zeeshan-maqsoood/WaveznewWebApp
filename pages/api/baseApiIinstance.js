import axios from 'axios'

// const WAVEZ_BASE_URL = 'https://wavez-dev.cf:3000/api/'
const WAVEZ_BASE_URL = 'http://localhost:3002/api/'

export const BaseApiInstance = () => {

    axios.interceptors.request.use((request) => {
            console.log("Axios Request : ", request)
        },
        function (error) {
            return Promise.reject(error)
        }
    )

    return axios.create({
        baseURL: WAVEZ_BASE_URL,
        headers: {
            accept: 'application/json'
        }
    })
}

export default BaseApiInstance
