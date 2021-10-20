import React, {useCallback, useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import {MenuItem, Select} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/reducers/rootReducer";
import PersonIcon from "@material-ui/icons/Person";
import {useHistory} from "react-router-dom";
import theme from "../../theme";
import {getAllTeams} from "../../store/actions/teamAction";
import {SYNC_STATUS_TEAM, TEAMS} from "../../constants/Constants";
import helpers from "../../util/helperFunctions";
import {TeamTO} from "../../api";
import {useTranslation} from "react-i18next";
import GroupIcon from "@mui/icons-material/Group";

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
    const dispatch = useDispatch();
    const { t } = useTranslation("common");



    const currentUser = useSelector((state: RootState) => state.user.currentUserInfo)


    const [activeIdentityName, setActiveIdentityName] = useState("");
    const [activeIdentityId, setActiveIdentityId] = useState("");
    const [teams, setTeams] = useState<Array<TeamTO>>([]);

    const fetchTeams = useCallback(() => {
        getAllTeams().then(response => {
            if (Math.floor(response.status / 100) === 2) {
                dispatch({ type: TEAMS, teams: response.data });
                setTeams(response.data)
                dispatch({ type: SYNC_STATUS_TEAM, dataSynced: true });
            } else {
                helpers.makeErrorToast(t(response.data.toString()), () => fetchTeams())
            }
        }, error => {
            helpers.makeErrorToast(t(error.response.data), () => fetchTeams())
        })
    }, [dispatch, t]);


    useEffect(() => {
        if(currentUser){
            fetchTeams()
            setActiveIdentityId(currentUser.id)
            setActiveIdentityName(currentUser.username)
        }
    }, [currentUser, fetchTeams])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const changeIdentity = (event: any) => {
        setActiveIdentityId(event.target.value)
        history.push(`/team/${event.target.value}`)
    }

    return (
        <div className={classes.container}>
            <FormControl>
                <Select

                    id="identity"
                    value={activeIdentityId}
                    onChange={event => changeIdentity(event)}>
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
                    {
                        teams?.map(team => (
                            <MenuItem value={team.id} key={team.id}>
                                <div className={classes.iconAndText}>
                                    <div className={classes.icon}>
                                        <GroupIcon/>
                                    </div>
                                    <div>
                                        {team.name}
                                    </div>
                                </div>
                            </MenuItem>
                        ))
                    }
                </Select>
            </FormControl>


        </div>
    )

})

export default Identity;