import React from 'react';
import cookie from 'js-cookie';
import qs from 'querystring';

/**
 * IDE 보내는 부분
 * 
 * process.env.REACT_APP_IDE_ADDR + `?id=${user_id}&project={project_id}`
 */

function Main({history}) {
    const [auth, setAuth] = React.useState(true);
    React.useEffect(()=>{
        const query = qs.parse(window.location.search.slice(1));
        if(!query.id) {
            setAuth(false);
            return;
        }

        cookie.set("temp_id", query.id);
        if(query.projectId) history.push(`/ide/${query.projectId}`);
        else history.push(`/projects`);
    }, [])

    return (
        <>
            {auth && <div>로딩중...</div>}
            {!auth && <div>권한이 없습니다</div>}
        </>
    )
}

export default Main;