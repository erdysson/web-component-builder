var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global_1 =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();

var fails = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

// Detect IE8's incomplete defineProperty implementation
var descriptors = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor$1 && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
var f$5 = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor$1(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;

var objectPropertyIsEnumerable = {
	f: f$5
};

var createPropertyDescriptor = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var toString = {}.toString;

var classofRaw = function (it) {
  return toString.call(it).slice(8, -1);
};

var split = ''.split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var indexedObject = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
var requireObjectCoercible = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};

// toObject with fallback for non-array-like ES3 strings



var toIndexedObject = function (it) {
  return indexedObject(requireObjectCoercible(it));
};

var isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var toPrimitive = function (input, PREFERRED_STRING) {
  if (!isObject(input)) return input;
  var fn, val;
  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var hasOwnProperty = {}.hasOwnProperty;

var has$1 = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var document$1 = global_1.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document$1) && isObject(document$1.createElement);

var documentCreateElement = function (it) {
  return EXISTS ? document$1.createElement(it) : {};
};

// Thank's IE8 for his funny defineProperty
var ie8DomDefine = !descriptors && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- requied for testing
  return Object.defineProperty(documentCreateElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
var f$4 = descriptors ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPrimitive(P, true);
  if (ie8DomDefine) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has$1(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
};

var objectGetOwnPropertyDescriptor = {
	f: f$4
};

var anObject = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};

// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
var f$3 = descriptors ? $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (ie8DomDefine) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var objectDefineProperty = {
	f: f$3
};

var createNonEnumerableProperty = descriptors ? function (object, key, value) {
  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var setGlobal = function (key, value) {
  try {
    createNonEnumerableProperty(global_1, key, value);
  } catch (error) {
    global_1[key] = value;
  } return value;
};

var SHARED = '__core-js_shared__';
var store$1 = global_1[SHARED] || setGlobal(SHARED, {});

var sharedStore = store$1;

var functionToString = Function.toString;

// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
if (typeof sharedStore.inspectSource != 'function') {
  sharedStore.inspectSource = function (it) {
    return functionToString.call(it);
  };
}

var inspectSource = sharedStore.inspectSource;

var WeakMap$2 = global_1.WeakMap;

var nativeWeakMap = typeof WeakMap$2 === 'function' && /native code/.test(inspectSource(WeakMap$2));

var isPure = false;

var shared = createCommonjsModule(function (module) {
(module.exports = function (key, value) {
  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.10.1',
  mode: 'global',
  copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
});
});

var id = 0;
var postfix = Math.random();

var uid = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};

var keys$1 = shared('keys');

var sharedKey = function (key) {
  return keys$1[key] || (keys$1[key] = uid(key));
};

var hiddenKeys$1 = {};

var WeakMap$1 = global_1.WeakMap;
var set$2, get$1, has;

var enforce = function (it) {
  return has(it) ? get$1(it) : set$2(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get$1(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (nativeWeakMap) {
  var store = sharedStore.state || (sharedStore.state = new WeakMap$1());
  var wmget = store.get;
  var wmhas = store.has;
  var wmset = store.set;
  set$2 = function (it, metadata) {
    metadata.facade = it;
    wmset.call(store, it, metadata);
    return metadata;
  };
  get$1 = function (it) {
    return wmget.call(store, it) || {};
  };
  has = function (it) {
    return wmhas.call(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys$1[STATE] = true;
  set$2 = function (it, metadata) {
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get$1 = function (it) {
    return has$1(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return has$1(it, STATE);
  };
}

var internalState = {
  set: set$2,
  get: get$1,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};

var redefine = createCommonjsModule(function (module) {
var getInternalState = internalState.get;
var enforceInternalState = internalState.enforce;
var TEMPLATE = String(String).split('String');

(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  var state;
  if (typeof value == 'function') {
    if (typeof key == 'string' && !has$1(value, 'name')) {
      createNonEnumerableProperty(value, 'name', key);
    }
    state = enforceInternalState(value);
    if (!state.source) {
      state.source = TEMPLATE.join(typeof key == 'string' ? key : '');
    }
  }
  if (O === global_1) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else createNonEnumerableProperty(O, key, value);
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
});
});

var path = global_1;

var aFunction$1 = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

var getBuiltIn = function (namespace, method) {
  return arguments.length < 2 ? aFunction$1(path[namespace]) || aFunction$1(global_1[namespace])
    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
};

var ceil = Math.ceil;
var floor$4 = Math.floor;

// `ToInteger` abstract operation
// https://tc39.es/ecma262/#sec-tointeger
var toInteger = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor$4 : ceil)(argument);
};

var min$2 = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
var toLength = function (argument) {
  return argument > 0 ? min$2(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

var max$1 = Math.max;
var min$1 = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
var toAbsoluteIndex = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max$1(integer + length, 0) : min$1(integer, length);
};

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod$2 = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var arrayIncludes = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod$2(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod$2(false)
};

var indexOf = arrayIncludes.indexOf;


var objectKeysInternal = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has$1(hiddenKeys$1, key) && has$1(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has$1(O, key = names[i++])) {
    ~indexOf(result, key) || result.push(key);
  }
  return result;
};

// IE8- don't enum bug keys
var enumBugKeys = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
var f$2 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return objectKeysInternal(O, hiddenKeys);
};

var objectGetOwnPropertyNames = {
	f: f$2
};

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
var f$1 = Object.getOwnPropertySymbols;

var objectGetOwnPropertySymbols = {
	f: f$1
};

// all object keys, includes non-enumerable and symbols
var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = objectGetOwnPropertyNames.f(anObject(it));
  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};

var copyConstructorProperties = function (target, source) {
  var keys = ownKeys(source);
  var defineProperty = objectDefineProperty.f;
  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!has$1(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  }
};

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

var isForced_1 = isForced;

var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;






/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
var _export = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global_1;
  } else if (STATIC) {
    target = global_1[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global_1[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty === typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceProperty, options);
  }
};

var nativePromiseConstructor = global_1.Promise;

var aFunction = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};

var engineIsNode = classofRaw(global_1.process) == 'process';

var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

var process$2 = global_1.process;
var versions = process$2 && process$2.versions;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  version = match[0] + match[1];
} else if (engineUserAgent) {
  match = engineUserAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = engineUserAgent.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  }
}

var engineV8Version = version && +version;

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
  // eslint-disable-next-line es/no-symbol -- required for testing
  return !Symbol.sham &&
    // Chrome 38 Symbol has incorrect toString conversion
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    (engineIsNode ? engineV8Version === 38 : engineV8Version > 37 && engineV8Version < 41);
});

/* eslint-disable es/no-symbol -- required for testing */


var useSymbolAsUid = nativeSymbol
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';

var WellKnownSymbolsStore = shared('wks');
var Symbol$1 = global_1.Symbol;
var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

var wellKnownSymbol = function (name) {
  if (!has$1(WellKnownSymbolsStore, name) || !(nativeSymbol || typeof WellKnownSymbolsStore[name] == 'string')) {
    if (nativeSymbol && has$1(Symbol$1, name)) {
      WellKnownSymbolsStore[name] = Symbol$1[name];
    } else {
      WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
    }
  } return WellKnownSymbolsStore[name];
};

var SPECIES$3 = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.es/ecma262/#sec-speciesconstructor
var speciesConstructor = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES$3]) == undefined ? defaultConstructor : aFunction(S);
};

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
};

// 25.4.1.5 NewPromiseCapability(C)
var f = function (C) {
  return new PromiseCapability(C);
};

var newPromiseCapability = {
	f: f
};

var promiseResolve = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

// Safari bug https://bugs.webkit.org/show_bug.cgi?id=200829
var NON_GENERIC = !!nativePromiseConstructor && fails(function () {
  nativePromiseConstructor.prototype['finally'].call({ then: function () { /* empty */ } }, function () { /* empty */ });
});

// `Promise.prototype.finally` method
// https://tc39.es/ecma262/#sec-promise.prototype.finally
_export({ target: 'Promise', proto: true, real: true, forced: NON_GENERIC }, {
  'finally': function (onFinally) {
    var C = speciesConstructor(this, getBuiltIn('Promise'));
    var isFunction = typeof onFinally == 'function';
    return this.then(
      isFunction ? function (x) {
        return promiseResolve(C, onFinally()).then(function () { return x; });
      } : onFinally,
      isFunction ? function (e) {
        return promiseResolve(C, onFinally()).then(function () { throw e; });
      } : onFinally
    );
  }
});

// patch native Promise.prototype for native async functions
if (typeof nativePromiseConstructor == 'function' && !nativePromiseConstructor.prototype['finally']) {
  redefine(nativePromiseConstructor.prototype, 'finally', getBuiltIn('Promise').prototype['finally']);
}

// `RegExp.prototype.flags` getter implementation
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
var regexpFlags = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

// babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
// so we use an intermediate function.
function RE(s, f) {
  return RegExp(s, f);
}

var UNSUPPORTED_Y$1 = fails(function () {
  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
  var re = RE('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') != null;
});

var BROKEN_CARET = fails(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = RE('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') != null;
});

var regexpStickyHelpers = {
	UNSUPPORTED_Y: UNSUPPORTED_Y$1,
	BROKEN_CARET: BROKEN_CARET
};

var nativeExec = RegExp.prototype.exec;
var nativeReplace = shared('native-string-replace', String.prototype.replace);

var patchedExec = nativeExec;

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

var UNSUPPORTED_Y = regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
// eslint-disable-next-line regexp/no-assertion-capturing-group, regexp/no-empty-group -- required for testing
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;
    var sticky = UNSUPPORTED_Y && re.sticky;
    var flags = regexpFlags.call(re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;

    if (sticky) {
      flags = flags.replace('y', '');
      if (flags.indexOf('g') === -1) {
        flags += 'g';
      }

      strCopy = String(str).slice(re.lastIndex);
      // Support anchored sticky behavior.
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      // ^(? + rx + ) is needed, in combination with some str slicing, to
      // simulate the 'y' flag.
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = nativeExec.call(sticky ? reCopy : re, strCopy);

    if (sticky) {
      if (match) {
        match.input = match.input.slice(charsAdded);
        match[0] = match[0].slice(charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

var regexpExec = patchedExec;

// `RegExp.prototype.exec` method
// https://tc39.es/ecma262/#sec-regexp.prototype.exec
_export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
  exec: regexpExec
});

// TODO: Remove from `core-js@4` since it's moved to entry points






var SPECIES$2 = wellKnownSymbol('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

// IE <= 11 replaces $0 with the whole match, as if it was $&
// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
var REPLACE_KEEPS_$0 = (function () {
  // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
  return 'a'.replace(/./, '$0') === '$0';
})();

var REPLACE = wellKnownSymbol('replace');
// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
  if (/./[REPLACE]) {
    return /./[REPLACE]('a', '$0') === '';
  }
  return false;
})();

// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
// Weex JS has frozen built-in prototypes, so use try / catch wrapper
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
  // eslint-disable-next-line regexp/no-empty-group -- required for testing
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
});

var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;

    if (KEY === 'split') {
      // We can't use real regex here since it causes deoptimization
      // and serious performance degradation in V8
      // https://github.com/zloirock/core-js/issues/306
      re = {};
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES$2] = function () { return re; };
      re.flags = '';
      re[SYMBOL] = /./[SYMBOL];
    }

    re.exec = function () { execCalled = true; return null; };

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !(
      REPLACE_SUPPORTS_NAMED_GROUPS &&
      REPLACE_KEEPS_$0 &&
      !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
    )) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      if (regexp.exec === RegExp.prototype.exec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
        }
        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
      }
      return { done: false };
    }, {
      REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
      REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
    });
    var stringMethod = methods[0];
    var regexMethod = methods[1];

    redefine(String.prototype, KEY, stringMethod);
    redefine(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return regexMethod.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return regexMethod.call(string, this); }
    );
  }

  if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
};

// `String.prototype.{ codePointAt, at }` methods implementation
var createMethod$1 = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = String(requireObjectCoercible($this));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = S.charCodeAt(position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING ? S.charAt(position) : first
        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

var stringMultibyte = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod$1(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod$1(true)
};

var charAt$1 = stringMultibyte.charAt;

// `AdvanceStringIndex` abstract operation
// https://tc39.es/ecma262/#sec-advancestringindex
var advanceStringIndex = function (S, index, unicode) {
  return index + (unicode ? charAt$1(S, index).length : 1);
};

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
var toObject = function (argument) {
  return Object(requireObjectCoercible(argument));
};

var floor$3 = Math.floor;
var replace$1 = ''.replace;
var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;

// https://tc39.es/ecma262/#sec-getsubstitution
var getSubstitution = function (matched, str, position, captures, namedCaptures, replacement) {
  var tailPos = position + matched.length;
  var m = captures.length;
  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
  if (namedCaptures !== undefined) {
    namedCaptures = toObject(namedCaptures);
    symbols = SUBSTITUTION_SYMBOLS;
  }
  return replace$1.call(replacement, symbols, function (match, ch) {
    var capture;
    switch (ch.charAt(0)) {
      case '$': return '$';
      case '&': return matched;
      case '`': return str.slice(0, position);
      case "'": return str.slice(tailPos);
      case '<':
        capture = namedCaptures[ch.slice(1, -1)];
        break;
      default: // \d\d?
        var n = +ch;
        if (n === 0) return match;
        if (n > m) {
          var f = floor$3(n / 10);
          if (f === 0) return match;
          if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
          return match;
        }
        capture = captures[n - 1];
    }
    return capture === undefined ? '' : capture;
  });
};

// `RegExpExec` abstract operation
// https://tc39.es/ecma262/#sec-regexpexec
var regexpExecAbstract = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }

  if (classofRaw(R) !== 'RegExp') {
    throw TypeError('RegExp#exec called on incompatible receiver');
  }

  return regexpExec.call(R, S);
};

var max = Math.max;
var min = Math.min;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
fixRegexpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative, reason) {
  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
  var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

  return [
    // `String.prototype.replace` method
    // https://tc39.es/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = requireObjectCoercible(this);
      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
      return replacer !== undefined
        ? replacer.call(searchValue, O, replaceValue)
        : nativeReplace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      if (
        (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE && REPLACE_KEEPS_$0) ||
        (typeof replaceValue === 'string' && replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1)
      ) {
        var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
        if (res.done) return res.value;
      }

      var rx = anObject(regexp);
      var S = String(this);

      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);

      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regexpExecAbstract(rx, S);
        if (result === null) break;

        results.push(result);
        if (!global) break;

        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }

      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];

        var matched = String(result[0]);
        var position = max(min(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];
});

var ITERATOR$7 = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR$7] = function () {
    return this;
  };
  // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR$7] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};

// eslint-disable-next-line es/no-typed-arrays -- safe
var arrayBufferNative = typeof ArrayBuffer !== 'undefined' && typeof DataView !== 'undefined';

var TO_STRING_TAG$4 = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG$4] = 'z';

var toStringTagSupport = String(test) === '[object z]';

var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
var classof = toStringTagSupport ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$3)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
};

var correctPrototypeGetter = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

var IE_PROTO$1 = sharedKey('IE_PROTO');
var ObjectPrototype$2 = Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
  O = toObject(O);
  if (has$1(O, IE_PROTO$1)) return O[IE_PROTO$1];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectPrototype$2 : null;
};

var aPossiblePrototype = function (it) {
  if (!isObject(it) && it !== null) {
    throw TypeError("Can't set " + String(it) + ' as a prototype');
  } return it;
};

/* eslint-disable no-proto -- safe */



// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter.call(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);

var defineProperty$3 = objectDefineProperty.f;





var Int8Array$1 = global_1.Int8Array;
var Int8ArrayPrototype = Int8Array$1 && Int8Array$1.prototype;
var Uint8ClampedArray = global_1.Uint8ClampedArray;
var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
var TypedArray = Int8Array$1 && objectGetPrototypeOf(Int8Array$1);
var TypedArrayPrototype = Int8ArrayPrototype && objectGetPrototypeOf(Int8ArrayPrototype);
var ObjectPrototype$1 = Object.prototype;
var isPrototypeOf = ObjectPrototype$1.isPrototypeOf;

var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');
var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
// Fixing native typed arrays in Opera Presto crashes the browser, see #595
var NATIVE_ARRAY_BUFFER_VIEWS$1 = arrayBufferNative && !!objectSetPrototypeOf && classof(global_1.opera) !== 'Opera';
var TYPED_ARRAY_TAG_REQIRED = false;
var NAME;

var TypedArrayConstructorsList = {
  Int8Array: 1,
  Uint8Array: 1,
  Uint8ClampedArray: 1,
  Int16Array: 2,
  Uint16Array: 2,
  Int32Array: 4,
  Uint32Array: 4,
  Float32Array: 4,
  Float64Array: 8
};

var BigIntArrayConstructorsList = {
  BigInt64Array: 8,
  BigUint64Array: 8
};

var isView = function isView(it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return klass === 'DataView'
    || has$1(TypedArrayConstructorsList, klass)
    || has$1(BigIntArrayConstructorsList, klass);
};

var isTypedArray = function (it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return has$1(TypedArrayConstructorsList, klass)
    || has$1(BigIntArrayConstructorsList, klass);
};

var aTypedArray = function (it) {
  if (isTypedArray(it)) return it;
  throw TypeError('Target is not a typed array');
};

var aTypedArrayConstructor$2 = function (C) {
  if (objectSetPrototypeOf) {
    if (isPrototypeOf.call(TypedArray, C)) return C;
  } else for (var ARRAY in TypedArrayConstructorsList) if (has$1(TypedArrayConstructorsList, NAME)) {
    var TypedArrayConstructor = global_1[ARRAY];
    if (TypedArrayConstructor && (C === TypedArrayConstructor || isPrototypeOf.call(TypedArrayConstructor, C))) {
      return C;
    }
  } throw TypeError('Target is not a typed array constructor');
};

var exportTypedArrayMethod = function (KEY, property, forced) {
  if (!descriptors) return;
  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
    var TypedArrayConstructor = global_1[ARRAY];
    if (TypedArrayConstructor && has$1(TypedArrayConstructor.prototype, KEY)) {
      delete TypedArrayConstructor.prototype[KEY];
    }
  }
  if (!TypedArrayPrototype[KEY] || forced) {
    redefine(TypedArrayPrototype, KEY, forced ? property
      : NATIVE_ARRAY_BUFFER_VIEWS$1 && Int8ArrayPrototype[KEY] || property);
  }
};

var exportTypedArrayStaticMethod$2 = function (KEY, property, forced) {
  var ARRAY, TypedArrayConstructor;
  if (!descriptors) return;
  if (objectSetPrototypeOf) {
    if (forced) for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = global_1[ARRAY];
      if (TypedArrayConstructor && has$1(TypedArrayConstructor, KEY)) {
        delete TypedArrayConstructor[KEY];
      }
    }
    if (!TypedArray[KEY] || forced) {
      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
      try {
        return redefine(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS$1 && Int8Array$1[KEY] || property);
      } catch (error) { /* empty */ }
    } else return;
  }
  for (ARRAY in TypedArrayConstructorsList) {
    TypedArrayConstructor = global_1[ARRAY];
    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
      redefine(TypedArrayConstructor, KEY, property);
    }
  }
};

for (NAME in TypedArrayConstructorsList) {
  if (!global_1[NAME]) NATIVE_ARRAY_BUFFER_VIEWS$1 = false;
}

// WebKit bug - typed arrays constructors prototype is Object.prototype
if (!NATIVE_ARRAY_BUFFER_VIEWS$1 || typeof TypedArray != 'function' || TypedArray === Function.prototype) {
  // eslint-disable-next-line no-shadow -- safe
  TypedArray = function TypedArray() {
    throw TypeError('Incorrect invocation');
  };
  if (NATIVE_ARRAY_BUFFER_VIEWS$1) for (NAME in TypedArrayConstructorsList) {
    if (global_1[NAME]) objectSetPrototypeOf(global_1[NAME], TypedArray);
  }
}

if (!NATIVE_ARRAY_BUFFER_VIEWS$1 || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype$1) {
  TypedArrayPrototype = TypedArray.prototype;
  if (NATIVE_ARRAY_BUFFER_VIEWS$1) for (NAME in TypedArrayConstructorsList) {
    if (global_1[NAME]) objectSetPrototypeOf(global_1[NAME].prototype, TypedArrayPrototype);
  }
}

// WebKit bug - one more object in Uint8ClampedArray prototype chain
if (NATIVE_ARRAY_BUFFER_VIEWS$1 && objectGetPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
  objectSetPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
}

if (descriptors && !has$1(TypedArrayPrototype, TO_STRING_TAG$2)) {
  TYPED_ARRAY_TAG_REQIRED = true;
  defineProperty$3(TypedArrayPrototype, TO_STRING_TAG$2, { get: function () {
    return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
  } });
  for (NAME in TypedArrayConstructorsList) if (global_1[NAME]) {
    createNonEnumerableProperty(global_1[NAME], TYPED_ARRAY_TAG, NAME);
  }
}

var arrayBufferViewCore = {
  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS$1,
  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQIRED && TYPED_ARRAY_TAG,
  aTypedArray: aTypedArray,
  aTypedArrayConstructor: aTypedArrayConstructor$2,
  exportTypedArrayMethod: exportTypedArrayMethod,
  exportTypedArrayStaticMethod: exportTypedArrayStaticMethod$2,
  isView: isView,
  isTypedArray: isTypedArray,
  TypedArray: TypedArray,
  TypedArrayPrototype: TypedArrayPrototype
};

/* eslint-disable no-new -- required for testing */



var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

var ArrayBuffer$1 = global_1.ArrayBuffer;
var Int8Array = global_1.Int8Array;

var typedArrayConstructorsRequireWrappers = !NATIVE_ARRAY_BUFFER_VIEWS || !fails(function () {
  Int8Array(1);
}) || !fails(function () {
  new Int8Array(-1);
}) || !checkCorrectnessOfIteration(function (iterable) {
  new Int8Array();
  new Int8Array(null);
  new Int8Array(1.5);
  new Int8Array(iterable);
}, true) || fails(function () {
  // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
  return new Int8Array(new ArrayBuffer$1(2), 1, undefined).length !== 1;
});

var redefineAll = function (target, src, options) {
  for (var key in src) redefine(target, key, src[key], options);
  return target;
};

var anInstance = function (it, Constructor, name) {
  if (!(it instanceof Constructor)) {
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  } return it;
};

// `ToIndex` abstract operation
// https://tc39.es/ecma262/#sec-toindex
var toIndex = function (it) {
  if (it === undefined) return 0;
  var number = toInteger(it);
  var length = toLength(number);
  if (number !== length) throw RangeError('Wrong length or index');
  return length;
};

// IEEE754 conversions based on https://github.com/feross/ieee754
var abs = Math.abs;
var pow$1 = Math.pow;
var floor$2 = Math.floor;
var log = Math.log;
var LN2 = Math.LN2;

var pack = function (number, mantissaLength, bytes) {
  var buffer = new Array(bytes);
  var exponentLength = bytes * 8 - mantissaLength - 1;
  var eMax = (1 << exponentLength) - 1;
  var eBias = eMax >> 1;
  var rt = mantissaLength === 23 ? pow$1(2, -24) - pow$1(2, -77) : 0;
  var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
  var index = 0;
  var exponent, mantissa, c;
  number = abs(number);
  // eslint-disable-next-line no-self-compare -- NaN check
  if (number != number || number === Infinity) {
    // eslint-disable-next-line no-self-compare -- NaN check
    mantissa = number != number ? 1 : 0;
    exponent = eMax;
  } else {
    exponent = floor$2(log(number) / LN2);
    if (number * (c = pow$1(2, -exponent)) < 1) {
      exponent--;
      c *= 2;
    }
    if (exponent + eBias >= 1) {
      number += rt / c;
    } else {
      number += rt * pow$1(2, 1 - eBias);
    }
    if (number * c >= 2) {
      exponent++;
      c /= 2;
    }
    if (exponent + eBias >= eMax) {
      mantissa = 0;
      exponent = eMax;
    } else if (exponent + eBias >= 1) {
      mantissa = (number * c - 1) * pow$1(2, mantissaLength);
      exponent = exponent + eBias;
    } else {
      mantissa = number * pow$1(2, eBias - 1) * pow$1(2, mantissaLength);
      exponent = 0;
    }
  }
  for (; mantissaLength >= 8; buffer[index++] = mantissa & 255, mantissa /= 256, mantissaLength -= 8);
  exponent = exponent << mantissaLength | mantissa;
  exponentLength += mantissaLength;
  for (; exponentLength > 0; buffer[index++] = exponent & 255, exponent /= 256, exponentLength -= 8);
  buffer[--index] |= sign * 128;
  return buffer;
};

var unpack = function (buffer, mantissaLength) {
  var bytes = buffer.length;
  var exponentLength = bytes * 8 - mantissaLength - 1;
  var eMax = (1 << exponentLength) - 1;
  var eBias = eMax >> 1;
  var nBits = exponentLength - 7;
  var index = bytes - 1;
  var sign = buffer[index--];
  var exponent = sign & 127;
  var mantissa;
  sign >>= 7;
  for (; nBits > 0; exponent = exponent * 256 + buffer[index], index--, nBits -= 8);
  mantissa = exponent & (1 << -nBits) - 1;
  exponent >>= -nBits;
  nBits += mantissaLength;
  for (; nBits > 0; mantissa = mantissa * 256 + buffer[index], index--, nBits -= 8);
  if (exponent === 0) {
    exponent = 1 - eBias;
  } else if (exponent === eMax) {
    return mantissa ? NaN : sign ? -Infinity : Infinity;
  } else {
    mantissa = mantissa + pow$1(2, mantissaLength);
    exponent = exponent - eBias;
  } return (sign ? -1 : 1) * mantissa * pow$1(2, exponent - mantissaLength);
};

var ieee754 = {
  pack: pack,
  unpack: unpack
};

// `Array.prototype.fill` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.fill
var arrayFill = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var argumentsLength = arguments.length;
  var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
  var end = argumentsLength > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};

var defineProperty$2 = objectDefineProperty.f;



var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');

var setToStringTag = function (it, TAG, STATIC) {
  if (it && !has$1(it = STATIC ? it : it.prototype, TO_STRING_TAG$1)) {
    defineProperty$2(it, TO_STRING_TAG$1, { configurable: true, value: TAG });
  }
};

var getOwnPropertyNames = objectGetOwnPropertyNames.f;
var defineProperty$1 = objectDefineProperty.f;




var getInternalState$2 = internalState.get;
var setInternalState$4 = internalState.set;
var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE$1 = 'prototype';
var WRONG_LENGTH = 'Wrong length';
var WRONG_INDEX = 'Wrong index';
var NativeArrayBuffer = global_1[ARRAY_BUFFER];
var $ArrayBuffer = NativeArrayBuffer;
var $DataView = global_1[DATA_VIEW];
var $DataViewPrototype = $DataView && $DataView[PROTOTYPE$1];
var ObjectPrototype = Object.prototype;
var RangeError$1 = global_1.RangeError;

var packIEEE754 = ieee754.pack;
var unpackIEEE754 = ieee754.unpack;

var packInt8 = function (number) {
  return [number & 0xFF];
};

var packInt16 = function (number) {
  return [number & 0xFF, number >> 8 & 0xFF];
};

var packInt32 = function (number) {
  return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
};

var unpackInt32 = function (buffer) {
  return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
};

var packFloat32 = function (number) {
  return packIEEE754(number, 23, 4);
};

var packFloat64 = function (number) {
  return packIEEE754(number, 52, 8);
};

var addGetter = function (Constructor, key) {
  defineProperty$1(Constructor[PROTOTYPE$1], key, { get: function () { return getInternalState$2(this)[key]; } });
};

var get = function (view, count, index, isLittleEndian) {
  var intIndex = toIndex(index);
  var store = getInternalState$2(view);
  if (intIndex + count > store.byteLength) throw RangeError$1(WRONG_INDEX);
  var bytes = getInternalState$2(store.buffer).bytes;
  var start = intIndex + store.byteOffset;
  var pack = bytes.slice(start, start + count);
  return isLittleEndian ? pack : pack.reverse();
};

var set$1 = function (view, count, index, conversion, value, isLittleEndian) {
  var intIndex = toIndex(index);
  var store = getInternalState$2(view);
  if (intIndex + count > store.byteLength) throw RangeError$1(WRONG_INDEX);
  var bytes = getInternalState$2(store.buffer).bytes;
  var start = intIndex + store.byteOffset;
  var pack = conversion(+value);
  for (var i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
};

if (!arrayBufferNative) {
  $ArrayBuffer = function ArrayBuffer(length) {
    anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
    var byteLength = toIndex(length);
    setInternalState$4(this, {
      bytes: arrayFill.call(new Array(byteLength), 0),
      byteLength: byteLength
    });
    if (!descriptors) this.byteLength = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = getInternalState$2(buffer).byteLength;
    var offset = toInteger(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError$1('Wrong offset');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError$1(WRONG_LENGTH);
    setInternalState$4(this, {
      buffer: buffer,
      byteLength: byteLength,
      byteOffset: offset
    });
    if (!descriptors) {
      this.buffer = buffer;
      this.byteLength = byteLength;
      this.byteOffset = offset;
    }
  };

  if (descriptors) {
    addGetter($ArrayBuffer, 'byteLength');
    addGetter($DataView, 'buffer');
    addGetter($DataView, 'byteLength');
    addGetter($DataView, 'byteOffset');
  }

  redefineAll($DataView[PROTOTYPE$1], {
    getInt8: function getInt8(byteOffset) {
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /* , littleEndian */) {
      return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 23);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 52);
    },
    setInt8: function setInt8(byteOffset, value) {
      set$1(this, 1, byteOffset, packInt8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set$1(this, 1, byteOffset, packInt8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set$1(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set$1(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set$1(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set$1(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set$1(this, 4, byteOffset, packFloat32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set$1(this, 8, byteOffset, packFloat64, value, arguments.length > 2 ? arguments[2] : undefined);
    }
  });
} else {
  /* eslint-disable no-new -- required for testing */
  if (!fails(function () {
    NativeArrayBuffer(1);
  }) || !fails(function () {
    new NativeArrayBuffer(-1);
  }) || fails(function () {
    new NativeArrayBuffer();
    new NativeArrayBuffer(1.5);
    new NativeArrayBuffer(NaN);
    return NativeArrayBuffer.name != ARRAY_BUFFER;
  })) {
  /* eslint-enable no-new -- required for testing */
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer);
      return new NativeArrayBuffer(toIndex(length));
    };
    var ArrayBufferPrototype = $ArrayBuffer[PROTOTYPE$1] = NativeArrayBuffer[PROTOTYPE$1];
    for (var keys = getOwnPropertyNames(NativeArrayBuffer), j = 0, key; keys.length > j;) {
      if (!((key = keys[j++]) in $ArrayBuffer)) {
        createNonEnumerableProperty($ArrayBuffer, key, NativeArrayBuffer[key]);
      }
    }
    ArrayBufferPrototype.constructor = $ArrayBuffer;
  }

  // WebKit bug - the same parent prototype for typed arrays and data view
  if (objectSetPrototypeOf && objectGetPrototypeOf($DataViewPrototype) !== ObjectPrototype) {
    objectSetPrototypeOf($DataViewPrototype, ObjectPrototype);
  }

  // iOS Safari 7.x bug
  var testView = new $DataView(new $ArrayBuffer(2));
  var $setInt8 = $DataViewPrototype.setInt8;
  testView.setInt8(0, 2147483648);
  testView.setInt8(1, 2147483649);
  if (testView.getInt8(0) || !testView.getInt8(1)) redefineAll($DataViewPrototype, {
    setInt8: function setInt8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, { unsafe: true });
}

setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);

var arrayBuffer = {
  ArrayBuffer: $ArrayBuffer,
  DataView: $DataView
};

var toPositiveInteger = function (it) {
  var result = toInteger(it);
  if (result < 0) throw RangeError("The argument can't be less than 0");
  return result;
};

var toOffset = function (it, BYTES) {
  var offset = toPositiveInteger(it);
  if (offset % BYTES) throw RangeError('Wrong offset');
  return offset;
};

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
var objectKeys = Object.keys || function keys(O) {
  return objectKeysInternal(O, enumBugKeys);
};

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
  return O;
};

var html = getBuiltIn('document', 'documentElement');

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    /* global ActiveXObject -- old IE */
    activeXDocument = document.domain && new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys$1[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
var objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : objectDefineProperties(result, Properties);
};

var iterators = {};

var ITERATOR$6 = wellKnownSymbol('iterator');

var getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR$6]
    || it['@@iterator']
    || iterators[classof(it)];
};

var ITERATOR$5 = wellKnownSymbol('iterator');
var ArrayPrototype$1 = Array.prototype;

// check on default Array iterator
var isArrayIteratorMethod = function (it) {
  return it !== undefined && (iterators.Array === it || ArrayPrototype$1[ITERATOR$5] === it);
};

// optional / simple context binding
var functionBindContext = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 0: return function () {
      return fn.call(that);
    };
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var aTypedArrayConstructor$1 = arrayBufferViewCore.aTypedArrayConstructor;

var typedArrayFrom = function from(source /* , mapfn, thisArg */) {
  var O = toObject(source);
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratorMethod = getIteratorMethod(O);
  var i, length, result, step, iterator, next;
  if (iteratorMethod != undefined && !isArrayIteratorMethod(iteratorMethod)) {
    iterator = iteratorMethod.call(O);
    next = iterator.next;
    O = [];
    while (!(step = next.call(iterator)).done) {
      O.push(step.value);
    }
  }
  if (mapping && argumentsLength > 2) {
    mapfn = functionBindContext(mapfn, arguments[2], 2);
  }
  length = toLength(O.length);
  result = new (aTypedArrayConstructor$1(this))(length);
  for (i = 0; length > i; i++) {
    result[i] = mapping ? mapfn(O[i], i) : O[i];
  }
  return result;
};

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
var isArray = Array.isArray || function isArray(arg) {
  return classofRaw(arg) == 'Array';
};

var SPECIES$1 = wellKnownSymbol('species');

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
var arraySpeciesCreate = function (originalArray, length) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES$1];
      if (C === null) C = undefined;
    }
  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
};

var push = [].push;

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterOut }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var IS_FILTER_OUT = TYPE == 7;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = indexedObject(O);
    var boundFunction = functionBindContext(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_OUT ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push.call(target, value); // filter
        } else switch (TYPE) {
          case 4: return false;             // every
          case 7: push.call(target, value); // filterOut
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

var arrayIteration = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6),
  // `Array.prototype.filterOut` method
  // https://github.com/tc39/proposal-array-filtering
  filterOut: createMethod(7)
};

var SPECIES = wellKnownSymbol('species');

var setSpecies = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = objectDefineProperty.f;

  if (descriptors && Constructor && !Constructor[SPECIES]) {
    defineProperty(Constructor, SPECIES, {
      configurable: true,
      get: function () { return this; }
    });
  }
};

// makes subclassing work correct for wrapped built-ins
var inheritIfRequired = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    objectSetPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    typeof (NewTarget = dummy.constructor) == 'function' &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) objectSetPrototypeOf($this, NewTargetPrototype);
  return $this;
};

var typedArrayConstructor = createCommonjsModule(function (module) {


















var getOwnPropertyNames = objectGetOwnPropertyNames.f;

var forEach = arrayIteration.forEach;






var getInternalState = internalState.get;
var setInternalState = internalState.set;
var nativeDefineProperty = objectDefineProperty.f;
var nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
var round = Math.round;
var RangeError = global_1.RangeError;
var ArrayBuffer = arrayBuffer.ArrayBuffer;
var DataView = arrayBuffer.DataView;
var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
var TYPED_ARRAY_TAG = arrayBufferViewCore.TYPED_ARRAY_TAG;
var TypedArray = arrayBufferViewCore.TypedArray;
var TypedArrayPrototype = arrayBufferViewCore.TypedArrayPrototype;
var aTypedArrayConstructor = arrayBufferViewCore.aTypedArrayConstructor;
var isTypedArray = arrayBufferViewCore.isTypedArray;
var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
var WRONG_LENGTH = 'Wrong length';

var fromList = function (C, list) {
  var index = 0;
  var length = list.length;
  var result = new (aTypedArrayConstructor(C))(length);
  while (length > index) result[index] = list[index++];
  return result;
};

var addGetter = function (it, key) {
  nativeDefineProperty(it, key, { get: function () {
    return getInternalState(this)[key];
  } });
};

var isArrayBuffer = function (it) {
  var klass;
  return it instanceof ArrayBuffer || (klass = classof(it)) == 'ArrayBuffer' || klass == 'SharedArrayBuffer';
};

var isTypedArrayIndex = function (target, key) {
  return isTypedArray(target)
    && typeof key != 'symbol'
    && key in target
    && String(+key) == String(key);
};

var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
  return isTypedArrayIndex(target, key = toPrimitive(key, true))
    ? createPropertyDescriptor(2, target[key])
    : nativeGetOwnPropertyDescriptor(target, key);
};

var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
  if (isTypedArrayIndex(target, key = toPrimitive(key, true))
    && isObject(descriptor)
    && has$1(descriptor, 'value')
    && !has$1(descriptor, 'get')
    && !has$1(descriptor, 'set')
    // TODO: add validation descriptor w/o calling accessors
    && !descriptor.configurable
    && (!has$1(descriptor, 'writable') || descriptor.writable)
    && (!has$1(descriptor, 'enumerable') || descriptor.enumerable)
  ) {
    target[key] = descriptor.value;
    return target;
  } return nativeDefineProperty(target, key, descriptor);
};

if (descriptors) {
  if (!NATIVE_ARRAY_BUFFER_VIEWS) {
    objectGetOwnPropertyDescriptor.f = wrappedGetOwnPropertyDescriptor;
    objectDefineProperty.f = wrappedDefineProperty;
    addGetter(TypedArrayPrototype, 'buffer');
    addGetter(TypedArrayPrototype, 'byteOffset');
    addGetter(TypedArrayPrototype, 'byteLength');
    addGetter(TypedArrayPrototype, 'length');
  }

  _export({ target: 'Object', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS }, {
    getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
    defineProperty: wrappedDefineProperty
  });

  module.exports = function (TYPE, wrapper, CLAMPED) {
    var BYTES = TYPE.match(/\d+$/)[0] / 8;
    var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + TYPE;
    var SETTER = 'set' + TYPE;
    var NativeTypedArrayConstructor = global_1[CONSTRUCTOR_NAME];
    var TypedArrayConstructor = NativeTypedArrayConstructor;
    var TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype;
    var exported = {};

    var getter = function (that, index) {
      var data = getInternalState(that);
      return data.view[GETTER](index * BYTES + data.byteOffset, true);
    };

    var setter = function (that, index, value) {
      var data = getInternalState(that);
      if (CLAMPED) value = (value = round(value)) < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF;
      data.view[SETTER](index * BYTES + data.byteOffset, value, true);
    };

    var addElement = function (that, index) {
      nativeDefineProperty(that, index, {
        get: function () {
          return getter(this, index);
        },
        set: function (value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };

    if (!NATIVE_ARRAY_BUFFER_VIEWS) {
      TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
        anInstance(that, TypedArrayConstructor, CONSTRUCTOR_NAME);
        var index = 0;
        var byteOffset = 0;
        var buffer, byteLength, length;
        if (!isObject(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new ArrayBuffer(byteLength);
        } else if (isArrayBuffer(data)) {
          buffer = data;
          byteOffset = toOffset(offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - byteOffset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + byteOffset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (isTypedArray(data)) {
          return fromList(TypedArrayConstructor, data);
        } else {
          return typedArrayFrom.call(TypedArrayConstructor, data);
        }
        setInternalState(that, {
          buffer: buffer,
          byteOffset: byteOffset,
          byteLength: byteLength,
          length: length,
          view: new DataView(buffer)
        });
        while (index < length) addElement(that, index++);
      });

      if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
      TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = objectCreate(TypedArrayPrototype);
    } else if (typedArrayConstructorsRequireWrappers) {
      TypedArrayConstructor = wrapper(function (dummy, data, typedArrayOffset, $length) {
        anInstance(dummy, TypedArrayConstructor, CONSTRUCTOR_NAME);
        return inheritIfRequired(function () {
          if (!isObject(data)) return new NativeTypedArrayConstructor(toIndex(data));
          if (isArrayBuffer(data)) return $length !== undefined
            ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES), $length)
            : typedArrayOffset !== undefined
              ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES))
              : new NativeTypedArrayConstructor(data);
          if (isTypedArray(data)) return fromList(TypedArrayConstructor, data);
          return typedArrayFrom.call(TypedArrayConstructor, data);
        }(), dummy, TypedArrayConstructor);
      });

      if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
      forEach(getOwnPropertyNames(NativeTypedArrayConstructor), function (key) {
        if (!(key in TypedArrayConstructor)) {
          createNonEnumerableProperty(TypedArrayConstructor, key, NativeTypedArrayConstructor[key]);
        }
      });
      TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
    }

    if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
      createNonEnumerableProperty(TypedArrayConstructorPrototype, 'constructor', TypedArrayConstructor);
    }

    if (TYPED_ARRAY_TAG) {
      createNonEnumerableProperty(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME);
    }

    exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;

    _export({
      global: true, forced: TypedArrayConstructor != NativeTypedArrayConstructor, sham: !NATIVE_ARRAY_BUFFER_VIEWS
    }, exported);

    if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
      createNonEnumerableProperty(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
    }

    if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
      createNonEnumerableProperty(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
    }

    setSpecies(CONSTRUCTOR_NAME);
  };
} else module.exports = function () { /* empty */ };
});

// `Float32Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
typedArrayConstructor('Float32', function (init) {
  return function Float32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

// `Float64Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
typedArrayConstructor('Float64', function (init) {
  return function Float64Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

// `Int8Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
typedArrayConstructor('Int8', function (init) {
  return function Int8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

// `Int16Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
typedArrayConstructor('Int16', function (init) {
  return function Int16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

// `Int32Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
typedArrayConstructor('Int32', function (init) {
  return function Int32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

// `Uint8Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
typedArrayConstructor('Uint8', function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

// `Uint8ClampedArray` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
typedArrayConstructor('Uint8', function (init) {
  return function Uint8ClampedArray(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
}, true);

// `Uint16Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
typedArrayConstructor('Uint16', function (init) {
  return function Uint16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

// `Uint32Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
typedArrayConstructor('Uint32', function (init) {
  return function Uint32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

var exportTypedArrayStaticMethod$1 = arrayBufferViewCore.exportTypedArrayStaticMethod;


// `%TypedArray%.from` method
// https://tc39.es/ecma262/#sec-%typedarray%.from
exportTypedArrayStaticMethod$1('from', typedArrayFrom, typedArrayConstructorsRequireWrappers);

var aTypedArrayConstructor = arrayBufferViewCore.aTypedArrayConstructor;
var exportTypedArrayStaticMethod = arrayBufferViewCore.exportTypedArrayStaticMethod;

// `%TypedArray%.of` method
// https://tc39.es/ecma262/#sec-%typedarray%.of
exportTypedArrayStaticMethod('of', function of(/* ...items */) {
  var index = 0;
  var length = arguments.length;
  var result = new (aTypedArrayConstructor(this))(length);
  while (length > index) result[index] = arguments[index++];
  return result;
}, typedArrayConstructorsRequireWrappers);

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
var domIterables = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  objectDefineProperty.f(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: objectCreate(null)
  });
}

// add a key to Array.prototype[@@unscopables]
var addToUnscopables = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};

var ITERATOR$4 = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS$1 = false;

var returnThis$2 = function () { return this; };

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype$2, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS$1 = true;
  else {
    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = IteratorPrototype$2 == undefined || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype$2[ITERATOR$4].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$2 = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
if (!has$1(IteratorPrototype$2, ITERATOR$4)) {
  createNonEnumerableProperty(IteratorPrototype$2, ITERATOR$4, returnThis$2);
}

var iteratorsCore = {
  IteratorPrototype: IteratorPrototype$2,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1
};

var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





var returnThis$1 = function () { return this; };

var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
  iterators[TO_STRING_TAG] = returnThis$1;
  return IteratorConstructor;
};

var IteratorPrototype = iteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = iteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR$3 = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR$3]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (IteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (objectSetPrototypeOf) {
          objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (typeof CurrentIteratorPrototype[ITERATOR$3] != 'function') {
          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR$3, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
    }
  }

  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    INCORRECT_VALUES_NAME = true;
    defaultIterator = function values() { return nativeIterator.call(this); };
  }

  // define iterator
  if (IterablePrototype[ITERATOR$3] !== defaultIterator) {
    createNonEnumerableProperty(IterablePrototype, ITERATOR$3, defaultIterator);
  }
  iterators[NAME] = defaultIterator;

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  return methods;
};

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState$3 = internalState.set;
var getInternalState$1 = internalState.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState$3(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState$1(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
iterators.Arguments = iterators.Array;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

var ITERATOR$2 = wellKnownSymbol('iterator');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ArrayValues = es_array_iterator.values;

for (var COLLECTION_NAME in domIterables) {
  var Collection = global_1[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR$2] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR$2, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR$2] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG]) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
    }
    if (domIterables[COLLECTION_NAME]) for (var METHOD_NAME in es_array_iterator) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, es_array_iterator[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = es_array_iterator[METHOD_NAME];
      }
    }
  }
}

var engineIsIos = /(?:iphone|ipod|ipad).*applewebkit/i.test(engineUserAgent);

var location$1 = global_1.location;
var set = global_1.setImmediate;
var clear = global_1.clearImmediate;
var process$1 = global_1.process;
var MessageChannel = global_1.MessageChannel;
var Dispatch = global_1.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;

var run = function (id) {
  // eslint-disable-next-line no-prototype-builtins -- safe
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};

var runner = function (id) {
  return function () {
    run(id);
  };
};

var listener = function (event) {
  run(event.data);
};

var post = function (id) {
  // old engines have not location.origin
  global_1.postMessage(id + '', location$1.protocol + '//' + location$1.host);
};

// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!set || !clear) {
  set = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func -- spec requirement
      (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (engineIsNode) {
    defer = function (id) {
      process$1.nextTick(runner(id));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(runner(id));
    };
  // Browsers with MessageChannel, includes WebWorkers
  // except iOS - https://github.com/zloirock/core-js/issues/624
  } else if (MessageChannel && !engineIsIos) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = functionBindContext(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (
    global_1.addEventListener &&
    typeof postMessage == 'function' &&
    !global_1.importScripts &&
    location$1 && location$1.protocol !== 'file:' &&
    !fails(post)
  ) {
    defer = post;
    global_1.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in documentCreateElement('script')) {
    defer = function (id) {
      html.appendChild(documentCreateElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(runner(id), 0);
    };
  }
}

var task = {
  set: set,
  clear: clear
};

var FORCED = !global_1.setImmediate || !global_1.clearImmediate;

// http://w3c.github.io/setImmediate/
_export({ global: true, bind: true, enumerable: true, forced: FORCED }, {
  // `setImmediate` method
  // http://w3c.github.io/setImmediate/#si-setImmediate
  setImmediate: task.set,
  // `clearImmediate` method
  // http://w3c.github.io/setImmediate/#si-clearImmediate
  clearImmediate: task.clear
});

var charAt = stringMultibyte.charAt;



var STRING_ITERATOR = 'String Iterator';
var setInternalState$2 = internalState.set;
var getInternalState = internalState.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState$2(this, {
    type: STRING_ITERATOR,
    string: String(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt(string, index);
  state.index += point.length;
  return { value: point, done: false };
});

var ITERATOR$1 = wellKnownSymbol('iterator');

var nativeUrl = !fails(function () {
  var url = new URL('b?a=1&b=2&c=3', 'http://a');
  var searchParams = url.searchParams;
  var result = '';
  url.pathname = 'c%20d';
  searchParams.forEach(function (value, key) {
    searchParams['delete']('b');
    result += key + value;
  });
  return (isPure && !url.toJSON)
    || !searchParams.sort
    || url.href !== 'http://a/c%20d?a=1&c=3'
    || searchParams.get('c') !== '3'
    || String(new URLSearchParams('?a=1')) !== 'a=1'
    || !searchParams[ITERATOR$1]
    // throws in Edge
    || new URL('https://a@b').username !== 'a'
    || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
    // not punycoded in Edge
    || new URL('http://тест').host !== 'xn--e1aybc'
    // not escaped in Chrome 62-
    || new URL('http://a#б').hash !== '#%D0%B1'
    // fails in Chrome 66-
    || result !== 'a1c3'
    // throws in Safari
    || new URL('http://x', undefined).host !== 'x';
});

// eslint-disable-next-line es/no-object-assign -- safe
var $assign = Object.assign;
// eslint-disable-next-line es/no-object-defineproperty -- required for testing
var defineProperty = Object.defineProperty;

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
var objectAssign = !$assign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (descriptors && $assign({ b: 1 }, $assign(defineProperty({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  // eslint-disable-next-line es/no-symbol -- safe
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return $assign({}, A)[symbol] != 7 || objectKeys($assign({}, B)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
  var propertyIsEnumerable = objectPropertyIsEnumerable.f;
  while (argumentsLength > index) {
    var S = indexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;

var iteratorClose = function (iterator) {
  var returnMethod = iterator['return'];
  if (returnMethod !== undefined) {
    return anObject(returnMethod.call(iterator)).value;
  }
};

// call something on iterator step with safe closing on error
var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (error) {
    iteratorClose(iterator);
    throw error;
  }
};

var createProperty = function (object, key, value) {
  var propertyKey = toPrimitive(key);
  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};

// `Array.from` method implementation
// https://tc39.es/ecma262/#sec-array.from
var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var C = typeof this == 'function' ? this : Array;
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratorMethod = getIteratorMethod(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  if (mapping) mapfn = functionBindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = iteratorMethod.call(O);
    next = iterator.next;
    result = new C();
    for (;!(step = next.call(iterator)).done; index++) {
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      createProperty(result, index, value);
    }
  } else {
    length = toLength(O.length);
    result = new C(length);
    for (;length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }
  result.length = index;
  return result;
};

// based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128; // 0x80
var delimiter = '-'; // '\x2D'
var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
var baseMinusTMin = base - tMin;
var floor$1 = Math.floor;
var stringFromCharCode = String.fromCharCode;

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 */
var ucs2decode = function (string) {
  var output = [];
  var counter = 0;
  var length = string.length;
  while (counter < length) {
    var value = string.charCodeAt(counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
      // It's a high surrogate, and there is a next character.
      var extra = string.charCodeAt(counter++);
      if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      } else {
        // It's an unmatched surrogate; only append this code unit, in case the
        // next code unit is the high surrogate of a surrogate pair.
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
};

/**
 * Converts a digit/integer into a basic code point.
 */
var digitToBasic = function (digit) {
  //  0..25 map to ASCII a..z or A..Z
  // 26..35 map to ASCII 0..9
  return digit + 22 + 75 * (digit < 26);
};

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 */
var adapt = function (delta, numPoints, firstTime) {
  var k = 0;
  delta = firstTime ? floor$1(delta / damp) : delta >> 1;
  delta += floor$1(delta / numPoints);
  for (; delta > baseMinusTMin * tMax >> 1; k += base) {
    delta = floor$1(delta / baseMinusTMin);
  }
  return floor$1(k + (baseMinusTMin + 1) * delta / (delta + skew));
};

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 */
// eslint-disable-next-line max-statements -- TODO
var encode = function (input) {
  var output = [];

  // Convert the input in UCS-2 to an array of Unicode code points.
  input = ucs2decode(input);

  // Cache the length.
  var inputLength = input.length;

  // Initialize the state.
  var n = initialN;
  var delta = 0;
  var bias = initialBias;
  var i, currentValue;

  // Handle the basic code points.
  for (i = 0; i < input.length; i++) {
    currentValue = input[i];
    if (currentValue < 0x80) {
      output.push(stringFromCharCode(currentValue));
    }
  }

  var basicLength = output.length; // number of basic code points.
  var handledCPCount = basicLength; // number of code points that have been handled;

  // Finish the basic string with a delimiter unless it's empty.
  if (basicLength) {
    output.push(delimiter);
  }

  // Main encoding loop:
  while (handledCPCount < inputLength) {
    // All non-basic code points < n have been handled already. Find the next larger one:
    var m = maxInt;
    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue >= n && currentValue < m) {
        m = currentValue;
      }
    }

    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
    var handledCPCountPlusOne = handledCPCount + 1;
    if (m - n > floor$1((maxInt - delta) / handledCPCountPlusOne)) {
      throw RangeError(OVERFLOW_ERROR);
    }

    delta += (m - n) * handledCPCountPlusOne;
    n = m;

    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue < n && ++delta > maxInt) {
        throw RangeError(OVERFLOW_ERROR);
      }
      if (currentValue == n) {
        // Represent delta as a generalized variable-length integer.
        var q = delta;
        for (var k = base; /* no condition */; k += base) {
          var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
          if (q < t) break;
          var qMinusT = q - t;
          var baseMinusT = base - t;
          output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
          q = floor$1(qMinusT / baseMinusT);
        }

        output.push(stringFromCharCode(digitToBasic(q)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
        delta = 0;
        ++handledCPCount;
      }
    }

    ++delta;
    ++n;
  }
  return output.join('');
};

var stringPunycodeToAscii = function (input) {
  var encoded = [];
  var labels = input.toLowerCase().replace(regexSeparators, '\u002E').split('.');
  var i, label;
  for (i = 0; i < labels.length; i++) {
    label = labels[i];
    encoded.push(regexNonASCII.test(label) ? 'xn--' + encode(label) : label);
  }
  return encoded.join('.');
};

var getIterator = function (it) {
  var iteratorMethod = getIteratorMethod(it);
  if (typeof iteratorMethod != 'function') {
    throw TypeError(String(it) + ' is not iterable');
  } return anObject(iteratorMethod.call(it));
};

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`





















var $fetch = getBuiltIn('fetch');
var Headers = getBuiltIn('Headers');
var ITERATOR = wellKnownSymbol('iterator');
var URL_SEARCH_PARAMS = 'URLSearchParams';
var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
var setInternalState$1 = internalState.set;
var getInternalParamsState = internalState.getterFor(URL_SEARCH_PARAMS);
var getInternalIteratorState = internalState.getterFor(URL_SEARCH_PARAMS_ITERATOR);

var plus = /\+/g;
var sequences = Array(4);

var percentSequence = function (bytes) {
  return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
};

var percentDecode = function (sequence) {
  try {
    return decodeURIComponent(sequence);
  } catch (error) {
    return sequence;
  }
};

var deserialize = function (it) {
  var result = it.replace(plus, ' ');
  var bytes = 4;
  try {
    return decodeURIComponent(result);
  } catch (error) {
    while (bytes) {
      result = result.replace(percentSequence(bytes--), percentDecode);
    }
    return result;
  }
};

var find = /[!'()~]|%20/g;

var replace = {
  '!': '%21',
  "'": '%27',
  '(': '%28',
  ')': '%29',
  '~': '%7E',
  '%20': '+'
};

var replacer = function (match) {
  return replace[match];
};

var serialize = function (it) {
  return encodeURIComponent(it).replace(find, replacer);
};

var parseSearchParams = function (result, query) {
  if (query) {
    var attributes = query.split('&');
    var index = 0;
    var attribute, entry;
    while (index < attributes.length) {
      attribute = attributes[index++];
      if (attribute.length) {
        entry = attribute.split('=');
        result.push({
          key: deserialize(entry.shift()),
          value: deserialize(entry.join('='))
        });
      }
    }
  }
};

var updateSearchParams = function (query) {
  this.entries.length = 0;
  parseSearchParams(this.entries, query);
};

var validateArgumentsLength = function (passed, required) {
  if (passed < required) throw TypeError('Not enough arguments');
};

var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
  setInternalState$1(this, {
    type: URL_SEARCH_PARAMS_ITERATOR,
    iterator: getIterator(getInternalParamsState(params).entries),
    kind: kind
  });
}, 'Iterator', function next() {
  var state = getInternalIteratorState(this);
  var kind = state.kind;
  var step = state.iterator.next();
  var entry = step.value;
  if (!step.done) {
    step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
  } return step;
});

// `URLSearchParams` constructor
// https://url.spec.whatwg.org/#interface-urlsearchparams
var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
  anInstance(this, URLSearchParamsConstructor, URL_SEARCH_PARAMS);
  var init = arguments.length > 0 ? arguments[0] : undefined;
  var that = this;
  var entries = [];
  var iteratorMethod, iterator, next, step, entryIterator, entryNext, first, second, key;

  setInternalState$1(that, {
    type: URL_SEARCH_PARAMS,
    entries: entries,
    updateURL: function () { /* empty */ },
    updateSearchParams: updateSearchParams
  });

  if (init !== undefined) {
    if (isObject(init)) {
      iteratorMethod = getIteratorMethod(init);
      if (typeof iteratorMethod === 'function') {
        iterator = iteratorMethod.call(init);
        next = iterator.next;
        while (!(step = next.call(iterator)).done) {
          entryIterator = getIterator(anObject(step.value));
          entryNext = entryIterator.next;
          if (
            (first = entryNext.call(entryIterator)).done ||
            (second = entryNext.call(entryIterator)).done ||
            !entryNext.call(entryIterator).done
          ) throw TypeError('Expected sequence with length 2');
          entries.push({ key: first.value + '', value: second.value + '' });
        }
      } else for (key in init) if (has$1(init, key)) entries.push({ key: key, value: init[key] + '' });
    } else {
      parseSearchParams(entries, typeof init === 'string' ? init.charAt(0) === '?' ? init.slice(1) : init : init + '');
    }
  }
};

var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

redefineAll(URLSearchParamsPrototype, {
  // `URLSearchParams.prototype.append` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-append
  append: function append(name, value) {
    validateArgumentsLength(arguments.length, 2);
    var state = getInternalParamsState(this);
    state.entries.push({ key: name + '', value: value + '' });
    state.updateURL();
  },
  // `URLSearchParams.prototype.delete` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
  'delete': function (name) {
    validateArgumentsLength(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var key = name + '';
    var index = 0;
    while (index < entries.length) {
      if (entries[index].key === key) entries.splice(index, 1);
      else index++;
    }
    state.updateURL();
  },
  // `URLSearchParams.prototype.get` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
  get: function get(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) return entries[index].value;
    }
    return null;
  },
  // `URLSearchParams.prototype.getAll` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
  getAll: function getAll(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var result = [];
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) result.push(entries[index].value);
    }
    return result;
  },
  // `URLSearchParams.prototype.has` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
  has: function has(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var index = 0;
    while (index < entries.length) {
      if (entries[index++].key === key) return true;
    }
    return false;
  },
  // `URLSearchParams.prototype.set` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-set
  set: function set(name, value) {
    validateArgumentsLength(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var found = false;
    var key = name + '';
    var val = value + '';
    var index = 0;
    var entry;
    for (; index < entries.length; index++) {
      entry = entries[index];
      if (entry.key === key) {
        if (found) entries.splice(index--, 1);
        else {
          found = true;
          entry.value = val;
        }
      }
    }
    if (!found) entries.push({ key: key, value: val });
    state.updateURL();
  },
  // `URLSearchParams.prototype.sort` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
  sort: function sort() {
    var state = getInternalParamsState(this);
    var entries = state.entries;
    // Array#sort is not stable in some engines
    var slice = entries.slice();
    var entry, entriesIndex, sliceIndex;
    entries.length = 0;
    for (sliceIndex = 0; sliceIndex < slice.length; sliceIndex++) {
      entry = slice[sliceIndex];
      for (entriesIndex = 0; entriesIndex < sliceIndex; entriesIndex++) {
        if (entries[entriesIndex].key > entry.key) {
          entries.splice(entriesIndex, 0, entry);
          break;
        }
      }
      if (entriesIndex === sliceIndex) entries.push(entry);
    }
    state.updateURL();
  },
  // `URLSearchParams.prototype.forEach` method
  forEach: function forEach(callback /* , thisArg */) {
    var entries = getInternalParamsState(this).entries;
    var boundFunction = functionBindContext(callback, arguments.length > 1 ? arguments[1] : undefined, 3);
    var index = 0;
    var entry;
    while (index < entries.length) {
      entry = entries[index++];
      boundFunction(entry.value, entry.key, this);
    }
  },
  // `URLSearchParams.prototype.keys` method
  keys: function keys() {
    return new URLSearchParamsIterator(this, 'keys');
  },
  // `URLSearchParams.prototype.values` method
  values: function values() {
    return new URLSearchParamsIterator(this, 'values');
  },
  // `URLSearchParams.prototype.entries` method
  entries: function entries() {
    return new URLSearchParamsIterator(this, 'entries');
  }
}, { enumerable: true });

// `URLSearchParams.prototype[@@iterator]` method
redefine(URLSearchParamsPrototype, ITERATOR, URLSearchParamsPrototype.entries);

// `URLSearchParams.prototype.toString` method
// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
redefine(URLSearchParamsPrototype, 'toString', function toString() {
  var entries = getInternalParamsState(this).entries;
  var result = [];
  var index = 0;
  var entry;
  while (index < entries.length) {
    entry = entries[index++];
    result.push(serialize(entry.key) + '=' + serialize(entry.value));
  } return result.join('&');
}, { enumerable: true });

setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

_export({ global: true, forced: !nativeUrl }, {
  URLSearchParams: URLSearchParamsConstructor
});

// Wrap `fetch` for correct work with polyfilled `URLSearchParams`
// https://github.com/zloirock/core-js/issues/674
if (!nativeUrl && typeof $fetch == 'function' && typeof Headers == 'function') {
  _export({ global: true, enumerable: true, forced: true }, {
    fetch: function fetch(input /* , init */) {
      var args = [input];
      var init, body, headers;
      if (arguments.length > 1) {
        init = arguments[1];
        if (isObject(init)) {
          body = init.body;
          if (classof(body) === URL_SEARCH_PARAMS) {
            headers = init.headers ? new Headers(init.headers) : new Headers();
            if (!headers.has('content-type')) {
              headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
            }
            init = objectCreate(init, {
              body: createPropertyDescriptor(0, String(body)),
              headers: createPropertyDescriptor(0, headers)
            });
          }
        }
        args.push(init);
      } return $fetch.apply(this, args);
    }
  });
}

var web_urlSearchParams = {
  URLSearchParams: URLSearchParamsConstructor,
  getState: getInternalParamsState
};

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`











var codeAt = stringMultibyte.codeAt;





var NativeURL = global_1.URL;
var URLSearchParams$1 = web_urlSearchParams.URLSearchParams;
var getInternalSearchParamsState = web_urlSearchParams.getState;
var setInternalState = internalState.set;
var getInternalURLState = internalState.getterFor('URL');
var floor = Math.floor;
var pow = Math.pow;

var INVALID_AUTHORITY = 'Invalid authority';
var INVALID_SCHEME = 'Invalid scheme';
var INVALID_HOST = 'Invalid host';
var INVALID_PORT = 'Invalid port';

var ALPHA = /[A-Za-z]/;
var ALPHANUMERIC = /[\d+-.A-Za-z]/;
var DIGIT = /\d/;
var HEX_START = /^(0x|0X)/;
var OCT = /^[0-7]+$/;
var DEC = /^\d+$/;
var HEX = /^[\dA-Fa-f]+$/;
/* eslint-disable no-control-regex -- safe */
var FORBIDDEN_HOST_CODE_POINT = /[\u0000\t\u000A\u000D #%/:?@[\\]]/;
var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\u0000\t\u000A\u000D #/:?@[\\]]/;
var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g;
var TAB_AND_NEW_LINE = /[\t\u000A\u000D]/g;
/* eslint-enable no-control-regex -- safe */
var EOF;

var parseHost = function (url, input) {
  var result, codePoints, index;
  if (input.charAt(0) == '[') {
    if (input.charAt(input.length - 1) != ']') return INVALID_HOST;
    result = parseIPv6(input.slice(1, -1));
    if (!result) return INVALID_HOST;
    url.host = result;
  // opaque host
  } else if (!isSpecial(url)) {
    if (FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT.test(input)) return INVALID_HOST;
    result = '';
    codePoints = arrayFrom(input);
    for (index = 0; index < codePoints.length; index++) {
      result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
    }
    url.host = result;
  } else {
    input = stringPunycodeToAscii(input);
    if (FORBIDDEN_HOST_CODE_POINT.test(input)) return INVALID_HOST;
    result = parseIPv4(input);
    if (result === null) return INVALID_HOST;
    url.host = result;
  }
};

var parseIPv4 = function (input) {
  var parts = input.split('.');
  var partsLength, numbers, index, part, radix, number, ipv4;
  if (parts.length && parts[parts.length - 1] == '') {
    parts.pop();
  }
  partsLength = parts.length;
  if (partsLength > 4) return input;
  numbers = [];
  for (index = 0; index < partsLength; index++) {
    part = parts[index];
    if (part == '') return input;
    radix = 10;
    if (part.length > 1 && part.charAt(0) == '0') {
      radix = HEX_START.test(part) ? 16 : 8;
      part = part.slice(radix == 8 ? 1 : 2);
    }
    if (part === '') {
      number = 0;
    } else {
      if (!(radix == 10 ? DEC : radix == 8 ? OCT : HEX).test(part)) return input;
      number = parseInt(part, radix);
    }
    numbers.push(number);
  }
  for (index = 0; index < partsLength; index++) {
    number = numbers[index];
    if (index == partsLength - 1) {
      if (number >= pow(256, 5 - partsLength)) return null;
    } else if (number > 255) return null;
  }
  ipv4 = numbers.pop();
  for (index = 0; index < numbers.length; index++) {
    ipv4 += numbers[index] * pow(256, 3 - index);
  }
  return ipv4;
};

// eslint-disable-next-line max-statements -- TODO
var parseIPv6 = function (input) {
  var address = [0, 0, 0, 0, 0, 0, 0, 0];
  var pieceIndex = 0;
  var compress = null;
  var pointer = 0;
  var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

  var char = function () {
    return input.charAt(pointer);
  };

  if (char() == ':') {
    if (input.charAt(1) != ':') return;
    pointer += 2;
    pieceIndex++;
    compress = pieceIndex;
  }
  while (char()) {
    if (pieceIndex == 8) return;
    if (char() == ':') {
      if (compress !== null) return;
      pointer++;
      pieceIndex++;
      compress = pieceIndex;
      continue;
    }
    value = length = 0;
    while (length < 4 && HEX.test(char())) {
      value = value * 16 + parseInt(char(), 16);
      pointer++;
      length++;
    }
    if (char() == '.') {
      if (length == 0) return;
      pointer -= length;
      if (pieceIndex > 6) return;
      numbersSeen = 0;
      while (char()) {
        ipv4Piece = null;
        if (numbersSeen > 0) {
          if (char() == '.' && numbersSeen < 4) pointer++;
          else return;
        }
        if (!DIGIT.test(char())) return;
        while (DIGIT.test(char())) {
          number = parseInt(char(), 10);
          if (ipv4Piece === null) ipv4Piece = number;
          else if (ipv4Piece == 0) return;
          else ipv4Piece = ipv4Piece * 10 + number;
          if (ipv4Piece > 255) return;
          pointer++;
        }
        address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
        numbersSeen++;
        if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
      }
      if (numbersSeen != 4) return;
      break;
    } else if (char() == ':') {
      pointer++;
      if (!char()) return;
    } else if (char()) return;
    address[pieceIndex++] = value;
  }
  if (compress !== null) {
    swaps = pieceIndex - compress;
    pieceIndex = 7;
    while (pieceIndex != 0 && swaps > 0) {
      swap = address[pieceIndex];
      address[pieceIndex--] = address[compress + swaps - 1];
      address[compress + --swaps] = swap;
    }
  } else if (pieceIndex != 8) return;
  return address;
};

var findLongestZeroSequence = function (ipv6) {
  var maxIndex = null;
  var maxLength = 1;
  var currStart = null;
  var currLength = 0;
  var index = 0;
  for (; index < 8; index++) {
    if (ipv6[index] !== 0) {
      if (currLength > maxLength) {
        maxIndex = currStart;
        maxLength = currLength;
      }
      currStart = null;
      currLength = 0;
    } else {
      if (currStart === null) currStart = index;
      ++currLength;
    }
  }
  if (currLength > maxLength) {
    maxIndex = currStart;
    maxLength = currLength;
  }
  return maxIndex;
};

var serializeHost = function (host) {
  var result, index, compress, ignore0;
  // ipv4
  if (typeof host == 'number') {
    result = [];
    for (index = 0; index < 4; index++) {
      result.unshift(host % 256);
      host = floor(host / 256);
    } return result.join('.');
  // ipv6
  } else if (typeof host == 'object') {
    result = '';
    compress = findLongestZeroSequence(host);
    for (index = 0; index < 8; index++) {
      if (ignore0 && host[index] === 0) continue;
      if (ignore0) ignore0 = false;
      if (compress === index) {
        result += index ? ':' : '::';
        ignore0 = true;
      } else {
        result += host[index].toString(16);
        if (index < 7) result += ':';
      }
    }
    return '[' + result + ']';
  } return host;
};

var C0ControlPercentEncodeSet = {};
var fragmentPercentEncodeSet = objectAssign({}, C0ControlPercentEncodeSet, {
  ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
});
var pathPercentEncodeSet = objectAssign({}, fragmentPercentEncodeSet, {
  '#': 1, '?': 1, '{': 1, '}': 1
});
var userinfoPercentEncodeSet = objectAssign({}, pathPercentEncodeSet, {
  '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
});

var percentEncode = function (char, set) {
  var code = codeAt(char, 0);
  return code > 0x20 && code < 0x7F && !has$1(set, char) ? char : encodeURIComponent(char);
};

var specialSchemes = {
  ftp: 21,
  file: null,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
};

var isSpecial = function (url) {
  return has$1(specialSchemes, url.scheme);
};

var includesCredentials = function (url) {
  return url.username != '' || url.password != '';
};

var cannotHaveUsernamePasswordPort = function (url) {
  return !url.host || url.cannotBeABaseURL || url.scheme == 'file';
};

var isWindowsDriveLetter = function (string, normalized) {
  var second;
  return string.length == 2 && ALPHA.test(string.charAt(0))
    && ((second = string.charAt(1)) == ':' || (!normalized && second == '|'));
};

var startsWithWindowsDriveLetter = function (string) {
  var third;
  return string.length > 1 && isWindowsDriveLetter(string.slice(0, 2)) && (
    string.length == 2 ||
    ((third = string.charAt(2)) === '/' || third === '\\' || third === '?' || third === '#')
  );
};

var shortenURLsPath = function (url) {
  var path = url.path;
  var pathSize = path.length;
  if (pathSize && (url.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
    path.pop();
  }
};

var isSingleDot = function (segment) {
  return segment === '.' || segment.toLowerCase() === '%2e';
};

var isDoubleDot = function (segment) {
  segment = segment.toLowerCase();
  return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
};

// States:
var SCHEME_START = {};
var SCHEME = {};
var NO_SCHEME = {};
var SPECIAL_RELATIVE_OR_AUTHORITY = {};
var PATH_OR_AUTHORITY = {};
var RELATIVE = {};
var RELATIVE_SLASH = {};
var SPECIAL_AUTHORITY_SLASHES = {};
var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
var AUTHORITY = {};
var HOST = {};
var HOSTNAME = {};
var PORT = {};
var FILE = {};
var FILE_SLASH = {};
var FILE_HOST = {};
var PATH_START = {};
var PATH = {};
var CANNOT_BE_A_BASE_URL_PATH = {};
var QUERY = {};
var FRAGMENT = {};

// eslint-disable-next-line max-statements -- TODO
var parseURL = function (url, input, stateOverride, base) {
  var state = stateOverride || SCHEME_START;
  var pointer = 0;
  var buffer = '';
  var seenAt = false;
  var seenBracket = false;
  var seenPasswordToken = false;
  var codePoints, char, bufferCodePoints, failure;

  if (!stateOverride) {
    url.scheme = '';
    url.username = '';
    url.password = '';
    url.host = null;
    url.port = null;
    url.path = [];
    url.query = null;
    url.fragment = null;
    url.cannotBeABaseURL = false;
    input = input.replace(LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE, '');
  }

  input = input.replace(TAB_AND_NEW_LINE, '');

  codePoints = arrayFrom(input);

  while (pointer <= codePoints.length) {
    char = codePoints[pointer];
    switch (state) {
      case SCHEME_START:
        if (char && ALPHA.test(char)) {
          buffer += char.toLowerCase();
          state = SCHEME;
        } else if (!stateOverride) {
          state = NO_SCHEME;
          continue;
        } else return INVALID_SCHEME;
        break;

      case SCHEME:
        if (char && (ALPHANUMERIC.test(char) || char == '+' || char == '-' || char == '.')) {
          buffer += char.toLowerCase();
        } else if (char == ':') {
          if (stateOverride && (
            (isSpecial(url) != has$1(specialSchemes, buffer)) ||
            (buffer == 'file' && (includesCredentials(url) || url.port !== null)) ||
            (url.scheme == 'file' && !url.host)
          )) return;
          url.scheme = buffer;
          if (stateOverride) {
            if (isSpecial(url) && specialSchemes[url.scheme] == url.port) url.port = null;
            return;
          }
          buffer = '';
          if (url.scheme == 'file') {
            state = FILE;
          } else if (isSpecial(url) && base && base.scheme == url.scheme) {
            state = SPECIAL_RELATIVE_OR_AUTHORITY;
          } else if (isSpecial(url)) {
            state = SPECIAL_AUTHORITY_SLASHES;
          } else if (codePoints[pointer + 1] == '/') {
            state = PATH_OR_AUTHORITY;
            pointer++;
          } else {
            url.cannotBeABaseURL = true;
            url.path.push('');
            state = CANNOT_BE_A_BASE_URL_PATH;
          }
        } else if (!stateOverride) {
          buffer = '';
          state = NO_SCHEME;
          pointer = 0;
          continue;
        } else return INVALID_SCHEME;
        break;

      case NO_SCHEME:
        if (!base || (base.cannotBeABaseURL && char != '#')) return INVALID_SCHEME;
        if (base.cannotBeABaseURL && char == '#') {
          url.scheme = base.scheme;
          url.path = base.path.slice();
          url.query = base.query;
          url.fragment = '';
          url.cannotBeABaseURL = true;
          state = FRAGMENT;
          break;
        }
        state = base.scheme == 'file' ? FILE : RELATIVE;
        continue;

      case SPECIAL_RELATIVE_OR_AUTHORITY:
        if (char == '/' && codePoints[pointer + 1] == '/') {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          pointer++;
        } else {
          state = RELATIVE;
          continue;
        } break;

      case PATH_OR_AUTHORITY:
        if (char == '/') {
          state = AUTHORITY;
          break;
        } else {
          state = PATH;
          continue;
        }

      case RELATIVE:
        url.scheme = base.scheme;
        if (char == EOF) {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = base.query;
        } else if (char == '/' || (char == '\\' && isSpecial(url))) {
          state = RELATIVE_SLASH;
        } else if (char == '?') {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = '';
          state = QUERY;
        } else if (char == '#') {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = base.query;
          url.fragment = '';
          state = FRAGMENT;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.path.pop();
          state = PATH;
          continue;
        } break;

      case RELATIVE_SLASH:
        if (isSpecial(url) && (char == '/' || char == '\\')) {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
        } else if (char == '/') {
          state = AUTHORITY;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          state = PATH;
          continue;
        } break;

      case SPECIAL_AUTHORITY_SLASHES:
        state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
        if (char != '/' || buffer.charAt(pointer + 1) != '/') continue;
        pointer++;
        break;

      case SPECIAL_AUTHORITY_IGNORE_SLASHES:
        if (char != '/' && char != '\\') {
          state = AUTHORITY;
          continue;
        } break;

      case AUTHORITY:
        if (char == '@') {
          if (seenAt) buffer = '%40' + buffer;
          seenAt = true;
          bufferCodePoints = arrayFrom(buffer);
          for (var i = 0; i < bufferCodePoints.length; i++) {
            var codePoint = bufferCodePoints[i];
            if (codePoint == ':' && !seenPasswordToken) {
              seenPasswordToken = true;
              continue;
            }
            var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
            if (seenPasswordToken) url.password += encodedCodePoints;
            else url.username += encodedCodePoints;
          }
          buffer = '';
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url))
        ) {
          if (seenAt && buffer == '') return INVALID_AUTHORITY;
          pointer -= arrayFrom(buffer).length + 1;
          buffer = '';
          state = HOST;
        } else buffer += char;
        break;

      case HOST:
      case HOSTNAME:
        if (stateOverride && url.scheme == 'file') {
          state = FILE_HOST;
          continue;
        } else if (char == ':' && !seenBracket) {
          if (buffer == '') return INVALID_HOST;
          failure = parseHost(url, buffer);
          if (failure) return failure;
          buffer = '';
          state = PORT;
          if (stateOverride == HOSTNAME) return;
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url))
        ) {
          if (isSpecial(url) && buffer == '') return INVALID_HOST;
          if (stateOverride && buffer == '' && (includesCredentials(url) || url.port !== null)) return;
          failure = parseHost(url, buffer);
          if (failure) return failure;
          buffer = '';
          state = PATH_START;
          if (stateOverride) return;
          continue;
        } else {
          if (char == '[') seenBracket = true;
          else if (char == ']') seenBracket = false;
          buffer += char;
        } break;

      case PORT:
        if (DIGIT.test(char)) {
          buffer += char;
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url)) ||
          stateOverride
        ) {
          if (buffer != '') {
            var port = parseInt(buffer, 10);
            if (port > 0xFFFF) return INVALID_PORT;
            url.port = (isSpecial(url) && port === specialSchemes[url.scheme]) ? null : port;
            buffer = '';
          }
          if (stateOverride) return;
          state = PATH_START;
          continue;
        } else return INVALID_PORT;
        break;

      case FILE:
        url.scheme = 'file';
        if (char == '/' || char == '\\') state = FILE_SLASH;
        else if (base && base.scheme == 'file') {
          if (char == EOF) {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = base.query;
          } else if (char == '?') {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = base.query;
            url.fragment = '';
            state = FRAGMENT;
          } else {
            if (!startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
              url.host = base.host;
              url.path = base.path.slice();
              shortenURLsPath(url);
            }
            state = PATH;
            continue;
          }
        } else {
          state = PATH;
          continue;
        } break;

      case FILE_SLASH:
        if (char == '/' || char == '\\') {
          state = FILE_HOST;
          break;
        }
        if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
          if (isWindowsDriveLetter(base.path[0], true)) url.path.push(base.path[0]);
          else url.host = base.host;
        }
        state = PATH;
        continue;

      case FILE_HOST:
        if (char == EOF || char == '/' || char == '\\' || char == '?' || char == '#') {
          if (!stateOverride && isWindowsDriveLetter(buffer)) {
            state = PATH;
          } else if (buffer == '') {
            url.host = '';
            if (stateOverride) return;
            state = PATH_START;
          } else {
            failure = parseHost(url, buffer);
            if (failure) return failure;
            if (url.host == 'localhost') url.host = '';
            if (stateOverride) return;
            buffer = '';
            state = PATH_START;
          } continue;
        } else buffer += char;
        break;

      case PATH_START:
        if (isSpecial(url)) {
          state = PATH;
          if (char != '/' && char != '\\') continue;
        } else if (!stateOverride && char == '?') {
          url.query = '';
          state = QUERY;
        } else if (!stateOverride && char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          state = PATH;
          if (char != '/') continue;
        } break;

      case PATH:
        if (
          char == EOF || char == '/' ||
          (char == '\\' && isSpecial(url)) ||
          (!stateOverride && (char == '?' || char == '#'))
        ) {
          if (isDoubleDot(buffer)) {
            shortenURLsPath(url);
            if (char != '/' && !(char == '\\' && isSpecial(url))) {
              url.path.push('');
            }
          } else if (isSingleDot(buffer)) {
            if (char != '/' && !(char == '\\' && isSpecial(url))) {
              url.path.push('');
            }
          } else {
            if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
              if (url.host) url.host = '';
              buffer = buffer.charAt(0) + ':'; // normalize windows drive letter
            }
            url.path.push(buffer);
          }
          buffer = '';
          if (url.scheme == 'file' && (char == EOF || char == '?' || char == '#')) {
            while (url.path.length > 1 && url.path[0] === '') {
              url.path.shift();
            }
          }
          if (char == '?') {
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.fragment = '';
            state = FRAGMENT;
          }
        } else {
          buffer += percentEncode(char, pathPercentEncodeSet);
        } break;

      case CANNOT_BE_A_BASE_URL_PATH:
        if (char == '?') {
          url.query = '';
          state = QUERY;
        } else if (char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          url.path[0] += percentEncode(char, C0ControlPercentEncodeSet);
        } break;

      case QUERY:
        if (!stateOverride && char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          if (char == "'" && isSpecial(url)) url.query += '%27';
          else if (char == '#') url.query += '%23';
          else url.query += percentEncode(char, C0ControlPercentEncodeSet);
        } break;

      case FRAGMENT:
        if (char != EOF) url.fragment += percentEncode(char, fragmentPercentEncodeSet);
        break;
    }

    pointer++;
  }
};

// `URL` constructor
// https://url.spec.whatwg.org/#url-class
var URLConstructor = function URL(url /* , base */) {
  var that = anInstance(this, URLConstructor, 'URL');
  var base = arguments.length > 1 ? arguments[1] : undefined;
  var urlString = String(url);
  var state = setInternalState(that, { type: 'URL' });
  var baseState, failure;
  if (base !== undefined) {
    if (base instanceof URLConstructor) baseState = getInternalURLState(base);
    else {
      failure = parseURL(baseState = {}, String(base));
      if (failure) throw TypeError(failure);
    }
  }
  failure = parseURL(state, urlString, null, baseState);
  if (failure) throw TypeError(failure);
  var searchParams = state.searchParams = new URLSearchParams$1();
  var searchParamsState = getInternalSearchParamsState(searchParams);
  searchParamsState.updateSearchParams(state.query);
  searchParamsState.updateURL = function () {
    state.query = String(searchParams) || null;
  };
  if (!descriptors) {
    that.href = serializeURL.call(that);
    that.origin = getOrigin.call(that);
    that.protocol = getProtocol.call(that);
    that.username = getUsername.call(that);
    that.password = getPassword.call(that);
    that.host = getHost.call(that);
    that.hostname = getHostname.call(that);
    that.port = getPort.call(that);
    that.pathname = getPathname.call(that);
    that.search = getSearch.call(that);
    that.searchParams = getSearchParams.call(that);
    that.hash = getHash.call(that);
  }
};

var URLPrototype = URLConstructor.prototype;

var serializeURL = function () {
  var url = getInternalURLState(this);
  var scheme = url.scheme;
  var username = url.username;
  var password = url.password;
  var host = url.host;
  var port = url.port;
  var path = url.path;
  var query = url.query;
  var fragment = url.fragment;
  var output = scheme + ':';
  if (host !== null) {
    output += '//';
    if (includesCredentials(url)) {
      output += username + (password ? ':' + password : '') + '@';
    }
    output += serializeHost(host);
    if (port !== null) output += ':' + port;
  } else if (scheme == 'file') output += '//';
  output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
  if (query !== null) output += '?' + query;
  if (fragment !== null) output += '#' + fragment;
  return output;
};

var getOrigin = function () {
  var url = getInternalURLState(this);
  var scheme = url.scheme;
  var port = url.port;
  if (scheme == 'blob') try {
    return new URL(scheme.path[0]).origin;
  } catch (error) {
    return 'null';
  }
  if (scheme == 'file' || !isSpecial(url)) return 'null';
  return scheme + '://' + serializeHost(url.host) + (port !== null ? ':' + port : '');
};

var getProtocol = function () {
  return getInternalURLState(this).scheme + ':';
};

var getUsername = function () {
  return getInternalURLState(this).username;
};

var getPassword = function () {
  return getInternalURLState(this).password;
};

var getHost = function () {
  var url = getInternalURLState(this);
  var host = url.host;
  var port = url.port;
  return host === null ? ''
    : port === null ? serializeHost(host)
    : serializeHost(host) + ':' + port;
};

var getHostname = function () {
  var host = getInternalURLState(this).host;
  return host === null ? '' : serializeHost(host);
};

var getPort = function () {
  var port = getInternalURLState(this).port;
  return port === null ? '' : String(port);
};

var getPathname = function () {
  var url = getInternalURLState(this);
  var path = url.path;
  return url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
};

var getSearch = function () {
  var query = getInternalURLState(this).query;
  return query ? '?' + query : '';
};

var getSearchParams = function () {
  return getInternalURLState(this).searchParams;
};

var getHash = function () {
  var fragment = getInternalURLState(this).fragment;
  return fragment ? '#' + fragment : '';
};

var accessorDescriptor = function (getter, setter) {
  return { get: getter, set: setter, configurable: true, enumerable: true };
};

if (descriptors) {
  objectDefineProperties(URLPrototype, {
    // `URL.prototype.href` accessors pair
    // https://url.spec.whatwg.org/#dom-url-href
    href: accessorDescriptor(serializeURL, function (href) {
      var url = getInternalURLState(this);
      var urlString = String(href);
      var failure = parseURL(url, urlString);
      if (failure) throw TypeError(failure);
      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
    }),
    // `URL.prototype.origin` getter
    // https://url.spec.whatwg.org/#dom-url-origin
    origin: accessorDescriptor(getOrigin),
    // `URL.prototype.protocol` accessors pair
    // https://url.spec.whatwg.org/#dom-url-protocol
    protocol: accessorDescriptor(getProtocol, function (protocol) {
      var url = getInternalURLState(this);
      parseURL(url, String(protocol) + ':', SCHEME_START);
    }),
    // `URL.prototype.username` accessors pair
    // https://url.spec.whatwg.org/#dom-url-username
    username: accessorDescriptor(getUsername, function (username) {
      var url = getInternalURLState(this);
      var codePoints = arrayFrom(String(username));
      if (cannotHaveUsernamePasswordPort(url)) return;
      url.username = '';
      for (var i = 0; i < codePoints.length; i++) {
        url.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    }),
    // `URL.prototype.password` accessors pair
    // https://url.spec.whatwg.org/#dom-url-password
    password: accessorDescriptor(getPassword, function (password) {
      var url = getInternalURLState(this);
      var codePoints = arrayFrom(String(password));
      if (cannotHaveUsernamePasswordPort(url)) return;
      url.password = '';
      for (var i = 0; i < codePoints.length; i++) {
        url.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    }),
    // `URL.prototype.host` accessors pair
    // https://url.spec.whatwg.org/#dom-url-host
    host: accessorDescriptor(getHost, function (host) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      parseURL(url, String(host), HOST);
    }),
    // `URL.prototype.hostname` accessors pair
    // https://url.spec.whatwg.org/#dom-url-hostname
    hostname: accessorDescriptor(getHostname, function (hostname) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      parseURL(url, String(hostname), HOSTNAME);
    }),
    // `URL.prototype.port` accessors pair
    // https://url.spec.whatwg.org/#dom-url-port
    port: accessorDescriptor(getPort, function (port) {
      var url = getInternalURLState(this);
      if (cannotHaveUsernamePasswordPort(url)) return;
      port = String(port);
      if (port == '') url.port = null;
      else parseURL(url, port, PORT);
    }),
    // `URL.prototype.pathname` accessors pair
    // https://url.spec.whatwg.org/#dom-url-pathname
    pathname: accessorDescriptor(getPathname, function (pathname) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      url.path = [];
      parseURL(url, pathname + '', PATH_START);
    }),
    // `URL.prototype.search` accessors pair
    // https://url.spec.whatwg.org/#dom-url-search
    search: accessorDescriptor(getSearch, function (search) {
      var url = getInternalURLState(this);
      search = String(search);
      if (search == '') {
        url.query = null;
      } else {
        if ('?' == search.charAt(0)) search = search.slice(1);
        url.query = '';
        parseURL(url, search, QUERY);
      }
      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
    }),
    // `URL.prototype.searchParams` getter
    // https://url.spec.whatwg.org/#dom-url-searchparams
    searchParams: accessorDescriptor(getSearchParams),
    // `URL.prototype.hash` accessors pair
    // https://url.spec.whatwg.org/#dom-url-hash
    hash: accessorDescriptor(getHash, function (hash) {
      var url = getInternalURLState(this);
      hash = String(hash);
      if (hash == '') {
        url.fragment = null;
        return;
      }
      if ('#' == hash.charAt(0)) hash = hash.slice(1);
      url.fragment = '';
      parseURL(url, hash, FRAGMENT);
    })
  });
}

// `URL.prototype.toJSON` method
// https://url.spec.whatwg.org/#dom-url-tojson
redefine(URLPrototype, 'toJSON', function toJSON() {
  return serializeURL.call(this);
}, { enumerable: true });

// `URL.prototype.toString` method
// https://url.spec.whatwg.org/#URL-stringification-behavior
redefine(URLPrototype, 'toString', function toString() {
  return serializeURL.call(this);
}, { enumerable: true });

if (NativeURL) {
  var nativeCreateObjectURL = NativeURL.createObjectURL;
  var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
  // `URL.createObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  if (nativeCreateObjectURL) redefine(URLConstructor, 'createObjectURL', function createObjectURL(blob) {
    return nativeCreateObjectURL.apply(NativeURL, arguments);
  });
  // `URL.revokeObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  if (nativeRevokeObjectURL) redefine(URLConstructor, 'revokeObjectURL', function revokeObjectURL(url) {
    return nativeRevokeObjectURL.apply(NativeURL, arguments);
  });
}

setToStringTag(URLConstructor, 'URL');

_export({ global: true, forced: !nativeUrl, sham: !descriptors }, {
  URL: URLConstructor
});

// `URL.prototype.toJSON` method
// https://url.spec.whatwg.org/#dom-url-tojson
_export({ target: 'URL', proto: true, enumerable: true }, {
  toJSON: function toJSON() {
    return URL.prototype.toString.call(this);
  }
});

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

/**
@license @nocompile
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
(function(){/*

 Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at
 http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 Google as part of the polymer project is also subject to an additional IP
 rights grant found at http://polymer.github.io/PATENTS.txt
*/
var v;function ba(a){var b=0;return function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}}}var ca="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value);},da="undefined"!=typeof window&&window===this?this:"undefined"!=typeof commonjsGlobal&&null!=commonjsGlobal?commonjsGlobal:this;function ea(){ea=function(){};da.Symbol||(da.Symbol=ha);}
function ia(a,b){this.a=a;ca(this,"description",{configurable:!0,writable:!0,value:b});}ia.prototype.toString=function(){return this.a};var ha=function(){function a(c){if(this instanceof a)throw new TypeError("Symbol is not a constructor");return new ia("jscomp_symbol_"+(c||"")+"_"+b++,c)}var b=0;return a}();
function ja(){ea();var a=da.Symbol.iterator;a||(a=da.Symbol.iterator=da.Symbol("Symbol.iterator"));"function"!=typeof Array.prototype[a]&&ca(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return ma(ba(this))}});ja=function(){};}function ma(a){ja();a={next:a};a[da.Symbol.iterator]=function(){return this};return a}function na(a){var b="undefined"!=typeof Symbol&&Symbol.iterator&&a[Symbol.iterator];return b?b.call(a):{next:ba(a)}}
function x(a){if(!(a instanceof Array)){a=na(a);for(var b,c=[];!(b=a.next()).done;)c.push(b.value);a=c;}return a}var oa;if("function"==typeof Object.setPrototypeOf)oa=Object.setPrototypeOf;else {var pa;a:{var qa={Pa:!0},ra={};try{ra.__proto__=qa;pa=ra.Pa;break a}catch(a){}pa=!1;}oa=pa?function(a,b){a.__proto__=b;if(a.__proto__!==b)throw new TypeError(a+" is not extensible");return a}:null;}var sa=oa;function ta(){this.l=!1;this.b=null;this.Ea=void 0;this.a=1;this.Y=0;this.c=null;}
function ua(a){if(a.l)throw new TypeError("Generator is already running");a.l=!0;}ta.prototype.J=function(a){this.Ea=a;};function xa(a,b){a.c={Sa:b,Wa:!0};a.a=a.Y;}ta.prototype.return=function(a){this.c={return:a};this.a=this.Y;};function Aa(a,b){a.a=3;return {value:b}}function Ba(a){this.a=new ta;this.b=a;}function Ca(a,b){ua(a.a);var c=a.a.b;if(c)return Da(a,"return"in c?c["return"]:function(d){return {value:d,done:!0}},b,a.a.return);a.a.return(b);return Ea(a)}
function Da(a,b,c,d){try{var e=b.call(a.a.b,c);if(!(e instanceof Object))throw new TypeError("Iterator result "+e+" is not an object");if(!e.done)return a.a.l=!1,e;var f=e.value;}catch(g){return a.a.b=null,xa(a.a,g),Ea(a)}a.a.b=null;d.call(a.a,f);return Ea(a)}function Ea(a){for(;a.a.a;)try{var b=a.b(a.a);if(b)return a.a.l=!1,{value:b.value,done:!1}}catch(c){a.a.Ea=void 0,xa(a.a,c);}a.a.l=!1;if(a.a.c){b=a.a.c;a.a.c=null;if(b.Wa)throw b.Sa;return {value:b.return,done:!0}}return {value:void 0,done:!0}}
function Fa(a){this.next=function(b){ua(a.a);a.a.b?b=Da(a,a.a.b.next,b,a.a.J):(a.a.J(b),b=Ea(a));return b};this.throw=function(b){ua(a.a);a.a.b?b=Da(a,a.a.b["throw"],b,a.a.J):(xa(a.a,b),b=Ea(a));return b};this.return=function(b){return Ca(a,b)};ja();this[Symbol.iterator]=function(){return this};}function Ga(a,b){b=new Fa(new Ba(b));sa&&sa(b,a.prototype);return b}Array.from||(Array.from=function(a){return [].slice.call(a)});
Object.assign||(Object.assign=function(a){for(var b=[].slice.call(arguments,1),c=0,d;c<b.length;c++)if(d=b[c])for(var e=a,f=Object.keys(d),g=0;g<f.length;g++){var h=f[g];e[h]=d[h];}return a});var Ha=setTimeout;function Ia(){}function Ja(a,b){return function(){a.apply(b,arguments);}}function A(a){if(!(this instanceof A))throw new TypeError("Promises must be constructed via new");if("function"!==typeof a)throw new TypeError("not a function");this.I=0;this.za=!1;this.C=void 0;this.W=[];Ka(a,this);}
function La(a,b){for(;3===a.I;)a=a.C;0===a.I?a.W.push(b):(a.za=!0,Ma(function(){var c=1===a.I?b.Ya:b.Za;if(null===c)(1===a.I?Na:Oa)(b.va,a.C);else {try{var d=c(a.C);}catch(e){Oa(b.va,e);return}Na(b.va,d);}}));}function Na(a,b){try{if(b===a)throw new TypeError("A promise cannot be resolved with itself.");if(b&&("object"===typeof b||"function"===typeof b)){var c=b.then;if(b instanceof A){a.I=3;a.C=b;Pa(a);return}if("function"===typeof c){Ka(Ja(c,b),a);return}}a.I=1;a.C=b;Pa(a);}catch(d){Oa(a,d);}}
function Oa(a,b){a.I=2;a.C=b;Pa(a);}function Pa(a){2===a.I&&0===a.W.length&&Ma(function(){a.za||"undefined"!==typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",a.C);});for(var b=0,c=a.W.length;b<c;b++)La(a,a.W[b]);a.W=null;}function Qa(a,b,c){this.Ya="function"===typeof a?a:null;this.Za="function"===typeof b?b:null;this.va=c;}function Ka(a,b){var c=!1;try{a(function(d){c||(c=!0,Na(b,d));},function(d){c||(c=!0,Oa(b,d));});}catch(d){c||(c=!0,Oa(b,d));}}
A.prototype["catch"]=function(a){return this.then(null,a)};A.prototype.then=function(a,b){var c=new this.constructor(Ia);La(this,new Qa(a,b,c));return c};A.prototype["finally"]=function(a){var b=this.constructor;return this.then(function(c){return b.resolve(a()).then(function(){return c})},function(c){return b.resolve(a()).then(function(){return b.reject(c)})})};
function Ra(a){return new A(function(b,c){function d(h,k){try{if(k&&("object"===typeof k||"function"===typeof k)){var l=k.then;if("function"===typeof l){l.call(k,function(m){d(h,m);},c);return}}e[h]=k;0===--f&&b(e);}catch(m){c(m);}}if(!a||"undefined"===typeof a.length)return c(new TypeError("Promise.all accepts an array"));var e=Array.prototype.slice.call(a);if(0===e.length)return b([]);for(var f=e.length,g=0;g<e.length;g++)d(g,e[g]);})}
function Sa(a){return a&&"object"===typeof a&&a.constructor===A?a:new A(function(b){b(a);})}function Ta(a){return new A(function(b,c){c(a);})}function Ua(a){return new A(function(b,c){if(!a||"undefined"===typeof a.length)return c(new TypeError("Promise.race accepts an array"));for(var d=0,e=a.length;d<e;d++)Sa(a[d]).then(b,c);})}var Ma="function"===typeof setImmediate&&function(a){setImmediate(a);}||function(a){Ha(a,0);};/*

Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
if(!window.Promise){window.Promise=A;A.prototype.then=A.prototype.then;A.all=Ra;A.race=Ua;A.resolve=Sa;A.reject=Ta;var Va=document.createTextNode(""),Xa=[];(new MutationObserver(function(){for(var a=Xa.length,b=0;b<a;b++)Xa[b]();Xa.splice(0,a);})).observe(Va,{characterData:!0});Ma=function(a){Xa.push(a);Va.textContent=0<Va.textContent.length?"":"a";};}(function(a,b){if(!(b in a)){var c=typeof commonjsGlobal===typeof c?window:commonjsGlobal,d=0,e=""+Math.random(),f="__\u0001symbol@@"+e,g=a.getOwnPropertyNames,h=a.getOwnPropertyDescriptor,k=a.create,l=a.keys,m=a.freeze||a,q=a.defineProperty,H=a.defineProperties,C=h(a,"getOwnPropertyNames"),t=a.prototype,F=t.hasOwnProperty,E=t.propertyIsEnumerable,M=t.toString,y=function(I,u,G){F.call(I,f)||q(I,f,{enumerable:!1,configurable:!1,writable:!1,value:{}});I[f]["@@"+u]=G;},W=function(I,u){var G=k(I);g(u).forEach(function(p){va.call(u,
p)&&Wa(G,p,u[p]);});return G},w=function(){},wa=function(I){return I!=f&&!F.call(ka,I)},fa=function(I){return I!=f&&F.call(ka,I)},va=function(I){var u=""+I;return fa(u)?F.call(this,u)&&this[f]["@@"+u]:E.call(this,I)},n=function(I){q(t,I,{enumerable:!1,configurable:!0,get:w,set:function(u){za(this,I,{enumerable:!1,configurable:!0,writable:!0,value:u});y(this,I,!0);}});return m(ka[I]=q(a(I),"constructor",hc))},J=function G(u){if(this instanceof G)throw new TypeError("Symbol is not a constructor");return n("__\u0001symbol:".concat(u||
"",e,++d))},ka=k(null),hc={value:J},hb=function(u){return ka[u]},Wa=function(u,G,p){var r=""+G;if(fa(r)){G=za;if(p.enumerable){var B=k(p);B.enumerable=!1;}else B=p;G(u,r,B);y(u,r,!!p.enumerable);}else q(u,G,p);return u},ib=function(u){return g(u).filter(fa).map(hb)};C.value=Wa;q(a,"defineProperty",C);C.value=ib;q(a,b,C);C.value=function(u){return g(u).filter(wa)};q(a,"getOwnPropertyNames",C);C.value=function(u,G){var p=ib(G);p.length?l(G).concat(p).forEach(function(r){va.call(G,r)&&Wa(u,r,G[r]);}):H(u,
G);return u};q(a,"defineProperties",C);C.value=va;q(t,"propertyIsEnumerable",C);C.value=J;q(c,"Symbol",C);C.value=function(u){u="__\u0001symbol:".concat("__\u0001symbol:",u,e);return u in t?ka[u]:n(u)};q(J,"for",C);C.value=function(u){if(wa(u))throw new TypeError(u+" is not a symbol");if(F.call(ka,u)&&(u=u.slice(10),"__\u0001symbol:"===u.slice(0,10)&&(u=u.slice(10),u!==e)))return u=u.slice(0,u.length-e.length),0<u.length?u:void 0};q(J,"keyFor",C);C.value=function(u,G){var p=h(u,G);p&&fa(G)&&(p.enumerable=
va.call(u,G));return p};q(a,"getOwnPropertyDescriptor",C);C.value=function(u,G){return 1===arguments.length||"undefined"===typeof G?k(u):W(u,G)};q(a,"create",C);C.value=function(){var u=M.call(this);return "[object String]"===u&&fa(this)?"[object Symbol]":u};q(t,"toString",C);try{if(!0===k(q({},"__\u0001symbol:",{get:function(){return q(this,"__\u0001symbol:",{value:!0})["__\u0001symbol:"]}}))["__\u0001symbol:"])var za=q;else throw "IE11";}catch(u){za=function(G,p,r){var B=h(t,p);delete t[p];q(G,p,
r);q(t,p,B);};}}})(Object,"getOwnPropertySymbols");
(function(a,b){var c=a.defineProperty,d=a.prototype,e=d.toString,f;"iterator match replace search split hasInstance isConcatSpreadable unscopables species toPrimitive toStringTag".split(" ").forEach(function(g){if(!(g in b))switch(c(b,g,{value:b(g)}),g){case "toStringTag":f=a.getOwnPropertyDescriptor(d,"toString"),f.value=function(){var h=e.call(this),k=null!=this?this[b.toStringTag]:this;return null==k?h:"[object "+k+"]"},c(d,"toString",f);}});})(Object,Symbol);
(function(a,b,c){function d(){return this}b[a]||(b[a]=function(){var e=0,f=this,g={next:function(){var h=f.length<=e;return h?{done:h}:{done:h,value:f[e++]}}};g[a]=d;return g});c[a]||(c[a]=function(){var e=String.fromCodePoint,f=this,g=0,h=f.length,k={next:function(){var l=h<=g,m=l?"":e(f.codePointAt(g));g+=m.length;return l?{done:l}:{done:l,value:m}}};k[a]=d;return k});})(Symbol.iterator,Array.prototype,String.prototype);/*

Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
var Ya=Object.prototype.toString;Object.prototype.toString=function(){return void 0===this?"[object Undefined]":null===this?"[object Null]":Ya.call(this)};Object.keys=function(a){return Object.getOwnPropertyNames(a).filter(function(b){return (b=Object.getOwnPropertyDescriptor(a,b))&&b.enumerable})};ea();ja();
String.prototype[Symbol.iterator]&&String.prototype.codePointAt||(ea(),ja(),String.prototype[Symbol.iterator]=function b(){var c,d=this;return Ga(b,function(e){1==e.a&&(c=0);if(3!=e.a)return c<d.length?e=Aa(e,d[c]):(e.a=0,e=void 0),e;c++;e.a=2;})});ea();ja();
Set.prototype[Symbol.iterator]||(ea(),ja(),Set.prototype[Symbol.iterator]=function b(){var c,d=this,e;return Ga(b,function(f){1==f.a&&(c=[],d.forEach(function(g){c.push(g);}),e=0);if(3!=f.a)return e<c.length?f=Aa(f,c[e]):(f.a=0,f=void 0),f;e++;f.a=2;})});ea();ja();
Map.prototype[Symbol.iterator]||(ea(),ja(),Map.prototype[Symbol.iterator]=function b(){var c,d=this,e;return Ga(b,function(f){1==f.a&&(c=[],d.forEach(function(g,h){c.push([h,g]);}),e=0);if(3!=f.a)return e<c.length?f=Aa(f,c[e]):(f.a=0,f=void 0),f;e++;f.a=2;})});/*

Copyright (c) 2020 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
var Za=document.createEvent("Event");Za.initEvent("foo",!0,!0);Za.preventDefault();if(!Za.defaultPrevented){var $a=Event.prototype.preventDefault;Event.prototype.preventDefault=function(){this.cancelable&&($a.call(this),Object.defineProperty(this,"defaultPrevented",{get:function(){return !0},configurable:!0}));};}var ab=/Trident/.test(navigator.userAgent);
if(!window.Event||ab&&"function"!==typeof window.Event){var bb=window.Event;window.Event=function(a,b){b=b||{};var c=document.createEvent("Event");c.initEvent(a,!!b.bubbles,!!b.cancelable);return c};if(bb){for(var cb in bb)window.Event[cb]=bb[cb];window.Event.prototype=bb.prototype;}}
if(!window.CustomEvent||ab&&"function"!==typeof window.CustomEvent)window.CustomEvent=function(a,b){b=b||{};var c=document.createEvent("CustomEvent");c.initCustomEvent(a,!!b.bubbles,!!b.cancelable,b.detail);return c},window.CustomEvent.prototype=window.Event.prototype;
if(!window.MouseEvent||ab&&"function"!==typeof window.MouseEvent){var db=window.MouseEvent;window.MouseEvent=function(a,b){b=b||{};var c=document.createEvent("MouseEvent");c.initMouseEvent(a,!!b.bubbles,!!b.cancelable,b.view||window,b.detail,b.screenX,b.screenY,b.clientX,b.clientY,b.ctrlKey,b.altKey,b.shiftKey,b.metaKey,b.button,b.relatedTarget);return c};if(db)for(var eb in db)window.MouseEvent[eb]=db[eb];window.MouseEvent.prototype=db.prototype;}Object.getOwnPropertyDescriptor(Node.prototype,"baseURI")||Object.defineProperty(Node.prototype,"baseURI",{get:function(){var a=(this.ownerDocument||this).querySelector("base[href]");return a&&a.href||window.location.href},configurable:!0,enumerable:!0});/*

Copyright (c) 2020 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
var fb,gb,jb=Element.prototype,kb=null!==(fb=Object.getOwnPropertyDescriptor(jb,"attributes"))&&void 0!==fb?fb:Object.getOwnPropertyDescriptor(Node.prototype,"attributes"),lb=null!==(gb=null===kb||void 0===kb?void 0:kb.get)&&void 0!==gb?gb:function(){return this.attributes},mb=Array.prototype.map;jb.hasOwnProperty("getAttributeNames")||(jb.getAttributeNames=function(){return mb.call(lb.call(this),function(a){return a.name})});var pb,qb=Element.prototype;qb.hasOwnProperty("matches")||(qb.matches=null!==(pb=qb.webkitMatchesSelector)&&void 0!==pb?pb:qb.msMatchesSelector);var rb=Node.prototype.appendChild;function sb(a){a=a.prototype;a.hasOwnProperty("append")||Object.defineProperty(a,"append",{configurable:!0,enumerable:!0,writable:!0,value:function(b){for(var c=[],d=0;d<arguments.length;++d)c[d]=arguments[d];c=na(c);for(d=c.next();!d.done;d=c.next())d=d.value,rb.call(this,"string"===typeof d?document.createTextNode(d):d);}});}sb(Document);sb(DocumentFragment);sb(Element);var tb,ub,vb=Node.prototype.insertBefore,wb=null!==(ub=null===(tb=Object.getOwnPropertyDescriptor(Node.prototype,"firstChild"))||void 0===tb?void 0:tb.get)&&void 0!==ub?ub:function(){return this.firstChild};
function xb(a){a=a.prototype;a.hasOwnProperty("prepend")||Object.defineProperty(a,"prepend",{configurable:!0,enumerable:!0,writable:!0,value:function(b){for(var c=[],d=0;d<arguments.length;++d)c[d]=arguments[d];d=wb.call(this);c=na(c);for(var e=c.next();!e.done;e=c.next())e=e.value,vb.call(this,"string"===typeof e?document.createTextNode(e):e,d);}});}xb(Document);xb(DocumentFragment);xb(Element);var yb,zb,Ab=Node.prototype.appendChild,Bb=Node.prototype.removeChild,Cb=null!==(zb=null===(yb=Object.getOwnPropertyDescriptor(Node.prototype,"firstChild"))||void 0===yb?void 0:yb.get)&&void 0!==zb?zb:function(){return this.firstChild};
function Db(a){a=a.prototype;a.hasOwnProperty("replaceChildren")||Object.defineProperty(a,"replaceChildren",{configurable:!0,enumerable:!0,writable:!0,value:function(b){for(var c=[],d=0;d<arguments.length;++d)c[d]=arguments[d];for(;null!==(d=Cb.call(this));)Bb.call(this,d);c=na(c);for(d=c.next();!d.done;d=c.next())d=d.value,Ab.call(this,"string"===typeof d?document.createTextNode(d):d);}});}Db(Document);Db(DocumentFragment);Db(Element);var Eb,Fb,Gb,Hb,Ib=Node.prototype.insertBefore,Jb=null!==(Fb=null===(Eb=Object.getOwnPropertyDescriptor(Node.prototype,"parentNode"))||void 0===Eb?void 0:Eb.get)&&void 0!==Fb?Fb:function(){return this.parentNode},Kb=null!==(Hb=null===(Gb=Object.getOwnPropertyDescriptor(Node.prototype,"nextSibling"))||void 0===Gb?void 0:Gb.get)&&void 0!==Hb?Hb:function(){return this.nextSibling};
function Lb(a){a=a.prototype;a.hasOwnProperty("after")||Object.defineProperty(a,"after",{configurable:!0,enumerable:!0,writable:!0,value:function(b){for(var c=[],d=0;d<arguments.length;++d)c[d]=arguments[d];d=Jb.call(this);if(null!==d){var e=Kb.call(this);c=na(c);for(var f=c.next();!f.done;f=c.next())f=f.value,Ib.call(d,"string"===typeof f?document.createTextNode(f):f,e);}}});}Lb(CharacterData);Lb(Element);var Mb,Nb,Ob=Node.prototype.insertBefore,Pb=null!==(Nb=null===(Mb=Object.getOwnPropertyDescriptor(Node.prototype,"parentNode"))||void 0===Mb?void 0:Mb.get)&&void 0!==Nb?Nb:function(){return this.parentNode};
function Qb(a){a=a.prototype;a.hasOwnProperty("before")||Object.defineProperty(a,"before",{configurable:!0,enumerable:!0,writable:!0,value:function(b){for(var c=[],d=0;d<arguments.length;++d)c[d]=arguments[d];d=Pb.call(this);if(null!==d){c=na(c);for(var e=c.next();!e.done;e=c.next())e=e.value,Ob.call(d,"string"===typeof e?document.createTextNode(e):e,this);}}});}Qb(CharacterData);Qb(Element);var Rb,Sb,Tb=Node.prototype.removeChild,Ub=null!==(Sb=null===(Rb=Object.getOwnPropertyDescriptor(Node.prototype,"parentNode"))||void 0===Rb?void 0:Rb.get)&&void 0!==Sb?Sb:function(){return this.parentNode};function Vb(a){a=a.prototype;a.hasOwnProperty("remove")||Object.defineProperty(a,"remove",{configurable:!0,enumerable:!0,writable:!0,value:function(){var b=Ub.call(this);b&&Tb.call(b,this);}});}Vb(CharacterData);Vb(Element);var Wb,Xb,Yb=Node.prototype.insertBefore,Zb=Node.prototype.removeChild,$b=null!==(Xb=null===(Wb=Object.getOwnPropertyDescriptor(Node.prototype,"parentNode"))||void 0===Wb?void 0:Wb.get)&&void 0!==Xb?Xb:function(){return this.parentNode};
function ac(a){a=a.prototype;a.hasOwnProperty("replaceWith")||Object.defineProperty(a,"replaceWith",{configurable:!0,enumerable:!0,writable:!0,value:function(b){for(var c=[],d=0;d<arguments.length;++d)c[d]=arguments[d];d=$b.call(this);if(null!==d){c=na(c);for(var e=c.next();!e.done;e=c.next())e=e.value,Yb.call(d,"string"===typeof e?document.createTextNode(e):e,this);Zb.call(d,this);}}});}ac(CharacterData);ac(Element);var bc=window.Element.prototype,cc=window.HTMLElement.prototype,dc=window.SVGElement.prototype;!cc.hasOwnProperty("classList")||bc.hasOwnProperty("classList")||dc.hasOwnProperty("classList")||Object.defineProperty(bc,"classList",Object.getOwnPropertyDescriptor(cc,"classList"));/*

 Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at
 http://polymer.github.io/LICENSE.txt The complete set of authors may be found
 at http://polymer.github.io/AUTHORS.txt The complete set of contributors may
 be found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by
 Google as part of the polymer project is also subject to an additional IP
 rights grant found at http://polymer.github.io/PATENTS.txt
*/
var ec=document.createElement("style");ec.textContent="body {transition: opacity ease-in 0.2s; } \nbody[unresolved] {opacity: 0; display: block; overflow: hidden; position: relative; } \n";var fc=document.querySelector("head");fc.insertBefore(ec,fc.firstChild);var gc=window;gc.WebComponents=gc.WebComponents||{flags:{}};var ic=document.querySelector('script[src*="webcomponents-bundle"]'),jc=/wc-(.+)/,kc={};if(!kc.noOpts){location.search.slice(1).split("&").forEach(function(a){a=a.split("=");var b;a[0]&&(b=a[0].match(jc))&&(kc[b[1]]=a[1]||!0);});if(ic)for(var lc=0,mc=void 0;mc=ic.attributes[lc];lc++)"src"!==mc.name&&(kc[mc.name]=mc.value||!0);var nc={};kc.log&&kc.log.split&&kc.log.split(",").forEach(function(a){nc[a]=!0;});kc.log=nc;}
gc.WebComponents.flags=kc;var oc=kc.shadydom;if(oc){gc.ShadyDOM=gc.ShadyDOM||{};gc.ShadyDOM.force=oc;var pc=kc.noPatch;gc.ShadyDOM.noPatch="true"===pc?!0:pc;}var qc=kc.register||kc.ce;qc&&window.customElements&&(gc.customElements.forcePolyfill=qc);/*

 Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
(function(){function a(){}function b(p,r){if(!p.childNodes.length)return [];switch(p.nodeType){case Node.DOCUMENT_NODE:return F.call(p,r);case Node.DOCUMENT_FRAGMENT_NODE:return E.call(p,r);default:return t.call(p,r)}}var c="undefined"===typeof HTMLTemplateElement,d=!(document.createDocumentFragment().cloneNode()instanceof DocumentFragment),e=!1;/Trident/.test(navigator.userAgent)&&function(){function p(z,R){if(z instanceof DocumentFragment)for(var nb;nb=z.firstChild;)B.call(this,nb,R);else B.call(this,
z,R);return z}e=!0;var r=Node.prototype.cloneNode;Node.prototype.cloneNode=function(z){z=r.call(this,z);this instanceof DocumentFragment&&(z.__proto__=DocumentFragment.prototype);return z};DocumentFragment.prototype.querySelectorAll=HTMLElement.prototype.querySelectorAll;DocumentFragment.prototype.querySelector=HTMLElement.prototype.querySelector;Object.defineProperties(DocumentFragment.prototype,{nodeType:{get:function(){return Node.DOCUMENT_FRAGMENT_NODE},configurable:!0},localName:{get:function(){},
configurable:!0},nodeName:{get:function(){return "#document-fragment"},configurable:!0}});var B=Node.prototype.insertBefore;Node.prototype.insertBefore=p;var K=Node.prototype.appendChild;Node.prototype.appendChild=function(z){z instanceof DocumentFragment?p.call(this,z,null):K.call(this,z);return z};var aa=Node.prototype.removeChild,la=Node.prototype.replaceChild;Node.prototype.replaceChild=function(z,R){z instanceof DocumentFragment?(p.call(this,z,R),aa.call(this,R)):la.call(this,z,R);return R};Document.prototype.createDocumentFragment=
function(){var z=this.createElement("df");z.__proto__=DocumentFragment.prototype;return z};var ya=Document.prototype.importNode;Document.prototype.importNode=function(z,R){R=ya.call(this,z,R||!1);z instanceof DocumentFragment&&(R.__proto__=DocumentFragment.prototype);return R};}();var f=Node.prototype.cloneNode,g=Document.prototype.createElement,h=Document.prototype.importNode,k=Node.prototype.removeChild,l=Node.prototype.appendChild,m=Node.prototype.replaceChild,q=DOMParser.prototype.parseFromString,
H=Object.getOwnPropertyDescriptor(window.HTMLElement.prototype,"innerHTML")||{get:function(){return this.innerHTML},set:function(p){this.innerHTML=p;}},C=Object.getOwnPropertyDescriptor(window.Node.prototype,"childNodes")||{get:function(){return this.childNodes}},t=Element.prototype.querySelectorAll,F=Document.prototype.querySelectorAll,E=DocumentFragment.prototype.querySelectorAll,M=function(){if(!c){var p=document.createElement("template"),r=document.createElement("template");r.content.appendChild(document.createElement("div"));
p.content.appendChild(r);p=p.cloneNode(!0);return 0===p.content.childNodes.length||0===p.content.firstChild.content.childNodes.length||d}}();if(c){var y=document.implementation.createHTMLDocument("template"),W=!0,w=document.createElement("style");w.textContent="template{display:none;}";var wa=document.head;wa.insertBefore(w,wa.firstElementChild);a.prototype=Object.create(HTMLElement.prototype);var fa=!document.createElement("div").hasOwnProperty("innerHTML");a.U=function(p){if(!p.content&&p.namespaceURI===
document.documentElement.namespaceURI){p.content=y.createDocumentFragment();for(var r;r=p.firstChild;)l.call(p.content,r);if(fa)p.__proto__=a.prototype;else if(p.cloneNode=function(B){return a.b(this,B)},W)try{n(p),J(p);}catch(B){W=!1;}a.a(p.content);}};var va={option:["select"],thead:["table"],col:["colgroup","table"],tr:["tbody","table"],th:["tr","tbody","table"],td:["tr","tbody","table"]},n=function(p){Object.defineProperty(p,"innerHTML",{get:function(){return za(this)},set:function(r){var B=va[(/<([a-z][^/\0>\x20\t\r\n\f]+)/i.exec(r)||
["",""])[1].toLowerCase()];if(B)for(var K=0;K<B.length;K++)r="<"+B[K]+">"+r+"</"+B[K]+">";y.body.innerHTML=r;for(a.a(y);this.content.firstChild;)k.call(this.content,this.content.firstChild);r=y.body;if(B)for(K=0;K<B.length;K++)r=r.lastChild;for(;r.firstChild;)l.call(this.content,r.firstChild);},configurable:!0});},J=function(p){Object.defineProperty(p,"outerHTML",{get:function(){return "<template>"+this.innerHTML+"</template>"},set:function(r){if(this.parentNode){y.body.innerHTML=r;for(r=this.ownerDocument.createDocumentFragment();y.body.firstChild;)l.call(r,
y.body.firstChild);m.call(this.parentNode,r,this);}else throw Error("Failed to set the 'outerHTML' property on 'Element': This element has no parent node.");},configurable:!0});};n(a.prototype);J(a.prototype);a.a=function(p){p=b(p,"template");for(var r=0,B=p.length,K;r<B&&(K=p[r]);r++)a.U(K);};document.addEventListener("DOMContentLoaded",function(){a.a(document);});Document.prototype.createElement=function(){var p=g.apply(this,arguments);"template"===p.localName&&a.U(p);return p};DOMParser.prototype.parseFromString=
function(){var p=q.apply(this,arguments);a.a(p);return p};Object.defineProperty(HTMLElement.prototype,"innerHTML",{get:function(){return za(this)},set:function(p){H.set.call(this,p);a.a(this);},configurable:!0,enumerable:!0});var ka=/[&\u00A0"]/g,hc=/[&\u00A0<>]/g,hb=function(p){switch(p){case "&":return "&amp;";case "<":return "&lt;";case ">":return "&gt;";case '"':return "&quot;";case "\u00a0":return "&nbsp;"}};w=function(p){for(var r={},B=0;B<p.length;B++)r[p[B]]=!0;return r};var Wa=w("area base br col command embed hr img input keygen link meta param source track wbr".split(" ")),
ib=w("style script xmp iframe noembed noframes plaintext noscript".split(" ")),za=function(p,r){"template"===p.localName&&(p=p.content);for(var B="",K=r?r(p):C.get.call(p),aa=0,la=K.length,ya;aa<la&&(ya=K[aa]);aa++){a:{var z=ya;var R=p;var nb=r;switch(z.nodeType){case Node.ELEMENT_NODE:for(var Gc=z.localName,ob="<"+Gc,zh=z.attributes,qe=0;R=zh[qe];qe++)ob+=" "+R.name+'="'+R.value.replace(ka,hb)+'"';ob+=">";z=Wa[Gc]?ob:ob+za(z,nb)+"</"+Gc+">";break a;case Node.TEXT_NODE:z=z.data;z=R&&ib[R.localName]?
z:z.replace(hc,hb);break a;case Node.COMMENT_NODE:z="\x3c!--"+z.data+"--\x3e";break a;default:throw window.console.error(z),Error("not implemented");}}B+=z;}return B};}if(c||M){a.b=function(p,r){var B=f.call(p,!1);this.U&&this.U(B);r&&(l.call(B.content,f.call(p.content,!0)),I(B.content,p.content));return B};var I=function(p,r){if(r.querySelectorAll&&(r=b(r,"template"),0!==r.length)){p=b(p,"template");for(var B=0,K=p.length,aa,la;B<K;B++)la=r[B],aa=p[B],a&&a.U&&a.U(la),m.call(aa.parentNode,u.call(la,
!0),aa);}},u=Node.prototype.cloneNode=function(p){if(!e&&d&&this instanceof DocumentFragment)if(p)var r=G.call(this.ownerDocument,this,!0);else return this.ownerDocument.createDocumentFragment();else this.nodeType===Node.ELEMENT_NODE&&"template"===this.localName&&this.namespaceURI==document.documentElement.namespaceURI?r=a.b(this,p):r=f.call(this,p);p&&I(r,this);return r},G=Document.prototype.importNode=function(p,r){r=r||!1;if("template"===p.localName)return a.b(p,r);var B=h.call(this,p,r);if(r){I(B,
p);p=b(B,'script:not([type]),script[type="application/javascript"],script[type="text/javascript"]');for(var K,aa=0;aa<p.length;aa++){K=p[aa];r=g.call(document,"script");r.textContent=K.textContent;for(var la=K.attributes,ya=0,z;ya<la.length;ya++)z=la[ya],r.setAttribute(z.name,z.value);m.call(K.parentNode,r,K);}}return B};}c&&(window.HTMLTemplateElement=a);})();/*

Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
function rc(){}rc.prototype.toJSON=function(){return {}};function D(a){a.__shady||(a.__shady=new rc);return a.__shady}function L(a){return a&&a.__shady}var N=window.ShadyDOM||{};N.Ua=!(!Element.prototype.attachShadow||!Node.prototype.getRootNode);var sc=Object.getOwnPropertyDescriptor(Node.prototype,"firstChild");N.B=!!(sc&&sc.configurable&&sc.get);N.sa=N.force||!N.Ua;N.D=N.noPatch||!1;N.aa=N.preferPerformance;N.ua="on-demand"===N.D;N.Ia=navigator.userAgent.match("Trident");function tc(a){return (a=L(a))&&void 0!==a.firstChild}function O(a){return a instanceof ShadowRoot}function uc(a){return (a=(a=L(a))&&a.root)&&vc(a)}
var wc=Element.prototype,xc=wc.matches||wc.matchesSelector||wc.mozMatchesSelector||wc.msMatchesSelector||wc.oMatchesSelector||wc.webkitMatchesSelector,yc=document.createTextNode(""),zc=0,Ac=[];(new MutationObserver(function(){for(;Ac.length;)try{Ac.shift()();}catch(a){throw yc.textContent=zc++,a;}})).observe(yc,{characterData:!0});function Bc(a){Ac.push(a);yc.textContent=zc++;}
var Cc=document.contains?function(a,b){return a.__shady_native_contains(b)}:function(a,b){return a===b||a.documentElement&&a.documentElement.__shady_native_contains(b)};function Dc(a,b){for(;b;){if(b==a)return !0;b=b.__shady_parentNode;}return !1}
function Ec(a){for(var b=a.length-1;0<=b;b--){var c=a[b],d=c.getAttribute("id")||c.getAttribute("name");d&&"length"!==d&&isNaN(d)&&(a[d]=c);}a.item=function(e){return a[e]};a.namedItem=function(e){if("length"!==e&&isNaN(e)&&a[e])return a[e];for(var f=na(a),g=f.next();!g.done;g=f.next())if(g=g.value,(g.getAttribute("id")||g.getAttribute("name"))==e)return g;return null};return a}function Fc(a){var b=[];for(a=a.__shady_native_firstChild;a;a=a.__shady_native_nextSibling)b.push(a);return b}
function Hc(a){var b=[];for(a=a.__shady_firstChild;a;a=a.__shady_nextSibling)b.push(a);return b}function Ic(a,b,c){c.configurable=!0;if(c.value)a[b]=c.value;else try{Object.defineProperty(a,b,c);}catch(d){}}function P(a,b,c,d){c=void 0===c?"":c;for(var e in b)d&&0<=d.indexOf(e)||Ic(a,c+e,b[e]);}function Jc(a,b){for(var c in b)c in a&&Ic(a,c,b[c]);}function Q(a){var b={};Object.getOwnPropertyNames(a).forEach(function(c){b[c]=Object.getOwnPropertyDescriptor(a,c);});return b}
function Kc(a,b){for(var c=Object.getOwnPropertyNames(b),d=0,e;d<c.length;d++)e=c[d],a[e]=b[e];}function Lc(a){return a instanceof Node?a:document.createTextNode(""+a)}function Mc(a){for(var b=[],c=0;c<arguments.length;++c)b[c]=arguments[c];if(1===b.length)return Lc(b[0]);c=document.createDocumentFragment();b=na(b);for(var d=b.next();!d.done;d=b.next())c.appendChild(Lc(d.value));return c}var Nc=[],Oc;function Pc(a){Oc||(Oc=!0,Bc(Qc));Nc.push(a);}function Qc(){Oc=!1;for(var a=!!Nc.length;Nc.length;)Nc.shift()();return a}Qc.list=Nc;function Rc(){this.a=!1;this.addedNodes=[];this.removedNodes=[];this.ja=new Set;}function Sc(a){a.a||(a.a=!0,Bc(function(){a.flush();}));}Rc.prototype.flush=function(){if(this.a){this.a=!1;var a=this.takeRecords();a.length&&this.ja.forEach(function(b){b(a);});}};Rc.prototype.takeRecords=function(){if(this.addedNodes.length||this.removedNodes.length){var a=[{addedNodes:this.addedNodes,removedNodes:this.removedNodes}];this.addedNodes=[];this.removedNodes=[];return a}return []};
function Tc(a,b){var c=D(a);c.Z||(c.Z=new Rc);c.Z.ja.add(b);var d=c.Z;return {Ma:b,S:d,Na:a,takeRecords:function(){return d.takeRecords()}}}function Uc(a){var b=a&&a.S;b&&(b.ja.delete(a.Ma),b.ja.size||(D(a.Na).Z=null));}
function Vc(a,b){var c=b.getRootNode();return a.map(function(d){var e=c===d.target.getRootNode();if(e&&d.addedNodes){if(e=[].slice.call(d.addedNodes).filter(function(f){return c===f.getRootNode()}),e.length)return d=Object.create(d),Object.defineProperty(d,"addedNodes",{value:e,configurable:!0}),d}else if(e)return d}).filter(function(d){return d})}var Wc=/[&\u00A0"]/g,Xc=/[&\u00A0<>]/g;function Yc(a){switch(a){case "&":return "&amp;";case "<":return "&lt;";case ">":return "&gt;";case '"':return "&quot;";case "\u00a0":return "&nbsp;"}}function Zc(a){for(var b={},c=0;c<a.length;c++)b[a[c]]=!0;return b}var $c=Zc("area base br col command embed hr img input keygen link meta param source track wbr".split(" ")),ad=Zc("style script xmp iframe noembed noframes plaintext noscript".split(" "));
function bd(a,b){"template"===a.localName&&(a=a.content);for(var c="",d=b?b(a):a.childNodes,e=0,f=d.length,g=void 0;e<f&&(g=d[e]);e++){a:{var h=g;var k=a,l=b;switch(h.nodeType){case Node.ELEMENT_NODE:k=h.localName;for(var m="<"+k,q=h.attributes,H=0,C;C=q[H];H++)m+=" "+C.name+'="'+C.value.replace(Wc,Yc)+'"';m+=">";h=$c[k]?m:m+bd(h,l)+"</"+k+">";break a;case Node.TEXT_NODE:h=h.data;h=k&&ad[k.localName]?h:h.replace(Xc,Yc);break a;case Node.COMMENT_NODE:h="\x3c!--"+h.data+"--\x3e";break a;default:throw window.console.error(h),
Error("not implemented");}}c+=h;}return c}var cd=N.B,dd={querySelector:function(a){return this.__shady_native_querySelector(a)},querySelectorAll:function(a){return this.__shady_native_querySelectorAll(a)}},ed={};function fd(a){ed[a]=function(b){return b["__shady_native_"+a]};}function gd(a,b){P(a,b,"__shady_native_");for(var c in b)fd(c);}function S(a,b){b=void 0===b?[]:b;for(var c=0;c<b.length;c++){var d=b[c],e=Object.getOwnPropertyDescriptor(a,d);e&&(Object.defineProperty(a,"__shady_native_"+d,e),e.value?dd[d]||(dd[d]=e.value):fd(d));}}
var hd=document.createTreeWalker(document,NodeFilter.SHOW_ALL,null,!1),id=document.createTreeWalker(document,NodeFilter.SHOW_ELEMENT,null,!1),jd=document.implementation.createHTMLDocument("inert");function kd(a){for(var b;b=a.__shady_native_firstChild;)a.__shady_native_removeChild(b);}var ld=["firstElementChild","lastElementChild","children","childElementCount"],md=["querySelector","querySelectorAll","append","prepend","replaceChildren"];
function nd(){var a=["dispatchEvent","addEventListener","removeEventListener"];window.EventTarget?S(window.EventTarget.prototype,a):(S(Node.prototype,a),S(Window.prototype,a));cd?S(Node.prototype,"parentNode firstChild lastChild previousSibling nextSibling childNodes parentElement textContent".split(" ")):gd(Node.prototype,{parentNode:{get:function(){hd.currentNode=this;return hd.parentNode()}},firstChild:{get:function(){hd.currentNode=this;return hd.firstChild()}},lastChild:{get:function(){hd.currentNode=
this;return hd.lastChild()}},previousSibling:{get:function(){hd.currentNode=this;return hd.previousSibling()}},nextSibling:{get:function(){hd.currentNode=this;return hd.nextSibling()}},childNodes:{get:function(){var b=[];hd.currentNode=this;for(var c=hd.firstChild();c;)b.push(c),c=hd.nextSibling();return b}},parentElement:{get:function(){id.currentNode=this;return id.parentNode()}},textContent:{get:function(){switch(this.nodeType){case Node.ELEMENT_NODE:case Node.DOCUMENT_FRAGMENT_NODE:for(var b=
document.createTreeWalker(this,NodeFilter.SHOW_TEXT,null,!1),c="",d;d=b.nextNode();)c+=d.nodeValue;return c;default:return this.nodeValue}},set:function(b){if("undefined"===typeof b||null===b)b="";switch(this.nodeType){case Node.ELEMENT_NODE:case Node.DOCUMENT_FRAGMENT_NODE:kd(this);(0<b.length||this.nodeType===Node.ELEMENT_NODE)&&this.__shady_native_insertBefore(document.createTextNode(b),void 0);break;default:this.nodeValue=b;}}}});S(Node.prototype,"appendChild insertBefore removeChild replaceChild cloneNode contains".split(" "));
S(HTMLElement.prototype,["parentElement","contains"]);a={firstElementChild:{get:function(){id.currentNode=this;return id.firstChild()}},lastElementChild:{get:function(){id.currentNode=this;return id.lastChild()}},children:{get:function(){var b=[];id.currentNode=this;for(var c=id.firstChild();c;)b.push(c),c=id.nextSibling();return Ec(b)}},childElementCount:{get:function(){return this.children?this.children.length:0}}};cd?(S(Element.prototype,ld),S(Element.prototype,["previousElementSibling","nextElementSibling",
"innerHTML","className"]),S(HTMLElement.prototype,["children","innerHTML","className"])):(gd(Element.prototype,a),gd(Element.prototype,{previousElementSibling:{get:function(){id.currentNode=this;return id.previousSibling()}},nextElementSibling:{get:function(){id.currentNode=this;return id.nextSibling()}},innerHTML:{get:function(){return bd(this,Fc)},set:function(b){var c="template"===this.localName?this.content:this;kd(c);var d=this.localName||"div";d=this.namespaceURI&&this.namespaceURI!==jd.namespaceURI?
jd.createElementNS(this.namespaceURI,d):jd.createElement(d);d.innerHTML=b;for(b="template"===this.localName?d.content:d;d=b.__shady_native_firstChild;)c.__shady_native_insertBefore(d,void 0);}},className:{get:function(){return this.getAttribute("class")||""},set:function(b){this.setAttribute("class",b);}}}));S(Element.prototype,"setAttribute getAttribute hasAttribute removeAttribute focus blur".split(" "));S(Element.prototype,md);S(HTMLElement.prototype,["focus","blur"]);window.HTMLTemplateElement&&
S(window.HTMLTemplateElement.prototype,["innerHTML"]);cd?S(DocumentFragment.prototype,ld):gd(DocumentFragment.prototype,a);S(DocumentFragment.prototype,md);cd?(S(Document.prototype,ld),S(Document.prototype,["activeElement"])):gd(Document.prototype,a);S(Document.prototype,["importNode","getElementById"]);S(Document.prototype,md);}var od=Q({get childNodes(){return this.__shady_childNodes},get firstChild(){return this.__shady_firstChild},get lastChild(){return this.__shady_lastChild},get childElementCount(){return this.__shady_childElementCount},get children(){return this.__shady_children},get firstElementChild(){return this.__shady_firstElementChild},get lastElementChild(){return this.__shady_lastElementChild},get shadowRoot(){return this.__shady_shadowRoot}}),pd=Q({get textContent(){return this.__shady_textContent},set textContent(a){this.__shady_textContent=
a;},get innerHTML(){return this.__shady_innerHTML},set innerHTML(a){return this.__shady_innerHTML=a}}),qd=Q({get parentElement(){return this.__shady_parentElement},get parentNode(){return this.__shady_parentNode},get nextSibling(){return this.__shady_nextSibling},get previousSibling(){return this.__shady_previousSibling},get nextElementSibling(){return this.__shady_nextElementSibling},get previousElementSibling(){return this.__shady_previousElementSibling},get className(){return this.__shady_className},
set className(a){return this.__shady_className=a}});function rd(a){for(var b in a){var c=a[b];c&&(c.enumerable=!1);}}rd(od);rd(pd);rd(qd);var sd=N.B||!0===N.D,td=sd?function(){}:function(a){var b=D(a);b.Ka||(b.Ka=!0,Jc(a,qd));},ud=sd?function(){}:function(a){var b=D(a);b.Ja||(b.Ja=!0,Jc(a,od),window.customElements&&window.customElements.polyfillWrapFlushCallback&&!N.D||Jc(a,pd));};var vd="__eventWrappers"+Date.now(),wd=function(){var a=Object.getOwnPropertyDescriptor(Event.prototype,"composed");return a?function(b){return a.get.call(b)}:null}(),xd=function(){function a(){}var b=!1,c={get capture(){b=!0;return !1}};window.addEventListener("test",a,c);window.removeEventListener("test",a,c);return b}();function yd(a){if(a&&"object"===typeof a){var b=!!a.capture;var c=!!a.once;var d=!!a.passive;var e=a.O;}else b=!!a,d=c=!1;return {Ga:e,capture:b,once:c,passive:d,Fa:xd?a:b}}
var zd={blur:!0,focus:!0,focusin:!0,focusout:!0,click:!0,dblclick:!0,mousedown:!0,mouseenter:!0,mouseleave:!0,mousemove:!0,mouseout:!0,mouseover:!0,mouseup:!0,wheel:!0,beforeinput:!0,input:!0,keydown:!0,keyup:!0,compositionstart:!0,compositionupdate:!0,compositionend:!0,touchstart:!0,touchend:!0,touchmove:!0,touchcancel:!0,pointerover:!0,pointerenter:!0,pointerdown:!0,pointermove:!0,pointerup:!0,pointercancel:!0,pointerout:!0,pointerleave:!0,gotpointercapture:!0,lostpointercapture:!0,dragstart:!0,
drag:!0,dragenter:!0,dragleave:!0,dragover:!0,drop:!0,dragend:!0,DOMActivate:!0,DOMFocusIn:!0,DOMFocusOut:!0,keypress:!0},Ad={DOMAttrModified:!0,DOMAttributeNameChanged:!0,DOMCharacterDataModified:!0,DOMElementNameChanged:!0,DOMNodeInserted:!0,DOMNodeInsertedIntoDocument:!0,DOMNodeRemoved:!0,DOMNodeRemovedFromDocument:!0,DOMSubtreeModified:!0};function Bd(a){return a instanceof Node?a.__shady_getRootNode():a}
function Cd(a,b){var c=[],d=a;for(a=Bd(a);d;)c.push(d),d.__shady_assignedSlot?d=d.__shady_assignedSlot:d.nodeType===Node.DOCUMENT_FRAGMENT_NODE&&d.host&&(b||d!==a)?d=d.host:d=d.__shady_parentNode;c[c.length-1]===document&&c.push(window);return c}function Dd(a){a.__composedPath||(a.__composedPath=Cd(a.target,!0));return a.__composedPath}function Ed(a,b){if(!O)return a;a=Cd(a,!0);for(var c=0,d,e=void 0,f,g=void 0;c<b.length;c++)if(d=b[c],f=Bd(d),f!==e&&(g=a.indexOf(f),e=f),!O(f)||-1<g)return d}
function Fd(a){function b(c,d){c=new a(c,d);c.__composed=d&&!!d.composed;return c}b.__proto__=a;b.prototype=a.prototype;return b}var Gd={focus:!0,blur:!0};function Hd(a){return a.__target!==a.target||a.__relatedTarget!==a.relatedTarget}function Id(a,b,c){if(c=b.__handlers&&b.__handlers[a.type]&&b.__handlers[a.type][c])for(var d=0,e;(e=c[d])&&(!Hd(a)||a.target!==a.relatedTarget)&&(e.call(b,a),!a.__immediatePropagationStopped);d++);}
function Jd(a){var b=a.composedPath(),c=b.map(function(k){return Ed(k,b)}),d=a.bubbles;Object.defineProperty(a,"currentTarget",{configurable:!0,enumerable:!0,get:function(){return g}});var e=Event.CAPTURING_PHASE;Object.defineProperty(a,"eventPhase",{configurable:!0,enumerable:!0,get:function(){return e}});for(var f=b.length-1;0<=f;f--){var g=b[f];e=g===c[f]?Event.AT_TARGET:Event.CAPTURING_PHASE;Id(a,g,"capture");if(a.ma)return}for(f=0;f<b.length;f++){g=b[f];var h=g===c[f];if(h||d)if(e=h?Event.AT_TARGET:
Event.BUBBLING_PHASE,Id(a,g,"bubble"),a.ma)return}e=0;g=null;}function Kd(a,b,c,d,e,f){for(var g=0;g<a.length;g++){var h=a[g],k=h.type,l=h.capture,m=h.once,q=h.passive;if(b===h.node&&c===k&&d===l&&e===m&&f===q)return g}return -1}function Ld(a){Qc();return !N.aa&&this instanceof Node&&!Cc(document,this)?(a.__target||Md(a,this),Jd(a)):this.__shady_native_dispatchEvent(a)}
function Nd(a,b,c){var d=yd(c),e=d.capture,f=d.once,g=d.passive,h=d.Ga;d=d.Fa;if(b){var k=typeof b;if("function"===k||"object"===k)if("object"!==k||b.handleEvent&&"function"===typeof b.handleEvent){if(Ad[a])return this.__shady_native_addEventListener(a,b,d);var l=h||this;if(h=b[vd]){if(-1<Kd(h,l,a,e,f,g))return}else b[vd]=[];h=function(m){f&&this.__shady_removeEventListener(a,b,c);m.__target||Md(m);if(l!==this){var q=Object.getOwnPropertyDescriptor(m,"currentTarget");Object.defineProperty(m,"currentTarget",
{get:function(){return l},configurable:!0});var H=Object.getOwnPropertyDescriptor(m,"eventPhase");Object.defineProperty(m,"eventPhase",{configurable:!0,enumerable:!0,get:function(){return e?Event.CAPTURING_PHASE:Event.BUBBLING_PHASE}});}m.__previousCurrentTarget=m.currentTarget;if(!O(l)&&"slot"!==l.localName||-1!=m.composedPath().indexOf(l))if(m.composed||-1<m.composedPath().indexOf(l))if(Hd(m)&&m.target===m.relatedTarget)m.eventPhase===Event.BUBBLING_PHASE&&m.stopImmediatePropagation();else if(m.eventPhase===
Event.CAPTURING_PHASE||m.bubbles||m.target===l||l instanceof Window){var C="function"===k?b.call(l,m):b.handleEvent&&b.handleEvent(m);l!==this&&(q?(Object.defineProperty(m,"currentTarget",q),q=null):delete m.currentTarget,H?(Object.defineProperty(m,"eventPhase",H),H=null):delete m.eventPhase);return C}};b[vd].push({node:l,type:a,capture:e,once:f,passive:g,lb:h});this.__handlers=this.__handlers||{};this.__handlers[a]=this.__handlers[a]||{capture:[],bubble:[]};this.__handlers[a][e?"capture":"bubble"].push(h);
Gd[a]||this.__shady_native_addEventListener(a,h,d);}}}
function Od(a,b,c){if(b){var d=yd(c);c=d.capture;var e=d.once,f=d.passive,g=d.Ga;d=d.Fa;if(Ad[a])return this.__shady_native_removeEventListener(a,b,d);var h=g||this;g=void 0;var k=null;try{k=b[vd];}catch(l){}k&&(e=Kd(k,h,a,c,e,f),-1<e&&(g=k.splice(e,1)[0].lb,k.length||(b[vd]=void 0)));this.__shady_native_removeEventListener(a,g||b,d);g&&this.__handlers&&this.__handlers[a]&&(a=this.__handlers[a][c?"capture":"bubble"],b=a.indexOf(g),-1<b&&a.splice(b,1));}}
function Pd(){for(var a in Gd)window.__shady_native_addEventListener(a,function(b){b.__target||(Md(b),Jd(b));},!0);}
var Qd=Q({get composed(){void 0===this.__composed&&(wd?this.__composed="focusin"===this.type||"focusout"===this.type||wd(this):!1!==this.isTrusted&&(this.__composed=zd[this.type]));return this.__composed||!1},composedPath:function(){this.__composedPath||(this.__composedPath=Cd(this.__target,this.composed));return this.__composedPath},get target(){return Ed(this.currentTarget||this.__previousCurrentTarget,this.composedPath())},get relatedTarget(){if(!this.__relatedTarget)return null;this.__relatedTargetComposedPath||
(this.__relatedTargetComposedPath=Cd(this.__relatedTarget,!0));return Ed(this.currentTarget||this.__previousCurrentTarget,this.__relatedTargetComposedPath)},stopPropagation:function(){Event.prototype.stopPropagation.call(this);this.ma=!0;},stopImmediatePropagation:function(){Event.prototype.stopImmediatePropagation.call(this);this.ma=this.__immediatePropagationStopped=!0;}});
function Md(a,b){b=void 0===b?a.target:b;a.__target=b;a.__relatedTarget=a.relatedTarget;if(N.B){b=Object.getPrototypeOf(a);if(!b.hasOwnProperty("__shady_patchedProto")){var c=Object.create(b);c.__shady_sourceProto=b;P(c,Qd);b.__shady_patchedProto=c;}a.__proto__=b.__shady_patchedProto;}else P(a,Qd);}var Rd=Fd(Event),Sd=Fd(CustomEvent),Td=Fd(MouseEvent);
function Ud(){if(!wd&&Object.getOwnPropertyDescriptor(Event.prototype,"isTrusted")){var a=function(){var b=new MouseEvent("click",{bubbles:!0,cancelable:!0,composed:!0});this.__shady_dispatchEvent(b);};Element.prototype.click?Element.prototype.click=a:HTMLElement.prototype.click&&(HTMLElement.prototype.click=a);}}
var Vd=Object.getOwnPropertyNames(Element.prototype).filter(function(a){return "on"===a.substring(0,2)}),Wd=Object.getOwnPropertyNames(HTMLElement.prototype).filter(function(a){return "on"===a.substring(0,2)});function Xd(a){return {set:function(b){var c=D(this),d=a.substring(2);c.N||(c.N={});c.N[a]&&this.removeEventListener(d,c.N[a]);this.__shady_addEventListener(d,b);c.N[a]=b;},get:function(){var b=L(this);return b&&b.N&&b.N[a]},configurable:!0}}function Yd(a,b){return {index:a,ba:[],ia:b}}
function Zd(a,b,c,d){var e=0,f=0,g=0,h=0,k=Math.min(b-e,d-f);if(0==e&&0==f)a:{for(g=0;g<k;g++)if(a[g]!==c[g])break a;g=k;}if(b==a.length&&d==c.length){h=a.length;for(var l=c.length,m=0;m<k-g&&$d(a[--h],c[--l]);)m++;h=m;}e+=g;f+=g;b-=h;d-=h;if(0==b-e&&0==d-f)return [];if(e==b){for(b=Yd(e,0);f<d;)b.ba.push(c[f++]);return [b]}if(f==d)return [Yd(e,b-e)];k=e;g=f;d=d-g+1;h=b-k+1;b=Array(d);for(l=0;l<d;l++)b[l]=Array(h),b[l][0]=l;for(l=0;l<h;l++)b[0][l]=l;for(l=1;l<d;l++)for(m=1;m<h;m++)if(a[k+m-1]===c[g+l-1])b[l][m]=
b[l-1][m-1];else {var q=b[l-1][m]+1,H=b[l][m-1]+1;b[l][m]=q<H?q:H;}k=b.length-1;g=b[0].length-1;d=b[k][g];for(a=[];0<k||0<g;)0==k?(a.push(2),g--):0==g?(a.push(3),k--):(h=b[k-1][g-1],l=b[k-1][g],m=b[k][g-1],q=l<m?l<h?l:h:m<h?m:h,q==h?(h==d?a.push(0):(a.push(1),d=h),k--,g--):q==l?(a.push(3),k--,d=l):(a.push(2),g--,d=m));a.reverse();b=void 0;k=[];for(g=0;g<a.length;g++)switch(a[g]){case 0:b&&(k.push(b),b=void 0);e++;f++;break;case 1:b||(b=Yd(e,0));b.ia++;e++;b.ba.push(c[f]);f++;break;case 2:b||(b=Yd(e,
0));b.ia++;e++;break;case 3:b||(b=Yd(e,0)),b.ba.push(c[f]),f++;}b&&k.push(b);return k}function $d(a,b){return a===b}var ae=Q({dispatchEvent:Ld,addEventListener:Nd,removeEventListener:Od});var be=null;function ce(){be||(be=window.ShadyCSS&&window.ShadyCSS.ScopingShim);return be||null}function de(a,b,c){var d=ce();return d&&"class"===b?(d.setElementClass(a,c),!0):!1}function ee(a,b){var c=ce();c&&c.unscopeNode(a,b);}function fe(a,b){var c=ce();if(!c)return !0;if(a.nodeType===Node.DOCUMENT_FRAGMENT_NODE){c=!0;for(a=a.__shady_firstChild;a;a=a.__shady_nextSibling)c=c&&fe(a,b);return c}return a.nodeType!==Node.ELEMENT_NODE?!0:c.currentScopeForNode(a)===b}
function ge(a){if(a.nodeType!==Node.ELEMENT_NODE)return "";var b=ce();return b?b.currentScopeForNode(a):""}function he(a,b){if(a)for(a.nodeType===Node.ELEMENT_NODE&&b(a),a=a.__shady_firstChild;a;a=a.__shady_nextSibling)a.nodeType===Node.ELEMENT_NODE&&he(a,b);}var ie=window.document,je=N.aa,ke=Object.getOwnPropertyDescriptor(Node.prototype,"isConnected"),le=ke&&ke.get;function me(a){for(var b;b=a.__shady_firstChild;)a.__shady_removeChild(b);}function ne(a){var b=L(a);if(b&&void 0!==b.la)for(b=a.__shady_firstChild;b;b=b.__shady_nextSibling)ne(b);if(a=L(a))a.la=void 0;}function oe(a){var b=a;if(a&&"slot"===a.localName){var c=L(a);(c=c&&c.V)&&(b=c.length?c[0]:oe(a.__shady_nextSibling));}return b}
function pe(a,b,c){if(a=(a=L(a))&&a.Z){if(b)if(b.nodeType===Node.DOCUMENT_FRAGMENT_NODE)for(var d=0,e=b.childNodes.length;d<e;d++)a.addedNodes.push(b.childNodes[d]);else a.addedNodes.push(b);c&&a.removedNodes.push(c);Sc(a);}}
var xe=Q({get parentNode(){var a=L(this);a=a&&a.parentNode;return void 0!==a?a:this.__shady_native_parentNode},get firstChild(){var a=L(this);a=a&&a.firstChild;return void 0!==a?a:this.__shady_native_firstChild},get lastChild(){var a=L(this);a=a&&a.lastChild;return void 0!==a?a:this.__shady_native_lastChild},get nextSibling(){var a=L(this);a=a&&a.nextSibling;return void 0!==a?a:this.__shady_native_nextSibling},get previousSibling(){var a=L(this);a=a&&a.previousSibling;return void 0!==a?a:this.__shady_native_previousSibling},
get childNodes(){if(tc(this)){var a=L(this);if(!a.childNodes){a.childNodes=[];for(var b=this.__shady_firstChild;b;b=b.__shady_nextSibling)a.childNodes.push(b);}var c=a.childNodes;}else c=this.__shady_native_childNodes;c.item=function(d){return c[d]};return c},get parentElement(){var a=L(this);(a=a&&a.parentNode)&&a.nodeType!==Node.ELEMENT_NODE&&(a=null);return void 0!==a?a:this.__shady_native_parentElement},get isConnected(){if(le&&le.call(this))return !0;if(this.nodeType==Node.DOCUMENT_FRAGMENT_NODE)return !1;
var a=this.ownerDocument;if(null===a||Cc(a,this))return !0;for(a=this;a&&!(a instanceof Document);)a=a.__shady_parentNode||(O(a)?a.host:void 0);return !!(a&&a instanceof Document)},get textContent(){if(tc(this)){for(var a=[],b=this.__shady_firstChild;b;b=b.__shady_nextSibling)b.nodeType!==Node.COMMENT_NODE&&a.push(b.__shady_textContent);return a.join("")}return this.__shady_native_textContent},set textContent(a){if("undefined"===typeof a||null===a)a="";switch(this.nodeType){case Node.ELEMENT_NODE:case Node.DOCUMENT_FRAGMENT_NODE:if(!tc(this)&&
N.B){var b=this.__shady_firstChild;(b!=this.__shady_lastChild||b&&b.nodeType!=Node.TEXT_NODE)&&me(this);this.__shady_native_textContent=a;}else me(this),(0<a.length||this.nodeType===Node.ELEMENT_NODE)&&this.__shady_insertBefore(document.createTextNode(a));break;default:this.nodeValue=a;}},insertBefore:function(a,b){if(this.ownerDocument!==ie&&a.ownerDocument!==ie)return this.__shady_native_insertBefore(a,b),a;if(a===this)throw Error("Failed to execute 'appendChild' on 'Node': The new child element contains the parent.");
if(b){var c=L(b);c=c&&c.parentNode;if(void 0!==c&&c!==this||void 0===c&&b.__shady_native_parentNode!==this)throw Error("Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.");}if(b===a)return a;pe(this,a);var d=[],e=(c=re(this))?c.host.localName:ge(this),f=a.__shady_parentNode;if(f){var g=ge(a);var h=!!c||!re(a)||je&&void 0!==this.__noInsertionPoint;f.__shady_removeChild(a,h);}f=!0;var k=(!je||void 0===a.__noInsertionPoint&&void 0===
this.__noInsertionPoint)&&!fe(a,e),l=c&&!a.__noInsertionPoint&&(!je||a.nodeType===Node.DOCUMENT_FRAGMENT_NODE);if(l||k)k&&(g=g||ge(a)),he(a,function(m){l&&"slot"===m.localName&&d.push(m);if(k){var q=g;ce()&&(q&&ee(m,q),(q=ce())&&q.scopeNode(m,e));}});d.length&&(se(c),c.c.push.apply(c.c,x(d)),te(c));tc(this)&&(ue(a,this,b),h=L(this),h.root?(f=!1,uc(this)&&te(h.root)):c&&"slot"===this.localName&&(f=!1,te(c)));f?(c=O(this)?this.host:this,b?(b=oe(b),c.__shady_native_insertBefore(a,b)):c.__shady_native_appendChild(a)):
a.ownerDocument!==this.ownerDocument&&this.ownerDocument.adoptNode(a);return a},appendChild:function(a){if(this!=a||!O(a))return this.__shady_insertBefore(a)},removeChild:function(a,b){b=void 0===b?!1:b;if(this.ownerDocument!==ie)return this.__shady_native_removeChild(a);if(a.__shady_parentNode!==this)throw Error("The node to be removed is not a child of this node: "+a);pe(this,null,a);var c=re(a),d=c&&ve(c,a),e=L(this);if(tc(this)&&(we(a,this),uc(this))){te(e.root);var f=!0;}if(ce()&&!b&&c&&a.nodeType!==
Node.TEXT_NODE){var g=ge(a);he(a,function(h){ee(h,g);});}ne(a);c&&((b="slot"===this.localName)&&(f=!0),(d||b)&&te(c));f||(f=O(this)?this.host:this,(!e.root&&"slot"!==a.localName||f===a.__shady_native_parentNode)&&f.__shady_native_removeChild(a));return a},replaceChild:function(a,b){this.__shady_insertBefore(a,b);this.__shady_removeChild(b);return a},cloneNode:function(a){if("template"==this.localName)return this.__shady_native_cloneNode(a);var b=this.__shady_native_cloneNode(!1);if(a&&b.nodeType!==
Node.ATTRIBUTE_NODE){a=this.__shady_firstChild;for(var c;a;a=a.__shady_nextSibling)c=a.__shady_cloneNode(!0),b.__shady_appendChild(c);}return b},getRootNode:function(a){if(this&&this.nodeType){var b=D(this),c=b.la;void 0===c&&(O(this)?(c=this,b.la=c):(c=(c=this.__shady_parentNode)?c.__shady_getRootNode(a):this,document.documentElement.__shady_native_contains(this)&&(b.la=c)));return c}},contains:function(a){return Dc(this,a)}});var ze=Q({get assignedSlot(){var a=this.__shady_parentNode;(a=a&&a.__shady_shadowRoot)&&ye(a);return (a=L(this))&&a.assignedSlot||null}});function Ae(a,b,c){var d=[];Be(a,b,c,d);return d}function Be(a,b,c,d){for(a=a.__shady_firstChild;a;a=a.__shady_nextSibling){var e;if(e=a.nodeType===Node.ELEMENT_NODE){e=a;var f=b,g=c,h=d,k=f(e);k&&h.push(e);g&&g(k)?e=k:(Be(e,f,g,h),e=void 0);}if(e)break}}
var Ce={get firstElementChild(){var a=L(this);if(a&&void 0!==a.firstChild){for(a=this.__shady_firstChild;a&&a.nodeType!==Node.ELEMENT_NODE;)a=a.__shady_nextSibling;return a}return this.__shady_native_firstElementChild},get lastElementChild(){var a=L(this);if(a&&void 0!==a.lastChild){for(a=this.__shady_lastChild;a&&a.nodeType!==Node.ELEMENT_NODE;)a=a.__shady_previousSibling;return a}return this.__shady_native_lastElementChild},get children(){return tc(this)?Ec(Array.prototype.filter.call(Hc(this),
function(a){return a.nodeType===Node.ELEMENT_NODE})):this.__shady_native_children},get childElementCount(){var a=this.__shady_children;return a?a.length:0}},De=Q((Ce.append=function(a){for(var b=[],c=0;c<arguments.length;++c)b[c]=arguments[c];this.__shady_insertBefore(Mc.apply(null,x(b)),null);},Ce.prepend=function(a){for(var b=[],c=0;c<arguments.length;++c)b[c]=arguments[c];this.__shady_insertBefore(Mc.apply(null,x(b)),this.__shady_firstChild);},Ce.replaceChildren=function(a){for(var b=[],c=0;c<arguments.length;++c)b[c]=
arguments[c];for(;null!==(c=this.__shady_firstChild);)this.__shady_removeChild(c);this.__shady_insertBefore(Mc.apply(null,x(b)),null);},Ce)),Ee=Q({querySelector:function(a){return Ae(this,function(b){return xc.call(b,a)},function(b){return !!b})[0]||null},querySelectorAll:function(a,b){if(b){b=Array.prototype.slice.call(this.__shady_native_querySelectorAll(a));var c=this.__shady_getRootNode();return Ec(b.filter(function(d){return d.__shady_getRootNode()==c}))}return Ec(Ae(this,function(d){return xc.call(d,
a)}))}}),Fe=N.aa&&!N.D?Kc({},De):De;Kc(De,Ee);var Ge=Q({after:function(a){for(var b=[],c=0;c<arguments.length;++c)b[c]=arguments[c];c=this.__shady_parentNode;if(null!==c){var d=this.__shady_nextSibling;c.__shady_insertBefore(Mc.apply(null,x(b)),d);}},before:function(a){for(var b=[],c=0;c<arguments.length;++c)b[c]=arguments[c];c=this.__shady_parentNode;null!==c&&c.__shady_insertBefore(Mc.apply(null,x(b)),this);},remove:function(){var a=this.__shady_parentNode;null!==a&&a.__shady_removeChild(this);},replaceWith:function(a){for(var b=[],c=0;c<arguments.length;++c)b[c]=
arguments[c];c=this.__shady_parentNode;if(null!==c){var d=this.__shady_nextSibling;c.__shady_removeChild(this);c.__shady_insertBefore(Mc.apply(null,x(b)),d);}}});var He=window.document;function Ie(a,b){if("slot"===b)a=a.__shady_parentNode,uc(a)&&te(L(a).root);else if("slot"===a.localName&&"name"===b&&(b=re(a))){if(b.a){Je(b);var c=a.La,d=Ke(a);if(d!==c){c=b.b[c];var e=c.indexOf(a);0<=e&&c.splice(e,1);c=b.b[d]||(b.b[d]=[]);c.push(a);1<c.length&&(b.b[d]=Le(c));}}te(b);}}
var Me=Q({get previousElementSibling(){var a=L(this);if(a&&void 0!==a.previousSibling){for(a=this.__shady_previousSibling;a&&a.nodeType!==Node.ELEMENT_NODE;)a=a.__shady_previousSibling;return a}return this.__shady_native_previousElementSibling},get nextElementSibling(){var a=L(this);if(a&&void 0!==a.nextSibling){for(a=this.__shady_nextSibling;a&&a.nodeType!==Node.ELEMENT_NODE;)a=a.__shady_nextSibling;return a}return this.__shady_native_nextElementSibling},get slot(){return this.getAttribute("slot")},
set slot(a){this.__shady_setAttribute("slot",a);},get className(){return this.getAttribute("class")||""},set className(a){this.__shady_setAttribute("class",a);},setAttribute:function(a,b){this.ownerDocument!==He?this.__shady_native_setAttribute(a,b):de(this,a,b)||(this.__shady_native_setAttribute(a,b),Ie(this,a));},removeAttribute:function(a){this.ownerDocument!==He?this.__shady_native_removeAttribute(a):de(this,a,"")?""===this.getAttribute(a)&&this.__shady_native_removeAttribute(a):(this.__shady_native_removeAttribute(a),
Ie(this,a));}});N.aa||Vd.forEach(function(a){Me[a]=Xd(a);});
var Re=Q({attachShadow:function(a){if(!this)throw Error("Must provide a host.");if(!a)throw Error("Not enough arguments.");if(a.shadyUpgradeFragment&&!N.Ia){var b=a.shadyUpgradeFragment;b.__proto__=ShadowRoot.prototype;Ne(b,this,a);Oe(b,b);a=b.__noInsertionPoint?null:b.querySelectorAll("slot");b.__noInsertionPoint=void 0;if(a&&a.length){var c=b;se(c);c.c.push.apply(c.c,x(a));te(b);}b.host.__shady_native_appendChild(b);}else b=new Pe(Qe,this,a);return this.__CE_shadowRoot=b},get shadowRoot(){var a=L(this);
return a&&a.bb||null}});Kc(Me,Re);var Se=document.implementation.createHTMLDocument("inert"),Te=Q({get innerHTML(){return tc(this)?bd("template"===this.localName?this.content:this,Hc):this.__shady_native_innerHTML},set innerHTML(a){if("template"===this.localName)this.__shady_native_innerHTML=a;else {me(this);var b=this.localName||"div";b=this.namespaceURI&&this.namespaceURI!==Se.namespaceURI?Se.createElementNS(this.namespaceURI,b):Se.createElement(b);for(N.B?b.__shady_native_innerHTML=a:b.innerHTML=a;a=b.__shady_firstChild;)this.__shady_insertBefore(a);}}});var Ue=Q({blur:function(){var a=L(this);(a=(a=a&&a.root)&&a.activeElement)?a.__shady_blur():this.__shady_native_blur();}});N.aa||Wd.forEach(function(a){Ue[a]=Xd(a);});var Ve=Q({assignedNodes:function(a){if("slot"===this.localName){var b=this.__shady_getRootNode();b&&O(b)&&ye(b);return (b=L(this))?(a&&a.flatten?b.V:b.assignedNodes)||[]:[]}},addEventListener:function(a,b,c){if("slot"!==this.localName||"slotchange"===a)Nd.call(this,a,b,c);else {"object"!==typeof c&&(c={capture:!!c});var d=this.__shady_parentNode;if(!d)throw Error("ShadyDOM cannot attach event to slot unless it has a `parentNode`");c.O=this;d.__shady_addEventListener(a,b,c);}},removeEventListener:function(a,
b,c){if("slot"!==this.localName||"slotchange"===a)Od.call(this,a,b,c);else {"object"!==typeof c&&(c={capture:!!c});var d=this.__shady_parentNode;if(!d)throw Error("ShadyDOM cannot attach event to slot unless it has a `parentNode`");c.O=this;d.__shady_removeEventListener(a,b,c);}}});var We=Q({getElementById:function(a){return ""===a?null:Ae(this,function(b){return b.id==a},function(b){return !!b})[0]||null}});var Xe=Q({get activeElement(){var a=N.B?document.__shady_native_activeElement:document.activeElement;if(!a||!a.nodeType)return null;var b=!!O(this);if(!(this===document||b&&this.host!==a&&this.host.__shady_native_contains(a)))return null;for(b=re(a);b&&b!==this;)a=b.host,b=re(a);return this===document?b?null:a:b===this?a:null}});var Ye=window.document,Ze=Q({importNode:function(a,b){if(a.ownerDocument!==Ye||"template"===a.localName)return this.__shady_native_importNode(a,b);var c=this.__shady_native_importNode(a,!1);if(b)for(a=a.__shady_firstChild;a;a=a.__shady_nextSibling)b=this.__shady_importNode(a,!0),c.__shady_appendChild(b);return c}});var $e=Q({dispatchEvent:Ld,addEventListener:Nd.bind(window),removeEventListener:Od.bind(window)});var af={};Object.getOwnPropertyDescriptor(HTMLElement.prototype,"parentElement")&&(af.parentElement=xe.parentElement);Object.getOwnPropertyDescriptor(HTMLElement.prototype,"contains")&&(af.contains=xe.contains);Object.getOwnPropertyDescriptor(HTMLElement.prototype,"children")&&(af.children=De.children);Object.getOwnPropertyDescriptor(HTMLElement.prototype,"innerHTML")&&(af.innerHTML=Te.innerHTML);Object.getOwnPropertyDescriptor(HTMLElement.prototype,"className")&&(af.className=Me.className);
var bf={EventTarget:[ae],Node:[xe,window.EventTarget?null:ae],Text:[ze],Comment:[ze],CDATASection:[ze],ProcessingInstruction:[ze],Element:[Me,De,Ge,ze,!N.B||"innerHTML"in Element.prototype?Te:null,window.HTMLSlotElement?null:Ve],HTMLElement:[Ue,af],HTMLSlotElement:[Ve],DocumentFragment:[Fe,We],Document:[Ze,Fe,We,Xe],Window:[$e],CharacterData:[Ge]},cf=N.B?null:["innerHTML","textContent"];function df(a,b,c,d){b.forEach(function(e){return a&&e&&P(a,e,c,d)});}
function ef(a){var b=a?null:cf,c;for(c in bf)df(window[c]&&window[c].prototype,bf[c],a,b);}["Text","Comment","CDATASection","ProcessingInstruction"].forEach(function(a){var b=window[a],c=Object.create(b.prototype);c.__shady_protoIsPatched=!0;df(c,bf.EventTarget);df(c,bf.Node);bf[a]&&df(c,bf[a]);b.prototype.__shady_patchedProto=c;});function ff(a){a.__shady_protoIsPatched=!0;df(a,bf.EventTarget);df(a,bf.Node);df(a,bf.Element);df(a,bf.HTMLElement);df(a,bf.HTMLSlotElement);return a}var gf=N.ua,hf=N.B;function jf(a,b){if(gf&&!a.__shady_protoIsPatched&&!O(a)){var c=Object.getPrototypeOf(a),d=c.hasOwnProperty("__shady_patchedProto")&&c.__shady_patchedProto;d||(d=Object.create(c),ff(d),c.__shady_patchedProto=d);Object.setPrototypeOf(a,d);}hf||(1===b?td(a):2===b&&ud(a));}
function kf(a,b,c,d){jf(a,1);d=d||null;var e=D(a),f=d?D(d):null;e.previousSibling=d?f.previousSibling:b.__shady_lastChild;if(f=L(e.previousSibling))f.nextSibling=a;if(f=L(e.nextSibling=d))f.previousSibling=a;e.parentNode=b;d?d===c.firstChild&&(c.firstChild=a):(c.lastChild=a,c.firstChild||(c.firstChild=a));c.childNodes=null;}
function ue(a,b,c){jf(b,2);var d=D(b);void 0!==d.firstChild&&(d.childNodes=null);if(a.nodeType===Node.DOCUMENT_FRAGMENT_NODE)for(a=a.__shady_native_firstChild;a;a=a.__shady_native_nextSibling)kf(a,b,d,c);else kf(a,b,d,c);}
function we(a,b){var c=D(a);b=D(b);a===b.firstChild&&(b.firstChild=c.nextSibling);a===b.lastChild&&(b.lastChild=c.previousSibling);a=c.previousSibling;var d=c.nextSibling;a&&(D(a).nextSibling=d);d&&(D(d).previousSibling=a);c.parentNode=c.previousSibling=c.nextSibling=void 0;void 0!==b.childNodes&&(b.childNodes=null);}
function Oe(a,b){var c=D(a);if(b||void 0===c.firstChild){c.childNodes=null;var d=c.firstChild=a.__shady_native_firstChild;c.lastChild=a.__shady_native_lastChild;jf(a,2);c=d;for(d=void 0;c;c=c.__shady_native_nextSibling){var e=D(c);e.parentNode=b||a;e.nextSibling=c.__shady_native_nextSibling;e.previousSibling=d||null;d=c;jf(c,1);}}}var lf=Q({addEventListener:function(a,b,c){"object"!==typeof c&&(c={capture:!!c});c.O=c.O||this;this.host.__shady_addEventListener(a,b,c);},removeEventListener:function(a,b,c){"object"!==typeof c&&(c={capture:!!c});c.O=c.O||this;this.host.__shady_removeEventListener(a,b,c);}});function mf(a,b){P(a,lf,b);P(a,Xe,b);P(a,Te,b);P(a,De,b);N.D&&!b?(P(a,xe,b),P(a,We,b)):N.B||(P(a,qd),P(a,od),P(a,pd));}var Qe={},nf=N.deferConnectionCallbacks&&"loading"===document.readyState,of;function pf(a){var b=[];do b.unshift(a);while(a=a.__shady_parentNode);return b}function Pe(a,b,c){if(a!==Qe)throw new TypeError("Illegal constructor");this.a=null;Ne(this,b,c);}
function Ne(a,b,c){a.host=b;a.mode=c&&c.mode;Oe(a.host);b=D(a.host);b.root=a;b.bb="closed"!==a.mode?a:null;b=D(a);b.firstChild=b.lastChild=b.parentNode=b.nextSibling=b.previousSibling=null;if(N.preferPerformance)for(;b=a.host.__shady_native_firstChild;)a.host.__shady_native_removeChild(b);else te(a);}function te(a){a.T||(a.T=!0,Pc(function(){return ye(a)}));}
function ye(a){var b;if(b=a.T){for(var c;a;)a:{a.T&&(c=a),b=a;a=b.host.__shady_getRootNode();if(O(a)&&(b=L(b.host))&&0<b.da)break a;a=void 0;}b=c;}(c=b)&&c._renderSelf();}
Pe.prototype._renderSelf=function(){var a=nf;nf=!0;this.T=!1;if(this.a){Je(this);for(var b=0,c;b<this.a.length;b++){c=this.a[b];var d=L(c),e=d.assignedNodes;d.assignedNodes=[];d.V=[];if(d.Ba=e)for(d=0;d<e.length;d++){var f=L(e[d]);f.oa=f.assignedSlot;f.assignedSlot===c&&(f.assignedSlot=null);}}for(b=this.host.__shady_firstChild;b;b=b.__shady_nextSibling)qf(this,b);for(b=0;b<this.a.length;b++){c=this.a[b];e=L(c);if(!e.assignedNodes.length)for(d=c.__shady_firstChild;d;d=d.__shady_nextSibling)qf(this,
d,c);(d=(d=L(c.__shady_parentNode))&&d.root)&&(vc(d)||d.T)&&d._renderSelf();rf(this,e.V,e.assignedNodes);if(d=e.Ba){for(f=0;f<d.length;f++)L(d[f]).oa=null;e.Ba=null;d.length>e.assignedNodes.length&&(e.ra=!0);}e.ra&&(e.ra=!1,sf(this,c));}c=this.a;b=[];for(e=0;e<c.length;e++)d=c[e].__shady_parentNode,(f=L(d))&&f.root||!(0>b.indexOf(d))||b.push(d);for(c=0;c<b.length;c++){f=b[c];e=f===this?this.host:f;d=[];for(f=f.__shady_firstChild;f;f=f.__shady_nextSibling)if("slot"==f.localName)for(var g=L(f).V,h=0;h<
g.length;h++)d.push(g[h]);else d.push(f);f=Fc(e);g=Zd(d,d.length,f,f.length);for(var k=h=0,l=void 0;h<g.length&&(l=g[h]);h++){for(var m=0,q=void 0;m<l.ba.length&&(q=l.ba[m]);m++)q.__shady_native_parentNode===e&&e.__shady_native_removeChild(q),f.splice(l.index+k,1);k-=l.ia;}k=0;for(l=void 0;k<g.length&&(l=g[k]);k++)for(h=f[l.index],m=l.index;m<l.index+l.ia;m++)q=d[m],e.__shady_native_insertBefore(q,h),f.splice(m,0,q);}}if(!N.preferPerformance&&!this.Aa)for(b=this.host.__shady_firstChild;b;b=b.__shady_nextSibling)c=
L(b),b.__shady_native_parentNode!==this.host||"slot"!==b.localName&&c.assignedSlot||this.host.__shady_native_removeChild(b);this.Aa=!0;nf=a;of&&of();};function qf(a,b,c){var d=D(b),e=d.oa;d.oa=null;c||(c=(a=a.b[b.__shady_slot||"__catchall"])&&a[0]);c?(D(c).assignedNodes.push(b),d.assignedSlot=c):d.assignedSlot=void 0;e!==d.assignedSlot&&d.assignedSlot&&(D(d.assignedSlot).ra=!0);}
function rf(a,b,c){for(var d=0,e=void 0;d<c.length&&(e=c[d]);d++)if("slot"==e.localName){var f=L(e).assignedNodes;f&&f.length&&rf(a,b,f);}else b.push(c[d]);}function sf(a,b){b.__shady_native_dispatchEvent(new Event("slotchange"));b=L(b);b.assignedSlot&&sf(a,b.assignedSlot);}function se(a){a.c=a.c||[];a.a=a.a||[];a.b=a.b||{};}
function Je(a){if(a.c&&a.c.length){for(var b=a.c,c,d=0;d<b.length;d++){var e=b[d];Oe(e);var f=e.__shady_parentNode;Oe(f);f=L(f);f.da=(f.da||0)+1;f=Ke(e);a.b[f]?(c=c||{},c[f]=!0,a.b[f].push(e)):a.b[f]=[e];a.a.push(e);}if(c)for(var g in c)a.b[g]=Le(a.b[g]);a.c=[];}}function Ke(a){var b=a.name||a.getAttribute("name")||"__catchall";return a.La=b}
function Le(a){return a.sort(function(b,c){b=pf(b);for(var d=pf(c),e=0;e<b.length;e++){c=b[e];var f=d[e];if(c!==f)return b=Hc(c.__shady_parentNode),b.indexOf(c)-b.indexOf(f)}})}
function ve(a,b){if(a.a){Je(a);var c=a.b,d;for(d in c)for(var e=c[d],f=0;f<e.length;f++){var g=e[f];if(Dc(b,g)){e.splice(f,1);var h=a.a.indexOf(g);0<=h&&(a.a.splice(h,1),(h=L(g.__shady_parentNode))&&h.da&&h.da--);f--;g=L(g);if(h=g.V)for(var k=0;k<h.length;k++){var l=h[k],m=l.__shady_native_parentNode;m&&m.__shady_native_removeChild(l);}g.V=[];g.assignedNodes=[];h=!0;}}return h}}function vc(a){Je(a);return !(!a.a||!a.a.length)}
(function(a){a.__proto__=DocumentFragment.prototype;mf(a,"__shady_");mf(a);Object.defineProperties(a,{nodeType:{value:Node.DOCUMENT_FRAGMENT_NODE,configurable:!0},nodeName:{value:"#document-fragment",configurable:!0},nodeValue:{value:null,configurable:!0}});["localName","namespaceURI","prefix"].forEach(function(b){Object.defineProperty(a,b,{value:void 0,configurable:!0});});["ownerDocument","baseURI","isConnected"].forEach(function(b){Object.defineProperty(a,b,{get:function(){return this.host[b]},
configurable:!0});});})(Pe.prototype);
if(window.customElements&&window.customElements.define&&N.sa&&!N.preferPerformance){var tf=new Map;of=function(){var a=[];tf.forEach(function(d,e){a.push([e,d]);});tf.clear();for(var b=0;b<a.length;b++){var c=a[b][0];a[b][1]?c.__shadydom_connectedCallback():c.__shadydom_disconnectedCallback();}};nf&&document.addEventListener("readystatechange",function(){nf=!1;of();},{once:!0});var uf=function(a,b,c){var d=0,e="__isConnected"+d++;if(b||c)a.prototype.connectedCallback=a.prototype.__shadydom_connectedCallback=
function(){nf?tf.set(this,!0):this[e]||(this[e]=!0,b&&b.call(this));},a.prototype.disconnectedCallback=a.prototype.__shadydom_disconnectedCallback=function(){nf?this.isConnected||tf.set(this,!1):this[e]&&(this[e]=!1,c&&c.call(this));};return a},vf=window.customElements.define,wf=function(a,b){var c=b.prototype.connectedCallback,d=b.prototype.disconnectedCallback;vf.call(window.customElements,a,uf(b,c,d));b.prototype.connectedCallback=c;b.prototype.disconnectedCallback=d;};window.customElements.define=
wf;Object.defineProperty(window.CustomElementRegistry.prototype,"define",{value:wf,configurable:!0});}function re(a){a=a.__shady_getRootNode();if(O(a))return a}function xf(a){this.node=a;}v=xf.prototype;v.addEventListener=function(a,b,c){return this.node.__shady_addEventListener(a,b,c)};v.removeEventListener=function(a,b,c){return this.node.__shady_removeEventListener(a,b,c)};v.appendChild=function(a){return this.node.__shady_appendChild(a)};v.insertBefore=function(a,b){return this.node.__shady_insertBefore(a,b)};v.removeChild=function(a){return this.node.__shady_removeChild(a)};v.replaceChild=function(a,b){return this.node.__shady_replaceChild(a,b)};
v.cloneNode=function(a){return this.node.__shady_cloneNode(a)};v.getRootNode=function(a){return this.node.__shady_getRootNode(a)};v.contains=function(a){return this.node.__shady_contains(a)};v.dispatchEvent=function(a){return this.node.__shady_dispatchEvent(a)};v.setAttribute=function(a,b){this.node.__shady_setAttribute(a,b);};v.getAttribute=function(a){return this.node.__shady_native_getAttribute(a)};v.hasAttribute=function(a){return this.node.__shady_native_hasAttribute(a)};v.removeAttribute=function(a){this.node.__shady_removeAttribute(a);};
v.attachShadow=function(a){return this.node.__shady_attachShadow(a)};v.focus=function(){this.node.__shady_native_focus();};v.blur=function(){this.node.__shady_blur();};v.importNode=function(a,b){if(this.node.nodeType===Node.DOCUMENT_NODE)return this.node.__shady_importNode(a,b)};v.getElementById=function(a){if(this.node.nodeType===Node.DOCUMENT_NODE)return this.node.__shady_getElementById(a)};v.querySelector=function(a){return this.node.__shady_querySelector(a)};
v.querySelectorAll=function(a,b){return this.node.__shady_querySelectorAll(a,b)};v.assignedNodes=function(a){if("slot"===this.node.localName)return this.node.__shady_assignedNodes(a)};v.append=function(a){for(var b=[],c=0;c<arguments.length;++c)b[c]=arguments[c];return this.node.__shady_append.apply(this.node,x(b))};v.prepend=function(a){for(var b=[],c=0;c<arguments.length;++c)b[c]=arguments[c];return this.node.__shady_prepend.apply(this.node,x(b))};
v.after=function(a){for(var b=[],c=0;c<arguments.length;++c)b[c]=arguments[c];return this.node.__shady_after.apply(this.node,x(b))};v.before=function(a){for(var b=[],c=0;c<arguments.length;++c)b[c]=arguments[c];return this.node.__shady_before.apply(this.node,x(b))};v.remove=function(){return this.node.__shady_remove()};v.replaceWith=function(a){for(var b=[],c=0;c<arguments.length;++c)b[c]=arguments[c];return this.node.__shady_replaceWith.apply(this.node,x(b))};
da.Object.defineProperties(xf.prototype,{activeElement:{configurable:!0,enumerable:!0,get:function(){if(O(this.node)||this.node.nodeType===Node.DOCUMENT_NODE)return this.node.__shady_activeElement}},_activeElement:{configurable:!0,enumerable:!0,get:function(){return this.activeElement}},host:{configurable:!0,enumerable:!0,get:function(){if(O(this.node))return this.node.host}},parentNode:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_parentNode}},firstChild:{configurable:!0,
enumerable:!0,get:function(){return this.node.__shady_firstChild}},lastChild:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_lastChild}},nextSibling:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_nextSibling}},previousSibling:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_previousSibling}},childNodes:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_childNodes}},parentElement:{configurable:!0,enumerable:!0,
get:function(){return this.node.__shady_parentElement}},firstElementChild:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_firstElementChild}},lastElementChild:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_lastElementChild}},nextElementSibling:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_nextElementSibling}},previousElementSibling:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_previousElementSibling}},
children:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_children}},childElementCount:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_childElementCount}},shadowRoot:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_shadowRoot}},assignedSlot:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_assignedSlot}},isConnected:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_isConnected}},innerHTML:{configurable:!0,
enumerable:!0,get:function(){return this.node.__shady_innerHTML},set:function(a){this.node.__shady_innerHTML=a;}},textContent:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_textContent},set:function(a){this.node.__shady_textContent=a;}},slot:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_slot},set:function(a){this.node.__shady_slot=a;}},className:{configurable:!0,enumerable:!0,get:function(){return this.node.__shady_className},set:function(a){return this.node.__shady_className=
a}}});function yf(a){Object.defineProperty(xf.prototype,a,{get:function(){return this.node["__shady_"+a]},set:function(b){this.node["__shady_"+a]=b;},configurable:!0});}Vd.forEach(function(a){return yf(a)});Wd.forEach(function(a){return yf(a)});var zf=new WeakMap;function Af(a){if(O(a)||a instanceof xf)return a;var b=zf.get(a);b||(b=new xf(a),zf.set(a,b));return b}if(N.sa){var Bf=N.B?function(a){return a}:function(a){ud(a);td(a);return a},ShadyDOM={inUse:N.sa,patch:Bf,isShadyRoot:O,enqueue:Pc,flush:Qc,flushInitial:function(a){!a.Aa&&a.T&&ye(a);},settings:N,filterMutations:Vc,observeChildren:Tc,unobserveChildren:Uc,deferConnectionCallbacks:N.deferConnectionCallbacks,preferPerformance:N.preferPerformance,handlesDynamicScoping:!0,wrap:N.D?Af:Bf,wrapIfNeeded:!0===N.D?Af:function(a){return a},Wrapper:xf,composedPath:Dd,noPatch:N.D,patchOnDemand:N.ua,nativeMethods:dd,
nativeTree:ed,patchElementProto:ff};window.ShadyDOM=ShadyDOM;nd();ef("__shady_");Object.defineProperty(document,"_activeElement",Xe.activeElement);P(Window.prototype,$e,"__shady_");N.D?N.ua&&P(Element.prototype,Re):(ef(),Ud());Pd();window.Event=Rd;window.CustomEvent=Sd;window.MouseEvent=Td;window.ShadowRoot=Pe;}var Cf=window.Document.prototype.createElement,Df=window.Document.prototype.createElementNS,Ef=window.Document.prototype.importNode,Ff=window.Document.prototype.prepend,Gf=window.Document.prototype.append,Hf=window.DocumentFragment.prototype.prepend,If=window.DocumentFragment.prototype.append,Jf=window.Node.prototype.cloneNode,Kf=window.Node.prototype.appendChild,Lf=window.Node.prototype.insertBefore,Mf=window.Node.prototype.removeChild,Nf=window.Node.prototype.replaceChild,Of=Object.getOwnPropertyDescriptor(window.Node.prototype,
"textContent"),Pf=window.Element.prototype.attachShadow,Qf=Object.getOwnPropertyDescriptor(window.Element.prototype,"innerHTML"),Rf=window.Element.prototype.getAttribute,Sf=window.Element.prototype.setAttribute,Tf=window.Element.prototype.removeAttribute,Uf=window.Element.prototype.getAttributeNS,Vf=window.Element.prototype.setAttributeNS,Wf=window.Element.prototype.removeAttributeNS,Xf=window.Element.prototype.insertAdjacentElement,Yf=window.Element.prototype.insertAdjacentHTML,Zf=window.Element.prototype.prepend,
$f=window.Element.prototype.append,ag=window.Element.prototype.before,bg=window.Element.prototype.after,cg=window.Element.prototype.replaceWith,dg=window.Element.prototype.remove,eg=window.HTMLElement,fg=Object.getOwnPropertyDescriptor(window.HTMLElement.prototype,"innerHTML"),gg=window.HTMLElement.prototype.insertAdjacentElement,hg=window.HTMLElement.prototype.insertAdjacentHTML;var ig=new Set;"annotation-xml color-profile font-face font-face-src font-face-uri font-face-format font-face-name missing-glyph".split(" ").forEach(function(a){return ig.add(a)});function jg(a){var b=ig.has(a);a=/^[a-z][.0-9_a-z]*-[-.0-9_a-z]*$/.test(a);return !b&&a}var kg=document.contains?document.contains.bind(document):document.documentElement.contains.bind(document.documentElement);
function T(a){var b=a.isConnected;if(void 0!==b)return b;if(kg(a))return !0;for(;a&&!(a.__CE_isImportDocument||a instanceof Document);)a=a.parentNode||(window.ShadowRoot&&a instanceof ShadowRoot?a.host:void 0);return !(!a||!(a.__CE_isImportDocument||a instanceof Document))}function lg(a){var b=a.children;if(b)return Array.prototype.slice.call(b);b=[];for(a=a.firstChild;a;a=a.nextSibling)a.nodeType===Node.ELEMENT_NODE&&b.push(a);return b}
function mg(a,b){for(;b&&b!==a&&!b.nextSibling;)b=b.parentNode;return b&&b!==a?b.nextSibling:null}
function ng(a,b,c){for(var d=a;d;){if(d.nodeType===Node.ELEMENT_NODE){var e=d;b(e);var f=e.localName;if("link"===f&&"import"===e.getAttribute("rel")){d=e.import;void 0===c&&(c=new Set);if(d instanceof Node&&!c.has(d))for(c.add(d),d=d.firstChild;d;d=d.nextSibling)ng(d,b,c);d=mg(a,e);continue}else if("template"===f){d=mg(a,e);continue}if(e=e.__CE_shadowRoot)for(e=e.firstChild;e;e=e.nextSibling)ng(e,b,c);}d=d.firstChild?d.firstChild:mg(a,d);}}function og(){var a=!(null===pg||void 0===pg||!pg.noDocumentConstructionObserver),b=!(null===pg||void 0===pg||!pg.shadyDomFastWalk);this.X=[];this.a=[];this.R=!1;this.shadyDomFastWalk=b;this.jb=!a;}function qg(a,b,c,d){var e=window.ShadyDom;if(a.shadyDomFastWalk&&e&&e.inUse){if(b.nodeType===Node.ELEMENT_NODE&&c(b),b.querySelectorAll)for(a=e.nativeMethods.querySelectorAll.call(b,"*"),b=0;b<a.length;b++)c(a[b]);}else ng(b,c,d);}function rg(a,b){a.R=!0;a.X.push(b);}function sg(a,b){a.R=!0;a.a.push(b);}
function tg(a,b){a.R&&qg(a,b,function(c){return ug(a,c)});}function ug(a,b){if(a.R&&!b.__CE_patched){b.__CE_patched=!0;for(var c=0;c<a.X.length;c++)a.X[c](b);for(c=0;c<a.a.length;c++)a.a[c](b);}}function vg(a,b){var c=[];qg(a,b,function(e){return c.push(e)});for(b=0;b<c.length;b++){var d=c[b];1===d.__CE_state?a.connectedCallback(d):wg(a,d);}}function xg(a,b){var c=[];qg(a,b,function(e){return c.push(e)});for(b=0;b<c.length;b++){var d=c[b];1===d.__CE_state&&a.disconnectedCallback(d);}}
function yg(a,b,c){c=void 0===c?{}:c;var d=c.kb,e=c.upgrade||function(g){return wg(a,g)},f=[];qg(a,b,function(g){a.R&&ug(a,g);if("link"===g.localName&&"import"===g.getAttribute("rel")){var h=g.import;h instanceof Node&&(h.__CE_isImportDocument=!0,h.__CE_registry=document.__CE_registry);h&&"complete"===h.readyState?h.__CE_documentLoadHandled=!0:g.addEventListener("load",function(){var k=g.import;if(!k.__CE_documentLoadHandled){k.__CE_documentLoadHandled=!0;var l=new Set;d&&(d.forEach(function(m){return l.add(m)}),
l.delete(k));yg(a,k,{kb:l,upgrade:e});}});}else f.push(g);},d);for(b=0;b<f.length;b++)e(f[b]);}
function wg(a,b){try{var c=b.ownerDocument,d=c.__CE_registry;var e=d&&(c.defaultView||c.__CE_isImportDocument)?zg(d,b.localName):void 0;if(e&&void 0===b.__CE_state){e.constructionStack.push(b);try{try{if(new e.constructorFunction!==b)throw Error("The custom element constructor did not produce the element being upgraded.");}finally{e.constructionStack.pop();}}catch(k){throw b.__CE_state=2,k;}b.__CE_state=1;b.__CE_definition=e;if(e.attributeChangedCallback&&b.hasAttributes()){var f=e.observedAttributes;
for(e=0;e<f.length;e++){var g=f[e],h=b.getAttribute(g);null!==h&&a.attributeChangedCallback(b,g,null,h,null);}}T(b)&&a.connectedCallback(b);}}catch(k){Ag(k);}}og.prototype.connectedCallback=function(a){var b=a.__CE_definition;if(b.connectedCallback)try{b.connectedCallback.call(a);}catch(c){Ag(c);}};og.prototype.disconnectedCallback=function(a){var b=a.__CE_definition;if(b.disconnectedCallback)try{b.disconnectedCallback.call(a);}catch(c){Ag(c);}};
og.prototype.attributeChangedCallback=function(a,b,c,d,e){var f=a.__CE_definition;if(f.attributeChangedCallback&&-1<f.observedAttributes.indexOf(b))try{f.attributeChangedCallback.call(a,b,c,d,e);}catch(g){Ag(g);}};
function Bg(a,b,c,d){var e=b.__CE_registry;if(e&&(null===d||"http://www.w3.org/1999/xhtml"===d)&&(e=zg(e,c)))try{var f=new e.constructorFunction;if(void 0===f.__CE_state||void 0===f.__CE_definition)throw Error("Failed to construct '"+c+"': The returned value was not constructed with the HTMLElement constructor.");if("http://www.w3.org/1999/xhtml"!==f.namespaceURI)throw Error("Failed to construct '"+c+"': The constructed element's namespace must be the HTML namespace.");if(f.hasAttributes())throw Error("Failed to construct '"+
c+"': The constructed element must not have any attributes.");if(null!==f.firstChild)throw Error("Failed to construct '"+c+"': The constructed element must not have any children.");if(null!==f.parentNode)throw Error("Failed to construct '"+c+"': The constructed element must not have a parent node.");if(f.ownerDocument!==b)throw Error("Failed to construct '"+c+"': The constructed element's owner document is incorrect.");if(f.localName!==c)throw Error("Failed to construct '"+c+"': The constructed element's local name is incorrect.");
return f}catch(g){return Ag(g),b=null===d?Cf.call(b,c):Df.call(b,d,c),Object.setPrototypeOf(b,HTMLUnknownElement.prototype),b.__CE_state=2,b.__CE_definition=void 0,ug(a,b),b}b=null===d?Cf.call(b,c):Df.call(b,d,c);ug(a,b);return b}
function Ag(a){var b=a.message,c=a.sourceURL||a.fileName||"",d=a.line||a.lineNumber||0,e=a.column||a.columnNumber||0,f=void 0;void 0===ErrorEvent.prototype.initErrorEvent?f=new ErrorEvent("error",{cancelable:!0,message:b,filename:c,lineno:d,colno:e,error:a}):(f=document.createEvent("ErrorEvent"),f.initErrorEvent("error",!1,!0,b,c,d),f.preventDefault=function(){Object.defineProperty(this,"defaultPrevented",{configurable:!0,get:function(){return !0}});});void 0===f.error&&Object.defineProperty(f,"error",
{configurable:!0,enumerable:!0,get:function(){return a}});window.dispatchEvent(f);f.defaultPrevented||console.error(a);}function Cg(){var a=this;this.C=void 0;this.Ca=new Promise(function(b){a.a=b;});}Cg.prototype.resolve=function(a){if(this.C)throw Error("Already resolved.");this.C=a;this.a(a);};function Dg(a){var b=document;this.S=void 0;this.M=a;this.a=b;yg(this.M,this.a);"loading"===this.a.readyState&&(this.S=new MutationObserver(this.b.bind(this)),this.S.observe(this.a,{childList:!0,subtree:!0}));}function Eg(a){a.S&&a.S.disconnect();}Dg.prototype.b=function(a){var b=this.a.readyState;"interactive"!==b&&"complete"!==b||Eg(this);for(b=0;b<a.length;b++)for(var c=a[b].addedNodes,d=0;d<c.length;d++)yg(this.M,c[d]);};function U(a){this.fa=new Map;this.ga=new Map;this.xa=new Map;this.na=!1;this.qa=new Map;this.ea=function(b){return b()};this.P=!1;this.ha=[];this.M=a;this.ya=a.jb?new Dg(a):void 0;}v=U.prototype;v.$a=function(a,b){var c=this;if(!(b instanceof Function))throw new TypeError("Custom element constructor getters must be functions.");Fg(this,a);this.fa.set(a,b);this.ha.push(a);this.P||(this.P=!0,this.ea(function(){return Gg(c)}));};
v.define=function(a,b){var c=this;if(!(b instanceof Function))throw new TypeError("Custom element constructors must be functions.");Fg(this,a);Hg(this,a,b);this.ha.push(a);this.P||(this.P=!0,this.ea(function(){return Gg(c)}));};function Fg(a,b){if(!jg(b))throw new SyntaxError("The element name '"+b+"' is not valid.");if(zg(a,b))throw Error("A custom element with name '"+(b+"' has already been defined."));if(a.na)throw Error("A custom element is already being defined.");}
function Hg(a,b,c){a.na=!0;var d;try{var e=c.prototype;if(!(e instanceof Object))throw new TypeError("The custom element constructor's prototype is not an object.");var f=function(m){var q=e[m];if(void 0!==q&&!(q instanceof Function))throw Error("The '"+m+"' callback must be a function.");return q};var g=f("connectedCallback");var h=f("disconnectedCallback");var k=f("adoptedCallback");var l=(d=f("attributeChangedCallback"))&&c.observedAttributes||[];}catch(m){throw m;}finally{a.na=!1;}c={localName:b,
constructorFunction:c,connectedCallback:g,disconnectedCallback:h,adoptedCallback:k,attributeChangedCallback:d,observedAttributes:l,constructionStack:[]};a.ga.set(b,c);a.xa.set(c.constructorFunction,c);return c}v.upgrade=function(a){yg(this.M,a);};
function Gg(a){if(!1!==a.P){a.P=!1;for(var b=[],c=a.ha,d=new Map,e=0;e<c.length;e++)d.set(c[e],[]);yg(a.M,document,{upgrade:function(k){if(void 0===k.__CE_state){var l=k.localName,m=d.get(l);m?m.push(k):a.ga.has(l)&&b.push(k);}}});for(e=0;e<b.length;e++)wg(a.M,b[e]);for(e=0;e<c.length;e++){for(var f=c[e],g=d.get(f),h=0;h<g.length;h++)wg(a.M,g[h]);(f=a.qa.get(f))&&f.resolve(void 0);}c.length=0;}}v.get=function(a){if(a=zg(this,a))return a.constructorFunction};
v.whenDefined=function(a){if(!jg(a))return Promise.reject(new SyntaxError("'"+a+"' is not a valid custom element name."));var b=this.qa.get(a);if(b)return b.Ca;b=new Cg;this.qa.set(a,b);var c=this.ga.has(a)||this.fa.has(a);a=-1===this.ha.indexOf(a);c&&a&&b.resolve(void 0);return b.Ca};v.polyfillWrapFlushCallback=function(a){this.ya&&Eg(this.ya);var b=this.ea;this.ea=function(c){return a(function(){return b(c)})};};
function zg(a,b){var c=a.ga.get(b);if(c)return c;if(c=a.fa.get(b)){a.fa.delete(b);try{return Hg(a,b,c())}catch(d){Ag(d);}}}window.CustomElementRegistry=U;U.prototype.define=U.prototype.define;U.prototype.upgrade=U.prototype.upgrade;U.prototype.get=U.prototype.get;U.prototype.whenDefined=U.prototype.whenDefined;U.prototype.polyfillDefineLazy=U.prototype.$a;U.prototype.polyfillWrapFlushCallback=U.prototype.polyfillWrapFlushCallback;function Ig(a,b,c){function d(e){return function(f){for(var g=[],h=0;h<arguments.length;++h)g[h]=arguments[h];h=[];for(var k=[],l=0;l<g.length;l++){var m=g[l];m instanceof Element&&T(m)&&k.push(m);if(m instanceof DocumentFragment)for(m=m.firstChild;m;m=m.nextSibling)h.push(m);else h.push(m);}e.apply(this,g);for(g=0;g<k.length;g++)xg(a,k[g]);if(T(this))for(g=0;g<h.length;g++)k=h[g],k instanceof Element&&vg(a,k);}}void 0!==c.prepend&&(b.prepend=d(c.prepend));void 0!==c.append&&(b.append=d(c.append));}
function Jg(a){Document.prototype.createElement=function(b){return Bg(a,this,b,null)};Document.prototype.importNode=function(b,c){b=Ef.call(this,b,!!c);this.__CE_registry?yg(a,b):tg(a,b);return b};Document.prototype.createElementNS=function(b,c){return Bg(a,this,c,b)};Ig(a,Document.prototype,{prepend:Ff,append:Gf});}function Kg(a){function b(d){return function(e){for(var f=[],g=0;g<arguments.length;++g)f[g]=arguments[g];g=[];for(var h=[],k=0;k<f.length;k++){var l=f[k];l instanceof Element&&T(l)&&h.push(l);if(l instanceof DocumentFragment)for(l=l.firstChild;l;l=l.nextSibling)g.push(l);else g.push(l);}d.apply(this,f);for(f=0;f<h.length;f++)xg(a,h[f]);if(T(this))for(f=0;f<g.length;f++)h=g[f],h instanceof Element&&vg(a,h);}}var c=Element.prototype;void 0!==ag&&(c.before=b(ag));void 0!==bg&&(c.after=b(bg));void 0!==
cg&&(c.replaceWith=function(d){for(var e=[],f=0;f<arguments.length;++f)e[f]=arguments[f];f=[];for(var g=[],h=0;h<e.length;h++){var k=e[h];k instanceof Element&&T(k)&&g.push(k);if(k instanceof DocumentFragment)for(k=k.firstChild;k;k=k.nextSibling)f.push(k);else f.push(k);}h=T(this);cg.apply(this,e);for(e=0;e<g.length;e++)xg(a,g[e]);if(h)for(xg(a,this),e=0;e<f.length;e++)g=f[e],g instanceof Element&&vg(a,g);});void 0!==dg&&(c.remove=function(){var d=T(this);dg.call(this);d&&xg(a,this);});}function Lg(a){function b(e,f){Object.defineProperty(e,"innerHTML",{enumerable:f.enumerable,configurable:!0,get:f.get,set:function(g){var h=this,k=void 0;T(this)&&(k=[],qg(a,this,function(q){q!==h&&k.push(q);}));f.set.call(this,g);if(k)for(var l=0;l<k.length;l++){var m=k[l];1===m.__CE_state&&a.disconnectedCallback(m);}this.ownerDocument.__CE_registry?yg(a,this):tg(a,this);return g}});}function c(e,f){e.insertAdjacentElement=function(g,h){var k=T(h);g=f.call(this,g,h);k&&xg(a,h);T(g)&&vg(a,h);return g};}
function d(e,f){function g(h,k){for(var l=[];h!==k;h=h.nextSibling)l.push(h);for(k=0;k<l.length;k++)yg(a,l[k]);}e.insertAdjacentHTML=function(h,k){h=h.toLowerCase();if("beforebegin"===h){var l=this.previousSibling;f.call(this,h,k);g(l||this.parentNode.firstChild,this);}else if("afterbegin"===h)l=this.firstChild,f.call(this,h,k),g(this.firstChild,l);else if("beforeend"===h)l=this.lastChild,f.call(this,h,k),g(l||this.firstChild,null);else if("afterend"===h)l=this.nextSibling,f.call(this,h,k),g(this.nextSibling,
l);else throw new SyntaxError("The value provided ("+String(h)+") is not one of 'beforebegin', 'afterbegin', 'beforeend', or 'afterend'.");};}Pf&&(Element.prototype.attachShadow=function(e){e=Pf.call(this,e);if(a.R&&!e.__CE_patched){e.__CE_patched=!0;for(var f=0;f<a.X.length;f++)a.X[f](e);}return this.__CE_shadowRoot=e});Qf&&Qf.get?b(Element.prototype,Qf):fg&&fg.get?b(HTMLElement.prototype,fg):sg(a,function(e){b(e,{enumerable:!0,configurable:!0,get:function(){return Jf.call(this,!0).innerHTML},set:function(f){var g=
"template"===this.localName,h=g?this.content:this,k=Df.call(document,this.namespaceURI,this.localName);for(k.innerHTML=f;0<h.childNodes.length;)Mf.call(h,h.childNodes[0]);for(f=g?k.content:k;0<f.childNodes.length;)Kf.call(h,f.childNodes[0]);}});});Element.prototype.setAttribute=function(e,f){if(1!==this.__CE_state)return Sf.call(this,e,f);var g=Rf.call(this,e);Sf.call(this,e,f);f=Rf.call(this,e);a.attributeChangedCallback(this,e,g,f,null);};Element.prototype.setAttributeNS=function(e,f,g){if(1!==this.__CE_state)return Vf.call(this,
e,f,g);var h=Uf.call(this,e,f);Vf.call(this,e,f,g);g=Uf.call(this,e,f);a.attributeChangedCallback(this,f,h,g,e);};Element.prototype.removeAttribute=function(e){if(1!==this.__CE_state)return Tf.call(this,e);var f=Rf.call(this,e);Tf.call(this,e);null!==f&&a.attributeChangedCallback(this,e,f,null,null);};Element.prototype.removeAttributeNS=function(e,f){if(1!==this.__CE_state)return Wf.call(this,e,f);var g=Uf.call(this,e,f);Wf.call(this,e,f);var h=Uf.call(this,e,f);g!==h&&a.attributeChangedCallback(this,
f,g,h,e);};gg?c(HTMLElement.prototype,gg):Xf&&c(Element.prototype,Xf);hg?d(HTMLElement.prototype,hg):Yf&&d(Element.prototype,Yf);Ig(a,Element.prototype,{prepend:Zf,append:$f});Kg(a);}var Mg={};function Ng(a){function b(){var c=this.constructor;var d=document.__CE_registry.xa.get(c);if(!d)throw Error("Failed to construct a custom element: The constructor was not registered with `customElements`.");var e=d.constructionStack;if(0===e.length)return e=Cf.call(document,d.localName),Object.setPrototypeOf(e,c.prototype),e.__CE_state=1,e.__CE_definition=d,ug(a,e),e;var f=e.length-1,g=e[f];if(g===Mg)throw Error("Failed to construct '"+d.localName+"': This element was already constructed.");e[f]=
Mg;Object.setPrototypeOf(g,c.prototype);ug(a,g);return g}b.prototype=eg.prototype;Object.defineProperty(HTMLElement.prototype,"constructor",{writable:!0,configurable:!0,enumerable:!1,value:b});window.HTMLElement=b;}function Og(a){function b(c,d){Object.defineProperty(c,"textContent",{enumerable:d.enumerable,configurable:!0,get:d.get,set:function(e){if(this.nodeType===Node.TEXT_NODE)d.set.call(this,e);else {var f=void 0;if(this.firstChild){var g=this.childNodes,h=g.length;if(0<h&&T(this)){f=Array(h);for(var k=0;k<h;k++)f[k]=g[k];}}d.set.call(this,e);if(f)for(e=0;e<f.length;e++)xg(a,f[e]);}}});}Node.prototype.insertBefore=function(c,d){if(c instanceof DocumentFragment){var e=lg(c);c=Lf.call(this,c,d);if(T(this))for(d=
0;d<e.length;d++)vg(a,e[d]);return c}e=c instanceof Element&&T(c);d=Lf.call(this,c,d);e&&xg(a,c);T(this)&&vg(a,c);return d};Node.prototype.appendChild=function(c){if(c instanceof DocumentFragment){var d=lg(c);c=Kf.call(this,c);if(T(this))for(var e=0;e<d.length;e++)vg(a,d[e]);return c}d=c instanceof Element&&T(c);e=Kf.call(this,c);d&&xg(a,c);T(this)&&vg(a,c);return e};Node.prototype.cloneNode=function(c){c=Jf.call(this,!!c);this.ownerDocument.__CE_registry?yg(a,c):tg(a,c);return c};Node.prototype.removeChild=
function(c){var d=c instanceof Element&&T(c),e=Mf.call(this,c);d&&xg(a,c);return e};Node.prototype.replaceChild=function(c,d){if(c instanceof DocumentFragment){var e=lg(c);c=Nf.call(this,c,d);if(T(this))for(xg(a,d),d=0;d<e.length;d++)vg(a,e[d]);return c}e=c instanceof Element&&T(c);var f=Nf.call(this,c,d),g=T(this);g&&xg(a,d);e&&xg(a,c);g&&vg(a,c);return f};Of&&Of.get?b(Node.prototype,Of):rg(a,function(c){b(c,{enumerable:!0,configurable:!0,get:function(){for(var d=[],e=this.firstChild;e;e=e.nextSibling)e.nodeType!==
Node.COMMENT_NODE&&d.push(e.textContent);return d.join("")},set:function(d){for(;this.firstChild;)Mf.call(this,this.firstChild);null!=d&&""!==d&&Kf.call(this,document.createTextNode(d));}});});}var pg=window.customElements;function Pg(){var a=new og;Ng(a);Jg(a);Ig(a,DocumentFragment.prototype,{prepend:Hf,append:If});Og(a);Lg(a);a=new U(a);document.__CE_registry=a;Object.defineProperty(window,"customElements",{configurable:!0,enumerable:!0,value:a});}pg&&!pg.forcePolyfill&&"function"==typeof pg.define&&"function"==typeof pg.get||Pg();window.__CE_installPolyfill=Pg;/*

Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
function Qg(){this.end=this.start=0;this.rules=this.parent=this.previous=null;this.cssText=this.parsedCssText="";this.atRule=!1;this.type=0;this.parsedSelector=this.selector=this.keyframesName="";}
function Rg(a){var b=a=a.replace(Sg,"").replace(Tg,""),c=new Qg;c.start=0;c.end=b.length;for(var d=c,e=0,f=b.length;e<f;e++)if("{"===b[e]){d.rules||(d.rules=[]);var g=d,h=g.rules[g.rules.length-1]||null;d=new Qg;d.start=e+1;d.parent=g;d.previous=h;g.rules.push(d);}else "}"===b[e]&&(d.end=e+1,d=d.parent||c);return Ug(c,a)}
function Ug(a,b){var c=b.substring(a.start,a.end-1);a.parsedCssText=a.cssText=c.trim();a.parent&&(c=b.substring(a.previous?a.previous.end:a.parent.start,a.start-1),c=Vg(c),c=c.replace(Wg," "),c=c.substring(c.lastIndexOf(";")+1),c=a.parsedSelector=a.selector=c.trim(),a.atRule=0===c.indexOf("@"),a.atRule?0===c.indexOf("@media")?a.type=Xg:c.match(Yg)&&(a.type=Zg,a.keyframesName=a.selector.split(Wg).pop()):a.type=0===c.indexOf("--")?$g:ah);if(c=a.rules)for(var d=0,e=c.length,f=void 0;d<e&&(f=c[d]);d++)Ug(f,
b);return a}function Vg(a){return a.replace(/\\([0-9a-f]{1,6})\s/gi,function(b,c){b=c;for(c=6-b.length;c--;)b="0"+b;return "\\"+b})}
function bh(a,b,c){c=void 0===c?"":c;var d="";if(a.cssText||a.rules){var e=a.rules,f;if(f=e)f=e[0],f=!(f&&f.selector&&0===f.selector.indexOf("--"));if(f){f=0;for(var g=e.length,h=void 0;f<g&&(h=e[f]);f++)d=bh(h,b,d);}else b?b=a.cssText:(b=a.cssText,b=b.replace(ch,"").replace(dh,""),b=b.replace(eh,"").replace(fh,"")),(d=b.trim())&&(d="  "+d+"\n");}d&&(a.selector&&(c+=a.selector+" {\n"),c+=d,a.selector&&(c+="}\n\n"));return c}
var ah=1,Zg=7,Xg=4,$g=1E3,Sg=/\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim,Tg=/@import[^;]*;/gim,ch=/(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim,dh=/(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim,eh=/@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim,fh=/[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim,Yg=/^@[^\s]*keyframes/,Wg=/\s+/g;var V=!(window.ShadyDOM&&window.ShadyDOM.inUse),gh;function hh(a){gh=a&&a.shimcssproperties?!1:V||!(navigator.userAgent.match(/AppleWebKit\/601|Edge\/15/)||!window.CSS||!CSS.supports||!CSS.supports("box-shadow","0 0 0 var(--foo)"));}var ih;window.ShadyCSS&&void 0!==window.ShadyCSS.cssBuild&&(ih=window.ShadyCSS.cssBuild);var jh=!(!window.ShadyCSS||!window.ShadyCSS.disableRuntime);
window.ShadyCSS&&void 0!==window.ShadyCSS.nativeCss?gh=window.ShadyCSS.nativeCss:window.ShadyCSS?(hh(window.ShadyCSS),window.ShadyCSS=void 0):hh(window.WebComponents&&window.WebComponents.flags);var X=gh;var kh=/(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};{])+)|\{([^}]*)\}(?:(?=[;\s}])|$))/gi,lh=/(?:^|\W+)@apply\s*\(?([^);\n]*)\)?/gi,mh=/(--[\w-]+)\s*([:,;)]|$)/gi,nh=/(animation\s*:)|(animation-name\s*:)/,oh=/@media\s(.*)/,ph=/\{[^}]*\}/g;var qh=new Set;function rh(a,b){if(!a)return "";"string"===typeof a&&(a=Rg(a));b&&sh(a,b);return bh(a,X)}function th(a){!a.__cssRules&&a.textContent&&(a.__cssRules=Rg(a.textContent));return a.__cssRules||null}function uh(a){return !!a.parent&&a.parent.type===Zg}function sh(a,b,c,d){if(a){var e=!1,f=a.type;if(d&&f===Xg){var g=a.selector.match(oh);g&&(window.matchMedia(g[1]).matches||(e=!0));}f===ah?b(a):c&&f===Zg?c(a):f===$g&&(e=!0);if((a=a.rules)&&!e)for(e=0,f=a.length,g=void 0;e<f&&(g=a[e]);e++)sh(g,b,c,d);}}
function vh(a,b,c,d){var e=document.createElement("style");b&&e.setAttribute("scope",b);e.textContent=a;wh(e,c,d);return e}var xh=null;function yh(a){a=document.createComment(" Shady DOM styles for "+a+" ");var b=document.head;b.insertBefore(a,(xh?xh.nextSibling:null)||b.firstChild);return xh=a}function wh(a,b,c){b=b||document.head;b.insertBefore(a,c&&c.nextSibling||b.firstChild);xh?a.compareDocumentPosition(xh)===Node.DOCUMENT_POSITION_PRECEDING&&(xh=a):xh=a;}
function Ah(a,b){for(var c=0,d=a.length;b<d;b++)if("("===a[b])c++;else if(")"===a[b]&&0===--c)return b;return -1}function Bh(a,b){var c=a.indexOf("var(");if(-1===c)return b(a,"","","");var d=Ah(a,c+3),e=a.substring(c+4,d);c=a.substring(0,c);a=Bh(a.substring(d+1),b);d=e.indexOf(",");return -1===d?b(c,e.trim(),"",a):b(c,e.substring(0,d).trim(),e.substring(d+1).trim(),a)}function Ch(a,b){V?a.setAttribute("class",b):window.ShadyDOM.nativeMethods.setAttribute.call(a,"class",b);}
var Dh=window.ShadyDOM&&window.ShadyDOM.wrap||function(a){return a};function Eh(a){var b=a.localName,c="";b?-1<b.indexOf("-")||(c=b,b=a.getAttribute&&a.getAttribute("is")||""):(b=a.is,c=a.extends);return {is:b,ca:c}}function Fh(a){for(var b=[],c="",d=0;0<=d&&d<a.length;d++)if("("===a[d]){var e=Ah(a,d);c+=a.slice(d,e+1);d=e;}else ","===a[d]?(b.push(c),c=""):c+=a[d];c&&b.push(c);return b}
function Gh(a){if(void 0!==ih)return ih;if(void 0===a.__cssBuild){var b=a.getAttribute("css-build");if(b)a.__cssBuild=b;else {a:{b="template"===a.localName?a.content.firstChild:a.firstChild;if(b instanceof Comment&&(b=b.textContent.trim().split(":"),"css-build"===b[0])){b=b[1];break a}b="";}if(""!==b){var c="template"===a.localName?a.content.firstChild:a.firstChild;c.parentNode.removeChild(c);}a.__cssBuild=b;}}return a.__cssBuild||""}
function Hh(a){a=void 0===a?"":a;return ""!==a&&X?V?"shadow"===a:"shady"===a:!1}function Ih(){}function Jh(a,b){Kh(Lh,a,function(c){Mh(c,b||"");});}function Kh(a,b,c){b.nodeType===Node.ELEMENT_NODE&&c(b);var d;"template"===b.localName?d=(b.content||b._content||b).childNodes:d=b.children||b.childNodes;if(d)for(b=0;b<d.length;b++)Kh(a,d[b],c);}
function Mh(a,b,c){if(b)if(a.classList)c?(a.classList.remove("style-scope"),a.classList.remove(b)):(a.classList.add("style-scope"),a.classList.add(b));else if(a.getAttribute){var d=a.getAttribute("class");c?d&&(b=d.replace("style-scope","").replace(b,""),Ch(a,b)):Ch(a,(d?d+" ":"")+"style-scope "+b);}}function Nh(a,b,c){Kh(Lh,a,function(d){Mh(d,b,!0);Mh(d,c);});}function Oh(a,b){Kh(Lh,a,function(c){Mh(c,b||"",!0);});}
function Ph(a,b,c,d,e){var f=Lh;e=void 0===e?"":e;""===e&&(V||"shady"===(void 0===d?"":d)?e=rh(b,c):(a=Eh(a),e=Qh(f,b,a.is,a.ca,c)+"\n\n"));return e.trim()}function Qh(a,b,c,d,e){var f=Rh(c,d);c=c?"."+c:"";return rh(b,function(g){g.c||(g.selector=g.w=Sh(a,g,a.b,c,f),g.c=!0);e&&e(g,c,f);})}function Rh(a,b){return b?"[is="+a+"]":a}
function Sh(a,b,c,d,e){var f=Fh(b.selector);if(!uh(b)){b=0;for(var g=f.length,h=void 0;b<g&&(h=f[b]);b++)f[b]=c.call(a,h,d,e);}return f.filter(function(k){return !!k}).join(",")}function Th(a){return a.replace(Uh,function(b,c,d){-1<d.indexOf("+")?d=d.replace(/\+/g,"___"):-1<d.indexOf("___")&&(d=d.replace(/___/g,"+"));return ":"+c+"("+d+")"})}
function Vh(a){for(var b=[],c;c=a.match(Wh);){var d=c.index,e=Ah(a,d);if(-1===e)throw Error(c.input+" selector missing ')'");c=a.slice(d,e+1);a=a.replace(c,"\ue000");b.push(c);}return {wa:a,matches:b}}function Xh(a,b){var c=a.split("\ue000");return b.reduce(function(d,e,f){return d+e+c[f+1]},c[0])}
Ih.prototype.b=function(a,b,c){var d=!1;a=a.trim();var e=Uh.test(a);e&&(a=a.replace(Uh,function(h,k,l){return ":"+k+"("+l.replace(/\s/g,"")+")"}),a=Th(a));var f=Wh.test(a);if(f){var g=Vh(a);a=g.wa;g=g.matches;}a=a.replace(Yh,":host $1");a=a.replace(Zh,function(h,k,l){d||(h=$h(l,k,b,c),d=d||h.stop,k=h.Qa,l=h.value);return k+l});f&&(a=Xh(a,g));e&&(a=Th(a));return a=a.replace(ai,function(h,k,l,m){return '[dir="'+l+'"] '+k+m+", "+k+'[dir="'+l+'"]'+m})};
function $h(a,b,c,d){var e=a.indexOf("::slotted");0<=a.indexOf(":host")?a=bi(a,d):0!==e&&(a=c?ci(a,c):a);c=!1;0<=e&&(b="",c=!0);if(c){var f=!0;c&&(a=a.replace(di,function(g,h){return " > "+h}));}return {value:a,Qa:b,stop:f}}function ci(a,b){a=a.split(/(\[.+?\])/);for(var c=[],d=0;d<a.length;d++)if(1===d%2)c.push(a[d]);else {var e=a[d];if(""!==e||d!==a.length-1)e=e.split(":"),e[0]+=b,c.push(e.join(":"));}return c.join("")}
function bi(a,b){var c=a.match(ei);return (c=c&&c[2].trim()||"")?c[0].match(fi)?a.replace(ei,function(d,e,f){return b+f}):c.split(fi)[0]===b?c:"should_not_match":a.replace(":host",b)}function gi(a){":root"===a.selector&&(a.selector="html");}Ih.prototype.c=function(a){return a.match(":host")?"":a.match("::slotted")?this.b(a,":not(.style-scope)"):ci(a.trim(),":not(.style-scope)")};da.Object.defineProperties(Ih.prototype,{a:{configurable:!0,enumerable:!0,get:function(){return "style-scope"}}});
var Uh=/:(nth[-\w]+)\(([^)]+)\)/,Zh=/(^|[\s>+~]+)((?:\[.+?\]|[^\s>+~=[])+)/g,fi=/[[.:#*]/,Yh=/^(::slotted)/,ei=/(:host)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/,di=/(?:::slotted)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/,ai=/(.*):dir\((?:(ltr|rtl))\)(.*)/,Wh=/:(?:matches|any|-(?:webkit|moz)-any)/,Lh=new Ih;function hi(a,b,c,d,e){this.H=a||null;this.b=b||null;this.ta=c||[];this.F=null;this.cssBuild=e||"";this.ca=d||"";this.a=this.G=this.L=null;}function ii(a){return a?a.__styleInfo:null}function ji(a,b){return a.__styleInfo=b}hi.prototype.c=function(){return this.H};hi.prototype._getStyleRules=hi.prototype.c;function ki(a){var b=this.matches||this.matchesSelector||this.mozMatchesSelector||this.msMatchesSelector||this.oMatchesSelector||this.webkitMatchesSelector;return b&&b.call(this,a)}var li=/:host\s*>\s*/,mi=navigator.userAgent.match("Trident");function ni(){}function oi(a){var b={},c=[],d=0;sh(a,function(f){pi(f);f.index=d++;f=f.v.cssText;for(var g;g=mh.exec(f);){var h=g[1];":"!==g[2]&&(b[h]=!0);}},function(f){c.push(f);});a.b=c;a=[];for(var e in b)a.push(e);return a}
function pi(a){if(!a.v){var b={},c={};qi(a,c)&&(b.K=c,a.rules=null);b.cssText=a.parsedCssText.replace(ph,"").replace(kh,"");a.v=b;}}function qi(a,b){var c=a.v;if(c){if(c.K)return Object.assign(b,c.K),!0}else {c=a.parsedCssText;for(var d;a=kh.exec(c);){d=(a[2]||a[3]).trim();if("inherit"!==d||"unset"!==d)b[a[1].trim()]=d;d=!0;}return d}}
function ri(a,b,c){b&&(b=0<=b.indexOf(";")?si(a,b,c):Bh(b,function(d,e,f,g){if(!e)return d+g;(e=ri(a,c[e],c))&&"initial"!==e?"apply-shim-inherit"===e&&(e="inherit"):e=ri(a,c[f]||f,c)||f;return d+(e||"")+g}));return b&&b.trim()||""}
function si(a,b,c){b=b.split(";");for(var d=0,e,f;d<b.length;d++)if(e=b[d]){lh.lastIndex=0;if(f=lh.exec(e))e=ri(a,c[f[1]],c);else if(f=e.indexOf(":"),-1!==f){var g=e.substring(f);g=g.trim();g=ri(a,g,c)||g;e=e.substring(0,f)+g;}b[d]=e&&e.lastIndexOf(";")===e.length-1?e.slice(0,-1):e||"";}return b.join(";")}
function ti(a,b){var c={},d=[];sh(a,function(e){e.v||pi(e);var f=e.w||e.parsedSelector;b&&e.v.K&&f&&ki.call(b,f)&&(qi(e,c),e=e.index,f=parseInt(e/32,10),d[f]=(d[f]||0)|1<<e%32);},null,!0);return {K:c,key:d}}
function ui(a,b,c,d){b.v||pi(b);if(b.v.K){var e=Eh(a);a=e.is;e=e.ca;e=a?Rh(a,e):"html";var f=b.parsedSelector;var g=!!f.match(li)||"html"===e&&-1<f.indexOf("html");var h=0===f.indexOf(":host")&&!g;"shady"===c&&(g=f===e+" > *."+e||-1!==f.indexOf("html"),h=!g&&0===f.indexOf(e));if(g||h)c=e,h&&(b.w||(b.w=Sh(Lh,b,Lh.b,a?"."+a:"",e)),c=b.w||e),g&&"html"===e&&(c=b.w||b.J),d({wa:c,Xa:h,mb:g});}}
function vi(a,b,c){var d={},e={};sh(b,function(f){ui(a,f,c,function(g){ki.call(a._element||a,g.wa)&&(g.Xa?qi(f,d):qi(f,e));});},null,!0);return {cb:e,Va:d}}
function wi(a,b,c,d){var e=Eh(b),f=Rh(e.is,e.ca),g=new RegExp("(?:^|[^.#[:])"+(b.extends?"\\"+f.slice(0,-1)+"\\]":f)+"($|[.:[\\s>+~])"),h=ii(b);e=h.H;h=h.cssBuild;var k=xi(e,d);return Ph(b,e,function(l){var m="";l.v||pi(l);l.v.cssText&&(m=si(a,l.v.cssText,c));l.cssText=m;if(!V&&!uh(l)&&l.cssText){var q=m=l.cssText;null==l.Da&&(l.Da=nh.test(m));if(l.Da)if(null==l.ka){l.ka=[];for(var H in k)q=k[H],q=q(m),m!==q&&(m=q,l.ka.push(H));}else {for(H=0;H<l.ka.length;++H)q=k[l.ka[H]],m=q(m);q=m;}l.cssText=q;l.w=
l.w||l.selector;m="."+d;H=Fh(l.w);q=0;for(var C=H.length,t=void 0;q<C&&(t=H[q]);q++)H[q]=t.match(g)?t.replace(f,m):m+" "+t;l.selector=H.join(",");}},h)}function xi(a,b){a=a.b;var c={};if(!V&&a)for(var d=0,e=a[d];d<a.length;e=a[++d]){var f=e,g=b;f.l=new RegExp("\\b"+f.keyframesName+"(?!\\B|-)","g");f.a=f.keyframesName+"-"+g;f.w=f.w||f.selector;f.selector=f.w.replace(f.keyframesName,f.a);c[e.keyframesName]=yi(e);}return c}function yi(a){return function(b){return b.replace(a.l,a.a)}}
function zi(a,b){var c=Ai,d=th(a);a.textContent=rh(d,function(e){var f=e.cssText=e.parsedCssText;e.v&&e.v.cssText&&(f=f.replace(ch,"").replace(dh,""),e.cssText=si(c,f,b));});}da.Object.defineProperties(ni.prototype,{a:{configurable:!0,enumerable:!0,get:function(){return "x-scope"}}});var Ai=new ni;var Bi={},Ci=window.customElements;if(Ci&&!V&&!jh){var Di=Ci.define;Ci.define=function(a,b,c){Bi[a]||(Bi[a]=yh(a));Di.call(Ci,a,b,c);};}function Ei(){this.cache={};}Ei.prototype.store=function(a,b,c,d){var e=this.cache[a]||[];e.push({K:b,styleElement:c,G:d});100<e.length&&e.shift();this.cache[a]=e;};function Fi(){}var Gi=new RegExp(Lh.a+"\\s*([^\\s]*)");function Hi(a){return (a=(a.classList&&a.classList.value?a.classList.value:a.getAttribute("class")||"").match(Gi))?a[1]:""}function Ii(a){var b=Dh(a).getRootNode();return b===a||b===a.ownerDocument?"":(a=b.host)?Eh(a).is:""}
function Ji(a){for(var b=0;b<a.length;b++){var c=a[b];if(c.target!==document.documentElement&&c.target!==document.head)for(var d=0;d<c.addedNodes.length;d++){var e=c.addedNodes[d];if(e.nodeType===Node.ELEMENT_NODE){var f=e.getRootNode(),g=Hi(e);if(g&&f===e.ownerDocument&&("style"!==e.localName&&"template"!==e.localName||""===Gh(e)))Oh(e,g);else if(f instanceof ShadowRoot)for(f=Ii(e),f!==g&&Nh(e,g,f),e=window.ShadyDOM.nativeMethods.querySelectorAll.call(e,":not(."+Lh.a+")"),g=0;g<e.length;g++){f=e[g];
var h=Ii(f);h&&Mh(f,h);}}}}}
if(!(V||window.ShadyDOM&&window.ShadyDOM.handlesDynamicScoping)){var Ki=new MutationObserver(Ji),Li=function(a){Ki.observe(a,{childList:!0,subtree:!0});};if(window.customElements&&!window.customElements.polyfillWrapFlushCallback)Li(document);else {var Mi=function(){Li(document.body);};window.HTMLImports?window.HTMLImports.whenReady(Mi):requestAnimationFrame(function(){if("loading"===document.readyState){var a=function(){Mi();document.removeEventListener("readystatechange",a);};document.addEventListener("readystatechange",
a);}else Mi();});}Fi=function(){Ji(Ki.takeRecords());};}var Ni={};var Oi=Promise.resolve();function Pi(a){if(a=Ni[a])a._applyShimCurrentVersion=a._applyShimCurrentVersion||0,a._applyShimValidatingVersion=a._applyShimValidatingVersion||0,a._applyShimNextVersion=(a._applyShimNextVersion||0)+1;}function Qi(a){return a._applyShimCurrentVersion===a._applyShimNextVersion}function Ri(a){a._applyShimValidatingVersion=a._applyShimNextVersion;a._validating||(a._validating=!0,Oi.then(function(){a._applyShimCurrentVersion=a._applyShimNextVersion;a._validating=!1;}));}var Si={},Ti=new Ei;function Y(){this.Y={};this.c=document.documentElement;var a=new Qg;a.rules=[];this.l=ji(this.c,new hi(a));this.J=!1;this.a=this.b=null;}v=Y.prototype;v.flush=function(){Fi();};v.Ta=function(a){return th(a)};v.hb=function(a){return rh(a)};v.prepareTemplate=function(a,b,c){this.prepareTemplateDom(a,b);this.prepareTemplateStyles(a,b,c);};
v.prepareTemplateStyles=function(a,b,c){if(!a._prepared&&!jh){V||Bi[b]||(Bi[b]=yh(b));a._prepared=!0;a.name=b;a.extends=c;Ni[b]=a;var d=Gh(a),e=Hh(d);c={is:b,extends:c};for(var f=[],g=a.content.querySelectorAll("style"),h=0;h<g.length;h++){var k=g[h];if(k.hasAttribute("shady-unscoped")){if(!V){var l=k.textContent;if(!qh.has(l)){qh.add(l);var m=document.createElement("style");m.setAttribute("shady-unscoped","");m.textContent=l;document.head.appendChild(m);}k.parentNode.removeChild(k);}}else f.push(k.textContent),
k.parentNode.removeChild(k);}f=f.join("").trim()+(Si[b]||"");Ui(this);if(!e){if(g=!d)g=lh.test(f)||kh.test(f),lh.lastIndex=0,kh.lastIndex=0;h=Rg(f);g&&X&&this.b&&this.b.transformRules(h,b);a._styleAst=h;}g=[];X||(g=oi(a._styleAst));if(!g.length||X)h=V?a.content:null,b=Bi[b]||null,d=Ph(c,a._styleAst,null,d,e?f:""),d=d.length?vh(d,c.is,h,b):null,a._style=d;a.a=g;}};v.ab=function(a,b){Si[b]=a.join(" ");};
v.prepareTemplateDom=function(a,b){if(!jh){var c=Gh(a);V||"shady"===c||a._domPrepared||(a._domPrepared=!0,Jh(a.content,b));}};function Vi(a){var b=Eh(a),c=b.is;b=b.ca;var d=Bi[c]||null,e=Ni[c];if(e){c=e._styleAst;var f=e.a;e=Gh(e);b=new hi(c,d,f,b,e);ji(a,b);return b}}
function Wi(a){!a.a&&window.ShadyCSS&&window.ShadyCSS.CustomStyleInterface&&(a.a=window.ShadyCSS.CustomStyleInterface,a.a.transformCallback=function(b){a.Ha(b);},a.a.validateCallback=function(){requestAnimationFrame(function(){(a.a.enqueued||a.J)&&a.flushCustomStyles();});});}function Ui(a){if(!a.b&&window.ShadyCSS&&window.ShadyCSS.ApplyShim){a.b=window.ShadyCSS.ApplyShim;a.b.invalidCallback=Pi;var b=!0;}else b=!1;Wi(a);return b}
v.flushCustomStyles=function(){if(!jh){var a=Ui(this);if(this.a){var b=this.a.processStyles();if((a||this.a.enqueued)&&!Hh(this.l.cssBuild)){if(X){if(!this.l.cssBuild)for(a=0;a<b.length;a++){var c=this.a.getStyleForCustomStyle(b[a]);if(c&&X&&this.b){var d=th(c);Ui(this);this.b.transformRules(d);c.textContent=rh(d);}}}else {Xi(this,b);Yi(this,this.c,this.l);for(a=0;a<b.length;a++)(c=this.a.getStyleForCustomStyle(b[a]))&&zi(c,this.l.L);this.J&&this.styleDocument();}this.a.enqueued=!1;}}}};
function Xi(a,b){b=b.map(function(c){return a.a.getStyleForCustomStyle(c)}).filter(function(c){return !!c});b.sort(function(c,d){c=d.compareDocumentPosition(c);return c&Node.DOCUMENT_POSITION_FOLLOWING?1:c&Node.DOCUMENT_POSITION_PRECEDING?-1:0});a.l.H.rules=b.map(function(c){return th(c)});}
v.styleElement=function(a,b){if(jh){if(b){ii(a)||ji(a,new hi(null));var c=ii(a);c.F=c.F||{};Object.assign(c.F,b);Zi(this,a,c);}}else if(c=ii(a)||Vi(a))if(a!==this.c&&(this.J=!0),b&&(c.F=c.F||{},Object.assign(c.F,b)),X)Zi(this,a,c);else if(this.flush(),Yi(this,a,c),c.ta&&c.ta.length){b=Eh(a).is;var d;a:{if(d=Ti.cache[b])for(var e=d.length-1;0<=e;e--){var f=d[e];b:{var g=c.ta;for(var h=0;h<g.length;h++){var k=g[h];if(f.K[k]!==c.L[k]){g=!1;break b}}g=!0;}if(g){d=f;break a}}d=void 0;}g=d?d.styleElement:
null;e=c.G;(f=d&&d.G)||(f=this.Y[b]=(this.Y[b]||0)+1,f=b+"-"+f);c.G=f;f=c.G;h=Ai;h=g?g.textContent||"":wi(h,a,c.L,f);k=ii(a);var l=k.a;l&&!V&&l!==g&&(l._useCount--,0>=l._useCount&&l.parentNode&&l.parentNode.removeChild(l));V?k.a?(k.a.textContent=h,g=k.a):h&&(g=vh(h,f,a.shadowRoot,k.b)):g?g.parentNode||(mi&&-1<h.indexOf("@media")&&(g.textContent=h),wh(g,null,k.b)):h&&(g=vh(h,f,null,k.b));g&&(g._useCount=g._useCount||0,k.a!=g&&g._useCount++,k.a=g);f=g;V||(g=c.G,k=h=a.getAttribute("class")||"",e&&(k=
h.replace(new RegExp("\\s*x-scope\\s*"+e+"\\s*","g")," ")),k+=(k?" ":"")+"x-scope "+g,h!==k&&Ch(a,k));d||Ti.store(b,c.L,f,c.G);}};
function Zi(a,b,c){var d=Eh(b).is;if(c.F){var e=c.F,f;for(f in e)null===f?b.style.removeProperty(f):b.style.setProperty(f,e[f]);}e=Ni[d];if(!(!e&&b!==a.c||e&&""!==Gh(e))&&e&&e._style&&!Qi(e)){if(Qi(e)||e._applyShimValidatingVersion!==e._applyShimNextVersion)Ui(a),a.b&&a.b.transformRules(e._styleAst,d),e._style.textContent=Ph(b,c.H),Ri(e);V&&(a=b.shadowRoot)&&(a=a.querySelector("style"))&&(a.textContent=Ph(b,c.H));c.H=e._styleAst;}}
function $i(a,b){return (b=Dh(b).getRootNode().host)?ii(b)||Vi(b)?b:$i(a,b):a.c}function Yi(a,b,c){var d=$i(a,b),e=ii(d),f=e.L;d===a.c||f||(Yi(a,d,e),f=e.L);a=Object.create(f||null);d=vi(b,c.H,c.cssBuild);b=ti(e.H,b).K;Object.assign(a,d.Va,b,d.cb);b=c.F;for(var g in b)if((e=b[g])||0===e)a[g]=e;g=Ai;b=Object.getOwnPropertyNames(a);for(e=0;e<b.length;e++)d=b[e],a[d]=ri(g,a[d],a);c.L=a;}v.styleDocument=function(a){this.styleSubtree(this.c,a);};
v.styleSubtree=function(a,b){var c=Dh(a),d=c.shadowRoot,e=a===this.c;(d||e)&&this.styleElement(a,b);if(a=e?c:d)for(a=Array.from(a.querySelectorAll("*")).filter(function(f){return Dh(f).shadowRoot}),b=0;b<a.length;b++)this.styleSubtree(a[b]);};
v.Ha=function(a){var b=this,c=Gh(a);c!==this.l.cssBuild&&(this.l.cssBuild=c);if(!Hh(c)){var d=th(a);sh(d,function(e){if(V)gi(e);else {var f=Lh;e.selector=e.parsedSelector;gi(e);e.selector=e.w=Sh(f,e,f.c,void 0,void 0);}X&&""===c&&(Ui(b),b.b&&b.b.transformRule(e));});X?a.textContent=rh(d):this.l.H.rules.push(d);}};v.getComputedStyleValue=function(a,b){var c;X||(c=(ii(a)||ii($i(this,a))).L[b]);return (c=c||window.getComputedStyle(a).getPropertyValue(b))?c.trim():""};
v.gb=function(a,b){var c=Dh(a).getRootNode(),d;b?d=("string"===typeof b?b:String(b)).split(/\s/):d=[];b=c.host&&c.host.localName;if(!b&&(c=a.getAttribute("class"))){c=c.split(/\s/);for(var e=0;e<c.length;e++)if(c[e]===Lh.a){b=c[e+1];break}}b&&d.push(Lh.a,b);X||(b=ii(a))&&b.G&&d.push(Ai.a,b.G);Ch(a,d.join(" "));};v.Oa=function(a){return ii(a)};v.fb=function(a,b){Mh(a,b);};v.ib=function(a,b){Mh(a,b,!0);};v.eb=function(a){return Ii(a)};v.Ra=function(a){return Hi(a)};Y.prototype.flush=Y.prototype.flush;
Y.prototype.prepareTemplate=Y.prototype.prepareTemplate;Y.prototype.styleElement=Y.prototype.styleElement;Y.prototype.styleDocument=Y.prototype.styleDocument;Y.prototype.styleSubtree=Y.prototype.styleSubtree;Y.prototype.getComputedStyleValue=Y.prototype.getComputedStyleValue;Y.prototype.setElementClass=Y.prototype.gb;Y.prototype._styleInfoForNode=Y.prototype.Oa;Y.prototype.transformCustomStyleForDocument=Y.prototype.Ha;Y.prototype.getStyleAst=Y.prototype.Ta;Y.prototype.styleAstToString=Y.prototype.hb;
Y.prototype.flushCustomStyles=Y.prototype.flushCustomStyles;Y.prototype.scopeNode=Y.prototype.fb;Y.prototype.unscopeNode=Y.prototype.ib;Y.prototype.scopeForNode=Y.prototype.eb;Y.prototype.currentScopeForNode=Y.prototype.Ra;Y.prototype.prepareAdoptedCssText=Y.prototype.ab;Object.defineProperties(Y.prototype,{nativeShadow:{get:function(){return V}},nativeCss:{get:function(){return X}}});var Z=new Y,aj,bj;window.ShadyCSS&&(aj=window.ShadyCSS.ApplyShim,bj=window.ShadyCSS.CustomStyleInterface);
window.ShadyCSS={ScopingShim:Z,prepareTemplate:function(a,b,c){Z.flushCustomStyles();Z.prepareTemplate(a,b,c);},prepareTemplateDom:function(a,b){Z.prepareTemplateDom(a,b);},prepareTemplateStyles:function(a,b,c){Z.flushCustomStyles();Z.prepareTemplateStyles(a,b,c);},styleSubtree:function(a,b){Z.flushCustomStyles();Z.styleSubtree(a,b);},styleElement:function(a){Z.flushCustomStyles();Z.styleElement(a);},styleDocument:function(a){Z.flushCustomStyles();Z.styleDocument(a);},flushCustomStyles:function(){Z.flushCustomStyles();},
getComputedStyleValue:function(a,b){return Z.getComputedStyleValue(a,b)},nativeCss:X,nativeShadow:V,cssBuild:ih,disableRuntime:jh};aj&&(window.ShadyCSS.ApplyShim=aj);bj&&(window.ShadyCSS.CustomStyleInterface=bj);(function(a){function b(t){""==t&&(f.call(this),this.h=!0);return t.toLowerCase()}function c(t){var F=t.charCodeAt(0);return 32<F&&127>F&&-1==[34,35,60,62,63,96].indexOf(F)?t:encodeURIComponent(t)}function d(t){var F=t.charCodeAt(0);return 32<F&&127>F&&-1==[34,35,60,62,96].indexOf(F)?t:encodeURIComponent(t)}function e(t,F,E){function M(ka){}var y=F||"scheme start",W=0,w="",wa=!1,fa=!1;a:for(;(void 0!=t[W-1]||0==W)&&!this.h;){var n=t[W];switch(y){case "scheme start":if(n&&q.test(n))w+=
n.toLowerCase(),y="scheme";else if(F){break a}else {w="";y="no scheme";continue}break;case "scheme":if(n&&H.test(n))w+=n.toLowerCase();else if(":"==n){this.g=w;w="";if(F)break a;void 0!==l[this.g]&&(this.A=!0);y="file"==this.g?"relative":this.A&&E&&E.g==this.g?"relative or authority":this.A?"authority first slash":"scheme data";}else if(F){break a}else {w="";W=0;y="no scheme";continue}break;case "scheme data":"?"==n?(this.o="?",
y="query"):"#"==n?(this.u="#",y="fragment"):void 0!=n&&"\t"!=n&&"\n"!=n&&"\r"!=n&&(this.pa+=c(n));break;case "no scheme":if(E&&void 0!==l[E.g]){y="relative";continue}else f.call(this),this.h=!0;break;case "relative or authority":if("/"==n&&"/"==t[W+1])y="authority ignore slashes";else {y="relative";continue}break;case "relative":this.A=!0;"file"!=this.g&&(this.g=E.g);if(void 0==n){this.i=E.i;this.m=E.m;this.j=E.j.slice();this.o=E.o;this.s=E.s;this.f=E.f;
break a}else if("/"==n||"\\"==n)y="relative slash";else if("?"==n)this.i=E.i,this.m=E.m,this.j=E.j.slice(),this.o="?",this.s=E.s,this.f=E.f,y="query";else if("#"==n)this.i=E.i,this.m=E.m,this.j=E.j.slice(),this.o=E.o,this.u="#",this.s=E.s,this.f=E.f,y="fragment";else {y=t[W+1];var J=t[W+2];if("file"!=this.g||!q.test(n)||":"!=y&&"|"!=y||void 0!=J&&"/"!=J&&"\\"!=J&&"?"!=J&&"#"!=J)this.i=E.i,this.m=E.m,this.s=E.s,this.f=E.f,this.j=E.j.slice(),this.j.pop();y=
"relative path";continue}break;case "relative slash":if("/"==n||"\\"==n)y="file"==this.g?"file host":"authority ignore slashes";else {"file"!=this.g&&(this.i=E.i,this.m=E.m,this.s=E.s,this.f=E.f);y="relative path";continue}break;case "authority first slash":if("/"==n)y="authority second slash";else {y="authority ignore slashes";continue}break;case "authority second slash":y="authority ignore slashes";if("/"!=n){continue}break;case "authority ignore slashes":if("/"!=n&&"\\"!=n){y="authority";continue}break;case "authority":if("@"==n){wa&&(w+="%40");wa=!0;for(n=0;n<w.length;n++)J=w[n],"\t"==J||"\n"==J||"\r"==J?M():":"==J&&null===this.f?this.f="":(J=c(J),null!==this.f?this.f+=J:this.s+=J);w="";}else if(void 0==n||"/"==n||"\\"==n||"?"==n||"#"==n){W-=w.length;w="";y="host";continue}else w+=n;break;case "file host":if(void 0==
n||"/"==n||"\\"==n||"?"==n||"#"==n){2!=w.length||!q.test(w[0])||":"!=w[1]&&"|"!=w[1]?(0!=w.length&&(this.i=b.call(this,w),w=""),y="relative path start"):y="relative path";continue}else "\t"==n||"\n"==n||"\r"==n?M():w+=n;break;case "host":case "hostname":if(":"!=n||fa)if(void 0==n||"/"==n||"\\"==n||"?"==n||"#"==n){this.i=b.call(this,w);w="";y="relative path start";if(F)break a;continue}else "\t"!=n&&"\n"!=n&&"\r"!=n?("["==n?fa=!0:"]"==n&&(fa=!1),w+=n):M();else if(this.i=b.call(this,w),w="",y="port","hostname"==F)break a;break;case "port":if(/[0-9]/.test(n))w+=n;else if(void 0==n||"/"==n||"\\"==n||"?"==n||"#"==n||F){""!=w&&(w=parseInt(w,10),w!=l[this.g]&&(this.m=w+""),w="");if(F)break a;y="relative path start";continue}else "\t"==n||"\n"==n||"\r"==n?M():(f.call(this),this.h=!0);break;case "relative path start":y="relative path";if("/"!=n&&"\\"!=n)continue;break;case "relative path":if(void 0!=
n&&"/"!=n&&"\\"!=n&&(F||"?"!=n&&"#"!=n))"\t"!=n&&"\n"!=n&&"\r"!=n&&(w+=c(n));else {if(J=m[w.toLowerCase()])w=J;".."==w?(this.j.pop(),"/"!=n&&"\\"!=n&&this.j.push("")):"."==w&&"/"!=n&&"\\"!=n?this.j.push(""):"."!=w&&("file"==this.g&&0==this.j.length&&2==w.length&&q.test(w[0])&&"|"==w[1]&&(w=w[0]+":"),this.j.push(w));w="";"?"==n?(this.o="?",y="query"):"#"==n&&(this.u="#",y="fragment");}break;case "query":F||"#"!=n?void 0!=n&&"\t"!=n&&"\n"!=n&&"\r"!=n&&(this.o+=
d(n)):(this.u="#",y="fragment");break;case "fragment":void 0!=n&&"\t"!=n&&"\n"!=n&&"\r"!=n&&(this.u+=n);}W++;}}function f(){this.s=this.pa=this.g="";this.f=null;this.m=this.i="";this.j=[];this.u=this.o="";this.A=this.h=!1;}function g(t,F){void 0===F||F instanceof g||(F=new g(String(F)));this.a=t;f.call(this);e.call(this,this.a.replace(/^[ \t\r\n\f]+|[ \t\r\n\f]+$/g,""),null,F);}var h=!1;try{var k=new URL("b","http://a");k.pathname="c%20d";h="http://a/c%20d"===k.href;}catch(t){}if(!h){var l=Object.create(null);
l.ftp=21;l.file=0;l.gopher=70;l.http=80;l.https=443;l.ws=80;l.wss=443;var m=Object.create(null);m["%2e"]=".";m[".%2e"]="..";m["%2e."]="..";m["%2e%2e"]="..";var q=/[a-zA-Z]/,H=/[a-zA-Z0-9\+\-\.]/;g.prototype={toString:function(){return this.href},get href(){if(this.h)return this.a;var t="";if(""!=this.s||null!=this.f)t=this.s+(null!=this.f?":"+this.f:"")+"@";return this.protocol+(this.A?"//"+t+this.host:"")+this.pathname+this.o+this.u},set href(t){f.call(this);e.call(this,t);},get protocol(){return this.g+
":"},set protocol(t){this.h||e.call(this,t+":","scheme start");},get host(){return this.h?"":this.m?this.i+":"+this.m:this.i},set host(t){!this.h&&this.A&&e.call(this,t,"host");},get hostname(){return this.i},set hostname(t){!this.h&&this.A&&e.call(this,t,"hostname");},get port(){return this.m},set port(t){!this.h&&this.A&&e.call(this,t,"port");},get pathname(){return this.h?"":this.A?"/"+this.j.join("/"):this.pa},set pathname(t){!this.h&&this.A&&(this.j=[],e.call(this,t,"relative path start"));},get search(){return this.h||
!this.o||"?"==this.o?"":this.o},set search(t){!this.h&&this.A&&(this.o="?","?"==t[0]&&(t=t.slice(1)),e.call(this,t,"query"));},get hash(){return this.h||!this.u||"#"==this.u?"":this.u},set hash(t){this.h||(t?(this.u="#","#"==t[0]&&(t=t.slice(1)),e.call(this,t,"fragment")):this.u="");},get origin(){var t;if(this.h||!this.g)return "";switch(this.g){case "data":case "file":case "javascript":case "mailto":return "null"}return (t=this.host)?this.g+"://"+t:""}};var C=a.URL;C&&(g.createObjectURL=function(t){return C.createObjectURL.apply(C,
arguments)},g.revokeObjectURL=function(t){C.revokeObjectURL(t);});a.URL=g;}})(window);/*

Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
var cj=window.customElements,dj=!1,ej=null;cj.polyfillWrapFlushCallback&&cj.polyfillWrapFlushCallback(function(a){ej=a;dj&&a();});function fj(){window.HTMLTemplateElement.bootstrap&&window.HTMLTemplateElement.bootstrap(window.document);ej&&ej();dj=!0;window.WebComponents.ready=!0;document.dispatchEvent(new CustomEvent("WebComponentsReady",{bubbles:!0}));}
"complete"!==document.readyState?(window.addEventListener("load",fj),window.addEventListener("DOMContentLoaded",function(){window.removeEventListener("load",fj);fj();})):fj();}).call(commonjsGlobal);

/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var Reflect$1;
(function (Reflect) {
    // Metadata Proposal
    // https://rbuckton.github.io/reflect-metadata/
    (function (factory) {
        var root = typeof commonjsGlobal === "object" ? commonjsGlobal :
            typeof self === "object" ? self :
                typeof this === "object" ? this :
                    Function("return this;")();
        var exporter = makeExporter(Reflect);
        if (typeof root.Reflect === "undefined") {
            root.Reflect = Reflect;
        }
        else {
            exporter = makeExporter(root.Reflect, exporter);
        }
        factory(exporter);
        function makeExporter(target, previous) {
            return function (key, value) {
                if (typeof target[key] !== "function") {
                    Object.defineProperty(target, key, { configurable: true, writable: true, value: value });
                }
                if (previous)
                    previous(key, value);
            };
        }
    })(function (exporter) {
        var hasOwn = Object.prototype.hasOwnProperty;
        // feature test for Symbol support
        var supportsSymbol = typeof Symbol === "function";
        var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
        var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
        var downLevel = !supportsCreate && !supportsProto;
        var HashMap = {
            // create an object in dictionary mode (a.k.a. "slow" mode in v8)
            create: supportsCreate
                ? function () { return MakeDictionary(Object.create(null)); }
                : supportsProto
                    ? function () { return MakeDictionary({ __proto__: null }); }
                    : function () { return MakeDictionary({}); },
            has: downLevel
                ? function (map, key) { return hasOwn.call(map, key); }
                : function (map, key) { return key in map; },
            get: downLevel
                ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
                : function (map, key) { return map[key]; },
        };
        // Load global or shim versions of Map, Set, and WeakMap
        var functionPrototype = Object.getPrototypeOf(Function);
        var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
        var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
        var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
        var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
        // [[Metadata]] internal slot
        // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
        var Metadata = new _WeakMap();
        /**
         * Applies a set of decorators to a property of a target object.
         * @param decorators An array of decorators.
         * @param target The target object.
         * @param propertyKey (Optional) The property key to decorate.
         * @param attributes (Optional) The property descriptor for the target key.
         * @remarks Decorators are applied in reverse order.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Example = Reflect.decorate(decoratorsArray, Example);
         *
         *     // property (on constructor)
         *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Object.defineProperty(Example, "staticMethod",
         *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
         *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
         *
         *     // method (on prototype)
         *     Object.defineProperty(Example.prototype, "method",
         *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
         *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
         *
         */
        function decorate(decorators, target, propertyKey, attributes) {
            if (!IsUndefined(propertyKey)) {
                if (!IsArray(decorators))
                    throw new TypeError();
                if (!IsObject(target))
                    throw new TypeError();
                if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                    throw new TypeError();
                if (IsNull(attributes))
                    attributes = undefined;
                propertyKey = ToPropertyKey(propertyKey);
                return DecorateProperty(decorators, target, propertyKey, attributes);
            }
            else {
                if (!IsArray(decorators))
                    throw new TypeError();
                if (!IsConstructor(target))
                    throw new TypeError();
                return DecorateConstructor(decorators, target);
            }
        }
        exporter("decorate", decorate);
        // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
        // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
        /**
         * A default metadata decorator factory that can be used on a class, class member, or parameter.
         * @param metadataKey The key for the metadata entry.
         * @param metadataValue The value for the metadata entry.
         * @returns A decorator function.
         * @remarks
         * If `metadataKey` is already defined for the target and target key, the
         * metadataValue for that key will be overwritten.
         * @example
         *
         *     // constructor
         *     @Reflect.metadata(key, value)
         *     class Example {
         *     }
         *
         *     // property (on constructor, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticProperty;
         *     }
         *
         *     // property (on prototype, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         property;
         *     }
         *
         *     // method (on constructor)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticMethod() { }
         *     }
         *
         *     // method (on prototype)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         method() { }
         *     }
         *
         */
        function metadata(metadataKey, metadataValue) {
            function decorator(target, propertyKey) {
                if (!IsObject(target))
                    throw new TypeError();
                if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                    throw new TypeError();
                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
            }
            return decorator;
        }
        exporter("metadata", metadata);
        /**
         * Define a unique metadata entry on the target.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param metadataValue A value that contains attached metadata.
         * @param target The target object on which to define metadata.
         * @param propertyKey (Optional) The property key for the target.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Reflect.defineMetadata("custom:annotation", options, Example);
         *
         *     // property (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
         *
         *     // method (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
         *
         *     // decorator factory as metadata-producing annotation.
         *     function MyAnnotation(options): Decorator {
         *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
         *     }
         *
         */
        function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        exporter("defineMetadata", defineMetadata);
        /**
         * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasMetadata", hasMetadata);
        /**
         * Gets a value indicating whether the target object has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasOwnMetadata", hasOwnMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetMetadata(metadataKey, target, propertyKey);
        }
        exporter("getMetadata", getMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("getOwnMetadata", getOwnMetadata);
        /**
         * Gets the metadata keys defined on the target object or its prototype chain.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "method");
         *
         */
        function getMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryMetadataKeys(target, propertyKey);
        }
        exporter("getMetadataKeys", getMetadataKeys);
        /**
         * Gets the unique metadata keys defined on the target object.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
         *
         */
        function getOwnMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryOwnMetadataKeys(target, propertyKey);
        }
        exporter("getOwnMetadataKeys", getOwnMetadataKeys);
        /**
         * Deletes the metadata entry from the target object with the provided key.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata entry was found and deleted; otherwise, false.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.deleteMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function deleteMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return false;
            if (!metadataMap.delete(metadataKey))
                return false;
            if (metadataMap.size > 0)
                return true;
            var targetMetadata = Metadata.get(target);
            targetMetadata.delete(propertyKey);
            if (targetMetadata.size > 0)
                return true;
            Metadata.delete(target);
            return true;
        }
        exporter("deleteMetadata", deleteMetadata);
        function DecorateConstructor(decorators, target) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsConstructor(decorated))
                        throw new TypeError();
                    target = decorated;
                }
            }
            return target;
        }
        function DecorateProperty(decorators, target, propertyKey, descriptor) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target, propertyKey, descriptor);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsObject(decorated))
                        throw new TypeError();
                    descriptor = decorated;
                }
            }
            return descriptor;
        }
        function GetOrCreateMetadataMap(O, P, Create) {
            var targetMetadata = Metadata.get(O);
            if (IsUndefined(targetMetadata)) {
                if (!Create)
                    return undefined;
                targetMetadata = new _Map();
                Metadata.set(O, targetMetadata);
            }
            var metadataMap = targetMetadata.get(P);
            if (IsUndefined(metadataMap)) {
                if (!Create)
                    return undefined;
                metadataMap = new _Map();
                targetMetadata.set(P, metadataMap);
            }
            return metadataMap;
        }
        // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
        function OrdinaryHasMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return true;
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryHasMetadata(MetadataKey, parent, P);
            return false;
        }
        // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
        function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return false;
            return ToBoolean(metadataMap.has(MetadataKey));
        }
        // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
        function OrdinaryGetMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return OrdinaryGetOwnMetadata(MetadataKey, O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryGetMetadata(MetadataKey, parent, P);
            return undefined;
        }
        // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
        function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return undefined;
            return metadataMap.get(MetadataKey);
        }
        // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
        function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
            metadataMap.set(MetadataKey, MetadataValue);
        }
        // 3.1.6.1 OrdinaryMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
        function OrdinaryMetadataKeys(O, P) {
            var ownKeys = OrdinaryOwnMetadataKeys(O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (parent === null)
                return ownKeys;
            var parentKeys = OrdinaryMetadataKeys(parent, P);
            if (parentKeys.length <= 0)
                return ownKeys;
            if (ownKeys.length <= 0)
                return parentKeys;
            var set = new _Set();
            var keys = [];
            for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
                var key = ownKeys_1[_i];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
                var key = parentKeys_1[_a];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            return keys;
        }
        // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
        function OrdinaryOwnMetadataKeys(O, P) {
            var keys = [];
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return keys;
            var keysObj = metadataMap.keys();
            var iterator = GetIterator(keysObj);
            var k = 0;
            while (true) {
                var next = IteratorStep(iterator);
                if (!next) {
                    keys.length = k;
                    return keys;
                }
                var nextValue = IteratorValue(next);
                try {
                    keys[k] = nextValue;
                }
                catch (e) {
                    try {
                        IteratorClose(iterator);
                    }
                    finally {
                        throw e;
                    }
                }
                k++;
            }
        }
        // 6 ECMAScript Data Typ0es and Values
        // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
        function Type(x) {
            if (x === null)
                return 1 /* Null */;
            switch (typeof x) {
                case "undefined": return 0 /* Undefined */;
                case "boolean": return 2 /* Boolean */;
                case "string": return 3 /* String */;
                case "symbol": return 4 /* Symbol */;
                case "number": return 5 /* Number */;
                case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
                default: return 6 /* Object */;
            }
        }
        // 6.1.1 The Undefined Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
        function IsUndefined(x) {
            return x === undefined;
        }
        // 6.1.2 The Null Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
        function IsNull(x) {
            return x === null;
        }
        // 6.1.5 The Symbol Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
        function IsSymbol(x) {
            return typeof x === "symbol";
        }
        // 6.1.7 The Object Type
        // https://tc39.github.io/ecma262/#sec-object-type
        function IsObject(x) {
            return typeof x === "object" ? x !== null : typeof x === "function";
        }
        // 7.1 Type Conversion
        // https://tc39.github.io/ecma262/#sec-type-conversion
        // 7.1.1 ToPrimitive(input [, PreferredType])
        // https://tc39.github.io/ecma262/#sec-toprimitive
        function ToPrimitive(input, PreferredType) {
            switch (Type(input)) {
                case 0 /* Undefined */: return input;
                case 1 /* Null */: return input;
                case 2 /* Boolean */: return input;
                case 3 /* String */: return input;
                case 4 /* Symbol */: return input;
                case 5 /* Number */: return input;
            }
            var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
            var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
            if (exoticToPrim !== undefined) {
                var result = exoticToPrim.call(input, hint);
                if (IsObject(result))
                    throw new TypeError();
                return result;
            }
            return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
        }
        // 7.1.1.1 OrdinaryToPrimitive(O, hint)
        // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
        function OrdinaryToPrimitive(O, hint) {
            if (hint === "string") {
                var toString_1 = O.toString;
                if (IsCallable(toString_1)) {
                    var result = toString_1.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            else {
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var toString_2 = O.toString;
                if (IsCallable(toString_2)) {
                    var result = toString_2.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            throw new TypeError();
        }
        // 7.1.2 ToBoolean(argument)
        // https://tc39.github.io/ecma262/2016/#sec-toboolean
        function ToBoolean(argument) {
            return !!argument;
        }
        // 7.1.12 ToString(argument)
        // https://tc39.github.io/ecma262/#sec-tostring
        function ToString(argument) {
            return "" + argument;
        }
        // 7.1.14 ToPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-topropertykey
        function ToPropertyKey(argument) {
            var key = ToPrimitive(argument, 3 /* String */);
            if (IsSymbol(key))
                return key;
            return ToString(key);
        }
        // 7.2 Testing and Comparison Operations
        // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
        // 7.2.2 IsArray(argument)
        // https://tc39.github.io/ecma262/#sec-isarray
        function IsArray(argument) {
            return Array.isArray
                ? Array.isArray(argument)
                : argument instanceof Object
                    ? argument instanceof Array
                    : Object.prototype.toString.call(argument) === "[object Array]";
        }
        // 7.2.3 IsCallable(argument)
        // https://tc39.github.io/ecma262/#sec-iscallable
        function IsCallable(argument) {
            // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
            return typeof argument === "function";
        }
        // 7.2.4 IsConstructor(argument)
        // https://tc39.github.io/ecma262/#sec-isconstructor
        function IsConstructor(argument) {
            // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
            return typeof argument === "function";
        }
        // 7.2.7 IsPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-ispropertykey
        function IsPropertyKey(argument) {
            switch (Type(argument)) {
                case 3 /* String */: return true;
                case 4 /* Symbol */: return true;
                default: return false;
            }
        }
        // 7.3 Operations on Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-objects
        // 7.3.9 GetMethod(V, P)
        // https://tc39.github.io/ecma262/#sec-getmethod
        function GetMethod(V, P) {
            var func = V[P];
            if (func === undefined || func === null)
                return undefined;
            if (!IsCallable(func))
                throw new TypeError();
            return func;
        }
        // 7.4 Operations on Iterator Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
        function GetIterator(obj) {
            var method = GetMethod(obj, iteratorSymbol);
            if (!IsCallable(method))
                throw new TypeError(); // from Call
            var iterator = method.call(obj);
            if (!IsObject(iterator))
                throw new TypeError();
            return iterator;
        }
        // 7.4.4 IteratorValue(iterResult)
        // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
        function IteratorValue(iterResult) {
            return iterResult.value;
        }
        // 7.4.5 IteratorStep(iterator)
        // https://tc39.github.io/ecma262/#sec-iteratorstep
        function IteratorStep(iterator) {
            var result = iterator.next();
            return result.done ? false : result;
        }
        // 7.4.6 IteratorClose(iterator, completion)
        // https://tc39.github.io/ecma262/#sec-iteratorclose
        function IteratorClose(iterator) {
            var f = iterator["return"];
            if (f)
                f.call(iterator);
        }
        // 9.1 Ordinary Object Internal Methods and Internal Slots
        // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
        // 9.1.1.1 OrdinaryGetPrototypeOf(O)
        // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
        function OrdinaryGetPrototypeOf(O) {
            var proto = Object.getPrototypeOf(O);
            if (typeof O !== "function" || O === functionPrototype)
                return proto;
            // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
            // Try to determine the superclass constructor. Compatible implementations
            // must either set __proto__ on a subclass constructor to the superclass constructor,
            // or ensure each class has a valid `constructor` property on its prototype that
            // points back to the constructor.
            // If this is not the same as Function.[[Prototype]], then this is definately inherited.
            // This is the case when in ES6 or when using __proto__ in a compatible browser.
            if (proto !== functionPrototype)
                return proto;
            // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
            var prototype = O.prototype;
            var prototypeProto = prototype && Object.getPrototypeOf(prototype);
            if (prototypeProto == null || prototypeProto === Object.prototype)
                return proto;
            // If the constructor was not a function, then we cannot determine the heritage.
            var constructor = prototypeProto.constructor;
            if (typeof constructor !== "function")
                return proto;
            // If we have some kind of self-reference, then we cannot determine the heritage.
            if (constructor === O)
                return proto;
            // we have a pretty good guess at the heritage.
            return constructor;
        }
        // naive Map shim
        function CreateMapPolyfill() {
            var cacheSentinel = {};
            var arraySentinel = [];
            var MapIterator = /** @class */ (function () {
                function MapIterator(keys, values, selector) {
                    this._index = 0;
                    this._keys = keys;
                    this._values = values;
                    this._selector = selector;
                }
                MapIterator.prototype["@@iterator"] = function () { return this; };
                MapIterator.prototype[iteratorSymbol] = function () { return this; };
                MapIterator.prototype.next = function () {
                    var index = this._index;
                    if (index >= 0 && index < this._keys.length) {
                        var result = this._selector(this._keys[index], this._values[index]);
                        if (index + 1 >= this._keys.length) {
                            this._index = -1;
                            this._keys = arraySentinel;
                            this._values = arraySentinel;
                        }
                        else {
                            this._index++;
                        }
                        return { value: result, done: false };
                    }
                    return { value: undefined, done: true };
                };
                MapIterator.prototype.throw = function (error) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    throw error;
                };
                MapIterator.prototype.return = function (value) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    return { value: value, done: true };
                };
                return MapIterator;
            }());
            return /** @class */ (function () {
                function Map() {
                    this._keys = [];
                    this._values = [];
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                }
                Object.defineProperty(Map.prototype, "size", {
                    get: function () { return this._keys.length; },
                    enumerable: true,
                    configurable: true
                });
                Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
                Map.prototype.get = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    return index >= 0 ? this._values[index] : undefined;
                };
                Map.prototype.set = function (key, value) {
                    var index = this._find(key, /*insert*/ true);
                    this._values[index] = value;
                    return this;
                };
                Map.prototype.delete = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    if (index >= 0) {
                        var size = this._keys.length;
                        for (var i = index + 1; i < size; i++) {
                            this._keys[i - 1] = this._keys[i];
                            this._values[i - 1] = this._values[i];
                        }
                        this._keys.length--;
                        this._values.length--;
                        if (key === this._cacheKey) {
                            this._cacheKey = cacheSentinel;
                            this._cacheIndex = -2;
                        }
                        return true;
                    }
                    return false;
                };
                Map.prototype.clear = function () {
                    this._keys.length = 0;
                    this._values.length = 0;
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                };
                Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
                Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
                Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
                Map.prototype["@@iterator"] = function () { return this.entries(); };
                Map.prototype[iteratorSymbol] = function () { return this.entries(); };
                Map.prototype._find = function (key, insert) {
                    if (this._cacheKey !== key) {
                        this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                    }
                    if (this._cacheIndex < 0 && insert) {
                        this._cacheIndex = this._keys.length;
                        this._keys.push(key);
                        this._values.push(undefined);
                    }
                    return this._cacheIndex;
                };
                return Map;
            }());
            function getKey(key, _) {
                return key;
            }
            function getValue(_, value) {
                return value;
            }
            function getEntry(key, value) {
                return [key, value];
            }
        }
        // naive Set shim
        function CreateSetPolyfill() {
            return /** @class */ (function () {
                function Set() {
                    this._map = new _Map();
                }
                Object.defineProperty(Set.prototype, "size", {
                    get: function () { return this._map.size; },
                    enumerable: true,
                    configurable: true
                });
                Set.prototype.has = function (value) { return this._map.has(value); };
                Set.prototype.add = function (value) { return this._map.set(value, value), this; };
                Set.prototype.delete = function (value) { return this._map.delete(value); };
                Set.prototype.clear = function () { this._map.clear(); };
                Set.prototype.keys = function () { return this._map.keys(); };
                Set.prototype.values = function () { return this._map.values(); };
                Set.prototype.entries = function () { return this._map.entries(); };
                Set.prototype["@@iterator"] = function () { return this.keys(); };
                Set.prototype[iteratorSymbol] = function () { return this.keys(); };
                return Set;
            }());
        }
        // naive WeakMap shim
        function CreateWeakMapPolyfill() {
            var UUID_SIZE = 16;
            var keys = HashMap.create();
            var rootKey = CreateUniqueKey();
            return /** @class */ (function () {
                function WeakMap() {
                    this._key = CreateUniqueKey();
                }
                WeakMap.prototype.has = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.has(table, this._key) : false;
                };
                WeakMap.prototype.get = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.get(table, this._key) : undefined;
                };
                WeakMap.prototype.set = function (target, value) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ true);
                    table[this._key] = value;
                    return this;
                };
                WeakMap.prototype.delete = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? delete table[this._key] : false;
                };
                WeakMap.prototype.clear = function () {
                    // NOTE: not a real clear, just makes the previous data unreachable
                    this._key = CreateUniqueKey();
                };
                return WeakMap;
            }());
            function CreateUniqueKey() {
                var key;
                do
                    key = "@@WeakMap@@" + CreateUUID();
                while (HashMap.has(keys, key));
                keys[key] = true;
                return key;
            }
            function GetOrCreateWeakMapTable(target, create) {
                if (!hasOwn.call(target, rootKey)) {
                    if (!create)
                        return undefined;
                    Object.defineProperty(target, rootKey, { value: HashMap.create() });
                }
                return target[rootKey];
            }
            function FillRandomBytes(buffer, size) {
                for (var i = 0; i < size; ++i)
                    buffer[i] = Math.random() * 0xff | 0;
                return buffer;
            }
            function GenRandomBytes(size) {
                if (typeof Uint8Array === "function") {
                    if (typeof crypto !== "undefined")
                        return crypto.getRandomValues(new Uint8Array(size));
                    if (typeof msCrypto !== "undefined")
                        return msCrypto.getRandomValues(new Uint8Array(size));
                    return FillRandomBytes(new Uint8Array(size), size);
                }
                return FillRandomBytes(new Array(size), size);
            }
            function CreateUUID() {
                var data = GenRandomBytes(UUID_SIZE);
                // mark as random - RFC 4122 § 4.4
                data[6] = data[6] & 0x4f | 0x40;
                data[8] = data[8] & 0xbf | 0x80;
                var result = "";
                for (var offset = 0; offset < UUID_SIZE; ++offset) {
                    var byte = data[offset];
                    if (offset === 4 || offset === 6 || offset === 8)
                        result += "-";
                    if (byte < 16)
                        result += "0";
                    result += byte.toString(16).toLowerCase();
                }
                return result;
            }
        }
        // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
        function MakeDictionary(obj) {
            obj.__ = undefined;
            delete obj.__;
            return obj;
        }
    });
})(Reflect$1 || (Reflect$1 = {}));

const METADATA_KEYS = {
  MODULE: Symbol('wc-metadata:module'),
  PROVIDER: Symbol('wc-metadata:provider'),
  COMPONENT: Symbol('wc-metadata:component'),
  INJECT: Symbol('wc-metadata:inject'),
  INPUT: Symbol('wc-metadata:input')
};

class Metadata {
  static setModuleConfig(moduleClass, moduleConfig) {
    Reflect.defineMetadata(METADATA_KEYS.MODULE, moduleConfig, moduleClass);
  }

  static getModuleConfig(moduleClass) {
    return Reflect.getMetadata(METADATA_KEYS.MODULE, moduleClass);
  }

  static setComponentConfig(componentClass, componentConfig) {
    Reflect.defineMetadata(METADATA_KEYS.COMPONENT, componentConfig, componentClass);
  }

  static getComponentConfig(componentClass) {
    return Reflect.getMetadata(METADATA_KEYS.COMPONENT, componentClass);
  }

  static setProviderConfig(providerClass, config = {}) {
    Reflect.defineMetadata(METADATA_KEYS.PROVIDER, config, providerClass);
  }

  static getProviderConfig(providerClass) {
    return Reflect.getMetadata(METADATA_KEYS.PROVIDER, providerClass);
  }

  static setInjectedProviderConfig(hostClass, providerClass, targetParameterIndex) {
    const hasMetadata = Reflect.hasMetadata(METADATA_KEYS.INJECT, hostClass);

    if (!hasMetadata) {
      Reflect.defineMetadata(METADATA_KEYS.INJECT, [{
        providerClass,
        targetParameterIndex
      }], hostClass);
    } else {
      const injectMetadata = Metadata.getInjectedProviderConfig(hostClass);
      injectMetadata.push({
        providerClass,
        targetParameterIndex
      });
    }
  }

  static getInjectedProviderConfig(hostClass) {
    return Reflect.getMetadata(METADATA_KEYS.INJECT, hostClass) || [];
  }

  static setComponentInputConfig(componentInstance, componentPropertyKey, inputAttributeName) {
    const componentClass = componentInstance.constructor;
    const hasMetadata = Reflect.hasMetadata(METADATA_KEYS.INPUT, componentClass);

    if (!hasMetadata) {
      Reflect.defineMetadata(METADATA_KEYS.INPUT, [{
        componentPropertyKey,
        inputAttributeName
      }], componentClass);
    } else {
      const inputMetadata = Metadata.getComponentInputConfig(componentClass);
      inputMetadata.push({
        componentPropertyKey,
        inputAttributeName
      });
    }
  }

  static getComponentInputConfig(componentClass) {
    return Reflect.getMetadata(METADATA_KEYS.INPUT, componentClass) || [];
  }

}

class Runtime {
  constructor() {
    this.providerInstanceMap = new WeakMap();
  }

  initModule(moduleClass) {
    const {
      components
    } = Metadata.getModuleConfig(moduleClass); // init components

    components.forEach(componentClass => this.initComponent(componentClass));
  }

  initProvider(providerClass) {
    const providerConfig = Metadata.getProviderConfig(providerClass); // just validate and make sure that class is decorated with @WCProvider()

    if (!providerConfig) {
      throw Error('Injected provider is not decorated with @WCProvider().');
    }

    this.createProviderInstance(providerClass);
  }

  initComponent(componentClass) {
    const {
      selector,
      template
    } = Metadata.getComponentConfig(componentClass);
    const injectMetadata = Metadata.getInjectedProviderConfig(componentClass); // init providers that are used in component(s)

    injectMetadata.forEach(injectMetadataConfig => {
      this.initProvider(injectMetadataConfig.providerClass);
    });
    const constructorParams = this.getHostClassConstructorParams(injectMetadata);
    const inputConfigForComponent = Metadata.getComponentInputConfig(componentClass);
    const componentFactory = this.getComponentFactory(componentClass, constructorParams, inputConfigForComponent, template); // register web component element

    customElements.define(selector, componentFactory);
  }

  createProviderInstance(providerClass) {
    if (this.providerInstanceMap.has(providerClass)) {
      return;
    }

    const injectMetadata = Metadata.getInjectedProviderConfig(providerClass) || []; // create dependency instances first

    injectMetadata.forEach(injectConfig => {
      this.createProviderInstance(injectConfig.providerClass);
    }); // all dependencies are initiated, now create the wrapping provider with injected params

    const constructorParams = this.getHostClassConstructorParams(injectMetadata); // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore

    const providerInstance = new providerClass(...constructorParams);
    this.providerInstanceMap.set(providerClass, providerInstance);
  }

  getHostClassConstructorParams(injectMetadata) {
    return injectMetadata.sort((config1, config2) => config1.targetParameterIndex - config2.targetParameterIndex).map(config => this.providerInstanceMap.get(config.providerClass));
  }

  getComponentFactory(componentClass, componentClassConstructorParams, componentInputs, componentTemplate) {
    return class RunTimeWebComponentClass extends HTMLElement {
      constructor() {
        super(); // create mapped component instance
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore

        this.componentInstance = new componentClass(...componentClassConstructorParams); // setTimeout is required because in IE11, the order of onInit() is different.
        // to align the functionality across the browsers, setTimeout is needed here

        setTimeout(() => {
          // the way for it to work on IE11 and applying global styles to the components
          this.insertAdjacentHTML('beforeend', componentTemplate);
        });
      }

      static get observedAttributes() {
        return componentInputs.map(input => input.inputAttributeName);
      }

      connectedCallback() {
        const observedAttributes = RunTimeWebComponentClass.observedAttributes;
        observedAttributes.forEach(attr => {
          // read the initial attribute values
          const [propertyKey, attrValue] = this.getPropertyKeyAttrPair(attr); // update the value in component instance
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore

          this.componentInstance[propertyKey] = attrValue;
        });

        if (this.isConnected) {
          // call the onInit if exists
          if (this.componentInstance.onInit) {
            this.componentInstance.onInit.bind(this.componentInstance)();
          }
        }
      }

      attributeChangedCallback(name, oldValue, newValue) {
        // map the class property name for the reflection of attr changes
        const inputConfigForChange = componentInputs.find(input => input.inputAttributeName === name); // if can not be found, then means there is a problem with code!

        if (!inputConfigForChange) {
          throw Error(`watched attribute ${name} is not bound properly to the @WcInput() decorated property`);
        } // update the value in component instance
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore


        this.componentInstance[inputConfigForChange.componentPropertyKey] = newValue; // call the onChanges if exists

        if (this.componentInstance.onChanges) {
          this.componentInstance.onChanges.bind(this.componentInstance)({
            [name]: {
              oldValue,
              newValue
            }
          });
        }
      }

      disconnectedCallback() {
        // call the onDestroy if exists
        if (this.componentInstance.onDestroy) {
          this.componentInstance.onDestroy.bind(this.componentInstance)();
        }
      }

      getPropertyKeyAttrPair(attr) {
        const value = this.getAttribute(attr);
        const input = componentInputs.find(cInput => cInput.inputAttributeName === attr); // if can not be found, then means there is a problem with code!

        if (!input) {
          throw Error(`watched attribute ${attr} is not bound properly to the @WcInput() decorated property`);
        }

        return [input.componentPropertyKey, value];
      }

    };
  }

}

const bootstrap = moduleClass => {
  const runtime = new Runtime();
  runtime.initModule(moduleClass);
};

const Module = config => target => Metadata.setModuleConfig(target, config);
const Component = config => target => Metadata.setComponentConfig(target, config);
const Injectable = () => target => Metadata.setProviderConfig(target, true);
const Inject = providerClass => // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
(target, propertyKey, parameterIndex) => Metadata.setInjectedProviderConfig(target, providerClass, parameterIndex);
const Input = name => (target, propertyKey) => Metadata.setComponentInputConfig(target, propertyKey, name || propertyKey);

let LogService = class LogService {
  log(...input) {
    console.log(...input);
  }

};
LogService = __decorate([Injectable()], LogService);

let TestService = class TestService {
  constructor(logService) {
    this.logService = logService;
    this.isTest = true;
  }

  checkIfTest() {
    this.logService.log('is test :', this.isTest);
  }

};
TestService = __decorate([Injectable(), __param(0, Inject(LogService)), __metadata("design:paramtypes", [LogService])], TestService);

var appTemplate = "<div class=\"app-component\">\n    <span>App Component</span>\n    <loading-component></loading-component>\n    <test-component></test-component>\n</div>\n";

let AppComponent = class AppComponent {
  constructor(logService, testService) {
    this.logService = logService;
    this.testService = testService; //
  }

  onInit() {
    this.testService.checkIfTest();
    this.logService.log('app component on init', 'index :', this.index);
  }

  onChanges(changes) {
    this.logService.log('changes :', changes);
  }

  onDestroy() {
    this.testService.checkIfTest();
    this.logService.log('app component on destroy');
  }

};

__decorate([Input(), __metadata("design:type", String)], AppComponent.prototype, "index", void 0);

AppComponent = __decorate([Component({
  selector: 'app-component',
  template: appTemplate
}), __param(0, Inject(LogService)), __param(1, Inject(TestService)), __metadata("design:paramtypes", [LogService, TestService])], AppComponent);

var loadingTemplate = "<div class=\"loading-component\">\n    <span>Loading...</span>\n</div>\n";

let LoadingComponent = class LoadingComponent {
  constructor(logService) {
    this.logService = logService;
  }

  onInit() {
    this.logService.log('loading on init');
  }

  onDestroy() {
    this.logService.log('loading on destroy');
  }

};
LoadingComponent = __decorate([Component({
  selector: 'loading-component',
  template: loadingTemplate
}), __param(0, Inject(LogService)), __metadata("design:paramtypes", [LogService])], LoadingComponent);

var testTemplate = "<div class=\"test-component\">Test Component</div>\n";

let TestComponent = class TestComponent {};
TestComponent = __decorate([Component({
  selector: 'test-component',
  template: testTemplate
})], TestComponent);

let BuiltInModule = class BuiltInModule {};
BuiltInModule = __decorate([Module({
  components: [AppComponent, LoadingComponent, TestComponent],
  providers: [TestService, LogService]
})], BuiltInModule);
function useBuiltIns() {
  bootstrap(BuiltInModule);
}

export { BuiltInModule, useBuiltIns };
//# sourceMappingURL=module.js.map
