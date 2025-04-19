const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY; // Note: FIRECRAW_API_KEY (without the L) as defined in your .env.local
const FIRECRAWL_API_URL = "https://api.firecrawl.dev/v1/crawl";

/**
 * Scrapes a web page using the Firecrawl API
 * @param url The URL to scrape
 * @returns The scraped content
 */
export async function scrapeWebpage(url: string): Promise<string> {
  if (!FIRECRAWL_API_KEY) {
    throw new Error("FIRECRAWL_API_KEY is not defined");
  }

  try {
    // Check the URL format
    try {
      new URL(url);
    } catch (error) {
      throw new Error(`Invalid URL format: ${error}`);
    }

    console.log(`Scraping URL with Firecrawl: ${url}`);

    // Step 1: Start a crawl job
    console.log("Step 1: Initiating crawl job...");
    const initiateResponse = await fetch(FIRECRAWL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({ url: url }),
    });

    if (!initiateResponse.ok) {
      const errorText = await initiateResponse.text();
      throw new Error(
        `Failed to initiate crawl: ${initiateResponse.status} ${errorText}`
      );
    }

    const initiateData = await initiateResponse.json();
    console.log("Crawl initiated:", initiateData);

    if (!initiateData.success || !initiateData.id) {
      throw new Error(
        `Failed to get crawl ID: ${JSON.stringify(initiateData)}`
      );
    }

    const crawlId = initiateData.id;
    console.log("Crawl ID:", crawlId);

    // Step 2: Poll for crawl completion
    console.log("Step 2: Polling for crawl completion...");
    let maxRetries = 10;
    let delay = 2000; // Start with 2 seconds
    let crawlData = null;

    while (maxRetries > 0) {
      console.log(`Checking crawl status (${maxRetries} retries left)...`);
      await new Promise((resolve) => setTimeout(resolve, delay));

      const statusResponse = await fetch(`${FIRECRAWL_API_URL}/${crawlId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
        },
      });

      if (!statusResponse.ok) {
        console.warn(`Status check failed: ${statusResponse.status}`);
        maxRetries--;
        delay *= 1.5; // Exponential backoff
        continue;
      }

      const statusData = await statusResponse.json();
      console.log("Status response:", JSON.stringify(statusData));

      if (statusData.success && statusData.status === "completed") {
        crawlData = statusData;
        break;
      }

      maxRetries--;
      delay *= 1.5; // Exponential backoff
    }

    if (!crawlData) {
      throw new Error("Crawl job did not complete in time");
    }

    // Step 3: Extract content from completed crawl
    console.log("Step 3: Extracting content from completed crawl...");

    let title = "No title";
    let description = "No description";
    let content = "No content";

    // Extract from data array
    if (crawlData.data && crawlData.data.length > 0) {
      const pageData = crawlData.data[0];

      // Extract markdown content if available
      if (pageData.markdown) {
        content = pageData.markdown;
      }

      // Extract metadata
      if (pageData.metadata) {
        title = pageData.metadata.title || title;
        description = pageData.metadata.description || description;
      }
    }

    // Combine the content into a structured format
    const structuredContent = [
      `Title: ${title}`,
      `Description: ${description}`,
      `Content: ${content}`,
    ].join("\n\n");

    console.log("Successfully extracted content from URL");
    return structuredContent;
  } catch (error) {
    console.error("Error scraping webpage:", error);
    throw error;
  }
}

/**
 * Extracts key information from a web page
 * @param url The URL to extract information from
 * @returns Structured content from the webpage
 */
export async function extractKeyInformation(url: string): Promise<string> {
  try {
    // Scrape the webpage content
    const content = await scrapeWebpage(url);
    console.log("Extracted content:", content.substring(0, 200) + "...");
    return content;
  } catch (error) {
    console.error("Error extracting key information:", error);
    throw error;
  }
}
