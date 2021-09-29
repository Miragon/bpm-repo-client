import React, {useCallback, useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import {InputLabel, MenuItem, Select} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/reducers/rootReducer";
import PersonIcon from "@material-ui/icons/Person";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import {getAllTeams} from "../../store/actions/teamAction";
import {SYNC_STATUS_TEAM, TEAMS} from "../../constants/Constants";
import helpers from "../../util/helperFunctions";
import {useTranslation} from "react-i18next";
import {TeamTO} from "../../api";
import {getTeamUrl} from "../../util/Redirections";
import {useHistory} from "react-router-dom";


const useStyles = makeStyles(() => ({
    container: {
        minWidth: "150px",
        paddingRight: "20px",
        display: "flex",
        justifyContent: "space-between",
        whiteSpace: "nowrap"
    },
    icon: {
        flexGrow: 1
    },
    name: {
        flexGrow: 3
    },
    iconAndText: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    }
}));


export interface identityElement {
    name: string;
    type: "user" | "team";
}



const Identity: React.FC = (() => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const {t} = useTranslation("common")


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
        fetchTeams()
        setActiveIdentityId(currentUser.id)
        setActiveIdentityName(currentUser.username)
    }, [currentUser, fetchTeams])


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
                    onChange={changeIdentity}>
                    <MenuItem value={activeIdentityId}>
                        <div className={classes.iconAndText}>
                            <div>
                                <PersonIcon/>
                            </div>
                            <div>
                                {activeIdentityName}
                            </div>
                        </div>
                    </MenuItem>
                    {
                        teams?.map(team => (
                            <MenuItem value={team.id}>
                                <div className={classes.iconAndText}>
                                    <div>
                                        <PeopleAltIcon/>
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

            <div className={classes.icon}>

            </div>
            <div className={classes.name}>

            </div>

        </div>
    )

})

export default Identity;