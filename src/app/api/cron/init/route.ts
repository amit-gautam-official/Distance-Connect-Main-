import { initializeSchedulers } from "@/server/scheduler";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

// Initialize schedulers on first request (or when explicitly called)
let initialized = false;
let initializationTime: string | null = null;
let initializationError: string | null = null;

// Lock mechanism to prevent race conditions
let initializationInProgress = false;

// Secret token for secure initialization (should be set in env vars)
const INIT_TOKEN = process.env.SCHEDULER_INIT_TOKEN || 'development-token';

export async function GET(request: Request) {
  // Check authorization for production environments
  if (process.env.NODE_ENV === 'production') {
    const headersList = await headers();
    const authToken = headersList.get('x-init-token');
    
    if (authToken !== INIT_TOKEN) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
  }
  
  // Get URL to check for force parameter
  const { searchParams } = new URL(request.url);
  const forceInit = searchParams.get('force') === 'true';
  
  // Reset initialization if forced
  if (forceInit && initialized) {
    console.log('Forced re-initialization of schedulers requested');
    initialized = false;
    initializationInProgress = false;
  }
  
  // Prevent multiple simultaneous initialization attempts
  if (initializationInProgress) {
    return NextResponse.json({
      success: false,
      status: 'in_progress',
      message: 'Scheduler initialization already in progress',
      timestamp: new Date().toISOString()
    });
  }
  
  if (!initialized) {
    try {
      initializationInProgress = true;
      
      // Initialize all schedulers
      await initializeSchedulers();
      
      initialized = true;
      initializationTime = new Date().toISOString();
      initializationError = null;
      
      console.log(`Schedulers initialized successfully at ${initializationTime}`);
      
      return NextResponse.json({
        success: true,
        status: 'initialized',
        message: 'Application schedulers initialized successfully',
        timestamp: initializationTime
      });
    } catch (error) {
      // Record error but don't block future initialization attempts
      initializationError = error instanceof Error ? error.message : String(error);
      console.error('Failed to initialize schedulers:', error);
      
      return NextResponse.json({
        success: false,
        status: 'failed',
        message: 'Failed to initialize schedulers',
        error: initializationError,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    } finally {
      initializationInProgress = false;
    }
  }
  
  // Return status of already initialized schedulers
  return NextResponse.json({
    success: true,
    status: 'already_initialized',
    message: 'Schedulers already initialized',
    initializedAt: initializationTime,
    error: initializationError,
    timestamp: new Date().toISOString()
  });
}
