import React from 'react'
import { AiOutlineFilePdf, AiOutlineFilePpt, AiOutlineFileText, AiOutlineFileZip } from 'react-icons/ai'
import { FaRegFileWord } from 'react-icons/fa'
import ProTypes from 'prop-types'
DetectFile.proTypes = {
    fileName : ProTypes.string
}
DetectFile.defaultProtypes = {
    fileName : ''
}
function DetectFile({fileName}) {
    if(!fileName) return;
    try {
        if(fileName.includes(".pdf"))
            return (
                <AiOutlineFilePdf />
            )    
        else if(fileName.includes(".docx"))
            return (
                <FaRegFileWord />
            )  
        else if(fileName.includes(".pptx")) 
            return (
                <AiOutlineFilePpt />
            )  
        else if(fileName.includes(".zip")) 
            return (
                <AiOutlineFileZip />
            )  
        else
            return (
                <AiOutlineFileText />
            )  
    } catch (error) {
        console.log(error)
    }
}
export default DetectFile

