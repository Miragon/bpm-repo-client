import {Icon, IconButton, List, ListItem, Paper} from "@material-ui/core";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {ShareWithRepositoryTORoleEnum} from "../../../../api";

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

export interface SharedListItem {
    name: string;
    role: ShareWithRepositoryTORoleEnum;
    onClick: () => void;
    editable: boolean;
}

interface Props {
    options: Array<SharedListItem>;
    artifactId: string;
}


const SharedRepositoryItem: React.FC<Props> = props => {
    const classes = useStyles();


    //TODO: Auf der rechten Seit auswählen lassen, welche Rolle das Repo haben soll
    //TODO: Share Icon ändern, sodass es bei hover grau wird
    return (
        <List>
            <Paper>
                
            
                {props.options.map(option => (
                    <ListItem className={classes.listItem} button key={option.name}>
                        <div className={classes.leftPanel}>
                            <IconButton onClick={() => option.onClick()}>
                                <Icon color={"secondary"}>
                                    {"shareIcon"}
                                </Icon>
                            </IconButton>
                        </div>
                        <div className={classes.middlePanel}>
                            {option.name}
                        </div>
                        <div>
                            {option.role}
                        </div>
                    </ListItem>
                ))}
            </Paper>
        </List>
    );
};

export default SharedRepositoryItem;
