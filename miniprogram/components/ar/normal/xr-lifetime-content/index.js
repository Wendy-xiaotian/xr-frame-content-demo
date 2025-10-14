// components/xr-templte-gltfUVSet/index.ts
const xr = wx.getXrFrameSystem();

Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    arBackgroundInited: false,
    startAssetsLoad: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 1. xr-frame组件内容渲染完成
    handleReady({detail}) {
      const xrScene = this.scene = detail.value;
      console.log('xr-scene', xrScene);

      // 除需要xr-assets资源下载加载外的其他直接使用xrframe组件写的内容渲染完成
      // 不在此进行内容的初始化，等资源加载完渲染完成再进行统一的初始化
      // this.scene.getElementById('cube').getComponent(xr.Transform).visible = false;
      // this.scene.getElementById('cube').getComponent(xr.Transform).position.setValue(1, 5, 3);

    },
    // 2. AR初始化完成(即相机画面有了，不是黑屏)
    handleARReady: function ({
      detail
    }) {
      console.log("AR Version", this.scene.ar.arVersion);
      this.ar = this.scene.ar;
      if (this.ar && !this.data.arBackgroundInited) {
        const rawData = this.ar.getARRawData();
        if (rawData && rawData.yBuffer) {
          this.data.arBackgroundInited = true;
          console.log("AR Camera Started!");
        }
      }
      this.setData({
        startAssetsLoad: true
      })
    },
    handleAssetsProgress: function({detail}) {
      console.log('assets progress', detail.value);
    },
    handleAssetsLoaded: function({detail}) {
      console.log('assets loaded', detail.value);
      // 做个简单的延时，保证glTF构建(bind:gltf-loaded="handleGLTFLoaded")完成
      setTimeout(()=>{
        // 进行内容初始化
        
        this.initScene()
      },200);
    },

    initScene() {
      this.scene.getElementById('cube').getComponent(xr.Transform).position.setValue(1, 5, 3);
      this.twaTran = this.scene.getElementById('twa').getComponent(xr.Transform);
      this.twaTran.visible = false;
    },
  } 
})