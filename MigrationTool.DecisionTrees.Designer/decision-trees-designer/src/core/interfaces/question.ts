import { Choice } from "./choice";
import { Item } from "./item";

export interface Question extends Item{
    choices?: Choice[];
}
