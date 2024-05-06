import { Circle as MyCircle, Square } from "./shapes"; // you can rename with as
import Store, { Format } from "./storage";
import * as Shapes from "./shapes"; // * is a wild card
import {Circle as C, Square as S} from "./shapes_package"; // re-exporting

const circle = new MyCircle(1);
console.log(circle);

