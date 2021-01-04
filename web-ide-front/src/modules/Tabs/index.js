import React from 'react';

import './tab.scss';
import { useSelector, useDispatch } from 'react-redux';
import { selectFile, setEventState } from '../../actions';
import { EVENT_TYPE } from '../../routers/IDE-Rotuer';

function Tab({file, active, onClick, onClose}) {
    if(file == undefined){
        return null;
    }else{
        return (
            <div tabIndex="-1" className={["tab-wrapper", active? "active" : ""].join(" ")} 
                onClick={() => {onClick(file)}}>
                <span className={["filename", file.modify ? "modify" : ""].join(" ")}>{file.name}</span>
                <span onClick={(e) => {e.stopPropagation(); onClose(file)}}>x</span>
            </div>
        )
    }
}

function Tabs({className}) {
    const { files, selectedFile } = useSelector(state => ({
        files: state.project.openFiles,
        selectedFile: state.project.selectFile
    }));
    const dispatch = useDispatch();

    return (
        <div className={'TAB ' + className}>
            <div className="tabs-wrapper">
                {files.map((file, idx)=>{
                    return (
                    <Tab key={idx} file={file} 
                        active={file === selectedFile} 
                        onClick={(file)=>{dispatch(selectFile(file))}} 
                        onClose={(file)=>{dispatch(setEventState(EVENT_TYPE.CLOSE_FILE, file))}}></Tab>
                    );
                })}
            </div>
        </div>
    )
}

export default Tabs;