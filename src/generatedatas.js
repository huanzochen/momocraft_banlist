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
export { generateDatas };