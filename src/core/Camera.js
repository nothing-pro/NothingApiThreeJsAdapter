import * as THREE from '../../threeJs/three.module.js';
import { OrbitControls } from '../../threeJs/controls/OrbitControls.js';

export default class Camera {
  /**
   * @classdesc
   * 相机控制对象
   *
   * 不建议直接构造 会在app对象创建的时候自动生成
   *
   * @constructor Camera
   * @author Zhoyq <feedback@zhoyq.com>
   * @since 2021-01-10
   * @param {App} app 应用程序对象
   */
  constructor(app) {
    const self = this;

    self._app = app;
    // 相机对象
    const rendererWidth = document.documentElement.clientWidth;
    const rendererHeight = document.documentElement.clientHeight;

    self._camera = new THREE.PerspectiveCamera(50, rendererWidth / rendererHeight, 0.01, 1000);
    // 相机控制器
    self._controls = new OrbitControls(self._camera, app._renderer.domElement);

    self._controls.enableRotate = true;
    self._controls.maxPolarAngle = Math.PI * 0.5;
    self._controls.minDistance = 0.1;
    self._controls.maxDistance = 900;
  }

  /**
   * 调整场景相机到合适的位置
   * @memberof Camera#
   * @method fit
   * @param {Scene} scene options 场景对象
   */
  fit(scene) {
    const self = this;

    self._camera.position.set(-2.3605424237310233, 1.2658040813285367, -1.1439639459812097);
    self._camera.lookAt(scene._scene.position);
  }

  /**
   * 飞到某个位置
   * @memberof Camera#
   * @method flyTo
   * @param {Array} point options 场景对象 默认 [0, 0, 0]
   */
  flyTo(point) {}

  /**
   * 绕着一个点旋转
   * @memberof Camera#
   * @method rotateAround
   * @param {Array} point options 场景对象 默认 [0, 0, 0]
   */
  rotateAround(point) {}
}
