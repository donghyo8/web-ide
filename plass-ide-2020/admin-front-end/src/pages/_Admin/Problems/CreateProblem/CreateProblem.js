import React, { Component } from 'react'
import qs from  'query-string';
import callAPI from '../../../../_utils/apiCaller';
import './CreateProblem.scss';
import { FaChevronRight } from 'react-icons/fa';
export default class CreateProblem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name : '',
			content : '',
			input : '',
            output : '',
            testCases: [ { input_example: '', output_example: '' } ],
			category : 'C/C++',
            level : '하',
            
            level1: [],
            level1Value: {},
            level2: [],
            level2Value: {},
            level3: [],
            level3Value: {}
        }
    }
    getToken (){
        const token = localStorage.getItem('token')
        return {
            auth_token : token
        }
    }
    componentDidMount()
    {

        const { method } = this.props;
        if(method === "modify")
        {
            if(Object.keys(this.props.problem).length)  
            {
                let { name, content, input, output, testCases, category, level} = this.props.problem[0];
                this.setState({
                    name, content, input, output, testCases, category, level
                })
            }
            else{
                const { id } = qs.parse(this.props.location.search);
                callAPI(`problems/${id}`,'GET',this.getToken(),null).then(res => {
                    let { name, content, input, output, testCases, category, level} = res.data.data[0];
                    console.log(res.data.data[0])
                    this.setState({
                        name, content, input, output, testCases, category, level
                    })
                })

            }
        }else{ //create problem
            callAPI(`problems/treetags`, 'GET', this.getToken(),null).then(res =>{
                //! Default select value
                let level1 = res.data.data;
                let level2 = level1[0].level2;
                let level3 = level2[0].level3;

                //! Deafult option value
                let level1Value = {
                    id: level1[0].id,
                    name : level1[0].name
                }
                let level2Value = {
                    id: level2[0].id,
                    name : level2[0].name
                }
                let level3Value = {
                    id: level3[0].id,
                    name : level3[0].name
                }
                this.setState({
                    level1,level2,level3,level1Value,level2Value,level3Value
                })
            })
        }
    }
    onSubmit = (event) => {
        event.preventDefault();
        let { method } = this.props;
        const { name, content, input, output, testCases, level, category} = this.state

        if(method === 'create'){
            //등록
            let {level3Value} = this.state; 
            let level3Id = level3Value.id;
            console.log(level3Id)
			callAPI(`problems`, 'POST', this.getToken(),{
                name, content, input, output, testCases, level, category, level3Id
			},null).then(res =>{
				const { message , data} = res.data;
				alert(message);
				if(message === '문제가 추가되었습니다.'){
                    // this.props.history.push(`tutorial?id=${}`);
                    this.setState({
						name : '',
						content : '',
						input : '',
						output : '',
						testCases: [{ input_example : '', output_example : '' }],
						level : '하',
						category : 'C/C++'
					})
				}
			})
		}else{
			//수정
			let { id } = qs.parse(this.props.location.search);
			callAPI(`problems/${id}`, 'PUT', this.getToken(),{
				name, content, input,  output, testCases, level, category
			},null).then(res =>{
				const { message} = res.data;
				alert(message);
				if(message === '문제가 수정되었습니다.'){
					this.props.history.push(`/main/problems/list`);
				}
            })
        }
    }
    handleChange = (event) => {
        let {name, value} = event.target;
        const level1 = [...this.state.level1];

        ///handleChange for select
        if(name === "level1Value"){
            let currentLevelName = level1.filter(element => element.name === value)[0];
            let level2 = currentLevelName.level2;
            let level3 = level2[0].level3;
            this.setState({
                level2,
                level3
            })
        }else if(name === "level2Value"){
            const { level1Value } = this.state;
            let currentLevelName = level1.filter(element => element.name === level1Value)[0];
            let level2 = currentLevelName.level2;
            let level3 = level2.filter(element => element.name === value)[0].level3;
            this.setState({
                level3
            })
        }
        this.setState({
            [name] : value
        })
    }

    handleTestCases(idx, type, data) {
        const testCases = Object.assign([], this.state.testCases); 
        testCases[idx][type] = data;
        this.setState({ testCases });
    }
    
    handleAddTestCase() {
        const testCases = Object.assign([], this.state.testCases); 
        testCases.push({input_example: "", output_example: ""});
        this.setState({testCases})
    }

    handleRemoveTestCase(idx) {
        const testCases = Object.assign([], this.state.testCases)
        testCases.splice(idx, 1); 
        this.setState({ testCases })
    }

    render() {
        const { method } = this.props;
        const { name, content, input, output, testCases, category, level} = this.state;
        const { level1, level1Value, level2, level2Value,  level3, level3Value } = this.state;
        return (
            <div className="create_problem">
                <div  className="problem_detail">
                    <div className="problem_name">
                        <h2 className="u-text-center">문제 작성</h2>
                        {
                            method === 'modify' ?  <button className="btn btn_primary u-float-right" onClick = {this.onSubmit}>문제 수정</button> :
                            <button className="btn_primary u-float-right" onClick = {this.onSubmit}>문제 등록</button>
                        }
                    </div>
                    <div className="problem_content">
                        <div className="define border-btm">
                            <h3>문제 이름 :</h3><input value = {name} name = "name" onChange = {event => this.handleChange(event)} type = "text"/>
                            <h3 className="level">난이도 </h3> 
                            <select className="level_select" name = "level" onChange = {event => this.handleChange(event)} value = {level}>
                                <option value = "하">하</option>
                                <option value = "중">중</option>
                                <option value = "급">급</option>
                            </select>
                            <h3 className="category">언어 </h3> 
                            <select name = "category" className="category_select" onChange = {event => this.handleChange(event)} value = {category}>
                                <option value = "C/C++">C/C++</option>
                                <option value = "JAVA">JAVA</option>
                                <option value = "JAVA">Python</option>
                            </select>
                        </div>  
                        <div className="problem_category u-mr-top-small border-btm">
                            <h3>문제 카테고리 목록 : </h3>
                            <SelectCategory
                                level1 = {level1}
                                level2 = {level2}
                                level3 = {level3}
                                level1Value = {level1Value}
                                level2Value = {level2Value}
                                level3Value = {level3Value}
                                handleChange = {this.handleChange}
                            />
                        </div>
                        <div className="define border-btm u-mr-top-small">
                            <h3>문제 설명</h3>
                            <p>
                                <textarea className="form-control" cols="100" rows="5" value = {content}  name = "content" onChange = {event => this.handleChange(event)} />
                            </p>
                        </div>    
                        <div className="problem_input border-btm">
                            <h3>입력</h3>
                            <p>
                                <textarea className="form-control" cols="100" rows="5" value =  {input}  name = "input" onChange = {event => this.handleChange(event)} />
                            </p>
                        </div>    
                        <div className="problem_output border-btm">
                            <h3>출력</h3>
                            <p>
                                <textarea className="form-control" cols="100" rows="5"  value = {output} name = "output" onChange = {event => this.handleChange(event)} />
                            </p>
                        </div>    
                        <TestCasesInputs testCases={testCases} 
                            handleTestCases={this.handleTestCases.bind(this)} 
                            removeTestCase={this.handleRemoveTestCase.bind(this)}
                            addTestCase={this.handleAddTestCase.bind(this)}/>
                    </div>
                </div>
            </div>
        )
    }
}

function TestCasesInputs({testCases, handleTestCases, addTestCase, removeTestCase}) {
    return (
        <div className="problem-example">
            {testCases.map(({input_example, output_example}, idx)=>{
                return (                                           
                    <>
                        <div key={`testcase-input-${idx}`}>
                            { idx !==0 && <button onClick={()=>{removeTestCase(idx)}}>remove</button>}
                            { idx === testCases.length -1 && <button onClick={()=>{addTestCase()}}>add</button>}
                        </div>
                        <div className="col span-1-of-2 example_input" key={`testcase-input-${idx}`}>
                            <h3 >입력 예제 {idx + 1}</h3><br/>
                            <textarea className="form-control u-mr-top-small" cols="55" rows="8" value = {input_example} onChange={(e)=>{handleTestCases(idx, "input_example", e.target.value)}} name = "input_example"  />
                        </div>
                        <div className="col span-1-of-2 example_output" key={`testcase-output-${idx}`}>
                            <h3 >출력 예제 {idx + 1}</h3><br/>
                            <textarea className="form-control u-mr-top-small" cols="55" rows="8" value = {output_example} onChange={(e)=>{handleTestCases(idx, "output_example", e.target.value)}} name = "output_example"  />
                        </div>
                    </>
                )
            })}
        </div>
    )
}

function SelectCategory(props){
    const { level1, level2, level3, level1Value, level2Value, level3Value, handleChange } = props; 
    return (
        <React.Fragment>
            <select name = "level1Value" className="catergory_level1" onChange = {event => handleChange(event)} value = {level1Value.name}>
                {
                    level1.length !== 0 &&
                    level1.map(item => (
                        <option key = {item.id} value = {item.name}>{item.name}</option>
                    ))
                }
            </select>&nbsp;
            <FaChevronRight />
            <select name = "level2Value" className="category_level2" onChange = {event => handleChange(event)} value = {level2Value.name}>
            {
                    level2.length !== 0 &&
                    level2.map(item => (
                        <option key = {item.id} value = {item.name}>{item.name}</option>
                    ))
                }
            </select>&nbsp;
            <FaChevronRight />
            <select name = "level3Value" className="category_level3" onChange = {event => handleChange(event)} value = {level3Value.name}>
            {
                    level3.length !== 0 &&
                    level3.map(item => (
                        <option key = {item.id} value = {item.name}>{item.name}</option>
                    ))
                }
            </select>
        </React.Fragment>
    )
}