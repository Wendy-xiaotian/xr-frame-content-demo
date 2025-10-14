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
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleReady({detail}) {
      const xrScene = this.scene = detail.value;
      console.log('xr-scene', xrScene);

      // 除需要xr-assets资源下载加载外的其他直接使用xrframe组件写的内容渲染完成
      // this.scene.getElementById('cube').getComponent(xr.Transform).visible = false;
      this.scene.getElementById('cube').getComponent(xr.Transform).position.setValue(1, 5, 3);

    },
    handleAssetsProgress: function({detail}) {
      console.log('assets progress', detail.value);
    },
    handleAssetsLoaded: function({detail}) {
      console.log('assets loaded', detail.value);
      // 做个简单的延时，保证glTF构建完成
      setTimeout(()=>{
        
      },200);
    },
    handleGLTFLoaded() {
      console.log('gltf渲染完成 twa')
    },
    handleGLTFLoaded1() {
      console.log('gltf渲染完成 sui')
    },
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
    },
  } 
})