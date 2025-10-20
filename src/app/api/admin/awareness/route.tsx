import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface AwarenessPostRequestBody {
  title: string;
  content: string;
  imageUrl?: string;
  category: string;
  targetAudience: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  scheduledDate?: string;
  isPublished: boolean;
  authorId: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== AWARENESS POST API CALL STARTED ===');
    
    // Test database connection
    try {
      await prisma.$connect();
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }
    
    const body = await request.json();
    console.log('Awareness post creation request body:', body);
    const { 
      title, 
      content, 
      imageUrl, 
      category, 
      targetAudience, 
      priority, 
      scheduledDate, 
      isPublished,
      authorId 
    } = body as AwarenessPostRequestBody;

    // Validate required fields
    if (!title || !content || !category || !targetAudience || !authorId) {
      console.log('Validation failed - missing required fields:', { title, content, category, targetAudience, authorId });
      return NextResponse.json(
        { error: "Missing required fields: title, content, category, targetAudience, and authorId are required" },
        { status: 400 }
      );
    }

    // For now, skip author validation - you can add proper auth later
    // TODO: Implement proper authentication and get real authorId from session
    console.log('Author ID:', authorId);

    // Create a temporary admin user if it doesn't exist
    let adminUser;
    try {
      adminUser = await prisma.userProfile.findUnique({
        where: { id: authorId }
      });
      
      if (!adminUser) {
        // Create a temporary admin user
        adminUser = await prisma.userProfile.create({
          data: {
            id: authorId,
            email: 'admin@schoolway.com',
            firstname: 'Admin',
            lastname: 'User',
            password: 'temp-password',
            role: 'ADMIN',
            activeStatus: true,
            updatedAt: new Date()
          }
        });
        console.log('Created temporary admin user:', adminUser);
      }
    } catch (error) {
      console.error('Error handling admin user:', error);
      // Continue without user validation for now
    }

    // Determine if this is a scheduled post
    const isScheduledPost = scheduledDate && new Date(scheduledDate) > new Date();
    
    // Prepare data for creation
    const postData: any = {
      title,
      content,
      category,
      targetAudience,
      priority: priority || 'MEDIUM',
      isPublished: isScheduledPost ? false : (isPublished || false), // Scheduled posts are not published immediately
      authorId,
      views: 0,
    };

    // Add optional fields if provided
    if (imageUrl) {
      postData.imageUrl = imageUrl;
    }

    if (scheduledDate) {
      postData.scheduledDate = new Date(scheduledDate);
    }

    // Only set publishedAt if it's actually published (not scheduled)
    if (isPublished && !isScheduledPost) {
      postData.publishedAt = new Date();
    }

    // Create the awareness post
    console.log('Creating awareness post with data:', postData);
    const newPost = await prisma.awarenessPost.create({
      data: postData,
    });
    console.log('Awareness post created successfully:', newPost);

    // Return success response with created post data
    return NextResponse.json({
      message: "Awareness post created successfully",
      post: {
        id: newPost.id,
        title: newPost.title,
        content: newPost.content,
        imageUrl: newPost.imageUrl,
        category: newPost.category,
        targetAudience: newPost.targetAudience,
        priority: newPost.priority,
        scheduledDate: newPost.scheduledDate,
        isPublished: newPost.isPublished,
        publishedAt: newPost.publishedAt,
        createdAt: newPost.createdAt,
        updatedAt: newPost.updatedAt,
        authorId: newPost.authorId,
        views: newPost.views,
      },
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating awareness post:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    return NextResponse.json(
      { 
        error: "Failed to create awareness post",
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const targetAudience = searchParams.get('targetAudience');
    const isPublished = searchParams.get('isPublished');
    const scheduled = searchParams.get('scheduled');
    const authorId = searchParams.get('authorId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build where clause
    let whereClause: any = {};
    
    if (category) {
      whereClause.category = category;
    }
    
    if (targetAudience) {
      whereClause.targetAudience = targetAudience;
    }
    
    if (scheduled === 'true') {
      // For scheduled posts: not published and has scheduled date in the future
      whereClause.isPublished = false;
      whereClause.scheduledDate = {
        not: null,
        gt: new Date() // Only future scheduled dates
      };
    } else if (isPublished !== null) {
      whereClause.isPublished = isPublished === 'true';
      
      // If fetching drafts (isPublished=false), exclude scheduled posts
      if (isPublished === 'false') {
        whereClause.AND = [
          {
            OR: [
              { scheduledDate: null }, // No scheduled date
              { scheduledDate: { lt: new Date() } } // Past scheduled date (expired)
            ]
          }
        ];
      }
    }
    
    if (authorId) {
      whereClause.authorId = authorId;
    }

    // Get total count for pagination
    const totalCount = await prisma.awarenessPost.count({
      where: whereClause,
    });

    // Fetch posts with pagination
    const posts = await prisma.awarenessPost.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
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

    const formattedPosts = posts.map((post: any) => ({
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
      authorId: post.authorId,
      views: post.views,
      UserProfile: post.UserProfile,
    }));

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1,
      },
    });

  } catch (error) {
    console.error("Error fetching awareness posts:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch awareness posts",
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      id, 
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
    if (!id || !title || !content || !category || !targetAudience) {
      return NextResponse.json(
        { error: "Missing required fields: id, title, content, category, and targetAudience are required" },
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
        authorId: updatedPost.authorId,
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('id');

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Check if post exists
    const post = await prisma.awarenessPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Awareness post not found" },
        { status: 404 }
      );
    }

    // Delete the post
    await prisma.awarenessPost.delete({
      where: { id: postId }
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
