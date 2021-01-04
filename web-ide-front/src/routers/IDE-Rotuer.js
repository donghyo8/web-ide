import React from 'react';
//TODO: 폴더명 변경, 폴더 삭제, 아이콘, 우클릭시 자동 path 추적
//import isUnzipped from '../../../web-ide-server/modules/file-controller';
import IDEcontainer from '../containers/IDEcontainer';
import moment from 'moment';
import classnames from 'classnames';

// import Editor from '../modules/Editor';
import Alert from '../modules/Alert';
import Http from '../modules/Http';

import { setProject, selectFile, setEventState, pushOpenFile, dropFile, dropFolder, renameFile, removeOpenFile, setOpenFiles, selectFolder } from '../actions';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import ModalPortal from '../modules/ModalPortal';
import Modal from '../modules/Modal';

export const EVENT_TYPE = {
    SAVE: "SAVE",
    NEW_FILE: "NEW_FILE",
    NEW_FOLDER: "NEW_FOLDER",
    CLOSE_FILE: "CLOSE_FILE",
    DROP_FILE: "DROP_FILE",
    DROP_FOLDER: "DROP_FOLDER",
    RENAME_FILE: "RENAME_FILE",
    COMPILE: "COMPILE",
    RUN: "RUN",
    LINT: "LINT",
    HIDE_CONSOLE: "HIDE_CONSOLE",
    HIDE_NAVI: "HIDE_NAVI",
    SUBMIT_REPORT: "SUBMIT_REPORT"
}

const SHORT_CUT_ITEM = {
    CLOSE: "close-file-or-editor",
    SAVE: "save-file-and-item",
    CREATE: "create-file-or-item",
    RUN: "run-compile"
}

const shortcuts = [
    { ctrlKey: true, altKey: false, shiftKey: false, key: 'e', eventName: SHORT_CUT_ITEM.CLOSE },
    { ctrlKey: true, altKey: false, shiftKey: false, key: 's', eventName: SHORT_CUT_ITEM.SAVE },
    { ctrlKey: true, altKey: false, shiftKey: false, key: 'm', eventName: SHORT_CUT_ITEM.CREATE },
    { ctrlKey: true, altKey: false, shiftKey: false, key: 'r', eventName: SHORT_CUT_ITEM.RUN }
]

function CreateNewFileBody({ project, onChangeName, onChangePath }) {
    const [name, setName] = React.useState("");
    const [pathname, setPathname] = React.useState("");
    console.log("파일 저장");
    React.useEffect(() => { console.log("ischange!!, pathname", pathname); onChangePath(pathname); }, [pathname]);

    function Directory({ files }) {
        const directory = files.map((file, tabSize) => {
            if (!file.isDirectory) { return; }

            return (
                <>
                    <p style={{ "paddingLeft": tabSize * 15 }}
                        className={classnames({ active: pathname === file.path })}
                        onClick={() => { setPathname(file.path) }}>{file.name}</p>
                    <Directory files={file.files}></Directory>
                </>
            )
        });
        return directory;
    }

    return (
        <>
            <div className="save-modal">
                <div className="directory-structure">
                    <p className={classnames({ active: pathname === "" })} style={{ "paddingLeft": 5 }}>/</p>
                    <Directory files={project.files} tabSize={0} />
                </div>
                <div className="input-form">
                    <label htmlFor="save-modal-name">이름</label>
                    <input id="save-modal-name" type="text" value={name}
                        onChange={(e) => { onChangeName(e.target.value); setName(e.target.value) }} />
                </div>
            </div>
        </>
    )
}

function RenameFileBody({ project, onChangeName, onChangePath }) {
    const [name, setName] = React.useState("");
    const [pathname, setPathname] = React.useState("");
    console.log("파일명 수정");
    React.useEffect(() => { console.log("ischange!!, pathname", pathname); onChangePath(pathname); }, [pathname]);

    function Directory({ files }) {
        const directory = files.map((file, tabSize) => {
            if (!file.isDirectory) { return; }
            // return (
            //     <>
            //         <p style={{"paddingLeft": tabSize*15}} 
            //             className={classnames({active: pathname === file.path })}
            //             onClick={()=>{setPathname(file.path)}}>{file.name}</p>
            //         <Directory files={file.files}></Directory>
            //     </>
            // )//폴더목록
        });
        return directory;
    }

    return (
        <>
            <div className="save-modal">
                <div className="directory-structure">
                    <p className={classnames({ active: pathname === "" })} style={{ "paddingLeft": 5 }}>/</p>
                    <Directory files={project.files} tabSize={0} />
                </div>
                <div className="input-form">
                    <label htmlFor="save-modal-name">이름</label>
                    <input id="save-modal-name" type="text" value={name}
                        onChange={(e) => { onChangeName(e.target.value); setName(e.target.value) }} />
                </div>
            </div>
        </>
    )
}

function DeleteFileBody({ project, onChangeName, onChangePath }) {
    const [name, setName] = React.useState("");
    const [pathname, setPathname] = React.useState("");
    React.useEffect(() => { console.log("ischange!!, pathname", pathname); onChangePath(pathname); }, [pathname]);

    function Directory({ files }) {
        const directory = files.map((file, tabSize) => {
            if (!file.isDirectory) { return; }
            // return (
            //     <>
            //         <p style={{"paddingLeft": tabSize*15}} 
            //             className={classnames({active: pathname === file.path })}
            //             onClick={()=>{setPathname(file.path)}}>{file.name}</p>
            //         <Directory files={file.files}></Directory>
            //     </>
            // )//폴더목록
        });
        return directory;
    }

    return (
        <>
        </>
    )
}


function DeleteFolderBody({ project, onChangeName, onChangePath }) {
    const [name, setName] = React.useState("");
    const [pathname, setPathname] = React.useState("");
    React.useEffect(() => { console.log("ischange!!, pathname", pathname); onChangePath(pathname); }, [pathname]);

    function Folder({ folders }) {
        console.log(folders)
        const directory = folders.map((folder, tabSize) => {
            if (!folder.isDirectory) { return; }
            /*
            return (
                <>
                    <p style={{ "paddingLeft": tabSize * 15 }}
                        className={classnames({ active: pathname === file.path })}
                        onClick={() => { setPathname(file.path) }}>{file.name}</p>
                    <Directory files={file.files}></Directory>
                </>
            )//폴더목록
            */
        });
        return directory;
    }
    return (
        <>
        </>
    )
}






class IDERouter extends React.Component {
    state = { consoleOut: "", consoleBuffer: "", lintOut: "", consoleType: "console", navigation: true, console: true };

    constructor(props) {
        super(props);
        this.shortcutHandler = this.shortcutHandler.bind(this);
    }

    shortcutHandler(event) {
        const item = shortcuts.find(e => (e.key === event.key && e.altKey === event.altKey && e.ctrlKey === event.ctrlKey && e.shiftKey === event.shiftKey));
        if (!item) return;

        event.preventDefault();
        switch (item.eventName) {
            case SHORT_CUT_ITEM.CLOSE:
                this.props.setEventType(EVENT_TYPE.CLOSE_FILE);
                break;
            case SHORT_CUT_ITEM.SAVE:
                this.props.setEventType(EVENT_TYPE.SAVE);
                break;
            case SHORT_CUT_ITEM.CREATE:
                break;
            case SHORT_CUT_ITEM.RUN:
                this.props.setEventType(EVENT_TYPE.COMPILE);
                break;
            default: break;
        }

        this.props.setEventType(null);
    }

    componentDidMount() {
        window.addEventListener("keydown", this.shortcutHandler);
        this.getProject();
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.shortcutHandler);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.globalEvent.eventType === this.props.globalEvent.eventType || !this.props.globalEvent.eventType) return;
        const { eventType, additional } = this.props.globalEvent;
        switch (eventType) {
            case EVENT_TYPE.SAVE:
                this.saveFile(this.props.selectFile);
                break;
            case EVENT_TYPE.NEW_FILE:
                this.createNewFile("");
                break;
            case EVENT_TYPE.NEW_FOLDER:
                this.createNewFolder("");
                break;
            case EVENT_TYPE.CLOSE_FILE:
                this.closeFile(additional ? additional : this.props.selectFile);
                break;
            case EVENT_TYPE.DROP_FILE:
                this.dropFile(this.props.selectFile);
                break;
            case EVENT_TYPE.DROP_FOLDER:
                this.dropFolder(this.props.selectFile);
                break;
            case EVENT_TYPE.RENAME_FILE:
                this.renameFile(this.props.selectFile);
                break;
            case EVENT_TYPE.RUN:
            case EVENT_TYPE.COMPILE:
                this.compileAndRunSource();
                break;
            case EVENT_TYPE.LINT:
                this.checkLint();
                break;
            case EVENT_TYPE.HIDE_NAVI:
                this.toggleNavigation();
                break;
            case EVENT_TYPE.HIDE_CONSOLE:
                this.toggleConsole();
                break;
            case EVENT_TYPE.SUBMIT_REPORT:
                this.openReportListModal();
            default: break;
        }

        this.props.setEventType(null);
    }

    getProject(cb) {
        Http.get({ path: `/projects/${this.props.match.params.id}` }).then(({ data }) => {
            this.props.setProject(data);
            if (typeof cb === 'function') cb();
        }).catch(() => { });
    }

    onChangeText(text) {
        const { openFiles, selectFile } = this.props;
        if (!selectFile) {
            this.createNewFile(text);
            return;
        }
        const idx = openFiles.indexOf(selectFile);
        openFiles[idx].data = text;
        openFiles[idx].modify = true;
        this.props.setOpenFiles(openFiles)
    }

    createFileIdx = 1;
    createNewFile(text = "") {
        console.log("시작");
        const file = {
            name: `undefined-${this.createFileIdx++}`,
            fullpath: null, modify: true,
            ext: "", data: text
        }

        this.props.pushOpenFile(file);
    }

    createFolderIdx = 1;
    createNewFolder(text = "") {
        const folder = {
            name: `undefined-${this.createFolderIdx++}`,
            fullpath: null,
            ext: "", data: text
        }
        console.log("폴더 생성");
        Alert({
            title: "새 폴더 생성",
            text: (<CreateNewFileBody project={this.props.project}
                onChangePath={(path) => { folder.dir = path }}
                onChangeName={(name) => { folder.name = name }}></CreateNewFileBody>),
            btns: [
                {
                    text: "예", onClick: () => {
                        console.log("createfilebody");
                        this.onSaveNewFolder(folder)
                    }
                },
                { text: "아니오", onClick: () => { } }
            ]
        });
    }

    onSaveNewFolder(folder) {
        console.log("e");
        const _path = folder.dir ? folder.dir + "/" : "" + folder.name;
        Http.post({
            path: `/projects/${this.props.project.id}`,
            params: { type: "directory" },
            payload: { name: folder.name, data: folder.data, path: folder.dir },
        }).then(({ data }) => {
            this.getProject(() => {
                const { project, openFiles } = this.props;
                const _find = (prev, curr) => {
                    if (curr.path === _path) return curr;
                    if (curr.files) {
                        const fileInChildren = curr.files.reduce(_find, undefined);
                        if (fileInChildren) return fileInChildren;
                    }

                    return prev;
                }

                const fileOnProject = project.files.reduce(_find, undefined);

                openFiles[openFiles.indexOf(folder)] = fileOnProject;
                this.props.setOpenFiles(Object.assign([], openFiles));
                this.props.setSelectFile(fileOnProject)
            });
        }).catch(e => {
            console.log(e);
            alert(e); // TODO: when fail to modify files
        });
    }//


    dropFile(file) {
        try {
            if(file != undefined){
            Alert({
                title: "파일을 삭제하시겠습니까?",
                text:
                    (<DeleteFileBody project={this.props.project}
                        onChangePath={(path) => { file.dir = path }}
                        onChangeName={(name) => { file.name = name }}></DeleteFileBody>),
                btns: [
                    {
                        text: "예", onClick: () => {
                            this.onDeleteFile(file);
                        }
                    },
                    { text: "아니오", onClick: () => { } }
                ]
            });
            return;
        } }     catch (e) {
        console.log(e.message);
    }
}

    onDeleteFile(file) {
        try {
            console.log("onDeleteFile Function Call")
            file.dir = file.path;
            const _path = file.dir;
            Http.post({
                path: `/projects/${this.props.project.id}`,
                params: { type: "delete" },
                payload: { name: file.name, data: file.data, path: file.dir },
            }).then(({ data }) => {
                this.getProject(() => {
                    const { project, openFiles } = this.props;
                    const _find = (prev, curr) => {
                        if (curr.path === _path) return curr;
                        if (curr.files) {
                            const fileInChildren = curr.files.reduce(_find, undefined);
                            if (fileInChildren) return fileInChildren;
                        }

                        return prev;
                    }

                    const fileOnProject = project.files.reduce(_find, undefined);

                    openFiles[openFiles.indexOf(file)] = fileOnProject;
                    this.props.setOpenFiles(Object.assign([], openFiles));
                    this.props.setSelectFile(fileOnProject)
                    //console.log("hihihi");
                    //console.log(this.props.project.id);
                });
            }).catch(e => {
                console.log(e);
                alert(e); // TODO: when fail to modify files
            });
        }
        catch (e) {
            console.log(e.message);
        }
    }

    /*
        dropFolder(folder) {
            
            const folder = {
                name: `undefined-${this.createFolderIdx++}`,
                fullpath: null,
                ext: "", data: text
            }
            
    
            console.log("DropFolder Function Call")
            console.log(folder);
    
            Alert({
                title: "폴더를 삭제하시겠습니까?",
                text: (<DeleteFolderBody project={this.props.project}
                    onChangePath={(path) => { folder.dir = path }}
                    onChangeName={(name) => { folder.name = name }}></DeleteFolderBody>),
    
                btns: [
                    {
                        text: "예", onClick: () => {
                            this.onDelteFolder(folder);
                        }
                    },
                    { text: "아니오", onClick: () => { } }
                ]
            });
            return;
        }
        onDelteFolder(folder) {
            console.log("onDeleteFolder Function Call");
            const _path = folder.dir ? folder.dir + "/" : "" + folder.name;
            console.log()
            Http.post({
                path: `/projects/${this.props.project.id}`,
                params: { type: "delete" },
                payload: { name: folder.name, data: folder.data, path: folder.dir },
            }).then(({ data }) => {
                this.getProject(() => {
                    const { project, openFiles } = this.props;
                    const _find = (prev, curr) => {
                        if (curr.path === _path) return curr;
                        if (curr.files) {
                            const fileInChildren = curr.files.reduce(_find, undefined);
                            if (fileInChildren) return fileInChildren;
                        }
    
                        return prev;
                    }
    
                    const fileOnProject = project.files.reduce(_find, undefined);
    
                    openFiles[openFiles.indexOf(folder)] = fileOnProject;
                    this.props.setOpenFiles(Object.assign([], openFiles));
                    this.props.setSelectFile(fileOnProject)
                });
            }).catch(e => {
                console.log(e);
                alert(e); // TODO: when fail to modify files
     *       });
       }
    */

    closeFile(file) {
        const { openFiles, selectFile } = this.props;
        const idx = openFiles.indexOf(file);
        if (idx === -1) return;

        const setNextFile = () => {
            openFiles.splice(idx, 1);
            this.props.closeFile(selectFile);
        }

        if (selectFile.modify) {
            Alert({
                title: "저장되지 않았습니다.",
                text: "저장하시겠습니까?",
                btns: [
                    {
                        text: "예", onClick: () => {
                            this.saveFile(selectFile, setNextFile);
                        }
                    },
                    {
                        text: "아니오", onClick: () => {
                            setNextFile();
                        }
                    },
                    { text: "취소", onClick: () => { } },
                ]
            });
            return;
        }

        setNextFile();
    }

    renameFile(file) {
        try {
            if(file != undefined){
        console.log("change");
        console.log(file.path);
        Alert({
            title: "파일명 변경",
            text: (<RenameFileBody project={this.props.project}
                onChangePath={(path) => { file.dir = path }}
                onChangeName={(name) => { file.name = name }}></RenameFileBody>),
            btns: [
                {
                    text: "예", onClick: () => {
                        console.log("createfilebody");
                        this.onSaveRenamedFile(file);
                    }
                },
                { text: "아니오", onClick: () => { } }
            ]
        });
    }}
     catch (e) {
    console.log(e.message);
     }
    }
    


    onSaveRenamedFile(file) {
        console.log(file);
        file.dir = file.path;
        const _path = file.dir;
        //file.dir ? file.dir + "/" : "" + file.name;
        console.log(_path);
        Http.post({
            path: `/projects/${this.props.project.id}`,
            params: { type: "rename" },
            payload: { name: file.name, data: file.data, path: file.dir },
        }).then(({ data }) => {
            this.getProject(() => {
                const { project, openFiles } = this.props;
                const _find = (prev, curr) => {
                    if (curr.path === _path) return curr;
                    if (curr.files) {
                        const fileInChildren = curr.files.reduce(_find, undefined);
                        if (fileInChildren) return fileInChildren;
                    }

                    return prev;
                }

                const fileOnProject = project.files.reduce(_find, undefined);

                openFiles[openFiles.indexOf(file)] = fileOnProject;
                this.props.setOpenFiles(Object.assign([], openFiles));
                this.props.setSelectFile(fileOnProject)
            });
        }).catch(e => {
            console.log(e);
            alert(e); // TODO: when fail to modify files
        });
    }

    onSaveNewFile(file) {
        const _path = file.dir ? file.dir + "/" : "" + file.name;
        Http.post({
            path: `/projects/${this.props.project.id}`,
            params: { type: "file" },
            payload: { name: file.name, data: file.data, path: file.dir },
        }).then(({ data }) => {
            this.getProject(() => {
                const { project, openFiles } = this.props;
                const _find = (prev, curr) => {
                    if (curr.path === _path) return curr;
                    if (curr.files) {
                        const fileInChildren = curr.files.reduce(_find, undefined);
                        if (fileInChildren) return fileInChildren;
                    }

                    return prev;
                }

                const fileOnProject = project.files.reduce(_find, undefined);

                openFiles[openFiles.indexOf(file)] = fileOnProject;
                this.props.setOpenFiles(Object.assign([], openFiles));
                this.props.setSelectFile(fileOnProject)
            });
        }).catch(e => {
            console.log(e);
            alert(e); // TODO: when fail to modify files
        });
    }

    saveFile(file, cb = () => { }) {
        if (!file) return;

        const { project } = Object.assign({}, this.props);
        function _find(prev, curr) {
            if (curr.fullpath === file.fullpath) return curr;
            if (curr.files) {
                const fileInChildren = curr.files.reduce(_find, undefined);
                if (fileInChildren) return fileInChildren;
            }

            return prev;
        }

        const fileOnProject = project.files.reduce(_find, undefined);

        if (!fileOnProject) {
            console.log("tnstj?")
            Alert({
                title: "새 파일 생성",
                text: (<CreateNewFileBody project={this.props.project}
                    onChangePath={(path) => { file.dir = path }}
                    onChangeName={(name) => { file.name = name }}></CreateNewFileBody>),
                btns: [
                    {
                        text: "예", onClick: () => {
                            console.log("createfilebody");
                            console.log(file.dir);
                            this.onSaveNewFile(file)
                        }
                    },
                    { text: "아니오", onClick: () => { } }
                ]
            });
            return;
        }

        console.log(file.path);

        Http.post({
            path: `/projects/${this.props.project.id}`,
            params: { type: "modify" },
            payload: { data: file.data, path: file.path },
            disableLoading: true
        }).catch(e => {
            console.log(e);
            alert(e); // TODO: when fail to modify files
        });

        file.modify = false; // 이게 왜되냐?
        fileOnProject.data = file.data;
        this.props.setProject(project);
        cb();
    }

    output = ""
    compileAndRunSource() {
        console.log("aa")
        const { project } = this.props;
        const socket = io(process.env.REACT_APP_API_SERVER);
        socket.emit("compile", { projectId: project.id });

        this.output = "";
        socket.on("projectInfo", (data) => {
            if (!data) {
                console.log("project is not exists!");
                socket.close();
                return;
            }
            console.log(data);

            this.output += "프로세스를 실행합니다.\n";
            this.setState({ consoleOut: this.output });
        });

        socket.on("result", (data) => {
            if (data.isEnd) {
                this.setState({ consoleOut: this.output += "\n\n프로세스를 종료합니다." });
                this.setState({ socket: null });
                socket.close();
            } else {
                this.setState({ consoleOut: this.output += data.line + "\n" });
            }
        });
        this.setState({ consoleType: "console", socket });
    }

    checkLint() {
        console.log("check lint");
        this.setState({ consoleType: "lint" });

        const { project } = this.props;
        const socket = io(process.env.REACT_APP_API_SERVER);
        socket.emit("lint", { projectId: project.id });

        let output = "";
        socket.on("lintProjectInfo", (data) => {
            if (!data) {
                console.log("project is not exists!");
                socket.close();
                return;
            }
            console.log(data);

            output += "린트를 검사합니다.\n";
            this.setState({ lintOut: output });
        });

        socket.on("result", (data) => {
            if (data.isEnd) {
                this.setState({ lintOut: output += "\n\n린트 검사를 종료합니다." });
                socket.close();
            } else {
                this.setState({ lintOut: output += data.line + "\n" });
            }
        });
    }

    toggleConsole() {
        const { console } = this.state;
        this.setState({ console: !console });
    }

    toggleNavigation() {
        const { navigation } = this.state;
        this.setState({ navigation: !navigation });
    }

    openReportListModal() {
        this.setState({ reportListModal: true });
    }

    consoleKeyDown(event) {
        console.log(this.state.consoleBuffer);
        if (event.keyCode === 13) {
            this.state.socket.emit("input", { input: this.state.consoleBuffer });
            this.setState({ consoleBuffer: "" });
            return;
        }
        const input = String.fromCharCode(event.keyCode)
        if (/^[a-zA-Z0-9]/.test(input)) this.setState({ consoleBuffer: this.state.consoleBuffer + input });
    }

    consoleChange(event) {
        if (!this.state.socket) return;
        if (!event.target.value.includes(this.output)) return;

        this.setState({ consoleOut: event.target.value });
    }

    render() {
        return (
            <>
                <ModalPortal>
                    {this.state.reportListModal &&
                        <ReportListModal
                            onClose={() => { this.setState({ reportListModal: false }) }}
                            project={this.props.project} />}
                </ModalPortal>
                <IDEcontainer {...this.props}
                    onChangeText={this.onChangeText.bind(this)}
                    consoleType={this.state.consoleType}
                    consoleOut={this.state.consoleOut}
                    lintOut={this.state.lintOut}
                    setConsoleType={(consoleType) => { this.setState({ consoleType }) }}
                    navigation={this.state.navigation}
                    consoleChange={this.consoleChange.bind(this)}
                    consoleKeyDown={this.consoleKeyDown.bind(this)}
                    _console={this.state.console} />
            </>
        );
    }
}

const mapStateToProps = (state) => {
    const { project, globalEvent } = state;

    return { ...project, globalEvent }
}

const mapDispatchToProps = (dispatch) => {

    return {
        setProject: (project) => { dispatch(setProject(project)); },
        closeFile: (file) => { dispatch(removeOpenFile(file)); },
        dropFile: (file) => { dispatch(dropFile(file)) },
        dropFolder: (folder) => { dispatch(dropFolder(folder)) },
        renameFile: (file) => { dispatch(renameFile(file)) },
        setEventType: (eventType) => { dispatch(setEventState(eventType)); },
        setOpenFiles: (files) => { dispatch(setOpenFiles(files)) },
        pushOpenFile: (file) => { dispatch(pushOpenFile(file)) },
        setSelectFile: (file) => { dispatch(selectFile(file)) },
        setSelctFolder: (folder) => { dispatch(selectFolder(folder)) }
    }
}

function ReportListModal({ project, onClose }) {
    const [reports, setReports] = React.useState([]);
    const [selectIdx, setSelectIdx] = React.useState(null);
    React.useEffect(() => {
        Http.get({
            path: "/reports"
        }).then(({ data }) => {
            setReports(data.reports);
            setSelectIdx(null);
        })
    }, []);
    const btns = [{
        text: "확인",
        onClick: () => {
            if (selectIdx === null) {
                alert("과제를 선택해주세요.");
                return;
            }

            console.log(project);
            Http.put({
                path: "/reports",
                payload: {
                    id: reports[selectIdx].id,
                    projectId: project.id
                }
            }).then(() => {
                alert("제출되었습니다.");
                onClose();
            }).catch(e => {
                alert("제출 중 오류가 발생했습니다.");
            })
        }
    }, {
        text: "취소",
        onClick: onClose
    }];

    return (
        <Modal className="REPORT_MODAL" title="과제 제출" btns={btns} onClose={onClose}>
            <p>* 과제를 선택해주세요.</p>
            <ul>
                {reports.map((report, key) => {
                    return (
                        <li key={`report-${key}`} onClick={() => { setSelectIdx(key) }}
                            className={classnames({ active: key === selectIdx })}>
                            {report.title} <span className="limit">{moment(report.limitedate).format('YYYY-MM-DD')}</span>
                        </li>
                    );
                })}
                {reports.length === 0 &&
                    <li>
                        제출 가능한 과제가 없습니다.
                    </li>
                }
            </ul>
        </Modal>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(IDERouter);