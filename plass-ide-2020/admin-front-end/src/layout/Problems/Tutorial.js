import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AiFillCreditCard } from 'react-icons/ai'
import { Link } from 'react-router-dom';

export default class Tutorial extends Component {
    render() {
        const {id, name, description, img } = this.props.tutorial;
        return (
            <article className="tutorial">
                <Link to = {`tutorial?id=${id}`} >
                    <div className="img-container">
                        <img width="200" height="200" src= {img} alt="turorial" />
                    </div>
                    <div className="tutorial-info">
                        <h3>{name}</h3>
                        <p>
                            {description}
                        </p>
                    </div>
                </Link>
            </article>
        )
    }
}
Tutorial.propTypes  = {
    name: PropTypes.string,
    description: PropTypes.string,
    img: PropTypes.string
}
Tutorial.defaultProps = {
    name: '',
    description: '',
    img: ''
}