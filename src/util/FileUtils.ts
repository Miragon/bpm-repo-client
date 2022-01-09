import { ArtifactMilestoneTO } from "../api";

export const downloadFile = (milestone: ArtifactMilestoneTO): void => {
    const filePath = `/api/milestone/${milestone.artifactId}/${milestone.id}/download`;
    const link = document.createElement("a");
    link.href = filePath;
    link.download = filePath.substr(filePath.lastIndexOf("/") + 1);
    link.click();
};
