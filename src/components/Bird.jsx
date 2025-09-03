import React, { useEffect, useRef, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Bird() {
  const group = useRef();
  const { scene, animations } = useGLTF("/assets/phoenix_bird.glb");
  const { actions, mixer } = useAnimations(animations, group);

  const [scrollY, setScrollY] = useState(0);

  // ✅ Define scroll keyframes (scrollY in px → position/rotation)
  const keyframes = [
    { scroll: 0, position: { x: -4, y: 3, z: -3 }, rotation: { x: 0, y: 0, z: 0 } },
    { scroll: 300, position: { x: 5, y: -3, z: -3 }, rotation: { x: 0, y: Math.PI / 1, z: 0 } },
    { scroll: 600, position: { x: 4, y: -7, z: -10 }, rotation: { x: 0, y: Math.PI / 2, z: 0 } },
    { scroll: 1000, position: { x: -2, y: -4, z: -15 }, rotation: { x: 0, y: Math.PI, z: 0 } },
  ];

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!group.current || !scene) return;
    group.current.add(scene);

    return () => {
      if (group.current && scene) {
        group.current.remove(scene);
      }
    };
  }, [scene]);

  useEffect(() => {
    const action = actions?.["Take 001"];
    if (action) {
      action.reset().fadeIn(0.25).setLoop(THREE.LoopRepeat, Infinity).play();
      action.timeScale = 0.4;
    }
    return () => {
      action?.fadeOut(0.2).stop();
    };
  }, [actions]);

  useFrame((_, delta) => {
    mixer?.update(delta);

    if (group.current) {
      // Find which 2 keyframes we are between
      let current = keyframes[0];
      let next = keyframes[keyframes.length - 1];

      for (let i = 0; i < keyframes.length - 1; i++) {
        if (scrollY >= keyframes[i].scroll && scrollY <= keyframes[i + 1].scroll) {
          current = keyframes[i];
          next = keyframes[i + 1];
          break;
        }
      }

      // Normalize t (0 → 1) between current and next keyframe
      const t = (scrollY - current.scroll) / (next.scroll - current.scroll);

      // Interpolate position
      const x = THREE.MathUtils.lerp(current.position.x, next.position.x, t);
      const y = THREE.MathUtils.lerp(current.position.y, next.position.y, t);
      const z = THREE.MathUtils.lerp(current.position.z, next.position.z, t);

      // Interpolate rotation
      const rotX = THREE.MathUtils.lerp(current.rotation.x, next.rotation.x, t);
      const rotY = THREE.MathUtils.lerp(current.rotation.y, next.rotation.y, t);
      const rotZ = THREE.MathUtils.lerp(current.rotation.z, next.rotation.z, t);

      group.current.position.set(x, y, z);
      group.current.rotation.set(rotX, rotY, rotZ);
    }
  });

  return <group ref={group} scale={[0.005, 0.005, 0.005]} />;
}

useGLTF.preload("/assets/phoenix_bird.glb");
