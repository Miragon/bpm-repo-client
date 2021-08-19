import {Icon, IconButton, List, ListItem, Paper} from "@material-ui/core";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import UserListItem from "../../RepositoryDetails/Dialogs/UserListItem";

const useStyles = makeStyles(() => ({

    listItem: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    leftPanel: {
    },
    middlePanel: {
    },
    rightPanel: {
    },
    removeIcon: {
        color: "grey",
    }
}))

export interface MultipleSelectionListItem {
    name: string;
    selected: boolean;
    onClick: () => void;
    editable: boolean;
}

interface Props {
    options: Array<MultipleSelectionListItem>;
    artifactId: string;
    selectIcon: string;
    removeIcon: string;
}


const MultipleSelectionList: React.FC<Props> = props => {
    const classes = useStyles();


    return (
        <List>
            <Paper>
                
            
                {props.options.map(option => (
                    <ListItem className={classes.listItem} button key={option.name}>
                        <div className={classes.leftPanel}>
                            <IconButton onClick={() => option.onClick()}>
                                <Icon color={option.selected ? "secondary" : "disabled"}>
                                    {props.selectIcon}
                                </Icon>
                            </IconButton>
                        </div>
                        <div className={classes.middlePanel}>
                            {option.name}
                        </div>
                        <div>
                            {option.selected && "SHARED"}
                        </div>
                    </ListItem>
                ))}
            </Paper>
        </List>
    );
};

export default MultipleSelectionList;
