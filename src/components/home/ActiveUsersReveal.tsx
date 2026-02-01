import React from 'react';

const ActiveUsersReveal = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-8 min-h-[400px]">
      <style>{`
        .reveal-container {
          display: grid;
          gap: 3rem;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        .reveal-text {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 900;
          color: hsl(240 10% 40%);
          text-align: center;
          background: linear-gradient(hsl(240 10% 80%), hsl(240 10% 50%));
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .reveal-code {
          font-size: 3rem;
          display: flex;
          flex-wrap: nowrap;
          color: hsl(0 0% 100%);
          border-radius: 1rem;
          background: hsl(240 20% 10%); /* Slightly tinted dark background */
          justify-content: center;
          box-shadow: 0 1px hsl(0 0% 100% / 0.25) inset, 0 20px 40px -10px rgba(0,0,0,0.5);
          padding: 0;
          margin: 0;
          list-style: none;
          overflow: hidden;
        }

        .reveal-code:hover {
          cursor: grab;
        }

        .reveal-digit {
          display: flex;
          height: 100%;
          padding: 4rem 1rem;
          position: relative;
        }

        .reveal-digit:focus-visible {
          outline-color: hsl(0 0% 50% / 0.25);
          outline-offset: 1rem;
        }

        .reveal-digit span {
          scale: calc(var(--active, 0) + 0.5);
          filter: blur(calc((1 - var(--active, 0)) * 1rem));
          opacity: calc(var(--active, 0) + 0.2);
          transition: scale calc(((1 - var(--active, 0)) + 0.2) * 1s), filter calc(((1 - var(--active, 0)) + 0.2) * 1s), opacity calc(((1 - var(--active, 0)) + 0.2) * 1s);
          display: block;
          font-family: monospace;
          font-weight: 700;
        }

        /* Spacing for first/last to balance the look */
        .reveal-digit:first-of-type {
          padding-left: 3rem;
        }
        .reveal-digit:last-of-type {
          padding-right: 3rem;
        }

        /* Pre-calculated sin() values for lerp effect */
        :root {
          --lerp-0: 1;          /* sin(90deg) */
          --lerp-1: 0.766;      /* sin(50deg) */
          --lerp-2: 0.707;      /* sin(45deg) */
          --lerp-3: 0.573;      /* sin(35deg) */
          --lerp-4: 0.422;      /* sin(25deg) */
          --lerp-5: 0.258;      /* sin(15deg) */
        }

        /* Hover Interaction Logic */
        .reveal-digit:is(:hover, :focus-visible) {
          --active: var(--lerp-0);
        }
        .reveal-digit:is(:hover, :focus-visible) + .reveal-digit,
        .reveal-digit:has(+ .reveal-digit:is(:hover, :focus-visible)) {
          --active: var(--lerp-1);
        }
        .reveal-digit:is(:hover, :focus-visible) + .reveal-digit + .reveal-digit,
        .reveal-digit:has(+ .reveal-digit + .reveal-digit:is(:hover, :focus-visible)) {
          --active: var(--lerp-2);
        }
        .reveal-digit:is(:hover, :focus-visible) + .reveal-digit + .reveal-digit + .reveal-digit,
        .reveal-digit:has(+ .reveal-digit + .reveal-digit + .reveal-digit:is(:hover, :focus-visible)) {
          --active: var(--lerp-3);
        }
        
        /* Mobile fallback support - making sure it's somewhat visible on touch if tapped */
        .reveal-digit:active {
           --active: var(--lerp-0);
        }
      `}</style>

      <section className="reveal-container">
        <p className="reveal-text">Question Bank Size</p>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 opacity-60">
          Move to Reveal
        </p>
        <ul className="reveal-code">
          <li tabIndex={0} className="reveal-digit">
            <span>0</span>
          </li>
          <li tabIndex={0} className="reveal-digit">
            <span>1</span>
          </li>
          <li tabIndex={0} className="reveal-digit">
            <span>2</span>
          </li>
          <li tabIndex={0} className="reveal-digit">
            <span>0</span>
          </li>
          <li tabIndex={0} className="reveal-digit">
            <span>0</span>
          </li>
          <li tabIndex={0} className="reveal-digit">
            <span>0</span>
          </li>
        </ul>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
          Verified Questions
        </p>
      </section>
    </div>
  );
};

export default ActiveUsersReveal;
