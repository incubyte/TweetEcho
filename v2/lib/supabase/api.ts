import { UserMetadata, WebContent } from "./schemas";

// User Metadata API
export async function getUserMetadata(
  userId: string
): Promise<UserMetadata | null> {
  try {
    // Add origin to make it an absolute URL when running on server
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_BASE_URL || "https://tweet-echo.vercel.app";

    const response = await fetch(
      `${baseUrl}/api/user-metadata?userId=${userId}`,
      {
        credentials: "include",
      }
    );

    if (response.status === 404 || response.status === 204) {
      // Not found or no content
      return null;
    }

    if (!response.ok) {
      console.warn(
        `Error response from metadata API: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const data = await response.json().catch(() => {
      console.warn("Empty or invalid JSON response from metadata API");
      return null;
    });

    return data;
  } catch (error) {
    console.error("Error fetching user metadata:", error);
    return null;
  }
}

export async function saveUserMetadata(
  metadata: UserMetadata
): Promise<UserMetadata | null> {
  try {
    console.log("Saving metadata to API:", metadata);

    // Add origin to make it an absolute URL when running on server
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_BASE_URL || "https://tweet-echo.vercel.app";

    const response = await fetch(`${baseUrl}/api/user-metadata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(metadata),
      credentials: "include",
    });

    if (!response.ok) {
      console.error(
        `Failed to save user metadata: ${response.status} ${response.statusText}`
      );

      return null;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error saving user metadata:", error);
    return null;
  }
}

export async function updateUserMetadata(
  metadata: UserMetadata
): Promise<UserMetadata | null> {
  try {
    if (!metadata.id) {
      throw new Error("Cannot update metadata without ID");
    }

    // Add origin to make it an absolute URL when running on server
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_BASE_URL || "https://tweet-echo.vercel.app";

    const response = await fetch(`${baseUrl}/api/user-metadata`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(metadata),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to update user metadata: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating user metadata:", error);
    return null;
  }
}

export async function deleteUserMetadata(id: string): Promise<boolean> {
  try {
    // Add origin to make it an absolute URL when running on server
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_BASE_URL || "https://tweet-echo.vercel.app";

    const response = await fetch(`${baseUrl}/api/user-metadata?id=${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete user metadata: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting user metadata:", error);
    return false;
  }
}

// Web Content API
export async function getUserWebContent(userId: string): Promise<WebContent[]> {
  try {
    // Add origin to make it an absolute URL when running on server
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_BASE_URL || "https://tweet-echo.vercel.app";

    const response = await fetch(
      `${baseUrl}/api/web-content?userId=${userId}`,
      {
        credentials: "include",
      }
    );

    if (response.status === 404 || response.status === 204) {
      // Not found or no content
      return [];
    }

    if (!response.ok) {
      console.warn(
        `Error response from web content API: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const data = await response.json().catch(() => {
      console.warn("Empty or invalid JSON response from web content API");
      return [];
    });

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching user web content:", error);
    return [];
  }
}

export async function getWebContentByUrl(
  userId: string,
  url: string
): Promise<WebContent | null> {
  try {
    const encodedUrl = encodeURIComponent(url);
    // Add origin to make it an absolute URL when running on server
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_BASE_URL || "https://tweet-echo.vercel.app";

    const response = await fetch(
      `${baseUrl}/api/web-content?userId=${userId}&url=${encodedUrl}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(
        `Failed to fetch web content by URL: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching web content by URL:", error);
    return null;
  }
}

export async function saveWebContent(
  content: WebContent
): Promise<WebContent | null> {
  try {
    // Add origin to make it an absolute URL when running on server
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_BASE_URL || "https://tweet-echo.vercel.app";

    const response = await fetch(`${baseUrl}/api/web-content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(content),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to save web content: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving web content:", error);
    return null;
  }
}

export async function deleteWebContent(id: string): Promise<boolean> {
  try {
    // Add origin to make it an absolute URL when running on server
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_BASE_URL || "https://tweet-echo.vercel.app";

    const response = await fetch(`${baseUrl}/api/web-content?id=${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete web content: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting web content:", error);
    return false;
  }
}
