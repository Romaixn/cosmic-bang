uniform vec2 uResolution;
uniform float uTime;
uniform sampler2D uNoise;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;

float PI = 3.14159265359;

#include ../includes/noise.glsl

vec3 brightnessToColor(float b) {
    b *= 0.25;
    return (vec3(b, b*b, b*b*b*b) / 0.25) * 0.8;
}

float fbm(vec4 p) {
    float sum = 0.0;
    float amplitude = 1.0;
    float scale = 1.0;

    for(int i=0; i < 6; i++) {
        sum += snoise(p * scale) * amplitude;
        p.w += 100.0;
        amplitude *= 0.9;
        scale *= 2.0;
    }

    return sum;
}

float sun() {
    float sum = 0.0;

    // Spots
    vec4 p = vec4(vPosition * 2.0, uTime * 0.1);
    float spots = max(snoise(p), 0.0);

    sum += fbm(vec4(vLayer0 * 3.0, uTime * 0.02)) + mix(1.0, spots, 0.7);
    sum += fbm(vec4(vLayer1 * 3.0, uTime * 0.02));
    sum += fbm(vec4(vLayer2 * 3.0, uTime * 0.02));
    sum += mix(0.0, spots, 0.7);
    sum *= 0.12;

    return sum;
}

void main() {
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);

    // Fresnel
    float fresnel = dot(viewDirection, normal) + 1.0;
    fresnel = pow(fresnel, 2.0);

    // Noise
    vec4 p = vec4(vPosition * 3.0, uTime * 0.02);
    float noisy = fbm(p);

    // Spots
    vec4 p1 = vec4(vPosition * 2.0, uTime * 0.02);
    float spots = max(snoise(p1), 0.0);

    // Colors
    float brightness = sun();
    brightness = brightness * 2.6 + 1.5;
    brightness += fresnel;
    vec3 color = brightnessToColor(brightness);


    gl_FragColor = vec4(color, 1.0);
}
