import { gql } from '@apollo/client';


export const LOGIN_USER = gql`
  query Login($email: String!, $password: String!) {
    Users(where: { email: { _eq: $email }, password: { _eq: $password } }) {
      id
      username
      email
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
