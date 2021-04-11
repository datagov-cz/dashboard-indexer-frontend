import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import reportWebVitals from './reportWebVitals';
import Home from "./Home";
import {BrowserRouter as Router, Route} from "react-router-dom";
import React from "react";
import Edit from "./Edit";
import NavBar from "./NavBar";


// ========================================

ReactDOM.render(
    <Router>
        <NavBar/>
        <Route exact path={"/"}>
            <Home/>
        </Route>
        <Route exact path={["/index/:name","/index"]} children={<Edit/>}/>
    </Router>,
    document.getElementById('root')
)
;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
