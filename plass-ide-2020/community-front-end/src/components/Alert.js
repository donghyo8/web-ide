import React from 'react'
import { render } from 'react-dom';
import { GiCancel } from "react-icons/gi";
function Alert({title, btns}) {
    const modal =  (
        <div className = "alert" tabIndex="-1">
            <div className = "model-wrapper">
                <p onClick = {removeDom}
                    style = {{
                        position: "absolute",
                        color: "white",
                        right: "15px"
                    }}
                ><GiCancel /></p>
                <div className = "model-header">
                    {title}
                </div>
                <div className = "model-footer">
                    {
                        btns.map((item, index) => (
                            <button key = {`btn-${index}`} className = "btn_primary"
                            onClick = {() => {
                                item.onClick()
                                removeDom()
                            }}
                            >{item.text}</button>
                        ))
                    }
                </div>
            </div>
        </div>
    )
    const element = document.createElement("div");
    document.body.appendChild(element);
    function removeDom(){
        document.body.removeChild(element);
    }
    render(modal, element);
}
export default Alert

