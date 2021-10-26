import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import {MenuItem, Select} from "@material-ui/core";
import {useSelector} from "react-redux";
import {RootState} from "../../store/reducers/rootReducer";
import PersonIcon from "@material-ui/icons/Person";
import {useHistory} from "react-router-dom";
import theme from "../../theme";


const useStyles = makeStyles(() => ({
    container: {
        minWidth: "150px",
        paddingRight: "20px",
        display: "flex",
        justifyContent: "space-between",
        whiteSpace: "nowrap",
        color: theme.palette.primary.contrastText
    },
    icon: {
        marginRight: "10px",
        flexGrow: 1
    },
    name: {
        flexGrow: 3
    },
    iconAndText: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    contrastText: {
        color: "white"
    }
}));



const Identity: React.FC = (() => {
    const classes = useStyles();
    const history = useHistory();


    const currentUser = useSelector((state: RootState) => state.user.currentUserInfo)


    const [activeIdentityName, setActiveIdentityName] = useState("");
    const [activeIdentityId, setActiveIdentityId] = useState("");




    useEffect(() => {
        if(currentUser){
            //TODO: Uncomment the fetchTeams function as soon as the team-function returns
            //fetchTeams()
            setActiveIdentityId(currentUser.id)
            setActiveIdentityName(currentUser.username)
        }
    }, [currentUser])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const changeIdentity = (event: any) => {
        setActiveIdentityId(event.target.value)
        history.push(`/team/${event.target.value}`)
    }

    return (
        <div className={classes.container}>
            <FormControl>
                <Select
                    disabled
                    id="identity"
                    value={activeIdentityId}
                    onChange={event => changeIdentity}>
                    <MenuItem value={activeIdentityId}>
                        <div className={classes.iconAndText}>
                            <div className={classes.icon}>
                                <PersonIcon htmlColor={"white"}/>
                            </div>
                            <div className={classes.contrastText}>
                                {activeIdentityName}
                            </div>
                        </div>
                    </MenuItem>


                </Select>
            </FormControl>


        </div>
    )

})

export default Identity;