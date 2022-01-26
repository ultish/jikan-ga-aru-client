import { gql } from 'glimmer-apollo';

export const ON_TIME_CHARGE_TOTAL_CHANGE = gql`
  subscription OnTimeChargeTotalChanged($userId: String!) {
    timeChargeTotalChanged(userId: $userId) {
      id
      value
    }
  }
`;
