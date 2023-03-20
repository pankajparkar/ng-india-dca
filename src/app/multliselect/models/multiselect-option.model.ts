export interface MultiselectOption {
    id?: string;
    name: string;
    disabled: boolean;
    ticked: boolean;
    [key: string]: any;
}

export interface GroupByMultiselectOption extends MultiselectOption {
    isGroup: boolean;
    parent?: string;
    values?: MultiselectOption[],
    depth?: number;
}
