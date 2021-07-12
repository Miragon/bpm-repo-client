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
import globalAxios, {AxiosInstance, AxiosPromise} from 'axios';
import {Configuration} from '../configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import {BASE_PATH, BaseAPI, COLLECTION_FORMATS, RequestArgs, RequiredError} from '../base';
import {DeploymentTO} from '../models';

/**
 * DeploymentApi - axios parameter creator
 * @export
 */
export const DeploymentApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Deploy diagram version
         * @param {DeploymentTO} body
         * @param {string} diagramId 
         * @param {string} versionId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deployVersion: async (body: DeploymentTO, diagramId: string, versionId: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling deployVersion.');
            }
            // verify required parameter 'diagramId' is not null or undefined
            if (diagramId === null || diagramId === undefined) {
                throw new RequiredError('diagramId','Required parameter diagramId was null or undefined when calling deployVersion.');
            }
            // verify required parameter 'versionId' is not null or undefined
            if (versionId === null || versionId === undefined) {
                throw new RequiredError('versionId','Required parameter versionId was null or undefined when calling deployVersion.');
            }
            const localVarPath = `/api/deploy/{diagramId}/{versionId}`
                .replace(`{${"diagramId"}}`, encodeURIComponent(String(diagramId)))
                .replace(`{${"versionId"}}`, encodeURIComponent(String(versionId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarHeaderParameter['Content-Type'] = 'application/json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * Get all available deployment targets
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAllDeploymentTargets: async (options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/deploy/target`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * DeploymentApi - functional programming interface
 * @export
 */
export const DeploymentApiFp = function(configuration?: Configuration) {
    return {
        /**
         * Deploy diagram version
         * @param {DeploymentTO} body
         * @param {string} diagramId 
         * @param {string} versionId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deployVersion(body: DeploymentTO, diagramId: string, versionId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await DeploymentApiAxiosParamCreator(configuration).deployVersion(body, diagramId, versionId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * Get all available deployment targets
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getAllDeploymentTargets(options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<string>>> {
            const localVarAxiosArgs = await DeploymentApiAxiosParamCreator(configuration).getAllDeploymentTargets(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * DeploymentApi - factory interface
 * @export
 */
export const DeploymentApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * Deploy diagram version
         * @param {DeploymentTO} body
         * @param {string} diagramId 
         * @param {string} versionId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deployVersion(body: DeploymentTO, diagramId: string, versionId: string, options?: any): AxiosPromise<void> {
            return DeploymentApiFp(configuration).deployVersion(body, diagramId, versionId, options).then((request) => request(axios, basePath));
        },
        /**
         * Get all available deployment targets
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAllDeploymentTargets(options?: any): AxiosPromise<Array<string>> {
            return DeploymentApiFp(configuration).getAllDeploymentTargets(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * DeploymentApi - object-oriented interface
 * @export
 * @class DeploymentApi
 * @extends {BaseAPI}
 */
export class DeploymentApi extends BaseAPI {
    /**
     * Deploy diagram version
     * @param {DeploymentTO} body
     * @param {string} diagramId 
     * @param {string} versionId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DeploymentApi
     */
    public deployVersion(body: DeploymentTO, diagramId: string, versionId: string, options?: any) {
        return DeploymentApiFp(this.configuration).deployVersion(body, diagramId, versionId, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * Get all available deployment targets
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DeploymentApi
     */
    public getAllDeploymentTargets(options?: any) {
        return DeploymentApiFp(this.configuration).getAllDeploymentTargets(options).then((request) => request(this.axios, this.basePath));
    }
}