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

  pseudoClassExist(node: Record<string, unknown>, selector: Record<string, unknown>) {
    const nativeMatches = node.matches || node.msMatchesSelector;
    try {
      return nativeMatches.call(node, selector);
    } catch (error) {
      return false;
    }
  }

  closest(el: Record<string, unknown>, selector: Record<string, unknown>): boolean {
    let matchesFn: Record<string, unknown>;
    // find vendor prefix
    matchSelectors.some(function (fn) {
      if (typeof (document as Record<string, unknown>).body[fn] === 'function') {
        matchesFn = fn;
        return true;
      }
      return false;
    });

    let parent;

    // traverse parents
    while (el) {
      parent = el.parentElement;
      if (parent && parent[matchesFn](selector)) {
        return parent;
      }
      el = parent;
    }

    return false;
  }

  // TODO: make this logic to work to find all descendant groups
  collectAllDescendants(collection: Record<string, unknown>[], groupProperty: Record<string, unknown>, groupName: Record<string, unknown>) {
    const allDescendants = collection.filter((item: string) => item[groupProperty] == groupName);
    allDescendants.concat(collection.filter((item: string) => (item as Record<string, unknown>).parent == groupName));
    return allDescendants;
  }

  private allDescendantsAreTicked(collection: Record<string, unknown>[], groupProperty: Record<string, unknown>, groupName: Record<string, unknown>) {
    const allDescendants = this.collectAllDescendants(collection, groupProperty, groupName);
    const allAreTicked = allDescendants.every(d => d.ticked);
    return allAreTicked;
  }
  private allDescendantsAreDisabled(collection: Record<string, unknown>[], groupProperty: Record<string, unknown>, groupName: Record<string, unknown>) {
    const allDescendants = this.collectAllDescendants(collection, groupProperty, groupName);
    const allAreDisabled = allDescendants.every(d => d.disabled);
    return allAreDisabled;
  }

  optionsGrouping(options: Record<string, unknown>[], groupByProperty: string): Record<string, unknown>[] {
    const getAllUniqueGroupByPropertyValue = this.findUnique(options.map(item => item[groupByProperty]));
    const result = getAllUniqueGroupByPropertyValue.map(group => {
      const groupedValues = options.filter(o => o[groupByProperty] === group);
      return {
        name: group,
        values: groupedValues,
        ticked: groupedValues.every(o => o.ticked),
        disabled: groupedValues.every(o => o.disabled)
      };
    });
    return result;
  }

  findUnique(expression: Record<string, unknown>) {
    return [...Array.from(new Set(expression))];
  }

  virtualOptionsGroupingFlatten(options: Record<string, unknown>[], groupByProperty: Record<string, unknown>): Record<string, unknown>[] {
    const allParentGroupedValues = this.findUnique(
      options.filter((o: Record<string, unknown>) => !(o as Record<string, unknown>).parent)
        .map((item: Record<string, unknown>) => item[groupByProperty])
    );
    const subGroupedValues = this.findUnique(
      options.filter(o => o.parent).map(({ name, parent }) => ({ name, parent }))
    );
    let result: Record<string, unknown>[] = [];
    allParentGroupedValues.forEach(group => {
      result.push({
        name: group,
        isGroup: true,
        ticked: this.allDescendantsAreTicked(options, groupByProperty, group),
        disabled: this.allDescendantsAreDisabled(options, groupByProperty, group)
      });
      const groupedValues = options
        .filter(o => o[groupByProperty] === group && !o.parent)
        .map(v => ({ ...v, depth: 1 }));
      result = [...result].concat(groupedValues);
      const childGroupedValues = subGroupedValues.filter((s: Record<string, unknown>) => s.parent === group);
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
      ret[json[key]] = key;
    }
    return ret;
  }

  mapDatasourceToFields(collection: Record<string, unknown>[], propertyMap: Record<string, unknown>, groupedProperty?: string) {
    let keys = Object.keys(propertyMap);
    return collection.map((item: Record<string, unknown>) => {
      let obj = groupedProperty ? { [groupedProperty]: item[groupedProperty] } : {};
      keys.reduce((a: Record<string, unknown>, b: string) => {
        a[b] = item[propertyMap[b]];
        return a;
      }, obj);
      return obj;
    });
  }
}
