import axios from 'axios';
import cookie from 'js-cookie';
import { onLoading, offLoading } from './Loading';

class Http {
    constructor() {
        this.service = axios.create({
            baseURL: process.env.REACT_APP_API_SERVER,
        });
        
        this.service.interceptors.response.use((response) => response, this.errorHandler);
    }
    
    authorization(token) {
        this.service.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        this.service.defaults.headers.common['id'] = cookie.get("temp_id"); // TODO: REMOVE THIS
    }
    
    errorHandler = (error) => {
        if(error.response){
            switch(error.response.status) {
                case 401: document.location = "/login"; break;
                default: break;
            }
        }

        return Promise.reject(error);
    }

    httpCaller(method, {path, headers, params, payload, disableLoading}) {
        this.authorization(cookie.get('access_token'));

        return new Promise((resolve, reject) => {
            if(!disableLoading) onLoading();
            this.service.request(path, {
                method, headers, params, data: payload
            }).then(value=>{
                if(!disableLoading) offLoading();
                resolve(value);
            }).catch(error=>{
                if(!disableLoading) offLoading();
                reject(error);
            });
        });
    }

    /**
     * 
     * @param {Object} props -  http call을 위한 인자들
     * @param {String} props.path - http endpoint
     * @param {Object} props.headers - http 해더에 들어갈 object
     * @param {Object} props.params - http querystring으로 들어갈 내용
     * @param {Object} props.payload - http body * GET 사용 안함
     * @param {disableLoading} props.disableLoading - 로딩창을 없애는 프로퍼티
     * 
     * @returns {Promise} - http 통신후 오는 Promise객체
     */
    get(props) {
        return this.httpCaller("GET", props);
    }

    /**
     * 
     * @param {Object} props -  http call을 위한 인자들
     * @param {String} props.path - http endpoint
     * @param {Object} props.headers - http 해더에 들어갈 object
     * @param {Object} props.params - http querystring으로 들어갈 내용
     * @param {Object} props.payload - http body * GET 사용 안함
     * @param {disableLoading} props.disableLoading - 로딩창을 없애는 프로퍼티
     * 
     * @returns {Promise} - http 통신후 오는 Promise객체
     */
    post(props) {
        return this.httpCaller("POST", props);
    }

    /**
     * 
     * @param {Object} props -  http call을 위한 인자들
     * @param {String} props.path - http endpoint
     * @param {Object} props.headers - http 해더에 들어갈 object
     * @param {Object} props.params - http querystring으로 들어갈 내용
     * @param {Object} props.payload - http body * GET 사용 안함
     * @param {disableLoading} props.disableLoading - 로딩창을 없애는 프로퍼티
     * 
     * @returns {Promise} - http 통신후 오는 Promise객체
     */
    patch(props) {
        return this.httpCaller("PATCH", props);
    }

    /**
     * 
     * @param {Object} props -  http call을 위한 인자들
     * @param {String} props.path - http endpoint
     * @param {Object} props.headers - http 해더에 들어갈 object
     * @param {Object} props.params - http querystring으로 들어갈 내용
     * @param {Object} props.payload - http body * GET 사용 안함
     * @param {disableLoading} props.disableLoading - 로딩창을 없애는 프로퍼티
     * 
     * @returns {Promise} - http 통신후 오는 Promise객체
     */
    put(props) {
        return this.httpCaller("PUT", props);
    }

    /**
     * 
     * @param {Object} props -  http call을 위한 인자들
     * @param {String} props.path - http endpoint
     * @param {Object} props.headers - http 해더에 들어갈 object
     * @param {Object} props.params - http querystring으로 들어갈 내용
     * @param {Object} props.payload - http body * GET 사용 안함
     * @param {disableLoading} props.disableLoading - 로딩창을 없애는 프로퍼티
     * 
     * @returns {Promise} - http 통신후 오는 Promise객체
     */
    delete(props) {
        return this.httpCaller("DELETE", props);
    }
}


export default new Http();