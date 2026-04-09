export class GlobalAudio {
  private innerAudioContext: WechatMiniprogram.InnerAudioContext;
  private src: string = 'https://ar-scene-source.nosdn.127.net/b513a1bb5b3f2ba49d27abfb765347ee.mp3';
  private autoplay: boolean = false;
  private loop: boolean = true;

  constructor() {
      this.innerAudioContext = wx.createInnerAudioContext();
  }

  get isPlaying(): boolean {
      return (
          !!this.innerAudioContext.currentTime &&
          this.innerAudioContext.currentTime < this.innerAudioContext.duration
      );
  }

  get curTime(): number {
      return this.innerAudioContext.currentTime;
  }

  get duration(): number {
      return this.innerAudioContext.duration;
  }

  play(src?: string, volume?: number): void {
      this.innerAudioContext.src = src || this.src;
      this.innerAudioContext.loop = this.loop;
      this.innerAudioContext.play();
      if (volume !== undefined) {
          this.innerAudioContext.volume = volume;
      }
  }

  pause(): void {
      this.innerAudioContext.pause();
  }

  seek(num: number): void {
      this.innerAudioContext.seek(num);
  }

  stop(): void {
      this.innerAudioContext.stop();
  }

  destroy(): void {
      this.innerAudioContext.destroy();
  }

  // 提前下载音频
  async downloadAndPlayAudio(src: string): Promise<string> {
      return new Promise((resolve, reject) => {
          wx.downloadFile({
              url: src,
              success: (res) => {
                  // 保存文件路径供后续使用
                  resolve(res.tempFilePath);
              },
              fail: (err) => {
                  console.error('音频下载失败', err);
                  reject(err);
              }
          });
      });
  }
}