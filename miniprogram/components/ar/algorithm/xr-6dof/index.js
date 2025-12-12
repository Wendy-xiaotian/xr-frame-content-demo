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
        this.setUV();
      },200);
    },
    async setUV() {
      const scene = this.scene;

      // 获取元素
      const twaElm = this.scene.getElementById('sui');
      
      const signList = this.signList = twaElm.getChildAtIndex(0)._children;
      // this.updateViewSign(0, 1)
      console.log('孩子', signList, twaElm._children)
      let one = signList[0].getComponent(xr.Transform)
      console.log('signList', one.position.x, one.position.y, one.position.z)
      for(let i=0;i<signList.length;i++){
        const signMeshNode = signList[i].getChildAtIndex(0).getChildAtIndex(0);
        signMeshNode.addComponent(xr.CubeShape, {center: [0, 0, 1], size: [3, 0.5, 1]});
        // signMeshNode.addComponent(xr.ShapeGizmos);
        signMeshNode.event.add("untouch-shape", (e) => {
          e.target.parent.index = i; // 取值0-19
          console.log('untouch', e.target.parent.index)
          // this.triggerEvent('handleViewSign', e.target.parent.index);
        })
        // console.log('', i)
      }

      for(let i=0;i<signList.length;i++) {
        this.updateViewSign(i, Math.floor(Math.random() * 6));
      }
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
    updateViewSign(index, card_type) {
      const signMeshNode = this.signList[index].getChildAtIndex(0).getChildAtIndex(0);
      const signMeshCom = signMeshNode.getComponent(xr.Mesh)
      const changeMaterial = signMeshCom.material;
      // const changeMaterial = signMeshCom.material.clone();
      const y = card_type > 2 ? 0.5 : 0;
      const x = card_type > 2 ? card_type - 3 : card_type;
      const uvMatrix = xr.Matrix4.createFromArray(this.getUvTransform(x/3, y, 1, 1, 0))
      // 设置uv矩阵
      changeMaterial.setMatrix('u_uvTransform', uvMatrix);
      // 开启使用uv矩阵的宏
      changeMaterial.setMacro('WX_USE_UVTRANSFORM', true );
      changeMaterial.setMacro('WX_USE_UVTRANSFORM_BASECOLOR', true );
      changeMaterial.setMacro('WX_USE_UVTRANSFORM_EMISSIVE', true );
      // signMeshCom.material = changeMaterial;
    },
     /**
     * 获取UV变化矩阵，列主序
     * 
     * @param {number} tx x轴偏移
     * @param {number} ty y轴偏移
     * @param {number} sx x轴缩放
     * @param {number} sy y轴缩放
     * @param {number} rotation 旋转
     * @return {Array} uvMatrixArray
     */
    getUvTransform(tx, ty, sx, sy, rotation) {
      const c = Math.cos( rotation );
      const s = Math.sin( rotation );

      return [
        sx * c, -sx * s, 0, 0,
        sy * s, sy * c, 0, 0,
        0, 0, 1, 0,
        tx, ty, 0, 1,
      ];
    }
  } 
})