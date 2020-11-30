# teamPro_posenet
 Home Training App [README_ENG](README_ENG.md)
 
 本项目主要参考了The Coding Train中的poseNet系列的示例教程，以下是系列视频的[链接](https://www.youtube.com/watch?v=OIo-DIOkNVg)

 对poseNet有一定了解后就可以利用poseNet进行很多有意思的前端开发。本项目也是其中之一。
 其中使用到的ml5.js库是基于Tensorflow.js的，能在浏览器上进行机器学习的相关开发的开源框架。
 同时搭配p5.js绘图框架能很好的展示视频图像和绘制poseNet的人体骨架结果。
 [示例代码](https://editor.p5js.org/neng5201314/sketches/ptEcLMvXY)
你可以随意修改，不过代码有点乱就是了。

[try demo here](https://editor.p5js.org/neng5201314/present/ptEcLMvXY) make sure your whole body show on the screen.
 ## 目录
 * [1. 项目安装](#1)

 * [2. 使用说明](#2)

 * [3. 项目说明](#3)

   * [a. 主要说明](#31)
   * [b. 项目结构](#32)
   * [c. 动作计数功能实现部分](#33)
   * [d. 可替换的poseModel](#34)
   * [e. 模型训练阶段的使用手册](#35)
 * [4. 未来计划](#4)

<h2 id="1">1. 项目安装</h2>
 
 1. 进入poseNet_git文件夹目录 cd poseNet_git
 
 2. 安装相关依赖 npm install
 
 3. 使用npm安装相关依赖后使用 npm start的方式

<h2 id="2">1. 使用说明</h2> 
项目有较大改动，在对程序下达命令方面，比起识别姿势来进行命令下达，换了一种更加方便的形式，就是通过摄像头跟踪手掌位置，当手掌位置移动到页面上方，触碰到‘按钮’就会打开页面菜单。简单来说就是用户可以通过移动手掌来操作程序，也是一种比较有意思的人机交互形式(HCI)。

项目处于未完成阶段
用户自己训练模型的功能还未实现。
 





