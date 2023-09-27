import React, { useState, useCallback } from 'react';
import { ListItem, ListItemText, InputBase, Checkbox, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";

function Todo({ item: initialItem, delete: deleteTodo, update }) {
    const [item, setItem] = useState(initialItem);
    const [readOnly, setReadOnly] = useState(true);

    const deleteEventHandler = useCallback(() => {
        deleteTodo(item);
    }, [item, deleteTodo]);

    const offReadOnlyMode = useCallback(() => {
        setReadOnly(false);
    }, []);

    const enterKeyEventHandler = useCallback((e) => {
        if (e.key === "Enter") {
            setReadOnly(true);
            update(item);
        }
    }, [item, update]);

    const editEventHandler = useCallback((e) => {
        setItem(prevItem => ({ ...prevItem, title: e.target.value }));
    }, []);

    const checkboxEventHandler = useCallback(() => {
        setItem(prevItem => ({ ...prevItem, done: !prevItem.done }));
        setReadOnly(true);
        update(item);
    }, [item, update]);

    return (
        <ListItem>
            <Checkbox
                checked={item.done}
                onChange={checkboxEventHandler}
            />
            <ListItemText>
                <InputBase
                    inputProps={{ "aria-label": "naked", readOnly: readOnly }}
                    type="text"
                    id={item.id}
                    name={item.id}
                    value={item.title}
                    multiline={true}
                    fullWidth={true}
                    onClick={offReadOnlyMode}
                    onChange={editEventHandler}
                    onKeyPress={enterKeyEventHandler}
                />
            </ListItemText>

            <ListItemSecondaryAction>
                <IconButton aria-label="Delete"
                    onClick={deleteEventHandler}>
                    <DeleteOutlined />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
}

export default Todo;
