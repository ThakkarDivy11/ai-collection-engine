import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const CircleGrid: React.FC = () => {
  const stageRef = useRef<SVGSVGElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const isActiveRef = useRef(true);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    // Clear any existing content
    stage.innerHTML = `
      <mask id="cgm">
        <rect width="10" height="10" fill="#fff"/>
      </mask>
      <g class="cg-col">
        <g class="cg-box" mask="url(#cgm)">
          <circle cx="5" cy="5" r="5"/>
        </g>
      </g>
    `;

    const col = stage.querySelector(".cg-col") as SVGGElement;
    const box = stage.querySelector(".cg-box") as SVGGElement;

    // Clone 9 more boxes in the initial column
    for (let i = 0; i < 9; i++) {
      const b = box.cloneNode(true) as SVGGElement;
      col.append(b);
    }
    gsap.set(".cg-box", { y: (i: number) => i * 10 });

    // Clone columns
    for (let i = 0; i <= 9; i++) {
      const c = col.cloneNode(true) as SVGGElement;
      gsap.set(c, { x: 10 * i, attr: { class: `cg-col cg-col${i}` } });
      c.querySelectorAll(".cg-box").forEach((el) => {
        el.setAttribute("class", `cg-box${i}`);
      });
      stage.append(c);
    }
    col.remove();

    const tl = gsap.timeline();

    tl.to(".cg-col", {
      duration: 1.5,
      y: 11,
      ease: "sine.inOut",
      stagger: {
        amount: 3,
        repeat: -1,
        yoyo: true,
      },
    }, 0);

    for (let i = 0; i <= 9; i++) {
      tl.add(
        gsap.fromTo(
          `.cg-box${i} *`,
          {
            y: (j: number) => gsap.utils.interpolate(77, -77, j / 10),
            transformOrigin: "50%",
            scale: 0.133,
          },
          {
            y: (j: number) => gsap.utils.interpolate(i, -i, j / 10),
            scale: 0.8,
            duration: 1,
            ease: "sine",
            repeat: -1,
            yoyo: true,
            yoyoEase: "sine.in",
          }
        ),
        i / 10
      );
    }

    tl.play(50);
    tlRef.current = tl;
    isActiveRef.current = true;

    return () => {
      tl.kill();
    };
  }, []);

  const handleClick = () => {
    const tl = tlRef.current;
    const stage = stageRef.current;
    if (!tl || !stage) return;
    const nowActive = isActiveRef.current;
    gsap.to(stage, { fill: nowActive ? "#ccc" : "#376b8b" });
    gsap.to(tl, { timeScale: nowActive ? 0 : 1 });
    isActiveRef.current = !nowActive;
  };

  return (
    <svg
      ref={stageRef}
      viewBox="0 0 98 108"
      onClick={handleClick}
      className="w-full h-full cursor-pointer"
      fill="#376b8b"
      style={{ overflow: "hidden" }}
    />
  );
};

export default CircleGrid;
