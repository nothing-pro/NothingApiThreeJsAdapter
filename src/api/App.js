import * as THREE from '../../threeJs/three.module.js';
import { OrbitControls } from '../../threeJs/controls/OrbitControls.js';
import { GLTFLoader } from '../../threeJs/loaders/GLTFLoader.js';
import { RGBELoader } from '../../threeJs/loaders/RGBELoader.js';

import { EffectComposer } from '../../threeJs/postprocessing/EffectComposer.js';
import { RenderPass } from '../../threeJs/postprocessing/RenderPass.js';
import { ShaderPass } from '../../threeJs/postprocessing/ShaderPass.js';
import { OutlinePass } from '../../threeJs/postprocessing/OutlinePass.js';
import { FXAAShader } from '../../threeJs/shaders/FXAAShader.js';
// import { SMAAPass } from '../../threeJs/postprocessing/SMAAPass.js';

export default class App {
  /**
   * @classdesc 应用起始
   * ```json
   * {
   *   el: 'el',
   *   location: true,
   *   environment: '',
   *   model: '',
   *   settings: '',
   *   canvas: ''
   * }
   * ```
   *
   * **当前可用配置**
   *
   * | 参数 | 值 |
   * | - | - |
   * | el | divId |
   * | scene | 场景链接 |
   *
   * @constructor App
   * @author Zhoyq <feedback@zhoyq.com>
   * @since 2020-12-17
   * @param {object} options 配置选项
   */
  constructor(options) {
    this._options = options;
    this._container = undefined;
    this._scene = undefined;
    this._camera = undefined;
    this._renderer = undefined;
  }

  /**
   * 初始化
   * @memberof App#
   * @method initialize
   */
  async initialize() {
    const self = this;

    if (self._options.el !== undefined) {
      self._container = document.getElementById(self._options.el);
    } else {
      self._container = document.createElement('div');
      document.body.appendChild(self._container);
    }

    self._scene = new THREE.Scene();
    self._camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 1000);
    self._camera.position.set(-2.3605424237310233, 1.2658040813285367, -1.1439639459812097);
    self._camera.lookAt(self._scene.position);

    self._scene.add(self._camera);

    self._renderer = new THREE.WebGLRenderer({ antialias: true });
    self._renderer.setPixelRatio(window.devicePixelRatio);
    self._renderer.setSize(window.innerWidth, window.innerHeight);

    const pmremGenerator = new THREE.PMREMGenerator(self._renderer);

    pmremGenerator.compileEquirectangularShader();

    // 加载环境
    const hdrLoader = new RGBELoader();

    hdrLoader.setDataType(THREE.UnsignedByteType);
    hdrLoader.load('../assets/textures/equirectangular/royal_esplanade_1k.hdr', (texture) => {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;

      self._scene.background = envMap;
      self._scene.environment = envMap;

      texture.dispose();
      pmremGenerator.dispose();
      // 加载 模型
      const loader = new GLTFLoader();

      loader.load(self._options.scene, (gltf) => {
        self._scene.add(gltf.scene);
      });
    });

    // 相机控制器
    const controls = new OrbitControls(self._camera, self._renderer.domElement);

    controls.enableRotate = true;
    controls.maxPolarAngle = Math.PI * 0.5;
    controls.minDistance = 0.1;
    controls.maxDistance = 900;

    self._container.appendChild(self._renderer.domElement);

    // 后期处理
    const composer = new EffectComposer(self._renderer);
    const renderPass = new RenderPass(self._scene, self._camera);

    composer.addPass(renderPass);

    const outlinePass = new OutlinePass(
      new THREE.Vector2(window.innerWidth, window.innerHeight), self._scene, self._camera);

    outlinePass.edgeStrength = Number(3.0);
    outlinePass.edgeGlow = Number(0.0);
    outlinePass.edgeThickness = Number(1.0);
    outlinePass.pulsePeriod = Number(0);
    outlinePass.usePatternTexture = false;
    outlinePass.visibleEdgeColor.set('#ffffff');
    outlinePass.hiddenEdgeColor.set('#190a05');

    composer.addPass(outlinePass);

    // const smaaPass = new SMAAPass(
    //   window.innerWidth * self._renderer.getPixelRatio(), window.innerHeight * self._renderer.getPixelRatio());

    // composer.addPass(smaaPass);
    const effectFXAA = new ShaderPass(FXAAShader);

    effectFXAA.uniforms[ 'resolution' ].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    composer.addPass(effectFXAA);

    // 拾取
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let selectedObjects = [];

    function addSelectedObject(object) {
      selectedObjects = [];
      selectedObjects.push(object);
    }

    function checkIntersection() {
      raycaster.setFromCamera(mouse, self._camera);

      const intersects = raycaster.intersectObject(self._scene, true);

      if (intersects.length > 0) {
        const selectedObject = intersects[0].object;

        addSelectedObject(selectedObject);
        outlinePass.selectedObjects = selectedObjects;

      } else {

        // outlinePass.selectedObjects = [];

      }
    }

    function onPointerMove(event) {
      if (event.isPrimary === false) return;

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      checkIntersection();
    }

    self._renderer.domElement.style.touchAction = 'none';
    self._renderer.domElement.addEventListener('pointermove', onPointerMove, false);

    // 重置窗口
    function onWindowResize() {
      const aspect = window.innerWidth / window.innerHeight;

      self._renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);

      self._camera.aspect = aspect;
      self._camera.updateProjectionMatrix();

      effectFXAA.uniforms[ 'resolution' ].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    }

    window.addEventListener('resize', onWindowResize, false);

    // 渲染
    function render() {
      self._renderer.clear();

      // self._renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
      // self._renderer.render(self._scene, self._camera);

      controls.update();
      composer.render();
    }

    function animate() {
      requestAnimationFrame(animate);

      render();
    }

    animate();

    return self;
  }

  /**
   * 重新设置长宽
   * @memberof App#
   * @method resize
   * @param {number} width 渲染宽度
   * @param {number} height 渲染高度
   */
  async resize(width, height) {}

  /**
   * 销毁
   * @memberof App#
   * @method destroy
   */
  async destroy() {}

  /**
   * 添加扩展
   * @memberof App#
   * @method destroy
   * @param {Map} extensions 扩展存储Map对象
   */
  async use(extensions) {}

  /**
   * 获取当前浏览器支持的扩展
   * @memberof App#
   * @method getSupportedExtensions
   */
  async getSupportedExtensions() {}

  /**
   * 获取 gl 参数
   * @memberof App#
   * @method getParameter
   * @param {number} name 参数对应KEY值
   */
  async getParameter(name) {}

  /**
   * 批量获取 gl 参数
   * @memberof App#
   * @method getParameters
   * @param {Array} nameArr 参数对应KEY值
   */
  async getParameters(nameArr) {}

  /**
   * 设置渲染参数
   * @memberof App#
   * @method setCurrentRenderingParameter
   * @param {string} key 渲染配置对应Key
   * @param {object} val 渲染配置对应val
   */
  async setCurrentRenderingParameter(key, val) { }

  /**
   * 获取渲染参数
   * @memberof App#
   * @method getCurrentRenderingParameter
   * @param {string} key 渲染配置对应Key
   */
  async getCurrentRenderingParameter(key) { }

  /**
   * 设置配置的背景色为 clearColor
   * @memberof App#
   * @method clearColor
   */
  async clearColor() { }

  /**
   * 获取配置
   * @memberof App#
   * @method getSettings
   */
  async getSettings() { }

  /**
   * 旋转场景
   * @memberof App#
   * @method rotateScene
   */
  async rotateScene() { }
}
