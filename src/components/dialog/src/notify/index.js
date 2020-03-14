import Vue from 'vue';
//这里只是构造完成 但是还没有实例化所以还不是一个组件
//使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象
const NotifyConstructor = Vue.extend(require('./notify.vue'));
//
const instance = new NotifyConstructor({
    //提供一个在页面上已存在的 DOM 元素作为 Vue 实例的挂载目标。可以是 CSS 选择器，也可以是一个 HTMLElement 实例。
    el: document.createElement('div')
});

let timer = null;
let lock = false;
//在构造器拓展方法（也可以理解为在vue选项中的method添加方法）
NotifyConstructor.prototype.closeNotify = function () {
    //实例上的classes 与data 定义的classes 一致
    instance.classes = 'yd-notify-out';

    setTimeout(() => {
        //Vue 实例使用的根 DOM 元素。
        const el = instance.$el;
        el.parentNode && el.parentNode.removeChild(el);
        lock = false;
    }, 150);
    //实例上的callback 与 props 定义的callback 一致
    typeof this.callback === 'function' && this.callback();
};

const Notify = (options = {}) => {
    instance.classes = '';
    instance.mes = options.mes;
    instance.timeout = ~~options.timeout || 5000;
    instance.callback = options.callback;

    if (lock)return;
    lock = true;

    document.body.appendChild(instance.$el);

    instance.$el.addEventListener('click', () => {
        clearTimeout(timer);
        instance.closeNotify();
    });

    timer = setTimeout(() => {
        clearTimeout(timer);
        instance.closeNotify();
    }, instance.timeout);
};

export default Notify;
