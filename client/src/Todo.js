import React, { useState, useCallback } from 'react';
import { Typography, ListItem, ListItemText, InputBase, Checkbox, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";
import { useDarkMode } from "./DarkModeContext";
import styled from 'styled-components';

const StyledListItem = styled(ListItem)`
    background-color: ${({ darkMode }) => darkMode ? "#333" : "#fff"};
    color: ${({ darkMode }) => darkMode ? "#e0e0e0" : "#333"};
`;

const StyledInputBase = styled(InputBase)`
    background-color: ${({ darkMode }) => darkMode ? "#333" : "#fff"};
    color: ${({ darkMode }) => darkMode ? "#e0e0e0" : "#333"};
    
    &::placeholder {
        color: ${({ darkMode }) => darkMode ? "#888" : "#aaa"};
    }
`;

const ImportanceIndicator = styled.span`
  display: inline-block;
  width: 23px;
  height: 22px;
  padding: 5px;
  border-radius: 50%;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
  
  ${props => props.level === '상' && `
    background: #ff968a;
    color: white;
  `}
  
  ${props => props.level === '중' && `
    background: #ffd8be;
    color: black;
  `}
  
  ${props => props.level === '하' && `
    background: #c6dbda;
    color: white;
  `}
  
  ${props => (!props.level || props.level === 'x') && `
    background: #eee;
  `}
`;

function Todo({ item: initialItem, delete: deleteTodo, update }) {
    const [item, setItem] = useState(initialItem);
    const [readOnly, setReadOnly] = useState(true);
    const { darkMode, setDarkMode } = useDarkMode();

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
        <StyledListItem darkMode={darkMode}>
            <Checkbox
                checked={item.done}
                onChange={checkboxEventHandler}
            />
            <ListItemText>
                <StyledInputBase
                    inputProps={{ "aria-label": "naked", readOnly: readOnly }}
                    type="text"
                    id={item.id}
                    name={item.id}
                    value={item.title}
                    darkMode={darkMode}
                    multiline={true}
                    fullWidth={true}
                    onClick={offReadOnlyMode}
                    onChange={editEventHandler}
                    onKeyPress={enterKeyEventHandler}
                />
                {item.deadline && (
                    <Typography component="span" variant="body2" style={{ marginRight: '1rem' }}>
                        📅 {item.deadline}
                    </Typography>
                )}
            </ListItemText>
            <ListItemSecondaryAction>
                <Typography component="span" variant="body2">
                    <ImportanceIndicator level={item.importance}>
                        {item.importance === '상' && '!!!'}
                        {item.importance === '중' && '!!'}
                        {item.importance === '하' && '!'}
                        {item.importance === 'x' && 'ㅤ'}
                    </ImportanceIndicator>
                </Typography>
                <IconButton aria-label="Delete"
                    style={{marginLeft: 30}}
                    onClick={deleteEventHandler}>
                    <DeleteOutlined />
                </IconButton>
            </ListItemSecondaryAction>
        </StyledListItem>
    );
}

export default Todo;
