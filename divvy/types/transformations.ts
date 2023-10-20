export type Category = {
  category: string;
  items: Item[];
};

export type Item = {
    itemName: string,
    isChecked: boolean,
    itemId: string,
    inGroup: string,
    inCategory: string
}

export type Group = {
  groupId: string;
  groupName: string;
  categories: Category[];
};

export type ItemGroups = Group[];
