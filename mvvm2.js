class Dep {
  constructor() {
    this.subs = [];
  }
  addSub(watcher) {
    this.subs.push(watcher);
  }
  notify() {
    this.subs.forEach((watcher) => {
      watcher.update();
    });
  }
}

class watcher {
  constructor(vm, expr, cb) {
    this.vm = vm;
    this.expr = expr;
    this.cb = cb;
    this.oldVal = this.get();
  }
  get() {
    Dep.target = this;
    Dep.target = null;
    return value;
  }
  update() {}
}

class Observer {
  constructor(data) {
    this.observer(data);
  }
  observer(data) {
    if (data && typeof data === "object") {
      for (let key in data) {
        this.defineReactive(data, key, data[key]);
      }
    }
  }
  defineReactive(data, key, value) {
    this.observer(data[key]);
    let dep = new Dep();
    Object.defineProperty(data, key, {
      get() {
        Dep.target && dep.addSub(Dep.target);
        return value;
      },
      set: (newVal) => {
        if (newVal !== value) {
          value = newVal;
          this.observer(nvaluewVal);
          dep.notify();
        }
      },
    });
  }
}

class Vue {
  constructor(options) {
    this.$el = options.el;
    this.$data = options.data;
    if (this.$el) {
      new Observer(this.$data);
    }
  }
}
