import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
  TemplateRef,
  ViewChild,
  SimpleChanges,
  OnChanges
} from '@angular/core';

@Component({
  selector: 'ms-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionsComponent implements OnInit, OnChanges {
  _options: Record<string, unknown>[] = [];

  @Input() disabled: boolean = false;
  @Input() set options(value: Record<string, unknown>[]) {
    this._options = value;
  }
  get() {
    return this._options;
  }
  @Input() optionsTemplate!: TemplateRef<any>;
  @Output() selectOption = new EventEmitter<any>();

  start: number = 0;
  end: number = 5;
  filteredOptions!: Record<string, unknown>[];

  @ViewChild('defaultOptionsTemplate', { static: true }) defaultOptionsTemplate!: TemplateRef<any>;

  constructor() { }

  getOptionStyle(option: Record<string, unknown>) {
    return { marked: option['ticked'], disabled: this.disabled || option['disabled'] };
  }

  select(option: Record<string, unknown>) {
    this.selectOption.emit(option);
  }

  updateRange({ start, end }: Record<string, unknown>) {
    this.filteredOptions = [...this._options].slice(start as number, end as number);
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { options } = changes;
    if (!this.optionsTemplate) {
      this.optionsTemplate = this.defaultOptionsTemplate;
    }
    if (options.currentValue !== options.previousValue) {
      this.updateRange({ start: this.start, end: this.end });
    }
  }
}
