import React from "react";
import { motion } from "framer-motion";
import { cn } from "~/lib/utils";

const paths = [
  "M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875",
  "M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859",
  "M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843",
  "M-338 -237C-338 -237 -270 168 194 295C658 422 726 827 726 827",
  "M-324 -253C-324 -253 -256 152 208 279C672 406 740 811 740 811",
  "M-310 -269C-310 -269 -242 136 222 263C686 390 754 795 754 795",
  "M-296 -285C-296 -285 -228 120 236 247C700 374 768 779 768 779",
  "M-282 -301C-282 -301 -214 104 250 231C714 358 782 763 782 763",
  "M-268 -317C-268 -317 -200 88 264 215C728 342 796 747 796 747",
  "M-254 -333C-254 -333 -186 72 278 199C742 326 810 731 810 731",
  "M-240 -349C-240 -349 -172 56 292 183C756 310 824 715 824 715",
  "M-226 -365C-226 -365 -158 40 306 167C770 294 838 699 838 699",
  "M-212 -381C-212 -381 -144 24 320 151C784 278 852 683 852 683",
  "M-198 -397C-198 -397 -130 8 334 135C798 262 866 667 866 667",
  "M-184 -413C-184 -413 -116 -8 348 119C812 246 880 651 880 651",
  "M-170 -429C-170 -429 -102 -24 362 103C826 230 894 635 894 635",
  "M-156 -445C-156 -445 -88 -40 376 87C840 214 908 619 908 619",
  "M-142 -461C-142 -461 -74 -56 390 71C854 198 922 603 922 603",
  "M-128 -477C-128 -477 -60 -72 404 55C868 182 936 587 936 587",
  "M-114 -493C-114 -493 -46 -88 418 39C882 166 950 571 950 571",
  "M-100 -509C-100 -509 -32 -104 432 23C896 150 964 555 964 555",
  "M-86 -525C-86 -525 -18 -120 446 7C910 134 978 539 978 539",
  "M-72 -541C-72 -541 -4 -136 460 -9C924 118 992 523 992 523",
  "M-58 -557C-58 -557 10 -152 474 -25C938 102 1006 507 1006 507",
  "M-44 -573C-44 -573 24 -168 488 -41C952 86 1020 491 1020 491",
  "M-37 -581C-37 -581 31 -176 495 -49C959 78 1027 483 1027 483",
];

const updatedPaths = paths.join(" ");

export const BackgroundBeams = React.memo(
  ({ className }: { className?: string }) => {
    return (
      <div
        className={cn(
          "absolute inset-0 flex h-full w-full items-center justify-center [mask-repeat:no-repeat] [mask-size:40px]",
          className,
        )}
      >
        <svg
          className="pointer-events-none absolute z-0 h-full w-full"
          width="100%"
          height="100%"
          viewBox="0 0 696 316"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={updatedPaths}
            stroke="url(#paint0_radial_242_278)"
            strokeOpacity="0.05"
            strokeWidth="0.5"
          ></path>

          {paths.map((path, index) => (
            <motion.path
              key={`path-` + index}
              d={path}
              stroke={`url(#linearGradient-${index})`}
              strokeOpacity="0.4"
              strokeWidth="0.5"
            ></motion.path>
          ))}
          <defs>
            {paths.map((_path, index) => (
              <motion.linearGradient
                id={`linearGradient-${index}`}
                key={`gradient-${index}`}
                initial={{
                  x1: "0%",
                  x2: "0%",
                  y1: "0%",
                  y2: "0%",
                }}
                animate={{
                  x1: ["0%", "100%"],
                  x2: ["0%", "95%"],
                  y1: ["0%", "100%"],
                  y2: ["0%", `${93 + Math.random() * 8}%`],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: Math.random() * 10,
                }}
              >
                <stop stopColor="#808080" stopOpacity="0"></stop>
                <stop stopColor="#808080"></stop>
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"></stop>
              </motion.linearGradient>
            ))}

            <radialGradient
              id="paint0_radial_242_278"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(352 34) rotate(90) scale(555 1560.62)"
            >
              <stop offset="0.0666667" stopColor="var(--neutral-300)"></stop>
              <stop offset="0.243243" stopColor="var(--neutral-300)"></stop>
              <stop offset="0.43594" stopColor="white" stopOpacity="0"></stop>
            </radialGradient>
          </defs>
        </svg>
      </div>
    );
  },
);

BackgroundBeams.displayName = "BackgroundBeams";
