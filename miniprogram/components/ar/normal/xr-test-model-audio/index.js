// components/xr-templte-gltfUVSet/index.ts

import {
  GlobalAudio
} from '../../../../utils/GlobalAudio';
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
    isPlayingAudio: false, // 音频是否触发开始播放，用于定位成功或者内容显示后开始播放背景音频时触发
    horseMusic: 'https://changguan-1357310316.cos.ap-shanghai.myqcloud.com/phase_two/03_dragon/Audios/Horse_Audio.MP3',
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
        this.modelEvent();
      },200);
    },
    async modelEvent() {
      this._horseAudio = new GlobalAudio();
      let audio_path = await this._horseAudio.downloadAndPlayAudio(this.data.horseMusic);
      this.setData({
        horseMusic: audio_path
      })
      const scene = this.scene;
      const horse = this.scene.getElementById('horse');
      // this.setPos(horse, 0, 0, 0);
      console.log('horse', horse)
      const horseGLTF = horse.getComponent(xr.GLTF);
      // const horseBodyMat = horse.getChildAtIndex(0).getChildAtIndex(0).getChildAtIndex(0).getChildAtIndex(0).getComponent(xr.Mesh).material;
      const horseBodyMat = horseGLTF.getPrimitivesByNodeName('Horse_C_Body')[0].material;
      const horseEyeMat = horseGLTF.getPrimitivesByNodeName('Horse_C_Eye')[0].material;
      const horseHairMat = horseGLTF.getPrimitivesByNodeName('Horse_C_Hair')[0].material;
      console.log('horse', horseBodyMat) 
      // horseBodyMat.setVector('u_metallicRoughnessValues', xr.Vector2.createFromNumber(0, 1));
      horseBodyMat.setVector('u_specularFactor', xr.Vector3.createFromNumber(0, 0, 0));
      horseBodyMat.setFloat('u_glossinessFactor', [0]);
      // horseBodyMat.setFloat('u_metallicRoughnessValues', [0, 1]);
      // horseBodyMat.setMacro('WX_USE_NORMAL', false );
      // horseBodyMat.setMacro('WX_USE_NORMALMAP', false );
      // horseBodyMat.setMacro('"WX_USE_ROUGHNESSMAP"', true );
      this.horseAni = horse.getComponent('animator');
      
      const horseClips = this.horseAni._clips;
      this.horseClipName = []
    
      horseClips.forEach((v, key) => {
        if (key.indexOf('pose') == -1) {
          this.horseClipName.push(key)
        }
      })

      this.horseAni.play(this.horseClipName[0], {
        loop: 50,
      });
      console.log('马音频', this.data.horseMusic)
      this._horseAudio.seek(0);
      this._horseAudio.play(this.data.horseMusic, 1);
    },
    async setUV() {
      const scene = this.scene;

      // 获取元素
      const twaElm = this.scene.getElementById('twa');
      
      const signList = this.signList = twaElm.getChildAtIndex(0)._children;
      // this.updateViewSign(0, 1)
      console.log('孩子', twaElm._children)
      let one = signList[28].getComponent(xr.Transform)
      console.log('signList', one.worldPosition.x, one.worldPosition.y, one.worldPosition.z)
      for(let i=0;i<signList.length;i++){
        const signMeshNode = signList[i].getChildAtIndex(0);
        signMeshNode.addComponent(xr.CubeShape, {center: [0, 0, 5], size: [6, 40, 100]});
        signMeshNode.addComponent(xr.ShapeGizmos);
        signMeshNode.event.add("untouch-shape", (e) => {
          e.target.parent.index = i; // 取值0-19
          console.log('untouch', e.target.parent.index)
          // this.triggerEvent('handleViewSign', e.target.parent.index);
        })
        // console.log('', i)
      }
      // const l = this.data.newSignList;
      // for(let i=0;i<l.length;i++) {
      //   this.updateViewSign(i, l[i].card_type);
      // }

      // // console.log(signList);
      // for(let i=0;i<signList.length;i++) {
      //   signList[i].getComponent(xr.Transform).visible = false;
      // }
      // signList[0].getComponent(xr.Transform).visible = true;
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
      const xr = wx.getXrFrameSystem();

      const signMeshNode = this.signList[index].getChildAtIndex(0);
      const signMeshCom = signMeshNode.getComponent(xr.Mesh)
      const changeMaterial = signMeshCom.material;
      // const changeMaterial = signMeshCom.material.clone();
      const uvMatrix = xr.Matrix4.createFromArray(this.getUvTransform(card_type/5, 0, 1, 1, 0))
      // 设置uv矩阵
      changeMaterial.setMatrix('u_uvTransform', uvMatrix);
      // 开启使用uv矩阵的宏
      changeMaterial.setMacro('WX_USE_UVTRANSFORM', true );
      changeMaterial.setMacro('WX_USE_UVTRANSFORM_BASECOLOR', true );
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