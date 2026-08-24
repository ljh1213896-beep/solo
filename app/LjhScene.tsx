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
    const flightPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-10.5, 5.2, -10),
      new THREE.Vector3(-6.8, 3.1, -4.5),
      new THREE.Vector3(-3.4, 1.7, .4),
      new THREE.Vector3(0, .55, 4.8),
      new THREE.Vector3(3.9, -.25, 1.6),
      new THREE.Vector3(7.2, -1.8, -4.2),
      new THREE.Vector3(10.8, -4.2, -11),
    ], false, 'catmullrom', .42);
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
        const initialT = .08 + i / Math.max(1, count - 1) * .92;
        group.position.copy(flightPath.getPoint(initialT));
        group.rotation.set(-.45 + initialT * 2.4, (initialT - .5) * 2.8, (initialT - .5) * .72);
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
      const tunnel = clamp((progress - .74) / .26);
      groups.forEach((group, i) => {
        const baseT = .07 + i / Math.max(1, groups.length - 1) * 1.08;
        const rawT = baseT - progress * .78;
        const pathT = clamp(rawT);
        const point = flightPath.getPoint(pathT);
        const centerLift = Math.sin(pathT * Math.PI);
        group.position.x = point.x + smoothX * (1.05 + centerLift * .65);
        group.position.y = point.y - smoothY * (1 + centerLift * .5);
        group.position.z = point.z + tunnel * (i - 4) * 1.2;
        group.rotation.x = -.48 + pathT * 2.55 + progress * 2.1 + i * .035 + smoothY * .3;
        group.rotation.y = (pathT - .5) * 3.15 + progress * 1.7 + smoothX * .48;
        group.rotation.z = (pathT - .5) * .82 - progress * .72 + i * .025;
        const scale = .42 + centerLift * .92 + (i % 3) * .045 + tunnel * .16;
        group.scale.setScalar(scale);
        group.visible = rawT > -.06 && rawT < 1.06;
      });
      camera.position.x = smoothX * 1.2;
      camera.position.y = .35 - smoothY * .8;
      camera.position.z = 18 - progress * 1.35;
      camera.rotation.z = Math.sin(progress * Math.PI * 2) * .018;
      camera.lookAt(-progress * 1.15, -.1 + progress * .22, 0);
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
