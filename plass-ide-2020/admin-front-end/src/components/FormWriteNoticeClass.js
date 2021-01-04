import React, { Component } from 'react'
import CKEditor from 'ckeditor4-react';
import { AiOutlineCheck} from "react-icons/ai";
import { FaUpload} from 'react-icons/fa';
import { IoMdRemoveCircle, IoMdRemoveCircleOutline } from "react-icons/io";
import DetectFile from './DetectFile';
export default class FormWriteNoticeClass extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title : '',
            contents : '',
            file : [],
            week  : 1,
            id : ''
        }
    }
    handleSubmit = (event) =>{
        event.preventDefault();
        const { handleSubmitNotice } = this.props;
        if( !handleSubmitNotice )  return;
        handleSubmitNotice(this.state);
        this.setState({
            title : '',
            contents : '',
            file: [],
            week : 1,
        })
    }
    handleChangeText = (event) => {
        const {name , value } = event.target;
        if(name === 'file')
        {
            this.setState({
                file : [...this.state.file, event.target.files[0]]
            })
        }else{
            this.setState({ [name] : value })
        }
    }
    handleClickAddFile = (event) => {
        event.preventDefault();
        const textFile = document.createElement('input')
        textFile.setAttribute("type","file");
        textFile.setAttribute("name",'file');
        document.body.appendChild(textFile);
        textFile.click();
        textFile.onchange = this.handleChangeText;
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
    onEditorChange = (event) => {
        this.setState({
            contents : event.editor.getData()
        })
    }
    static getDerivedStateFromProps(nextProps, prevState)
    {  
        if (nextProps.itemNotice.id !== prevState.id){
            const {modify, itemNotice} = nextProps;
            if(modify) //공지사항 수정함
            {
                const { name, path } = itemNotice;
                const formatFile = [];
                if(Array.isArray(name)) //파일 여러 있는 경우에는
                {
                    for(let i = 0; i < name.length; i++)
                    {
                        formatFile.push({
                            name : name[i],
                            path : path[i]
                        })
                    }
                }else if (name !== null){ //파일 하나 있는 경우
                    formatFile.push({
                        name : name,
                        path : path
                    })
                }else{} //파일 없는 경우에는 
                return ({...itemNotice,file : formatFile});
            }
            else{  //공지사항 등록함
                return null;
            }
        }
        else return null;
    }
    componentDidUpdate(prevProps, prevState){
        if( prevProps.itemNotice !== this.props.itemNotice ){
            this.setState(prevProps.itemNotice);
        }
    }
    render() {
        const { modify, handleHidden } = this.props;
        const { title, contents, week, file} = this.state;
        const items = [];
        for (let i = 1; i < 16; i++) {
            items.push(<option key = {i} value ={i}>{i}</option>)
        }
        return (
        <div className = "form_write">
            <form action="" method="POST" onSubmit = {this.handleSubmit}>
                <legend>공지사항 작성</legend>
                <div className="form-group">
                    <div className = "form_title">
                        <b>&nbsp;제목 : </b>
                        <input type="text"  name = "title" value = {title} onChange = {this.handleChangeText}/>
                        <b>&nbsp;주차 : </b>
                        <select name = "week"  value = {week} onChange = {this.handleChangeText}>
                            {items}
                        </select>
                    </div>
                    <div className = "form_content">
                        <b>&nbsp;내용 :</b><br/>
                        <CKEditor
                            onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
                            data= {contents}
                            onChange = {this.onEditorChange}
                        />
                    <div className = "form_listfiles">
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
                            <button className = "btn_primary" onClick = {(event) =>{ event.preventDefault(); this.handleDeleteFile('deleteAll')}}><IoMdRemoveCircle/> 전체 삭제</button>               
                        </div>
                    </div>
                    <div className = "u-text-center u-mr-top-small">
                        {
                            modify ? <button type="submit" className="btn_primary">저장</button> : 
                            <button type="submit" className="btn_primary">등록</button>
                        }
                        &nbsp;<button type="submit" className="btn_primary" onClick = {handleHidden}>취소</button>
                    </div>
                    </div>
                </div>  
            </form>
        </div>
        )
    }
}
