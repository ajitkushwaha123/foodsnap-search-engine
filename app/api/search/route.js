import dbConnect from "@/lib/db/connect";
import Image from "@/model/image";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q");
        const page = parseInt(searchParams.get("page") || "1", 10);
        let limit = parseInt(searchParams.get("limit") || "12", 10);

        if (limit > 100) limit = 100;
        const skip = (page - 1) * limit;

        if (!query || query.trim() === "") {
            return NextResponse.json({ success: true, data: [] });
        }

        const pipeline = [
            {
                $search: {
                    index: "food_atlas_search",
                    compound: {
                        should: [
                            {
                                text: {
                                    query: query,
                                    path: "title",
                                    score: { boost: { value: 10 } },
                                    fuzzy: { maxEdits: 1 }
                                }
                            },
                            {
                                text: {
                                    query: query,
                                    path: "enrichment.normalized_name",
                                    score: { boost: { value: 8 } },
                                    fuzzy: { maxEdits: 1 }
                                }
                            },
                            {
                                text: {
                                    query: query,
                                    path: "enrichment.search_aliases",
                                    score: { boost: { value: 5 } },
                                    fuzzy: { maxEdits: 1 }
                                }
                            },
                            {
                                text: {
                                    query: query,
                                    path: "enrichment.search_keywords",
                                    score: { boost: { value: 2 } }
                                }
                            },
                            {
                                text: {
                                    query: query,
                                    path: "enrichment.search_terms",
                                    score: { boost: { value: 2 } }
                                }
                            },
                            {
                                text: {
                                    query: query,
                                    path: "enrichment.misspellings",
                                    score: { boost: { value: 1 } },
                                    fuzzy: { maxEdits: 2 }
                                }
                            },
                            {
                                text: {
                                    query: query,
                                    path: [
                                        "description",
                                        "cuisine",
                                        "category",
                                        "sub_category",
                                        "tags",
                                        "enrichment.search_document",
                                        "enrichment.taxonomy.cuisine_family",
                                        "enrichment.taxonomy.cuisine_region",
                                        "enrichment.taxonomy.course",
                                        "enrichment.taxonomy.dish_family",
                                        "enrichment.taxonomy.dish_type",
                                        "enrichment.ingredient_entities.name",
                                        "enrichment.dietary_tags"
                                    ],
                                    score: { boost: { value: 1.5 } }
                                }
                            }
                        ]
                    }
                }
            },
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $project: {
                                _id: 1,
                                title: 1,
                                image_url: 1,
                                score: { $meta: "searchScore" }
                            }
                        }
                    ]
                }
            }
        ];

        const rawResults = await Image.aggregate(pipeline);
        const facetResult = rawResults[0];
        
        const total = facetResult?.metadata?.[0]?.total || 0;
        const results = facetResult?.data || [];
        const hasMore = skip + results.length < total;

        return NextResponse.json({
            success: true,
            data: results,
            page,
            limit,
            total,
            hasMore
        });
    } catch (err) {
        console.error("Search API Error:", err);
        return NextResponse.json({ success: false, message: "Search failed" }, { status: 500 });
    }
}
