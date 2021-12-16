import { ArtifactMilestoneTO } from "../api";

export const download = ((artifactMilestone: ArtifactMilestoneTO): void => {
    const filePath = `/api/milestone/${artifactMilestone.artifactId}/${artifactMilestone.id}/download`;
    const link = document.createElement("a");
    link.href = filePath;
    link.download = filePath.substr(filePath.lastIndexOf("/") + 1);
    link.click();
});
