import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('Checking for scheduled posts to publish...');
    
    // Test database connection first
    try {
      await prisma.$connect();
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      return NextResponse.json(
        { 
          success: false,
          error: "Database connection failed",
          message: dbError instanceof Error ? dbError.message : 'Unknown database error'
        },
        { status: 500 }
      );
    }
    
    const now = new Date();
    console.log('Current time:', now.toISOString());
    
    // Find all scheduled posts that should be published now
    const scheduledPosts = await prisma.awarenessPost.findMany({
      where: {
        isPublished: false,
        scheduledDate: {
          not: null,
          lte: now, // Less than or equal to current time
        },
      },
    });

    console.log(`Found ${scheduledPosts.length} scheduled posts ready to publish`);

    if (scheduledPosts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No scheduled posts ready to publish',
        publishedCount: 0,
      });
    }

    // Publish each scheduled post
    const publishedPosts = [];
    for (const post of scheduledPosts) {
      try {
        const updatedPost = await prisma.awarenessPost.update({
          where: { id: post.id },
          data: {
            isPublished: true,
            publishedAt: now,
            scheduledDate: null, // Clear the scheduled date since it's now published
          },
        });

        publishedPosts.push({
          id: updatedPost.id,
          title: updatedPost.title,
          scheduledDate: post.scheduledDate,
          publishedAt: updatedPost.publishedAt,
        });

        console.log(`Published scheduled post: "${updatedPost.title}"`);
      } catch (error) {
        console.error(`Failed to publish post ${post.id}:`, error);
      }
    }

    console.log(`Successfully published ${publishedPosts.length} scheduled posts`);

    return NextResponse.json({
      success: true,
      message: `Successfully published ${publishedPosts.length} scheduled posts`,
      publishedCount: publishedPosts.length,
      publishedPosts,
    });

  } catch (error) {
    console.error('Error in publish-scheduled endpoint:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process scheduled posts',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check status without publishing
export async function GET(request: NextRequest) {
  try {
    const now = new Date();
    
    // Find all scheduled posts that should be published now
    const scheduledPosts = await prisma.awarenessPost.findMany({
      where: {
        isPublished: false,
        scheduledDate: {
          not: null,
          lte: now,
        },
      },
      select: {
        id: true,
        title: true,
        scheduledDate: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Found ${scheduledPosts.length} posts ready to publish`,
      readyToPublish: scheduledPosts.length,
      posts: scheduledPosts,
    });

  } catch (error) {
    console.error('Error checking scheduled posts:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to check scheduled posts',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
