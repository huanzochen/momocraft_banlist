"use strict";

var _typeDefs = require("./typeDefs.js");

var express = require('express');

var _require = require('apollo-server-express'),
    ApolloServer = _require.ApolloServer;

// Provide resolver functions for your schema fields
var resolvers = {
  Query: {
    hello: function hello() {
      return 'Hello world!';
    }
  }
};
var server = new ApolloServer({
  typeDefs: _typeDefs.typeDefs,
  resolvers: resolvers
});
var app = express();
server.applyMiddleware({
  app: app
});
app.listen({
  port: 4000
}, function () {
  return console.log("\uD83D\uDE80 Server ready at http://localhost:4000".concat(server.graphqlPath));
});