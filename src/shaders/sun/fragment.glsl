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
    return (vec3(b, b*b, b*b*b*b) / 0.25) * 0.6;
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

// See "Combustible Voronoi"
// https://www.shadertoy.com/view/4tlSzl
vec3 firePalette(float i){
    float T = 1400. + 1300.*i; // Temperature range (in Kelvin).
    vec3 L = vec3(7.4, 5.6, 4.4); // Red, green, blue wavelengths (in hundreds of nanometers).
    L = pow(L,vec3(5.0)) * (exp(1.43876719683e5/(T*L))-1.0);
    return 1.0-exp(-5e8/L); // Exposure level. Set to "50." For "70," change the "5" to a "7," etc.
}

float sun() {
    float sum = 0.0;
    sum += fbm(vec4(vLayer0 * 3.0, uTime * 0.02));
    sum += fbm(vec4(vLayer1 * 3.0, uTime * 0.02));
    sum += fbm(vec4(vLayer2 * 3.0, uTime * 0.02));
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
