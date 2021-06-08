import React, {useCallback, useState} from "react";
import {useDispatch} from "react-redux";
import PopupDialog from "../../components/Form/PopupDialog";

interface Props {
    open: boolean;
    onCancelled: () => void;
}

const UserManagementDialog: React.FC<Props> = props => {
    const dispatch = useDispatch()

    const { open, onCancelled } = props;

    const [error, setError] = useState<string | undefined>(undefined);



//#TODO: Display all users and an option to change their access rights (if the current user has the corresponding role)
    return (
        <PopupDialog
            open={open}
            title={"Users"}
            error={error}
            onCloseError={() => setError(undefined)}
            secondTitle="close"
            onSecond={onCancelled}

        />
    );
};


export default UserManagementDialog;