
class Dep {
    constructor() {
        this.subs = [];
    }
    addSub(watcher) {
        this.subs.push(watcher);
    }
    notify() {
        this.subs.forEach(watcher => {
            watcher.update();
        })
    }

}

class Watcher {
    constructor(vm, expr, cb) {
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        this.oldVal = this.get();
    }
    get() {
        Dep.target = this;
        let value = CompileUtil.getVal(this.vm, this.expr);
        return value;
    }
    update() {
        let newVal = CompileUtil.getVal(this.vm, this.expr);
        if (newVal !== this.oldVal) {
            this.cb(newVal);
        }
    }
}

class Observer {
    constructor(data) {
        this.observer(data);
    }
    observer(data) {
        if (data && typeof data === 'object') {
            for (let key in data) {
                this.defineReactive(data, key, data[key]);
            }
        }
    }
    defineReactive(obj, key, value) {
        this.observer(value);
        let dep = new Dep();
        Object.defineProperty(obj, key, {
            get() {
                Dep.target && dep.subs.push(Dep.target);
                return value;
            },
            set: (newVal) => {
                if (newVal !== value) {
                    this.observer(newVal);
                    value = newVal;
                    dep.notify();
                }
            }
        })
    }
}

class Compiler {
    constructor(el, vm) {
        this.el = this.isElementNode(el) ? el : document.querySelector(el);
        this.vm = vm;
        let fragment = this.node2fragment(this.el);
        this.compile(fragment);
        this.el.appendChild(fragment);
    }
    compile(node) {
        let childNodes = node.childNodes;
        [...childNodes].forEach((child) => {
            if (this.isElementNode(child)) {
                this.compileElement(child);
                this.compile(child);
            } else {
                this.compileText(child);
            }
        })
    }
    isDirective(attrName) {
        return attrName.startsWith('v-');
    }
    compileElement(node) {
        let attributes = node.attributes;
        [...attributes].forEach((attr) => {
            let { name, value: expr } = attr;
            if (this.isDirective(name)) {
                let [, directive] = name.split('-');
                CompileUtil[directive](node, expr, this.vm);
            }
        })
    }
    compileText(node) {
        let content = node.textContent;
        if (/\{\{.+?\}\}/.test(content)) { }
        CompileUtil['text'](node, content, this.vm)
    }
    node2fragment(node) {
        let fragment = document.createDocumentFragment();
        let firstChild;
        while (firstChild = node) {
            fragment.append(firstChild);
        }
        return fragment;
    }
    isElementNode(node) {
        return node.nodeType === 1;
    }
}

CompileUtil = {
    getVal(vm, expr) {
        expr.split('.').reduce((data, current) => {
            return data[current];
        }, vm.$data)
    },
    model(node, expr, vm) {
        let fn = this.updater['modelUpdater'];
        new Watcher(vm, expr, (newVal) => {
            fn(node, newVal);
        });
        let value = this.getVal(vm, expr);
        fn(node, value);
    },
    html(node, expr, vm) { },
    getContentVal(vm, expr) {
        return expr.replace(/\{\{.+\}\}/g, (...args) => {
            return this.getVal(args[1]);
        });
    },
    text(node, expr, vm) {
        let fn = this.updater['textUpdater'];
        let content = expr.replace(/\{\{.+\}\}/g, (...args) => {
            new Watcher(vm, args[1], (newVal) => {
                fn(node, this.getContentVal(vm, expr));
            });
            return this.getVal(vm, args[1]);
        });
        fn(node, content);
    },
    updater: {
        modelUpdater(node, value) {
            node.value = value;
        },
        htmlUpdater() { },
        textUpdater(node, value) {
            node.textContent = value;
        }
    }
}

class Vue {
    constructor(options) {
        this.$el = options.el;
        this.$data = options.data;
        if (this.$el) {
            new Observer(this.$data);
            new Compiler(this.$el, this);
        }
    }
}