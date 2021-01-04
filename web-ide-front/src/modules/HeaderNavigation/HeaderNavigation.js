import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import { setEventState } from '../../actions';
import { EVENT_TYPE } from '../../routers/IDE-Rotuer';
import './HeaderNavigation.scss';


function HeaderNavigation() {
    const [ openIdx, setOpenIdx ] = React.useState(null);
    const { project } = useSelector(state=>({
        project: state.project.project,
        selectFile: state.project.selectFile
    }));
    const dispatch = useDispatch();

    const closeEvent = ()=>{setOpenIdx(null)};
    
    React.useEffect(()=>{
        window.addEventListener("click", closeEvent);
    }, [])
    const menuItems = [
        { 
            title: "파일",
            subitems: [
                { title: "저장", onClick: ()=>{
                    dispatch(setEventState(EVENT_TYPE.SAVE));
                } },
                { title: "새파일", onClick: () =>{
                    console.log("파일 생성")
                    dispatch(setEventState(EVENT_TYPE.NEW_FILE));
                } },
                { title: "새폴더", onClick: () =>{
                    console.log("폴더 생성");
                    dispatch(setEventState(EVENT_TYPE.NEW_FOLDER));
                } },
                { title: "파일 닫기", onClick: () => {
                    dispatch(setEventState(EVENT_TYPE.CLOSE_FILE));
                } }
            ]
        }, 
        {
            title: "디버그",
            subitems: [
                { title: "빌드", onClick: ()=>{
                    dispatch(setEventState(EVENT_TYPE.RUN));
                } },
                { title: "실행", onClick: ()=>{
                    dispatch(setEventState(EVENT_TYPE.RUN));
                } },
                { title: "빌드 + 실행", onClick: ()=>{
                    dispatch(setEventState(EVENT_TYPE.RUN));
                } },
                { title: "린트 검사", onClick: ()=>{
                    dispatch(setEventState(EVENT_TYPE.LINT));
                } },
            ]
        },
        {
            title: "화면",
            subitems: [
                { title: "콘솔 토글", onClick: () => {
                    dispatch(setEventState(EVENT_TYPE.HIDE_CONSOLE));
                } },
                { title: "네비게이션 토글", onClick: () => {
                    dispatch(setEventState(EVENT_TYPE.HIDE_NAVI));
                } },
            ]
        },
        {
            title: "과제",
            subitems: [
                { title: "과제 제출", onClick: () => {
                    dispatch(setEventState(EVENT_TYPE.SUBMIT_REPORT));
                }}
            ]
        }
    ]

    return (
        <header>
            <div className='HeaderFont'><h1>PLASS IDE</h1></div>
            <ul className="menu-items">
                { menuItems.map((item,idx)=>{
                return (
                <li className="menu-item" key={`menuitems-${idx}`} onClick={(event)=>{
                    event.stopPropagation();
                    if(openIdx !== idx) setOpenIdx(idx);
                    else setOpenIdx(null);
                }}>
                    {item.title}
                    <ul className={classnames({"sub-items": true, "on": openIdx === idx})}>
                        { item.subitems.map((subitem, _idx)=>{
                        return (
                        <li key={`menuitems-${idx}-sub-${_idx}`} onClick={() => {subitem.onClick(); setOpenIdx(null);}}>
                            {subitem.title}
                        </li>
                        )})}
                    </ul>
                </li>
                )
                })}
            </ul>
            <p className="title"> { project.name } </p>
        </header>
    )
}

export default HeaderNavigation;