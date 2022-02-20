import Component from '@glimmer/component';
import { useQuery /*, useSubscription */ } from 'glimmer-apollo';
import {
  GQLSubscription,
  SubscriptionToTimeChargeTotalChangedArgs,
  GQLQuery,
  QueryToTimeChargeTotalsArgs,
} from 'jikan-ga-aru-client/graphql/schemas';
import { ON_TIME_CHARGE_TOTAL_CHANGE } from 'jikan-ga-aru-client/graphql/subscriptions/subscriptions';
import { GET_TIME_CHARGE_TOTALS } from 'jikan-ga-aru-client/graphql/queries/queries';

interface TimeChargeTotalsArgs {
  week: number | undefined;
  year: number;
}

export default class TimeChargeTotals extends Component<TimeChargeTotalsArgs> {
  constructor(owner: unknown, args: TimeChargeTotalsArgs) {
    super(owner, args);

    this.subscribeToMore();
  }

  timeChargeTotals = useQuery<GQLQuery, QueryToTimeChargeTotalsArgs>(
    this,
    () => [
      GET_TIME_CHARGE_TOTALS,
      {
        variables: {
          weekOfYear: {
            year: this.args.year,
            week: this.args.week,
          },
        },
      },
    ]
  );

  subscribeToMore() {
    this.timeChargeTotals.subscribeToMore<
      GQLSubscription,
      SubscriptionToTimeChargeTotalChangedArgs
    >({
      document: ON_TIME_CHARGE_TOTAL_CHANGE,
      variables: {
        userId: '61cd4dfa37595c6ebaddd54d',
      },
    });
  }
}
