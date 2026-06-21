import { NextResponse } from "next/server";
import {
    DeleteEndpointCommand,
} from "@aws-sdk/client-sagemaker";
import { sageMaker } from "@/lib/aws/sagemaker";

export async function POST() {
    try {
        const command = new DeleteEndpointCommand({
            EndpointName: "qwen25-3b-food-endpoint",
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