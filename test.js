if (!Function.prototype.bind) {
  Function.prototype.bind = function () {
    var slice = [].slice;
    var func = this;
    var fNOP = function () {};
    var outerArgs = slice.call(arguments, 1);
    var newFunc = function () {
      var innerArgs = slice.call(arguments);
      var fullArgs = outerArgs.concat(innerArgs);
      return func.call(this, ...fullArgs);
    };
    // 如果是函数
    if (this.prototype) {
      fNOP.prototype = this.prototype;
    }
    newFunc.prototype = new fNOP();
    return newFunc;
  };
}
