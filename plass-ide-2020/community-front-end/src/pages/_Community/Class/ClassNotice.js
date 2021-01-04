import React, { Component } from 'react'
import { MdSpeakerNotes, MdLibraryBooks} from "react-icons/md";
import { FaSearch, FaFileAlt } from "react-icons/fa";
import moment  from 'moment';
import callAPI from '../../../_utils/apiCaller';
import Search from '../../../components/Search';
import Download from '../../../components/Download';
class ClassNotice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listNotice : [],
            listHomework : [],
            isDisplayViewNotice : false,
            clickViewItem : {},
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
    detailsNotice = (notice) => {
        let {isDisplayViewNotice, clickViewItem} = this.state;
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
        const { listNotice, isDisplayViewNotice, listHomework, clickViewItem} = this.state;
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
                                    <button className = "btn_task" onClick = {() =>
                                        this.setState({isDisplayViewNotice : !this.state.isDisplayViewNotice})
                                    }>
                                    <i className = "far fa-times-circle">&nbsp;</i>단기</button>
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
            </div>
            <div className  = "class_board u-mr-top-big">
            <h2><i className = "icon"> <MdLibraryBooks /></i>과제 관리</h2>
                <div className = "headding u-mr-bottom-small">
                    <select value = {this.state.optionSearchHomework} name = "optionSearchHomework" onChange = {(event) => {this.handleChangeText(event)}} className = "select_option" required="required">
                        <option value="제목">제목</option>
                    </select>
                    <div className = "search_box">
                        <input  className = "search_box-text" type="text" name = "searchTextHomework"  onChange = {(event) => {this.handleChangeText(event)}}  onFocus = {() => this.handleFocusSearchHomework()} placeholder="Search.."></input>
                        <button className = "search_box-btn" type="submit"><i className="icon" onClick = {() => this.handleSearch("searchHomework")}><FaSearch/></i></button>
                    </div>
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
                                                    <button className = "btn_file" onClick = {(event)=> this.downloadFile(event, item.path, item.name)} ><FaFileAlt style = {{fontSize : '15px', position : 'relative', top : '3px'}}/></button>
                                                :
                                                item.name.map((file, idx) => (
                                                    <button className = "btn_file" key = {idx} onClick = {(event)=> this.downloadFile(event, item.path[idx], file)} ><FaFileAlt style = {{fontSize : '15px', position : 'relative', top : '3px'}}/></button> 
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