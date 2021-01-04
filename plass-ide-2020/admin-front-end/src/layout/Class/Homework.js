import React from 'react';
import {
    Link
    } from "react-router-dom";
import moment from 'moment'; 
import Download from '../../components/Download';
function CheckLimitDate({update, limitdate}){
    let today = moment(new Date()).format('YYYY-MM-DD');
    const strongStyles = {
        fontSize : '13px',
        paddingLeft : '10px'
    }
    if(today >= update && today <= limitdate) //! 수정 필요함
    {
        return (
            <strong
            style = {{...strongStyles, color:'blue'}}
            >[진행중...]</strong>
        )
    }else if(today < update){
        return(
            <strong
            style = {{...strongStyles, color:'orange'}}
            >[예정...]</strong>
        )
    }else{
        return(
            <strong
            style = {{...strongStyles, color:'red'}}
            >[마감...]</strong>
        )
    }
}
export default function Homework({course, homework, file}) {
    return(
        <div className = "homework border-1">
            <div className = "homework_title border-btm">
                <div className = "title ">
                    <Link to = "#">
                        <b>[일반과제] {homework.title}</b>
                        <CheckLimitDate update = {homework.updated} limitdate = {homework.limitdate} />
                    </Link>
                    <div className = "tasks">
                        <ul className = "ul-nolist-inline">
                            <li><Link to = {`homeworkmodify?p=${course}&id=${homework.id}`} className = "btn btn_classtask">수정</Link></li>
                            <li><Link to = {`homeworkevaluation?p=${course}&id=${homework.id}`}  className = "btn btn_classtask">평가</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className = "homework_file border-btm">
                <b className = "u-float-right">{moment(homework.created).format("YYYY-MM-DD")}</b>
                <span className = "u-float-right">작성일 : </span>
                <span>제출기간 : </span>
                <b>{moment(homework.updated).format("YYYY-MM-DD")} ~ {moment(homework.limitdate).format("YYYY-MM-DD")}</b>
            </div>
            <div className = "homework_content border-btm" dangerouslySetInnerHTML = {{__html : homework.description}}>
            </div>
            <div className = "homework_file">
                <b>첨부 파일 : </b>
                    {
                        file.name ?
                        !Array.isArray(file.name) ?
                            <Download path = {file.path}  name = {file.name}/>
                        : 
                        file.name.map((item, index) => (
                            <Download path = {file.path[index]}  name = {item}/>
                        ))
                        : ""
                    }
            </div>
        </div>
    )
}
