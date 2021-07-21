import React from "react";
import {makeStyles} from "@material-ui/styles";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import {useHistory} from "react-router-dom";
import theme from "../../theme";

const useStyles = makeStyles(() => ({
    container: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        marginBottom: "15px"
    },
    element: {
        fontSize: "16px",
        display: "flex",
        flexDirection: "row",
        color: theme.palette.primary.main,
        cursor: "pointer",
        "&:hover": {
            color: theme.palette.primary.light
        }
    },
    icon: {
        height: "15px",
        width: "15px",
        paddingRight: "50px",
        paddingLeft: "20px"
    }

}));




interface Props {
    structure: Array<{name: string, link: string}>;
}


const PathStructure: React.FC<Props> = props => {
    const classes = useStyles();
    const history = useHistory();


    const openLink = (link: string) => {
        history.push(link)
    }


    return (
        <>
            <div className={classes.container} >
                {props.structure.map((element, index) => (
                    <div
                        className={classes.element}
                        key={element.name}>
                        <div onClick={() => openLink(element.link)}>
                            {element?.name}
                        </div>
                        <div className={classes.icon}>
                            {(index < props.structure.length - 1) ? <ArrowForwardIosIcon fontSize={"small"} /> : null}
                        </div>
                    </div>
                ))}
            </div>


        </>

    );
};

export default PathStructure;