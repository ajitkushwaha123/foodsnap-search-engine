import mongoose, { Schema } from "mongoose";

const IngredientSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        confidence: {
            type: Number,
            min: 0,
            max: 1,
            default: 1,
        },

        importance: {
            type: Number,
            min: 0,
            max: 1,
            default: 1,
        },
    },
    { _id: false }
);

const TaxonomySchema = new Schema(
    {
        cuisine_family: String,
        cuisine_region: String,
        cuisine_sub_region: String,
        course: {
            type: String,
        },

        dish_family: String,
        dish_type: String,

        cooking_methods: {
            type: [String],
            default: [],
        },

        proteins: {
            type: [String],
            default: [],
        },
    },
    { _id: false }
);

const EnrichmentSchema = new Schema(
    {
        version: {
            type: String,
            default: "v3",
        },

        model: String,

        generated_at: {
            type: Date,
            default: Date.now,
        },

        normalized_name: {
            type: String,
            trim: true,
            index: true,
        },

        canonical_dish_id: {
            type: String,
            trim: true,
        },

        taxonomy: {
            type: TaxonomySchema,
            default: {},
        },

        ingredient_entities: {
            type: [IngredientSchema],
            default: [],
        },

        spice_level: {
            type: String,
        },

        dietary_tags: {
            type: [String],
            default: [],
        },

        allergens: {
            type: [String],
            default: [],
        },

        search_aliases: {
            type: [String],
            default: [],
        },

        search_keywords: {
            type: [String],
            default: [],
        },

        search_queries: {
            type: [String],
            default: [],
        },

        misspellings: {
            type: [String],
            default: [],
        },

        search_terms: {
            type: [String],
            default: [],
        },

        search_document: {
            type: String,
            trim: true,
        },

        confidence_score: {
            type: Number,
            min: 0,
            max: 1,
        },

        reviewed: {
            type: Boolean,
            default: false,
        },
    },
    { _id: false }
);

const ImageSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },

        description: {
            type: String,
            trim: true,
        },

        image_url: {
            type: String,
            required: true,
            trim: true,
        },

        cuisine: {
            type: String,
            trim: true,
        },

        category: {
            type: String,
            trim: true,
            index: true,
        },

        sub_category: {
            type: String,
            trim: true,
        },

        food_type: {
            type: String,
            lowercase: true,
        },

        tags: {
            type: [String],
            default: [],
        },

        approved: {
            type: Boolean,
            default: false,
        },

        popularity_score: {
            type: Number,
            default: 0,
        },

        likes: {
            type: Number,
            default: 0,
        },

        downloads: {
            type: Number,
            default: 0,
        },

        enrichment: {
            type: EnrichmentSchema,
            default: undefined,
        },

        is_combo: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        collection: "food_items",
    }
);

/**
 * Main search index
 */
ImageSchema.index(
    {
        title: "text",
        description: "text",

        "enrichment.normalized_name": "text",

        "enrichment.search_aliases": "text",

        "enrichment.search_keywords": "text",

        "enrichment.search_terms": "text",

        "enrichment.search_document": "text",

        "enrichment.misspellings": "text",
    },
    {
        name: "food_search_index",

        weights: {
            title: 20,

            "enrichment.normalized_name": 18,

            "enrichment.search_aliases": 15,

            "enrichment.search_terms": 15,

            "enrichment.search_keywords": 12,

            "enrichment.search_document": 10,

            description: 5,

            "enrichment.misspellings": 3,
        },
    }
);

/**
 * Filtering indexes
 */
ImageSchema.index({
    approved: 1,
    latest: 1,
});

ImageSchema.index({
    approved: 1,
    latest: 1,
    popularity_score: -1,
});

ImageSchema.index({
    food_type: 1,
    category: 1,
    approved: 1,
});

ImageSchema.index({
    likes: -1,
    downloads: -1,
});

/**
 * Enrichment indexes
 */
ImageSchema.index({
    "enrichment.normalized_name": 1,
});

ImageSchema.index({
    "enrichment.search_terms": 1,
});

ImageSchema.index({
    "enrichment.search_aliases": 1,
});

ImageSchema.index({
    "enrichment.search_keywords": 1,
});

ImageSchema.index({
    "enrichment.dietary_tags": 1,
});

ImageSchema.index({
    "enrichment.ingredient_entities.name": 1,
});

ImageSchema.index({
    "enrichment.taxonomy.cuisine_family": 1,
});

ImageSchema.index({
    "enrichment.taxonomy.cuisine_region": 1,
});

ImageSchema.index({
    "enrichment.taxonomy.dish_family": 1,
});

ImageSchema.index({
    "enrichment.spice_level": 1,
});

const Image =
    mongoose.models.Image ||
    mongoose.model("Image", ImageSchema);

export default Image;