import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Provider} from 'react-redux';
import myStore from './_heapers/Store';
import {
    BrowserRouter as Router,
} from "react-router-dom";
import { history } from './_heapers/history';
ReactDOM.render(
    <Provider store = {myStore}>
        <Router history = {history}>
            <App/>
        </Router>
    </Provider>
    , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
