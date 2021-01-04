import React, {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';

import moment from 'moment';
import './IDE-Projects.scss';
import Http from '../modules/Http';
import ModalPortal from '../modules/ModalPortal';
import { resetProject } from '../actions';


function IDEProjects({history}) {
    const [ projects, setProjects ] = useState([]);
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(resetProject());
        setProjectList();
    }, []);

    function setProjectList() {
        Http.get({ path: "/projects" }).then(({ data })=> {
            data = data.map((e)=>{
                e.createdAt = moment(e.createdAt);
                return e;
            })
            setProjects(data); 
        }).catch((err) => { })
    }

    function clickProject(project_id) {
        history.push(`/ide/${project_id}`);
    }

    function clickMenu(idx) {
        return (event) => {
            event.stopPropagation();
        }
    }

    const [ modal, setModal ] = React.useState(false);
    function openCreateModal() {
        setModal(true);
    }

    async function postProject(name, category) {
        console.log({name, category});
        if( !name || !category ) {
            alert("입력값을 확인해주세요.");
            return;
        }
        try {
            await Http.post({
                path: "projects",
                payload: { name, category }
            });
            setProjectList();
            setModal(false);
        } catch(e) {
            alert("서버 오류. 잠시 후 다시 시도해주세요.")
        }
    }

    return (
        <>
            { modal && <ModalPortal>
                <CreateProjectModal onSubmit={postProject} onClose={()=>{setModal(false)}}/>
            </ModalPortal> }
            <div className="IDE-Project">
                <div className="container">
                    <h1>프로젝트 목록</h1>
                    <table className="project-list">
                        <thead>
                            <tr>
                                <td style={{width: "50px"}}></td>
                                <td style={{width: "35%"}}>프로젝트 명</td>
                                <td className="center">language</td>
                                <td className="center">created at</td>
                                <td style={{width: "50px"}}></td>
                            </tr>
                        </thead>
                        <tbody>
                        { projects.length === 0 && 
                            <tr>
                                <td colSpan="5" className="center">
                                    <p>프로젝트가 존재하지 않습니다. 새로운 프로젝트를 만드시겠습니까?</p>
                                </td>
                            </tr>}
                            <>
                                {projects.map((project, idx)=>(
                                <tr className="project-item" key={idx} 
                                    onClick={()=> {clickProject(project.id)}}>
                                    <td className="td-idx center">{idx + 1}</td>
                                    <td>{project.name}</td>
                                    <td className="center">{project.category}</td>
                                    <td className="center">{project.createdAt.format('YYYY-MM-DD')}</td>
                                    <td>
                                        <div className="hamberger" 
                                            onClick={clickMenu(idx)}>
                                            <span></span><span></span><span></span>
                                        </div>
                                    </td>
                                </tr>
                                ))}
                                <tr>
                                    <td colSpan="5" className="center" onClick={openCreateModal}>
                                        <p>새 프로젝트 생성하기</p>
                                    </td>
                                </tr>
                            </>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

function CreateProjectModal({ onClose, onSubmit}) {
    const [ name, setName ] = React.useState("");
    const [ category, setCategory ] = React.useState("");
    return (
        <div className="fullsize" tabIndex="-1">
            <div className="modal-wrapper">
                <div className="modal-header">
                    프로젝트 생성
                    <a className="close" onClick={()=>{onClose()}}>x</a>
                </div>
                <div className="modal-body">
                    <div className="save-modal">
                        <div className="input-form">
                            <label htmlFor="save-modal-name">프로젝트명</label>
                            <input id="save-modal-name" type="text" value={name} 
                                onChange={(e)=>{setName(e.target.value)}}/>
                        </div>
                        <div className="input-form">
                            <label htmlFor="set-category">사용 언어</label>
                            <select id="set-category" value={category} 
                                onChange={(e)=>{setCategory(e.target.value)}}>
                                <option value="">언어를 선택해주세요</option>
                                <option value="c">C</option>
                                <option value="cpp">C++</option>
                                <option value="java">JAVA</option>
                                <option value="python">PYTHON</option>
                                <option value="r">R</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={()=>{onSubmit(name, category)}}>확인</button>
                    <button onClick={()=>{onClose()}}>취소</button>
                </div>
            </div>
        </div>
    )
}

export default IDEProjects;