'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type CurvedMediaProps = {
  image: string;
  mode?: 'hero' | 'next';
};

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export default function CurvedMedia({ image, mode = 'hero' }: CurvedMediaProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, .1, 20);
    camera.position.z = 3.35;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const uniforms = {
      uTexture: { value: new THREE.Texture() },
      uTime: { value: 0 },
      uCurve: { value: .34 },
      uHover: { value: 0 },
      uImageAspect: { value: 1.6 },
      uPlaneAspect: { value: 1.6 },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      vertexShader: `
        uniform float uTime;
        uniform float uCurve;
        uniform float uHover;
        varying vec2 vUv;
        varying float vDepth;
        void main() {
          vUv = uv;
          vec3 p = position;
          float nx = p.x / 1.6;
          float ny = p.y;
          float dome = 1.0 - nx * nx;
          p.z += dome * uCurve;
          p.z -= ny * ny * .055;
          p.y += sin(nx * 3.14159 + uTime * .42) * .018 * (1.0 - uHover);
          p.x += nx * abs(nx) * uCurve * .055;
          vDepth = dome;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uImageAspect;
        uniform float uPlaneAspect;
        varying vec2 vUv;
        varying float vDepth;
        void main() {
          vec2 uv = vUv;
          if (uImageAspect > uPlaneAspect) {
            float scale = uPlaneAspect / uImageAspect;
            uv.x = (uv.x - .5) * scale + .5;
          } else {
            float scale = uImageAspect / uPlaneAspect;
            uv.y = (uv.y - .5) * scale + .5;
          }
          vec4 color = texture2D(uTexture, uv);
          color.rgb *= .88 + vDepth * .14;
          gl_FragColor = color;
        }
      `,
    });
    const geometry = new THREE.PlaneGeometry(3.2, 1.92, 72, 42);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let disposed = false;
    const texture = new THREE.TextureLoader().load(image, loaded => {
      if (disposed) return;
      loaded.colorSpace = THREE.SRGBColorSpace;
      loaded.minFilter = THREE.LinearFilter;
      uniforms.uTexture.value = loaded;
      const source = loaded.image as HTMLImageElement;
      uniforms.uImageAspect.value = source.naturalWidth / Math.max(1, source.naturalHeight);
    });

    let mouseX = 0;
    let mouseY = 0;
    let smoothX = 0;
    let smoothY = 0;
    let frame = 0;
    const pointer = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      mouseX = (event.clientX - rect.left) / Math.max(1, rect.width) - .5;
      mouseY = (event.clientY - rect.top) / Math.max(1, rect.height) - .5;
    };
    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
      uniforms.uPlaneAspect.value = width / Math.max(1, height);
    };
    const animate = (time: number) => {
      smoothX += (mouseX - smoothX) * .045;
      smoothY += (mouseY - smoothY) * .045;
      let progress = 0;
      if (mode === 'hero') progress = clamp(window.scrollY / Math.max(1, window.innerHeight));
      else {
        const section = host.closest('.next-project');
        if (section) {
          const rect = section.getBoundingClientRect();
          progress = clamp(-rect.top / Math.max(1, rect.height - window.innerHeight));
          (section as HTMLElement).style.setProperty('--next-progress', String(progress * progress * (3 - 2 * progress)));
        }
      }
      const eased = progress * progress * (3 - 2 * progress);
      uniforms.uTime.value = time * .001;
      uniforms.uHover.value = Math.min(1, Math.abs(smoothX) + Math.abs(smoothY));
      uniforms.uCurve.value = reduce ? .22 : mode === 'next' ? .5 - eased * .18 : .34 + Math.sin(time * .00055) * .035 + progress * .16;
      if (mode === 'next') {
        mesh.scale.setScalar(.62 + eased * .52);
        mesh.position.x = 1.25 * (1 - eased);
        mesh.position.y = .08 * (1 - eased);
        mesh.rotation.y = -.62 * (1 - eased) + smoothX * .055;
        mesh.rotation.x = .08 * (1 - eased) - smoothY * .035;
        mesh.rotation.z = .055 * (1 - eased);
      } else {
        mesh.scale.setScalar(1 + progress * .085);
        mesh.position.y = progress * .12;
        mesh.rotation.y = smoothX * .075 + progress * .045;
        mesh.rotation.x = -smoothY * .045 - progress * .025;
      }
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    resize();
    window.addEventListener('resize', resize);
    host.addEventListener('pointermove', pointer, { passive: true });
    frame = requestAnimationFrame(animate);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      host.removeEventListener('pointermove', pointer);
      texture.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [image, mode]);

  return <div ref={hostRef} className={`curved-media curved-media-${mode}`} aria-hidden="true" />;
}
