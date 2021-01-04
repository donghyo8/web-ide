import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { GoFilePdf } from "react-icons/go";
import callAPI from '../../_utils/apiCaller';
const queryString = require('query-string');
export default class ClassViewItem extends Component {


    async componentWillMount(){
        const course = queryString.parse(this.props.location.search).p;
        await callAPI(`lectures/57/notice`,'GET',this.getToken(), null).then(res => {
            this.setState({
                listNotice : res.data.data
            })
        })
    }

    render() {
        return (
            <div className = "form_itemview">
                <div className = "form_itemview-title">
                    <b></b>
                    <div className = "tasks">
                        <Link className = "btn-primary" to = "#"><i className = "far fa-edit">&nbsp;</i>수정</Link>&nbsp;
                        <Link className = "btn-primary" to = "#"><i className = "fas fa-eraser">&nbsp;</i>삭제</Link>
                    </div>
                </div>

                <div className = "form_itemview-information">{
                    this.state.listNotice.map((item) => (
                        <b >작성자 : {item.writer} &nbsp;&nbsp;&nbsp; </b>,
                        <b>작성일 : {item.created}&nbsp;&nbsp;&nbsp; </b>,
                        <b>조회수 : {item.viewcount} </b>,
                        <div className = "form_itemview-content">
                            {item.contents}
                        </div>
                        ))
                    }
                </div>
                
                <div className = "form_itemview-file">
                        <b>첨부 파일 : </b> <Link to = "#" >syllabus.pdf<GoFilePdf/></Link>
                </div>
            </div>
        )
    }
}
