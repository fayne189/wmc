# teamPro_posenet: 

[README IN CHINESE](https://github.com/neng5201314/teamPro_posenet/blob/master/README.md)

홈트레이닝을 위한 프로그램 

## DEMO AND VIDEO

[Sources Code On P5](https://editor.p5js.org/neng5201314/sketches/3mnRCUHME)

[Try Demo Here](https://editor.p5js.org/neng5201314/present/3mnRCUHME)
make sure your whole body show on the screen.

[Demo Video On Youtube](https://www.youtube.com/watch?v=frwx4odqeu4)

 ## 목차
 * [1. Installation(프로젝트 설치)](#1)

 * [2. Introduction & Background(설계 소개 및 배경 지식) ](#2)

 * [3. Design & Idea Explanation(설계 및 아이디어 설명)](#3)

   * [a. Main Idea(주요 목적)](#31)
   * [b. Motion Counting(카운팅 기능)](#32)
   * [c. HCI(인간과 컴퓨터 상호 작용)](#33)

	 
<h2 id="1">1. Installation(프로젝트 설치) </h2>

 1. git clone git@github.com:neng5201314/teamPro_posenet.git 
 
 2. cd poseNet_git
 
 3. npm install
 
 4. npm start
 
 5. localhost://8123

<h2 id="2">2. Introduction and Background(설계 소개 및 배경 지식) </h2>

  ‘PoseNet’을 활용한 홈트레이닝’은 웹캠을 이용하여 사용자의 집에서 혼자 운동을 할때, 좀 더 효율적으로 도와줄 수 있도록 구현한 웹페이지이다. 이를 위해 사용자가 어떤 운동을 하고 있는지, 또한 사용자가 몇 번의 운동을 했는지를 실시간으로 세어주는 기능을 넣었다. 사용자가 운동을 하고자 할 때 카메라를 통하여 현재 하고 있는 운동을 몇 번 하였는지 운동 횟수를 측정한다. 이 프로그램은 기본적으로 squat 동작에 대한 인식이 가능하며, 사용자가 squat이 아닌 다른 운동을 하고 싶을 시, 새로운 운동 자세를 모델에 새로 학습시켜 사용자가 원하는 동작으로 인식하고 카운팅을 할 수 있도록 구현하였다.

언어: JavaScript,

Front-End: P5.js, HTML, hbs

Back-End: node.js, wordpress, 데이터베이스(MySQL)  클라우드(AWS EC2)

딥러닝: 모델(MobileNet, ResNet) , 포즈 추정(Pose Estimation by PoseNet), 


<h2 id="3">3. Design & Idea Explanation(설계 및 아이디어 설명) </h2>

<h3 id="31">3.1 MAIN IDEA(주요 목적)</h3>


  전 세계적으로 유행처럼 번진 코로나로 인해 홈트레이닝을 하는 사람들이 과거에 비해 늘어나게 되었다. 하지만 아무래도 혼자하는 운동의 특성상 동기 부여가 어려운 점을 고려해 우리 팀은 사용자가 어떤 운동을 했는지 인식하고 사용자가 해당 운동의 운동 횟수를 실시간으로 세어주는 기능을 넣어줌으로써 사용자가 동기부여를 더 받을 수 있도록 기능을 설계하였다. 프로그램의 동작 과정을 살펴보면, 우선적으로 사용자가 운동을 시작하려고 하면 웹 카메라의 접근을 허용하여 사용자의 동작을 인식할 수 있다. 이미 모델에 학습시켜 놓은 squat 자세에 대한 운동을 사용자가 하고자 하면 추가로 모델을 트레이닝 시키지 않고도 바로 동작 인식이 가능하며 그에 따른 카운팅이 가능하다. 만약 사용자가 squat이 아닌 새로운 운동을 하고자 하면 그 운동을 모델학습 시켜 인식하고 카운팅할수 있게 하였다.

<h3 id="32">3.2 Motion Counting(카운팅 기능)</h3>

<div align="center">
	<img src="https://github.com/neng5201314/teamPro_posenet/blob/master/MD_images/gif2.gif" alt="Editor" width="500">
</div>

학습된 모델을 사용하여 사용자의 동작 인식이 가능하며 사용자가 운동 동작을 취했을 때, 첫번째 동작과 두번째 동작 자세의 skeleton을 학습된 모델과 비교하여 동작이 같을 경우 count를 0.5 증가시켜 주게 되어 최종적으로 첫번째 동작 자세와 두번째 동작 자세가 모두 일치할 경우 총 1개의 count를 증가시켜주게 된다. 

<h3 id="33">3.3 HCI(인간과 컴퓨터 상호 작용)</h3>

<div align="center">
	<img src="https://github.com/neng5201314/teamPro_posenet/blob/master/MD_images/gif1.gif" alt="Editor" width="500">
</div>

사용자의 손의 위치를 인식하여 이를 가운데 상단에 있는 ‘MAIN’ 부분에 갖다되게 되면 메뉴를 선택할 수 있는 창이 나오도록 기능 구현이 되어 있다. 
사용자가 메뉴 화면에서 ‘start’ 버튼을 누르면 바로 스쿼트 동작에 대한 인식이 가능


## 4. Authors(작성자)
김보민, 이승용, 황쯜펑
