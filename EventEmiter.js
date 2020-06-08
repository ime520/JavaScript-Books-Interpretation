class EventEmitter {
  constructor() {
    this._events = {};
  }
  on(type, listener, isInsertHead) {
    if (!this._events) {
      this._events = Object.create(null);
    }
    if (this._events[type]) {
      if (isInsertHead) {
        this._events[type].unshift(listener);
      } else {
        this._events[type].push(listener);
      }
    } else {
      this._events[type] = [listener];
    }
  }
  off(type, listener) {
    if (this._events[type]) {
      this._events[type] = this._events[type].filter((fn) => {
        return fn !== listener && fn.origin !== listener;
      });
    }
  }
  once(type, listener) {
    let _this = this;
    function only() {
      listener();
      _this.off(type, listener);
    }
    only.origin = listener;
    this.on(type, only);
  }
  emit(type, ...args) {
    if (this._events[type]) {
      this._events[type].forEach((fn) => {
        fn.call(this, ...args);
      });
    }
  }
}
