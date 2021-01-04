import { userConstants as Types } from '../_constants';
import callAPI from '../_utils/apiCaller';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();
// import { history } from '../_heapers/history';
export const userActions = {
    Login,
    Logout,
    Register,
    getUser,
}
function Register(user){
    const actRegisteRequest = () => {return {type : Types.REGISTER_REQUEST}}
    return (dispatch) => {
        return callAPI('users/join','POST',null,user).then(res => {
            let msg = res.data.msg; 
            alert(msg)
            if(msg === '회원가입에 성공하였습니다.'){
                dispatch(actRegisteRequest());
            }
        })
    }
}
function Login(userid, password){
    const actLoginRequest = () => {return {type : Types.LOGIN_REQUEST}}
    var data = {
        userid : userid,
        password : password
    }
    return (dispatch) => {
        return callAPI('users/login','POST',null, data).then(res => {
            var resResult = res;
        
            if (resResult.data === '아이디 또는 비밀번호를 확인해주세요!') {
                alert(resResult.data);
            } else {
                //로그인 성공인 경우에는
                localStorage.setItem('token', JSON.stringify(res.data.jwt));
                localStorage.setItem('user', JSON.stringify(res.data.user[0]));
                dispatch(actLoginRequest());
            }
        }).catch(error=> {
            alert("서버오류입니다. 잠시 후 다시 시도해주세요.");
            console.warn(error);
        })
    }
}
function getUser(){
    const data =  JSON.parse(localStorage.getItem('user'));
    return {type: Types.GET_USER, data};
}

function Logout(){
    localStorage.removeItem("mytime");
    return {type: Types.LOG_OUT};
}