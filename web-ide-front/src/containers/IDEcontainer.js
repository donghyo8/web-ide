import React, { useState, useEffect } from 'react';

import FileNavigation from '../modules/File-Navigation';
import Tabs from '../modules/Tabs';
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-r";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-twilight";
import HeaderNavigation from '../modules/HeaderNavigation/HeaderNavigation';

import './IDEcontainer.scss';
import classnames from 'classnames';
import { useSelector } from 'react-redux';
import SandboxNavigation from '../modules/Sandbox-Navigation';

export default function IDEcontainer({onChangeText, setConsoleType, consoleChange, consoleKeyDown,
    consoleOut, lintOut, consoleType, _console, navigation }) {
    const { selectFile } = useSelector(state => ({
        project: state.project.project,
        selectFile: state.project.selectFile,
    }));
    const [terminalOutput, setTerminalOutput] = useState(""); 

    const consoleRef = React.createRef();

    function setOutput() {
        switch(consoleType) {
            case "console": setTerminalOutput(consoleOut); break;
            case "lint": setTerminalOutput(lintOut); break;
            default: break;
        }
    }

    useEffect(() => { setOutput(); }, [consoleType, lintOut, consoleOut]);
    useEffect(()=>{
        if(!consoleRef.current) return;
        consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }, [terminalOutput]);

    return (
        <div className="IDE" tabIndex="-1">
            <HeaderNavigation/>
            <article>
            <SandboxNavigation className="navigation"></SandboxNavigation>
                { navigation && <FileNavigation className="navigation"></FileNavigation> }
                <section>
                    <div className="workspace-wrapper">
                        <Tabs className="tab"></Tabs>
                        <AceEditor
                            width="100%"
                            height="100%"
                            fontSize={18}
                            mode={selectFile ? getMode(selectFile.ext) : ""}
                            theme="twilight"
                            onChange={onChangeText}
                            name="UNIQUE_ID_OF_DIV"
                            value={selectFile ? selectFile.data : ""}></AceEditor>
                    </div>
                    {_console && <div className="console">
                        <ul className="console-tab">
                            <li onClick={()=>setConsoleType("console")} 
                                className={classnames({ "active":  consoleType === "console"})}>Console</li>
                            <li onClick={()=>setConsoleType("lint")}
                                className={classnames({ "active":  consoleType === "lint"})}>Lint</li>
                        </ul>
                        <textarea className="console" rows={10} value={terminalOutput} onChange={consoleChange} onKeyDown={consoleKeyDown} ref={consoleRef}></textarea>
                    </div> }
                </section>
            </article>
            <footer>
                <p></p>
                <p>Developed by PLASS LAB</p>
            </footer>
        </div>
    )
}


function getMode(ext) {
    switch(ext) {
        case "c": case "cpp":
            return "c_cpp";
        case "py":
            return "python";
        case "R":
            return "r";
        default:
            return ext;
    }
}