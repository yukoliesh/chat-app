import React from "react";
import ReactDOM from "react-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { WebSocketLink } from '@apollo/client/link/ws';
import { Chat } from './Chat';
import styled  from 'styled-components';

import "./index.css";

const link = new WebSocketLink({
  uri: `ws://localhost:4000/`,
  options: {
    reconnect: true
  }
});

const client = new ApolloClient({
  link,
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache()
});

const App = () => {
  const Wrapper = styled.div`
    margin: 0 auto;
    width: 60%;
  `;
  return (
    <ApolloProvider client={client}>
      <Wrapper>
        <header>
          My Chat app
        </header>
        <main>
          <Chat />
        </main>
      </Wrapper>
    </ApolloProvider>
  )
};


ReactDOM.render(<App />, document.getElementById("app"));
