import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';







export const blogRouter = createTRPCRouter({

    getBlogs : publicProcedure.query(async () => {
      // Initialize Apollo Client
        const client = new ApolloClient({
          uri: 'https://ap-south-1.cdn.hygraph.com/content/cm4ns6qpc00e307uodr4wzizj/master',
          cache: new InMemoryCache(),
        });
        // GraphQL query
        const GET_BLOGS = gql`
        query Blog {
        blogs {
          id
          blogTitle
          createdAt
          blogDescription
          thumbnailImage{
            fileName
            url
          }
        }
      }
        `;
        // console.log("getBlogs")
        try {
          const { data } = await client.query({
            query: GET_BLOGS,
          });
          return data;
        } catch (error) {
          console.log(error)
        }


    }),






    getBlogById : publicProcedure.input(z.object({
      blogId : z.string()
    })).mutation(async ({input}) => {

      const {blogId} = input
      // Initialize Apollo Client
        const client = new ApolloClient({
          uri: 'https://ap-south-1.cdn.hygraph.com/content/cm4ns6qpc00e307uodr4wzizj/master',
          cache: new InMemoryCache(),
        });
        // GraphQL query
        const GET_BLOG_BY_ID = gql`
      query getBlogById {
      blog(where: { id: "${blogId}" }) {
      blogTitle
      blogContent {
        html
      }
      blogDescription
      createdAt
    
  }
}
        `;
        // console.log("getBlogs")
        try {
          const { data } = await client.query({
            query: GET_BLOG_BY_ID,
          });
          
          return data;
        } catch (error) {
          console.log(error)
        }


    })




    



  })