"use strict"

var test = require("tape")
var uncurryThis = require("..")

test("uncurryThis basic functionality", function (t) {
  function f(a, b) {
    t.equal(this, 1, "this is correct")
    t.equal(a, 2, "first argument is correct")
    t.equal(b, 3, "second argument is correct")
    t.equal(arguments.length, 2, "arguments length is correct")
    return a + b
  }

  var fBound = uncurryThis(f)
  var result = fBound(1, 2, 3)

  t.equal(result, 5, "return value is correct")
  t.end()
})

test("uncurryThis works after deleting Function.prototype methods", function (t) {
  function f(a, b) {
    t.equal(this, 1, "this is correct")
    t.equal(a, 2, "first argument is correct")
    t.equal(b, 3, "second argument is correct")
    return a + b
  }

  var fBound = uncurryThis(f)

  var originalCall = Function.prototype.call
  var originalBind = Function.prototype.bind

  delete Function.prototype.call
  delete Function.prototype.bind

  var result = fBound(1, 2, 3)

  t.equal(result, 5, "return value is correct after deleting prototypes")

  // Restore
  Function.prototype.call = originalCall
  Function.prototype.bind = originalBind

  t.end()
})

test("uncurryThis preserves function length", function (t) {
  function noArgs() {}
  function oneArg(a) {}
  function twoArgs(a, b) {}
  function threeArgs(a, b, c) {}

  t.equal(uncurryThis(noArgs).length, 1, "no args function has length 1")
  t.equal(uncurryThis(oneArg).length, 2, "one arg function has length 2")
  t.equal(uncurryThis(twoArgs).length, 3, "two args function has length 3")
  t.equal(uncurryThis(threeArgs).length, 4, "three args function has length 4")

  t.end()
})

test("uncurryThis works with array methods", function (t) {
  var slice = uncurryThis(Array.prototype.slice)
  var arr = [1, 2, 3, 4, 5]

  var result = slice(arr, 1, 3)

  t.deepEqual(result, [2, 3], "slice works correctly")
  t.end()
})

test("uncurryThis works with string methods", function (t) {
  var charAt = uncurryThis(String.prototype.charAt)
  var str = "hello"

  var result = charAt(str, 1)

  t.equal(result, "e", "charAt works correctly")
  t.end()
})

test("uncurryThis .apply helper", function (t) {
  function f(a, b, c) {
    t.equal(this, 1, "this is correct")
    t.equal(a, 2, "first argument is correct")
    t.equal(b, 3, "second argument is correct")
    t.equal(c, 4, "third argument is correct")
    return a + b + c
  }

  var fBound = uncurryThis(f)
  var result = fBound.apply(null, [1, 2, 3, 4])

  t.equal(result, 9, ".apply works correctly")
  t.end()
})

test("uncurryThis .apply with no args", function (t) {
  function f() {
    t.equal(this, 1, "this is correct")
    t.equal(arguments.length, 0, "no additional arguments")
    return 42
  }

  var fBound = uncurryThis(f)
  var result = fBound.apply(null, [1])

  t.equal(result, 42, ".apply with only this arg works")
  t.end()
})

test("uncurryThis .apply with empty array", function (t) {
  function f() {
    t.equal(this, 5, "this is correct")
    t.equal(arguments.length, 0, "no additional arguments")
    return this * 2
  }

  var fBound = uncurryThis(f)
  var result = fBound.apply(null, [5])

  t.equal(result, 10, ".apply with empty args works")
  t.end()
})

test("uncurryThis with methods that return this", function (t) {
  function MyClass(value) {
    this.value = value
  }

  MyClass.prototype.setValue = function (newValue) {
    this.value = newValue
    return this
  }

  var setValueUnbound = uncurryThis(MyClass.prototype.setValue)
  var obj = new MyClass(10)

  var result = setValueUnbound(obj, 20)

  t.equal(result, obj, "returns this correctly")
  t.equal(obj.value, 20, "value was set correctly")
  t.end()
})

test("uncurryThis with variadic functions", function (t) {
  function sum() {
    var total = 0
    for (var i = 0; i < arguments.length; i = i + 1) {
      total = total + arguments[i]
    }
    return total
  }

  var sumUnbound = uncurryThis(sum)
  var result = sumUnbound({}, 1, 2, 3, 4, 5)

  t.equal(result, 15, "variadic function works correctly")
  t.end()
})
