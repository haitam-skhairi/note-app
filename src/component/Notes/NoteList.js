import React from "react";

const NoteList = (props) => (
    <div className="notes-list">
        {props.children}
    </div>
)

export default NoteList;