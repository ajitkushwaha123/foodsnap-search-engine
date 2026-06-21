import { SageMakerClient, ListEndpointsCommand } from "@aws-sdk/client-sagemaker";

const client = new SageMakerClient({ region: process.env.AWS_REGION });

export async function GET() {
    const data = await client.send(new ListEndpointsCommand({}));

    return Response.json({
        endpoints: data.Endpoints?.map(e => ({
            name: e.EndpointName,
            status: e.EndpointStatus,
            createdAt: e.CreationTime
        }))
    });
}