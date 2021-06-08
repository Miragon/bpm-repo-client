import React from "react";
import {makeStyles} from "@material-ui/core/styles";

interface ContainerProps {
    category: string;
}

const useStyles = makeStyles(() => ({

    body: {
        background: "#fff",
    },
DiagramContainer: {
        height: "400px",
        width: "93%",
        top: "75px",
        left: "100px",
        position: "relative",
        backgroundColor: "white",
        borderTop: "2px solid #ccc",
    "&:h1": {
        paddingLeft: "20px",
        color:"black",
        fontSize: "20px",
        fontWeight: "normal",
        }
    },


ScrollBarDiagram: {
        height: "340px",
        top: "50px",
        overflowX: "auto",
        display: "flex",
        flexWrap: "nowrap",
    }
}));


const DiagramContainer: React.FC<ContainerProps> = (props: ContainerProps) =>{
    const classes = useStyles();


        return <div className={classes.DiagramContainer}><h1>{props.category}</h1>
            <div className={classes.ScrollBarDiagram}>

 </div>
        </div>
}

export default DiagramContainer;