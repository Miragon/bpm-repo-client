export const REPOSITORIES = "GET_REPOS";
export const ACTIVE_REPO = "ACTIVE_REPO";
export const MANAGEABLE_REPOS = "MANAGEABLE_REPOS";
export const SEARCHED_REPOS = "SEARCHED_REPOS";
export const ACTIVE_ARTIFACTS = "ACTIVE_ARTIFACTS";
export const FAVORITE_ARTIFACTS = "GET_FAVORITE";
export const RECENT_ARTIFACTS = "GET_RECENT";
export const ARTIFACT_UPLOAD = "DIAGRAM_UPLOAD";
export const HANDLEDERROR = "UNHANDLEDERROR";
export const SHARED_REPOS = "SHARED_REPOS";
export const UNHANDLEDERRORRETRY = "UNHANDLEDERRORRETRY";
export const SYNC_STATUS_REPOSITORY = "SYNC_STATUS_REPOSITORY";
export const SYNC_STATUS_ARTIFACT = "SYNC_STATUS_ARTIFACT";
export const SYNC_STATUS_VERSION = "SYNC_STATUS_VERSION";
export const SYNC_STATUS_ASSIGNMENT = "SYNC_STATUS_ASSIGNMENT";
export const SYNC_STATUS_MENU = "SYNC_STATUS_MENU";
export const SYNC_STATUS_RECENT = "SYNC_STATUS_RECENT";
export const SYNC_STATUS_FAVORITE = "SYNC_STATUS_FAVORITE";
export const SYNC_STATUS_ACTIVE_REPOSITORY = "SYNC_STATUS_ACTIVE_REPOSITORY";
export const SYNC_STATUS_SHARED = "SYNC_STATUS_SHARED";
export const FILETYPES = "FILETYPES";
export const SUCCESS = "SUCCESS";
export const ACTIVE_VERSIONS = "ACTIVE_VERSIONS";
export const ASSIGNED_USERS = "ASSIGNED_USERS";
export const SHARED_ARTIFACTS = "SHARED_ARTIFACTS";
export const CURRENT_USER_INFO = "CURRENT_USER_INFO";
export const SEARCHED_USERS = "SEARCH_USERS";
export const USERQUERY_EXECUTED = "USERQUERY_EXECUTED";
export const SEARCHED_ARTIFACTS = "SEARCH_ARTIFACT";
export const MENU_ITEMS = "MENU_ITEMS";
export const TARGETS = "TARGETS";
export const ARTIFACTS_BY_REPO_AND_TYPE = "ARTIFACTS_REPO_AND_TYPE";

export const LATEST_VERSION = "LATEST_VERSION";
export const ARTIFACTQUERY_EXECUTED = "ARTIFACTQUERY_EXECUTED";

export const DEFAULT_XML_FILE = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
    "<bpmn:definitions xmlns:bpmn=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\" xmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\" xmlns:di=\"http://www.omg.org/spec/DD/20100524/DI\" id=\"Definitions_1r2owil\" targetNamespace=\"http://bpmn.io/schema/bpmn\" exporter=\"Camunda Modeler\" exporterVersion=\"4.4.0\">\n" +
    "  <bpmn:process id=\"Process_0lx73aq\" isExecutable=\"true\">\n" +
    "    <bpmn:startEvent id=\"StartEvent_1\">\n" +
    "      <bpmn:outgoing>Flow_0by8zp2</bpmn:outgoing>\n" +
    "    </bpmn:startEvent>\n" +
    "    <bpmn:task id=\"Activity_0bawd4n\">\n" +
    "      <bpmn:incoming>Flow_0by8zp2</bpmn:incoming>\n" +
    "      <bpmn:outgoing>Flow_0r4po2g</bpmn:outgoing>\n" +
    "    </bpmn:task>\n" +
    "    <bpmn:sequenceFlow id=\"Flow_0by8zp2\" sourceRef=\"StartEvent_1\" targetRef=\"Activity_0bawd4n\" />\n" +
    "    <bpmn:endEvent id=\"Event_0lxmzdr\">\n" +
    "      <bpmn:incoming>Flow_0r4po2g</bpmn:incoming>\n" +
    "    </bpmn:endEvent>\n" +
    "    <bpmn:sequenceFlow id=\"Flow_0r4po2g\" sourceRef=\"Activity_0bawd4n\" targetRef=\"Event_0lxmzdr\" />\n" +
    "  </bpmn:process>\n" +
    "  <bpmndi:BPMNArtifact id=\"BPMNArtifact_1\">\n" +
    "    <bpmndi:BPMNPlane id=\"BPMNPlane_1\" bpmnElement=\"Process_0lx73aq\">\n" +
    "      <bpmndi:BPMNEdge id=\"Flow_0by8zp2_di\" bpmnElement=\"Flow_0by8zp2\">\n" +
    "        <di:waypoint x=\"215\" y=\"117\" />\n" +
    "        <di:waypoint x=\"270\" y=\"117\" />\n" +
    "      </bpmndi:BPMNEdge>\n" +
    "      <bpmndi:BPMNEdge id=\"Flow_0r4po2g_di\" bpmnElement=\"Flow_0r4po2g\">\n" +
    "        <di:waypoint x=\"370\" y=\"117\" />\n" +
    "        <di:waypoint x=\"432\" y=\"117\" />\n" +
    "      </bpmndi:BPMNEdge>\n" +
    "      <bpmndi:BPMNShape id=\"_BPMNShape_StartEvent_2\" bpmnElement=\"StartEvent_1\">\n" +
    "        <dc:Bounds x=\"179\" y=\"99\" width=\"36\" height=\"36\" />\n" +
    "      </bpmndi:BPMNShape>\n" +
    "      <bpmndi:BPMNShape id=\"Activity_0bawd4n_di\" bpmnElement=\"Activity_0bawd4n\">\n" +
    "        <dc:Bounds x=\"270\" y=\"77\" width=\"100\" height=\"80\" />\n" +
    "      </bpmndi:BPMNShape>\n" +
    "      <bpmndi:BPMNShape id=\"Event_0lxmzdr_di\" bpmnElement=\"Event_0lxmzdr\">\n" +
    "        <dc:Bounds x=\"432\" y=\"99\" width=\"36\" height=\"36\" />\n" +
    "      </bpmndi:BPMNShape>\n" +
    "    </bpmndi:BPMNPlane>\n" +
    "  </bpmndi:BPMNArtifact>\n" +
    "</bpmn:definitions>\n"
export const DEFAULT_DMN_FILE = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
    + "<definitions xmlns=\"https://www.omg.org/spec/DMN/20191111/MODEL/\" xmlns:dmndi=\"https://www.omg.org/spec/DMN/20191111/DMNDI/\" xmlns:dc=\"http://www.omg.org/spec/DMN/20180521/DC/\" id=\"Definitions_0rtbinw\" name=\"DRD\" namespace=\"http://camunda.org/schema/1.0/dmn\">\n"
    + "  <decision id=\"Decision_07746u8\" name=\"Decision 1\">\n"
    + "    <decisionTable id=\"DecisionTable_170t96n\">\n"
    + "      <input id=\"Input_1\">\n"
    + "        <inputExpression id=\"InputExpression_1\" typeRef=\"string\">\n"
    + "          <text></text>\n"
    + "        </inputExpression>\n"
    + "      </input>\n"
    + "      <output id=\"Output_1\" typeRef=\"string\" />\n"
    + "    </decisionTable>\n"
    + "  </decision>\n"
    + "  <dmndi:DMNDI>\n"
    + "    <dmndi:DMNArtifact>\n"
    + "      <dmndi:DMNShape dmnElementRef=\"Decision_07746u8\">\n"
    + "        <dc:Bounds height=\"80\" width=\"180\" x=\"100\" y=\"100\" />\n"
    + "      </dmndi:DMNShape>\n"
    + "    </dmndi:DMNArtifact>\n"
    + "  </dmndi:DMNDI>\n"
    + "</definitions>\n";