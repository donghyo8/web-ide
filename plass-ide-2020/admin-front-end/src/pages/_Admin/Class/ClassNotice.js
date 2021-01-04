import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { MdSpeakerNotes, MdLibraryBooks} from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import FormWriteNoticeClass from '../../../components/FormWriteNoticeClass';
import callAPI from '../../../_utils/apiCaller';
import moment  from 'moment';
import qs from 'query-string';
import Download from '../../../components/Download';
import Search from '../../../components/Search';
class ClassNotice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listNotice : [],
            listHomework : [],
            isDisplayWriteNotice : false,
            isDisplayViewNotice : false,
            isDisplayViewHomework: false,
            clickViewItem : {},

            modify : false,
        }
    }
    getToken = () =>{
        const token = localStorage.getItem('token');
        return {
            auth_token : token
        }
    }
    componentDidUpdate(prevProps){
        if (prevProps.classId !== this.props.classId) {
            const { classId } =  this.props
            callAPI(`lectures/${classId}/notice`, 'GET', this.getToken(),null).then(res => {
                this.setState({
                    listNotice : res.data.data
                })
                console.log(res.data.data)
            })
            callAPI(`lectures/${classId}/homework`, 'GET', this.getToken(),null).then(res => {
                this.setState({
                    listHomework : res.data.data
                })
            })
        }
    }
    componentDidMount()
	{
        window.addEventListener("keydown", (event) => {
            if(event.keyCode === 13)
            {
                if(this.isEnterKeyNotice)
                {
                    this.handleSearchClick("searchNotice");
                }else if(this.isEnterKeyHomework)
                {
                    this.handleSearchClick("searchHomework");
                }
                
            }
        })
        const { classId } =  this.props
        callAPI(`lectures/${classId}/notice`, 'GET', this.getToken(),null).then(res => {
            this.setState({
                listNotice : res.data.data
            })
        })
        callAPI(`lectures/${classId}/homework`, 'GET', this.getToken(),null).then(res => {
            this.setState({
                listHomework : res.data.data
            })
        })
	}
    handleWriteNotice = (event) => {   
        event.preventDefault();
        this.setState({
            modify : false,
            isDisplayWriteNotice : !this.state.isDisplayWriteNotice
        })
    }
    detailsNotice = (notice) => {
        let {isDisplayViewNotice, clickViewItem, isDisplayWriteNotice} = this.state;
        if(isDisplayWriteNotice)
        {
            this.setState({
                clickViewItem: notice
            })
        }else{
            if(isDisplayViewNotice)
            {
                if(clickViewItem === notice)
                {
                    this.setState({
                        isDisplayViewNotice : !isDisplayViewNotice,
                    })
                }else{
                    this.setState({
                        clickViewItem: notice
                    })
                }
            }else{
                this.setState({
                    isDisplayViewNotice : !this.state.isDisplayViewNotice,
                    clickViewItem : notice
                })
            }
        }
    }
    // 공지사항 작성 및 수정 이벤트 핸들러
    handleSubmitNotice= (formValues) => { 
        const {p} = qs.parse(this.props.location.search);
        const {title, contents, week, file} = formValues;
        let data = new FormData();
        let noticeData = {
            title : title,
            contents : contents,
            week : week,
        }
        if(!this.state.modify){  //공지사항 등록
            for(let i = 0; i < file.length; i++)
            {
                data.append('file',file[i])
            }
            data.append('notice', JSON.stringify(noticeData));
            callAPI(`lectures/${p}/notice`,'POST', {...this.getToken(),...{'Content-Type' : 'multipart/form-data'}},
                data).then(res => {
                const {message, data} = res.data;
                if(message === '공지 생성에 성공했습니다.')
                {
                    alert(message);
                    this.setState({
                        listNotice : this.state.listNotice.concat(data),
                        isDisplayWriteNotice : !this.state.isDisplayWriteNotice
                    })
                }else{
                    alert(message)
                }
            })
        }else{ //공지사항 수정
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
            noticeData['olderFiles'] = olderFiles;
            data.append('notice', JSON.stringify(noticeData));
            callAPI(`lectures/${p}/notice/${formValues.id}`,'PUT', {...this.getToken(),...{'Content-Type' : 'multipart/form-data'}},
                data).then(res => {
                let { data , message} = res.data;
                let {listNotice} = this.state;
                for(let i = 0; i < listNotice.length; i++)
                {
                    if(listNotice[i].id === data.id)
                    {
                        listNotice[i] = data;
                        break;
                    }
                }
                if(message === '공지사항을 수정하였습니다.')
                {
                    alert(message);
                    this.setState({
                        listNotice : listNotice,
                        isDisplayWriteNotice : !this.state.isDisplayWriteNotice
                    })
                }else{
                    alert(message)
                }
            })
        }
    }
    //공지사항 수정 이벤트 핸들러
    handleUpdate = (item) => {
        const { isDisplayViewNotice, isDisplayWriteNotice } = this.state;
        if(isDisplayWriteNotice)
        {
            console.log("continue modify",item)
            this.setState({
                clickViewItem : item,
                modify : true
            })
        }else{
            this.setState({
                isDisplayViewNotice : !isDisplayViewNotice,
                isDisplayWriteNotice : !isDisplayWriteNotice,
                clickViewItem : item,
                modify : true
            })
        }
    }
    //공지사항 삭제 이벤트 핸들러
    handleRemove = (noticeId) => {
        const {p} = qs.parse(this.props.location.search);
        callAPI(`lectures/${p}/notice/${noticeId}`,'DELETE', this.getToken(),null).then(res => {
            alert(res.data.message)
            const filtered = this.state.listNotice.filter(element => element.id !== noticeId);
            this.setState({
                listNotice : filtered,
                isDisplayViewNotice : !this.state.isDisplayViewNotice
            })
        })
    }
    handleFiltersChange = (newFilters) =>
    {
        const {option, text, method } = newFilters;
        if(method === 'search-notice')
        {
            switch (option) {
                case "제목":
                    if(text){
                        const filtered = this.state.listNotice.filter(element => element.title.includes(text))
                        if(filtered.length !== 0){
                            this.setState({
                                listNotice : filtered
                            })
                        }else{
                            window.location.reload();
                        }
                    }else{
                        window.location.reload();
                    }
                    break;    
                default:
                    if(text){
                        const filtered = this.state.listNotice.find(element => element.writer === (text))
                        if(filtered.length !== 0){
                            this.setState({
                                listNotice : filtered
                            })
                        }else{
                            window.location.reload();
                        }
                    }else{
                        window.location.reload();
                    }
                    break;
            }
        }
        else if(method === 'search-homework')
        {
            switch (option) {
                case "제목":
                    if(text){
                        const filtered = this.state.listHomework.filter(element => element.title.includes(text))
                        if(filtered.length !== 0){
                            this.setState({
                                listHomework : filtered
                            })
                        }else{
                            window.location.reload();
                        }
                    }else{
                        window.location.reload();
                    }
                    break;   
                default: 
                    break;
            }
        }else{
            alert("Can't search with this method")
        }
    }
    //Homework 관리 작업
    render() {
        const { listNotice, isDisplayViewNotice, isDisplayWriteNotice, listHomework, clickViewItem} = this.state;   
        return (
            <>
            <div className  = "class_board">
                <h2><i className = "icon"> <MdSpeakerNotes /></i>공지사항</h2>
                    <div className = "headding u-mr-bottom-small">
                        <Search 
                            onSubmit = {this.handleFiltersChange}
                            method = "search-notice"
                            option = {
                                [ '제목', '작성자']
                            }
                        />
                        <Link className = "btn_write u-mr-bottom-small" to = "#" onClick = {(event)=> this.handleWriteNotice(event)}><i className = "icon"><FaEdit/></i>글쓰기</Link>
                    </div>
                    <div  className = "board_content u-mr-bottom-small">
                    {
                    listNotice.length !== 0 ?
                        <table className="table table-contribution" border = "1">
                            <thead>
                                <tr>
                                    <th width = "5%">번호</th>
                                    <th width = "35%">제목</th>
                                    <th width = "10%">주차</th>
                                    <th width = "10%">파일</th>
                                    <th width = "10%">작성자</th>
                                    <th width = "10%">작성일</th>
                                </tr>
                            </thead>
                            <tbody> 
                            {
                                listNotice.slice(0).reverse().map((item, index) => {
                                    return (
                                        <tr key = {index}>
                                            <td>{this.state.listNotice.length - index}</td>
                                            <td 
                                            style = {{cursor : 'pointer'}}
                                            onClick = {() => this.detailsNotice(item)}>{item.title}</td>
                                            <td>{item.week}</td>
                                            <td>
                                                { 
                                                    item.name ?
                                                    !Array.isArray(item.name) ?
                                                        <Download path = {item.path} name = {item.name} icon = "true"/>
                                                    :
                                                    item.name.map((file, idx) => (
                                                        <Download key = {idx} path = {item.path[idx]} name = {file} icon = "true" />
                                                    ))
                                                    : ''
                                                } 
                                            </td>
                                            <td>{item.writer}</td>
                                            <td>{moment(item.created).format("YYYY-MM-DD")}</td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                        :
                        <h2 className = "u-text-center">현재 공지사항이 없습니다.</h2>
                    }
                    {
                        isDisplayViewNotice && 
                        <div className = "form_itemview u-mr-top-small">
                                <div className = "tasks">
                                    <button className = "btn_task" onClick = {() => this.handleUpdate(clickViewItem)}><i className = "far fa-edit">&nbsp;</i>수정</button>&nbsp;
                                    <button className = "btn_task" onClick = {() => this.handleRemove(clickViewItem.id)}><i className = "fas fa-eraser">&nbsp;</i>삭제</button>&nbsp;
                                    <button className = "btn_task" onClick = {() =>
                                        this.setState({isDisplayViewNotice : !isDisplayViewNotice})
                                    }>
                                    <i className = "far fa-times-circle">&nbsp;</i>닫기</button>
                                </div>
                                <div className = "form_itemview-information">
                                    <b>제목 : {clickViewItem.title} &nbsp;&nbsp;&nbsp; </b>
                                    <b>작성일 : {moment(clickViewItem.created).format("YYYY-MM-DD")}&nbsp;&nbsp;&nbsp; </b>
                                    <div className = "form_itemview-content" dangerouslySetInnerHTML={{__html: clickViewItem.contents}}/>
                                </div>
                                <div className = "form_itemview-file">
                                    <b>첨부 파일 : </b>
                                    {
                                        clickViewItem.name ?
                                        !Array.isArray(clickViewItem.name) ?
                                            <Download path = {clickViewItem.path} name = {clickViewItem.name} />
                                            : 
                                        clickViewItem.name.map((item, idx) => (
                                            <Download key = {idx} path = {clickViewItem.path[idx]} name = {item} />
                                            ))
                                        : ""
                                    }
                                </div>
                        </div>
                    }
                    </div>
                    <div className = "board_content-view u-mr-bottom-small"  >
                        {
                            isDisplayWriteNotice &&
                                <FormWriteNoticeClass
                                    handleSubmitNotice = {this.handleSubmitNotice}
                                    modify = {this.state.modify}
                                    itemNotice = {this.state.clickViewItem}
                                    handleHidden = {this.handleWriteNotice}
                                />
                        }
                    </div>
            </div>
            <div className  = "class_board u-mr-top-big">
            <h2><i className = "icon"> <MdLibraryBooks /></i>과제 관리</h2>
                <div className = "headding u-mr-bottom-small">
                    <Search 
                            onSubmit = {this.handleFiltersChange}
                            method = "search-homework"
                            option = {
                                ['제목']
                            }
                        />
                </div>
                <div  className = "board_content u-mr-bottom-small">
                {
                listHomework.length !== 0 ?
                    <table className="table table-contribution" border = "1">
                        <thead>
                            <tr>
                                <th width = "5%">번호</th>
                                <th width = "35%">제목</th>
                                <th width = "10%">주차</th>
                                <th width = "10%">파일</th>
                                <th width = "10%">작성일</th>
                                <th width = "10%">제출기한</th>
                            </tr>
                        </thead>
                        <tbody> 
                            {
                                listHomework.slice(0).reverse().map((item, index) => (
                                    <tr key = {index}>
                                        <td>{listHomework.length - index}</td>
                                        <td>{item.title}</td>
                                        <td>{item.week}</td>
                                        <td>
                                            { 
                                                item.name ?
                                                !Array.isArray(item.name) ?
                                                    <Download path = {item.path} name = {item.name} icon = "true"/>
                                                :
                                                item.name.map((file, idx) => (
                                                    <Download key = {idx} path = {item.path[idx]} name = {file} icon = "true" />
                                                ))
                                                : ''
                                            } 
                                        </td>
                                        <td>{moment(item.updated).format("YYYY-MM-DD")}</td>
                                        <td>{moment(item.limitdate).format("YYYY-MM-DD")}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                :
                <h2 className = "u-text-center">현재 과제가 없습니다.</h2>
                }
            </div>
        </div>
        </>
        )
    }
}
export default ClassNotice;