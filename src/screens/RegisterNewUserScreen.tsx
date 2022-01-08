import { makeStyles } from "@material-ui/core/styles";
import { Flare } from "@material-ui/icons";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { UserApi } from "../api/api";
import PopupDialog from "../components/Form/PopupDialog";
import { loadUserInfo } from "../store/UserInfoState";
import { apiExec, hasFailed } from "../util/ApiUtils";
import { makeErrorToast } from "../util/ToastUtils";

const useStyles = makeStyles(theme => ({
    icon: {
        fontSize: "3rem",
        color: "white"
    },
    infoText: {
        margin: "0.5rem 0",
        textAlign: "center"
    }
}));

const RegisterNewUserScreen: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation("common");

    const [disabled, setDisabled] = useState(false);

    const createUserProfile = useCallback(async () => {
        setDisabled(true);
        const response = await apiExec(UserApi, api => api.createUser());
        if (hasFailed(response)) {
            setDisabled(false);
            makeErrorToast(t(response.error));
        } else {
            dispatch(loadUserInfo(true));
        }
    }, [t, dispatch]);

    return (
        <PopupDialog
            open
            title={t("registration.signup")}
            firstTitle={t("registration.create")}
            onFirst={createUserProfile}
            disabled={disabled}
            icon={<Flare className={classes.icon} />}>
            <p className={classes.infoText}>
                {t("registration.firstTime")}
            </p>
            <p className={classes.infoText}>
                {t("registration.accountRequired")}
            </p>
        </PopupDialog>
    );
};

export default RegisterNewUserScreen;
