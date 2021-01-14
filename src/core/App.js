import Context from './Context.js';
import Camera from './Camera.js';
import { hdrLoader } from '../utils/Loaders.js';
import eventManager from './Event.js';
import * as EVENTS from './Events.js';
import GL from './GL.js';

import * as THREE from '../../threeJs/three.module.js';
import { EffectComposer } from '../../threeJs/postprocessing/EffectComposer.js';
import { RenderPass } from '../../threeJs/postprocessing/RenderPass.js';
import { ShaderPass } from '../../threeJs/postprocessing/ShaderPass.js';
import { OutlinePass } from '../../threeJs/postprocessing/OutlinePass.js';
import { FXAAShader } from '../../threeJs/shaders/FXAAShader.js';

export default class App {
  /**
   * @classdesc
   * 应用程序类，用于创建应用程序。
   *
   * **主要功能**
   *
   * - 初始化应用程序（构造）
   * - 全局事件管理（on、off、one、trigger）
   * - 对象挂载获取（getCamera、getContext、getUI）
   * - 启动扩展（use）
   * - 模型等加载（load）
   * - 获取gl运行时参数（getGL）
   * - 查询节点（query）
   * - 接口封装 （funcMode()、commandMode()、objectMode()）默认是 面向对象模式。
   *
   * **实例**
   *
   * ```js
   * // 创建应用程序
   *
   * const app = new NOTHING.App(); // 无参构造
   * const app = new NOTHING.App({ // 有参构造
   *   el: '#divId'
   * });
   *
   * // 加载模型文件
   *
   * const node = await app.load('/path/to/model');
   *
   * // 事件挂载
   *
   * const eventId = app.on(NOTHING.CLICK, function(event) {});
   *
   * // 节点查询
   * // 按照 json 精确匹配属性查询 也可以使用 RegExp 对象进行模糊匹配
   *
   * const list = app.query([{ id: '' }, { id: '' }]);
   * ```
   * @constructor App
   * @author Zhoyq <feedback@zhoyq.com>
   * @since 2021-01-08
   * @param {object} options 配置选项
   *
   * **可用参数**
   *
   * ```json
   * {
   *   el: '#divId'            // 可以使用 querySelector 查询的字符串 或者 HTMLDivElement 对象
   *   definition: {           // 场景定义 scene 当前显示场景ID scenes 需要加载的场景地址 parameters 可选 渲染参数 levels 可选 用于定义层级
   *     scene: '',
   *     parameters: {
   *       'id': {}
   *     },
   *     levels：{
   *       name: ''            // 层级名称
   *       scene: 'sceneid'
   *       children: [
   *         {
   *           name: '',
   *           scene: 'subsceneId',
   *           children: []
   *         }
   *       ]
   *     },
   *     scenes: {
   *       'id': {
   *          url: ''
   *          parameter: ''
   *        }
   *     }
   *   },
   *   setting: { }             // 预置配置
   * }
   * ```
   */
  constructor(options) {
    const self = this;

    // 记录原始参数
    self._options = options;

    // 扩展
    self._extensions = new Map();

    // 获取参数
    const { el } = self._options;

    // 创建容器
    if (el instanceof HTMLDivElement) {
      // 如果是 DIV 容器 直接 使用
      self._container = el;
    } else if (typeof el === 'string') {
      // 如果是字符串则使用 querySelector 查询
      self._container = document.querySelector(el);
    } else {
      // 都不是 则直接创建新的 DIV
      self._container = document.createElement('div');
      document.body.appendChild(self._container);
    }

    // 新增渲染器
    const rendererWidth = document.documentElement.clientWidth;
    const rendererHeight = document.documentElement.clientHeight;

    self._renderer = new THREE.WebGLRenderer({ antialias: true });
    self._renderer.setPixelRatio(window.devicePixelRatio);
    self._renderer.setSize(rendererWidth, rendererHeight);

    // GL 运行时
    self._GL = new GL(self);

    // 挂载dom
    self._container.appendChild(self._renderer.domElement);

    // 创建上下文
    self._context = new Context(self);

    // 创建摄像机
    self._camera = new Camera(self);

    // 为上下文设置相机
    self._context._sceneMap.forEach(scene => {
      scene._scene.add(self._camera._camera);
    });

    // 设置相机视角
    const currentScene = self._context.getCurrentScene();

    self._camera.fit(currentScene);

    // 默认加载环境 暂时不配置

    const pmremGenerator = new THREE.PMREMGenerator(self._renderer);

    pmremGenerator.compileEquirectangularShader();
    hdrLoader.setDataType(THREE.UnsignedByteType);
    hdrLoader.load('../assets/textures/equirectangular/royal_esplanade_1k.hdr', (texture) => {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;

      // 循环设置场景
      self._context._sceneMap.forEach(scene => {
        scene._scene.background = envMap;
        scene._scene.environment = envMap;
      });

      texture.dispose();
      pmremGenerator.dispose();
    });

    // 混合器
    self._composer = new EffectComposer(self._renderer);

    // 渲染逻辑

    // 主渲染过程
    self._pass = {};
    self._pass.mainPass = new RenderPass(currentScene._scene, self._camera._camera);

    // 后期处理
    self._effectPass = {};
    self._effectPass.outlinePass = new OutlinePass(
      new THREE.Vector2(rendererWidth, rendererHeight), currentScene._scene, self._camera._camera);

    self._effectPass.outlinePass.edgeStrength = Number(3.0);
    self._effectPass.outlinePass.edgeGlow = Number(0.0);
    self._effectPass.outlinePass.edgeThickness = Number(1.0);
    self._effectPass.outlinePass.pulsePeriod = Number(0);
    self._effectPass.outlinePass.usePatternTexture = false;
    self._effectPass.outlinePass.visibleEdgeColor.set('#ffffff');
    self._effectPass.outlinePass.hiddenEdgeColor.set('#190a05');

    self._effectPass.fxaaPass = new ShaderPass(FXAAShader);

    self._effectPass.fxaaPass.uniforms[ 'resolution' ].value.set(1 / rendererWidth, 1 / rendererHeight);

    self._composer.addPass(self._pass.mainPass);
    self._composer.addPass(self._effectPass.outlinePass);
    self._composer.addPass(self._effectPass.fxaaPass);

    // 拾取事件
    eventManager.on(EVENTS.MOUSEMOVE, self, self._onMouseMove.bind(self));
    // 窗口缩放事件
    eventManager.on(EVENTS.RESIZE, self, self._onWindowResize.bind(self));

    // 事件触发绑定
    window.addEventListener('resize', () => eventManager.trigger(EVENTS.RESIZE, self), false);
    self._renderer.domElement.style.touchAction = 'none';
    self._renderer.domElement.addEventListener('pointermove', (event) => {
      if (event.isPrimary === false) return;

      eventManager.trigger(EVENTS.MOUSEMOVE, self, {
        mouse: {
          x: (event.clientX / rendererWidth) * 2 - 1,
          y: -(event.clientY / rendererHeight) * 2 + 1
        }
      });
    }, false);

    // 渲染循环

    self._renderFunc = function (ms) {
      requestAnimationFrame(self._renderFunc);
      self._renderer.clear();

      self._camera._controls.update();
      self._composer.render();
    };

    self._renderFunc();

    return self;
  }

  _onMouseMove(data) {
    const self = this;
    const mouse = new THREE.Vector2(data.mouse.x, data.mouse.y);
    const raycaster = new THREE.Raycaster();
    const currentScene = self._context.getCurrentScene();

    raycaster.setFromCamera(mouse, self._camera._camera);

    const intersects = raycaster.intersectObject(currentScene._scene, true);

    if (intersects.length > 0) {
      const selectedObject = intersects[0].object;

      self._effectPass.outlinePass.selectedObjects = [selectedObject];
    } else {
      self._effectPass.outlinePass.selectedObjects = [];
    }
  }

  _onWindowResize() {
    const self = this;
    const rendererWidth = document.documentElement.clientWidth;
    const rendererHeight = document.documentElement.clientHeight;
    const aspect = rendererWidth / rendererHeight;

    self._renderer.setSize(rendererWidth, rendererHeight);
    self._composer.setSize(rendererWidth, rendererHeight);

    self._camera._camera.aspect = aspect;
    self._camera._camera.updateProjectionMatrix();

    self._effectPass.fxaaPass.uniforms[ 'resolution' ].value.set(1 / rendererWidth, 1 / rendererHeight);
  }

  // #region 对象挂载获取

  /**
   * 获取配置
   * @todo 暂时未完成
   * @memberof App#
   * @method getSetting
   * @returns {object} 配置
   */
  async getSetting() {
    return undefined;
  }

  /**
   * 获取上下文内容
   * @memberof App#
   * @method getContext
   * @returns {Context} 上下文
   */
  async getContext() {
    return this._context;
  }

  /**
   * 获取相机控制器
   * @memberof App#
   * @method getCamera
   * @returns {Camera} 相机控制
   */
  async getCamera() {
    return this._camera;
  }

  /**
   * 获取UI控制器
   * @todo 暂时未完成
   * @memberof App#
   * @method getUI
   * @returns {*} UI控制
   */
  async getUI() {
    return undefined;
  }

  // #endregion

  // #region 接口模式封装

  /**
   * 使用函数编程模式
   * @todo 暂时未完成
   * @memberof App#
   * @method funcMode
   */
  funcMode() {
    return undefined;
  }

  /**
   * 使用命令编程模式
   * @todo 暂时未完成
   * @memberof App#
   * @method commandMode
   */
  commandMode() {
    return undefined;
  }

  /**
   * 使用面向对象编程模式
   * @todo 暂时未完成
   * @memberof App#
   * @method objectMode
   */
  objectMode() {
    return undefined;
  }

  // #endregion

  // #region 启动扩展

  /**
   * 添加扩展
   * @memberof App#
   * @method use
   * @param {Map} extensions 扩展存储Map对象
   */
  async use(extensions) {
    const self = this;
    const keys = extensions.keys();
    let iter = keys.next();

    while (!iter.done) {
      if (!self._extensions.has(iter.value)) {
        const ext = extensions.get(iter.value);
        const buf = await ext.init(self);

        self._extensions.set(iter.value, buf);
      }
      iter = keys.next();
    }
    return this;
  }

  // #endregion

  // #region 模型等加载

  /**
   * 同 context.load
   * @memberof App#
   * @method load
   * @param {object} scenes 配置
   */
  load(scenes) {
    this._context.load(scenes);
  }

  // #endregion

  // #region 获取gl运行时参数

  /**
   * 获取 gl 对象 （仅提供查询）
   * @memberof App#
   * @method getGL
   * @returns {GL} gl运行时对象
   */
  getGL() {
    return this._GL;
  }

  // #endregion

  // #region 查询节点

  /**
   * 获取 gl 对象 （仅提供查询）
   *
   * ```js
   * // 查询多个ID
   * const list = app.query({id: 'id1'}, {id: 'id2'});
   * // 使用正则匹配
   * const list = app.query({id: /^id\d{1, 1}&'/});
   * ```
   * @todo 暂时未完成
   * @memberof App#
   * @method query
   * @returns {Array} 符合条件的node节点
   */
  async query() {
    const self = this;
    const { _context } = self;
    const currentScene = _context.getCurrentScene();

    console.log(currentScene._scene);
  }

  // #endregion
}
