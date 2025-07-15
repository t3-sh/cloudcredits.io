import React from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FaTag } from "react-icons/fa6";
import { AnimatedProgramCard } from "./AnimatedProgramCard";
import { slugify } from "@/lib/utils/textConverter";

interface Program {
  id: string;
  slug: string;
  collection: string;
  data: {
    title: string;
    intro: string;
    max_value: number;
    value_type: string;
    currency: string;
    status: string;
    tags: string[];
    url: string;
    provider_slug: string;
    tiers: Array<{
      effort_level: number;
    }>;
  };
}

interface Provider {
  id: string;
  slug: string;
  collection: string;
  data: {
    title: string;
    slug: string;
    color: string;
    logo: string;
    website: string;
  };
}

interface Props {
  program: Program;
  allProviders: Provider[];
}

type EffortLevel = 1 | 2 | 3 | 4;
type EffortInfo = { label: string };

const effortLevelMap: Record<EffortLevel, EffortInfo> = {
  4: { label: "Simple" },
  3: { label: "Moderate" },
  2: { label: "Complex" },
  1: { label: "Very Complex" },
} as const;

export default function ProgramCard({ program, allProviders }: Props) {
  const {
    title,
    intro,
    max_value,
    value_type,
    currency,
    status,
    tags,
    provider_slug,
    tiers,
  } = program.data;

  // Find the provider and get its color
  const provider = allProviders.find((p) => p.data.slug === provider_slug);
  const color = provider?.data.color || "#232f3e";

  const lowestEffortLevel = Math.max(
    ...tiers.map((tier: { effort_level: number }) => tier.effort_level),
  );
  const effort = effortLevelMap[lowestEffortLevel as EffortLevel];

  // Simple logo path logic - preferring mini version if available
  const logo = `/images/providers/${provider_slug}.mini.svg`;

  const programSlug = program.id
    .split("/")
    .pop()
    ?.replace(/\.yaml$/, "");

  const handleTagClick = (tag: string) => {
    window.location.href = `/tags/${slugify(tag)}`;
  };

  return (
    <a
      href={`/providers/${provider_slug}/programs/${programSlug}`}
      className="block transform-gpu program-card-container"
      data-program-tags={tags.join(",")}
    >
      <AnimatedProgramCard color={color} status={status}>
        <div
          className="flex-1 p-6 flex flex-col justify-between h-full transform-gpu"
          data-program-tags={tags.join(",")}
        >
          <div className="flex flex-col h-full">
            {/* Header with logo and title */}
            <div className="mb-5 transform-gpu flex flex-col items-center">
              <div className="w-auto h-16 flex-shrink-0 transform-gpu mb-4 flex items-center justify-center">
                <img
                  className="h-full max-w-[180px] object-contain transform-gpu provider-logo"
                  src={logo}
                  alt={title}
                  width={180}
                  height={64}
                  onError={(e) => {
                    // Fallback to regular logo if mini doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.src = `/images/providers/${provider_slug}.svg`;
                  }}
                />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90 transform-gpu text-center">
                {title}
              </h4>
              <div className="mt-2">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                  }`}
                >
                  {status}
                </span>
              </div>
            </div>

            {/* Program intro */}
            <div className="flex-grow mb-5">
              <p className="text-lg line-clamp-3 text-gray-600 dark:text-white/80 transform-gpu min-h-[4.5rem]">
                {intro}
              </p>
            </div>

            {/* Credit value */}
            <div className="mb-5 transform-gpu">
              <p className="text-3xl font-bold transform-gpu" style={{ color }}>
                {value_type === "credits" ? (
                  <>
                    {currency === "USD" ? "$" : "€"}
                    {max_value.toLocaleString()}
                  </>
                ) : (
                  <>{max_value}%</>
                )}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 transform-gpu">
                {value_type === "credits" ? "in credits" : "discount"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer section */}
        <div className="p-6 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-t border-gray-200/50 dark:border-white/5 transform-gpu shadow-sm">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5 min-h-[2.5rem] items-start">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-sm bg-white/80 dark:bg-white/5 text-gray-700 dark:text-gray-200 text-sm 
                border border-gray-200/70 dark:border-white/5 transform-gpu hover:bg-white/90 dark:hover:bg-white/10 transition-all duration-300 shadow-sm cursor-pointer"
                onClick={() => handleTagClick(tag)}
              >
                <FaTag className="text-xs" style={{ color }} />
                {tag}
              </span>
            ))}
          </div>

          {/* View Details link */}
          <div className="group/link flex items-center justify-between transform-gpu">
            <div
              className="flex items-center text-lg font-medium transition-all duration-300 transform-gpu"
              style={{ color }}
            >
              View Details
              <MdOutlineKeyboardArrowRight className="ml-1 transition-transform duration-300 group-hover/link:translate-x-1" />
            </div>
          </div>
        </div>
      </AnimatedProgramCard>
    </a>
  );
}
