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

export const REQUEST_PASSWORD_RESET = gql`
  query RequestReset($email: String!, $username: String!) {
    Users(where: { email: { _eq: $email }, username: { _eq: $username } }) {
      id
      email
      username
    }
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($userId: uuid!, $newPassword: String!) {
    update_Users_by_pk(
      pk_columns: { id: $userId }
      _set: { password: $newPassword }
    ) {
      id
      email
    }
  }
`;
