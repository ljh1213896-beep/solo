'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type Surface = 'floor' | 'ceiling' | 'left' | 'right' | 'back';

export default function ProfileRoom() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, 1, .1, 90);
    camera.position.set(0, 0, 12.5);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setClearColor(0x040506, 1);
    host.appendChild(renderer.domElement);

    const movingRoom = new THREE.Group();
    const staticRoom = new THREE.Group();
    scene.add(movingRoom, staticRoom);
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.LineBasicMaterial[] = [];
    const left = -11.8;
    const right = 11.8;
    const bottom = -6.5;
    const top = 6.5;
    const near = 8;
    const far = -29;
    const depthSteps = 37;

    const makeSurface = (surface: Surface, uSteps: number, vSteps: number, opacity: number) => {
      const points: number[] = [];
      const at = (u: number, v: number) => {
        const a = u / uSteps;
        const b = v / vSteps;
        if (surface === 'floor') return [THREE.MathUtils.lerp(left, right, a), bottom, THREE.MathUtils.lerp(near, far, b)];
        if (surface === 'ceiling') return [THREE.MathUtils.lerp(left, right, a), top, THREE.MathUtils.lerp(near, far, b)];
        if (surface === 'left') return [left, THREE.MathUtils.lerp(bottom, top, a), THREE.MathUtils.lerp(near, far, b)];
        if (surface === 'right') return [right, THREE.MathUtils.lerp(bottom, top, a), THREE.MathUtils.lerp(near, far, b)];
        return [THREE.MathUtils.lerp(left, right, a), THREE.MathUtils.lerp(bottom, top, b), far];
      };
      const add = (a: number[], b: number[]) => points.push(...a, ...b);
      for (let u = 0; u <= uSteps; u++) for (let v = 0; v < vSteps; v++) add(at(u, v), at(u, v + 1));
      for (let v = 0; v <= vSteps; v++) for (let u = 0; u < uSteps; u++) add(at(u, v), at(u + 1, v));
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
      const material = new THREE.LineBasicMaterial({ color: 0x66798c, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending });
      const lines = new THREE.LineSegments(geometry, material);
      lines.renderOrder = -2;
      (surface === 'back' ? staticRoom : movingRoom).add(lines);
      geometries.push(geometry);
      materials.push(material);
    };

    makeSurface('floor', 24, depthSteps, .34);
    makeSurface('ceiling', 24, depthSteps, .27);
    makeSurface('left', 14, depthSteps, .31);
    makeSurface('right', 14, depthSteps, .31);
    makeSurface('back', 24, 14, .24);

    let mouseX = 0;
    let mouseY = 0;
    let smoothX = 0;
    let smoothY = 0;
    let frame = 0;
    const onPointer = (event: PointerEvent) => {
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
    };
    const animate = (time: number) => {
      const seconds = time * .001;
      smoothX += (mouseX - smoothX) * .035;
      smoothY += (mouseY - smoothY) * .035;
      const spacing = (near - far) / depthSteps;
      movingRoom.position.z = reduce ? 0 : -((seconds * .62) % spacing);
      movingRoom.rotation.y = smoothX * .012;
      movingRoom.rotation.x = smoothY * .009;
      staticRoom.rotation.y = movingRoom.rotation.y;
      staticRoom.rotation.x = movingRoom.rotation.x;
      camera.position.x = smoothX * .75;
      camera.position.y = -smoothY * .55;
      camera.lookAt(0, 0, -8);
      materials.forEach((material, i) => { material.opacity += (([.34,.27,.31,.31,.24][i] + Math.sin(seconds * .45 + i) * .018) - material.opacity) * .04; });
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    resize();
    window.addEventListener('resize', resize);
    host.addEventListener('pointermove', onPointer, { passive: true });
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      host.removeEventListener('pointermove', onPointer);
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="profile-room-webgl" ref={hostRef} aria-hidden="true" />;
}
