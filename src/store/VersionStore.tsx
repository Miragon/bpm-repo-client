import { makeObservable, observable } from "mobx";
import { BpmnDiagramVersionControllerApi, BpmnDiagramVersionTO, SaveTypeEnum } from "../api";

const BPMN_FILE = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false" />
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1" />
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

const DMN_FILE = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/" xmlns:dmndi="https://www.omg.org/spec/DMN/20191111/DMNDI/" xmlns:dc="http://www.omg.org/spec/DMN/20180521/DC/" id="Definitions_0tb65jy" name="DRD" namespace="http://camunda.org/schema/1.0/dmn">
  <decision id="Decision_0a8yx88" name="Decision 1">
    <decisionTable id="DecisionTable_0jawpqd">
      <input id="Input_1">
        <inputExpression id="InputExpression_1" typeRef="string">
          <text></text>
        </inputExpression>
      </input>
      <output id="Output_1" typeRef="string" />
    </decisionTable>
  </decision>
  <dmndi:DMNDI>
    <dmndi:DMNDiagram>
      <dmndi:DMNShape dmnElementRef="Decision_0a8yx88">
        <dc:Bounds height="80" width="180" x="160" y="100" />
      </dmndi:DMNShape>
    </dmndi:DMNDiagram>
  </dmndi:DMNDI>
</definitions>`;

export default class VersionStore {
    @observable
    versions: BpmnDiagramVersionTO[] = [];


    bpmnDiagramVersionController: BpmnDiagramVersionControllerApi;


    constructor() {
        makeObservable(this);
        this.bpmnDiagramVersionController = new BpmnDiagramVersionControllerApi();
    }

    public createDiagramVersion = async (repoId: string, diagramId: string, type: "bpmn" | "dmn"): Promise<Response | undefined> => {
        try {
            const xml = type === "bpmn" ? BPMN_FILE : DMN_FILE;
            const versionUploadTO = {
                //hardcoded string is an empty bpmn Diagram
                bpmnAsXML: xml,
                saveType: SaveTypeEnum.RELEASE
            }

            return await this.bpmnDiagramVersionController.createOrUpdateVersion(versionUploadTO, repoId, diagramId);

        } catch (response) {
            switch (response.status) {
                case 502:
                    console.log("Error");
                    break;
                default:
                    console.log("Error");
                    break;
            }
            return undefined;
        }
    }

    public importDiagramVersion = async (repoId: string, diagramId: string, xmlString: string): Promise<Response | undefined> => {
        try {
            const versionUploadTO = {
                bpmnAsXML: xmlString,
                saveType: SaveTypeEnum.RELEASE
            }
            return await this.bpmnDiagramVersionController.createOrUpdateVersion(versionUploadTO, repoId, diagramId);
        } catch (response) {
            switch (response.status) {
                case 502:
                    console.log("Error");
                    break;
                default:
                    console.log("Error");
                    break;
            }
            return undefined;
        }
    }
}
