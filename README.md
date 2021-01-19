# teamPro_posenet
 Home Training App 
 
 本项目主要参考了The Coding Train中的poseNet系列的示例教程，以下是系列视频的[链接](https://www.youtube.com/watch?v=OIo-DIOkNVg)

 对poseNet有一定了解后就可以利用poseNet进行很多有意思的前端开发。本项目也是其中之一。
 其中使用到的ml5.js库是基于Tensorflow.js的，能在浏览器上进行机器学习的相关开发的开源框架。
 同时搭配p5.js绘图框架能很好的展示视频图像和绘制poseNet的人体骨架结果。
 
### [Sources Code On P5](https://editor.p5js.org/neng5201314/sketches/3mnRCUHME)


### [Try Demo Here](https://editor.p5js.org/neng5201314/present/3mnRCUHME)
make sure your whole body show on the screen.

### [Demo Video On Youtube](https://www.youtube.com/watch?v=frwx4odqeu4)

 ## 目录
 * [1. 项目安装](#1)

 * [2. 使用说明](#2)

 * [3. 项目说明](#3)

   * [a. 主要说明](#31)
   * [b. 动作计数思路(Counting)](#32)
   * [c. 人机交互思路(HCI)](#33)
   * [d. 模型训练阶段的使用手册](#34)

<h2 id="1">1. 项目安装</h2>
 
 1. 进入poseNet_git文件夹目录 cd poseNet_git
 
 2. 安装相关依赖 npm install
 
 3. 使用npm安装相关依赖后使用 npm start的方式
 
 4. 在浏览器打开localhost://8123

<h2 id="2">2. 使用说明</h2> 

1. 基本操作

使用一种更加方便的形式，通过摄像头跟踪手掌位置，当手掌位置移动到页面上方的‘按钮’，接触到‘按钮’后会打开页面菜单。简单来说就是用户可以通过移动手掌来隔空操作程序，是一种比较简单人机交互形式(HCI)。

2. 动作计数

默认可计数深蹲动作，若需要计数其他动作可根据[模型训练过程的提示](#35)训练简单的动作识别模型.

<h2 id="3">3. 项目说明</h2> 

<h3 id="31">3. 主要说明：</h3> 

项目是本科毕业设计实现的小项目， 设计目的：为在家中训练的用户，提供实时动作计数功能。

<h3 id="32">3.1 动作计数思路(Counting)：</h3> 

<div align="center">
	<img src="https://github.com/neng5201314/teamPro_posenet/blob/master/MD_images/gif2.gif" alt="Editor" width="500">
</div>

1. 通过posenet模型提取人体姿态关键点。
2. 根据的到的关键点坐标训练动作二分类模型
3. 通过二分类模型中实时得到的分类结果来实现动作计数算法，动作一变化到动作二时计数器增加0.5，动作二回到动作一状态计算器增加0.5

<h3 id="33">3. 人机交互思路(HCI)：</h3> 

<div align="center">
	<img src="https://github.com/neng5201314/teamPro_posenet/blob/master/MD_images/gif1.gif" alt="Editor" width="500">
</div>

1. 在视频中设计‘按钮’图案。
2. 通过posenet得到手腕部分的关键点，通过估计计数得到手掌位置关键点。
3. 通过计算手掌关键点坐标和图案中心点坐标的距离，但距离小于图案半径，则判断为用户触碰按钮
4. 当触碰次数达到固定阈值，则判断用户点击按钮。


<h3 id="34">3. 模型训练阶段的使用手册：</h3> 

1. 点击画面上方的‘按钮’图案后，点击Train A Model‘按钮’进入训练模型阶段
2. 动作一关键点数据收集阶段。（每次人体关键点坐标数据收集之前都会有3秒的动作准备时间和5秒的数据收集时间）
3. 动作二关键点数据收集阶段。（每次人体关键点坐标数据收集之前都会有3秒的动作准备时间和5秒的数据收集时间）
4. 等待动作二分类模型训练完成，这里使用了ml5.js模块的默认分类模型。训练10个回合。


 





