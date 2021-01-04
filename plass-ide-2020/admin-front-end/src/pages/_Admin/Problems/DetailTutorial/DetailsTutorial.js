import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import './DetailsTutorials.scss'
import qs from 'query-string'
import callAPI from '../../../../_utils/apiCaller'
import ListProblem from '../ListProblem/ListProblem'
import Problems from '../Problems'
import ListTag from './ListTag'
import Loading from '../../../../components/Loading'

export default class DetailsTutorial extends Component {
    constructor(props){
        super(props);
        this.state ={
            detailstutorial: [],
            problems: [],
            loading: true,
        }
    }
    getToken(){
        return {
            auth_token : localStorage.getItem('token')
        }
    }
    componentDidMount(){
        const { id } = qs.parse(this.props.location.search);
        callAPI(`problems/tutorial/${id}`,'GET',this.getToken(),null).then(res => {
            const { data } = res.data;

            //!!Default display problems
            const firstTag = data[0];
            const problems = firstTag.childTag[0].problems;
            this.setState(() => {
                return {
                    detailstutorial: data,
                    loading: false,
                    problems,
                }
            })
        }).catch(err =>
            console.log(err)
        );
    }
    getProblemsByTagId = (childTagId) => {
		let { detailstutorial } = this.state;
        let child  ='';
        for(let i = 0; i < detailstutorial.length; i++)
        {
			const { childTag } = detailstutorial[i];
            child = childTag.filter(element => element.id === parseInt(childTagId))
            if(child.length !== 0){
                const problems = child[0].problems;
                return problems;
			}
		}
    }
    handleClickTag = (id) => {
        const problems = this.getProblemsByTagId(id);
        this.setState({
            problems : problems
        })
    }
    render() {
        const { detailstutorial, problems, loading} = this.state;
        if(loading)
        {
            return <Loading /> 
        }
        const { id } = qs.parse(this.props.location.search);
        return (
            <div className="tutorial-details">
                <div className="tutorial-left">
                    <ListTag listtags = {detailstutorial} tutorialId = {id} handleClickTag = {this.handleClickTag} />
                </div>
                <div className="tutorial-right">
                    <ListProblem {...this.props} problems = {problems} handleClickTag = {this.handleClickTag}/>
                </div>
            </div>
        )
    }
}
