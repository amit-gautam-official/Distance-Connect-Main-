import { GraphQLClient } from 'graphql-request';

// Simplified implementation without external dependencies
// Define a minimal interface for the SDK
interface SDK {
  // Add methods as needed
  getContent?: () => Promise<any>;
}

// Create a minimal SDK implementation
const getSdk = (client: GraphQLClient): SDK => {
  return {
    // You can add implementations here if needed
    getContent: async () => {
      // Placeholder for actual implementation
      return {};
    }
  };
};

// Use a default endpoint or from environment
const endpoint = process.env.CONTENTFUL_ENDPOINT || 
  'https://graphql.contentful.com/content/v1/spaces/YOUR_SPACE_ID';

const graphQlClient = new GraphQLClient(endpoint, {
  headers: {
    Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
  },
});

const previewGraphQlClient = new GraphQLClient(endpoint, {
  headers: {
    Authorization: `Bearer ${process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN}`,
  },
});

export const client = getSdk(graphQlClient);
export const previewClient = getSdk(previewGraphQlClient);
