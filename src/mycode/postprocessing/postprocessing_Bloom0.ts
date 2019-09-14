// 没有分别出亮部分贴图和普通部分贴图,直接在一张贴图中渲染
import {THREE, log, 
    initRenderer, scene, camera, 
    OrbitControls, stats,
    EffectComposer,RenderPass,ShaderPass,
    initShader, shaderType} from "../mylib/init_comtrast_three.modle";

import GLSL_vert from '../glsl/postprocessing/Bloom.vert';
import GLSL_frag from '../glsl/postprocessing/Bloom.frag';
import { GUI } from '../../files/three/examples/jsm/libs/dat.gui.module.new';

import flower_png from '../postprocessing/flower.png';
let effects:ShaderPass[] = [], composer: EffectComposer;
let sprite: THREE.Sprite, cube: THREE.Mesh;
let renderers = initRenderer();
let renderer = renderers[0];
let renderer2 = renderers[1];

function init() {
    camera.position.z = 5;
    let control = new OrbitControls(camera, renderer.domElement);

    // createSprite();
    createCube();
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
    function createCube(){
        cube = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1), 
            new THREE.MeshBasicMaterial({color:0xffffff}));
        
        let cube2 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1), 
            new THREE.MeshBasicMaterial({color:0x330000}));
        cube2.position.x=1.1;
        let cube3 = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1), 
            new THREE.MeshBasicMaterial({color:0x003300}));
        cube3.scale.set(10,0.1,10);
        scene.add(cube,cube2,cube3);
    }
    function postprocessing(){
        let BloomTimes = 10;
        composer = new EffectComposer(renderer);
        composer.addPass( new RenderPass(scene, camera));

        interface aa {
            value:any
        }
        for(let i=0; i<BloomTimes; i++){
            BloomOnce();
        }
        function BloomOnce(){
            let Bloom_VER = {
                uniforms: {
                    "tDiffuse": { value: null } as aa,
                    "_MainTex_TexelSize":    { value: new THREE.Vector4(0 , 1/500, 0., 0.) },
                    "_BlurSize":   { value: 1.0 },
                    "_Threshold": {value: 0.6},
                },
                vertexShader : GLSL_vert,
                fragmentShader : GLSL_frag
            }
            effects.push(new ShaderPass( Bloom_VER ));
            composer.addPass( effects[effects.length-1] );

            let Bloom_HRO = {
                uniforms: {
                    "tDiffuse": { value: null } as aa,
                    "_MainTex_TexelSize":    { value: new THREE.Vector4(1/500, 0., 0., 0.) },
                    "_BlurSize":   { value: 1.0 },
                    "_Threshold": {value: 0.6},
                },
                vertexShader : GLSL_vert,
                fragmentShader : GLSL_frag
            }
            effects.push(new ShaderPass( Bloom_HRO ));
            composer.addPass( effects[effects.length-1] );
        }
    }
    function createGUI(){
        let Configuration = {
            _MainTex_TexelSize_x : 500,
            _MainTex_TexelSize_y : 500,
            _BlurSize : 1.0,
            _Threshold : 0.6
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
        playFolder.add(Configuration,'_Threshold', 0, 1, 0.01)
            .name("阈值")
            .onChange(function(value:number){
                for(let i = 0; i < effects.length; i++){
                    effects[i].uniforms._Threshold.value = value;
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
