import React, { useState, useEffect } from 'react';
import callAPI from '../../_utils/apiCaller';

function checkDate(data)
{
    if(data)
    {
        let filteredWorks = [];
        let today = new Date();
        for(let i = 0; i < data.length; i++)
        {
            let finishDate = data[i].limitdate.substring(0,10);
            finishDate = new Date(finishDate);
            const diffTime = Math.abs(finishDate.getTime() - today.getTime());
            let diffDays = Math.ceil(diffTime / (1000 * 3600 * 24)); 
            if(diffDays < 5)
            {
                data[i]["date"] = diffDays + 1;
                filteredWorks.push(data[i])
            }
        }
        return filteredWorks;
    }
}
function FutureWorks(props) {
    const [listWork, setListWork] = useState([]);
    useEffect(() => {
        async function fetchDate() {
            try {
                const getToken = () => {
                    const token = localStorage.getItem('token');
                    return {
                        auth_token : token
                    }
                }
                const result = await callAPI(
                    `homework/listwork`,'GET', getToken(),null
                )
                let filteredWorks = await checkDate(result.data.data);
                setListWork(filteredWorks);
            } catch (error) {
                console.log(error.message)
            }
        }
        fetchDate();
    }, []);
    return (
        <div className = "feture_works">
            <h2>
                내 할 일 보기
            </h2>
            <ul className = "ul-nolist-inline">
                {
                    listWork.length !== 0 ?
                        listWork.map((item, index) => 
                            <li key ={index}> 
                                <p><span>과제</span> - {item.title} <b className = "u-float-right">D-{item.date}</b></p> 
                                <p style = {{fontSize : "10px"}}>{item.lecture_name}</p> 
                            </li>
                        )
                    : ""
                }
            </ul>
        </div>
    )
}

FutureWorks.propTypes = {

}

export default FutureWorks

