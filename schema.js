const { gql } = require('apollo-server-koa');

const typeDefs = gql`
type Query {
  employees: [Employee]
}
type Employee {
  employee_name: String,
  employee_age: Int,
  employee_salary: Int
}
type Message {
  mess: String
}
input UserInput {
  username: String,
  password: String,
  email: String
}
type Crawl {
  mess: String,
  crawledEmployees: [Employee]
}
type Mutation {
  login(user: UserInput): Message
  signup(user: UserInput): Message
  crawl: Crawl
}
`;

module.exports = typeDefs;