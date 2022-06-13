import { gql } from 'glimmer-apollo';

export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $password: String!) {
    createUser(username: $username, password: $password) {
      id
      username
    }
  }
`;

export const CREATE_DAY = gql`
  mutation CreateTrackedDay($date: Float!, $mode: DayMode) {
    createTrackedDay(date: $date, mode: $mode) {
      id
      date
      mode
      week
      year
    }
  }
`;
