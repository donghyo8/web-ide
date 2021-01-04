import React from 'react'
import { MdTimer } from 'react-icons/md'
import { FaRocketchat } from 'react-icons/fa'
import { TiBell } from 'react-icons/ti'

function TaskItem(props) {
    return (
        <div className = "taskitem">
            <b>{props.name}</b><button className = "float-right">x</button>
            <p><i className = "icon"><MdTimer /></i>{props.time} &nbsp;<TiBell/> &nbsp;<FaRocketchat /></p>
        </div>
    )
}

export default TaskItem

