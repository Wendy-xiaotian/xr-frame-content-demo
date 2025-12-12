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
        
        this.scene.event.addOnce('touchstart', this.placeNode.bind(this));
      },200);
    },

    placeNode(event) {
      const {clientX, clientY} = event.touches[0];
      const {frameWidth: width, frameHeight: height} = this.scene;

      if (clientY / height > 0.8 && clientX / width < 0.2) {
        this.scene.getNodeById('setitem').visible = false;
        this.scene.ar.resetPlane();
      } else {
        this.scene.ar.placeHere('setitem', true);
      }

      this.scene.event.addOnce('touchstart', this.placeNode.bind(this));
    },
  } 
})