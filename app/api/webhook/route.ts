import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log the webhook event
    console.log('Webhook received:', body);
    
    // Handle different webhook event types
    switch (body.event) {
      case 'frame_added':
        console.log('Mini app was added by user:', body.data);
        break;
      case 'frame_removed':
        console.log('Mini app was removed by user:', body.data);
        break;
      case 'notifications_enabled':
        console.log('Notifications enabled:', body.data);
        break;
      case 'notifications_disabled':
        console.log('Notifications disabled:', body.data);
        break;
      default:
        console.log('Unknown event type:', body.event);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

