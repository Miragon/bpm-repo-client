/* tslint:disable */
/* eslint-disable */
/**
 * OpenAPI definition
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v0
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
/**
 *
 * @export
 * @interface AssignmentTO
 */
export interface AssignmentTO {
    /**
     *
     * @type {string}
     * @memberof AssignmentTO
     */
    bpmnRepositoryId: any;
    /**
     *
     * @type {string}
     * @memberof AssignmentTO
     */
    userId: any;
    /**
     *
     * @type {string}
     * @memberof AssignmentTO
     */
    userName: any;
    /**
     *
     * @type {string}
     * @memberof AssignmentTO
     */
    roleEnum: AssignmentTORoleEnumEnum;
}

/**
 * @export
 * @enum {string}
 */
export enum AssignmentTORoleEnumEnum {
    OWNER = 'OWNER',
    ADMIN = 'ADMIN',
    MEMBER = 'MEMBER',
    VIEWER = 'VIEWER'
}

