import { createClient } from 'contentful';
const client = createClient({
    space: process.env.CF_SPACE_ID! || 'yfsekmbfnbal', // ID of a Compose-compatible space to be used \
    accessToken: process.env.CF_DELIVERY_ACCESS_TOKEN! || '1znAoSs4AwnsV8FZOlcPB2PO75NLSraGnwu1-eN21jU', // delivery API key for the space \
  });

export default client;