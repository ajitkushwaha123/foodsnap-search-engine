import { NextResponse } from "next/server";
import {
    DescribeEndpointCommand,
} from "@aws-sdk/client-sagemaker";
import { sageMaker } from "@/lib/aws/sagemaker";

export async function GET() {
    try {
        const command = new DescribeEndpointCommand({
            EndpointName: "qwen25-3b-food-endpoint",
        });

        const response = await sageMaker.send(command);

        return NextResponse.json({
            success: true,
            status: response.EndpointStatus,
        });
    } catch {
        return NextResponse.json({
            success: true,
            status: "Stopped",
        });
    }
}