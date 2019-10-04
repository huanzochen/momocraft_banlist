const express = require('express');
const { ApolloServer } = require('apollo-server-express');
import { typeDefs } from './typedefs.js';
import { generateDatas } from './generatedatas.js';
import { getBanList } from './models/litebans.js'



let datas = generateDatas();

let datas2 = getBanList()
.then(([rows]) => {
  datas2 = rows;
})
.catch(err => console.dir(err));
console.dir( datas2 );



//console.log(datas);
console.log(datas2);



const findUserById = id => datas.users.find(user => user.id === id);
const findUserByName = name => datas.users.find(user => user.name === name);
const filterPostsByAuthorId = authorId => datas.posts.filter(post => post.authorId === authorId);

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: (root, args, context) => {
      return 'Hello world!';
    },
    me: (root, args, { userId }) => {
      return findUserById(userId);
    },
    users: () => datas.users,
    user: (root, { name }, context) => {
      return findUserByName(name);
    }
  },
  User: {
    friends: (parent, args, context) => {
      return parent.friendIds.map(id => findUserById(id));
    },
    posts: (parent, args, context) => {
      return filterPostsByAuthorId(parent.id);
    },
    height: (parent, args) => {
      const { unit } = args;
      if (!unit || unit === 'CENTIMETRE') return parent.height;
      else if (unit === 'METRE') return parent.height / 100;
      else if (unit === 'FOOT') return parent.height / 30.48;
    	throw new Error(`Height unit "${unit}" not supported.`)
    },
    weight: (parent, args, context, info) => {
      const { unit } = args;
      if (!unit || unit === 'KILOGRAM') return parent.weight;
      else if (unit === 'GRAM') return parent.weight * 100;
      else if (unit === 'POUND') return parent.weight / 0.45359237;
      throw new Error(`Weight unit "${unit}" not supported.`)
    }
  },
  Post: {
    likeGivers: (parent, args, context) => {
      return parent.likeGiverIds.map(id => findUserById(id));
    },
    author: (parent, args, context) => {
      return findUserById(parent.authorId);
    }
  }
};

// Optional: Export a function to get context from the request. It accepts two
// parameters - headers (lowercased http headers) and secrets (secrets defined
// in secrets section). It must return an object (or a promise resolving to it).
export function context(headers, secrets) {

  return {
    userId: meId,
    headers,
    secrets,
  };
};

// Optional: Export a root value to be passed during execution
// export const rootValue = {};

// Optional: Export a root function, that returns root to be passed
// during execution, accepting headers and secrets. It can return a
// promise. rootFunction takes precedence over rootValue.
// export function rootFunction(headers, secrets) {
//   return {
//     headers,
//     secrets,
//   };
// };

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}ql`)
);

