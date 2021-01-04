import React, { useState, Fragment } from 'react';
import './index.scss';

function SandboxNavigation({ }) {
    return (
            <div className="Sandbox-NAVIGATION">
                <p onClick={() => {}}>
                    <i class="fa fa-folder-open-o"></i>
                </p>
                <p onClick={() => {}}>
                <i class="fa fa-gear"></i>
                    {/*<img src={require('./images/setting-icon.png')} />*/}
                </p>
                <a href = "http://github.com" onClick={() => {}}>
                    <i class="fa fa-github" ></i>
                    {/* <img src={require('./images/github-icon.png')} /> */}
                </a>
            </div>
    );
}

export default SandboxNavigation;