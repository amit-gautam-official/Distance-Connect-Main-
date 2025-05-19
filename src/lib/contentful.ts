import { createClient } from 'contentful';

import { env } from "@/env";


const client = createClient({
  space: env.CF_SPACE_ID || 'yfsekmbfnbal',
  accessToken: env.CF_DELIVERY_ACCESS_TOKEN || '1znAoSs4AwnsV8FZOlcPB2PO75NLSraGnwu1-eN21jU',
});

export default client;