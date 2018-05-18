## sdBeaconOnline Server
[灯塔在线答题机器人](https://github.com/JesseWo/sdBeaconOnlineBot) 的服务端.

集成功能
* 登录验证码OCR查询;
* 答案检索;
* 建立错题集,用的越多,准确率越高;

### How to start
安装OCR库
使用了Google开源的 [tesseract](https://github.com/tesseract-ocr/tesseract)

各个平台的安装方式:https://github.com/tesseract-ocr/tesseract/wiki

依赖
```
npm install
```
更新题库
```
npm run updateQB
```

运行
```
npm start
```
