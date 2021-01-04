import axios from 'axios';
axios.baseUrl = process.env.REACT_APP_API_URL;

/**
 * 
 * @param {String} endpoint 
 * @param {String} method 
 * @param {Object} headers 
 * @param {Object} body 
 */
// function getToken(){
//     const token = localStorage.getItem('token');
//     return {
//         auth_token : token
//     }
// }
export default function callAPI(endpoint, method = 'GET', headers = null, body){
    return axios({
        method: method,
        headers: headers,
        url: `${process.env.REACT_APP_API_URL}/${endpoint}`,
        data: body
    }).catch(err => {
        console.log(err);
    })
}