import React from 'react';
import {
  useMutation,
  gql
} from "@apollo/client";
import styled  from 'styled-components';
import { Messages } from './component/Messages';

const POST_MESSAGE = gql`
  mutation($user: String!, $content: String!){
    postMessage(user: $user, content: $content)
  }
`;

const ChatContainer = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const ChatInputBoxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 3em;
`;

const ChatInputBox = styled.div`
  margin-right: 0.5em;
  width: ${props => props.inputWidth};
  &:last-child{
    margin-right: 0;
    text-align: right;
  }
`;

const Label = styled.label`
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  `;
  const TextBox = styled.input`
    border: solid 1px #ccc;
    padding: 0.8em 0.5em;
    border-radius: 0.3em;
    background-color: #E3E2E2;
    width: ${props => props.textBoxWidth};
  `;

const SubmitButton = styled.button`
  background-color: #095683;
  color: #fff;
  font-size: 1em;
  font-weight: bold;
  padding: 0.6em 1em;
  border-radius: 0.4em;
  border: none;
  cursor: pointer;
`;

export const Chat = () => {
  const [state, setState] = React.useState({
    user: 'Yuko',
    content: ''
  });
  const [postMessage] = useMutation(POST_MESSAGE);
  const onSend = () => {
    if(state.content.length > 0){
      postMessage({
        variables: state,
      })
     }
     setState({
       ...state,
       content: '',
     })
  }
  return (
    <ChatContainer>
      <Messages user={state.user} />
      <ChatInputBoxContainer>
        <ChatInputBox inputWidth="20%">
          <Label htmlFor="userName">
            User Name
          </Label>
          <TextBox id="userName" value={state.user} onChange={(evt) => setState({
            ...state,
            user: evt.target.value,
          }) } />
        </ChatInputBox>
        <ChatInputBox inputWidth="50%">
        <Label htmlFor="chatInputBox">
          Chat Text Box
        </Label>
        <TextBox 
          id="chatInputBox" 
          textBoxWidth="100%"
          value={state.content} 
          onChange={(evt) => setState({
          ...state,
          content: evt.target.value,
          })}
          onKeyUp={(evt) =>{
            if(evt.key === 'Enter'){
              onSend();
            }
          }}
          placeholder="Enter your message"
        />
        </ChatInputBox>
        <ChatInputBox inputWidth="20%">
          <SubmitButton onClick={() => onSend()} style={{ width: '100%' }}>
            Send
          </SubmitButton>
        </ChatInputBox>
      </ChatInputBoxContainer>
    </ChatContainer>
  )
}