const express = require('express');
const { ApolloServer } = require('apollo-server-express');
import { typeDefs } from './typeDefs.js';


const datas = generateDatas();
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
  },
  DateTime,
  EmailAddress
};

// Required: Export the GraphQL.js schema object as "schema"
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

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

function generateDatas () {
  return {
    users: [
      {
        id: 1,
        name: 'Fong',
        email: 'fong@test.com',
        password: '123456',
        age: 25,
        friendIds: [2,3],
        height: 175.0,
        weight: 70.0,
        birthDay: '1997-07-12'
      },
      {
        id: 2,
        name: 'Kevin',
        email: 'kevin@test.com',
        password: 'kevin123456',
        age: 40,
        height: 185.0,
        weight: 90.0,
        friendIds: [1],
      },
      {
        id: 3,
        name: 'Mary',
        email: 'Mary@test.com',
        password: 'mary123456',
        age: 18,
        height: 162,
        weight: null,
        friendIds: [1],
      },
  	],
    posts: [
      {
        id: 1,
        authorId: 1,
        title: 'Hello World!!',
        content: 'This is my first post. Nice to see you guys.',
        createdAt: '2018-10-15',
        likeGiverIds: [1,3]
      },
      {
        id: 2,
        authorId: 2,
        title: 'Good Night',
        content: 'Started earnest brother believe an exposed so. Me he believing daughters if forfeited at furniture. Age again and stuff downs spoke. Late hour new nay able fat each sell. Nor themselves age introduced frequently use unsatiable devonshire get. They why quit gay cold rose deal park. One same they four did ask busy. Reserved opinions fat him nay position. Breakfast as zealously incommode do agreeable furniture. One too nay led fanny allow plate. ',
        createdAt: '2018-10-11',
        likeGiverIds: [2,3]
      },
      {
        id: 3,
        authorId: 3,
        title: 'Love U',
        content: '好濕。燕 草 如 碧 絲，秦 桑 低 綠 枝。當 君 懷 歸 日，是 妾 斷 腸 時 。春 風 不 相 識，	何 事 入 羅 幃 ？',
        createdAt: '2018-10-10',
        likeGiverIds: [1,2]
      },
      {
        id: 4,
        authorId: 1,
        title: 'Love U Too',
        content: 'This is my first post. Nice to see you guys.',
        createdAt: '2018-10-10',
        likeGiverIds: [1,2,3]
      },
    ],
  };
}

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);

