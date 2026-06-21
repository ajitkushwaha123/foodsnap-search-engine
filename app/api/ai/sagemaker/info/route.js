import { NextResponse } from "next/server";
import {
    ListEndpointsCommand,
    ListModelsCommand,
    ListEndpointConfigsCommand,
    DescribeEndpointCommand,
} from "@aws-sdk/client-sagemaker";

import { sageMaker } from "@/lib/aws/sagemaker";

export async function GET() {
    try {
        const [
            endpointsRes,
            modelsRes,
            configsRes,
        ] = await Promise.all([
            sageMaker.send(new ListEndpointsCommand({})),
            sageMaker.send(new ListModelsCommand({})),
            sageMaker.send(new ListEndpointConfigsCommand({})),
        ]);

        const endpointDetails = await Promise.all(
            endpointsRes.Endpoints.map(async (endpoint) => {
                try {
                    const details = await sageMaker.send(
                        new DescribeEndpointCommand({
                            EndpointName: endpoint.EndpointName,
                        })
                    );

                    return {
                        name: endpoint.EndpointName,
                        status: details.EndpointStatus,
                        config: details.EndpointConfigName,
                        createdAt: details.CreationTime,
                        lastModified: details.LastModifiedTime,
                        failureReason: details.FailureReason || null,
                    };
                } catch (err) {
                    return {
                        name: endpoint.EndpointName,
                        error: err.message,
                    };
                }
            })
        );

        return NextResponse.json({
            success: true,

            summary: {
                endpoints: endpointsRes.Endpoints.length,
                models: modelsRes.Models.length,
                endpointConfigs: configsRes.EndpointConfigs.length,
            },

            endpoints: endpointDetails,

            models: modelsRes.Models,

            endpointConfigs: configsRes.EndpointConfigs,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error.message,
            },
            { status: 500 }
        );
    }
}