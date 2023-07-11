import { Item } from "./item";

export interface DecisionTree {
    id?: number;
    date?: Date;
    name: string;
    items: Item[];
}
