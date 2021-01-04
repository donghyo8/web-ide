import React from 'react'
import PropTypes from 'prop-types'
import { AiOutlineFilePdf, AiOutlineFilePpt, AiOutlineFileText } from 'react-icons/ai'
import { FaRegFileWord } from 'react-icons/fa'
function DetectFile({fileName}) {
    if(!fileName) return;
    try {
        if(fileName.includes(".c") && !fileName.includes(".cpp"))
            return (
                <img src='https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/c.svg'/>
            )    
//        else if(fileName.includes(".java"))
//            return (
//                <img src={require('./images/java.png')}/>
//            )  
        else if(fileName.includes(".java"))
            return (
                <img src='https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/java.svg'/>
            )
        else if(fileName.includes(".cpp")) 
            return (
                <img src='https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/cpp.svg'/>
            )
        else if(fileName.includes(".py"))
            return (
                <img src= "https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/python.svg" />
            )
        else if(fileName.includes(".r") || fileName.includes(".R"))
            return (
                <img src= "https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons/r.svg"/>
            )
        else
            return (
                <img src={require('./images/file.png')}/>
            )   
    } catch (error) {
        console.log(error)
    }
}

export default DetectFile

