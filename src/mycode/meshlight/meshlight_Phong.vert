precision highp float;
precision highp int;

#define SHADER_NAME meshlight_diffuse

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec3 normal;

varying vec3 _normal;
varying vec3 _position;

void main(){
    _normal = normal;
    _position =  vec3(modelMatrix * vec4(position,1.));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.) ;
}