import Component from '@glimmer/component';

export interface CounterSignature {
  // We have a `<table>` as our root element
  Element: HTMLDivElement;
  // We accept an array of items, one per row
  Args: {
    value: number;
  };
}

export default class UiCounter extends Component<CounterSignature> {
  // TODO
  test = 1;

  <template>
    <div class="inline-block">
      <div class="bg-green-400 text-base text-gray-800 w-5 h-5 rounded-full flex justify-center items-center">
        {{@value}}
      </div>
    </div>
  </template>
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Ui::Counter': typeof UiCounter;
  }
}
