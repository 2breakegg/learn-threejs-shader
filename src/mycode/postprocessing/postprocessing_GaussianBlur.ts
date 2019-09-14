import {THREE, log, 
    initRenderer, scene, camera, 
    OrbitControls, stats,
    EffectComposer,RenderPass,ShaderPass,
    initShader, shaderType} from "../mylib/init_comtrast_three.modle";

import GaussianBlur__vert from '../glsl/postprocessing/GaussianBlur.vert';
import GaussianBlur__frag from '../glsl/postprocessing/GaussianBlur.frag';
import { GUI } from '../../files/three/examples/jsm/libs/dat.gui.module.new';

import flower_png from './flower.png';
let effects:ShaderPass[] = [], composer: EffectComposer;
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
        }
        let spriteMap = new THREE.TextureLoader().load(flower_png);
        let spriteMaterial = new THREE.SpriteMaterial({map:spriteMap, color: 0xffffff});
        sprite = new THREE.Sprite(spriteMaterial);
        scene.add(sprite);
    }
    function postprocessing(){
        let GaussianBlurTimes = 10;
        composer = new EffectComposer(renderer);
        composer.addPass( new RenderPass(scene, camera));

        interface aa {
            value:any
        }
        for(let i=0; i<GaussianBlurTimes; i++){
            GaussianBlurOnce();
        }
        function GaussianBlurOnce(){
            let GaussianBlur_VER = {
                uniforms: {
                    "tDiffuse": { value: null } as aa,
                    "_MainTex_TexelSize":    { value: new THREE.Vector4(0 , 1/500, 0., 0.) },
                    "_BlurSize":   { value: 1.0 },
                },
                vertexShader : GaussianBlur__vert,
                fragmentShader : GaussianBlur__frag
            }
            effects.push(new ShaderPass( GaussianBlur_VER ));
            composer.addPass( effects[effects.length-1] );

            let GaussianBlur_HRO = {
                uniforms: {
                    "tDiffuse": { value: null } as aa,
                    "_MainTex_TexelSize":    { value: new THREE.Vector4(1/500, 0., 0., 0.) },
                    "_BlurSize":   { value: 1.0 },
                },
                vertexShader : GaussianBlur__vert,
                fragmentShader : GaussianBlur__frag
            }
            effects.push(new ShaderPass( GaussianBlur_HRO ));
            composer.addPass( effects[effects.length-1] );
        }
    }
    function createGUI(){
        let Configuration = {
            _MainTex_TexelSize_x : 500,
            _MainTex_TexelSize_y : 500,
            _BlurSize : 1.0,
        }
        let gui = new GUI();
        let playFolder = gui.addFolder('控制');
        playFolder.add(Configuration,'_MainTex_TexelSize_x', 0, 1000, 1)
            .name("尺寸x")
            .onChange(function(value:number){
                for(let i = 0; i < effects.length/2; i++){
                    effects[1].uniforms._MainTex_TexelSize.value.x = 1/value;
                }
        })
        playFolder.add(Configuration,'_MainTex_TexelSize_y', 0, 1000, 1)
            .name("尺寸y")
            .onChange(function(value:number){
                for(let i = 0; i < effects.length/2; i++){
                    effects[i].uniforms._MainTex_TexelSize.value.y = 1/value;
                    //effects[i].uniforms._BlurSize.value = value;
                }
        });
        playFolder.add(Configuration,'_BlurSize', 0, 100, 0.1)
            .name("模糊尺寸")
            .onChange(function(value:number){
                for(let i = 0; i < effects.length; i++){
                    effects[i].uniforms._BlurSize.value = value;
                }
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
    }
}
