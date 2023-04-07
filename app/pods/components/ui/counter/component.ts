import Component from '@glimmer/component';

export interface CounterSignature {
  // We have a `<table>` as our root element
  Element: HTMLDivElement;
  // We accept an array of items, one per row
  Args: {
    value: number;
  };
}

// type UiCounterArgs = CounterSignature['Args'];

// This line declares that our component's args will be 'splatted' on to the instance:
// export default interface UiCounter extends UiCounterArgs {}
export default class UiCounter extends Component<CounterSignature> {
  // TODO
  test = 1;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Ui::Counter': typeof UiCounter;
  }
}
