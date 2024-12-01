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
  mutation CreateTrackedDay($date: Float!, $mode: String) {
    createTrackedDay(date: $date, mode: $mode) {
      id
      date
      mode
      week
      year
    }
  }
`;

export const UPDATE_TRACKED_TASK = gql`
  mutation UpdateTrackedTask(
    $id: ID!
    $notes: String
    $chargeCodeIds: [ID!]
    $timeSlots: [Int!]
  ) {
    updateTrackedTask(
      id: $id
      notes: $notes
      chargeCodeIds: $chargeCodeIds
      timeSlots: $timeSlots
    ) {
      id
      notes
      timeSlots
      chargeCodes {
        id
        name
      }
    }
  }
`;
