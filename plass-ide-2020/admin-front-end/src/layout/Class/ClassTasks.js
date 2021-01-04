import React from 'react';
import {
    NavLink
    } from "react-router-dom";
import classname from 'classname';
import PropTypes from 'prop-types';

ClassTasks.propTypes = {
    tasks : PropTypes.array
}

ClassTasks.defaultProps = {
    tasks : []
}
function ClassTasks({tasks}){
    return (
        <>
        <ul className = "navigation ul-nolist-inline">
            {
                tasks.map((item, index) => (
                    <li key = {`task-${index}`}>
                        <NavLink 
                            className = {classname({'selected-class-task': item.isSelected})}
                            to = {item.link}>{item.block}
                        </NavLink>
                    </li>
                ))
            }
        </ul>
        </>
    );
};
export default ClassTasks;
