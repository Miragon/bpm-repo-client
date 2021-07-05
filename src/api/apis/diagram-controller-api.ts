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
import {DiagramSVGUploadTO, DiagramTO, DiagramUpdateTO, NewDiagramTO} from '../models';

/**
 * DiagramControllerApi - axios parameter creator
 * @export
 */
export const DiagramControllerApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         *
         * @param {NewDiagramTO} body
         * @param {string} repositoryId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createDiagram: async (body: NewDiagramTO, repositoryId: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body', 'Required parameter body was null or undefined when calling createDiagram.');
            }
            // verify required parameter 'repositoryId' is not null or undefined
            if (repositoryId === null || repositoryId === undefined) {
                throw new RequiredError('repositoryId', 'Required parameter repositoryId was null or undefined when calling createDiagram.');
            }
            const localVarPath = `/api/diagram/{repositoryId}`
                .replace(`{${"repositoryId"}}`, encodeURIComponent(String(repositoryId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = {method: 'POST', ...baseOptions, ...options};
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
            localVarRequestOptions.data = needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         *
         * @summary Delete one Diagram and all of its versions
         * @param {string} diagramId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteDiagram: async (diagramId: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'diagramId' is not null or undefined
            if (diagramId === null || diagramId === undefined) {
                throw new RequiredError('diagramId', 'Required parameter diagramId was null or undefined when calling deleteDiagram.');
            }
            const localVarPath = `/api/diagram/{diagramId}`
                .replace(`{${"diagramId"}}`, encodeURIComponent(String(diagramId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = {method: 'DELETE', ...baseOptions, ...options};
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
        /**
         *
         * @param {string} diagramId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getDiagram: async (diagramId: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'diagramId' is not null or undefined
            if (diagramId === null || diagramId === undefined) {
                throw new RequiredError('diagramId', 'Required parameter diagramId was null or undefined when calling getDiagram.');
            }
            const localVarPath = `/api/diagram/{diagramId}`
                .replace(`{${"diagramId"}}`, encodeURIComponent(String(diagramId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = {method: 'GET', ...baseOptions, ...options};
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
        /**
         *
         * @param {string} repositoryId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getDiagramsFromRepo: async (repositoryId: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'repositoryId' is not null or undefined
            if (repositoryId === null || repositoryId === undefined) {
                throw new RequiredError('repositoryId', 'Required parameter repositoryId was null or undefined when calling getDiagramsFromRepo.');
            }
            const localVarPath = `/api/diagram/repository/{repositoryId}`
                .replace(`{${"repositoryId"}}`, encodeURIComponent(String(repositoryId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = {method: 'GET', ...baseOptions, ...options};
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
        /**
         *
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getRecent: async (options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/diagram/recent`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = {method: 'GET', ...baseOptions, ...options};
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
        /**
         *
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getStarred: async (options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/diagram/starred`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = {method: 'GET', ...baseOptions, ...options};
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
        /**
         *
         * @param {string} typedTitle
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        searchDiagrams: async (typedTitle: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'typedTitle' is not null or undefined
            if (typedTitle === null || typedTitle === undefined) {
                throw new RequiredError('typedTitle', 'Required parameter typedTitle was null or undefined when calling searchDiagrams.');
            }
            const localVarPath = `/api/diagram/search/{typedTitle}`
                .replace(`{${"typedTitle"}}`, encodeURIComponent(String(typedTitle)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = {method: 'GET', ...baseOptions, ...options};
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
        /**
         *
         * @param {string} diagramId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        setStarred: async (diagramId: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'diagramId' is not null or undefined
            if (diagramId === null || diagramId === undefined) {
                throw new RequiredError('diagramId', 'Required parameter diagramId was null or undefined when calling setStarred.');
            }
            const localVarPath = `/api/diagram/starred/{diagramId}`
                .replace(`{${"diagramId"}}`, encodeURIComponent(String(diagramId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = {method: 'POST', ...baseOptions, ...options};
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
        /**
         *
         * @param {DiagramUpdateTO} body
         * @param {string} diagramId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateDiagram: async (body: DiagramUpdateTO, diagramId: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body', 'Required parameter body was null or undefined when calling updateDiagram.');
            }
            // verify required parameter 'diagramId' is not null or undefined
            if (diagramId === null || diagramId === undefined) {
                throw new RequiredError('diagramId', 'Required parameter diagramId was null or undefined when calling updateDiagram.');
            }
            const localVarPath = `/api/diagram/{diagramId}`
                .replace(`{${"diagramId"}}`, encodeURIComponent(String(diagramId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = {method: 'PUT', ...baseOptions, ...options};
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
            localVarRequestOptions.data = needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         *
         * @param {DiagramSVGUploadTO} body
         * @param {string} diagramId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updatePreviewSVG: async (body: DiagramSVGUploadTO, diagramId: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body', 'Required parameter body was null or undefined when calling updatePreviewSVG.');
            }
            // verify required parameter 'diagramId' is not null or undefined
            if (diagramId === null || diagramId === undefined) {
                throw new RequiredError('diagramId', 'Required parameter diagramId was null or undefined when calling updatePreviewSVG.');
            }
            const localVarPath = `/api/diagram/{diagramId}`
                .replace(`{${"diagramId"}}`, encodeURIComponent(String(diagramId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = {method: 'POST', ...baseOptions, ...options};
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
            localVarRequestOptions.data = needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * DiagramControllerApi - functional programming interface
 * @export
 */
export const DiagramControllerApiFp = function (configuration?: Configuration) {
    return {
        /**
         *
         * @param {NewDiagramTO} body
         * @param {string} repositoryId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createDiagram(body: NewDiagramTO, repositoryId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<DiagramTO>> {
            const localVarAxiosArgs = await DiagramControllerApiAxiosParamCreator(configuration).createDiagram(body, repositoryId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         *
         * @summary Delete one Diagram and all of its versions
         * @param {string} diagramId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteDiagram(diagramId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await DiagramControllerApiAxiosParamCreator(configuration).deleteDiagram(diagramId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         *
         * @param {string} diagramId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getDiagram(diagramId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<DiagramTO>> {
            const localVarAxiosArgs = await DiagramControllerApiAxiosParamCreator(configuration).getDiagram(diagramId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         *
         * @param {string} repositoryId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getDiagramsFromRepo(repositoryId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<DiagramTO>>> {
            const localVarAxiosArgs = await DiagramControllerApiAxiosParamCreator(configuration).getDiagramsFromRepo(repositoryId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         *
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getRecent(options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<DiagramTO>>> {
            const localVarAxiosArgs = await DiagramControllerApiAxiosParamCreator(configuration).getRecent(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         *
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getStarred(options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<DiagramTO>>> {
            const localVarAxiosArgs = await DiagramControllerApiAxiosParamCreator(configuration).getStarred(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         *
         * @param {string} typedTitle
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async searchDiagrams(typedTitle: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<DiagramTO>>> {
            const localVarAxiosArgs = await DiagramControllerApiAxiosParamCreator(configuration).searchDiagrams(typedTitle, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         *
         * @param {string} diagramId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async setStarred(diagramId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await DiagramControllerApiAxiosParamCreator(configuration).setStarred(diagramId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         *
         * @param {DiagramUpdateTO} body
         * @param {string} diagramId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updateDiagram(body: DiagramUpdateTO, diagramId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<DiagramTO>> {
            const localVarAxiosArgs = await DiagramControllerApiAxiosParamCreator(configuration).updateDiagram(body, diagramId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         *
         * @param {DiagramSVGUploadTO} body
         * @param {string} diagramId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async updatePreviewSVG(body: DiagramSVGUploadTO, diagramId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await DiagramControllerApiAxiosParamCreator(configuration).updatePreviewSVG(body, diagramId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * DiagramControllerApi - factory interface
 * @export
 */
export const DiagramControllerApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         *
         * @param {NewDiagramTO} body
         * @param {string} repositoryId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createDiagram(body: NewDiagramTO, repositoryId: string, options?: any): AxiosPromise<DiagramTO> {
            return DiagramControllerApiFp(configuration).createDiagram(body, repositoryId, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @summary Delete one Diagram and all of its versions
         * @param {string} diagramId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteDiagram(diagramId: string, options?: any): AxiosPromise<void> {
            return DiagramControllerApiFp(configuration).deleteDiagram(diagramId, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @param {string} diagramId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getDiagram(diagramId: string, options?: any): AxiosPromise<DiagramTO> {
            return DiagramControllerApiFp(configuration).getDiagram(diagramId, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @param {string} repositoryId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getDiagramsFromRepo(repositoryId: string, options?: any): AxiosPromise<Array<DiagramTO>> {
            return DiagramControllerApiFp(configuration).getDiagramsFromRepo(repositoryId, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getRecent(options?: any): AxiosPromise<Array<DiagramTO>> {
            return DiagramControllerApiFp(configuration).getRecent(options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getStarred(options?: any): AxiosPromise<Array<DiagramTO>> {
            return DiagramControllerApiFp(configuration).getStarred(options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @param {string} typedTitle
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        searchDiagrams(typedTitle: string, options?: any): AxiosPromise<Array<DiagramTO>> {
            return DiagramControllerApiFp(configuration).searchDiagrams(typedTitle, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @param {string} diagramId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        setStarred(diagramId: string, options?: any): AxiosPromise<void> {
            return DiagramControllerApiFp(configuration).setStarred(diagramId, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @param {DiagramUpdateTO} body
         * @param {string} diagramId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateDiagram(body: DiagramUpdateTO, diagramId: string, options?: any): AxiosPromise<DiagramTO> {
            return DiagramControllerApiFp(configuration).updateDiagram(body, diagramId, options).then((request) => request(axios, basePath));
        },
        /**
         *
         * @param {DiagramSVGUploadTO} body
         * @param {string} diagramId
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updatePreviewSVG(body: DiagramSVGUploadTO, diagramId: string, options?: any): AxiosPromise<void> {
            return DiagramControllerApiFp(configuration).updatePreviewSVG(body, diagramId, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * DiagramControllerApi - object-oriented interface
 * @export
 * @class DiagramControllerApi
 * @extends {BaseAPI}
 */
export class DiagramControllerApi extends BaseAPI {
    /**
     *
     * @param {NewDiagramTO} body
     * @param {string} repositoryId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DiagramControllerApi
     */
    public createDiagram(body: NewDiagramTO, repositoryId: string, options?: any) {
        return DiagramControllerApiFp(this.configuration).createDiagram(body, repositoryId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     *
     * @summary Delete one Diagram and all of its versions
     * @param {string} diagramId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DiagramControllerApi
     */
    public deleteDiagram(diagramId: string, options?: any) {
        return DiagramControllerApiFp(this.configuration).deleteDiagram(diagramId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     *
     * @param {string} diagramId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DiagramControllerApi
     */
    public getDiagram(diagramId: string, options?: any) {
        return DiagramControllerApiFp(this.configuration).getDiagram(diagramId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     *
     * @param {string} repositoryId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DiagramControllerApi
     */
    public getDiagramsFromRepo(repositoryId: string, options?: any) {
        return DiagramControllerApiFp(this.configuration).getDiagramsFromRepo(repositoryId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     *
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DiagramControllerApi
     */
    public getRecent(options?: any) {
        return DiagramControllerApiFp(this.configuration).getRecent(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     *
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DiagramControllerApi
     */
    public getStarred(options?: any) {
        return DiagramControllerApiFp(this.configuration).getStarred(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     *
     * @param {string} typedTitle
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DiagramControllerApi
     */
    public searchDiagrams(typedTitle: string, options?: any) {
        return DiagramControllerApiFp(this.configuration).searchDiagrams(typedTitle, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     *
     * @param {string} diagramId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DiagramControllerApi
     */
    public setStarred(diagramId: string, options?: any) {
        return DiagramControllerApiFp(this.configuration).setStarred(diagramId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     *
     * @param {DiagramUpdateTO} body
     * @param {string} diagramId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DiagramControllerApi
     */
    public updateDiagram(body: DiagramUpdateTO, diagramId: string, options?: any) {
        return DiagramControllerApiFp(this.configuration).updateDiagram(body, diagramId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     *
     * @param {DiagramSVGUploadTO} body
     * @param {string} diagramId
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DiagramControllerApi
     */
    public updatePreviewSVG(body: DiagramSVGUploadTO, diagramId: string, options?: any) {
        return DiagramControllerApiFp(this.configuration).updatePreviewSVG(body, diagramId, options).then((request) => request(this.axios, this.basePath));
    }
}
