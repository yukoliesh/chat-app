
const { GraphQLServer, PubSub } = require('graphql-yoga');
const { GraphQLDateTime } = require('graphql-iso-date');

const messages = [];

const typeDefs = `
  scalar DateTime 

  type Message {
    id: ID!
    user: String!
    content: String!
    timeStamp: DateTime
  }

  type Query {
    messages: [Message!]
  }
  type Mutation {
    postMessage(user: String!, content: String!): ID!
  }
  type Subscription {
    messages: [Message!]
  }
`;

const subscribers = [];
const onMessagesUpdates = (fn) => subscribers.push(fn); 

const resolvers = {
  DateTime: GraphQLDateTime,
  Query: {
    messages: () => messages,
  },
  Mutation: {
    postMessage: (parent, {user, content}) => {
      const id = messages.length;
      
      const timeStamp = new Date();
      
      messages.push({
        id,
        user,
        content,
        timeStamp
      });
      subscribers.forEach(fn => fn());
      return id;
    },
  },
  Subscription: {
    messages: {
      subscribe: (parent, args, { pubsub }) => {
        const channel = Math.random().toString(36).slice(2, 15);
        onMessagesUpdates(() => pubsub.publish(channel, { messages }));
        setTimeout(() => pubsub.publish(channel, { messages }), 0);
        return pubsub.asyncIterator(channel);
      }
    }
  }
}

const pubsub = new PubSub();
const server = new GraphQLServer({ typeDefs, resolvers, context: {pubsub} });
server.start(({ port }) => {
  console.log(`Server on http://localhost:${port}/`);
});