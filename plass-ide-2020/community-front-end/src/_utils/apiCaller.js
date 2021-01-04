import axios from 'axios';
export default function callAPI(endpoint, method = 'GET', headers = null,body){
    return axios({
        method: method,
        headers: headers,
        url: `${process.env.REACT_APP_API_URL}/${endpoint}`,
        data: body
    }).catch(err => {
        console.log(err);
    })
}