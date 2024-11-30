import { ComponentLike, HelperLike } from '@glint/template';
import { GQLTrackedDay, GQLTrackedTask, GQLChargeCode } from 'jikan-ga-aru-client/graphql/schemas';

// Types for compiled templates
declare module 'jikan-ga-aru-client/templates/*' {
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const tmpl: TemplateFactory;
  export default tmpl;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    // Third party components
    WelcomePage: ComponentLike;
    EmberFlatpickr: ComponentLike<{
      Args: {
        Named: {
          date: Date | undefined;
          onChange: (selectedDate: [Date]) => Promise<void>;
          enableTime: boolean;
        };
      };
    }>;
    PowerSelectMultiple: ComponentLike<{
      Args: {
        Named: {
          searchEnabled: boolean;
          options: unknown[];
          selected: unknown[];
          placeholder: string;
          onChange: (selection: unknown[]) => void;
        };
        Blocks: {
          default: [item: unknown];
        };
      };
    }>;

    // UI Components
    'Ui::Counter': ComponentLike<{
      Args: {
        Named: {
          value: number;
        };
      };
    }>;

    // Application Components
    'DayList::DayDisplay': ComponentLike<{
      Args: {
        Named: {
          day: GQLTrackedDay;
        };
      };
    }>;

    'TrackedDay::Scale': ComponentLike<{
      Args: {
        Named: {
          day: GQLTrackedDay;
        };
      };
    }>;

    TrackedTask: ComponentLike<{
      Args: {
        Named: {
          trackedTask: GQLTrackedTask;
          ticks: Date[];
        };
      };
    }>;

    TrackedTaskList: ComponentLike<{
      Args: {
        Named: {
          trackedDayId: string;
        };
        Blocks: {
          default: [tasks: GQLTrackedTask[]];
        };
      };
    }>;

    TimeChargeTotals: ComponentLike<{
      Args: {
        Named: {
          week: number | undefined;
          year: number;
        };
      };
    }>;

    UserCreate: ComponentLike;
    UserList: ComponentLike;

    // Helpers
    'page-title': HelperLike<{
      Args: { Positional: [title: string] };
      Return: void;
    }>;

    'dayjs-format': HelperLike<{
      Args: { Positional: [date: Date | string, format: string] };
      Return: string;
    }>;

    'did-insert': HelperLike<{
      Args: { Positional: [(element: HTMLElement) => void] };
      Return: void;
    }>;

    'did-resize': HelperLike<{
      Args: { Positional: [(element: HTMLElement) => void] };
      Return: void;
    }>;

    'will-destroy': HelperLike<{
      Args: { Positional: [() => void] };
      Return: void;
    }>;
  }
}
