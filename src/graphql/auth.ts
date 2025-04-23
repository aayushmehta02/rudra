import { gql } from '@apollo/client';


export const LOGIN_USER = gql`
  query Login($email: String!) {
    Users(where: { email: { _eq: $email } }) {
      id
      username
      email
      password
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    insert_Users(objects: {
      username: $username,
      email: $email,
      password: $password
    }) {
      returning {
        id
        username
        email
      }
    }
  }
`;
