import React from 'react';
import ReactDOM from 'react-dom';

let wrapperDIV = null;
function addToDocument() {
    wrapperDIV = document.createElement("div");
    document.body.appendChild(wrapperDIV);
}

function removeDocument() {
    if(!wrapperDIV) return;
    document.body.removeChild(wrapperDIV);
    wrapperDIV = null;
}

function onLoading() {
    if(wrapperDIV) return;

    const AlertModal = (
        <div className="MODAL centered" style={{display: "block" }}>
            <div className = "blob-1"></div>
            <div className = "blob-2"></div>
            <p className = "loading-text">계속해서 진행이 안되면 새로고침을 해주세요!</p>
        </div>
    )

    addToDocument();
    ReactDOM.render(AlertModal, wrapperDIV);
}

function offLoading() {
    removeDocument();
}

export {
    onLoading,
    offLoading
}