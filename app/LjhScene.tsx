'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export default function LjhScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, .1, 120);
    camera.position.set(0, .4, 18);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x020202, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = .72;
    host.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, .035).texture;
    scene.environment = environment;
    scene.environmentIntensity = .42;

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), .48, .38, .66);
    composer.addPass(bloom);
    const rgb = new ShaderPass(RGBShiftShader);
    rgb.uniforms.amount.value = .0013;
    composer.addPass(rgb);
    composer.addPass(new OutputPass());

    scene.add(new THREE.HemisphereLight(0xb9d7ff, 0x25101c, .18));
    const key = new THREE.DirectionalLight(0xffffff, 1.65);
    key.position.set(-4, 7, 10);
    scene.add(key);
    const blue = new THREE.PointLight(0x258bff, 19, 21, 1.8);
    blue.position.set(-6, 1, 7);
    scene.add(blue);
    const rose = new THREE.PointLight(0xff3e95, 17, 21, 1.85);
    rose.position.set(6, -1, 5);
    scene.add(rose);

    const grid = new THREE.GridHelper(80, 80, 0x31557d, 0x192638);
    grid.position.y = -3.4;
    grid.material.transparent = true;
    grid.material.opacity = .24;
    scene.add(grid);

    const groups: THREE.Group[] = [];
    const geometries: TextGeometry[] = [];
    const materials: THREE.MeshPhysicalMaterial[] = [];
    let disposed = false;

    const makeMaterial = (index: number) => {
      const cool = index % 3 !== 0;
      const material = new THREE.MeshPhysicalMaterial({
        color: cool ? 0x202a36 : 0x2c2029,
        metalness: .96,
        roughness: .18,
        transmission: .14,
        thickness: 1.9,
        ior: 1.48,
        clearcoat: 1,
        clearcoatRoughness: .08,
        iridescence: .16,
        iridescenceIOR: 1.35,
        emissive: cool ? 0x08254a : 0x42091f,
        emissiveIntensity: .08,
        transparent: true,
        opacity: .97,
        envMapIntensity: .92,
      });
      materials.push(material);
      return material;
    };

    new FontLoader().load('/fonts/helvetiker_bold.typeface.json', font => {
      if (disposed) return;
      const chars = ['L', 'J', 'H'];
      chars.forEach(char => {
        const geometry = new TextGeometry(char, { font, size: 2.45, depth: .72, curveSegments: 9, bevelEnabled: true, bevelThickness: .12, bevelSize: .075, bevelOffset: 0, bevelSegments: 5 });
        geometry.computeBoundingBox();
        const box = geometry.boundingBox;
        if (box) geometry.translate(-(box.max.x - box.min.x) / 2, -(box.max.y - box.min.y) / 2, -(box.max.z - box.min.z) / 2);
        geometries.push(geometry);
      });
      const count = window.innerWidth < 720 ? 8 : 11;
      for (let i = 0; i < count; i++) {
        const group = new THREE.Group();
        const material = makeMaterial(i);
        geometries.forEach((geometry, letterIndex) => {
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.x = (letterIndex - 1) * 2.72;
          mesh.castShadow = true;
          group.add(mesh);
        });
        const ring = i * .67;
        group.position.set(Math.cos(ring) * 5, Math.sin(ring * 1.2) * 2.7, Math.sin(ring) * 2);
        group.rotation.set(i * .17, i * .31, i * .09);
        group.scale.setScalar(.65 + (i % 4) * .09);
        group.userData.index = i;
        scene.add(group);
        groups.push(group);
      }
    });

    let mouseX = 0;
    let mouseY = 0;
    let smoothX = 0;
    let smoothY = 0;
    let frame = 0;
    const onPointer = (event: PointerEvent) => {
      mouseX = event.clientX / Math.max(1, window.innerWidth) - .5;
      mouseY = event.clientY / Math.max(1, window.innerHeight) - .5;
    };
    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      renderer.setSize(width, height, false);
      composer.setSize(width, height);
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
    };
    const animate = (time: number) => {
      const hero = document.getElementById('top');
      const progress = hero ? clamp(window.scrollY / Math.max(1, hero.offsetHeight - window.innerHeight)) : 0;
      smoothX += (mouseX - smoothX) * .045;
      smoothY += (mouseY - smoothY) * .045;
      const tunnel = clamp((progress - .7) / .3);
      groups.forEach((group, i) => {
        const angle = i * .67 + progress * 5.25;
        let radius = progress < .28 ? 7.4 - progress * 15.5 : progress < .68 ? 3.1 + (progress - .28) * 18 : 10.3 - (progress - .68) * 21.5;
        if (reduce) radius = 5;
        group.position.x = Math.cos(angle) * radius + (i - (groups.length - 1) / 2) * 1.05 * tunnel + smoothX * (1.1 + i * .04);
        group.position.y = Math.sin(angle * 1.17) * radius * .46 + (i % 2 ? -.8 : .8) * tunnel - smoothY * (1 + i * .035);
        group.position.z = Math.sin(angle + progress * 2) * 4.8 + tunnel * (i - 5) * 1.55;
        group.rotation.x = progress * 6.8 + i * .34 + smoothY * .35;
        group.rotation.y = progress * 10.4 + i * .47 + smoothX * .55;
        group.rotation.z = angle * .28;
        const scale = .62 + (i % 4) * .09 + Math.sin(progress * Math.PI + i) * .08 + tunnel * .18;
        group.scale.setScalar(scale);
        group.visible = Math.abs(group.position.z) < 28;
      });
      camera.position.x = smoothX * 1.2;
      camera.position.y = .35 - smoothY * .8;
      camera.position.z = 18 - progress * 1.8;
      camera.lookAt(0, -.1, 0);
      blue.position.x = -5.8 + smoothX * 4;
      blue.position.y = 1.2 - smoothY * 3;
      rose.position.x = 5.6 + smoothX * 4;
      rose.position.y = -1 + smoothY * 3;
      bloom.strength = .5 + Math.sin(time * .0007) * .06 + tunnel * .12;
      rgb.uniforms.amount.value = .0009 + Math.abs(smoothX) * .004 + tunnel * .0012;
      composer.render();
      frame = requestAnimationFrame(animate);
    };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointer, { passive: true });
    frame = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      groups.forEach(group => scene.remove(group));
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
      grid.geometry.dispose();
      grid.material.dispose();
      environment.dispose();
      room.dispose();
      pmrem.dispose();
      composer.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="ljh-webgl" ref={hostRef} aria-hidden="true" />;
}
