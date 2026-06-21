import { Queue } from "bullmq";
import { redisConnection } from "../redis.js";

export const aiQueue = new Queue("aiQueue", {
    connection: redisConnection,
});