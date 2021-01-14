import * as THREE from '../../threeJs/three.module.js';
import { gltfLoader } from '../utils/Loaders.js';
import RenderingParameter from './RenderingParameter.js';

export default class Scene {
  /**
   * @classdesc 场景封装
   * @constructor Scene
   * @author Zhoyq <feedback@zhoyq.com>
   * @since 2021-01-10
   * @param {object} config 场景配置
   */
  constructor(config) {
    const self = this;
    const { url, parameter } = config;

    self._isReady = false;
    self._scene = new THREE.Scene();
    self._parameter = new RenderingParameter(parameter);

    // 加载 模型
    gltfLoader.load(url, (gltf) => {
      self._scene.add(gltf.scene);
      self._isReady = true;
    });
  }

  /**
   * 获取场景级别
   * @memberof Scene#
   * @method getLevel
   * @returns {Level} 级别
   */
  async getLevel() {}

  /**
   * 设置渲染参数
   * @memberof Scene#
   * @method setRenderingParameter
   * @param {string} key 渲染配置对应Key
   * @param {object} val 渲染配置对应val
   * @param {Scene} scene options 渲染场景
   */
  async setRenderingParameter(key, val, scene) { }

  /**
   * 获取渲染参数
   * @memberof Scene#
   * @method getRenderingParameter
   * @param {string} key 渲染配置对应Key
   * @param {Scene} scene 渲染场景
   */
  async getRenderingParameter(key, scene) { }
}
