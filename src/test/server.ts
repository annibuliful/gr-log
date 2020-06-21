import { ApolloServer, gql } from "apollo-server";
import PerformancePlugin from "../index";
const typeDefs = gql`
  type Query {
    testQuery: String
  }
`;

const randomResolver = function () {
  return new Promise((resolve, reject) => {
    const min = 1000;
    const max = 5000;
    const randomTime = Math.floor(Math.random() * max);
    setTimeout(function () {
      const randomError = Math.random();
      if (randomError > 0.5) {
        reject("Error");
      }
      resolve("Done");
    }, randomTime);
  });
};
const resolvers = {
  Query: {
    testQuery: async () => {
      const result = await randomResolver();
      return result;
    },
  },
};
export const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    PerformancePlugin({
      enginUrl: "https://jsonplaceholder.typicode.com/posts",
      key: "test",
    }),
  ],
});

server.listen(4000).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
