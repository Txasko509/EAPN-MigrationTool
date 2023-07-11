import { Item } from "./item";

export interface Choice {
    order?: number;
    text?: string;
    gotoItem?: Item
}
