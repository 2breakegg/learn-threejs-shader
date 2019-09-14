import {THREE, log, 
    initRenderer, scene, camera, 
    OrbitControls, stats,
    EffectComposer,RenderPass,ShaderPass,
    initShader, shaderType} from "../mylib/init_comtrast_three.modle";

import EdgeDetection__vert from '../glsl/postprocessing/EdgeDetection.vert';
import EdgeDetection__frag from '../glsl/postprocessing/EdgeDetection.frag';
import { GUI } from '../../files/three/examples/jsm/libs/dat.gui.module.new';

import flower_png from './flower.png';
let EdgeDetection, effect:ShaderPass, composer: EffectComposer;
let sprite: THREE.Sprite;
let renderers = initRenderer();
let renderer = renderers[0];
let renderer2 = renderers[1];

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
            // effect.uniforms._MainTex_TexelSize.value.x = 1/img.width;
            // effect.uniforms._MainTex_TexelSize.value.y = 1/img.height;
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

        EdgeDetection = {
            uniforms: {
                "tDiffuse": { value: null } as aa,
                "_MainTex_TexelSize":    { value: new THREE.Vector4(1/500, 1/500, 0., 0.) },
                "_EdgeOnly":   { value: 0.1 },
                "_EdgeColor":    { value: new THREE.Color(0, 0, 0) },
                "_BackgroundColor":    { value: new THREE.Color(1, 1, 1) },
            },
            vertexShader : EdgeDetection__vert,
            fragmentShader : EdgeDetection__frag
        }
        effect = new ShaderPass( EdgeDetection );
        
        composer.addPass( effect );
    }
    function createGUI(){
        let Configuration = {
            _MainTex_TexelSize_x : 500,
            _MainTex_TexelSize_y : 500,
            _EdgeColor : `#000000`,
            _BackgroundColor : `#ffffff`
        }
        let gui = new GUI();
        let playFolder = gui.addFolder('控制');
        playFolder.add(Configuration,'_MainTex_TexelSize_x', 0, 1000, 1).name("尺寸x").onChange(function(value:number){
            effect.uniforms._MainTex_TexelSize.value.x = 1/value;
        })
        playFolder.add(Configuration,'_MainTex_TexelSize_y', 0, 1000, 1).name("尺寸y").onChange(function(value:number){
            effect.uniforms._MainTex_TexelSize.value.y = 1/value;
        });
        playFolder.add(effect.uniforms._EdgeOnly,'value').name("边缘");
        playFolder.addColor(Configuration,'_EdgeColor').name("边缘颜色").onChange(function(value:number){
            effect.uniforms._EdgeColor.value.set(value);
        });
        playFolder.addColor(Configuration,'_BackgroundColor').name("背景色").onChange(function(value:number){
            effect.uniforms._BackgroundColor.value.set(value);
        });
    }
}

function animate(){
    requestAnimationFrame(animate);
    // renderer.render(scene,camera);
    composer.render();
    renderer2.render(scene,camera);
    stats.update();
}

init();
animate();

declare global {
    interface Window {
        EdgeDetection:any;
        effect:any;
    }
}
window.EdgeDetection = EdgeDetection;
window.effect = effect;
