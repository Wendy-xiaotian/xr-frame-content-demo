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
      // let q = twaElm.getChildAtIndex(0).getComponent(xr.Transform)
      // console.log('signList', q.worldPosition.x, q.worldPosition.y, q.worldPosition.z)

      const signList = this.signList = twaElm.getChildAtIndex(0)._children;
      // this.updateViewSign(0, 1)
      console.log('孩子', signList, twaElm._children)
      let one = signList[28].getComponent(xr.Transform)
      console.log('signList', one.worldPosition.x, one.worldPosition.y, one.worldPosition.z)


      const signMeshNode1 = signList[0].getChildAtIndex(0).getChildAtIndex(0);
      const signMeshCom1 = signMeshNode1.getComponent(xr.Mesh)
      const changeMaterial1 = signMeshCom1.material;
      console.log('材质球', changeMaterial1)

      for(let i=0;i<signList.length;i++){
        const signMeshNode = signList[i].getChildAtIndex(0).getChildAtIndex(0);
        signMeshNode.addComponent(xr.CubeShape, {center: [0, 0, 1], size: [3, 0.5, 1.5]});
        signMeshNode.addComponent(xr.ShapeGizmos);
        signMeshNode.event.add("untouch-shape", (e) => {
          e.target.parent.index = i; // 取值0-19
          console.log('untouch', e.target.parent.index)
          // this.triggerEvent('handleViewSign', e.target.parent.index);
        })
        // console.log('', i)
      }

      for(let i=0;i<signList.length;i++) {
        this.updateViewSign(i, Math.floor(Math.random() * 5));
        // this.updateViewSign(i, 5);
      }

      // const mileAni = twaElm.getComponent("animator")
      // const clips = mileAni._clips;
      // var clipName = [];
      // clips.forEach((v, key) => {
      //   if (key.indexOf("pose") == -1) {
      //     clipName.push(key);
      //   }
      // });
      // mileAni.play(clipName[0], {delay: 1, loop: 0 });
      // const goldList = this.goldList = twaElm._children.slice(0, 200); // 200 元宝个数
      // this.fnAddClickEvent();
      // console.log('孩子', goldList, twaElm, twaElm._children)
      // let one = twaElm._children[200].getComponent(xr.Transform)
      // console.log('signList', one.position.x, one.position.y, one.position.z)

      // const signList = this.signList = twaElm._children.slice(1, 200);
      // this.updateViewSign(0, 1)
      // console.log('孩子', signList, twaElm._children)
      // let one = signList[0].getComponent(xr.Transform)
      // console.log('signList', one.position.x, one.position.y, one.position.z)
      // for(let i=0;i<signList.length;i++){
      //   const signMeshNode = signList[i].getChildAtIndex(0).getChildAtIndex(0);
      //   signMeshNode.addComponent(xr.CubeShape, {center: [0, 0, 1], size: [3, 0.5, 1]});
      //   signMeshNode.addComponent(xr.ShapeGizmos);
      //   signMeshNode.event.add("untouch-shape", (e) => {
      //     e.target.parent.index = i; // 取值0-19
      //     console.log('untouch', e.target.parent.index)
      //     // this.triggerEvent('handleViewSign', e.target.parent.index);
      //   })
      //   // console.log('', i)
      // }

      // for(let i=0;i<signList.length;i++) {
      //   this.updateViewSign(i, Math.floor(Math.random() * 6));
      // }

      // // console.log(signList);
      // for(let i=0;i<signList.length;i++) {
      //   signList[i].getComponent(xr.Transform).visible = false;
      // }
      // signList[23].getComponent(xr.Transform).visible = true;
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
    },
       // 弥勒动画播放 动画播完再添加碰撞
       fnAddClickEvent() {
        this.timeId01 = setTimeout(() => {
          const goldList = this.goldList; 
          for (let i = 0; i < goldList.length; i++) {
            goldList[i].addComponent(xr.CubeShape, { center: [0, 1.5, 0], size: [4, 3, 4] });
            goldList[i].addComponent(xr.ShapeGizmos);
            goldList[i].index = i;
            goldList[i]._handleEvent = this.fnClickEventCall.bind(this);
            goldList[i].event.addOnce("untouch-shape", goldList[i]._handleEvent);
          }
        }, 4000);
      },
      // 点击触发事件具体回调函数
      fnClickEventCall(e) {
        // console.log('untouch', e.target.index)
        const i = e.target.index;
        const goldList = this.goldList; 
        // goldList[i].removeComponent(xr.ShapeGizmos);
        goldList[i].removeComponent(xr.CubeShape);
        goldList[i].event.remove("untouch-shape", goldList[i]._handleEvent);
        e.target.getComponent(xr.Transform).visible = false;
        this.triggerEvent('handleGold');
      },
  } 
})