import {
    CloudDownloadOutlined,
    CreateNewFolderOutlined,
    DeleteOutlineOutlined,
    EditOutlined,
    HistoryOutlined,
    LaunchOutlined,
    SaveOutlined,
    ShareOutlined
} from "@material-ui/icons";
import React from "react";
import { ArtifactTypeTO, RepositoryTO } from "../../api";
import { FileDescription } from "./FileListEntry";
import WrapperFileList from "./WrapperFileList";

const DETAIL_OPTIONS = [
    [
        {
            label: "milestone.openLatest",
            value: "open-latest",
            icon: LaunchOutlined
        },
        {
            label: "milestone.create",
            value: "create-milestone",
            icon: SaveOutlined
        },
        {
            label: "milestone.list",
            value: "list-milestones",
            icon: HistoryOutlined
        }
    ],
    [
        {
            label: "artifact.edit",
            value: "edit-file",
            icon: EditOutlined
        },
        {
            label: "artifact.share",
            value: "share-file",
            icon: ShareOutlined
        },
        {
            label: "artifact.download",
            value: "download-file",
            icon: CloudDownloadOutlined
        }
    ],
    [
        {
            label: "artifact.copyTo",
            value: "copy-file",
            icon: CreateNewFolderOutlined
        }
    ],
    [
        {
            label: "artifact.delete",
            value: "delete-file",
            icon: DeleteOutlineOutlined
        }
    ]
];

interface Props {
    fallback: string;
    targets: string[];
    className?: string;
    reloadFiles: () => void;
    files: FileDescription[];
    repositories: RepositoryTO[];
    ownRepositories: RepositoryTO[];
    artifactTypes: ArtifactTypeTO[];
    paginationClassName?: string;
}

const DefaultFileList: React.FC<Props> = props => {
    return (
        <WrapperFileList
            files={props.files}
            fallback={props.fallback}
            reloadFiles={props.reloadFiles}
            artifactTypes={props.artifactTypes}
            menuEntries={DETAIL_OPTIONS}
            paginationClassName={props.paginationClassName}
            targets={props.targets}
            repositories={props.repositories}
            ownRepositories={props.ownRepositories} />
    );
};

export default DefaultFileList;
