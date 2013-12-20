var create     = require('../utils').create;
var JSCompiler = require(
  'handlebars/dist/cjs/handlebars/compiler/javascript-compiler'
).default.prototype;

/**
 * Create the base compiler functionality and attach relevant references.
 */
var Compiler = module.exports = function () {};
Compiler.prototype = create(JSCompiler);
Compiler.prototype.compiler = Compiler;

/**
 * Override name lookup to use the function provided on the DOMBars object.
 *
 * @return {String}
 */
Compiler.prototype.nameLookup = function (parent, property, type) {
  if (type !== 'context') {
    return JSCompiler.nameLookup.call(this, parent, property, type);
  }

  this.context.aliases.get = 'this.get';

  var quotedParent   = this.quotedString(parent);
  var quotedProperty = this.quotedString(property);

  return 'get(' + parent + ', ' + quotedProperty + ', ' + quotedParent + ')';
};

/**
 * Override ambiguous invokes to produce just one source value.
 */
Compiler.prototype.invokeAmbiguous = function () {
  JSCompiler.invokeAmbiguous.apply(this, arguments);
  this.source.push(this.source.splice(-2).join('\n'));
};

/**
 * Override the ambigous block value invokation to produce a single source.
 */
Compiler.prototype.ambiguousBlockValue = function () {
  JSCompiler.ambiguousBlockValue.call(this);
  this.source.push(this.source.splice(-2).join('\n'));
};