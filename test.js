var watcher = {
  subs: {},
  subscribe(type, fn) {
    if (!this.subs[type]) {
      this.subs[type] = [];
    }
    this.subs[type].push(fn);
  },
  unsubscriber(type, fn) {
    this.subs[type] = this.subs[type].filter((func) => {
      return func !== fn;
    });
  },
  publish(type, ...args) {
    this.subs[type].forEach((func) => {
      func(...args);
    });
  },
};

var tom = {
  read(info) {
    console.log(info);
  },
};
