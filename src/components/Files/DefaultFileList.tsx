import { CloudDownloadOutlined, DeleteOutlineOutlined, EditOutlined, FolderOutlined } from "@material-ui/icons";
import React from "react";
import { ArtifactTypeTO } from "../../api";
import { FileDescription } from "./FileListEntry";
import WrapperFileList from "./WrapperFileList";

const DEFAULT_OPTIONS = [
    [
        {
            label: "artifact.showInRepo",
            value: "show-repository",
            icon: FolderOutlined
        }
    ],
    [
        {
            label: "artifact.download",
            value: "download-file",
            icon: CloudDownloadOutlined
        },
        {
            label: "artifact.edit",
            value: "edit-file",
            icon: EditOutlined
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
    files: FileDescription[];
    fallback: string;
    className?: string;
    pageSize?: number;
    reloadFiles: () => void;
    artifactTypes: ArtifactTypeTO[];
}

const DefaultFileList: React.FC<Props> = props => {

    return (
        <WrapperFileList
            files={props.files}
            fallback={props.fallback}
            reloadFiles={props.reloadFiles}
            artifactTypes={props.artifactTypes}
            menuEntries={DEFAULT_OPTIONS} />
    );
};

export default DefaultFileList;
