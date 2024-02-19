uniform float uTime;
uniform float uBigBang;
uniform vec3 uScale;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;

#include ../includes/noise.glsl

mat2 rotate(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax)
{
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    if (uBigBang == 1.0) {
        float displacement = cnoise(position + vec3(0.5 * uTime));
        vec3 newPosition = position + normal * ((1.0 - uScale.x) * displacement);

        modelPosition = modelMatrix * vec4(newPosition, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;

        gl_Position = projectedPosition;
    } else {
        // Position
        gl_Position = projectionMatrix * viewMatrix * modelPosition;
    }

    // Model normal
    vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

    float t = uTime * 0.01;

    mat2 rot0 = rotate(t);
    vec3 p0 = modelPosition.xyz;
    p0.yz = rot0 * p0.yz;

    mat2 rot1 = rotate(t + 10.0);
    vec3 p1 = modelPosition.xyz;
    p1.xz = rot1 * p1.xz;

    mat2 rot2 = rotate(t + 30.0);
    vec3 p2 = modelPosition.xyz;
    p2.xy = rot2 * p2.xy;

    // Varyings
    vUv = uv;
    vNormal = modelNormal;
    vPosition = modelPosition.xyz;

    vLayer0 = p0;
    vLayer1 = p1;
    vLayer2 = p2;
}
