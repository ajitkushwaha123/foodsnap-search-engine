import { NextResponse } from "next/server";
import {
    CreateEndpointCommand,
} from "@aws-sdk/client-sagemaker";
import { sageMaker } from "@/lib/aws/sagemaker";

export async function POST() {
    try {
        const command = new CreateEndpointCommand({
            EndpointName: "qwen25-3b-food-endpoint",
            EndpointConfigName: "qwen25-3b-food-config",
        });

        const response = await sageMaker.send(command);

        return NextResponse.json({
            success: true,
            data: response,
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