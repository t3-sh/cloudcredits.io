import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";
import { ALLOWED_TAGS } from "./tags";

/*
  Providers collection schema
*/
const providersCollection = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "src/content/providers" }),
  schema: z.object({
    active: z.boolean().default(true),
    name: z.string(),
    short_name: z.string(),
    slug: z.string(),
    color: z.string(),
    url: z.string(),
    intro: z.string(),
    best_deal: z.string().max(50).default("Best Deal $$$"),
    video: z.string(),
    tags: z.array(z.enum(ALLOWED_TAGS)).max(5).default([]),
  }),
});

/*
  Programs collection schema
*/
const programsCollection = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "src/content/programs" }),
  schema: z.object({
    draft: z.boolean().optional(),
    date: z.date().optional(),
    provider_slug: z.string(),
    title: z.string(),
    meta_title: z.string().optional(),
    intro: z.string(),
    description: z.string(),
    status: z
      .enum(["Active", "Discontinued", "Beta", "Upcoming"])
      .default("Active"),
    tags: z.array(z.enum(ALLOWED_TAGS)).max(5).default([]),
    url: z.string(),
    value_type: z.enum(["credits", "discount"]).default("credits"),
    currency: z.enum(["USD", "EUR"]).default("USD"),
    min_value: z.number().optional(),
    max_value: z.number(),
    community_notes: z
      .array(
        z.object({
          title: z.string(),
          body: z.string(),
          source_url: z.string(),
        }),
      )
      .max(3)
      .default([]),
    tiers: z
      .array(
        z.object({
          name: z.string(),
          intro: z.string(),
          max_value: z.number(),
          url: z.string(),
          benefits: z.array(z.string()).max(5).default([]),
          benefits_level: z.number().min(1).max(4),
          duration: z.array(z.string()).max(5).default([]),
          eligibility: z.array(z.string()).max(5).default([]),
          effort: z.array(z.string()).max(5).default([]),
          effort_level: z.number().min(1).max(4),
          steps_to_apply: z
            .array(
              z.object({
                name: z.string(),
                description: z.string(),
                action: z.string().optional(),
                action_url: z.string().optional(),
              }),
            )
            .default([]),
        }),
      )
      .default([]),
    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      )
      .default([]),
    success_stories: z
      .array(
        z.object({
          image: z.string().optional(),
          title: z.string(),
          summary: z.string(),
          link: z.string(),
        }),
      )
      .max(3)
      .default([]),
  }),
});

export const collections = {
  providers: providersCollection,
  programs: programsCollection,
};
