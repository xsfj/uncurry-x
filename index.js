"use strict"

var setFunctionLength = require("set-function-length")
var defineDataProperty = require("define-data-property")
var $call = require("function.call-x")

/**
 * The bound wrapper function
 * @param {Function} fn - The original function (bound via closure)
 * @returns {Function} The result of calling the function
 */
function makeBound(fn) {
  return function bound() {
    return $call.apply(fn, arguments)
  }
}

/**
 * Creates an apply helper for the uncurried function
 * @param {Function} fn - The original function
 * @returns {Function} The apply helper
 */
function makeApplyHelper(fn) {
  return function applyHelper(thisArg, args) {
    if (!args || args.length === 0) {
      return $call.call(fn)
    }

    var callArgs = []
    for (var i = 0; i < args.length; i = i + 1) {
      callArgs[callArgs.length] = args[i]
    }

    return $call.apply(fn, callArgs)
  }
}

/**
 * Creates an uncurried version of a function
 * @param {Function} fn - The function to uncurry
 * @returns {Function} The uncurried function with proper length
 */
function uncurryThis(fn) {
  var bound = makeBound(fn)
  var newLength = fn.length + 1
  var boundWithLength = setFunctionLength(bound, newLength)
  var applyHelper = makeApplyHelper(fn)

  defineDataProperty(
    boundWithLength,
    "apply",
    applyHelper,
    true,
    false,
    false,
    false
  )

  return boundWithLength
}

module.exports = uncurryThis
