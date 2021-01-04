import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { FaSearch } from 'react-icons/fa';

function Search({method, option, onSubmit}) {
    const [serachTerm, setSearchTerm] = useState('');
    const [serachOption, setSearchOption] = useState(option[0]);
 
    function handleOnSubmit(e)
    {
        e.preventDefault();
        const fomrValues = {
            option : serachOption,
            text : serachTerm,
            method : method
        }
        onSubmit(fomrValues);
    }
    return (
        <div className = "search">
            <form onSubmit = {handleOnSubmit}>
                <select value = {serachTerm.option} name = "option" onChange = {(e) => {
                    setSearchOption(e.target.value)
                }} className = "select_option" required="required">
                    <option value="제목">제목</option>
                    <option value="작성자">작성자</option>
                </select>
                <div className = "search_box">
                    <input  className = "search_box-text" type="text" name = "text"  onChange = {(e) => {
                        setSearchTerm(e.target.value)
                    }} placeholder = "Search.." ></input>
                    <button className = "search_box-btn" type="submit"><i className="icon" onClick = {handleOnSubmit}><FaSearch/></i></button>
                </div>
            </form>
        </div>
    )
}

Search.propTypes = {
    onSubmit : PropTypes.func.isRequired,
}
Search.defaultProps = {
    onSubmit : null
}
export default Search

