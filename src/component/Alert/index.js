import React from "react";

const Alert = (props) => (
    <div className='alert-container'>
        <ul>
            {props.validationErrors.map((message, index) => <li key={index}>{message}</li>)}
        </ul>
    </div>
)

export default Alert;