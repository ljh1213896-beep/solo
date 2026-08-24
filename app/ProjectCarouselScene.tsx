'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { Project } from './projectData';

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export default function ProjectCarouselScene({ projects }: { projects:Project[] }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(43, 1, .1, 80);
    camera.position.set(0, 0, 7.2);
    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true, powerPreference:'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);
    const geometry = new THREE.PlaneGeometry(6.55, 4.05, 70, 42);
    const meshes: THREE.Mesh<THREE.PlaneGeometry,THREE.ShaderMaterial>[] = [];
    const textures: THREE.Texture[] = [];
    const loader = new THREE.TextureLoader();
    let disposed = false;

    projects.forEach((project, index) => {
      const uniforms = {
        uTexture:{ value:new THREE.Texture() },
        uTime:{ value:0 },
        uBend:{ value:.42 },
        uImageAspect:{ value:1.65 },
        uOpacity:{ value:1 },
      };
      const material = new THREE.ShaderMaterial({
        uniforms,
        transparent:true,
        side:THREE.DoubleSide,
        vertexShader:`
          uniform float uTime;
          uniform float uBend;
          varying vec2 vUv;
          varying float vDome;
          void main(){
            vUv=uv;
            vec3 p=position;
            float nx=p.x/3.275;
            float ny=p.y/2.025;
            float dome=1.0-nx*nx;
            p.z+=dome*uBend;
            p.z-=ny*ny*.08;
            p.x+=nx*abs(nx)*uBend*.09;
            p.y+=sin(nx*3.14159+uTime*.34)*.014;
            vDome=dome;
            gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
          }
        `,
        fragmentShader:`
          uniform sampler2D uTexture;
          uniform float uImageAspect;
          uniform float uOpacity;
          varying vec2 vUv;
          varying float vDome;
          void main(){
            vec2 uv=vUv;
            float planeAspect=1.617;
            if(uImageAspect>planeAspect){float s=planeAspect/uImageAspect;uv.x=(uv.x-.5)*s+.5;}
            else{float s=uImageAspect/planeAspect;uv.y=(uv.y-.5)*s+.5;}
            vec4 color=texture2D(uTexture,uv);
            color.rgb*=.8+vDome*.22;
            color.a*=uOpacity;
            gl_FragColor=color;
          }
        `,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.renderOrder = projects.length - index;
      mesh.userData.index = index;
      group.add(mesh);
      meshes.push(mesh);
      const texture = loader.load(project.image, loaded => {
        if (disposed) return;
        loaded.colorSpace = THREE.SRGBColorSpace;
        loaded.minFilter = THREE.LinearFilter;
        const source = loaded.image as HTMLImageElement;
        uniforms.uImageAspect.value = source.naturalWidth / Math.max(1, source.naturalHeight);
        uniforms.uTexture.value = loaded;
      });
      textures.push(texture);
    });

    let mouseX = 0;
    let mouseY = 0;
    let smoothX = 0;
    let smoothY = 0;
    let smoothProgress = 0;
    let frame = 0;
    const pointer = (event: PointerEvent) => {
      mouseX = event.clientX / Math.max(1, window.innerWidth) - .5;
      mouseY = event.clientY / Math.max(1, window.innerHeight) - .5;
    };
    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      renderer.setSize(width,height,false);
      camera.aspect = width / Math.max(1,height);
      camera.position.z = camera.aspect < .8 ? 15.2 : 7.2;
      camera.updateProjectionMatrix();
    };
    const animate = (time:number) => {
      const gallery = document.getElementById('work');
      let progress = 0;
      if (gallery) progress = clamp((window.scrollY-gallery.offsetTop)/Math.max(1,gallery.offsetHeight-window.innerHeight));
      const target = progress*(projects.length-1);
      smoothProgress += (target-smoothProgress)*(reduce?1:.075);
      smoothX += (mouseX-smoothX)*.04;
      smoothY += (mouseY-smoothY)*.04;
      meshes.forEach((mesh,index) => {
        const rel = index-smoothProgress;
        const abs = Math.abs(rel);
        const side = Math.sign(rel);
        mesh.position.x = rel*5.25;
        mesh.position.y = Math.sin(rel*.72)*.12 - abs*.07;
        mesh.position.z = -abs*2.05 - Math.min(abs,1)*.18;
        mesh.rotation.y = -rel*.42 + smoothX*(abs<.6?.075:.02);
        mesh.rotation.x = smoothY*(abs<.6?-.045:-.015);
        mesh.rotation.z = side*Math.min(abs,1)*.025;
        const scale = Math.max(.48,1-abs*.115);
        mesh.scale.setScalar(scale);
        mesh.visible = abs<2.25;
        mesh.material.uniforms.uTime.value=time*.001+index;
        mesh.material.uniforms.uBend.value=.34+Math.max(0,1-abs)*.19;
        mesh.material.uniforms.uOpacity.value=clamp(1-(abs-1.2)*.85,.12,1);
      });
      camera.position.x = smoothX*.18;
      camera.position.y = -smoothY*.12;
      camera.lookAt(0,0,0);
      renderer.render(scene,camera);
      frame=requestAnimationFrame(animate);
    };
    resize();
    window.addEventListener('resize',resize);
    window.addEventListener('pointermove',pointer,{passive:true});
    frame=requestAnimationFrame(animate);
    return()=>{
      disposed=true;
      cancelAnimationFrame(frame);
      window.removeEventListener('resize',resize);
      window.removeEventListener('pointermove',pointer);
      textures.forEach(texture=>texture.dispose());
      meshes.forEach(mesh=>mesh.material.dispose());
      geometry.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  },[projects]);

  return <div className="project-carousel-webgl" ref={hostRef} aria-hidden="true" />;
}
