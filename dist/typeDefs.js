"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeDefs = void 0;

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n\tscalar DateTime\n\tscalar EmailAddress\n\n\t\"\"\"\n\t\u9AD8\u5EA6\u55AE\u4F4D\n\t\"\"\"\n  enum HeightUnit {\n    \"\u516C\u5C3A\"\n    METRE\n    \"\u516C\u5206\"\n    CENTIMETRE\n\t\t\"\u82F1\u5C3A (1 \u82F1\u5C3A = 30.48 \u516C\u5206)\"\n\t\tFOOT\n  }\n\n\t\"\"\"\n\t\u91CD\u91CF\u55AE\u4F4D\n\t\"\"\"\n  enum WeightUnit {\n    \"\u516C\u65A4\"\n    KILOGRAM\n    \"\u516C\u514B\"\n    GRAM\n\t\t\"\u78C5 (1 \u78C5 = 0.45359237 \u516C\u65A4)\"\n\t\tPOUND\n  }\n  \n  \"\"\"\n\t\u4F7F\u7528\u8005\n\t\"\"\"\n  type User {\n\t\t\"\u8B58\u5225\u78BC\"\n\t\tid: ID!\n\t\t\"\u5E33\u865F\"\n\t\temail: EmailAddress!\n\t\t\"\u540D\u5B57\"\n\t\tname: String\n\t\t\"\u5E74\u9F61\"\n\t\tage: Int\n    \"\u8EAB\u9AD8\"\n    height(unit: HeightUnit = CENTIMETRE): Float\n    \"\u9AD4\u91CD\"\n    weight(unit: WeightUnit = KILOGRAM): Float\n\t\t\"\u670B\u53CB\"\n\t\tfriends: [User]\n    \"\u8CBC\u6587\"\n\t\tposts: [Post]\n\t\t\"\u751F\u65E5 ( ISO \u683C\u5F0F)\"\n\t\tbirthDay: DateTime\n  }\n\t\n  \"\"\"\n  \u8CBC\u6587\n  \"\"\"\n\ttype Post {\n\t\t\"\u8B58\u5225\u78BC\"\n\t\tid: ID!\n\t\t\"\u4F5C\u8005\"\n\t\tauthor: User\n\t\t\"\u6A19\u984C\"\n\t\ttitle: String\n\t\t\"\u5167\u5BB9\"\n\t\tcontent: String\n\t\t\"\u5EFA\u7ACB\u6642\u9593\"\n\t\tcreatedAt: DateTime\n\t\t\"\u6309\u8B9A\u8005\"\n\t\tlikeGivers: [User]\n\t}\n\n  type Query {\n\t\t\"\u6E2C\u8A66\u7528 Hello World\"\n    hello: String\n\t\t\"\u76EE\u524D\u4F7F\u7528\u8005\"\n\t\tme: User\n\t\t\"\u6240\u6709\u4F7F\u7528\u8005\"\n\t\tusers: [User]\n\t\t\"\u7279\u5B9A\u4F7F\u7528\u8005\"\n\t\tuser(name: String!): User\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _require = require('apollo-server-express'),
    gql = _require.gql; // Construct a schema, using GraphQL schema language


var typeDefs = gql(_templateObject());
exports.typeDefs = typeDefs;