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

export default function LjhScene({ words }:{ words:string[] }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, .1, 120);
    camera.position.set(0, .4, 18);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    const isMobile = window.innerWidth < 760;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75));
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

    type GridKind = 'floor' | 'ceiling' | 'left' | 'right' | 'back';
    type WarpedGrid = {
      kind: GridKind;
      lines: THREE.LineSegments;
      geometry: THREE.BufferGeometry;
      material: THREE.LineBasicMaterial;
      positions: Float32Array;
      bases: Float32Array;
      phase: number;
      baseOpacity: number;
    };
    const gridRoom = new THREE.Group();
    const warpedGrids: WarpedGrid[] = [];
    const tunnelMinZ = -27;
    const tunnelMaxZ = 15;
    const tunnelLeft = -12.2;
    const tunnelRight = 12.2;
    const tunnelBottom = -5.35;
    const tunnelTop = 6.55;

    const makeWarpedGrid = (kind: GridKind, uCount: number, vCount: number, opacity: number, phase: number) => {
      const points: number[] = [];
      const pointAt = (u: number, v: number) => {
        const un = u / uCount;
        const vn = v / vCount;
        if (kind === 'floor') return [THREE.MathUtils.lerp(tunnelLeft, tunnelRight, un), tunnelBottom, THREE.MathUtils.lerp(tunnelMaxZ, tunnelMinZ, vn)];
        if (kind === 'ceiling') return [THREE.MathUtils.lerp(tunnelLeft, tunnelRight, un), tunnelTop, THREE.MathUtils.lerp(tunnelMaxZ, tunnelMinZ, vn)];
        if (kind === 'left') return [tunnelLeft, THREE.MathUtils.lerp(tunnelBottom, tunnelTop, un), THREE.MathUtils.lerp(tunnelMaxZ, tunnelMinZ, vn)];
        if (kind === 'right') return [tunnelRight, THREE.MathUtils.lerp(tunnelBottom, tunnelTop, un), THREE.MathUtils.lerp(tunnelMaxZ, tunnelMinZ, vn)];
        return [THREE.MathUtils.lerp(tunnelLeft, tunnelRight, un), THREE.MathUtils.lerp(tunnelBottom, tunnelTop, vn), tunnelMinZ];
      };
      const addSegment = (a: number[], b: number[]) => points.push(...a, ...b);
      for (let u = 0; u <= uCount; u++) {
        for (let v = 0; v < vCount; v++) addSegment(pointAt(u, v), pointAt(u, v + 1));
      }
      for (let v = 0; v <= vCount; v++) {
        for (let u = 0; u < uCount; u++) addSegment(pointAt(u, v), pointAt(u + 1, v));
      }
      const positions = new Float32Array(points);
      const bases = new Float32Array(points);
      const geometry = new THREE.BufferGeometry();
      const attribute = new THREE.BufferAttribute(positions, 3);
      attribute.setUsage(THREE.DynamicDrawUsage);
      geometry.setAttribute('position', attribute);
      const material = new THREE.LineBasicMaterial({
        color: 0x55677c,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const lines = new THREE.LineSegments(geometry, material);
      lines.renderOrder = -5;
      gridRoom.add(lines);
      warpedGrids.push({ kind, lines, geometry, material, positions, bases, phase, baseOpacity: opacity });
    };

    makeWarpedGrid('floor', 24, 42, .27, .2);
    makeWarpedGrid('ceiling', 24, 42, .14, 1.4);
    makeWarpedGrid('left', 13, 42, .205, 2.2);
    makeWarpedGrid('right', 13, 42, .205, 3.1);
    makeWarpedGrid('back', 24, 13, .17, 4.2);
    scene.add(gridRoom);

    type LetterGroup = {
      root: THREE.Group;
      wordMesh: THREE.Mesh<TextGeometry, THREE.MeshPhysicalMaterial>;
      focusMesh: THREE.Mesh<TextGeometry, THREE.MeshPhysicalMaterial>;
    };
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
      const wordSizes = [1.08, 1.68, 1.18];
      const makeGeometry = (text: string, size: number, depth: number) => {
        const geometry = new TextGeometry(text, { font, size, depth, curveSegments: 9, bevelEnabled: true, bevelThickness: .12, bevelSize: .075, bevelOffset: 0, bevelSegments: 5 });
        geometry.computeBoundingBox();
        const box = geometry.boundingBox;
        if (box) geometry.translate(-(box.max.x - box.min.x) / 2, -(box.max.y - box.min.y) / 2, -(box.max.z - box.min.z) / 2);
        geometries.push(geometry);
        return geometry;
      };
      const focusGeometries = chars.map(char => makeGeometry(char, 2.45, .72));
      const wordGeometries = words.map((word, i) => makeGeometry(word, wordSizes[i], .58));
      const count = 3;
      for (let i = 0; i < count; i++) {
        const group = new THREE.Group();
        const wordMesh = new THREE.Mesh(wordGeometries[i], makeMaterial(i * 2));
        const focusMesh = new THREE.Mesh(focusGeometries[i], makeMaterial(i * 2 + 1));
        wordMesh.castShadow = true;
        focusMesh.castShadow = true;
        focusMesh.visible = false;
        group.add(wordMesh, focusMesh);
        const initialT = .08 + i / count;
        group.position.copy(flightPath.getPoint(initialT));
        group.rotation.set(-.45 + initialT * 2.4, (initialT - .5) * 2.8, (initialT - .5) * .72);
        group.scale.setScalar(.72);
        group.userData.index = i;
        scene.add(group);
        groups.push({ root: group, wordMesh, focusMesh });
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
      const heroTravel = hero ? Math.max(1, hero.offsetHeight - window.innerHeight) : 1;
      const progress = hero ? clamp((window.scrollY - hero.offsetTop) / heroTravel) : 0;
      const profileProgress = hero ? clamp((window.scrollY - (hero.offsetTop + heroTravel)) / Math.max(1, window.innerHeight)) : 0;
      const profileRelease = profileProgress * profileProgress * (3 - 2 * profileProgress);
      smoothX += (mouseX - smoothX) * .045;
      smoothY += (mouseY - smoothY) * .045;
      const seconds = time * .001;
      const scatter = 1 - clamp((progress - .08) / .16);
      const gridMotion = reduce ? 0 : seconds;
      const gridSpacing = (tunnelMaxZ - tunnelMinZ) / 42;
      const gridPhase = (gridMotion * .34) % gridSpacing;
      const gridBreath = 1 + Math.sin(gridMotion * .22) * .008 + progress * .018;
      gridRoom.position.set(
        smoothX * -.5 - progress * .18,
        smoothY * .3,
        gridPhase - gridSpacing - progress * 1.2,
      );
      gridRoom.rotation.x = -.012 - smoothY * .018;
      gridRoom.rotation.y = smoothX * .025 + Math.sin(gridMotion * .12) * .004;
      gridRoom.scale.setScalar(gridBreath);
      warpedGrids.forEach((surface, surfaceIndex) => {
        const { positions, bases, kind, phase } = surface;
        for (let i = 0; i < positions.length; i += 3) {
          const bx = bases[i];
          const by = bases[i + 1];
          const bz = bases[i + 2];
          const coarse = Math.sin(bz * .34 + bx * .17 + by * .23 + phase + gridMotion * .38) * .115;
          const fine = Math.sin(bz * .91 - bx * .31 + by * .46 + phase * 1.7 - gridMotion * .21) * .045;
          const drift = coarse + fine;
          if (kind === 'floor' || kind === 'ceiling') {
            const direction = kind === 'floor' ? 1 : -1;
            positions[i] = bx + Math.sin(bz * .28 + phase + gridMotion * .16) * .045;
            positions[i + 1] = by + drift * direction;
            positions[i + 2] = bz;
          } else if (kind === 'left' || kind === 'right') {
            const direction = kind === 'left' ? 1 : -1;
            positions[i] = bx + drift * direction;
            positions[i + 1] = by + Math.sin(bz * .31 + by * .58 + phase - gridMotion * .17) * .05;
            positions[i + 2] = bz;
          } else {
            positions[i] = bx + Math.sin(by * .55 + phase + gridMotion * .14) * .045;
            positions[i + 1] = by + Math.sin(bx * .42 - phase - gridMotion * .12) * .045;
            positions[i + 2] = bz + drift * .7;
          }
        }
        (surface.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
        surface.material.opacity = surface.baseOpacity + Math.sin(gridMotion * .42 + surfaceIndex * .9) * .014 + (1 - scatter) * .022;
      });
      const focusCenters = [1 / 3, 2 / 3, 1];
      const targetPositions = [
        new THREE.Vector3(3.15, .55, 3.15),
        new THREE.Vector3(-2.7, .3, 3.45),
        new THREE.Vector3(0, 1.45, 3.2),
      ];
      const targetRotations = [
        new THREE.Euler(-.12, -.62, -.08),
        new THREE.Euler(.12, .54, .1),
        new THREE.Euler(-.08, -.42, .08),
      ];
      groups.forEach(({ root, wordMesh, focusMesh }, i) => {
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

        const wordOpacity = scatter * .97;
        wordMesh.material.opacity = wordOpacity;
        wordMesh.visible = wordOpacity > .015;
        const release = i === 2 ? profileRelease : 0;
        focusMesh.material.opacity = easedFocus * (1 - release);
        focusMesh.visible = easedFocus * (1 - release) > .015;
        if (i === 2 && release > 0) {
          root.rotation.y += release * 1.4;
          root.rotation.z -= release * .48;
          root.position.z += release * 3.2;
          root.scale.multiplyScalar(1 + release * .2);
        }
        root.visible = scatter > .015 || focus > .015;
      });
      camera.position.x = smoothX * 1.2;
      camera.position.y = .35 - smoothY * .8;
      camera.position.z = (isMobile ? 21.4 : 18) - progress * .75;
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
      scene.remove(gridRoom);
      warpedGrids.forEach(surface => {
        surface.geometry.dispose();
        surface.material.dispose();
      });
      environment.dispose();
      room.dispose();
      pmrem.dispose();
      composer.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [words]);

  return <div className="ljh-webgl" ref={hostRef} aria-hidden="true" />;
}
