import React, { Component } from 'react';
// import Loading from '../components/Loading';
import callAPI from '../../../_utils/apiCaller';
import Loading from '../../../components/Loading';
var queryString = require('query-string');

export default class ProblemDetail extends Component {
    constructor(props, context) {
        super(props, context)
        this.state =    {
            problem : {},
            loading : false
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
    render() {
        let { problem, loading} = this.state;
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
                    {/* <button to = "#"  className = "btn btn_primary" onClick = {() => this.handleDisplayEditor()}>프로젝트 생성</button> */}
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
                            <textarea className="form-control" cols="55"rows="12" disabled value = {problem.input_example}>
                            </textarea>
                        </div>
                        <div className = "col span-1-of-2 example_output">
                            <h3 >출력 예제 1</h3><br/>
                            <textarea className="form-control" cols="55" rows="12" disabled  value =  {problem.output_example}>
                            </textarea>
                        </div>
                    </div>    
                </div>
            </div>
        )
    }
}
