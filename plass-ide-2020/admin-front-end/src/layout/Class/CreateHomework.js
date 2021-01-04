import React, { Component } from 'react';
import CKEditor from 'ckeditor4-react';
import { IoIosCreate, IoMdRemoveCircle, IoMdRemoveCircleOutline } from "react-icons/io";
import callAPI from '../../_utils/apiCaller';
import DetectFile from '../../components/DetectFile';
import { FaUpload } from 'react-icons/fa';
import { AiOutlineCheck } from 'react-icons/ai';
const queryString = require('query-string');
var moment = require('moment');
class CreateHomework extends Component {
    constructor(props) {
        super(props);
        this.state = {
            display : true,
            title : "",
            startDate : "",
            finishDate: "",
            data : "",
            week : "",
            file : [],
            modify : false
        };
    }
    getToken = () =>{
        const token = localStorage.getItem('token');
        return {
            auth_token : token
        }
    }
    onEditorChange( event ) {
        this.setState( {
            data: event.editor.getData()
        } );
    }
    handleClickAddFile = (event) => {
        event.preventDefault();
        const textFile = document.createElement('input')
        textFile.setAttribute("type","file");
        textFile.setAttribute("name",'file');
        document.body.appendChild(textFile);
        textFile.click();
        textFile.onchange = this.handleChange;
    }
    handleChange = event => {
        const {name , value} = event.target;
        if(name === 'file')
        {
            this.setState({
                file : [...this.state.file, event.target.files[0]]
            })
        }else
        {
            this.setState({ [name] : value })
        }
    }
    handleRegisterClick = event => {
        event.preventDefault();
        const {title, finishDate, data, week, startDate, file} = this.state
        if(title && startDate && finishDate && data)
        {
            const {classId} = this.props
            const path = this.props.match.path;

            const formData = new FormData();
            
            const homeworkData = {
                title : title,
                updated : startDate,
                limitdate : finishDate,
                data : this.state.data,
                week : week,
            }
            if(startDate <= finishDate)
            {
                //해당하는 과제 수정
                if(path.includes("homeworkmodify")){
                    let olderFiles = [];
                    file.filter(element => 
                    {
                        if(element instanceof File)
                        {
                            data.append('file',element)
                        }else{
                            olderFiles.push(element)
                        }
                        return null;
                    });
                    homeworkData['olderFiles'] = olderFiles;
                    formData.append('hwdata',JSON.stringify(homeworkData))
                    let hwId = queryString.parse(this.props.location.search).id;
                    callAPI(`lectures/${classId}/homework/${hwId}`,'PUT', {...this.getToken(),...{'Content-Type' : 'multipart/form-data'}}, formData).then(res =>{
                        if(res.data.message === "과제를 수정하였습니다."){
                            alert(res.data.message)
                            this.props.history.push(`/main/class/homework?p=${classId}`);
                        }
                        else{
                                alert(res.data.message)
                            }
                    })
                }else{//해당하는 과제 등록
                    for(let i = 0; i < file.length; i ++ ){
                        formData.append('file',file[i]);
                    }
                    formData.append('hwdata', JSON.stringify(homeworkData));
                    callAPI(`lectures/${classId}/homework`,'POST', {...this.getToken(),...{'Content-Type' : 'multipart/form-data'}}, formData ).then(res =>{
                        let message = res.data.message
                        alert(message)
                        this.props.history.push(`/main/class/homework?p=${classId}`);
                    })
                }
            }else{
                alert("진행기간 확인해주세요");
            }
        }else{
            alert("빈 데이터 있습니다");
        }
        
    }
    componentDidMount = () => {
        const path = this.props.match.path;
        if(path.includes("homeworkmodify"))
        {
            let hwId = queryString.parse(this.props.location.search).id;
            const {classId} = this.props;
            callAPI(`lectures/${classId}/homework/${hwId}`, 'GET', this.getToken(), null).then(res => {
                const { data } = res.data
                if(!data){
                    alert(res.data.message)
                }else{
                    let covertFile = [];
                    if(Array.isArray(data.name)) //파일 여러 있는 경우에는
                    {
                        for(let i = 0; i < data.name.length; i++)
                        {   
                            covertFile.push({
                                name : data.name[i]
                            })
                        }
                    }else{
                        covertFile.push({ 
                            name : data.name
                        })
                    }
                    this.setState({
                        modify: true,
                        title : data.title,
                        startDate : moment(data.updated).format("YYYY-MM-DD"),
                        finishDate : moment(data.limitdate).format("YYYY-MM-DD"),
                        data : data.description,
                        week : data.week,
                        file : covertFile[0].name ? covertFile : ''
                    })
                }
            })
        }
    }
    handleDeleteFile = (fileName) => {
        if(fileName === 'deleteAll')
        {
            this.setState({file : ''});
            return;
        }
        const {file} = this.state;
        const fileFiltered = file.filter(element => element.name !== fileName);
        this.setState({file : fileFiltered})
    }
    render(){ 
    const items = [];
    for (let i = 1; i < 16; i++) {
        items.push(<option key = {`${i}`} value ={i}>{i}</option>)
    }
    const {title, startDate, finishDate, data, file} = this.state;
    return(
        <div className = "class_create-homework">
            <h2><i className = "icon"> <IoIosCreate /></i>과제 등록</h2>
            <div className = "form_write ">
                <div className = "homework_content">
                    <form method="POST" >
                        <legend>과제 작성</legend>
                        <div className="form-group">
                            <div className = "homework-title padding-5">
                                <b>제목 : </b>
                                <input className = "border-bottom" type="text" name = "title" 
                                    value = {title}
                                    onChange = {event => this.handleChange(event)}
                                /><br/>
                                <b> 진행 기간 : </b>
                                <input type="date" id="startdate" name = "startDate" 
                                    value = {startDate}
                                    onChange = {event => this.handleChange(event)}
                                />&nbsp;~&nbsp;
                                <input type="date" id="finishdate" name = "finishDate" 
                                    value = {finishDate}
                                    onChange = {event => this.handleChange(event)}
                                /> 
                                <b> 주차 : </b>
                                <select name = "week"  value = {this.state.week} onChange = {event => this.handleChange(event)}>
                                    {items}
                                </select>
                            </div>              
                            <div className = "homework-content form_content">
                                <b>내용 :</b>
                                <div className = "row">
                                    <div className="col span-1-of-2 cke-editor">
                                        <CKEditor
                                            onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
                                            data={data}
                                            onChange = {event => this.onEditorChange(event)}
                                        />
                                    </div>
                                </div>
                                <div className = "homework-file form_listfiles">
                                    <div className = "title">
                                        <i><AiOutlineCheck/></i>
                                        <strong>File</strong>
                                    </div>
                                    <div className = "update_listfiles padding-5">
                                        <ul className = "ul-nolist-inline">
                                            {
                                                file.length !== 0 ? 
                                                    file.map((item, index) => (
                                                        <li key = {index}>
                                                        <IoMdRemoveCircleOutline className = "deletefile" onClick = {() => this.handleDeleteFile(item.name)}/> 
                                                        <DetectFile fileName = {item.name}/>
                                                        {item.name}
                                                        </li>    
                                                    ))
                                                :
                                                ''
                                            }
                                        </ul>
                                    </div>
                                    <div className = "form_file">
                                        <button className = "btn_primary" onClick = {(event) => this.handleClickAddFile(event)}><FaUpload/> 파일 추가</button>&nbsp;       
                                        <button className = "btn_primary" onClick = {(event) => {event.preventDefault();this.handleDeleteFile("deleteAll")}}><IoMdRemoveCircle/> 전체 삭제</button>               
                                    </div>
                                </div>
                                <div className = "u-text-center u-mr-top-small">
                                {
                                    this.state.modify ? 
                                    <button type="submit" className="btn_primary" onClick = {(event) => this.handleRegisterClick(event)}>수정 등록</button> : 
                                    <button type="submit" className="btn_primary" onClick = {(event) => this.handleRegisterClick(event)}>과제 등록</button>
                                }
                                </div>
                            </div>  
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
    };
}
export default CreateHomework;
