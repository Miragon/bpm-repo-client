import {Icon, IconButton, List, ListItem} from "@material-ui/core";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";

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
    onAdd: () => void;
    onRemove: () => void;
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
            {props.options.map(option => (
                <ListItem className={classes.listItem} button>
                    <div className={classes.leftPanel}>
                        <IconButton>
                            <Icon color={option.selected ? "secondary" : "disabled"} onClick={() => option.onAdd()}>
                                {props.selectIcon}
                            </Icon>
                        </IconButton>
                    </div>
                    <div className={classes.middlePanel}>
                        {option.name}
                    </div>
                    <div className={classes.rightPanel}>
                        <IconButton className={classes.removeIcon} onClick={() => option.onRemove()}>
                            <Icon>
                                {props.removeIcon}
                            </Icon>
                        </IconButton>
                    </div>
                </ListItem>
            ))}
        </List>
    );
};

export default MultipleSelectionList;
