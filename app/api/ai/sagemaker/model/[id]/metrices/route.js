import { CloudWatchClient, GetMetricStatisticsCommand } from "@aws-sdk/client-cloudwatch";

const cw = new CloudWatchClient({ region: process.env.AWS_REGION });

export async function GET(req, { params }) {
    const { id } = await params
    const endpoint = id;

    const data = await cw.send(new GetMetricStatisticsCommand({
        Namespace: "AWS/SageMaker",
        MetricName: "Invocations",
        Dimensions: [
            {
                Name: "EndpointName",
                Value: endpoint
            }
        ],
        Period: 300,
        Statistics: ["Sum"],
        StartTime: new Date(Date.now() - 3600 * 1000),
        EndTime: new Date()
    }));

    return Response.json(data);
}