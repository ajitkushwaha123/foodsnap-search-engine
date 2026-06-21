import { NextResponse } from "next/server";
import { aiQueue } from "../../../../lib/bullmq/queue/ai-queue";
import dbConnect from "../../../../lib/db/connect";
import Imagev1 from "../../../../model/imagev1";

const BATCH_SIZE = 1000;

export async function GET() {
    try {
        await dbConnect();

        let queuedCount = 0;
        let lastId = null;

        while (true) {
            const query = {
                ...(lastId
                    ? {
                        _id: {
                            $gt: lastId,
                        },
                    }
                    : {}),

                $or: [
                    {
                        enrichment: {
                            $exists: false,
                        },
                    },
                    {
                        enrichment: null,
                    },
                ],
            };

            const images = await Imagev1.find(
                query,
                {
                    _id: 1,
                }
            )
                .sort({ _id: 1 })
                .limit(BATCH_SIZE)
                .lean();

            if (!images.length) {
                break;
            }

            const jobs = images.map((img) => ({
                name: "ai-processing",
                data: {
                    _id: img._id.toString(),
                },
                opts: {
                    jobId: img._id.toString(),

                    attempts: 3,

                    backoff: {
                        type: "exponential",
                        delay: 1000,
                    },

                    removeOnComplete: 1000,
                    removeOnFail: 500,
                },
            }));

            await aiQueue.addBulk(jobs);
            queuedCount += jobs.length;
            lastId = images[images.length - 1]._id;
            console.log(
                `Queued batch: ${jobs.length}, Total queued: ${queuedCount}`
            );
        }

        return NextResponse.json({
            success: true,
            count: queuedCount,
            message: `${queuedCount} images queued successfully`,
        });
    } catch (err) {
        console.error("QUEUE CREATION ERROR:", err);
        return NextResponse.json(
            {
                success: false,
                message:
                    err?.message ||
                    "Failed to create image queue",
            },
            {
                status: 500,
            }
        );
    }
}