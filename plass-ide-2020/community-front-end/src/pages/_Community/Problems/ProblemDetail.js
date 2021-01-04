import React, { Component } from 'react';
import AceEditor from "react-ace";
import Alert from '../../../components/Alert';
// import axios from 'axios';
import IO from 'socket.io-client';
import callAPI from '../../../_utils/apiCaller';
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'
import BoilerplateCode from '../../../resources/SampleCode';
import Loading from '../../../components/Loading';

var queryString = require('query-string');

function getSimpleCode (language)
{
    let simpleCode = BoilerplateCode[language];
    return simpleCode;
}
export default class ProblemDetail extends Component {
    constructor(props, context) {
        super(props, context)
        this.state ={
            problem : {},
            loading : false,
            editorContent : BoilerplateCode["c"],
            displayEditor : false,
            language : "c",
            submitProblem : false
        }
    }

    getToken (){
        const token = localStorage.getItem('token')
        return {
            auth_token : token
        }
    }
    componentDidMount(){
        const { problem } = this.props
        if(problem && Object.keys(problem).length)  
        {
            this.setState({
                problem : problem[0],
                loading :false
            })
        }else{
            const problemId = queryString.parse(window.location.search).id;
            callAPI(`problems/${problemId}`,'GET',this.getToken(),null).then(res => {
                const fetchProblem = res.data.data[0];
                this.setState({
                    problem : fetchProblem,
                    loading :false
                })
            })
        }
    }
    handleDisplayEditor = () =>{
        this.setState({
            displayEditor : !this.state.displayEditor
        })
    }
    handleChange = (content) =>{
        this.setState({
            editorContent : content
        })
        var editor = localStorage.getItem("editor");
        editor = editor ? JSON.parse(editor) : {};
        editor['editorContent'] = content;
        localStorage.setItem("editor", JSON.stringify(editor));
    }
    handleLanguage = (event) => {
        let language = event.target.value
        let simpleCode = getSimpleCode(language);
        console.log(language);
        this.setState({
            language : language,
            editorContent : simpleCode
        })
        var valueEditor = {
            language : language,
            editorContent : simpleCode
        }
        localStorage.setItem("editor", JSON.stringify(valueEditor))
    }

    handleAnswerSubmit = () =>{
        Alert({ 
            title : "제출하시겠습니까?",
            btns : [
                {
                    text: "예", onClick: () => {
                        try {
                            this.setState({submitProblem: true});
                            const { editorContent, language } = this.state;
                    
                            const problemId = queryString.parse(window.location.search).id;
                            const IO_URL = process.env.REACT_APP_API_IDE_URL + "/problems";
                            const socket = IO(IO_URL);
                    
                            socket.emit("problems", {
                                sourceCode: editorContent, language, problemId: Number(problemId)
                            });
                    
                            socket.on("result", (data) => {
                                alert(`체점 결과 ${data.correctCount} / ${data.count}`);
                                this.setState({submitProblem: false})
                            });
                        } catch (error) {
                            alert("Request server failed");
                            console.log(error);
                        }

                    }
                },{
                    text: "아니오", onClick: () => {}
                }
            ]
        })
    }
    render() {
        const {problem, displayEditor, loading} = this.state;
        if(loading)
        {
            return (
                <Loading/>
            )
        }
        return (
            <div  className = "problem_detail">
                <div className = "problem_name u-mr-top-small">
                    <span>{problem.id}.{problem.name}</span>
                    <button className = "btn btn_primary" onClick = {() => this.handleDisplayEditor()}>프로젝트 생성</button>
                </div>
                <div className = "problem_content">
                    <div className = "define border-btm">
                        <h3>문제</h3>
                        <p>
                        {problem.content}
                        </p>   
                    </div>    
                    <div className = "problem_input border-btm">
                        <h3>입력</h3>
                        <p>
                        {problem.input}
                        </p>
                    </div>    
                    <div className = "problem_output border-btm">
                        <h3>출력</h3>
                        <p>
                        {problem.output}
                        </p>
                    </div>                                           
                    <div className = "problem-example">                   
                        <div className = "col span-1-of-2 example_input">
                            <h3 >입력 예제 1</h3><br/>
                            <textarea className="form-control example_text" cols="55"rows="12" disabled value = {problem.input_example}>
                            </textarea>
                        </div>
                        <div className = "col span-1-of-2 example_output">
                            <h3 >출력 예제 1</h3><br/>
                            <textarea className="form-control example_text" cols="55" rows="12" disabled  value =  {problem.output_example}>
                            </textarea>
                        </div>
                    </div>    
                </div>
                <div className = "project-editor">
                    { displayEditor && <>
                        <div className = "language u-float-right">
                            <b>언어 선택 : </b>
                            <select onChange = {(event) => this.handleLanguage(event)} value = {this.state.language}>
                                <option value = "c">C</option>
                                <option value = "cpp">C++</option>
                                <option value = "java">Java</option>
                            </select>
                        </div>
                        <AceEditor
                            width = "100%"
                            height = "600px"
                            fontSize={18}
                            onChange = {this.handleChange}
                            mode = "java"
                            theme = "monokai"
                            name = "UNIQUE_ID_OF_DIV"
                            value = {this.state.editorContent}
                        />
                        <div className = "u-float-right u-mr-top-small">
                            {
                            this.state.submitProblem && 
                                <div className = "loading"
                                    style = {{
                                        position: "absolute",
                                        marginBottom: "500px",
                                        bottom: "20px",
                                        left: "50%",
                                        transform: "translateX(-50%)"
                                    }}
                                >
                                    <Loader
                                        type="TailSpin"
                                        color="#695b50"
                                        height={100}
                                        width={100}
                                    /> 
                                </div>      
                            }
                            <button className = "submit_btn btn_primary" style = {{background : 'blue'}} onClick = {() => this.handleAnswerSubmit()} disabled={this.state.submitProblem}>제출</button>
                        </div>
                    </> }
                </div>
            </div>
        )
    }
}
