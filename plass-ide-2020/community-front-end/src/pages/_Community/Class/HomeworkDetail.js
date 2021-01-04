import React, { Component } from 'react'
import { MdLibraryBooks } from 'react-icons/md'
import callAPI from '../../../_utils/apiCaller';
import qs from 'query-string';
import { Link } from 'react-router-dom';
import moment from 'moment';
import DetectFile from '../../../components/DetectFile';
import Download from '../../../components/Download';
export default class HomeworkDetail extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = ({
            detailsHomework : []
        })
    }
    async componentDidMount(){
        const token = localStorage.getItem('token');
        const {p, id} = qs.parse(this.props.location.search);
        await callAPI(`lectures/${p}/homework/${id}`,'GET',{auth_token : token}, null).then(res => {
            this.setState({
                detailsHomework : res.data.data
            })
        })
    }   
    render() {
        const { detailsHomework } = this.state;
        const {name, path} = detailsHomework;
        return (
        <div className = "class_homeworks_details">   
			<h2><i className = "icon"><MdLibraryBooks /></i>과제 뷰</h2>
                    {
                        detailsHomework.length !== 0 && 
                        <div className = "form_itemview u-mr-top-small">
                            <div className = "form_itemview-title">
                            </div>
                                <div className = "form_itemview-information">
                                    <b>제목 : {detailsHomework.title} &nbsp;&nbsp;&nbsp; </b>
                                    <b>작성일 : {moment(detailsHomework.created).format("YYYY-MM-DD")}&nbsp;&nbsp;&nbsp; </b>
                                    <b>주차 : {detailsHomework.week}&nbsp;&nbsp;&nbsp; </b>
                                    <div className = "form_itemview-content" dangerouslySetInnerHTML={{__html: detailsHomework.description}}/>
                            </div>
                            <div className = "form_itemview-file">
                                <b>첨부 파일 : </b>
                                {
                                    name ?
                                    !Array.isArray(name) ?
                                    <Download path = {path} name = {name} />
                                    : 
                                    name.map((item, index) => (
                                        <Download  key = {index} path = {path[index]} name = {item} />
                                    ))
                                    : ""
                                }
                            </div>
                        </div>
                    }
            <p></p>
        </div>
        )
    }
}
