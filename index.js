const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`

    type Query {
        "測試用 Hello World"
        hello: String
        "取得目前使用者"
        me: User
        "取得所有使用者"
        users: [User]
        "依照名字取得特定使用者"
        user(name: String!): User
        "取得所有貼文"
        posts: [Post]
        "依照 id 取得特定貼文"
        post(id: ID!): Post
    }


    """
    使用者
    """
    type User {
        "識別碼"
        id: ID!
        "帳號 email"
        email: String!
        "名字"
        name: String
        "年齡"
        age: Int
        "朋友"
        friends: [User]
        "貼文"
        posts: [Post]
    }
    """
    貼文
    """
    type Post {
        "識別碼"
        id: ID!
        "作者"
        author: User
        "標題"
        title: String
        "內容"
        body: String
        "按讚者"
        likeGivers: [User]
        "建立時間 (ISO 格式)"
        createdAt: String
    }

    input UpdateMyInfoInput {
        name: String
        age: Int
    }

    input AddPostInput {
        title: String!
        body: String
    }

    type Mutation {
        updateMyInfo(input: UpdateMyInfoInput!): User
        addFriend(userId: ID!): User
        addPost(input: AddPostInput!): Post
        likePost(postId: ID!): Post
        "註冊。 email 與 passwrod 必填"
        signUp(name: String, email: String!, password: String!): User
        "登入"
        login (email: String!, password: String!): Token
    }

    type Token {
        token: String!
    }


`;

const meId = 1;
const users = [
  {
    id: 1,
    email: 'fong@test.com',
    password: '$2b$04$wcwaquqi5ea1Ho0aKwkZ0e51/RUkg6SGxaumo8fxzILDmcrv4OBIO', // 123456
    name: 'Fong',
    age: 23,
    friendIds: [2, 3]
  },
  {
    id: 2,
    email: 'kevin@test.com',
    passwrod: '$2b$04$uy73IdY9HVZrIENuLwZ3k./0azDvlChLyY1ht/73N4YfEZntgChbe', // 123456
    name: 'Kevin',
    age: 40,
    friendIds: [1]
  },
  {
    id: 3,
    email: 'mary@test.com',
    password: '$2b$04$UmERaT7uP4hRqmlheiRHbOwGEhskNw05GHYucU73JRf8LgWaqWpTy', // 123456
    name: 'Mary',
    age: 18,
    friendIds: [1]
  }
];

const posts = [
  {
    id: 1,
    authorId: 1,
    title: 'Hello World',
    body: 'This is my first post',
    likeGiverIds: [1, 2],
    createdAt: '2018-10-22T01:40:14.941Z'
  },
  {
    id: 2,
    authorId: 2,
    title: 'Nice Day',
    body: 'Hello My Friend!',
    likeGiverIds: [1],
    createdAt: '2018-10-24T01:40:14.941Z'
  }
];

// 引入外部套件
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 定義 bcrypt 加密所需 saltRounds 次數
const SALT_ROUNDS = 2;
// 定義 jwt 所需 secret (可隨便打)
const SECRET = 'just_a_random_secret';

// Provide resolver functions for your schema fields
const filterPostsByUserId = userId =>
  posts.filter(post => userId === post.authorId);

const filterUsersByUserIds = userIds =>
  users.filter(user => userIds.includes(user.id));
  
const findUserByUserId = userId => users.find(user => user.id === Number(userId));

const findUserByName = name => users.find(user => user.name === name);

const findPostByPostId = postId => posts.find(post => post.id === Number(postId));

const hash = text => bcrypt.hash(text, SALT_ROUNDS);

const addUser = ({ name, email, password }) => (
  users[users.length] = {
    id: users[users.length - 1].id + 1,
    name,
    email,
    password
  }
);

// Mutation type
const updateUserInfo = (userId, data) =>
  Object.assign(findUserByUserId(userId), data);

const addPost = ({ authorId, title, body }) =>
  (posts[posts.length] = {
    id: posts[posts.length - 1].id + 1,
    authorId,
    title,
    body,
    likeGiverIds: [],
    createdAt: new Date().toISOString()
  });

const updatePost = (postId, data) =>
  Object.assign(findPostByPostId(postId), data);

// Login - Resolver
const createToken = ({ id, email, name }) => jwt.sign({ id, email, name }, SECRET, {
    expiresIn: '1d'
});


const resolvers = {
  Query: {
    hello: () => "world",
    me: () => findUserByUserId(meId),
    users: () => users,
    user: (root, { name }, context) => findUserByName(name),
    posts: () => posts,
    post: (root, { id }, context) => findPostByPostId(id)
  },
  User: {
    posts: (parent, args, context) => filterPostsByUserId(parent.id),
    friends: (parent, args, context) => filterUsersByUserIds(parent.friendIds || [])
  },
  Post: {
    author: (parent, args, context) => findUserByUserId(parent.authorId),
    likeGivers: (parent, args, context) =>
      filterUsersByUserIds(parent.likeGiverIds)
  },
  Mutation: {
    updateMyInfo: (parent, { input }, context) => {
      // 過濾空值
      const data = ["name", "age"].reduce(
        (obj, key) => (input[key] ? { ...obj, [key]: input[key] } : obj),
        {}
      );

      return updateUserInfo(meId, data);
    },
    addFriend: (parent, { userId }, context) => {
      const me = findUserByUserId(meId);
      if (me.friendIds.include(userId))
        throw new Error(`User ${userId} Already Friend.`);

      const friend = findUserByUserId(userId);
      const newMe = updateUserInfo(meId, {
        friendIds: me.friendIds.concat(userId)
      });
      updateUserInfo(userId, { friendIds: friend.friendIds.concat(meId) });

      return newMe;
    },
    addPost: (parent, { input }, context) => {
      const { title, body } = input;
      return addPost({ authorId: meId, title, body });
    },
    likePost: (parent, { postId }, context) => {
      const post = findPostByPostId(postId);

      if (!post) throw new Error(`Post ${postId} Not Exists`);

      if (!post.likeGiverIds.includes(postId)) {
        return updatePost(postId, {
          likeGiverIds: post.likeGiverIds.concat(meId)
        });
      }

      return updatePost(postId, {
        likeGiverIds: post.likeGiverIds.filter(id => id === meId)
      });
    },
    signUp: async (root, { name, email, password }, context) => {
        // 1. 檢查不能有重複註冊 email
        const isUserEmailDuplicate = users.some(user => user.email === email);
        if (isUserEmailDuplicate) throw new Error('User Email Duplicate');
  
        // 2. 將 passwrod 加密再存進去。非常重要 !!
        const hashedPassword = await hash(password, SALT_ROUNDS);
        // 3. 建立新 user
        return addUser({ name, email, password: hashedPassword });
    },
    login: async (root, { email, password }, context) => {
        // 1. 透過 email 找到相對應的 user
        const user = users.find(user => user.email === email);
        if (!user) throw new Error('Email Account Not Exists');
  
        // 2. 將傳進來的 password 與資料庫存的 user.password 做比對
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) throw new Error('Wrong Password');
  
        // 3. 成功則回傳 token
        return { token: await createToken(user) };
    }


  }


  
};


const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);