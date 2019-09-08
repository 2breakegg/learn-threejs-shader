import {
  Uniform
} from '../../../src/Three';

export class DotScreenShader {
  uniforms: {
    tDiffuse: Uniform;
    tSize: Uniform;
    center: Uniform;
    angle: Uniform;
    scale: Uniform;
  };
  vertexShader: string;
  fragmentShader: string;
}
