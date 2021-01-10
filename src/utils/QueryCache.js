export class QueryCache {
  /**
   * @classdesc 查询缓存
   * @constructor App
   * @author Zhoyq <feedback@zhoyq.com>
   * @since 2021-01-10
   * @param {Number} capacity 缓存容量
   */
  constructor() {
    this._cache = new WeakMap();
  }

  get(key) {
    return this._cache.get(key);
  }

  put(key, value) {
  }
}
