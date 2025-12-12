// 自定义遮罩shader，材质
const xrFrameSystem = wx.getXrFrameSystem();

xrFrameSystem.registerEffect(
  'RealityScene', scene => scene.createEffect({
    name: "RealityScene",

    properties: [
      {
        key: 'u_MainColor',
        type: xrFrameSystem.EUniformType.FLOAT4,
        default: [1, 1, 1, 0]
      },
      {
        key: 'u_ShadowIntensity',
        type: xrFrameSystem.EUniformType.FLOAT,
        default: [0.5]
      }
    ],

    images: [
      {
        key: 'u_MainTex',
        default: 'white'
      }
    ],

    //渲染顺序靠前，确保在渲染虚拟物体之前先渲染该物体，以实现透过该物体显示现实背景的效果
    defaultRenderQueue: 1000,

    passes: [
      //第一个 pass 实现本体的渲染
      {
        "renderStates": {
          //使用半透渲染，保证能够看到背景
          cullOn: true,
          blendOn: true,
        },
        lightMode: "ForwardBase",
        useMaterialRenderStates: true,
        shaders: [0, 1]
      },
      //第二个 pass 实现阴影的渲染
      {
        "renderStates": {
          cullOn: true,
          blendOn: true,
        },
        lightMode: "ForwardBase",
        useMaterialRenderStates: true,
        shaders: [2, 3]
      }
    ],

    shaders: [
      `#version 100
      uniform highp mat4 u_view;
      uniform highp mat4 u_projection;
      uniform highp mat4 u_world;
      attribute vec3 a_position;
      attribute highp vec2 a_texCoord;
      varying highp vec2 v_UV;

      void main()
      {
        v_UV = a_texCoord;
        vec4 worldPosition = u_world * vec4(a_position, 1.0);
        gl_Position = u_projection * u_view * worldPosition;
      }`,

      `#version 100
      precision mediump float;
      precision highp int;
      varying highp vec2 v_UV;
      uniform vec4 u_ambientLightColorIns;
      uniform vec3 u_mainLightDir;
      uniform vec4 u_mainLightColorIns;
      uniform vec4 u_MainColor;
      uniform sampler2D u_MainTex;
    
      void main()
      {
        vec4 result = texture2D(u_MainTex, v_UV) * u_MainColor;
    
      #ifdef WX_USE_MAIN_DIR_LIGHT
        result *= vec4(clamp(u_mainLightColorIns.rgb * u_mainLightColorIns.a, 0.0, 1.0), 1.0);
      #endif
        gl_FragData[0] = result;
      }`,

      `#version 100
      uniform highp mat4 u_view;
      uniform highp mat4 u_projection;
      uniform highp mat4 u_world;
      attribute vec3 a_position;

    #ifdef WX_RECEIVE_SHADOW
      varying highp vec3 v_WorldPosition;
    #endif

      void main()
      {
        vec4 worldPosition = u_world * vec4(a_position, 1.0);
      #ifdef WX_RECEIVE_SHADOW
        v_WorldPosition = worldPosition.xyz;
      #endif
        gl_Position = u_projection * u_view * worldPosition;
      }`,

      `#version 100
      precision mediump float;
      precision highp int;
      uniform float u_ShadowIntensity;

    #ifdef WX_RECEIVE_SHADOW
      varying highp vec3 v_WorldPosition;
      uniform float u_shadowStrength;
      uniform float u_shadowBias;
      uniform vec3 u_shadowColor;
      uniform sampler2D u_shadowMap;
      uniform mat4 u_csmLightSpaceMatrices[4];
      uniform vec4 u_csmFarBounds;
      uniform vec4 u_shadowTilingOffsets[4];
    #endif

      float unpackDepth(const in vec4 rgbaDepth)
      {
        vec4 bitShift = vec4(1.0 / (256.0 * 256.0 * 256.0), 1.0 / (256.0 * 256.0), 1.0 / 256.0, 1.0);
        float depth = dot(rgbaDepth, bitShift);
        return depth;
      }

      float shadowCalculation(vec3 posWorld) 
      {
        float srcShadow = 1.0;
        vec4 shadowCoord = u_csmLightSpaceMatrices[0] * vec4(posWorld, 1.0);
        shadowCoord.xyz = shadowCoord.xyz / shadowCoord.w;
        shadowCoord = shadowCoord * 0.5 + 0.5;
        shadowCoord.z = shadowCoord.z + step(shadowCoord.x, 0.001) + step(shadowCoord.y, 0.001) + step(0.999, shadowCoord.x) + step(0.999, shadowCoord.y);
        shadowCoord.xy = shadowCoord.xy * u_shadowTilingOffsets[0].xy + u_shadowTilingOffsets[0].zw;
        if (shadowCoord.z > 1.0)
        {
          shadowCoord.z = 1.0;
        }
        float currentDepth = shadowCoord.z;
        float bias = u_shadowBias;
        float zRef = currentDepth - bias;
        float sourceVal = float(zRef < unpackDepth(texture2D(u_shadowMap, shadowCoord.xy)));
        srcShadow = sourceVal;
        return srcShadow;
      }
    
      void main()
      {
        vec4 result = vec4(0.0);
    
      #ifdef WX_USE_MAIN_DIR_LIGHT
        #ifdef WX_RECEIVE_SHADOW
          result.w = (1.0 - shadowCalculation(v_WorldPosition)) * u_ShadowIntensity;
        #endif
      #endif

        gl_FragData[0] = result;
      }`
    ],
  })
);