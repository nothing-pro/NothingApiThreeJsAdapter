import App from './core/App.js';
import {
  CLICK,
  LEVEL_ENTER,
  LEVEL_LEAVE
} from './core/Events.js';
import eventManager from './core/Event.js';

export default {
  // event
  CLICK,
  LEVEL_ENTER,
  LEVEL_LEAVE,
  // 单例对象
  /**
   * 事件管理单例
   * @constant EVENT
   * @type {Event}
   */
  EVENT: eventManager,
  /**
   * 背景枚举
   * @constant BACKGROUND
   * @type {object}
   */
  BACKGROUND: {
    COLOR: 'BACKGROUND_COLOR',
    IMAGE: 'BACKGROUND_IMAGE',
    ENV: 'BACKGROUND_ENV',
    SKY: 'BACKGROUND_SKY'
  },
  // class
  App,
  // version
  VERSION: '1.0.0'
};
