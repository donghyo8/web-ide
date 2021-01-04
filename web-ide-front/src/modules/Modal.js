import React from 'react';

function Modal({title, className, children, btns, onClose, disabledCloseByEscapeKey}) {
    React.useEffect(() => {
        window.addEventListener('keydown', closeEvent);
    }, []);

    function closeEvent(e) {
        if(e.key === 'Escape' && !disabledCloseByEscapeKey) {
            window.removeEventListener('keydown', closeEvent);
            onClose();
        }
    }

    return (
        <div className={"fullsize " + className} tabIndex="-1">
            <div className="modal-wrapper">
                <div className="modal-header">
                    {title}
                    <a className="close" onClick={onClose}>x</a>
                </div>
                <div className="modal-body">{children}</div>
                <div className="modal-footer">
                    {btns.map((btn,idx) => (
                    <button key={`btn-${idx}`} onClick={btn.onClick}>{btn.text}</button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Modal;