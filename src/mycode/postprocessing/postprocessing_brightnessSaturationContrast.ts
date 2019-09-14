import {THREE, log, 
    renderer, scene, camera, 
    OrbitControls, stats,
    EffectComposer,RenderPass,ShaderPass,
    initShader, shaderType} from "../mylib/init_three.modle";

import brightness_saturation_contrast__vert from '../glsl/postprocessing/brightness_saturation_contrast.vert';
import brightness_saturation_contrast__frag from '../glsl/postprocessing/brightness_saturation_contrast.frag';
import { GUI } from '../../files/three/examples/jsm/libs/dat.gui.module.new';

import flower_png from './flower.png';
let brightness_saturation_contrast, effect:ShaderPass, composer: EffectComposer;
let sprite: THREE.Sprite;

function init() {
    camera.position.z = 5;
    let control = new OrbitControls(camera, renderer.domElement);

    createSprite();
    postprocessing();
    createGUI();
    
    function createSprite(){
        let img = document.createElement('img');
        img.src = flower_png;
        img.onload = function(){
            sprite.scale.x = img.width/img.height;
        }
        let spriteMap = new THREE.TextureLoader().load(flower_png);
        let spriteMaterial = new THREE.SpriteMaterial({map:spriteMap, color: 0xffffff});
        sprite = new THREE.Sprite(spriteMaterial);
        scene.add(sprite);
    }
    function postprocessing(){
        composer = new EffectComposer(renderer);
        composer.addPass( new RenderPass(scene, camera));

        interface aa {
            value:any
        }

        brightness_saturation_contrast = {
            uniforms: {
                "tDiffuse": { value: null } as aa,
                "_Brightness":    { value: 2. },
                "_Saturation":   { value: 1. },
                "_Contrast":    { value: 1. },
            },
            vertexShader : brightness_saturation_contrast__vert,
            fragmentShader : brightness_saturation_contrast__frag
        }
        effect = new ShaderPass( brightness_saturation_contrast );
        
        composer.addPass( effect );
    }
    function createGUI(){
        
        let gui = new GUI();
        let playFolder = gui.addFolder('控制');
        playFolder.add(effect.uniforms._Brightness,'value').name("亮度");
        playFolder.add(effect.uniforms._Saturation,'value').name("饱和度");
        playFolder.add(effect.uniforms._Contrast,'value').name("对比度");
        let play2Folder = gui.addFolder('控制2');
        play2Folder.add(effect.uniforms._Brightness,'value', 0, 10, 0.05).name("亮度");
        play2Folder.add(effect.uniforms._Saturation,'value', 0, 10, 0.05).name("饱和度");
        play2Folder.add(effect.uniforms._Contrast,'value', 0, 10, 0.05).name("对比度");
        play2Folder.open();
    }
}

function animate(){
    requestAnimationFrame(animate);
    // renderer.render(scene,camera);
    composer.render();
    stats.update();
}

init();
animate();

declare global {
    interface Window {
        brightness_saturation_contrast:any;
        effect:any;
    }
}
window.brightness_saturation_contrast = brightness_saturation_contrast;
window.effect = effect;
