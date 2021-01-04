import React from 'react';
import PropTypes from 'prop-types'
ClassInfor.propTypes = {
    classInfo : PropTypes.object
}
ClassInfor.defaultProtypes = {
    classInfo : {}
}
function ClassInfor({classInfo}) {
    return (
        <div className="class__info">
            <div className = "row">
                <div className = "class__info-name">
                    <h1>{classInfo.title}_{classInfo.lecture_number}</h1>
                </div>
                <div className = "class__info-details">
                    <div className = "col span-1-of-2">
                        <table className = "table" border = "1">
                            <thead>
                                <tr>
                                    <th>이수구분</th>
                                    <th>학점</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{classInfo.lecture_type}</td>
                                    <td>{classInfo.score}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className = "col span-1-of-2">
                        <table className = "table" border = "1">
                            <thead>
                                <tr>
                                    <th>담당교수</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{classInfo.professor}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div> 
            </div>
        </div>
    );
}
export default ClassInfor
