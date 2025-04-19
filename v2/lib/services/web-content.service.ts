import prisma from '@/lib/prisma';
import { WebContentInput } from '@/lib/types/prisma';
import { WebContent } from '@/lib/supabase/schemas';

/**
 * Gets all web content for a user
 */
export async function getUserWebContent(userId: string) {
  try {
    const content = await prisma.webContent.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Convert Prisma models to our application schema
    return content.map((item) => ({
      id: item.id,
      user_id: item.userId,
      url: item.url,
      title: item.title,
      description: item.description || '',
      content: item.content,
      created_at: item.createdAt.toISOString(),
      updated_at: item.updatedAt.toISOString(),
    })) as WebContent[];
  } catch (error) {
    console.error('Error fetching user web content:', error);
    throw error;
  }
}

/**
 * Gets web content by URL for a specific user
 */
export async function getWebContentByUrl(userId: string, url: string) {
  try {
    const content = await prisma.webContent.findFirst({
      where: {
        userId,
        url,
      },
    });

    if (!content) return null;

    // Convert Prisma model to our application schema
    return {
      id: content.id,
      user_id: content.userId,
      url: content.url,
      title: content.title,
      description: content.description || '',
      content: content.content,
      created_at: content.createdAt.toISOString(),
      updated_at: content.updatedAt.toISOString(),
    } as WebContent;
  } catch (error) {
    console.error('Error fetching web content by URL:', error);
    throw error;
  }
}

/**
 * Saves web content, updating existing if the URL exists
 */
export async function saveWebContent(content: WebContent) {
  try {
    // Check if content already exists for this user and URL
    const existingContent = await prisma.webContent.findFirst({
      where: {
        userId: content.user_id,
        url: content.url,
      },
    });

    // Convert application schema to Prisma input
    const input: WebContentInput = {
      userId: content.user_id,
      url: content.url,
      title: content.title,
      description: content.description,
      content: content.content,
    };

    let savedContent;
    if (existingContent) {
      // Update existing content
      savedContent = await prisma.webContent.update({
        where: {
          id: existingContent.id,
        },
        data: {
          ...input,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new content
      savedContent = await prisma.webContent.create({
        data: input,
      });
    }

    // Convert back to application schema
    return {
      id: savedContent.id,
      user_id: savedContent.userId,
      url: savedContent.url,
      title: savedContent.title,
      description: savedContent.description || '',
      content: savedContent.content,
      created_at: savedContent.createdAt.toISOString(),
      updated_at: savedContent.updatedAt.toISOString(),
    } as WebContent;
  } catch (error) {
    console.error('Error saving web content:', error);
    throw error;
  }
}

/**
 * Deletes web content by ID
 */
export async function deleteWebContent(id: string) {
  try {
    await prisma.webContent.delete({
      where: {
        id,
      },
    });
    return true;
  } catch (error) {
    console.error('Error deleting web content:', error);
    throw error;
  }
}