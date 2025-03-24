import { createClient } from 'contentful';
const client = createClient({
    space: process.env.CF_SPACE_ID!, // ID of a Compose-compatible space to be used \
    accessToken: process.env.CF_DELIVERY_ACCESS_TOKEN!, // delivery API key for the space \
  });

export default client;