"use client";

import { useEffect, useRef, useState } from "react";

const COLS = 24;
const ROWS = 20;
const CELL = 20;
const W = COLS * CELL;
const H = ROWS * CELL;
const TICK = 120;

type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Pt = { x: number; y: number };
const OPP: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };

function randomFood(snake: Pt[]): Pt {
  let f: Pt;
  do { f = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }; }
  while (snake.some((s) => s.x === f.x && s.y === f.y));
  return f;
}

// Given a click cell and the snake head, pick the best direction to turn
function dirToward(head: Pt, target: Pt, current: Dir): Dir {
  const dx = target.x - head.x;
  const dy = target.y - head.y;
  // Prefer the axis with larger delta, fall back to the other
  const candidates: Dir[] = [];
  if (Math.abs(dx) >= Math.abs(dy)) {
    if (dx > 0) candidates.push("RIGHT"); else if (dx < 0) candidates.push("LEFT");
    if (dy > 0) candidates.push("DOWN");  else if (dy < 0) candidates.push("UP");
  } else {
    if (dy > 0) candidates.push("DOWN");  else if (dy < 0) candidates.push("UP");
    if (dx > 0) candidates.push("RIGHT"); else if (dx < 0) candidates.push("LEFT");
  }
  // Pick first candidate that isn't reversing
  for (const d of candidates) {
    if (d !== OPP[current]) return d;
  }
  return current;
}

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const snake = useRef<Pt[]>([{ x: 12, y: 10 }]);
  const dir = useRef<Dir>("RIGHT");
  const nextDir = useRef<Dir>("RIGHT");
  const food = useRef<Pt>({ x: 18, y: 10 });
  const hoverCell = useRef<Pt | null>(null);
  const clickFlash = useRef<Pt | null>(null);

  const [phase, setPhase] = useState<"idle" | "running" | "dead">("idle");
  const [score, setScore] = useState(0);

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#0a0f0a";
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = "rgba(20,83,45,0.18)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, H); ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(W, y * CELL); ctx.stroke();
    }

    // Hover cell highlight
    const hc = hoverCell.current;
    if (hc) {
      ctx.fillStyle = "rgba(74,222,128,0.07)";
      ctx.fillRect(hc.x * CELL, hc.y * CELL, CELL, CELL);
    }

    // Click flash highlight
    const cf = clickFlash.current;
    if (cf) {
      ctx.fillStyle = "rgba(74,222,128,0.22)";
      ctx.fillRect(cf.x * CELL, cf.y * CELL, CELL, CELL);
    }

    // Food
    const f = food.current;
    ctx.shadowColor = "#4ade80";
    ctx.shadowBlur = 14;
    ctx.fillStyle = "#4ade80";
    ctx.fillRect(f.x * CELL + 4, f.y * CELL + 4, CELL - 8, CELL - 8);
    ctx.shadowBlur = 0;

    // Snake
    snake.current.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? "#86efac" : i % 2 === 0 ? "#16a34a" : "#15803d";
      if (i === 0) { ctx.shadowColor = "#4ade80"; ctx.shadowBlur = 8; }
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
      ctx.shadowBlur = 0;
    });

    // Draw a subtle arrow on head showing next direction
    const head = snake.current[0];
    ctx.fillStyle = "rgba(10,15,10,0.6)";
    ctx.save();
    ctx.translate(head.x * CELL + CELL / 2, head.y * CELL + CELL / 2);
    const rot = { RIGHT: 0, DOWN: Math.PI / 2, LEFT: Math.PI, UP: -Math.PI / 2 };
    ctx.rotate(rot[nextDir.current]);
    ctx.beginPath();
    ctx.moveTo(5, 0); ctx.lineTo(-3, -3); ctx.lineTo(-3, 3); ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function stopLoop() {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function startGame() {
    stopLoop();
    snake.current = [{ x: 12, y: 10 }];
    dir.current = "RIGHT";
    nextDir.current = "RIGHT";
    food.current = { x: 18, y: 10 };
    clickFlash.current = null;
    setScore(0);
    setPhase("running");
    draw();

    intervalRef.current = setInterval(() => {
      dir.current = nextDir.current;
      const head = snake.current[0];
      const nx: Pt = { x: head.x, y: head.y };
      if (dir.current === "UP")    nx.y -= 1;
      if (dir.current === "DOWN")  nx.y += 1;
      if (dir.current === "LEFT")  nx.x -= 1;
      if (dir.current === "RIGHT") nx.x += 1;

      if (
        nx.x < 0 || nx.x >= COLS || nx.y < 0 || nx.y >= ROWS ||
        snake.current.some((s) => s.x === nx.x && s.y === nx.y)
      ) {
        stopLoop();
        setPhase("dead");
        draw();
        return;
      }

      const ate = nx.x === food.current.x && nx.y === food.current.y;
      snake.current = [nx, ...snake.current];
      if (ate) {
        setScore((s) => s + 10);
        food.current = randomFood(snake.current);
      } else {
        snake.current.pop();
      }
      draw();
    }, TICK);
  }

  function getCellFromEvent(e: React.MouseEvent<HTMLCanvasElement>): Pt {
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    return {
      x: Math.floor((e.clientX - rect.left) * scaleX / CELL),
      y: Math.floor((e.clientY - rect.top)  * scaleY / CELL),
    };
  }

  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (intervalRef.current === null) { startGame(); return; }
    const cell = getCellFromEvent(e);
    const head = snake.current[0];
    const d = dirToward(head, cell, dir.current);
    nextDir.current = d;

    // Brief flash on clicked cell
    clickFlash.current = cell;
    draw();
    setTimeout(() => { clickFlash.current = null; draw(); }, 150);
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const cell = getCellFromEvent(e);
    hoverCell.current = cell;
    draw();
  }

  function handleMouseLeave() {
    hoverCell.current = null;
    draw();
  }

  useEffect(() => {
    draw();
    return stopLoop;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: "UP", w: "UP", W: "UP",
        ArrowDown: "DOWN", s: "DOWN", S: "DOWN",
        ArrowLeft: "LEFT", a: "LEFT", A: "LEFT",
        ArrowRight: "RIGHT", d: "RIGHT", D: "RIGHT",
      };
      const d = map[e.key];
      if (!d) return;
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault();
      if (d !== OPP[dir.current]) nextDir.current = d;
      if (intervalRef.current === null) startGame();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function steer(d: Dir) {
    if (d !== OPP[dir.current]) nextDir.current = d;
    if (intervalRef.current === null) startGame();
  }

  const btnCls = "w-10 h-10 flex items-center justify-center border border-green-900/50 rounded text-green-600 text-xs hover:border-green-600 hover:text-green-400 active:bg-green-600/10 transition-colors select-none touch-none";

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Score */}
      <div className="w-full max-w-[480px] flex items-center justify-between text-xs font-mono">
        <span className="text-green-600 uppercase tracking-widest">Score</span>
        <span className="text-green-400 text-lg font-bold tabular-nums">{score}</span>
      </div>

      {/* Canvas */}
      <div className="relative border border-green-900/50 rounded-lg overflow-hidden shadow-2xl shadow-green-950/50">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="block cursor-crosshair"
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />

        {phase !== "running" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0f0a]/85 backdrop-blur-sm">
            {phase === "dead" && (
              <>
                <p className="text-red-400 font-bold text-xl mb-1 tracking-widest">GAME OVER</p>
                <p className="text-gray-500 text-xs mb-6">Score: {score}</p>
              </>
            )}
            {phase === "idle" && (
              <p className="text-green-400 text-xs uppercase tracking-widest mb-6">Snake v1.0</p>
            )}
            <button
              onClick={startGame}
              className="border border-green-600 text-green-400 text-sm px-6 py-2 rounded hover:bg-green-600/10 transition-colors font-mono cursor-pointer"
            >
              {phase === "dead" ? "[ RESTART ]" : "[ START ]"}
            </button>
            <p className="text-gray-500 text-xs mt-3">Click the grid to steer · Arrow keys or WASD also work</p>
          </div>
        )}
      </div>

      {/* Mobile D-pad */}
      <div className="grid grid-cols-3 gap-1 mt-1 md:hidden">
        <div /><button className={btnCls} onPointerDown={() => steer("UP")}>▲</button><div />
        <button className={btnCls} onPointerDown={() => steer("LEFT")}>◄</button>
        <button className={btnCls} onPointerDown={() => steer("DOWN")}>▼</button>
        <button className={btnCls} onPointerDown={() => steer("RIGHT")}>►</button>
      </div>
    </div>
  );
}
