import * as THREE from "three";
import EventFunctions from "./eventfunctions";
import Stats from "../jsm/libs/stats.module";
import log from "./log";

let scene = new THREE.Scene(); // 创建场景
let camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000); // 创建相机 (参数分别是   FOV:可视角度,  aspect ratio:宽高比,  near:近剪切面,  far:远剪切面)
let renderer =  new THREE.WebGLRenderer(); // 创建渲染器
let stats: any = new Stats(); // 显示帧数

renderer.setSize(window.innerWidth, window.innerHeight); // 设置渲染器的宽高
document.body.appendChild(renderer.domElement); // 将渲染器的dom添加进body中
renderer.render(scene, camera); // 将场景和相机交给渲染器进行渲染
document.body.appendChild( stats.dom );

camera.position.z = 10;
renderer.render(scene, camera);

// 将每一帧都要执行的函数添加到此数组中.
const animateFunctions = new EventFunctions();

function animate() {
    requestAnimationFrame(animate);
    animateFunctions.runAll();
    renderer.render(scene, camera);
    stats.update(); // 刷新帧数
}

animate();

// ##tslint:disable-next-line: only-arrow-functions
window.onresize = (): void => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};

export {
    THREE,
    scene, camera, renderer,
    animateFunctions, log,
};

declare global {
    interface Window {
        scene: any;
        camera: any;
        renderer: any;
        uniforms: any;
    }
}
window.scene =  scene;
window.camera =  camera;
window.renderer =  renderer;
