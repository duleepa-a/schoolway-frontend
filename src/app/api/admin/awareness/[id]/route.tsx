import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const post = await prisma.awarenessPost.findUnique({
      where: { id },
      include: {
        UserProfile: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
            role: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Awareness post not found" },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.awarenessPost.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      post: {
        id: post.id,
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl,
        category: post.category,
        targetAudience: post.targetAudience,
        priority: post.priority,
        scheduledDate: post.scheduledDate,
        isPublished: post.isPublished,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: post.author,
        views: post.views + 1, // Return incremented view count
      },
    });

  } catch (error) {
    console.error("Error fetching awareness post:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch awareness post",
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { 
      title, 
      content, 
      imageUrl, 
      category, 
      targetAudience, 
      priority, 
      scheduledDate, 
      isPublished 
    } = body;

    // Validate required fields
    if (!title || !content || !category || !targetAudience) {
      return NextResponse.json(
        { error: "Missing required fields: title, content, category, and targetAudience are required" },
        { status: 400 }
      );
    }

    // Check if post exists
    const existingPost = await prisma.awarenessPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Awareness post not found" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      title,
      content,
      category,
      targetAudience,
      priority: priority || existingPost.priority,
    };

    // Handle optional fields
    if (imageUrl !== undefined) {
      updateData.imageUrl = imageUrl;
    }

    if (scheduledDate !== undefined) {
      updateData.scheduledDate = scheduledDate ? new Date(scheduledDate) : null;
    }

    if (isPublished !== undefined) {
      updateData.isPublished = isPublished;
      // Set publishedAt if publishing for the first time
      if (isPublished && !existingPost.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    // Update the post
    const updatedPost = await prisma.awarenessPost.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      message: "Awareness post updated successfully",
      post: {
        id: updatedPost.id,
        title: updatedPost.title,
        content: updatedPost.content,
        imageUrl: updatedPost.imageUrl,
        category: updatedPost.category,
        targetAudience: updatedPost.targetAudience,
        priority: updatedPost.priority,
        scheduledDate: updatedPost.scheduledDate,
        isPublished: updatedPost.isPublished,
        publishedAt: updatedPost.publishedAt,
        createdAt: updatedPost.createdAt,
        updatedAt: updatedPost.updatedAt,
        author: updatedPost.author,
        views: updatedPost.views,
      },
    });

  } catch (error) {
    console.error("Error updating awareness post:", error);
    return NextResponse.json(
      { 
        error: "Failed to update awareness post",
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Check if post exists
    const post = await prisma.awarenessPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Awareness post not found" },
        { status: 404 }
      );
    }

    // Delete the post
    await prisma.awarenessPost.delete({
      where: { id }
    });

    return NextResponse.json({
      message: "Awareness post deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting awareness post:", error);
    return NextResponse.json(
      { 
        error: "Failed to delete awareness post",
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
