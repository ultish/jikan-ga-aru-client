import { gql } from 'glimmer-apollo';

export const GET_USERS = gql`
  query users {
    users {
      id
      username
    }
  }
`;

export const GET_TIME_CHARGE_TOTALS = gql`
  query timeChargeTotals($week: Int) {
    timeChargeTotals(week: $week) {
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
