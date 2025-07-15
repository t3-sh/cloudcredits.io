import React, { useState, useEffect } from "react";
import AIInput from "./AIInput";
import ProgramCard from "./ProgramCard";
import LoadingIndicator from "./LoadingIndicator";

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

interface APIResponse {
  summary: string;
  programs: Array<{ title: string }>;
}

interface AssistantClientProps {
  allPrograms: Program[];
  allProviders: Provider[];
}

export default function AssistantClient({
  allPrograms,
  allProviders,
}: AssistantClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [matchedPrograms, setMatchedPrograms] = useState<Program[]>([]);
  const [prompt, setPrompt] = useState("");
  const [hasProcessedUrlPrompt, setHasProcessedUrlPrompt] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlPrompt = urlParams.get("prompt");

    if (urlPrompt && !hasProcessedUrlPrompt) {
      setPrompt(urlPrompt);
      setHasProcessedUrlPrompt(true);

      // Clear the URL parameter immediately to prevent re-processing
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("prompt");
      window.history.replaceState({}, "", newUrl.toString());

      handleAPICall(urlPrompt);
    }
  }, [hasProcessedUrlPrompt]);

  const handleAPICall = async (inputPrompt: string) => {
    setIsLoading(true);
    setError("");
    setSummary("");
    setMatchedPrograms([]);

    try {
      const aiEndpoint =
        import.meta.env.PUBLIC_AI_CHAT_ENDPOINT || "http://localhost:8000/chat";
      const response = await fetch(aiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: inputPrompt }),
      });

      if (!response.ok) {
        let msg = `:/ AI can't handle this right now. Please try again later.`;
        if (response.status >= 400 && response.status < 500) {
          try {
            const errData = await response.json();
            if (errData && typeof errData.message === "string")
              msg = errData.message;
          } catch {}
        }
        throw new Error(msg);
      }

      const apiResponse: APIResponse = await response.json();

      if (!apiResponse || typeof apiResponse.summary !== "string") {
        throw new Error("Invalid API response format");
      }

      setSummary(apiResponse.summary);

      // Find programs by title from the collection
      if (apiResponse.programs && Array.isArray(apiResponse.programs)) {
        const matched = apiResponse.programs
          .map((program: { title: string }) => {
            return allPrograms.find((p) => p.data.title === program.title);
          })
          .filter((p): p is Program => p !== undefined);
        setMatchedPrograms(matched);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(
        err instanceof Error
          ? err.message
          : "AI can't handle this right now. Please try again later.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (value: string) => {
    setPrompt(value);

    // Don't update URL with prompt parameter to avoid re-processing
    // Just call the API directly
    await handleAPICall(value);
  };

  return (
    <>
      {/* AI Input Section - Full width but with max-width for the input */}
      <div className="container">
        <div className="max-w-3xl mx-auto mb-8 mt-8">
          <AIInput onSubmit={handleSubmit} loading={isLoading} />
        </div>
      </div>

      <section className="section-sm">
        <div className="container">
          {/* Error message container */}
          {error && (
            <div
              id="error-message"
              className="text-center py-6 px-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg mb-6 animate-fade-in"
            >
              <div className="py-2">{error}</div>
              <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => prompt && handleAPICall(prompt)}
                  className="btn bg-primary text-white px-6 py-2 rounded-md inline-flex items-center gap-2 hover:bg-opacity-90"
                  disabled={isLoading}
                >
                  <span className="leading-none self-center">Try Again</span>
                </button>
                <a
                  href="/providers"
                  className="btn border border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 inline-flex items-center gap-2"
                >
                  <span className="leading-none self-center">
                    Explore Deals
                  </span>
                  <span className="leading-none self-center ml-1">→</span>
                </a>
              </div>
            </div>
          )}

          {/* Loading state */}
          {isLoading && <LoadingIndicator />}

          {/* Results container */}
          {!isLoading && (summary || matchedPrograms.length > 0) && (
            <div id="results-container" className="animate-fade-in">
              {/* Summary - Full width but readable */}
              {summary && (
                <div
                  className="mb-10 prose prose-lg dark:prose-invert max-w-5xl mx-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
                  data-summary
                >
                  <div
                    id="summary-container"
                    dangerouslySetInnerHTML={{
                      __html: summary.replace(/\n/g, "<br>"),
                    }}
                  />
                </div>
              )}

              {/* Programs - Full width grid */}
              {matchedPrograms.length > 0 && (
                <div id="programs-container" className="animate-fade-in">
                  <h2 className="mb-6 text-2xl font-bold text-center">
                    Recommended Programs
                  </h2>
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
                    {matchedPrograms.map((program, index) => (
                      <div
                        key={program.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <ProgramCard
                          program={program}
                          allProviders={allProviders}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* No results state */}
          {!isLoading &&
            prompt &&
            !error &&
            !summary &&
            matchedPrograms.length === 0 && (
              <div
                id="no-results"
                className="text-center py-12 animate-fade-in"
              >
                <div className="max-w-md mx-auto">
                  <h3 className="text-xl font-semibold mb-3">
                    No matching programs found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Try rephrasing your query or explore our full catalog of
                    deals.
                  </p>
                  <a
                    href="/providers"
                    className="btn bg-primary text-white px-6 py-3 rounded-md inline-flex items-center gap-2 hover:bg-opacity-90"
                  >
                    <span className="leading-none self-center">
                      Browse All Deals
                    </span>
                    <span className="leading-none self-center ml-1">→</span>
                  </a>
                </div>
              </div>
            )}

          {/* Empty state */}
          {!prompt && !isLoading && !error && (
            <div id="empty-state" className="text-center py-16 animate-fade-in">
              <div className="max-w-lg mx-auto">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Ask me anything about cloud deals
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  I can help you find the perfect cloud credits, SaaS discounts,
                  and startup programs based on your specific needs.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  {[
                    "GPU credits in Europe for AI training",
                    "Free transactional email sending credits",
                    "Cheapest cloud storage for startups",
                    "Database hosting with 12 months free",
                    "CDN credits for media streaming",
                    "Kubernetes hosting for early stage startups",
                    "Free monitoring tools for production apps",
                    "Video transcoding credits for content creators",
                    "Analytics platforms with startup discounts",
                    "API gateway credits for microservices",
                  ].map((example, index) => (
                    <button
                      key={index}
                      onClick={() => handleSubmit(example)}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-300 hover:border-primary"
                    >
                      "{example}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
