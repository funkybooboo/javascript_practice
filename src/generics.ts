
// generic classes
class Pair<K, V> {
    constructor(
        public key: K,
        public value: V
    ) {}
}
const pair = new Pair<number, string>(1, "a");

// generic functions or methods
class ArrayUtils {
    static wrapInArray<T>(value: T): [T] {
        return [value];
    }
}
function wrapInArray<T>(value: T): [T] {
    return [value];
}

// generic interfaces
interface Result<T> {
    data: T | null;
    error: string | null;
}
interface User {
    username: string;
}
interface Product1 {
    title: string;
}
function fetch<T>(url: string): Result<T> {
    console.log(`call ${url}`);
    const result: Result<T> = {data: null, error: null}; // Type and Interface are kinda interchangeable in TS
    return result
}
const result1 = fetch<User>("http://localhost:3000/user");
console.log(result1.data?.username);
const result2 = fetch<Product1>("http://localhost:3000/product");
console.log(result2.data?.title);

// generic constraints
function echo<T extends number | string>(value: T): T {
    return value;
}

// extending generic classes and the keyof operator
// 1. pass on the generic type parameter
interface Product2 {
    name: string;
    price: number
}
class Store<T> {
    protected _objects: T[] = [];
    get objects() {
        return this._objects;
    }
    add(object: T): void {
        this._objects.push(object);
    }
    // if T is Product
    // keyof T => "name" | "price"
    find(property: keyof T, value: unknown): T | undefined {
        return this._objects.find(o => o[property] === value);
    }
}
const store1 = new Store<Product2>();
store1.add({name: "a", price: 1});
store1.find("name", "a");
store1.find("price", 1);
store1.find("notAProperty", 1); // error because of the keyof operator
class CompressibleStore<T> extends Store<T> {
    compress() {}
}
const store2 = new CompressibleStore<Product2>();
// 2. restrict the generic type parameter
class SearchableStore<T extends {name: string}> extends Store<T> {
    find(name: string): T | undefined {
        return this._objects.find(o => o.name === name);
    }
}
// 3. fix the generic type parameter
class ProductStore extends Store<Product2> {
    filterByCategory(category: string): Product2[] {
        return [];
    }
}

// type mapping
// 1
interface Product3 {
    name: string;
    price: number;
}
type ReadOnlyProduct = {
    readonly [K in keyof Product3]: Product3[K]; // for loop kind thing to get all the properties of the Product3 type
}
const product: ReadOnlyProduct = {
    name: "a",
    price: 1
}
product.name = 1; // readonly key applied
// 2
type ReadOnly<T> = {
    readonly [K in keyof T]: T[K]; // for loop kind thing to get all the properties of the Product3 type
}
type Optional<T> = {
    [K in keyof T]?: T[K];
}
type Nullable<T> = {
    [K in keyof T]: T[K] | null;
}
