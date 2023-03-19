import { Injectable } from '@angular/core';

const matchSelectors = [
  'matches',
  'webkitMatchesSelector',
  'mozMatchesSelector',
  'msMatchesSelector',
  'oMatchesSelector'
];

@Injectable({
  providedIn: 'root'
})
export class NgxMultiselectService {
  constructor() { }

  pseudoClassExist(node: HTMLElement, selector: string) {
    const nativeMatches = node.matches || (node as any).msMatchesSelector;
    try {
      return nativeMatches.call(node, selector);
    } catch (error) {
      return false;
    }
  }

  closest(el: HTMLElement | null, selector: string): boolean {
    let matchesFn;
    // find vendor prefix
    matchSelectors.some(function (fn) {
      if (typeof (document as any).body[fn] === 'function') {
        matchesFn = fn;
        return true;
      }
      return false;
    });

    let parent: HTMLElement | null;

    // traverse parents
    while (el) {
      parent = el.parentElement;
      if (parent && matchesFn && (parent[matchesFn] as any)(selector)) {
        return !!parent;
      }
      el = parent;
    }

    return false;
  }

  // TODO: make this logic to work to find all descendant groups
  collectAllDescendants(collection: Record<string, unknown>[], groupProperty: string, groupName: string) {
    const allDescendants = collection.filter(
      (item: Record<string, unknown>) => item[groupProperty] as string === groupName
    );
    allDescendants.concat(
      collection.filter((item: Record<string, unknown>) => (item as Record<string, unknown>)['parent'] == groupName)
    );
    return allDescendants;
  }

  private allDescendantsAreTicked(collection: Record<string, unknown>[], groupProperty: string, groupName: string) {
    const allDescendants = this.collectAllDescendants(collection, groupProperty, groupName);
    const allAreTicked = allDescendants.every(d => d['ticked']);
    return allAreTicked;
  }
  private allDescendantsAreDisabled(collection: Record<string, unknown>[], groupProperty: string, groupName: string) {
    const allDescendants = this.collectAllDescendants(collection, groupProperty, groupName);
    const allAreDisabled = allDescendants.every(d => d['disabled']);
    return allAreDisabled;
  }

  optionsGrouping(options: Record<string, unknown>[], groupByProperty: string): Record<string, unknown>[] {
    const getAllUniqueGroupByPropertyValue = this.findUnique(
      options.map((item: Record<string, unknown>) => item[groupByProperty] as string)
    );
    const result = getAllUniqueGroupByPropertyValue.map(group => {
      const groupedValues = options.filter(o => o[groupByProperty] === group);
      return {
        name: group,
        values: groupedValues,
        ticked: groupedValues.every(o => o['ticked']),
        disabled: groupedValues.every(o => o['disabled'])
      };
    });
    return result;
  }

  findUnique(expression: string[]) {
    return [...Array.from(new Set(expression))];
  }

  virtualOptionsGroupingFlatten(options: Record<string, unknown>[], groupByProperty: string): Record<string, unknown>[] {
    const allParentGroupedValues = this.findUnique(
      options.filter((o) => !(o['parent'] as Record<string, unknown>[]))
        .map((item) => item[groupByProperty] as unknown as string)
    );
    const subGroupedValues = options.filter(o => o['parent'])
      .map((item) => ({
        name: item['name'],
        parent: item['parent'],
      }));
    let result: Record<string, unknown>[] = [];
    allParentGroupedValues.forEach(group => {
      result.push({
        name: group,
        isGroup: true,
        ticked: this.allDescendantsAreTicked(options, groupByProperty, group as unknown as string),
        disabled: this.allDescendantsAreDisabled(options, groupByProperty, group as unknown as string)
      });
      const groupedValues = options
        .filter((o: any) => o[groupByProperty as string] === group && !o['parent'])
        .map(v => ({ ...v, depth: 1 }));
      result = [...result].concat(groupedValues);
      // TODO: Remove as unknown as string to proper typings
      const childGroupedValues = subGroupedValues.filter((s: Record<string, unknown>) => s['parent'] as string === group as unknown as string);
      childGroupedValues.forEach(c => {
        result.push({ name: c, parent: group, isGroup: true });
        const values = options.filter(o => o[groupByProperty] === c).map(v => ({ ...v, depth: 2 }));
        result.concat(values);
      });
    });
    return result;
  }

  mirrorObject(json: Record<string, unknown>) {
    const ret: Record<string, unknown> = {};
    for (var key in json) {
      ret[json[key] as string] = key;
    }
    return ret;
  }

  mapDatasourceToFields(collection: Record<string, unknown>[], propertyMap: Record<string, unknown>, groupedProperty?: string) {
    let keys = Object.keys(propertyMap);
    return collection.map((item: Record<string, unknown>) => {
      let obj = groupedProperty ? { [groupedProperty]: item[groupedProperty] } : {};
      keys.reduce((a: Record<string, unknown>, b: string) => {
        a[b] = item[propertyMap[b] as string];
        return a;
      }, obj);
      return obj;
    });
  }
}
