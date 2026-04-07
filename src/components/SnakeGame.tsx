"use client";

import { useEffect, useRef, useState } from "react";

const COLS = 20;
const ROWS = 16;
const CELL = 24;
const W = COLS * CELL;
const H = ROWS * CELL;
const TICK = 130;

type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Pt = { x: number; y: number };
const OPP: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };

function randomFood(snake: Pt[]): Pt {
  let f: Pt;
  do { f = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }; }
  while (snake.some((s) => s.x === f.x && s.y === f.y));
  return f;
}

function dirToward(head: Pt, target: Pt, cur: Dir): Dir {
  const dx = target.x - head.x;
  const dy = target.y - head.y;
  const candidates: Dir[] =
    Math.abs(dx) >= Math.abs(dy)
      ? [dx > 0 ? "RIGHT" : "LEFT", dy > 0 ? "DOWN" : "UP"]
      : [dy > 0 ? "DOWN" : "UP", dx > 0 ? "RIGHT" : "LEFT"];
  return candidates.find((d) => d !== OPP[cur]) ?? cur;
}

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const snakeRef = useRef<Pt[]>([{ x: 10, y: 8 }]);
  const dirRef = useRef<Dir>("RIGHT");
  const nextDirRef = useRef<Dir>("RIGHT");
  const foodRef = useRef<Pt>({ x: 15, y: 8 });
  const hoverRef = useRef<Pt | null>(null);
  const flashRef = useRef<Pt | null>(null);

  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [dead, setDead] = useState(false);

  // ---------- draw ----------
  function draw() {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#0a0f0a";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(20,83,45,0.25)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, H); ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(W, y * CELL); ctx.stroke();
    }

    // Hover
    const hc = hoverRef.current;
    if (hc) {
      ctx.fillStyle = "rgba(74,222,128,0.08)";
      ctx.fillRect(hc.x * CELL, hc.y * CELL, CELL, CELL);
    }

    // Click flash
    const cf = flashRef.current;
    if (cf) {
      ctx.fillStyle = "rgba(74,222,128,0.25)";
      ctx.fillRect(cf.x * CELL, cf.y * CELL, CELL, CELL);
    }

    // Food
    ctx.shadowColor = "#4ade80";
    ctx.shadowBlur = 14;
    ctx.fillStyle = "#4ade80";
    const f = foodRef.current;
    ctx.fillRect(f.x * CELL + 5, f.y * CELL + 5, CELL - 10, CELL - 10);
    ctx.shadowBlur = 0;

    // Snake
    snakeRef.current.forEach((seg, i) => {
      if (i === 0) { ctx.shadowColor = "#4ade80"; ctx.shadowBlur = 8; }
      ctx.fillStyle = i === 0 ? "#86efac" : i % 2 === 0 ? "#16a34a" : "#15803d";
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
      ctx.shadowBlur = 0;
    });

    // Arrow on head
    const head = snakeRef.current[0];
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.save();
    ctx.translate(head.x * CELL + CELL / 2, head.y * CELL + CELL / 2);
    ctx.rotate({ RIGHT: 0, DOWN: Math.PI / 2, LEFT: Math.PI, UP: -Math.PI / 2 }[nextDirRef.current]);
    ctx.beginPath(); ctx.moveTo(6, 0); ctx.lineTo(-4, -4); ctx.lineTo(-4, 4); ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function stopLoop() {
    if (loopRef.current) { clearInterval(loopRef.current); loopRef.current = null; }
  }

  function startGame() {
    stopLoop();
    snakeRef.current = [{ x: 10, y: 8 }];
    dirRef.current = "RIGHT";
    nextDirRef.current = "RIGHT";
    foodRef.current = { x: 15, y: 8 };
    flashRef.current = null;
    setScore(0);
    setDead(false);
    setRunning(true);
    draw();

    loopRef.current = setInterval(() => {
      dirRef.current = nextDirRef.current;
      const head = snakeRef.current[0];
      const nx: Pt = { x: head.x, y: head.y };
      if (dirRef.current === "UP")    nx.y--;
      if (dirRef.current === "DOWN")  nx.y++;
      if (dirRef.current === "LEFT")  nx.x--;
      if (dirRef.current === "RIGHT") nx.x++;

      if (nx.x < 0 || nx.x >= COLS || nx.y < 0 || nx.y >= ROWS ||
          snakeRef.current.some((s) => s.x === nx.x && s.y === nx.y)) {
        stopLoop();
        setRunning(false);
        setDead(true);
        draw();
        return;
      }

      const ate = nx.x === foodRef.current.x && nx.y === foodRef.current.y;
      snakeRef.current = [nx, ...snakeRef.current];
      if (ate) {
        setScore((s) => s + 10);
        foodRef.current = randomFood(snakeRef.current);
      } else {
        snakeRef.current.pop();
      }
      draw();
    }, TICK);
  }

  function getCell(e: React.MouseEvent<HTMLCanvasElement>): Pt {
    const r = canvasRef.current!.getBoundingClientRect();
    return {
      x: Math.floor((e.clientX - r.left) * (W / r.width) / CELL),
      y: Math.floor((e.clientY - r.top)  * (H / r.height) / CELL),
    };
  }

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!loopRef.current) return;
    const cell = getCell(e);
    nextDirRef.current = dirToward(snakeRef.current[0], cell, dirRef.current);
    flashRef.current = cell;
    draw();
    setTimeout(() => { flashRef.current = null; draw(); }, 150);
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    hoverRef.current = getCell(e);
    draw();
  }

  useEffect(() => {
    draw();
    return stopLoop;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: "UP", w: "UP", W: "UP",
        ArrowDown: "DOWN", s: "DOWN", S: "DOWN",
        ArrowLeft: "LEFT", a: "LEFT", A: "LEFT",
        ArrowRight: "RIGHT", d: "RIGHT", D: "RIGHT",
      };
      const d = map[e.key];
      if (!d) return;
      if (e.key.startsWith("Arrow")) e.preventDefault();
      if (d !== OPP[dirRef.current]) nextDirRef.current = d;
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const dpad = (label: string, d: Dir) => (
    <button
      key={d}
      type="button"
      onPointerDown={() => { if (d !== OPP[dirRef.current]) nextDirRef.current = d; }}
      className="w-10 h-10 flex items-center justify-center border border-green-900/50 rounded text-green-600 text-xs hover:border-green-600 hover:text-green-400 active:bg-green-600/10 select-none touch-none"
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col items-center gap-3 font-mono">
      {/* Score + controls row */}
      <div className="flex items-center justify-between w-full" style={{ width: W }}>
        <div className="text-xs text-green-600 uppercase tracking-widest">
          Score <span className="text-green-400 font-bold text-base ml-2">{score}</span>
        </div>
        <div className="flex gap-2">
          {!running && (
            <button
              type="button"
              onClick={startGame}
              className="border border-green-600 text-green-400 text-xs px-4 py-1.5 rounded hover:bg-green-600/10 active:bg-green-600/20 transition-colors cursor-pointer"
            >
              {dead ? "[ RESTART ]" : "[ START ]"}
            </button>
          )}
          {running && (
            <span className="text-green-800 text-xs px-4 py-1.5">click grid to steer</span>
          )}
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { hoverRef.current = null; draw(); }}
        className="border border-green-900/50 rounded-lg shadow-2xl shadow-green-950/50 cursor-crosshair block"
      />

      {dead && (
        <p className="text-red-400 text-sm tracking-widest">GAME OVER — Score: {score}</p>
      )}
      {!running && !dead && (
        <p className="text-gray-700 text-xs">Click start, then click the grid to steer · Arrow keys / WASD also work</p>
      )}

      {/* Mobile d-pad */}
      <div className="grid grid-cols-3 gap-1 md:hidden">
        <div />{dpad("▲", "UP")}<div />
        {dpad("◄", "LEFT")}{dpad("▼", "DOWN")}{dpad("►", "RIGHT")}
      </div>
    </div>
  );
}
