precision highp float;
precision highp int;

#define SHADER_NAME meshlight_diffuse

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec3 normal;

varying vec3 _normal;

void main(){
    _normal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.) ;
}