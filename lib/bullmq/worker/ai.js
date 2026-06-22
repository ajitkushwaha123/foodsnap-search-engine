import axios from "axios";
import dotenv from "dotenv";
import Redis from "ioredis";
import { Worker } from "bullmq";

dotenv.config();

if (!process.env.REDIS_URL) {
    throw new Error("Missing REDIS_URL in .env");
}

if (!process.env.NEXT_PUBLIC_BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_BASE_URL in .env");
}

const connection = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
});

const worker = new Worker(
    "aiQueue",
    async (job) => {
        const { _id } = job.data;

        console.log(
            `[Job ${job.id}] 🚀 Starting AI enrichment for image ${_id}`
        );

        try {
            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/ai`;

            const { data } = await axios.post(
                url,
                {
                    _id,
                },
                {
                    timeout: 1000 * 60 * 10,
                }
            );

            console.log(
                `[Job ${job.id}] ✅ Enrichment completed for ${_id}`
            );

            return data;
        } catch (error) {
            console.error(
                `[Job ${job.id}] ❌ Failed for ${_id}`,
                error?.response?.data || error.message
            );

            throw error;
        }
    },
    {
        connection,
        concurrency: 2,

        limiter: {
            max: 1,
            duration: 1000,
        },
    }
);

console.log("🚀 AI Enrichment Worker Started");

worker.on("completed", (job) => {
    console.log(
        `✅ Job ${job.id} completed | Image ${job.data._id}`
    );
});

worker.on("failed", (job, err) => {
    console.error(
        `❌ Job ${job?.id} failed | Image ${job?.data?._id}`,
        err?.message
    );
});

worker.on("error", (err) => {
    console.error("🚨 Worker Error:", err);
});