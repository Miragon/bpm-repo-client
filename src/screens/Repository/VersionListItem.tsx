import React, {useCallback, useEffect} from 'react';
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles(() => ({
    itemLine: {
        display: "flex",
        flexDirection: "row",
        transition: "background-color: .3s",
        "&:hover": {
            backgroundColor: "lightgrey",
        }
    },
}));

interface Props {
    releaseNo: string;
    milestoneNo: string;
    comment: string;
    updatedDate: string;
}

const VersionListItem: React.FC<Props> = ((props: Props) => {
    const classes = useStyles();




    return (
        <tr>
            <td>
                {props.releaseNo} {props.milestoneNo}
            </td>

            <td>
                {props?.comment}
            </td>
            <td>
                {props.updatedDate}
            </td>
        </tr>

    );
});
export default VersionListItem