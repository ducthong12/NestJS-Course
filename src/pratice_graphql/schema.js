export const typesDefs = `#graphql
    type User {
        id: ID! //! means not null
        name: String!
        role: String!
    }

    type Post {
        id: ID!
        title: String!
        content: String!
        author: User!
    }

    type Category {
        id: ID!
        name: String!
        posts: [Post!]!
    }

    type Query {
        users: [User!]!
        user(id: ID!): User!
        posts: [Post!]!
        post(id: ID!): Post!
        categories: [Category!]!
        category(id: ID!): Category!
    }
`;