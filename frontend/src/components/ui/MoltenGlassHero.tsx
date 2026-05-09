'use client';

import React, { useRef, useEffect } from 'react';
import { Renderer, Program, Mesh, Triangle, Vec2 } from 'ogl';

export default function MoltenGlassHero() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;

        const renderer = new Renderer({
            alpha: false,
            dpr: Math.min(window.devicePixelRatio, 2)
        });
        const gl = renderer.gl;

        const vertex = /* glsl */ `
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

        const fragment = /* glsl */ `
      precision highp float;
      
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform float uChromatism;
      
      varying vec2 vUv;

      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
          dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      vec3 getBaseColor(vec2 uv) {
        float t = uTime * 0.05; // VERY SLOW Flow
        
        // Option C - Frosted Dark Purple (near-black obsidian tones)
        vec3 col1 = vec3(0.035, 0.012, 0.075); // Deep obsidian purple #090330
        vec3 col2 = vec3(0.055, 0.020, 0.110); // Dark violet #0e0538
        vec3 col3 = vec3(0.080, 0.012, 0.095); // Muted dark magenta #140618
        
        float n1 = snoise(uv * 2.0 + t);
        float n2 = snoise(uv * 3.0 - t * 0.5);
        
        float mask1 = smoothstep(-0.5, 0.5, n1);
        float mask2 = smoothstep(-0.5, 0.5, n2);
        
        vec3 final = mix(col1, col2, mask1);
        final = mix(final, col3, mask2 * 0.35);
        
        return final;
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);
        
        float noiseVal = snoise(uv * 1.5 + uTime * 0.02);
        vec2 warp = vec2(
            snoise(uv + uTime * 0.03),
            snoise(uv + uTime * 0.024 + 2.0)
        ) * 0.15; // LOW Distortion

        float dist = length(uv - uMouse);
        float mouseForce = exp(-dist * 3.0);
        warp += (uv - uMouse) * mouseForce * 0.5;

        float intensity = 0.01 + (uChromatism * 0.03) + (mouseForce * 0.02);
        
        vec2 uvR = uv + warp - vec2(intensity, 0.0);
        float r = getBaseColor(uvR).r;
        
        vec2 uvG = uv + warp;
        float g = getBaseColor(uvG).g;
        
        vec2 uvB = uv + warp + vec2(intensity, 0.0);
        float b = getBaseColor(uvB).b;
        
        vec3 color = vec3(r, g, b);

        float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
        color -= grain * 0.03;
        
        // Deep vignette — pushes edges toward near-black
        float vignette = 1.0 - length(uv * 0.45);
        color *= smoothstep(0.0, 1.2, vignette);

        // Global darkening multiplier to stay cinematic
        color *= 0.75;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

        const geometry = new Triangle(gl);
        const program = new Program(gl, {
            vertex,
            fragment,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new Vec2(window.innerWidth, window.innerHeight) },
                uMouse: { value: new Vec2(0, 0) },
                uChromatism: { value: 0 },
            },
        });

        const mesh = new Mesh(gl, { geometry, program });

        function resize() {
            renderer.setSize(container.offsetWidth, container.offsetHeight);
            program.uniforms.uResolution.value.set(gl.canvas.width, gl.canvas.height);
        }
        window.addEventListener('resize', resize);
        resize();

        const mouse = new Vec2(0, 0);
        const targetMouse = new Vec2(0, 0);
        let velocity = 0;

        function updateMouse(x: number, y: number) {
            const aspect = window.innerWidth / window.innerHeight;
            targetMouse.set(
                ((x / window.innerWidth) * 2 - 1) * aspect,
                -((y / window.innerHeight) * 2 - 1)
            );
        }
        window.addEventListener('mousemove', e => updateMouse(e.clientX, e.clientY));
        window.addEventListener('touchmove', e => updateMouse(e.touches[0].clientX, e.touches[0].clientY));

        let animationId: number;
        function update(t: number) {
            animationId = requestAnimationFrame(update);
            const time = t * 0.001;

            const dist = mouse.distance(targetMouse);
            velocity += (dist - velocity) * 0.1;

            mouse.lerp(targetMouse, 0.1);

            program.uniforms.uTime.value = time;
            program.uniforms.uMouse.value.copy(mouse);
            program.uniforms.uChromatism.value = velocity * 4.0;

            renderer.render({ scene: mesh });
        }
        animationId = requestAnimationFrame(update);
        container.appendChild(gl.canvas);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', updateMouse);
            window.removeEventListener('touchmove', updateMouse);
            gl.getExtension('WEBGL_lose_context')?.loseContext();
        };
    }, []);

    return <div ref={containerRef} className="w-full h-full opacity-85" />;
}