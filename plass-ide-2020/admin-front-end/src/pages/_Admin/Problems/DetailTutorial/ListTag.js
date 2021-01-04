import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PureComponent } from 'react'
import { Link } from 'react-router-dom';

export default class ListTag extends PureComponent {
    constructor(prop){
        super(prop);
    }
    static propTypes = {
        prop: PropTypes
    }
    render() {
        const { listtags, handleClickTag, tutorialId } = this.props; 
        return (
            <div>{
                listtags.map(tag => {
                        return (
                        <ul>
                            <li>{tag.name}</li>
                            {
                                tag.childTag.map(item => (
                                    <li onClick={() => handleClickTag(item.id)}>
                                        <Link key = {item.id} to={`tutorial?id=${tutorialId}&tagid=${item.id}`}>
                                            {item.name}
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                        )
                    })
                }
            </div>
        )
    }
}
ListTag.propTypes = {
    listtags: PropTypes.array,
    handleClickTag: PropTypes.func
}