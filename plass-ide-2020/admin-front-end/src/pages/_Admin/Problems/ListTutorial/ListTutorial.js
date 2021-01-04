import React, { Component } from 'react'
import './ListTutorial.scss'
import PropTypes from 'prop-types'
import Tutorial from '../../../../layout/Problems/Tutorial'
import callAPI from '../../../../_utils/apiCaller';
import Loading from '../../../../components/Loading';

export default class ListTutorial extends Component {

    constructor(props) {
        super(props);
        this.state={
            tutorials: [],
            loading: true,
        }
    }
    getToken(){
        const token = localStorage.getItem('token')
        return {
            auth_token : token
        }
	}
    componentDidMount(){
		try {
			callAPI('problems/listtutorials','GET',this.getToken(),null).then(res => {
                let {data} = res.data;
                const images = ['languages.jpg','structure.png','algorithm.jpg'] //!Default images path
                data.forEach((item,index) => item.img = `/images/${images[index]}`);
                this.setState({
                    tutorials: data,
                    loading: false
                })
            }).catch(err =>
                console.log(err)
            );
		} catch (error) {
			alert("계속 사용하려면 다시 로그인 하십시오");			
		}
	}
    render() {
        const { tutorials,loading } = this.state;
        if(loading){
            return <Loading />
        }
        return (
            <section className="TUTORIALLIST">
                {
                    tutorials.map(tutorial => {
                        return <Tutorial  key={tutorial.id} tutorial={tutorial} />
                    })
                }
            </section>
        )
    }
}

