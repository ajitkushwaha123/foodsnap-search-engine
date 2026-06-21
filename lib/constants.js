export const API_ENDPOINTS = {
  SAGEMAKER_STATUS: "/api/ai/sagemaker/status",
  SAGEMAKER_START: "/api/ai/sagemaker/start",
  SAGEMAKER_STOP: "/api/ai/sagemaker/stop",
  SAGEMAKER_INFO: "/api/ai/sagemaker/info",
  SAGEMAKER_MODELS: "/api/ai/sagemaker/model",
  SAGEMAKER_MODEL_METRICS: (id) => `/api/ai/sagemaker/model/${id}/metrices`,
};

export const SAGEMAKER_STATUS = {
  IN_SERVICE: "InService",
  CREATING: "Creating",
  DELETING: "Deleting",
  STOPPED: "Stopped",
  ERROR: "Error",
};
