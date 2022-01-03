import { Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArtifactMilestoneTO } from "../../../api";
import MenuList, { MenuListConfig } from "../MenuList/MenuList";
import MilestoneListEntry from "./MilestoneListEntry";
import MilestoneListPopup from "./MilestoneListPopup";

interface Props {
    milestones: ArtifactMilestoneTO[];
    fallback: string;
    className?: string;
    onMenuClick: (operation: string, milestone: ArtifactMilestoneTO) => void;
    menuEntries: MenuListConfig;
}

const MilestoneList: React.FC<Props> = (props: Props) => {
    const { t } = useTranslation("common");

    const {
        fallback,
        menuEntries,
        onMenuClick,
        className,
        milestones
    } = props;

    // Make sure this component is re-rendered every 60 seconds to update the view and the times
    const [, setRenderKey] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setRenderKey(cur => cur + 1), 60000);
        return () => clearInterval(interval);
    }, []);

    const [menuAnchor, setMenuAnchor] = useState<{
        target: HTMLButtonElement;
        milestone: ArtifactMilestoneTO;
    }>();

    return (
        <div className={className}>
            {milestones.length === 0 && (
                <Typography variant="body1">
                    {t(fallback)}
                </Typography>
            )}
            {milestones.map(milestone => (
                <MilestoneListEntry
                    key={milestone.id}
                    milestone={milestone}
                    onMenuClicked={target => setMenuAnchor({ target, milestone })} />
            ))}
            <MilestoneListPopup
                anchor={menuAnchor?.target}
                onClose={() => setMenuAnchor(undefined)}>
                {({ close }) => (
                    <MenuList
                        onClick={action => {
                            if (menuAnchor) {
                                onMenuClick(action, menuAnchor.milestone);
                                setTimeout(close);
                            }
                        }}
                        options={menuEntries} />
                )}
            </MilestoneListPopup>
        </div>
    );
};

export default MilestoneList;
