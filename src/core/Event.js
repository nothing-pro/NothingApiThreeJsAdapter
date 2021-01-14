class Event {
  /**
   * @classdesc 全局事件对象
   * @constructor Event
   * @author Zhoyq <feedback@zhoyq.com>
   * @since 2021-01-10
   */
  constructor() {}

  /**
   * 注册事件
   * @memberof Event#
   * @method on
   * @param {string} eventName 事件名称
   * @param {Object} object 挂载事件的对象
   * @param {function} eventFunc 事件回调
   */
  on(eventName, object, eventFunc) {
    if (object === undefined) {
      return;
    }

    if (object._events === undefined) {
      object._events = new Map();
    }

    let eventFuncList = object._events.get(eventName);

    if (eventFuncList === undefined) {
      eventFuncList = [];
      object._events.set(eventName, eventFuncList);
    }

    eventFuncList.push(eventFunc);
  }

  /**
   * 取消注册事件
   * @memberof Event#
   * @method off
   * @param {string} eventName 事件名称
   */
  off(eventName, object, eventFunc) {
    if (object === undefined || object._events === undefined) {
      return;
    }

    let eventFuncList = object._events.get(eventName);

    if (eventFuncList === undefined) {
      return;
    }

    for (let i = 0; i < eventFuncList.length; i++) {
      if (eventFunc === eventFuncList[i]) {
        eventFuncList.splice(i, 1);
      }
    }
  }

  /**
   * 注册事件 仅发生一次
   * @memberof Event#
   * @method one
   * @param {string} eventName 事件名称
   * @param {function} eventFunc 事件回调
   */
  one(eventName, object, eventFunc) {
    const self = this;

    if (object === undefined) {
      return;
    }

    if (object._events === undefined) {
      object._events = new Map();
    }

    let eventFuncList = object._events.get(eventName);

    if (eventFuncList === undefined) {
      eventFuncList = [];
      object._events.set(eventName, eventFuncList);
    }

    function eventFuncBuf() {
      eventFunc.apply(null, arguments);
      self.off(eventName, object, eventFuncBuf);
    }

    eventFuncList.push(eventFuncBuf);
  }

  /**
   * 触发事件
   * @memberof Event#
   * @method trigger
   * @param {string} eventName 事件名称
   * @param {object} additionalInfo 扩展信息
   */
  trigger(eventName, object, additionalInfo) {
    if (object === undefined || object._events === undefined) {
      return;
    }

    let eventFuncList = object._events.get(eventName);

    if (eventFuncList === undefined) {
      return;
    }

    for (let i = 0; i < eventFuncList.length; i++) {
      eventFuncList[i](additionalInfo);
    }
  }
}

const eventManager = new Event();

export default eventManager;
