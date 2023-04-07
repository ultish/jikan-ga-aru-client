import { ComponentLike, HelperLike } from '@glint/template';

// Types for compiled templates
declare module 'jikan-ga-aru-client/templates/*' {
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const tmpl: TemplateFactory;
  export default tmpl;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    WelcomePage: ComponentLike;
    EmberFlatpickr: ComponentLike<{
      Args: {
        Named: [
          date: Date | undefined,
          onChange: (selectedDate: [Date]) => Promise<void>,
          enableTime: boolean
        ];
      };
    }>;
    'page-title': HelperLike<{
      Args: { Positional: [title: string] };
      Return: void;
    }>;
  }
}
