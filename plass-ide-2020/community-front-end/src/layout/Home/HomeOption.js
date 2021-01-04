import React from 'react';
import {NavLink} from "react-router-dom";
import classname from 'classname';
import PropTypes from 'prop-types'

HomeOption.propTypes = {
  headerText : PropTypes.array
}

HomeOption.defaultProtypes = {
  headerText : []
}

function HomeOption({headerText}) {
  return (
    <ul   className = "ul-nolist-inline">
    {
        headerText.map((item,index) => 
        <li key={`li-${index}`} className={classname({ 'select-home': item.isSelected })}>
            <NavLink  exact to = {`/main/home/${item.page}`}>{item.title}</NavLink>
        </li>
      ) 
    }
  </ul>
  )
}
export default HomeOption
