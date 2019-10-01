const { gql } = require('apollo-server-express');

// Construct a schema, using GraphQL schema language

export const typeDefs = gql`
	scalar DateTime
	scalar EmailAddress

	"""
	高度單位
	"""
  enum HeightUnit {
    "公尺"
    METRE
    "公分"
    CENTIMETRE
		"英尺 (1 英尺 = 30.48 公分)"
		FOOT
  }

	"""
	重量單位
	"""
  enum WeightUnit {
    "公斤"
    KILOGRAM
    "公克"
    GRAM
		"磅 (1 磅 = 0.45359237 公斤)"
		POUND
  }
  
  """
	使用者
	"""
  type User {
		"識別碼"
		id: ID!
		"帳號"
		email: EmailAddress!
		"名字"
		name: String
		"年齡"
		age: Int
    "身高"
    height(unit: HeightUnit = CENTIMETRE): Float
    "體重"
    weight(unit: WeightUnit = KILOGRAM): Float
		"朋友"
		friends: [User]
    "貼文"
		posts: [Post]
		"生日 ( ISO 格式)"
		birthDay: DateTime
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
		content: String
		"建立時間"
		createdAt: DateTime
		"按讚者"
		likeGivers: [User]
	}

  type Query {
		"測試用 Hello World"
    hello: String
		"目前使用者"
		me: User
		"所有使用者"
		users: [User]
		"特定使用者"
		user(name: String!): User
  }
`;