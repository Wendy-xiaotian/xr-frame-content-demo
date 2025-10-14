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
    newSignList: [
      { id: 0, user_id: 8, user_nickname: "天生景",  card_type: 0, content: '天恩祈福', date: '2025年12月26日', likes_count: 999, has_liked: false },
      { id: 1, user_id: 8, user_nickname: "天生景", card_type: 1, content: '地恩祈福', date: '2025年12月26日', likes_count: 999, has_liked: false },
      { id: 2, user_id: 8, user_nickname: "天生景",  card_type: 2, content: '师恩祈福', date: '2025年12月26日', likes_count: 999, has_liked: false },
      { id: 3, user_id: 8, user_nickname: "天生景",  card_type: 3, content: '家恩祈福', date: '2025年12月26日', likes_count: 999, has_liked: false },
      { id: 4, user_id: 8, user_nickname: "天生景",  card_type: 4, content: '知恩祈福', date: '2025年12月26日', likes_count: 999, has_liked: false },
      { id: 5, user_id: 8, user_nickname: "天生景",  card_type: 4, content: '知恩祈福', date: '2025年12月26日', likes_count: 999, has_liked: false },
      { id: 6, user_id: 8, user_nickname: "天生景",  card_type: 4, content: '知恩祈福', date: '2025年12月26日', likes_count: 999, has_liked: false },
      { id: 7, user_id: 8, user_nickname: "天生景",  card_type: 4, content: '知恩祈福', date: '2025年12月26日', likes_count: 999, has_liked: false },
      { id: 8, user_id: 8, user_nickname: "天生景",  card_type: 4, content: '知恩祈福', date: '2025年12月26日', likes_count: 999, has_liked: false },
      { id: 9, user_id: 8, user_nickname: "天生景",  card_type: 4, content: '知恩祈福', date: '2025年12月26日', likes_count: 999, has_liked: false },
      { id: 10, user_id: 8, user_nickname: "天生景",  card_type: 4, content: '知恩祈福', date: '2025年12月26日', likes_count: 999, has_liked: false },
      { id: 11, user_id: 8, user_nickname: "天生景",  card_type: 4, content: '知恩祈福', date: '2025年12月26日', likes_count: 999, has_liked: false },
      { id: 12, user_id: 8, user_nickname: "天生景",  card_type: 4, content: '知恩祈福', date: '2025年12月26日', likes_count: 999, has_liked: false },
      { id: 13, user_id: 611, user_nickname: "天生景",  card_type: 4, content: '知恩祈福', date: '2025年12月26日', likes_count: 999, has_liked: false },
      { id: 14, user_id: 611, user_nickname: "天生景",  card_type: 4, content: '知恩祈福', date: '2025年12月26日', likes_count: 999, has_liked: false },
      { id: 15, user_id: 611, user_nickname: "天生景",  card_type: 4, content: '知恩祈福', date: '2025年12月26日', likes_count: 999, has_liked: false },
      { id: 16, user_id: 611, user_nickname: "天生景",  card_type: 4, content: '知恩祈福', date: '2025年12月26日', likes_count: 999, has_liked: false },
      { id: 17, user_id: 611, user_nickname: "天生景",  card_type: 4, content: '知恩祈福', date: '2025年12月26日', likes_count: 999, has_liked: false },
      { id: 18, user_id: 611, user_nickname: "天生景",  card_type: 4, content: '知恩祈福', date: '2025年12月26日', likes_count: 999, has_liked: false },
      { id: 19, user_id: 611, user_nickname: "天生景",  card_type: 4, content: '知恩祈福', date: '2025年12月26日', likes_count: 999, has_liked: false },
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleReady({detail}) {
      const xrScene = this.scene = detail.value;
      console.log('xr-scene', xrScene);
    },
    handleAssetsProgress: function({detail}) {
      console.log('assets progress', detail.value);
    },
    handleAssetsLoaded: function({detail}) {
      console.log('assets loaded', detail.value);
      this.setData({loaded: true});
      // 做个简单的延时，保证glTF构建完成
      setTimeout(()=>{
        this.setUV();
      },200);
    },
    async setUV() {
      const scene = this.scene;

      // 获取元素
      const twaElm = this.scene.getElementById('twa');
      
      const signList = this.signList = twaElm._children.slice(0, 20);
      // this.updateViewSign(0, 1)
      console.log('孩子', twaElm._children, signList)
      let one = signList[0].getComponent(xr.Transform)
      console.log('signList', one.position.x, one.position.y, one.position.z)
      for(let i=0;i<signList.length;i++){
        const signMeshNode = signList[i].getChildAtIndex(0).getChildAtIndex(1);
        i == 1 ? c = [0, 0, 70] : c = [0, 0, 70]
        signMeshNode.addComponent(xr.CubeShape, {center: c, size: [50, 6, 150]});
        signMeshNode.addComponent(xr.ShapeGizmos);
        signMeshNode.event.add("untouch-shape", (e) => {
          e.target.parent.index = i; // 取值0-19
          console.log('untouch', e.target.parent.index)
          // this.triggerEvent('handleViewSign', e.target.parent.index);
        })
        // console.log('', i)
      }
      const l = this.data.newSignList;
      for(let i=0;i<l.length;i++) {
        this.updateViewSign(i, l[i].card_type);
      }

      // console.log(signList);
      // for(let i=0;i<signList.length;i++) {
      //   signList[i].getComponent(xr.Transform).visible = false;
      // }
      // signList[1].getComponent(xr.Transform).visible = true;
      // console.log('', signList[0].getComponent(xr.Transform).position.x, signList[0].getComponent(xr.Transform).position.z)
      // const signMeshNode = signList[0].getChildAtIndex(0);
      // const signMeshCom = signMeshNode.getComponent(xr.Mesh)
      // const changeMaterial = signMeshCom.material;

      // let offsetX = 0; // 五种样式签T_AR_Prop_Pendant01，0，0.2，0.4，0.6，0.8
      // let offsetY = 0;
      // let scaleX = 1;
      // let scaleY = 1;
      // let rotation = 0;

      // const uvMatrix = xr.Matrix4.createFromArray(this.getUvTransform(offsetX, offsetY, scaleX, scaleY, rotation))
      // // 设置uv矩阵
      // changeMaterial.setMatrix('u_uvTransform', uvMatrix);
      // // 开启使用uv矩阵的宏
      // changeMaterial.setMacro('WX_USE_UVTRANSFORM', true );
      // changeMaterial.setMacro('WX_USE_UVTRANSFORM_BASECOLOR', true );
    },
    updateViewSign(index, card_type) {
      const signMeshNode = this.signList[index].getChildAtIndex(0);
      const signMeshCom = signMeshNode.getChildAtIndex(1).getComponent(xr.Mesh)
      const changeMaterial = signMeshCom.material;
      // const changeMaterial = signMeshCom.material.clone();
      const uvMatrix = xr.Matrix4.createFromArray(this.getUvTransform(card_type/5, 0, 1, 1, 0))
      // 设置uv矩阵
      changeMaterial.setMatrix('u_uvTransform', uvMatrix);
      // 开启使用uv矩阵的宏
      changeMaterial.setMacro('WX_USE_UVTRANSFORM', true );
      changeMaterial.setMacro('WX_USE_UVTRANSFORM_BASECOLOR', true );
      changeMaterial.setRenderState('cullOn', true);
      changeMaterial.setRenderState('cullFace', xr.ECullMode.FRONT);
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