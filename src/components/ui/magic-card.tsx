// "use client";

// import React, { HTMLAttributes, MouseEvent, useCallback, useEffect } from "react";
// import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

// import { cn } from "@/lib/utils";

// export interface MagicCardProps extends HTMLAttributes<HTMLDivElement> {
//   gradientSize?: number;
//   gradientColor?: string;
//   gradientOpacity?: number;
// }

// export function MagicCard({
//   children,
//   className,
//   gradientSize = 200,
//   gradientColor = "#262626",
//   gradientOpacity = 0.8,
// }: MagicCardProps) {
//   const mouseX = useMotionValue(-gradientSize);
//   const mouseY = useMotionValue(-gradientSize);

//   const handleMouseMove = useCallback(
//     (e: MouseEvent<HTMLDivElement>) => {
//       const { left, top } = e.currentTarget.getBoundingClientRect();
//       mouseX.set(e.clientX - left);
//       mouseY.set(e.clientY - top);
//     },
//     [mouseX, mouseY],
//   );

//   const handleMouseLeave = useCallback(() => {
//     mouseX.set(-gradientSize);
//     mouseY.set(-gradientSize);
//   }, [mouseX, mouseY, gradientSize]);

//   useEffect(() => {
//     mouseX.set(-gradientSize);
//     mouseY.set(-gradientSize);
//   }, [mouseX, mouseY, gradientSize]);

//   return (
//     <div
//       onMouseMove={handleMouseMove}
//       onMouseLeave={handleMouseLeave}
//       className={cn(
//         "group relative flex size-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900 border text-black dark:text-white",
//         className,
//       )}
//     >
//       <div className="relative z-10">{children}</div>
//       <motion.div
//         className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
//         style={{
//           background: useMotionTemplate`
//             radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px, ${gradientColor}, transparent 100%)
//           `,
//           opacity: gradientOpacity,
//         }}
//       />
//     </div>
//   );
// }

"use client";

import { cn } from "@/lib/utils";
import { CSSProperties, ReactElement, ReactNode, useEffect, useRef, useState } from "react";

interface MousePosition {
  x: number;
  y: number;
}

function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: globalThis.MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return mousePosition;
}

interface MagicContainerProps {
  children?: ReactNode;
  className?: any;
}

const MagicContainer = ({ children, className }: MagicContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition();
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const [boxes, setBoxes] = useState<Array<HTMLElement>>([]);

  useEffect(() => {
    init();
    containerRef.current &&
      setBoxes(Array.from(containerRef.current.children).map(el => el as HTMLElement));
  }, []);

  useEffect(() => {
    init();
    window.addEventListener("resize", init);

    return () => {
      window.removeEventListener("resize", init);
    };
  }, [setBoxes]);

  useEffect(() => {
    onMouseMove();
  }, [mousePosition]);

  const init = () => {
    if (containerRef.current) {
      containerSize.current.w = containerRef.current.offsetWidth;
      containerSize.current.h = containerRef.current.offsetHeight;
    }
  };

  const onMouseMove = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const { w, h } = containerSize.current;
      const x = mousePosition.x - rect.left;
      const y = mousePosition.y - rect.top;
      const inside = x < w && x > 0 && y < h && y > 0;

      mouse.current.x = x;
      mouse.current.y = y;
      boxes.forEach(box => {
        const boxX = -(box.getBoundingClientRect().left - rect.left) + mouse.current.x;
        const boxY = -(box.getBoundingClientRect().top - rect.top) + mouse.current.y;
        box.style.setProperty("--mouse-x", `${boxX}px`);
        box.style.setProperty("--mouse-y", `${boxY}px`);

        if (inside) {
          box.style.setProperty("--opacity", `1`);
        } else {
          box.style.setProperty("--opacity", `0`);
        }
      });
    }
  };

  return (
    <div className={cn("h-full w-full", className)} ref={containerRef}>
      {children}
    </div>
  );
};

interface MagicCardProps {
  /**
   * @default <div />
   * @type ReactElement
   * @description
   * The component to be rendered as the card
   * */
  as?: ReactElement;
  /**
   * @default ""
   * @type string
   * @description
   * The className of the card
   */
  className?: string;

  /**
   * @default ""
   * @type ReactNode
   * @description
   * The children of the card
   * */
  children?: ReactNode;

  /**
   * @default 600
   * @type number
   * @description
   * The size of the spotlight effect in pixels
   * */
  size?: number;

  /**
   * @default true
   * @type boolean
   * @description
   * Whether to show the spotlight
   * */
  spotlight?: boolean;

  /**
   * @default "rgba(255,255,255,0.03)"
   * @type string
   * @description
   * The color of the spotlight
   * */
  spotlightColor?: string;

  /**
   * @default true
   * @type boolean
   * @description
   * Whether to isolate the card which is being hovered
   * */
  isolated?: boolean;

  /**
   * @default "rgba(255,255,255,0.03)"
   * @type string
   * @description
   * The background of the card
   * */
  background?: string;

  [key: string]: any;
}

const MagicCard: React.FC<MagicCardProps> = ({
  className,
  children,
  size = 600,
  spotlight = true,
  borderColor = "hsl(0 0% 98%)",
  isolated = true,
  ...props
}) => {
  return (
    <div
      style={
        {
          "--mask-size": `${size}px`,
          "--border-color": `${borderColor}`,
        } as CSSProperties
      }
      className={cn(
        "relative z-0 h-full w-full rounded-2xl p-6",
        "bg-gray-300 dark:bg-gray-700",
        "bg-[radial-gradient(var(--mask-size)_circle_at_var(--mouse-x)_var(--mouse-y),var(--border-color),transparent_100%)]",
        className
      )}
      {...props}
    >
      {children}

      {/* Background */}
      <div className={"absolute inset-[1px] -z-20 rounded-2xl bg-white dark:bg-black/95"} />
    </div>
  );
};

export { MagicCard, MagicContainer };
