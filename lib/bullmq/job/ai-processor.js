import { aiQueue } from "../queue/ai-queue";

export const aiJob = async ({
    id,
}) => {
    try {
        const job = await aiQueue.add(
            "ai-processing",
            {
                _id,
            },
            {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 5000,
                },
                removeOnComplete: 1000,
            }
        );

        console.log(
            `✅ AI processing queued for id: ${id}`
        );

        return job;
    } catch (error) {
        console.error(
            `❌ Failed to queue for id ${id}`,
            error
        );

        throw error;
    }
};