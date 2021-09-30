import {Breadcrumbs, Link} from "@material-ui/core";
import React from "react";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";

interface Props {
    structure: Array<{ name: string, link: string, onClick?: () => void}>;
}

const PathStructure: React.FC<Props> = props => {
    const history = useHistory();
    const { t } = useTranslation("common");

    const onClickMethod = (crumb: any)  => {
        crumb.onClick()
        history.push(crumb.link)
    }

    return (
        <Breadcrumbs separator="›">
            {props.structure.map(crumb => (
                <Link
                    href="#"
                    key={crumb.name}
                    color="inherit"
                    onClick={() => onClickMethod(crumb)}>
                    {t(crumb.name)}
                </Link>
            ))}
        </Breadcrumbs>
    );
};

export default PathStructure;
