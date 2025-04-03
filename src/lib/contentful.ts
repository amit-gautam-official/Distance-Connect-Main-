import { createClient } from 'contentful';

import { env } from "@/env";

// Make sure we have the required environment variables
if (!process.env.CF_SPACE_ID || !process.env.CF_DELIVERY_ACCESS_TOKEN) {
  console.error('Missing Contentful configuration! Please check your environment variables:');
  console.error('- CF_SPACE_ID: ' + (env.CF_SPACE_ID ? 'Present' : 'Missing'));
  console.error('- CF_DELIVERY_ACCESS_TOKEN: ' + (env.CF_DELIVERY_ACCESS_TOKEN ? 'Present' : 'Missing'));
}

const client = createClient({
  space: env.CF_SPACE_ID!,
  accessToken: env.CF_DELIVERY_ACCESS_TOKEN!,
});

export default client;