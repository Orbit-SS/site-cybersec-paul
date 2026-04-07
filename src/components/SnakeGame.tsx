"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const COLS = 24;
const ROWS = 20;
const CELL = 20;
const WIDTH = COLS * CELL;
const HEIGHT = ROWS * CELL;
const TICK_MS = 120;

type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Point = { x: number; y: number };

function rndFood(snake: Point[]): Point {
  let f: Point;
  do {
    f = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some((s) => s.x === f.x && s.y === f.y));
  return f;
}

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    snake: [{ x: 12, y: 10 }] as Point[],
    dir: "RIGHT" as Dir,
    nextDir: "RIGHT" as Dir,
    food: { x: 18, y: 10 } as Point,
    score: 0,
    running: false,
    dead: false,
  });
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<"idle" | "running" | "dead">("idle");
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;

    // Background
    ctx.fillStyle = "#0a0f0a";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Grid dots
    ctx.fillStyle = "#14532d22";
    for (let x = 0; x < COLS; x++) {
      for (let y = 0; y < ROWS; y++) {
        ctx.fillRect(x * CELL + CELL / 2 - 1, y * CELL + CELL / 2 - 1, 2, 2);
      }
    }

    // Food — bright green pulse effect via solid square with glow
    const fx = s.food.x * CELL;
    const fy = s.food.y * CELL;
    ctx.shadowColor = "#4ade80";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#4ade80";
    ctx.fillRect(fx + 3, fy + 3, CELL - 6, CELL - 6);
    ctx.shadowBlur = 0;

    // Snake
    s.snake.forEach((seg, i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? "#86efac" : i % 2 === 0 ? "#16a34a" : "#15803d";
      if (isHead) {
        ctx.shadowColor = "#4ade80";
        ctx.shadowBlur = 8;
      }
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
      ctx.shadowBlur = 0;
    });
  }, []);

  const tick = useCallback(() => {
    const s = stateRef.current;
    if (!s.running) return;

    s.dir = s.nextDir;
    const head = s.snake[0];
    const next: Point = { x: head.x, y: head.y };

    if (s.dir === "UP") next.y -= 1;
    if (s.dir === "DOWN") next.y += 1;
    if (s.dir === "LEFT") next.x -= 1;
    if (s.dir === "RIGHT") next.x += 1;

    // Wall collision
    if (next.x < 0 || next.x >= COLS || next.y < 0 || next.y >= ROWS) {
      s.running = false;
      s.dead = true;
      setStatus("dead");
      draw();
      return;
    }

    // Self collision
    if (s.snake.some((seg) => seg.x === next.x && seg.y === next.y)) {
      s.running = false;
      s.dead = true;
      setStatus("dead");
      draw();
      return;
    }

    const ate = next.x === s.food.x && next.y === s.food.y;
    s.snake = [next, ...s.snake];
    if (ate) {
      s.score += 10;
      setScore(s.score);
      s.food = rndFood(s.snake);
    } else {
      s.snake.pop();
    }

    draw();
  }, [draw]);

  const start = useCallback(() => {
    const s = stateRef.current;
    s.snake = [{ x: 12, y: 10 }];
    s.dir = "RIGHT";
    s.nextDir = "RIGHT";
    s.food = { x: 18, y: 10 };
    s.score = 0;
    s.running = true;
    s.dead = false;
    setScore(0);
    setStatus("running");
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = setInterval(tick, TICK_MS);
    draw();
  }, [tick, draw]);

  useEffect(() => {
    draw();
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [draw]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const s = stateRef.current;
      const map: Record<string, Dir> = {
        ArrowUp: "UP", w: "UP", W: "UP",
        ArrowDown: "DOWN", s: "DOWN", S: "DOWN",
        ArrowLeft: "LEFT", a: "LEFT", A: "LEFT",
        ArrowRight: "RIGHT", d: "RIGHT", D: "RIGHT",
      };
      const newDir = map[e.key];
      if (!newDir) return;

      const opposite: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
      if (newDir !== opposite[s.dir]) {
        s.nextDir = newDir;
      }

      if (!s.running && !s.dead) {
        e.preventDefault();
        start();
      }

      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [start]);

  const handleDir = (dir: Dir) => {
    const s = stateRef.current;
    const opposite: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
    if (dir !== opposite[s.dir]) s.nextDir = dir;
    if (!s.running && !s.dead) start();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Score bar */}
      <div className="w-full max-w-[480px] flex items-center justify-between text-xs font-mono">
        <span className="text-green-600 uppercase tracking-widest">Score</span>
        <span className="text-green-400 text-lg font-bold tabular-nums">{score}</span>
      </div>

      {/* Canvas */}
      <div className="relative border border-green-900/50 rounded-lg overflow-hidden shadow-2xl shadow-green-950/50">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="block"
          style={{ imageRendering: "pixelated" }}
        />

        {/* Overlay */}
        {status !== "running" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0f0a]/80 backdrop-blur-sm">
            {status === "dead" && (
              <>
                <p className="text-red-400 font-bold text-xl mb-1 tracking-widest">GAME OVER</p>
                <p className="text-gray-500 text-xs mb-6">Score: {score}</p>
              </>
            )}
            {status === "idle" && (
              <p className="text-green-400 text-xs uppercase tracking-widest mb-6">
                Snake v1.0 — Ready
              </p>
            )}
            <button
              onClick={start}
              className="border border-green-600 text-green-400 text-sm px-6 py-2 rounded hover:bg-green-600/10 transition-colors font-mono"
            >
              {status === "dead" ? "[ RESTART ]" : "[ START ]"}
            </button>
            <p className="text-gray-700 text-xs mt-4">Arrow keys or WASD to move</p>
          </div>
        )}
      </div>

      {/* Mobile D-pad */}
      <div className="grid grid-cols-3 gap-1 mt-1 md:hidden">
        {[
          [null, { label: "▲", dir: "UP" as Dir }, null],
          [{ label: "◄", dir: "LEFT" as Dir }, { label: "▼", dir: "DOWN" as Dir }, { label: "►", dir: "RIGHT" as Dir }],
        ].map((row, ri) => (
          <div key={ri} className="contents">
            {row.map((btn, ci) =>
              btn ? (
                <button
                  key={ci}
                  onPointerDown={() => handleDir(btn.dir)}
                  className="w-10 h-10 flex items-center justify-center border border-green-900/50 rounded text-green-600 text-xs hover:border-green-600 hover:text-green-400 active:bg-green-600/10 transition-colors select-none"
                >
                  {btn.label}
                </button>
              ) : (
                <div key={ci} className="w-10 h-10" />
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
