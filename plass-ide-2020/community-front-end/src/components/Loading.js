import React from 'react'
import ReactLoading from 'react-loading';
export default function Loading() {
    return (
        <div className = "loading" style = {{
            display: "flex",
            justifyContent : "center",
            margin: "100px auto",

        }}>
            <ReactLoading type = {"spin"} color = {"#695b50"} height={100} width={100} />
        </div>
    )
}
