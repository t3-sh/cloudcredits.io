import React, { useEffect, useState } from "react";
import SearchResult, { type ISearchItem } from "./SearchResult";

declare global {
  interface Window {
    pagefind: any;
  }
}

interface PagefindResult {
  id: string;
  data: () => Promise<{
    url: string;
    content: string;
    meta: {
      title: string;
      image?: string;
      description?: string;
      tags?: string[];
    };
  }>;
  excerpt: (params: { highlight: string[] }) => Promise<{ excerpt: string }>;
}

const SearchModal = () => {
  const [searchString, setSearchString] = useState("");
  const [searchResult, setSearchResult] = useState<ISearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagefindInitialized, setPagefindInitialized] = useState(false);
  const [totalTime, setTotalTime] = useState("0.000");
  const [pagefindError, setPagefindError] = useState<string | null>(null);

  useEffect(() => {
    const loadPagefind = async () => {
      if (!pagefindInitialized && typeof window !== "undefined") {
        try {
          setIsLoading(true);
          setPagefindError(null);

          if (window.pagefind) {
            await window.pagefind.init();
            setPagefindInitialized(true);
            setIsLoading(false);
            return;
          }

          // Load the Pagefind script
          console.log("Loading Pagefind script...");
          const script = document.createElement("script");
          script.src = "/pagefind/pagefind.js";

          const scriptLoadPromise = new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = () =>
              reject(new Error("Failed to load Pagefind script"));
          });

          document.body.appendChild(script);

          // Wait for script to load
          await scriptLoadPromise;
          console.log("Pagefind script loaded, initializing...");

          if (window.pagefind) {
            try {
              await window.pagefind.init();
              console.log("Pagefind initialized successfully");

              const testSearch = await window.pagefind.search("test");
              if (!testSearch) {
                throw new Error("Pagefind index not found or invalid");
              }

              setPagefindInitialized(true);
            } catch (initError) {
              console.error("Error initializing Pagefind:", initError);
              setPagefindError(
                "Search index not found. Make sure Pagefind index is generated correctly.",
              );
            }
          } else {
            console.error(
              "Pagefind script loaded but window.pagefind is undefined",
            );
            setPagefindError(
              "Failed to initialize search. Please try again later.",
            );
          }
        } catch (error) {
          console.error("Error loading or initializing Pagefind:", error);
          setPagefindError(
            "Failed to load search functionality. Please try again later.",
          );
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadPagefind();
  }, []); // Remove pagefindInitialized from dependencies to prevent infinite loop

  const handleSearch = (e: React.FormEvent<HTMLInputElement>) => {
    setSearchString(e.currentTarget.value.replace("\\", "").toLowerCase());
  };

  // Perform search using Pagefind
  useEffect(() => {
    const doSearch = async () => {
      if (!searchString || !pagefindInitialized) {
        setSearchResult([]);
        return;
      }

      if (!window.pagefind) {
        console.error(
          "Pagefind is not available even though initialization flag is set",
        );
        setSearchResult([]);
        return;
      }

      setIsLoading(true);
      const startTime = performance.now();

      try {
        console.log(`Searching for: "${searchString}"`);
        const search = await window.pagefind.search(searchString);

        if (!search || !search.results) {
          console.log(`No results found for: "${searchString}"`);
          setSearchResult([]);
          const endTime = performance.now();
          setTotalTime(((endTime - startTime) / 1000).toFixed(3));
          setIsLoading(false);
          return;
        }

        console.log(
          `Found ${search.results.length} results for: "${searchString}"`,
        );

        // Convert Pagefind results to our ISearchItem format
        const results = await Promise.all(
          search.results.map(async (result: PagefindResult) => {
            try {
              const data = await result.data();
              const excerptData = await result.excerpt({
                highlight: [searchString],
              });

              // Extract the path from the URL to get the slug
              const slug = data.url.replace(/^\/|\/$/g, "");

              // Determine the group based on the URL structure
              const urlParts = slug.split("/");
              const group = urlParts.length > 0 ? urlParts[0] : "page";

              return {
                group,
                slug,
                frontmatter: {
                  title: data.meta.title || "",
                  image: data.meta.image,
                  description: data.meta.description,
                  tags: data.meta.tags,
                },
                content: excerptData.excerpt || data.content || "",
              };
            } catch (err) {
              console.error("Error processing search result:", err);
              return null;
            }
          }),
        );

        // Filter out any null results from errors
        const validResults = results.filter(
          (result) => result !== null,
        ) as ISearchItem[];

        setSearchResult(validResults);
        const endTime = performance.now();
        setTotalTime(((endTime - startTime) / 1000).toFixed(3));
      } catch (error) {
        console.error("Error searching with Pagefind:", error);
        setSearchResult([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search to avoid too many requests
    const timer = setTimeout(() => {
      doSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchString, pagefindInitialized]);

  // search dom manipulation
  useEffect(() => {
    const searchModal = document.getElementById("searchModal");
    const searchInput = document.getElementById("searchInput");
    const searchModalOverlay = document.getElementById("searchModalOverlay");
    const searchResultItems = document.querySelectorAll("#searchItem");
    const searchModalTriggers = document.querySelectorAll(
      "[data-search-trigger]",
    );

    // search modal open
    searchModalTriggers.forEach((button) => {
      button.addEventListener("click", function () {
        const searchModal = document.getElementById("searchModal");
        searchModal!.classList.add("show");
        searchInput!.focus();
      });
    });

    // search modal close
    searchModalOverlay!.addEventListener("click", function () {
      searchModal!.classList.remove("show");
    });

    // keyboard navigation
    let selectedIndex = -1;

    const updateSelection = () => {
      searchResultItems.forEach((item, index) => {
        if (index === selectedIndex) {
          item.classList.add("search-result-item-active");
        } else {
          item.classList.remove("search-result-item-active");
        }
      });

      searchResultItems[selectedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    };

    document.addEventListener("keydown", function (event) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        searchModal!.classList.add("show");
        searchInput!.focus();
        updateSelection();
      }

      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
      }

      if (event.key === "Escape") {
        searchModal!.classList.remove("show");
      }

      if (event.key === "ArrowUp" && selectedIndex > 0) {
        selectedIndex--;
      } else if (
        event.key === "ArrowDown" &&
        selectedIndex < searchResultItems.length - 1
      ) {
        selectedIndex++;
      } else if (event.key === "Enter") {
        const activeLink = document.querySelector(
          ".search-result-item-active a",
        ) as HTMLAnchorElement;
        if (activeLink) {
          activeLink?.click();
        }
      }

      updateSelection();
    });
  }, [searchString]);

  return (
    <div id="searchModal" className="search-modal">
      <div id="searchModalOverlay" className="search-modal-overlay" />
      <div className="search-wrapper">
        <div className="search-wrapper-header">
          <label
            htmlFor="searchInput"
            className="absolute left-7 top-[calc(50%-7px)]"
          >
            <span className="sr-only">search icon</span>
            {searchString ? (
              <svg
                onClick={() => setSearchString("")}
                viewBox="0 0 512 512"
                height="18"
                width="18"
                className="hover:text-red-500 cursor-pointer -mt-0.5"
              >
                <title>close icon</title>
                <path
                  fill="currentcolor"
                  d="M256 512A256 256 0 10256 0a256 256 0 100 512zM175 175c9.4-9.4 24.6-9.4 33.9.0l47 47 47-47c9.4-9.4 24.6-9.4 33.9.0s9.4 24.6.0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6.0 33.9s-24.6 9.4-33.9.0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9.0s-9.4-24.6.0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6.0-33.9z"
                ></path>
              </svg>
            ) : (
              <svg
                viewBox="0 0 512 512"
                height="18"
                width="18"
                className="-mt-0.5"
              >
                <title>search icon</title>
                <path
                  fill="currentcolor"
                  d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8.0 45.3s-32.8 12.5-45.3.0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9.0 208S93.1.0 208 0 416 93.1 416 208zM208 352a144 144 0 100-288 144 144 0 100 288z"
                ></path>
              </svg>
            )}
          </label>
          <input
            id="searchInput"
            placeholder="Search..."
            className="search-wrapper-header-input"
            type="input"
            name="search"
            value={searchString}
            onChange={handleSearch}
            autoComplete="off"
            disabled={!!pagefindError}
          />
        </div>
        {isLoading ? (
          <div className="search-wrapper-body">
            <div className="py-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-4">Loading search functionality...</p>
            </div>
          </div>
        ) : pagefindError ? (
          <div className="search-wrapper-body">
            <div className="py-8 text-center text-red-500">
              <svg
                className="mx-auto"
                width="42"
                height="42"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p className="mt-4">{pagefindError}</p>
            </div>
          </div>
        ) : (
          <SearchResult
            searchResult={searchResult}
            searchString={searchString}
          />
        )}
        <div className="search-wrapper-footer">
          <span className="flex items-center">
            <kbd>
              <svg
                width="14"
                height="14"
                fill="currentcolor"
                viewBox="0 0 16 16"
              >
                <path d="M3.204 11h9.592L8 5.519 3.204 11zm-.753-.659 4.796-5.48a1 1 0 011.506.0l4.796 5.48c.566.647.106 1.659-.753 1.659H3.204a1 1 0 01-.753-1.659z"></path>
              </svg>
            </kbd>
            <kbd>
              <svg
                width="14"
                height="14"
                fill="currentcolor"
                viewBox="0 0 16 16"
              >
                <path d="M3.204 5h9.592L8 10.481 3.204 5zm-.753.659 4.796 5.48a1 1 0 001.506.0l4.796-5.48c.566-.647.106-1.659-.753-1.659H3.204a1 1 0 00-.753 1.659z"></path>
              </svg>
            </kbd>
            to navigate
          </span>
          <span className="flex items-center">
            <kbd>
              <svg
                width="12"
                height="12"
                fill="currentcolor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M14.5 1.5a.5.5.0 01.5.5v4.8a2.5 2.5.0 01-2.5 2.5H2.707l3.347 3.346a.5.5.0 01-.708.708l-4.2-4.2a.5.5.0 010-.708l4-4a.5.5.0 11.708.708L2.707 8.3H12.5A1.5 1.5.0 0014 6.8V2a.5.5.0 01.5-.5z"
                ></path>
              </svg>
            </kbd>
            to select
          </span>
          {searchString && !isLoading && !pagefindError && (
            <span>
              <strong>{searchResult.length} </strong> results - in{" "}
              <strong>{totalTime} </strong> seconds
            </span>
          )}
          <span>
            <kbd>ESC</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
