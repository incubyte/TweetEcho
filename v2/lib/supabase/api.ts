import { UserMetadata, WebContent } from './schemas';

// User Metadata API
export async function getUserMetadata(userId: string): Promise<UserMetadata | null> {
  try {
    const response = await fetch(`/api/user-metadata?userId=${userId}`);
    
    if (response.status === 404 || response.status === 204) {
      // Not found or no content
      return null;
    }
    
    if (!response.ok) {
      console.warn(`Error response from metadata API: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data = await response.json().catch(e => {
      console.warn('Empty or invalid JSON response from metadata API');
      return null;
    });
    
    return data;
  } catch (error) {
    console.error('Error fetching user metadata:', error);
    return null;
  }
}

export async function saveUserMetadata(metadata: UserMetadata): Promise<UserMetadata | null> {
  try {
    console.log('Saving metadata to API:', metadata);
    
    const response = await fetch('/api/user-metadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    });
    
    if (!response.ok) {
      console.error(`Failed to save user metadata: ${response.status} ${response.statusText}`);
      
      // Try to get more error details from response body
      try {
        const errorData = await response.json();
        console.error('Error details:', errorData);
      } catch (e) {
        // Ignore parsing errors
      }
      
      return null;
    }
    
    const result = await response.json();
    console.log('Metadata saved successfully:', result);
    return result;
  } catch (error) {
    console.error('Error saving user metadata:', error);
    return null;
  }
}

export async function updateUserMetadata(metadata: UserMetadata): Promise<UserMetadata | null> {
  try {
    if (!metadata.id) {
      throw new Error('Cannot update metadata without ID');
    }
    
    const response = await fetch('/api/user-metadata', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update user metadata: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating user metadata:', error);
    return null;
  }
}

export async function deleteUserMetadata(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/user-metadata?id=${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete user metadata: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting user metadata:', error);
    return false;
  }
}

// Web Content API
export async function getUserWebContent(userId: string): Promise<WebContent[]> {
  try {
    const response = await fetch(`/api/web-content?userId=${userId}`);
    
    if (response.status === 404 || response.status === 204) {
      // Not found or no content
      return [];
    }
    
    if (!response.ok) {
      console.warn(`Error response from web content API: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const data = await response.json().catch(e => {
      console.warn('Empty or invalid JSON response from web content API');
      return [];
    });
    
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching user web content:', error);
    return [];
  }
}

export async function getWebContentByUrl(userId: string, url: string): Promise<WebContent | null> {
  try {
    const encodedUrl = encodeURIComponent(url);
    const response = await fetch(`/api/web-content?userId=${userId}&url=${encodedUrl}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch web content by URL: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching web content by URL:', error);
    return null;
  }
}

export async function saveWebContent(content: WebContent): Promise<WebContent | null> {
  try {
    const response = await fetch('/api/web-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(content),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save web content: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving web content:', error);
    return null;
  }
}

export async function deleteWebContent(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/web-content?id=${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete web content: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting web content:', error);
    return false;
  }
}