export default class RenderingParameter {
  /**
   * @classdesc 渲染参数配置
   * @constructor RenderingParameter
   * @author Zhoyq <feedback@zhoyq.com>
   * @since 2021-01-10
   * @param {object} parameter 参数
   */
  constructor(parameter) {
    // #region 渲染流水线

    /**
     * @memberof RenderingParameter#
     * @member {bool} earlyZEnable 是否需要 earlyZ
     */
    this.earlyZEnable = true;

    // #endregion

    // #region 场景相机

    /**
     * @memberof RenderingParameter#
     * @member {number} sceneCameraView 摄像机视角大小
     */
    this.sceneCameraView = 45;

    // #endregion

    // #region 场景背景

    /**
     * @memberof RenderingParameter#
     * @member {string} sceneBackgroundType 背景类型（颜色、图片、环境、动态天空）
     */
    this.sceneBackgroundType = 'BACKGROUND_COLOR';

    /**
     * @memberof RenderingParameter#
     * @member {string} sceneBackgroundColor 当选择背景颜色类型时，背景的颜色
     */
    this.sceneBackgroundColor = '#000000';

    /**
     * @memberof RenderingParameter#
     * @member {string | undefined} sceneBackgroundImageSelect
     * 当选择背景图片或者环境类型时，使用的图片
     *
     * 对应 setting 里的 backgroundImages 的 key 值，对应 value 值因实现不同而自定义
     */
    this.sceneBackgroundImageSelect = undefined;

    /**
     * @memberof RenderingParameter#
     * @member {number} sceneBackgroundEnvBrightness 当选择背景环境类型时，背景的亮度
     */
    this.sceneBackgroundEnvBrightness = 1.0;

    /**
     * @memberof RenderingParameter#
     * @member {number} sceneDynamicSkyTurbidity 当选择背景动态填空类型时的参数
     */
    this.sceneDynamicSkyTurbidity = 10;

    /**
     * @memberof RenderingParameter#
     * @member {number} sceneDynamicSkyRayleigh 当选择背景动态填空类型时的参数
     */
    this.sceneDynamicSkyRayleigh = 3;

    /**
     * @memberof RenderingParameter#
     * @member {number} sceneDynamicSkyMieCoefficient 当选择背景动态填空类型时的参数
     */
    this.sceneDynamicSkyMieCoefficient = 0.005;

    /**
     * @memberof RenderingParameter#
     * @member {number} sceneDynamicSkyMieDirectionalG 当选择背景动态填空类型时的参数
     */
    this.sceneDynamicSkyMieDirectionalG = 0.7;

    /**
     * @memberof RenderingParameter#
     * @member {number} sceneDynamicSkyInclination 当选择背景动态填空类型时的参数
     */
    this.sceneDynamicSkyInclination = 0.49;

    /**
     * @memberof RenderingParameter#
     * @member {number} sceneDynamicSkyAzimuth 当选择背景动态填空类型时的参数
     */
    this.sceneDynamicSkyAzimuth = 0.25;

    /**
     * @memberof RenderingParameter#
     * @member {Array} sceneDynamicSkyUp 当选择背景动态填空类型时的参数
     */
    this.sceneDynamicSkyUp = [0, 1, 0];

    // #endregion

    // #region 场景环境光

    /**
     * @memberof RenderingParameter#
     * @member {bool} lightEnvironmentEnable 是否使用场景环境光
     */
    this.lightEnvironmentEnable = false;

    /**
     * @memberof RenderingParameter#
     * @member {string} lightEnvironmentSelect 环境光图片选择
     */
    this.lightEnvironmentSelect = undefined;

    /**
     * @memberof RenderingParameter#
     * @member {string} lightEnvironmentOrientation 环境光角度 0 - 360
     */
    this.lightEnvironmentOrientation = 0;

    /**
     * @memberof RenderingParameter#
     * @member {string} lightEnvironmentBrightness 环境光亮度 0 - 10
     */
    this.lightEnvironmentBrightness = 1;

    // #endregion

    // #region 后期配置

    this.effectScreenSpaceReflectionEnable = false;
    this.effectScreenSpaceReflectionFactor = 1.0; // 0 - 1

    this.effectSSAOEnable = false;
    this.effectSSAORadius = 10; // 4 - 42
    this.effectSSAOIntensity = 0.5; // 0 - 1
    this.effectSSAOBias = 2; // 0.8 - 4.2

    this.effectGrainEnable = false;
    this.effectGrainAnimated = false;
    this.effectGrainFactor = 0.15; // 0 - 0.5

    this.effectDepthOfFieldEnable = false;
    this.effectDepthOfFieldForegroundBlur = 0.5; // 0 - 1
    this.effectDepthOfFieldBackgroundBlur = 0.5; // 0 - 1
    this.effectDepthOfFieldCrossFactor = 1.0; // 0 - 1

    this.effectSharpnessEnable = false;
    this.effectSharpnessFactor = 1.0; // 0 - 5

    this.effectChromaticAberrationsEnable = false;
    this.effectChromaticAberrationsFactor = 0.03; // 0 - 0.1

    this.effectVignetteEnable = false;
    this.effectVignetteAmount = 0.7; // 0 - 1
    this.effectVignetteHardness = 0.4; // 0 - 1
    this.effectVignetteColor = '#000000';

    this.effectBloomEnable = false;
    this.effectBloomThreshold = 0.7; // 0 - 1
    this.effectBloomIntensity = 0.5; // 0 - 2
    this.effectBloomRadius = 0.7; // 0 - 1
    this.effectBloomRatio = 1.0 ;

    this.effectToneMappingEnable = false;
    this.effectToneMappingType = 'TONEMAPPING_LINEAR';
    this.effectToneMappingExposure = 1.0; // 0 - 2
    this.effectToneMappingBrightness = 0.0; // -1 - 1
    this.effectToneMappingContrast = 0.0; // -1 - 1
    this.effectToneMappingSaturation = 1.0; // 0 - 2

    this.effectColorBalanceEnable = false;
    this.effectColorBalanceShadowRed = 0; // -1 - 1
    this.effectColorBalanceShadowGreen = 0; // -1 - 1
    this.effectColorBalanceShadowBlue = 0; // -1 - 1
    this.effectColorBalanceMidRed = 0; // -1 - 1
    this.effectColorBalanceMidGreen = 0; // -1 - 1
    this.effectColorBalanceMidBlue = 0; // -1 - 1
    this.effectColorBalanceHighLightRed = 0; // -1 - 1
    this.effectColorBalanceHighLightGreen = 0; // -1 - 1
    this.effectColorBalanceHighLightBlue = 0; // -1 - 1

    this.effectStyleEnable = false; // 风格化
    this.effectStyleType = 'STYLE_BW';
    this.effectStyleBlackOrWhiteAvg = 0.5;
    this.effectStyleSingleR = 1.0;
    this.effectStyleSingleG = 1.0;
    this.effectStyleSingleB = 1.0;

    // outline
    this.effectOutlineEnable = false;
    this.effectOutlineEdgeStrength = 3; // 0 - 10
    this.effectOutlineEdgeGlow = 0; // 0 - 1
    this.effectOutlineEdgeThickness = 1; // 1 - 4
    this.effectOutlinePulsePeriod = 0; // 0 - 5
    this.effectOutlinePatternTextureEnable = false;
    this.effectOutlinePatternTextureSelect = undefined;
    this.effectOutlineVisibleEdgeColor = '#ffffff';
    this.effectOutlineHiddenEdgeColor = '#1e1e1e';

    // rotateCenter
    this.effectRotateCenterEnable = false;
    this.effectRotateCenterColor = '#11ff88';
    this.effectRotateCenterFactor = 1.0;

    // #endregion
  }
}
