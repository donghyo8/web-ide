import React, { useState, Fragment } from 'react';
//import * as Routers from "../../routers/IDE-Rotuer";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";//
import "./ContextMenu.css"

import './index.scss';
import { useSelector, useDispatch } from 'react-redux';
import { pushOpenFile, setEventState } from '../../actions';
import { EVENT_TYPE } from '../../routers/IDE-Rotuer';
import DetectFile from './DetectFile';

function Directory ({file, tabSize, onClick}) {
    const [open, setOpen] = useState(true);
    const [folder] = useState(true);

    return (
        <div className="direcotry-wrapper" style={{"paddingLeft": tabSize*10}}>
            {console.log(file)}
            <p onClick={()=>{setOpen(!open)}}>
                {open && <img src={require('./images/close.png')}/>}
                {!open && <img src={require('./images/open.png')}/>}
                {folder && <img src={require('./images/folder.png')}/>}
                {!folder && <img src={require('./images/folder.png')}/>}
                {file.name}
            </p>
            {open && file.files.map((file, idx) => {
                if(file.isDirectory) {
                    return (
                        <Directory key={idx} file={file} tabSize={tabSize + 1} onClick={onClick}></Directory>
                    );
                }
                return (
                <p key={idx} style={{"paddingLeft": tabSize*10 + 20}} onClick={ ()=>{onClick(file)} }><DetectFile fileName = {file.name}/>{" "}{file.name}</p>
                );
            })}
        </div>
    );
}
// function Directory ({file, tabSize, onClick}) {
//     const [open, setOpen] = useState(true);
//     const [folder] = useState(true);

//     return (
//         <div className="direcotry-wrapper" style={{"paddingLeft": tabSize*10}}>
//             <p onClick={()=>{setOpen(!open)}}>
//                 {open && <img src={require('./images/close.png')}/>}
//                 {!open && <img src={require('./images/open.png')}/>}
//                 {folder && <img src={require('./images/folder.png')}/>}
//                 {!folder && <img src={require('./images/folder.png')}/>}        
//                 {file.name}
//             </p>
//             {open && file.files.map((file, idx) => {
//                 if(file.isDirectory) {
//                     return (
//                         <Directory key={idx} file={file} tabSize={tabSize + 1} onClick={onClick}></Directory>
//                     );
//                 }
//                 return (
//                     <p key={idx} style={{"paddingLeft": tabSize*10 + 20}} onClick={ ()=>{onClick(file)} }>{file.name}</p>
//                 );
//             })}
//         </div>
//     );
// }

function fileName ({file, tabSize}) {
    var fileLength = fileName.length;    
	var lastDot = fileName.lastIndexOf('.'); 
	var fileextension = fileName.substring(lastDot+1, fileLength);    
    console.log(fileextension);
    return (
        <div className="direcotry-wrapper" style={{"paddingLeft": tabSize*10}}>
            <p>
                <img src={require('./images/cpp.png')}/>
                <img src={require('./images/cpp.png')}/>
                {file.name}
            </p>
        </div>
    );
}

function FileNavigation({}) {
    const [openFilesNavigation, setOpenFilesNavigation] = useState(true);
    const [filesNavigation, setFilesNavigation] = useState(true);
    const { project, openFiles } = useSelector(state => ({
        project: state.project.project, openFiles: state.project.openFiles
    }));
    
    const dispatch = useDispatch();

    const ID = "ID";
    const IDS = "IDS";

    const handleClick = (event, data) => {
        console.log(`clicked`, { event, data });
    };
/*
    const attributes = {
        className: "custom-root",
        disabledClassName: "custom-disabled",
        dividerClassName: "custom-divider",
        selectedClassName: "custom-selected"
    };
*/
    return (
        <Fragment>
        
        <div className="FILE-NAVIGATION">
            <h1 tabIndex="-1" onClick={()=>{setOpenFilesNavigation(!openFilesNavigation)}}>Open Files</h1>
            {openFilesNavigation && openFiles.map((file, idx) => {
                if(file == undefined){
                }else{
                    return (
                        
                        <p className="open-file" key={`open-file-${idx}`} onClick={()=>{dispatch(pushOpenFile(file))}}>
                            <span className={["filename", file.modify ? "modify" : ""].join(" ")}>{file.name}</span>
                            <span onClick={(e)=>{e.stopPropagation(); dispatch(setEventState(EVENT_TYPE.CLOSE_FILE, file))}}>x</span>
                        </p>
                    )
                }
            })}
            
            <h1 tabIndex="-1" onClick={() => { setFilesNavigation(!filesNavigation) }}>{project.name}
                    <div className='FileHead'>
                            <i class='fas fa-file-signature' data={{ action: "CREATE_FILE" }}
                    onClick={(e) => { e.stopPropagation(); dispatch(setEventState(EVENT_TYPE.NEW_FILE)) }}></i>
                            <i class='fas fa-folder-plus' data={{ action: "CREATE_FOLDER" }}
                    onClick={(e) => { e.stopPropagation(); dispatch(setEventState(EVENT_TYPE.NEW_FOLDER)) }}></i>
                    </div>
                </h1>
            <ContextMenuTrigger id={ID}>
            <div className="file-wrapper">
            {filesNavigation && project.files.map((file, idx) => {
                console.log(file)
                if(file.isDirectory) {
                    return (
                        <Directory file={file} tabSize={0} key={`directory-idx-${idx}`} onClick={(file)=>{dispatch(pushOpenFile(file))}}></Directory>
                    )
                }
                return (
                        <p key={`file-idx-${idx}`} onClick={()=>{ dispatch(pushOpenFile(file)) }}><DetectFile fileName = {file.name}/>{" "}{file.name}</p>
                    );
            })}
            </div>
            </ContextMenuTrigger>
        </div>
        

            <ContextMenu id={ID}>
                <MenuItem
                    data={{ action: "CREATE_FILE" }}
                    onClick={(e) => { e.stopPropagation(); dispatch(setEventState(EVENT_TYPE.NEW_FILE)) }}
                >
                    새파일
            </MenuItem>
                <MenuItem
                    data={{ action: "CREATE_FOLDER" }}
                    onClick={(e) => { e.stopPropagation(); dispatch(setEventState(EVENT_TYPE.NEW_FOLDER)) }}
                >
                    새폴더
            </MenuItem>
                <MenuItem
                    data={{ action: "RENAME" }}
                    onClick={(e) => { e.stopPropagation(); dispatch(setEventState(EVENT_TYPE.RENAME_FILE)) }}
                >
                    이름 바꾸기
            </MenuItem>
                <MenuItem
                    data={{ action: "DELETE" }}
                    onClick={(e) => { e.stopPropagation(); dispatch(setEventState(EVENT_TYPE.DROP_FILE)) }}
                >
                    삭제
            </MenuItem>
            </ContextMenu>
        </Fragment>
    );
}

// function FileNavigation({}) {
//     const [openFilesNavigation, setOpenFilesNavigation] = useState(true);
//     const [filesNavigation, setFilesNavigation] = useState(true);
//     const { project, openFiles } = useSelector(state => ({
//         project: state.project.project, openFiles: state.project.openFiles
//     }));
    
//     const dispatch = useDispatch();

//     const ID = "ID";
//     const IDS = "IDS";

//     const handleClick = (event, data) => {
//         console.log(`clicked`, { event, data });
//     };
// /*
//     const attributes = {
//         className: "custom-root",
//         disabledClassName: "custom-disabled",
//         dividerClassName: "custom-divider",
//         selectedClassName: "custom-selected"
//     };
// */  
//     return (
//         <Fragment>
        
//         <div className="FILE-NAVIGATION">
//             <h1 tabIndex="-1" onClick={()=>{setOpenFilesNavigation(!openFilesNavigation)}}>Open Files</h1>
//             {openFilesNavigation && openFiles.map((file, idx) => {
//                 if(file == undefined){
//                 }else{
//                     return (
                        
//                         <p className="open-file" key={`open-file-${idx}`} onClick={()=>{dispatch(pushOpenFile(file))}}>
//                             <span className={["filename", file.modify ? "modify" : ""].join(" ")}>{file.name}</span>
//                             <span onClick={(e)=>{e.stopPropagation(); dispatch(setEventState(EVENT_TYPE.CLOSE_FILE, file))}}>x</span>
//                         </p>
//                     )
//                 }
//             })}
            
//             <h1 tabIndex="-1" onClick={()=>{setFilesNavigation(!filesNavigation)}}>{project.name}</h1>
//             <ContextMenuTrigger id={ID}>
//             <div className="file-wrapper">
//             {filesNavigation && project.files.map((file, idx) => {
//                 if(file.isDirectory) {
//                     return (
//                         <Directory file={file} tabSize={0} key={`directory-idx-${idx}`} onClick={(file)=>{dispatch(pushOpenFile(file))}}></Directory>
//                     )
//                 }
//                 // else if(!file.isDirectory){
//                 //     return(
//                 //         <fileName file={file} tabSize={0} key={`directory-idx-${idx}`}></fileName>
//                 //     )
//                 // }
//                 return (
//                     <p key={`file-idx-${idx}`} onClick={()=>{ dispatch(pushOpenFile(file)) }}>{file.name}</p>
//                 )
//             })}
//             </div>
//             </ContextMenuTrigger>
//         </div>
        
//         <ContextMenu id={ID}>
//             <MenuItem
//             data = {{ action: "CREATE_FILE"}}
//             onClick={(e)=>{e.stopPropagation(); dispatch(setEventState(EVENT_TYPE.NEW_FILE))}}
//             >
//                 새파일
//             </MenuItem>
//             <MenuItem
//             data = {{ action: "CREATE_FOLDER"}}
//             onClick={(e)=>{e.stopPropagation(); dispatch(setEventState(EVENT_TYPE.NEW_FOLDER))}}
//             >
//                 새폴더
//             </MenuItem>
//             <MenuItem
//             data = {{ action: "RENAME"}}
//             onClick={(e)=>{e.stopPropagation(); dispatch(setEventState(EVENT_TYPE.RENAME_FILE))}}
//             >
//                 이름 바꾸기
//             </MenuItem>
//             <MenuItem
//             data = {{ action: "DELETE"}}
//             onClick={(e)=>{e.stopPropagation(); dispatch(setEventState(EVENT_TYPE.DROP_FILE))}}
//             >
//                 삭제
//             </MenuItem>
//         </ContextMenu>
//         </Fragment>
//     );
// }

export default FileNavigation;