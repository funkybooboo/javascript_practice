function sayHello(): () => string {
    return () => "Hello World";
}

function greet(fnMessage: () => string) {
    console.log(fnMessage());
}

const fn = sayHello();
fn();
