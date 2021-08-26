import React from "react";
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {Breadcrumbs, Link} from "@material-ui/core";
import {BASE_PATH} from "../../api/base";


interface Props {
    structure: Array<{name: string, link: string}>;
}


const PathStructure: React.FC<Props> = props => {
    const history = useHistory();
    const {t} = useTranslation("common");


    const openLink = (link: string) => {
        history.push( BASE_PATH + link)
    }


    return (
        <>
            <Breadcrumbs separator="›">
                {props.structure.map(crumb => (
                    <Link key={crumb.name} color={"inherit"} href={crumb.link} onClick={() => openLink(crumb.link)}>
                        {t(crumb.name)}
                    </Link>
                ))}
            </Breadcrumbs>
        </>

    );
};

export default PathStructure;