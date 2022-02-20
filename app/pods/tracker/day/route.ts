import Route from '@ember/routing/route';
import {
  GQLQuery,
  QueryToTrackedDaysArgs,
} from 'jikan-ga-aru-client/graphql/schemas';
import { GET_DAY } from 'jikan-ga-aru-client/graphql/queries/queries';
import { useQuery } from 'glimmer-apollo';

export default class TrackerDay extends Route {
  id: string | undefined = undefined;

  dayQuery = useQuery<GQLQuery, QueryToTrackedDaysArgs>(this, () => [
    GET_DAY,
    {
      variables: {
        id: this.id,
      },
    },
  ]);

  async model({ id }: { id: string }) {
    console.log(id);
    this.id = id;

    // prevent ember from being smart and trying to load a
    // model via dynamic route info

    //fetch the tracked day

    // fetch the timeChargeTotals using the week and year of trackedday

    await this.dayQuery.promise;

    return this.dayQuery;
  }
}
