import { ApolloClient, InMemoryCache, gql } from '@apollo/client';


// Initialize Apollo Client
export const client = new ApolloClient({
    uri: 'https://ap-south-1.cdn.hygraph.com/content/cm4ns6qpc00e307uodr4wzizj/master',
    cache: new InMemoryCache(),
  });



  // GraphQL query
const GET_BLOGS = gql`
query Blog {
blogs {
  blogTitle
  blogContent {
    html
  }
  createdAt
  id
}
}
`;



  export const getBlogs = async () => {
    console.log("getBlogs")
    const { data } = await client.query({
        query: GET_BLOGS,
      });

    return data;
  }




