import React, { Component } from 'react';
import { FaEdit } from "react-icons/fa";
import { MdSpeakerNotes } from "react-icons/md";
import { Link } from 'react-router-dom';
import { TiArrowUnsorted} from "react-icons/ti";
import callAPI from '../../../_utils/apiCaller';
import { GoFilePdf } from 'react-icons/go';
import { IoIosSave } from 'react-icons/io';
const queryString = require('query-string');
class Evaluation extends Component {
    constructor(props){
        super(props);
        this.state = {
            display : false,
            listEvaluation : [],
            viewEvaluation : {},
            score : '',
        }
    }
    getToken = () => {
        const token = localStorage.getItem('token');
        return {
            auth_token : token
        }
    }
    handleView = (userid) => {
        const filtered = this.state.listEvaluation.filter(element => element.user_id === userid)
        this.setState({
            viewEvaluation : filtered[0],
            display: !this.state.display
        })
    }
    handleClicKSave = () =>{
        const hwId = queryString.parse(this.props.location.search).id;
        callAPI(`homework/${hwId}/reports`,'PUT',this.getToken(),{
            data  : this.state.listEvaluation
        }).then(res => {
            alert(res.data.message)
            this.setState({
                display : false
            })
        })
    }
    componentDidMount() {
        const hwId = queryString.parse(this.props.location.search).id;
        callAPI(`homework/${hwId}/reports/submit`,'GET',this.getToken(),null).then(res => {
            this.setState({
                listEvaluation : res.data.data
            })
        })
    }
    handleChange = (event) => {
        const {name , value } = event.target;
        this.setState({
            [name] : value
        })
    }
    handleUpdate(event) {
        event.preventDefault();
        const filtered = {...this.state.viewEvaluation};
        const maped = this.state.listEvaluation.map(element => 
                element.user_id !== filtered.user_id ? {...element} : {...element, score : parseInt(this.state.score, 10)}
            )
        this.setState({
            listEvaluation : maped,
            display : !this.state.display
        })
    }
    checkSubmit({saveProjectId})
    {
        return saveProjectId ? <strong style = {{color : '#2c3e50'}}>제출</strong> : <strong style = {{ color : 'orange'}}>미제출</strong>;
    }
    render(){ 
    return(            
        <div className = "class_evaluation">
            <h2><i className = "icon"> <MdSpeakerNotes /></i>과제 평가</h2>
            {/* <SelectSearch /> */}
                <button onClick = {() => this.handleClicKSave()}className = "btn_primary u-mr-bottom-small u-float-right" to = "#"><i className = "icon"><IoIosSave/></i>저장</button>
            <div className = "list_student">
                <table className ="table table-contribution" border = "1">
                    <thead>
                        <tr>
                            <th width = "5%">번호</th>
                            <th width = "10%">학번<Link to = "#"><i className = "icon"><TiArrowUnsorted/></i></Link></th>
                            <th width = "10%">학과</th>
                            <th width = "10%">이름</th>
                            <th width = "15%">보고서</th>
                            <th width = "10%">소스코드</th>
                            <th width = "10%">평가점수<Link to = "#"><i className = "icon"><TiArrowUnsorted/></i></Link></th>
                            <th width = "5%">제출 여부</th>
                            <th width = "5%">비고</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.listEvaluation.map((item,index) => {
                            return(
                                <tr key = {index}>
                                    <td>{index + 1}</td>
                                    <td>{item.userid}</td>
                                    <td>{item.major}</td>
                                    <td>{item.name}</td>
                                    <td>report.hwp</td>
                                    <td><Link to = "/" onClick = {(event) => {
                                            event.preventDefault();
                                            if(item.project_id)
                                                window.open(`http://210.94.194.81:3000?id=${item.user_id}&projectId=${item.project_id}`)
                                            else{
                                                alert("제출 코드가 없습니다")
                                            }
                                        }
                                    }>코드 보기</Link></td>
                                    <td>{item.score}</td>
                                    <td width = "10%">
                                    <this.checkSubmit saveProjectId = {item.project_id}/>
                                    </td>
                                    <td className = "td-tasks">
                                        <p className = "" onClick = {() => this.handleView(item.user_id) } style = {{cursor: 'pointer'}} >평가</p>
                                    </td>
                                </tr>
                            )
                        })
                        }
                    </tbody>
                </table>
            </div>
            {
                this.state.display &&
                <div className ="write_evaluation u-mr-top-small">
                    <h2><i className = "icon"><FaEdit/></i>평가 작성</h2>
                    <div className = "form_itemview u-mr-top-small">
                        <div className = "form_itemview-title">
                            <div className = "tasks u-mr-top-small">
                                <Link className = "btn-primary" to = "#" onClick = {(event) => this.handleUpdate(event)}><i className = "far fa-edit">&nbsp;</i>완료</Link>&nbsp;
                            </div>
                        </div>
                        <div className = "form_itemview-information">
                            <b>작성자 : {this.state.viewEvaluation.name} / {this.state.viewEvaluation.userid}</b>
                            <div className = "form_itemview-content">
                                평가점수 : 
                                <input name = "score" value = {this.state.viewEvaluation.score} onChange = {(event) => this.handleChange(event)} type = "text"/>
                            </div>  
                        </div>
                        <div className = "form_itemview-file">
                                <b>첨부 파일 : </b> <Link to = "#" >syllabus.pdf<GoFilePdf/></Link>
                        </div>
                    </div>
                </div>
            }
        </div>
        )
    };
}
export default Evaluation;
