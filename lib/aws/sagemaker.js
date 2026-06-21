import { SageMakerClient } from "@aws-sdk/client-sagemaker";

export const sageMaker = new SageMakerClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});