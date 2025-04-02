import { createClient } from 'contentful';

import { env } from "@/env";
const client = createClient({
    space: env.CF_SPACE_ID!,
    accessToken: env.CF_DELIVERY_ACCESS_TOKEN! 
  });

export default client;