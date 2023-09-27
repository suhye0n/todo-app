import React from "react";
import {
    IconButton,
} from "@material-ui/core";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";

function DeleteTodo(props) {

    const deleteEventHandler = () => {
        console.log("delete completed Todo");
        props.deleteForCompleted();
    }

    return (
        <div>
            <span>완료한 할일 삭제</span>
            <IconButton
                aria-label="Delete Completed Todo"
                onClick={deleteEventHandler}
            >
                <DeleteOutlined />
            </IconButton>
        </div>
    );
}

export default DeleteTodo;
