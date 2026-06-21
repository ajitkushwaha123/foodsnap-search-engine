import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db/connect";
import Image from "../../../model/image";
import Imagev1 from "../../../model/imagev1";
import { enrichFoodItem } from "../../../lib/ai/enrich";

export async function POST(request) {
    try {
        await dbConnect();

        const { _id } = await request.json();

        if (!_id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "_id is required",
                },
                { status: 400 }
            );
        }

        const img = await Imagev1.findById(_id);

        if (!img) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Image not found",
                },
                { status: 404 }
            );
        }

        if (img.processed === true) {
            return NextResponse.json({
                success: true,
                message: "Already processed (skipped)",
                data: null,
            });
        }

        const existing = await Image.findOne({
            image_url: img.image_url,
        });

        if (existing) {
            await Imagev1.findByIdAndUpdate(img._id, {
                processed: true,
            });

            return NextResponse.json({
                success: true,
                message: "Already exists, marked as processed",
                data: existing,
            });
        }

        const foodItem = {
            title: img.title,
            description: img.description,
            approved: img.approved ?? true,
            category: img.category,
            sub_category: img.sub_category,
            food_type: img.food_type,
        };

        const aiData = await enrichFoodItem(foodItem);

        const image = await Image.create({
            title: img.title,
            description: img.description,
            image_url: img.image_url || "",
            approved: img.approved ?? true,
            category: img.category,
            sub_category: img.sub_category,
            food_type: img.food_type,
            cuisine: aiData.cuisine || "",
            tags: aiData.tags || [],
            is_combo: aiData.is_combo ?? false,
            enrichment: aiData.enrichment,
            popularity_score: 0,
            likes: 0,
            downloads: 0,
        });

        await Imagev1.findByIdAndUpdate(img._id, {
            processed: true,
        });

        return NextResponse.json({
            success: true,
            message: "Food item processed successfully",
            data: image,
        });
    } catch (err) {
        console.error("ENRICHMENT ERROR:", err);

        return NextResponse.json(
            {
                success: false,
                message: err?.message || "Failed to process food item",
            },
            { status: 500 }
        );
    }
}