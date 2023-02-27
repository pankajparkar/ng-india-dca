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

  pseudoClassExist(node: any, selector: any) {
    const nativeMatches = node.matches || node.msMatchesSelector;
    try {
      return nativeMatches.call(node, selector);
    } catch (error) {
      return false;
    }
  }

  closest(el: any, selector: any): boolean {
    let matchesFn: any;
    // find vendor prefix
    matchSelectors.some(function (fn) {
      if (typeof (document as any).body[fn] === 'function') {
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
  collectAllDescendants(collection: any[], groupProperty: any, groupName: any) {
    const allDescendants = collection.filter((item: string) => item[groupProperty] == groupName);
    allDescendants.concat(collection.filter((item: string) => (item as any).parent == groupName));
    return allDescendants;
  }

  private allDescendantsAreTicked(collection: any[], groupProperty: any, groupName: any) {
    const allDescendants = this.collectAllDescendants(collection, groupProperty, groupName);
    const allAreTicked = allDescendants.every(d => d.ticked);
    return allAreTicked;
  }
  private allDescendantsAreDisabled(collection: any[], groupProperty: any, groupName: any) {
    const allDescendants = this.collectAllDescendants(collection, groupProperty, groupName);
    const allAreDisabled = allDescendants.every(d => d.disabled);
    return allAreDisabled;
  }

  optionsGrouping(options: any[], groupByProperty: string): any[] {
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

  findUnique(expression: any) {
    return [...Array.from(new Set(expression))];
  }

  virtualOptionsGroupingFlatten(options: any[], groupByProperty: any): any[] {
    const allParentGroupedValues = this.findUnique(
      options.filter((o: any) => !(o as any).parent)
        .map((item: any) => item[groupByProperty])
    );
    const subGroupedValues = this.findUnique(
      options.filter(o => o.parent).map(({ name, parent }) => ({ name, parent }))
    );
    let result: any[] = [];
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
      const childGroupedValues = subGroupedValues.filter((s: any) => s.parent === group);
      childGroupedValues.forEach(c => {
        result.push({ name: c, parent: group, isGroup: true });
        const values = options.filter(o => o[groupByProperty] === c).map(v => ({ ...v, depth: 2 }));
        result.concat(values);
      });
    });
    return result;
  }

  mirrorObject(json: any) {
    const ret: any = {};
    for (var key in json) {
      ret[json[key]] = key;
    }
    return ret;
  }

  mapDatasourceToFields(collection: any[], propertyMap: any, groupedProperty?: string) {
    let keys = Object.keys(propertyMap);
    return collection.map((item: any) => {
      let obj = groupedProperty ? { [groupedProperty]: item[groupedProperty] } : {};
      keys.reduce((a: any, b: string) => {
        a[b] = item[propertyMap[b]];
        return a;
      }, obj);
      return obj;
    });
  }
}
