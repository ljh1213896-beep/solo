'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { Project } from './projectData';

const clamp = (value:number,min=0,max=1)=>Math.min(max,Math.max(min,value));

export default function ProjectCarouselScene({ projects }:{ projects:Project[] }) {
  const hostRef=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const host=hostRef.current;
    if(!host)return;
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(43,1,.1,80);
    camera.position.set(0,0,7.2);
    const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.6));
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const stage=new THREE.Group();
    scene.add(stage);
    const baseGeometry=new THREE.PlaneGeometry(6.55,4.05,70,42);
    const coverGeometry=new THREE.PlaneGeometry(5.92,2.1,70,28);
    const cards:{root:THREE.Group;base:THREE.Mesh<THREE.PlaneGeometry,THREE.ShaderMaterial>;cover:THREE.Mesh<THREE.PlaneGeometry,THREE.ShaderMaterial>}[]=[];
    const textures:THREE.Texture[]=[];
    const videoTextures:THREE.VideoTexture[]=[];
    const videos:HTMLVideoElement[]=[];
    const loader=new THREE.TextureLoader();
    let disposed=false;

    const vertex=(halfWidth:string,halfHeight:string)=>`
      uniform float uTime;
      uniform float uBend;
      varying vec2 vUv;
      varying float vDome;
      void main(){
        vUv=uv;
        vec3 p=position;
        float nx=p.x/${halfWidth};
        float ny=p.y/${halfHeight};
        float dome=1.0-nx*nx;
        p.z+=dome*uBend;
        p.z-=ny*ny*.075;
        p.x+=nx*abs(nx)*uBend*.085;
        p.y+=sin(nx*3.14159+uTime*.34)*.012;
        vDome=dome;
        gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
      }
    `;

    projects.forEach((project,index)=>{
      const root=new THREE.Group();
      root.userData.index=index;
      stage.add(root);
      const baseUniforms={
        uTime:{value:0},uBend:{value:.42},uOpacity:{value:1},
        uVideo:{value:new THREE.Texture()},uVideoAspect:{value:16/9},uHasVideo:{value:0},
      };
      const baseMaterial=new THREE.ShaderMaterial({
        uniforms:baseUniforms,transparent:true,side:THREE.DoubleSide,
        vertexShader:vertex('3.275','2.025'),
        fragmentShader:`
          uniform float uOpacity;
          uniform sampler2D uVideo;
          uniform float uVideoAspect;
          uniform float uHasVideo;
          varying vec2 vUv;
          varying float vDome;
          void main(){
            float edge=smoothstep(.0,.08,vUv.x)*smoothstep(.0,.08,1.0-vUv.x)*smoothstep(.0,.08,vUv.y)*smoothstep(.0,.08,1.0-vUv.y);
            vec3 cool=vec3(.025,.032,.043);
            vec3 warm=vec3(.055,.025,.044);
            vec3 color=mix(cool,warm,vUv.x*.32)+vDome*.018;
            color+=vec3(.055,.09,.13)*(1.0-edge)*.32;
            if(uHasVideo>.5){
              vec2 uv=vUv;
              float planeAspect=1.617;
              if(uVideoAspect>planeAspect){float s=planeAspect/uVideoAspect;uv.x=(uv.x-.5)*s+.5;}
              else{float s=uVideoAspect/planeAspect;uv.y=(uv.y-.5)*s+.5;}
              vec3 movingImage=texture2D(uVideo,uv).rgb;
              movingImage*=.86+vDome*.1;
              color=mix(movingImage,color,.08);
            }
            gl_FragColor=vec4(color,uOpacity);
          }
        `,
      });
      const base=new THREE.Mesh(baseGeometry,baseMaterial);
      base.renderOrder=index*2;
      root.add(base);

      if(project.video){
        const video=document.createElement('video');
        video.src=project.video;
        video.muted=true;
        video.loop=true;
        video.autoplay=true;
        video.playsInline=true;
        video.preload='auto';
        const videoTexture=new THREE.VideoTexture(video);
        videoTexture.colorSpace=THREE.SRGBColorSpace;
        videoTexture.minFilter=THREE.LinearFilter;
        videoTexture.magFilter=THREE.LinearFilter;
        baseUniforms.uVideo.value=videoTexture;
        baseUniforms.uHasVideo.value=1;
        video.addEventListener('loadedmetadata',()=>{
          baseUniforms.uVideoAspect.value=video.videoWidth/Math.max(1,video.videoHeight);
        });
        video.play().catch(()=>undefined);
        videos.push(video);
        videoTextures.push(videoTexture);
      }

      const coverUniforms={uTexture:{value:new THREE.Texture()},uTime:{value:0},uBend:{value:.34},uImageAspect:{value:2.82},uOpacity:{value:1}};
      const coverMaterial=new THREE.ShaderMaterial({
        uniforms:coverUniforms,transparent:true,side:THREE.DoubleSide,
        vertexShader:vertex('2.96','1.05'),
        fragmentShader:`
          uniform sampler2D uTexture;
          uniform float uImageAspect;
          uniform float uOpacity;
          varying vec2 vUv;
          varying float vDome;
          void main(){
            vec2 uv=vUv;
            float planeAspect=2.819;
            if(uImageAspect>planeAspect){float s=planeAspect/uImageAspect;uv.x=(uv.x-.5)*s+.5;}
            else{float s=uImageAspect/planeAspect;uv.y=(uv.y-.5)*s+.5;}
            vec4 color=texture2D(uTexture,uv);
            color.rgb*=.9+vDome*.1;
            color.a*=uOpacity;
            gl_FragColor=color;
          }
        `,
      });
      const cover=new THREE.Mesh(coverGeometry,coverMaterial);
      cover.position.z=.22;
      cover.renderOrder=index*2+1;
      root.add(cover);
      cards.push({root,base,cover});

      const texture=loader.load(project.image,loaded=>{
        if(disposed)return;
        loaded.colorSpace=THREE.SRGBColorSpace;
        loaded.minFilter=THREE.LinearFilter;
        const source=loaded.image as HTMLImageElement;
        coverUniforms.uImageAspect.value=source.naturalWidth/Math.max(1,source.naturalHeight);
        coverUniforms.uTexture.value=loaded;
      });
      textures.push(texture);
    });

    let mouseX=0,mouseY=0,smoothX=0,smoothY=0,smoothProgress=0,frame=0;
    const pointer=(event:PointerEvent)=>{mouseX=event.clientX/Math.max(1,innerWidth)-.5;mouseY=event.clientY/Math.max(1,innerHeight)-.5;};
    const resize=()=>{
      const width=host.clientWidth,height=host.clientHeight;
      renderer.setSize(width,height,false);
      camera.aspect=width/Math.max(1,height);
      camera.position.z=camera.aspect<.8?15.2:7.2;
      camera.updateProjectionMatrix();
    };
    const animate=(time:number)=>{
      const gallery=document.getElementById('work');
      const progress=gallery?clamp((scrollY-gallery.offsetTop)/Math.max(1,gallery.offsetHeight-innerHeight)):0;
      const target=progress*(projects.length-1);
      smoothProgress+=(target-smoothProgress)*(reduce?1:.075);
      smoothX+=(mouseX-smoothX)*.04;
      smoothY+=(mouseY-smoothY)*.04;
      cards.forEach(({root,base,cover},index)=>{
        const rel=index-smoothProgress;
        const abs=Math.abs(rel);
        const side=Math.sign(rel);
        const angle=rel*.67;
        const radius=7.15;
        root.position.set(
          Math.sin(angle)*radius,
          Math.sin(angle*2)*.16-Math.min(abs*abs,4)*.055,
          (Math.cos(angle)-1)*radius*.9-abs*.08,
        );
        root.rotation.set(smoothY*(abs<.6?-.045:-.015),-angle*.78+smoothX*(abs<.6?.075:.02),side*Math.min(abs,1)*.032);
        root.scale.setScalar(Math.max(.5,1-abs*.105));
        root.visible=abs<2.75;
        const opacity=clamp(1-(abs-1.2)*.85,.12,1);
        base.material.uniforms.uTime.value=time*.001+index;
        cover.material.uniforms.uTime.value=time*.001+index;
        base.material.uniforms.uBend.value=.33+Math.max(0,1-abs)*.2;
        cover.material.uniforms.uBend.value=.27+Math.max(0,1-abs)*.16;
        base.material.uniforms.uOpacity.value=opacity;
        cover.material.uniforms.uOpacity.value=opacity;
      });
      stage.rotation.x=-.035-smoothY*.025;
      stage.rotation.z=smoothX*.012;
      camera.position.x=smoothX*.18;
      camera.position.y=-smoothY*.12;
      camera.lookAt(0,0,0);
      renderer.render(scene,camera);
      frame=requestAnimationFrame(animate);
    };
    resize();
    addEventListener('resize',resize);
    addEventListener('pointermove',pointer,{passive:true});
    frame=requestAnimationFrame(animate);
    return()=>{
      disposed=true;
      cancelAnimationFrame(frame);
      removeEventListener('resize',resize);
      removeEventListener('pointermove',pointer);
      textures.forEach(texture=>texture.dispose());
      videoTextures.forEach(texture=>texture.dispose());
      videos.forEach(video=>{video.pause();video.removeAttribute('src');video.load();});
      cards.forEach(({base,cover})=>{base.material.dispose();cover.material.dispose();});
      baseGeometry.dispose();coverGeometry.dispose();renderer.dispose();renderer.domElement.remove();
    };
  },[projects]);

  return <div className="project-carousel-webgl" ref={hostRef} aria-hidden="true" />;
}
