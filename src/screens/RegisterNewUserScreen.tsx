import React, {useCallback, useEffect, useState} from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import LockIcon from "@material-ui/icons/Lock";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import {UserControllerApi} from "../api/api";
import {UserTO} from "../api/models";
import helpers from "../constants/Functions";
import {HANDLEDERROR, SUCCESS} from "../store/actions/diagramAction";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store/reducers/rootReducer";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright © "}
            <Link color="inherit" href="https://flowsquad.io">
                FlowSquad GmbH
            </Link>
            {", "}
            {new Date().getFullYear()}
            .
        </Typography>
    );
}

const useStyles = makeStyles(theme => ({
    createUserProfilePage: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    createUserProfileContent: {
        width: "100%",
        maxWidth: "960px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingLeft: "30px",
        paddingRight: "30px",
        paddingTop: "20vh",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: "deeppink"
    },
    infoText: {
        textAlign: "center",
        fontSize: "15px",
        width: "100%",
        maxWidth: "500px",
    },
    form: {
        width: "100%",
        maxWidth: "500px",
        marginTop: theme.spacing(3),
    },
    confirmationCheckbox: {
        marginTop: "15px",
    },
    createUserProfileButton: {
        marginTop: "25px",
        marginBottom: "50px",
        backgroundColor: "#0bb538",
    },
}));

/**
 * Creates a FlowRepo User profile
 * if a User with a given oAuth key does not have one yet.
 */
const RegisterNewUserScreen: React.FC = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch()


    const [userController] = useState<UserControllerApi>(new UserControllerApi());
    const [newUsername, setNewUsername] = useState<string>("Username");
    const [flowSquadEmail, setFlowSquadEmail] = useState<string>("");
    const [isButtonDisabled, setButtonDisabled] = useState<boolean>(true);


    const apiErrorState: string = useSelector((state: RootState) => state.api.errorMessage)
    const apiSuccessState: string = useSelector((state: RootState) => state.api.successMessage)


    useEffect(() => {
        if(apiErrorState){
            //toast can contain any component, the Retry Button (and the message: apiErrorState) has to be passed here
            //toast.error(<RepoCard repoTitle={"abc"} description={"def"} existingDiagrams={3} assignedUsers={2}></RepoCard>, {autoClose: 8000, pauseOnHover: true, role: "alert"})
            toast.error(apiErrorState, {autoClose: 8000, pauseOnHover: true})
            dispatch({type: HANDLEDERROR, errorMessage: ""})
        }
        if(apiSuccessState){
            toast.success(apiSuccessState, {autoClose: 4000, pauseOnHover: true})
            dispatch({type: SUCCESS, successMessage: ""})
        }

        (async () => {
            try {
                const config = helpers.getClientConfig(localStorage.getItem("oauth_token"))
                userController.getUserEmail(config).then(existingEmail => {
                    setFlowSquadEmail(existingEmail.data.email);
                })
            } catch (response) {
                toast.error("Could not get the email of the authenticated User. "
                    + "Please check your network-connection or try to reload the page");
            }
        })();
    }, [userController, setFlowSquadEmail, dispatch, apiErrorState, apiSuccessState]);

    /**
     * Persist a new User-profile in the FlowRepo-backend
     */
    const handleCreateUserProfile = useCallback(async (): Promise<void> => {
        const newProfile: UserTO = {
            userName: newUsername,
            email: flowSquadEmail
        };
        try {
            await userController.createUser(newProfile);
            history.push("/");
        } catch (response) {
            toast.error("Could not persist the new User");
        }
    }, [history, userController, newUsername, flowSquadEmail]);

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewUsername(event.target.value)
    }

    return (
        <div className={classes.createUserProfilePage}>
            <div className={classes.createUserProfileContent}>
                <Avatar className={classes.avatar}>
                    <LockIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up for Miragon Cloud Services
                </Typography>

                <p className={classes.infoText}>
                    This is the first time you are trying to access Miragon Cloud Services.
                    <br />
                    To use this service you need an account.
                    To create a new account, choose a name and accept the Terms and Conditions.
                </p>

                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        label="Your E-Mail address"
                        value={flowSquadEmail}
                        disabled />

                    <TextField
                        variant="outlined"
                        required
                        fullWidth
                        label="Your User Identifier"
                        onInput={handleInput}/>

                    <FormControlLabel
                        className={classes.confirmationCheckbox}
                        control={<Checkbox
                            checked={!isButtonDisabled}
                            onClick={() => setButtonDisabled(!isButtonDisabled)}
                            value="allowExtraEmails"
                            color="primary"/>}
                        label="I agree to the terms of service" />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.createUserProfileButton}
                        onClick={handleCreateUserProfile}
                        disabled={isButtonDisabled}>
                        Create a new User Profile
                    </Button>
                </form>
                <Copyright />
            </div>
            <ToastContainer />
        </div>
    );
};

export default RegisterNewUserScreen;
