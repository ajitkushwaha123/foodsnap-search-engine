import mongoose from "mongoose"
const { Schema } = mongoose;

const FOOD_TYPES = ["veg", "non_veg", "egg", "vegan"];

const SPICE_LEVELS = [
    "mild",
    "medium",
    "hot",
    "very_hot",
];

const COURSES = [
    "starter",
    "main_course",
    "side_dish",
    "dessert",
    "beverage",
    "snack",
];

const CAMERA_ANGLES = [
    "top_view",
    "side_view",
    "angled_view",
    "close_up",
];

const PORTION_SIZES = [
    "small",
    "medium",
    "large",
];

/* ============================================================
   INGREDIENT ENTITY
============================================================ */

const IngredientSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        confidence: {
            type: Number,
            min: 0,
            max: 1,
        },

        importance: {
            type: Number,
            min: 0,
            max: 1,
        },
    },
    { _id: false }
);

/* ============================================================
   TAXONOMY
============================================================ */

const TaxonomySchema = new Schema(
    {
        cuisine_family: String,

        cuisine_region: String,

        cuisine_sub_region: String,

        course: {
            type: String,
            enum: COURSES,
        },

        dish_family: String,

        dish_type: String,

        cooking_methods: [String],

        proteins: [String],
    },
    { _id: false }
);

/* ============================================================
   VISUAL FEATURES
============================================================ */

const VisualFeaturesSchema = new Schema(
    {
        dominant_colors: [String],

        texture_tags: [String],

        garnish: [String],

        plating_style: String,

        camera_angle: {
            type: String,
            enum: CAMERA_ANGLES,
        },

        portion_size: {
            type: String,
            enum: PORTION_SIZES,
        },

        background_type: String,

        image_caption: String,

        visual_summary: String,
    },
    { _id: false }
);

/* ============================================================
   IMAGE SEARCH FEATURES
============================================================ */

const ImageSearchSchema = new Schema(
    {
        detected_foods: [String],

        detected_objects: [String],

        confidence: {
            type: Number,
            min: 0,
            max: 1,
        },
    },
    { _id: false }
);

/* ============================================================
   RECOMMENDATION FEATURES
============================================================ */

const RecommendationSchema = new Schema(
    {
        richness: Number,

        creaminess: Number,

        sweetness: Number,

        spiciness: Number,

        crunchiness: Number,

        popularity_score: Number,
    },
    { _id: false }
);

/* ============================================================
   ENRICHMENT
============================================================ */

const EnrichmentSchema = new Schema(
    {
        version: {
            type: String,
            default: "v2",
        },

        model: String,

        generated_at: {
            type: Date,
            default: Date.now,
        },

        normalized_name: {
            type: String,
            index: true,
        },

        taxonomy: {
            type: TaxonomySchema,
            default: {},
        },

        ingredient_entities: {
            type: [IngredientSchema],
            default: [],
        },

        visual_features: {
            type: VisualFeaturesSchema,
            default: {},
        },

        image_search: {
            type: ImageSearchSchema,
            default: {},
        },

        recommendation_features: {
            type: RecommendationSchema,
            default: {},
        },

        spice_level: {
            type: String,
            enum: SPICE_LEVELS,
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

        search_queries: {
            type: [String],
            default: [],
        },

        misspellings: {
            type: [String],
            default: [],
        },

        search_keywords: {
            type: [String],
            default: [],
        },

        embedding_text: String,

        search_document: String,

        text_embedding: {
            type: [Number],
            select: false,
        },

        visual_embedding: {
            type: [Number],
            select: false,
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

/* ============================================================
   MAIN FOOD ITEM
============================================================ */

const FoodItemSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            index: true,
        },

        description: String,

        image_url: {
            type: String,
            required: true,
        },

        cuisine: String,

        category: {
            type: String,
            index: true,
        },

        sub_category: String,

        food_type: {
            type: String,
            enum: FOOD_TYPES,
        },

        manual_tags: {
            type: [String],
            default: [],
        },

        auto_tags: {
            type: [String],
            default: [],
        },

        approved: {
            type: Boolean,
            default: false,
        },

        system_approved: {
            type: Boolean,
            default: false,
        },

        premium: {
            type: Boolean,
            default: false,
        },

        latest: {
            type: Boolean,
            default: true,
        },

        source: String,

        quality_score: Number,

        popularity_score: Number,

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
        },
    },
    {
        timestamps: true,
        collection: "food_items",
    }
);

/* ============================================================
   SEARCH INDEXES
============================================================ */

FoodItemSchema.index(
    {
        title: "text",
        description: "text",
        "enrichment.search_document": "text",
        "enrichment.search_keywords": "text",
        "enrichment.search_aliases": "text",
    },
    {
        weights: {
            title: 15,
            "enrichment.search_aliases": 12,
            "enrichment.search_keywords": 10,
            "enrichment.search_document": 8,
            description: 4,
        },
        name: "food_search_index",
    }
);

FoodItemSchema.index({
    approved: 1,
    latest: 1,
});

FoodItemSchema.index({
    food_type: 1,
    category: 1,
});

FoodItemSchema.index({
    "enrichment.taxonomy.cuisine_family": 1,
});

FoodItemSchema.index({
    "enrichment.taxonomy.dish_family": 1,
});

FoodItemSchema.index({
    "enrichment.spice_level": 1,
});

module.exports = mongoose.model(
    "FoodItem",
    FoodItemSchema
);