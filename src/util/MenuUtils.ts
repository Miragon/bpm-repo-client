import {
    CloudUploadOutlined,
    CreateNewFolderOutlined,
    FormatShapesOutlined,
    NoteAddOutlined,
    TuneOutlined
} from "@material-ui/icons";
import { TFunction } from "i18next";
import { ArtifactTypeTO } from "../api";
import { MenuListConfig } from "../components/MenuList/MenuList";

const CUSTOM_ICONS: { [key: string]: React.ElementType } = {
    "CONFIGURATION": TuneOutlined,
    "FORM": FormatShapesOutlined
};

export const getAddOptions = (artifactTypes: ArtifactTypeTO[], showAddRepository: boolean): MenuListConfig => {
    const config: MenuListConfig = [];

    if (showAddRepository) {
        config.push([
            {
                label: "repository.create",
                value: "create-repository",
                icon: CreateNewFolderOutlined
            }
        ]);
    }

    config.push(
        artifactTypes.map(type => ({
            label: `artifact.create.${type.name}`,
            value: `create-file-${type.name}`,
            icon: CUSTOM_ICONS[type.name] || NoteAddOutlined
        }))
    );

    config.push([
        {
            label: "artifact.upload",
            value: "upload-file",
            icon: CloudUploadOutlined
        }
    ]);

    return config;
};

export const getFilterConfig = (artifactTypes: ArtifactTypeTO[], t: TFunction): MenuListConfig => {
    return [
        artifactTypes.map(type => ({
            value: type.name.toLowerCase(),
            label: t(`artifact.filter.${type.name}`)
        }))
    ];
};

export const getSortConfig = (t: TFunction): MenuListConfig => {
    return [
        [
            { value: "createdAt", label: t("sort.created") },
            { value: "editedAt", label: t("sort.edited") },
            { value: "name", label: t("sort.name") },
            { value: "type", label: t("sort.type") }
        ]
    ];
};
