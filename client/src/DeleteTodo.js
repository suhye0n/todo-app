import React from "react";
import { IconButton, Button } from "@material-ui/core";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";

function DeleteTodo(props) {

    const deleteEventHandler = () => {
        console.log("delete completed Todo");
        props.deleteForCompleted();
    }

    return (
        <div>
            <Button
                onClick={deleteEventHandler}
                type="submit"
                variant="contained"
                color="primary">
                완료한 할일 삭제 <DeleteOutlined />
            </Button>
        </div>
    );
}

export default DeleteTodo;
