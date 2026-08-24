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

    type LetterGroup = { root: THREE.Group; meshes: THREE.Mesh<TextGeometry, THREE.MeshPhysicalMaterial>[] };
    const groups: LetterGroup[] = [];
    const geometries: TextGeometry[] = [];
    const materials: THREE.MeshPhysicalMaterial[] = [];
    const flightPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-10.8, 5.3, -5.5),
      new THREE.Vector3(-6.2, 3.2, -.8),
      new THREE.Vector3(-1.5, 1.05, 3.8),
      new THREE.Vector3(3.4, -1.15, 2.4),
      new THREE.Vector3(7.2, -3.1, -1.6),
      new THREE.Vector3(11.2, -5.2, -6.2),
    ], false, 'catmullrom', .42);
    let disposed = false;

    const makeMaterial = (index: number) => {
      const cool = index % 4 !== 0;
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
      const count = 3;
      for (let i = 0; i < count; i++) {
        const group = new THREE.Group();
        const meshes: THREE.Mesh<TextGeometry, THREE.MeshPhysicalMaterial>[] = [];
        geometries.forEach((geometry, letterIndex) => {
          const material = makeMaterial(i * 3 + letterIndex);
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.x = (letterIndex - 1) * 2.72;
          mesh.castShadow = true;
          group.add(mesh);
          meshes.push(mesh);
        });
        const initialT = .08 + i / count;
        group.position.copy(flightPath.getPoint(initialT));
        group.rotation.set(-.45 + initialT * 2.4, (initialT - .5) * 2.8, (initialT - .5) * .72);
        group.scale.setScalar(.72);
        group.userData.index = i;
        scene.add(group);
        groups.push({ root: group, meshes });
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
      const seconds = time * .001;
      const scatter = 1 - clamp((progress - .08) / .16);
      const focusCenters = [1 / 3, 2 / 3, 1];
      const targetPositions = [
        new THREE.Vector3(3.15, .55, 3.15),
        new THREE.Vector3(-2.7, .3, 3.45),
        new THREE.Vector3(0, 2.05, 3.2),
      ];
      const targetRotations = [
        new THREE.Euler(-.12, -.62, -.08),
        new THREE.Euler(.12, .54, .1),
        new THREE.Euler(-.08, -.42, .08),
      ];
      groups.forEach(({ root, meshes }, i) => {
        const autoT = (seconds * (reduce ? 0 : .027) + i / groups.length + .04) % 1;
        const point = flightPath.getPoint(autoT);
        const focus = clamp(1 - Math.abs(progress - focusCenters[i]) / .205);
        const easedFocus = focus * focus * (3 - 2 * focus);
        const depthScale = .48 + Math.sin(autoT * Math.PI) * .82;
        const driftX = Math.sin(seconds * .42 + i * 1.8) * .16;
        const driftY = Math.cos(seconds * .36 + i * 2.1) * .14;

        root.position.copy(point).lerp(targetPositions[i], easedFocus);
        root.position.x += driftX + smoothX * (1.1 - easedFocus * .45);
        root.position.y += driftY - smoothY * (1.05 - easedFocus * .4);
        root.rotation.x = THREE.MathUtils.lerp(-.52 + autoT * 2.5 + seconds * .1, targetRotations[i].x + Math.sin(seconds * .34 + i) * .08, easedFocus);
        root.rotation.y = THREE.MathUtils.lerp((autoT - .5) * 3.4 + seconds * .16, targetRotations[i].y + Math.cos(seconds * .28 + i) * .12, easedFocus);
        root.rotation.z = THREE.MathUtils.lerp((autoT - .5) * .9 + seconds * .055, targetRotations[i].z + Math.sin(seconds * .25 + i) * .045, easedFocus);
        root.scale.setScalar(THREE.MathUtils.lerp(depthScale, 1.52, easedFocus));

        meshes.forEach((mesh, letterIndex) => {
          const isFocusedLetter = letterIndex === i;
          const opacity = Math.max(scatter * .97, isFocusedLetter ? easedFocus : 0);
          mesh.material.opacity = opacity;
          mesh.visible = opacity > .015;
          mesh.position.x = THREE.MathUtils.lerp((letterIndex - 1) * 2.72, isFocusedLetter ? 0 : (letterIndex - 1) * 4.2, easedFocus);
        });
        root.visible = scatter > .015 || focus > .015;
      });
      camera.position.x = smoothX * 1.2;
      camera.position.y = .35 - smoothY * .8;
      camera.position.z = 18 - progress * .75;
      camera.rotation.z = Math.sin(progress * Math.PI * 3) * .014;
      camera.lookAt(0, -.05, 0);
      blue.position.x = -5.8 + smoothX * 4;
      blue.position.y = 1.2 - smoothY * 3;
      rose.position.x = 5.6 + smoothX * 4;
      rose.position.y = -1 + smoothY * 3;
      bloom.strength = .48 + Math.sin(time * .0007) * .055 + (1 - scatter) * .06;
      rgb.uniforms.amount.value = .0009 + Math.abs(smoothX) * .004 + (1 - scatter) * .0007;
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
      groups.forEach(({ root }) => scene.remove(root));
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
