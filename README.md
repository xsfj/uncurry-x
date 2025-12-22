# uncurry-this

Creates an uncurried version of a function that takes `this` as the first argument.

## Installation

```bash
npm install uncurry-this
```

## Usage

```javascript
var uncurryThis = require("uncurry-this");

function greet(name) {
    return this.greeting + ", " + name + "!";
}

var greetUnbound = uncurryThis(greet);

var context = { greeting: "Hello" };
greetUnbound(context, "World"); // "Hello, World!"

// Works even after Function.prototype methods are deleted
delete Function.prototype.call;
delete Function.prototype.bind;

greetUnbound(context, "World"); // still works!
```

## API

### `uncurryThis(fn)`

Takes a function and returns an uncurried version where `this` becomes the first parameter.

**Parameters:**
- `fn` (Function): The function to uncurry

**Returns:**
- (Function): The uncurried function with `length` set to `originalLength + 1`

### `.apply` helper

The returned function has an `.apply` method that works like `Function.prototype.apply`:

```javascript
var slice = uncurryThis(Array.prototype.slice);

// Using .apply
slice.apply(null, [[10, 20, 30, 40], 1, 3]); // [20, 30]

// Equivalent to:
slice([10, 20, 30, 40], 1, 3); // [20, 30]
```

## Examples

### Array methods

```javascript
var map = uncurryThis(Array.prototype.map);
var join = uncurryThis(Array.prototype.join);

var numbers = [1, 2, 3];
var doubled = map(numbers, function(x) { return x * 2; }); // [2, 4, 6]
join(doubled, "-"); // "2-4-6"
```

### String methods

```javascript
var split = uncurryThis(String.prototype.split);
var toLowerCase = uncurryThis(String.prototype.toLowerCase);

split("foo-bar-baz", "-"); // ["foo", "bar", "baz"]
toLowerCase("HELLO"); // "hello"
```

### Custom methods

```javascript
function Counter(start) {
    this.count = start;
}

Counter.prototype.increment = function(amount) {
    this.count += amount;
    return this.count;
};

var increment = uncurryThis(Counter.prototype.increment);
var counter = new Counter(10);

increment(counter, 5); // 15
```

## Features

- ES3 compatible
- Preserves function `length` property correctly
- Works even after `Function.prototype.call` and `Function.prototype.bind` are deleted
- Includes `.apply` helper method
- Uses cached references to native methods for maximum reliability

## License

MIT