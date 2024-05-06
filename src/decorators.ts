
function Component1(constructor: Function) {
    console.log("@Component decorator called");
    constructor.prototype.uniqueId = Date.now();
    constructor.prototype.insertInDOM = () => {
        console.log("Inserting the component in the DOM");
    };

}
@Component1
class ProfileComponent1 {
}
// is the same as
class Component2 {
    uniqueId: number = Date.now();
    insertInDOM () {
        console.log("Inserting the component in the DOM");
    }
}
class ProfileComponent2 extends Component2 {
}

// with params
// Decorator factory
function Component3(value: number) {
    return (constructor: Function) => {
        console.log("@Component decorator called");
        constructor.prototype.options = value;
        constructor.prototype.uniqueId = Date.now();
        constructor.prototype.insertInDOM = () => {
            console.log("Inserting the component in the DOM");
        };
    }
}
@Component3(1)
class ProfileComponent3 {
}

// Now the way react does it
type ComponentOptions = {
    selector: string
}
function Component(options: ComponentOptions) {
    return (constructor: Function) => {
        console.log("@Component decorator called");
        constructor.prototype.options = options;
        constructor.prototype.uniqueId = Date.now();
        constructor.prototype.insertInDOM = () => {
            console.log("Inserting the component in the DOM");
        };
    }
}
function Pipe(constructor: Function) {
    console.log("@Pipe decorator called");
    constructor.prototype.pipe = true;
}
// f(g(x)) first g then f. first Pipe then Component
@Component({selector: "#my-profile"})
@Pipe
class ProfileComponent {
}

// Method decorators
function Log(target: any, methodName: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value as Function; // only works for methods
    descriptor.value = function (...args: any) {
        console.log("Before");
        original.call(this, ...args);
        console.log("After");
    }
}
class Bird {
    @Log
    say(message: string) {
        console.log("Person says " + message);
    }
}

// accessor decorators
function Capitalize(target: any, methodName: string, descriptor: PropertyDescriptor) {
    const original = descriptor.get; // for get accessor methods
    descriptor.get = function () {
        const result = original!.call(this); // ! means "tell the compiler that I know it's not null"
        return (typeof result === "string") ? result.toUpperCase() : result;
    }
}
class Chicken {
    constructor(
        public firstName: string,
        public lastName: string
    ) {}

    @Capitalize
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}

// property decorators
function MinLength(length: number) {
    return (target: any, propertyName: string) => {
        let value: string;
        const descriptor: PropertyDescriptor = {
            set(newValue: string) {
                if (newValue.length < length)
                    throw new Error(`${propertyName} should be at least ${length} characters long.`);
                value = newValue;
            },
            get() {
                return value;
            }
        };
        Object.defineProperty(target, propertyName, descriptor);
    };
}
class User {
    @MinLength(4)
    password: string;

    constructor(password: string) {
        this.password = password;
    }
}

// parameter decorators
type WatchedParameter = {
    methodName: string,
    parameterIndex: number
}
const watchedParameters: WatchedParameter[] = [];
function Watch(target: any, methodName: string, parameterIndex: number) {
    watchedParameters.push({
        methodName,
        parameterIndex
    });
}
class Vehicle {
    move(@Watch speed: number) {}
}

console.log(watchedParameters);
