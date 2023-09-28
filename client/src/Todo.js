import React, { useState, useCallback } from 'react';
import { Typography, ListItem, ListItemText, InputBase, Checkbox, ListItemSecondaryAction, IconButton } from "@material-ui/core";
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
        const updatedItem = { ...item, done: !item.done };
        setItem(updatedItem);
        update(updatedItem);
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
                {item.deadline && (
                  <Typography component="span" variant="body2" style={{ marginRight: '1rem' }}>
                    마감일: {item.deadline}
                  </Typography>
                )}
                <Typography component="span" variant="body2">
                  중요도: {item.importance}
                </Typography>
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
