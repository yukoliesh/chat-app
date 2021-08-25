import React from 'react';
import {
  useSubscription,
  gql
} from "@apollo/client";
import PropTypes from 'prop-types';
import styled  from 'styled-components';

const GET_MESSAGES = gql`
  subscription{
    messages{
      id
      user
      content
      timeStamp
    }
  }
`;

const MessageContainer = styled.div`
  display: flex;
  justify-content: ${props => props.messageUser ? 'flex-end' : 'flex-start'};
  padding-bottom: 1em;
  align-items: center;
`;

const SenderInitial = styled.div`
  display: flex;
  justify-content:center;
  align-items: center;
  width: 50px;
  height: 50px;
  margin-right: 0.5em;
  background: #095583;
  color: #fff;
  border-radius: 50%;
  text-align: center;
  font-size: 1.2em;
`;

const MessageBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${props => props.messageUser ? 'flex-end' : 'flex-start'};
  text-align: ${props => props.messageUser ? 'right' : 'left'};
`;

const TimeStamp = styled.div`
  font-size: 0.8em;
  color: #575757;
`;

const MessageContent = styled.div`
  background: ${props => props.messageUser ? '#095583' : '#e5e6ea'};
  color: ${props => props.messageUser ? 'white' : 'black'};
  padding: 1em 1.2em;
  border-radius: 0.4em;
`;

export const Messages = ({ user }) => {
  const { data } = useSubscription(GET_MESSAGES, {
    pollInterval: 500,
  });

  if(!data){
    return null;
  }
  return (
    <>
    {data && data.messages.map(({ id, user:messageUser, content, timeStamp}) => (
      <MessageContainer messageUser={user === messageUser} key={id}>
        {user !== messageUser && (
          <SenderInitial>
            {messageUser.slice(0,1).toUpperCase()}
          </SenderInitial>
        )}
          <MessageBox messageUser={user === messageUser}>
            <TimeStamp>
              {new Date(timeStamp).toLocaleString()}
            </TimeStamp>
            <MessageContent messageUser={user === messageUser}>
              {content}
            </MessageContent>
          </MessageBox>
      </MessageContainer>
      ))}
    </>
  );
};

Messages.propTypes = {
  user: PropTypes.string
}