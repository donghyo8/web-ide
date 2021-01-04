import React from 'react';
import {
  Route,
} from "react-router-dom";
import Index from '../pages/Index'
import Main from '../pages/_Community/Main';
class Routes extends React.Component {
    render() {
      return (    
      <>
        <Route exact path = "/" component = {Index}/>
        <Route  path = "/main" component = {Main} />
      </>
      )
    }
  }
export default Routes;