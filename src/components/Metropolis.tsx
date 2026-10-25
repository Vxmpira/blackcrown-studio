import React from "react";

// The city behind every view: a perspective avenue grid, a skyline, and
// light packets running the avenues. Pure ambience, zero interaction,
// honors prefers-reduced-motion via CSS.
export const Metropolis: React.FC = () => (
  <div className="metro" aria-hidden="true">
    <div className="metro-grid" />
    <svg className="metro-avenues" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
      <path id="ave1" d="M-50 700 C 400 660, 1200 740, 1650 680" fill="none" />
      <path id="ave2" d="M-50 780 C 500 820, 1100 760, 1650 810" fill="none" />
      <path id="ave3" d="M200 920 C 300 600, 420 380, 520 -20" fill="none" />
      <path id="ave4" d="M1380 920 C 1300 620, 1220 360, 1150 -20" fill="none" />
      <g className="metro-trace">
        <use href="#ave1" />
        <use href="#ave2" />
        <use href="#ave3" />
        <use href="#ave4" />
      </g>
      <g className="metro-packets">
        <circle r="3.2" className="pk pk-cyan">
          <animateMotion dur="9s" repeatCount="indefinite" rotate="auto">
            <mpath href="#ave1" />
          </animateMotion>
        </circle>
        <circle r="2.6" className="pk pk-pink">
          <animateMotion dur="13s" begin="-5s" repeatCount="indefinite">
            <mpath href="#ave1" />
          </animateMotion>
        </circle>
        <circle r="3" className="pk pk-pink">
          <animateMotion dur="11s" begin="-2s" repeatCount="indefinite">
            <mpath href="#ave2" />
          </animateMotion>
        </circle>
        <circle r="2.4" className="pk pk-cyan">
          <animateMotion dur="15s" begin="-9s" repeatCount="indefinite">
            <mpath href="#ave2" />
          </animateMotion>
        </circle>
        <circle r="2.6" className="pk pk-cyan">
          <animateMotion dur="12s" begin="-4s" repeatCount="indefinite">
            <mpath href="#ave3" />
          </animateMotion>
        </circle>
        <circle r="2.6" className="pk pk-gold">
          <animateMotion dur="17s" begin="-11s" repeatCount="indefinite">
            <mpath href="#ave4" />
          </animateMotion>
        </circle>
      </g>
    </svg>
    <svg className="metro-skyline" viewBox="0 0 1600 220" preserveAspectRatio="xMidYMax slice">
      <path
        d="M0 220 L0 150 L60 150 L60 110 L95 110 L95 170 L150 170 L150 90 L165 90 L165 70 L205 70 L205 160 L260 160 L260 120 L320 120 L320 180 L380 180 L380 60 L395 60 L395 40 L430 40 L430 150 L500 150 L500 100 L560 100 L560 175 L640 175 L640 130 L700 130 L700 55 L715 55 L715 30 L755 30 L755 140 L820 140 L820 95 L880 95 L880 165 L950 165 L950 115 L1010 115 L1010 180 L1080 180 L1080 75 L1095 75 L1095 50 L1135 50 L1135 150 L1200 150 L1200 105 L1260 105 L1260 170 L1330 170 L1330 85 L1390 85 L1390 155 L1460 155 L1460 120 L1530 120 L1530 185 L1600 185 L1600 220 Z"
        className="sky-fill"
      />
      <g className="sky-lights">
        <rect x="166" y="78" width="4" height="4" />
        <rect x="388" y="48" width="4" height="4" />
        <rect x="708" y="38" width="4" height="4" />
        <rect x="1088" y="58" width="4" height="4" />
        <rect x="438" y="118" width="3" height="3" />
        <rect x="828" y="112" width="3" height="3" />
        <rect x="1268" y="122" width="3" height="3" />
        <rect x="585" y="128" width="3" height="3" />
      </g>
    </svg>
  </div>
);
