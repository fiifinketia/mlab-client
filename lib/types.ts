import { components } from "./mapi";

/** Forms */
export type CreateDatasetForm = components["schemas"]["DatasetInForm"];
export type CreateModelForm = components["schemas"]["CreateModelRequest"];
export type RunTrainRequest = components["schemas"]["TrainModelIn"];

/** Response Objects */
export type Dataset = components["schemas"]["Dataset"];
export type Model = components["schemas"]["Model"];
