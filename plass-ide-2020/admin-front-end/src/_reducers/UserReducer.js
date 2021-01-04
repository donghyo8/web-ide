import {userConstants as Types} from '../_constants' 
let user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? {user} : {};
const UserReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.REGISTER_REQUEST:
            return {
                registering : true,
            };
        case Types.LOGIN_REQUEST: ///User 정보들을 LocalStory에서 저장함
            return {
                isAccount : true
            };
        case Types.GET_USER:
            state = action.data;
            return {...state};
        default:
            return {...state};
    }
}
export default UserReducer;