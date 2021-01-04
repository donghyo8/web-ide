import React from 'react'
import DetectFile from './DetectFile';
import { FaFileAlt } from 'react-icons/fa';
import callAPI from '../_utils/apiCaller';

function Download({path, name, icon}) {
    function getToken(){
        const token = localStorage.getItem('token');
        return {
            auth_token : token
        }
    }
    function download()
    {
        try {
            let fileName = path.substring(7, path.length);
            callAPI(`download/${fileName}`,'GET',getToken(),null).then(res => {
                const {data} = res;
                if(data === 'Error file dose not exists'){
                    alert(data + ". 관리자 문의하세요.");
                }else{
                    const url = res.data.url
                    const link = document.createElement('a');
                    link.setAttribute("href", `${process.env.REACT_APP_API_URL}/${url}`);
                    link.setAttribute("download", ''); //! 안 됨 
                    link.setAttribute("target", '_blank');
                    link.style.display = 'none';
                    document.body.appendChild(link);
                    console.log(link)
                    link.click();
                    document.body.removeChild(link);
                }
            })
        } catch (error) {
            console.log(error);
            alert("파일 다운로드 실패합니다. 나중에 다시 시도하시기 바랍니다")            
        }
    }
    if(icon)
    {
        return (
            <button className = "btn_file" onClick = {download}>
                <FaFileAlt style = {{fontSize : '15px', position : 'relative', top : '3px'}}/>
            </button>
        )
    }else{
        return (
            <button className = "btn_file" onClick = {download}>
                <DetectFile fileName = {name} />
                {name}
            </button>
        )
    }
}

Download.propTypes = {

}

export default Download

