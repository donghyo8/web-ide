import React, { Component } from 'react'
import { MdLibraryBooks } from 'react-icons/md'
import callAPI from '../../_utils/apiCaller';
export default class componentName extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = ({
            title : "",
            created : "",
            limitdate : "",
            description : "",
        })
    }
    async componentDidMount(){
        const token = localStorage.getItem('token');
        const homeworkId = this.props.match.params.id;
        await callAPI(`lectures/57/homework/${homeworkId}`,'GET',{auth_token : token}, null).then(res => {
            this.setState({
                Reports : res.data.data
            })
        })
        console.log(this.state.Reports);
    }   
    render() {
        return (
        <div className = "class_homeworks_details">   
			<h2><i className = "icon"><MdLibraryBooks /></i>과제 뷰</h2>
                    Homework Details
            <p></p>
        </div>
        )
    }
}
