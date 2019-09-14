import * as THREE from "../../files/three/build/three.module"; //"/three/src/Three";
import {OrbitControls} from "../../files/three/examples/jsm/controls/OrbitControls";//"/jsm/controls/OrbitControls";
import EventFunctions from "./eventfunctions";
import Stats from "../../files/three/examples/jsm/libs/stats.module";
import log from "./log";

import {initShader, shaderType} from "./initshader";

import { EffectComposer } from '../../files/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../../files/three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from '../../files/three/examples/jsm/postprocessing/ShaderPass.js';

let scene = new THREE.Scene(); // 创建场景
let camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000); // 创建相机 (参数分别是   FOV:可视角度,  aspect ratio:宽高比,  near:近剪切面,  far:远剪切面)
let stats: any = new Stats(); // 显示帧数

function initRenderer(){
    camera.aspect = window.innerWidth / 2 / window.innerHeight;
    camera.updateProjectionMatrix();
    
    let renderer =  new THREE.WebGLRenderer(); // 创建渲染器
    renderer.setSize(window.innerWidth/2, window.innerHeight); // 设置渲染器的宽高
    document.body.appendChild(renderer.domElement); // 将渲染器的dom添加进body中
    renderer.render(scene, camera); // 将场景和相机交给渲染器进行渲染
    renderer.domElement.style.position = "fixed";
    renderer.domElement.style.left = "0";
    document.body.appendChild( stats.dom );

    let renderer2 =  new THREE.WebGLRenderer(); // 创建渲染器
    renderer2.setSize(window.innerWidth/2-1, window.innerHeight); // 设置渲染器的宽高
    document.body.appendChild(renderer2.domElement); // 将渲染器的dom添加进body中
    renderer2.render(scene, camera); // 将场景和相机交给渲染器进行渲染
    renderer2.domElement.style.position = "fixed";
    renderer2.domElement.style.right = "0";
    document.body.appendChild( stats.dom );

    window.addEventListener("resize", (): void => {
        camera.aspect = window.innerWidth / 2 / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth/2, window.innerHeight);
        renderer2.setSize(window.innerWidth/2, window.innerHeight);
    })

    return [renderer,renderer2];
}
camera.position.z = 10;

// ##tslint:disable-next-line: only-arrow-functions
// window.addEventListener("resize", (): void => {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     // renderer.setSize(window.innerWidth, window.innerHeight);
// })

export {
    THREE, OrbitControls, stats,
    scene, camera, initRenderer,
    log,
    EffectComposer,RenderPass,ShaderPass,
    initShader, shaderType
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
// window.renderer =  renderer;
