import { GetAppSharp } from "@material-ui/icons";
import ActionButton from "./ActionButton";
import {useTranslation} from "react-i18next";

interface Props {
    className?: string;
    onDownloadClick: () => void;
}

const DownloadButton: React.FC<Props> = props => {
    const { t } = useTranslation("common");

    return (
        <ActionButton
            onClick={e => {
                e.stopPropagation();
                props.onDownloadClick();
            }}
            label={t("repository.download")}
            icon={GetAppSharp}
            primary={false}
            active={false} />
    );
};

export default DownloadButton;