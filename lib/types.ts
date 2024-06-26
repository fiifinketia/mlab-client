import { components } from "./mapi";

/** Forms */
export type CreateDatasetForm = components["schemas"]["DatasetInForm"];
export type CreateModelForm = components["schemas"]["CreateModelRequest"];
export type RunTrainRequest = components["schemas"]["TrainModelIn"];
export type CreateJobForm = components["schemas"]["JobIn"];

/** Response Objects */
export type Dataset = components["schemas"]["Dataset"];
export type Model = components["schemas"]["Model"];
export type Job = components["schemas"]["Job"];
export type ResultsResponse = components["schemas"]["ResultResponse"];
export type ResultResponseFiles = components["schemas"]["ResultResponse"]["files"];
export type TestModelForm = components["schemas"]["TestModelIn"];
// export type JobWithResults = components["schemas"]["JobWithResults"];