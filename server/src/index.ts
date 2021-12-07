import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";

(async ()=>{
  const app = express();
  app.get("/", (_req, res) => {
      res.send('hello')
  })

  const apolloServer = new ApolloServer({
      typeDefs: `
        type Query {
            hello: String!
        }`,
      resolvers: {
          Query:{
              hello : () => 'hello'
          }
      }
  })

  await apolloServer.start()

  apolloServer.applyMiddleware({ app })

  app.listen(4000, () =>{
    console.log('express server started at localhost:4000')
  })
})()
