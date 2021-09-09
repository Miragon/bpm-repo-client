import { Breadcrumbs, Link } from "@material-ui/core";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

interface Props {
    structure: Array<{ name: string, link: string }>;
}

const PathStructure: React.FC<Props> = props => {
    const history = useHistory();
    const { t } = useTranslation("common");

    return (
        <Breadcrumbs separator="›">
            {props.structure.map(crumb => (
                <Link
                    href="#"
                    key={crumb.name}
                    color="inherit"
                    onClick={() => history.push(crumb.link)}>
                    {t(crumb.name)}
                </Link>
            ))}
        </Breadcrumbs>
    );
};

export default PathStructure;
