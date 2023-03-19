import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ElementRef,
  ContentChild,
  TemplateRef,
  Output,
  EventEmitter,
  ViewChild,
  HostBinding,
  HostListener
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { NgxMultiselectService } from './services/multiselect.service';
import { forwardRef } from '@angular/core';
import { FilterOptionsComponent } from './filter-options/filter-options.component';

export const DEFAULT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgxMultiselectComponent),
  multi: true
};

@Component({
  selector: 'ngx-multiselect',
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.css'],
  providers: [DEFAULT_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxMultiselectComponent implements ControlValueAccessor {
  constructor(
    private elementRef: ElementRef,
    private multiselectService: NgxMultiselectService
  ) { }

  // private variables
  private _multiple!: boolean;
  private _theme: string = 'material';
  private _optionsCopy!: Record<string, unknown>[];
  private _isOpen: boolean = false;
  private operationPendingQueue: Record<string, unknown>[] = [];

  // public variables
  _selectedOptions: Record<string, unknown> | Record<string, unknown>[] | null = null;
  _defaultPropertyMap: Record<string, unknown> = {
    id: 'id',
    name: 'name',
    disabled: 'disabled'
  };
  _defaultPropertyMapLength = Object.keys(this._defaultPropertyMap).length;
  _options!: Record<string, unknown>[];

  @HostBinding('class.mat-multiselect') matMultiselect: boolean = true;
  @HostBinding('class.bs-multiselect') bsMultiselect: boolean = false;

  // Input bindings
  @Input() disabled: boolean = false;
  @Input() color: string = 'blue';
  @Input() groupedProperty!: string;
  @Input() showHelperElements: boolean = true;
  @Input() showSearchFilter: boolean = true;
  @Input() showMaxLabels: number = 3;
  @ContentChild(TemplateRef) _optionsTemplate!: TemplateRef<any>;
  @Input()
  get optionsTemplate() {
    return this._optionsTemplate;
  }
  set optionsTemplate(template) {
    this._optionsTemplate = template;
  }
  @Input()
  public get theme(): string {
    return this._theme;
  }
  public set theme(val: string) {
    this._theme = val;
    this.matMultiselect = val === 'material';
    this.bsMultiselect = val === 'bootstrap';
  }

  // Input binding with getter / setter
  @Input() set isOpen(value) {
    this._isOpen = value;
    // onOpen and onClose event will be fired by isOpen setter
    if (value) {
      // list populate, based on empty value
      this.filterOptionsList('');
      this.onTouched();
      this.onOpen.emit();
    } else {
      this.onClose.emit();
    }
  }
  get isOpen() {
    return this._isOpen;
  }
  @Input() set propertyMap(val: Record<string, unknown>) {
    this._defaultPropertyMap = { ...this._defaultPropertyMap, ...val };
  }
  @Input()
  get multiple() {
    return this._multiple;
  }
  set multiple(value: boolean) {
    this.viewToModel(value ? ([] as Record<string, unknown>[]) : null);
    this._multiple = value;
  }

  @Input()
  set options(collection: Record<string, unknown>[]) {
    if (!collection) return;
    this._optionsCopy = this.multiselectService.mapDatasourceToFields(
      collection,
      this._defaultPropertyMap,
      this.groupedProperty
    );
    const options = this.getOptionsCopy();
    this.setOptions(options);
    // Sometimes binding can happens lazily, 
    // so `finishPendingOperations` helps to execute such operations
    if (this.isOperationPending()) this.finishPendingOperations();
  }

  // Output bindings
  @Output() onOpen: EventEmitter<void> = new EventEmitter<void>();
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
  @Output() onItemClick: EventEmitter<Record<string, unknown>> = new EventEmitter<Record<string, unknown>>();
  @Output() onGroupItemClick: EventEmitter<Record<string, unknown>> = new EventEmitter<Record<string, unknown>>();
  @Output() onSelectAll: EventEmitter<void> = new EventEmitter<void>();
  @Output() onSelectNone: EventEmitter<void> = new EventEmitter<void>();
  @Output() onReset: EventEmitter<void> = new EventEmitter<void>();
  @Output() onClear: EventEmitter<void> = new EventEmitter<void>();
  @Output() onSearchChange: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('filterOptions', { read: FilterOptionsComponent }) filterOptions!: FilterOptionsComponent;

  // Adding pending operation in queue
  addOperation(item: Record<string, unknown> | Record<string, unknown>[]) {
    if (item instanceof Array) {
      this.operationPendingQueue.push(...item);
    } else {
      this.operationPendingQueue.push(item);
    }
  }

  // Poping pending operation from queue sequentially
  popOperation() {
    return this.operationPendingQueue.pop();
  }

  /* 
    In future this code is going to resides inside different Service,
    This pendingOperation feature is fine grained in future, 
    and can be used for multiple purpose like model update, collection update, etc.
  */
  // Extracting and finishing all pending operation
  finishPendingOperations() {
    const operation = this.popOperation();
    if (operation) {
      this.prepopulateOptions(operation);
    }
  }

  // Check pending operation queue status
  isOperationPending() {
    return this.operationPendingQueue.length;
  }

  private _initialValue!: Record<string, unknown> | Record<string, unknown>[];
  set initialValue(value: Record<string, unknown> | Record<string, unknown>[]) {
    this._initialValue = value;
  }
  get initialValue() {
    return this._initialValue;
  }

  onChange = (_: Record<string, unknown> | Record<string, unknown>[] | null) => { };
  onTouched = () => { };

  writeValue(value: Record<string, unknown> | Record<string, unknown>[]) {
    // Set selected value for initial load of value
    if (value) {
      this.initialValue = value;
      this._options ? this.prepopulateOptions(value) : this.addOperation(value);
      this.formatPrepopulatedValues(value);
    }
  }
  private formatPrepopulatedValues(value: Record<string, unknown> | Record<string, unknown>[]) {
    let options = value;
    // TODO: can we improve below logic?
    if (Object.keys(this._defaultPropertyMap).length == this._defaultPropertyMapLength) return;
    const swappedPropertyMap: Record<string, unknown> = this.multiselectService.mirrorObject(this._defaultPropertyMap);
    if (this.multiple) {
      // Mapping can be done at single place.
      (options as Record<string, unknown>[]).forEach((o: Record<string, unknown>) => {
        o['id'] = o[swappedPropertyMap['id'] as string];
        o['name'] = o[swappedPropertyMap['name'] as string];
      });
    } else {
      (value as Record<string, unknown>)['id'] = (value as Record<string, unknown>)[swappedPropertyMap['id'] as string];
      (value as Record<string, unknown>)['name'] = (value as Record<string, unknown>)[swappedPropertyMap['name'] as string];
      options = value;
    }
  }

  registerOnChange(fn: (value: Record<string, unknown> | Record<string, unknown>[] | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => Record<string, unknown>): void {
    this.onTouched = fn;
  }

  // All update to options should happen from below method.
  setOptions(options: Record<string, unknown>[]) {
    this._options = options;
  }

  getOptions() {
    return this._options ? [...this._options] : [];
  }

  getOptionsCopy() {
    return this._optionsCopy ? [...this._optionsCopy] : [];
  }

  filterOptionsList = (val: string) => {
    const optionsCopy = this.getOptionsCopy();
    let result = optionsCopy;
    if (val) {
      result = optionsCopy.filter(
        i => (i['name'] as string)?.toLowerCase().indexOf(val.toLowerCase()) !== -1
      );
    }
    this.setOptions(result);
    this.prepopulateOptions(this._selectedOptions ?? []);
  };

  isValueSelected() {
    return this._selectedOptions && this._multiple ?
      this._selectedOptions.length :
      this._selectedOptions;
  }

  searchChange(val: string) {
    this.filterOptionsList(val);
    this.onSearchChange.emit(val);
  }

  close() {
    this.isOpen = false;
  }

  removeItem(collection: Record<string, unknown>[], item: Record<string, unknown>) {
    item['ticked'] = false;
    const index = collection.findIndex((o: Record<string, unknown>) => o['id'] === item['id']);
    collection.splice(index, 1);
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  prepopulateOptions(selected: Record<string, unknown> | Record<string, unknown>[]) {
    let selectedIds: string[] = [];
    selectedIds = this._multiple && selected instanceof Array ?
      (selected || []).map((i: Record<string, unknown>) => i['id'] as string) :
      selected ? [selected as Record<string, unknown>['id'] as string] : [];
    this.setOptions(
      this.getOptions()
        .map(o => ({
          ...o,
          ticked: selectedIds.indexOf(o['id'] as string) !== -1
        }))
    );
    // TODO: do we really need this reassignment?
    this.viewToModel(selected);
  }

  select(option: Record<string, unknown>) {
    let selectedOptions;
    option['ticked'] = !option['ticked'];
    // TODO: Refactor below logic
    if (this._multiple) {
      selectedOptions = [...(
        this._selectedOptions instanceof Array ? this._selectedOptions : []
      )];
      let selectedIds = selectedOptions.map(i => i['id']);
      if (selectedIds.indexOf(option['id']) === -1) {
        // if selected item not exist in collection, push it
        selectedOptions.push(option);
      } else {
        // if selected item exist in collection, post it
        this.removeItem(selectedOptions, option);
      }
      selectedIds = selectedOptions.map(i => i['id']);
    } else {
      // TODO: find optimized way to do below
      let val = option && option['id'];
      let changedOptions = this.getOptions()
        .map(
          o => ({
            ...o,
            ticked: o['id'] == val
          })
        );
      selectedOptions = changedOptions.find(i => i.ticked);
      this.setOptions(changedOptions);
      this.close();
    }
    this.viewToModel(selectedOptions ?? null);
    this.onItemClick.emit(option);
  }

  selectAll() {
    let allSelectedOptions = this.getOptions()
      .map(
        o => ({
          ...o,
          ticked: true
        })
      );
    this.setOptions(allSelectedOptions);
    this.viewToModel(allSelectedOptions);
    this.onSelectAll.emit();
  }

  selectNone() {
    const options = this.getOptions().map(o => ({
      ...o,
      ticked: false
    }))
    this.setOptions(options);
    this.viewToModel([]);
    this.onSelectNone.emit();
  }

  borderBottom() {
    return this._isOpen ? { borderBottom: `1px solid ${this.matMultiselect ? this.color : 'transperant'}` } : {};
  }

  //TODO: Optimized below logic, it can be done in lesser steps
  selectGroup(group: Record<string, unknown>) {
    const { ticked, values } = group;
    const options = this.getOptions();
    let selectedValues = this._selectedOptions instanceof Array ? [...this._selectedOptions] : [];
    let selectedIds = selectedValues.map(s => s['id']);
    const allGroupOptionIds = (values as Record<string, unknown>[]).map((v: Record<string, unknown>) => v['id']);
    // Get all ticked options
    // concat with selected options
    selectedValues = ticked
      ? selectedValues.concat(values as Record<string, unknown>[])
      : selectedValues.filter(o => allGroupOptionIds.indexOf(o['id']) === -1);
    // Find unique out of them
    selectedIds = this.multiselectService.findUnique(selectedValues.map(item => 'id' in item ? item['id'] as unknown as string : ''));
    // build selectedOptions array again
    selectedValues = options.filter(o => selectedIds.indexOf(o['id']) !== -1);
    this.viewToModel(selectedValues);
    this.onGroupItemClick.emit(group);
  }

  reset() {
    this.viewToModel(this.initialValue);
    this.prepopulateOptions(this.initialValue);
    this.onReset.emit();
  }

  // Responsible for updating value from view to model
  viewToModel(selected: Record<string, unknown> | Record<string, unknown>[] | null) {
    if (this._selectedOptions !== selected) {
      this._selectedOptions = selected;
      this.onChange(selected);
    }
  }

  clear(event: Event) {
    let changedOptions = this.getOptions().map(o => ({ ...o, ticked: false }));
    this.setOptions(changedOptions);
    // no value is selected so passing null
    this.viewToModel(null);
    this.onClear.emit();
    this.close();
    event.stopPropagation();
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit() {
    // Check if value have not been assigned then default to true
    if (typeof this._multiple === 'undefined') {
      this.multiple = true;
    }
  }

  // TODO: Consider creating a directive for this.
  // TODO: Also convert below to be work for element specific
  @HostListener('document:click', ['$event.target'])
  clickOutSide(event: HTMLElement) {
    if (
      this.isOpen &&
      this.elementRef.nativeElement !== event &&
      !this.multiselectService.closest(event, 'ngx-multiselect')
    ) {
      this.close();
    }
  }
}
