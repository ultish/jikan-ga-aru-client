import { gql } from 'glimmer-apollo';

export const GET_USERS = gql`
  query users {
    users {
      id
      username
    }
  }
`;

export const GET_DAY = gql`
  query trackedDays($id: ID) {
    trackedDays(id: $id) {
      id
      mode
      week
      year
      date
    }
  }
`;
export const GET_DAYS = gql`
  query trackedDaysPaginated($after: String, $first: Int) {
    trackedDaysPaginated(after: $after, first: $first) {
      edges {
        cursor
        node {
          id
          mode
          week
          year
          date
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_TIME_CHARGE_TOTALS = gql`
  query timeChargeTotals($weekOfYear: WeekOfYear) {
    timeChargeTotals(weekOfYear: $weekOfYear) {
      id
      value
      chargeCode {
        id
        code
      }
      trackedDay {
        id
        date
        week
      }
    }
  }
`;

export const GET_TRACKED_TASKS = gql`
  query trackedTasks($trackedDayId: ID) {
    trackedTasks(trackedDayId: $trackedDayId) {
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

export const GET_CHARGE_CODES = gql`
  query chargeCodes {
    chargeCodes {
      id
      name
      code
      description
      expired
    }
  }
`;
