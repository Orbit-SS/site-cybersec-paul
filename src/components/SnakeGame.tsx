"use client";

import { useEffect, useRef, useState } from "react";

const COLS = 24;
const ROWS = 20;
const CELL = 20;
const WIDTH = COLS * CELL;
const HEIGHT = ROWS * CELL;
const TICK_MS = 120;

type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Point = { x: number; y: number };
const OPPOSITE: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };

function rndFood(snake: Point[]): Point {
  let f: Point;
  do {
    f = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some((s) => s.x === f.x && s.y === f.y));
  return f;
}

function initState() {
  return {
    snake: [{ x: 12, y: 10 }] as Point[],
    dir: "RIGHT" as Dir,
    nextDir: "RIGHT" as Dir,
    food: { x: 18, y: 10 } as Point,
    score: 0,
  };
}

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef(initState());
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<"idle" | "running" | "dead">("idle");
  // Keep a ref in sync so the interval closure can read it
  const statusRef = useRef<"idle" | "running" | "dead">("idle");

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const g = gameRef.current;

    ctx.fillStyle = "#0a0f0a";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Subtle grid
    ctx.fillStyle = "rgba(20,83,45,0.15)";
    for (let x = 0; x < COLS; x++)
      for (let y = 0; y < ROWS; y++)
        ctx.fillRect(x * CELL + CELL / 2 - 1, y * CELL + CELL / 2 - 1, 2, 2);

    // Food
    ctx.shadowColor = "#4ade80";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#4ade80";
    ctx.fillRect(g.food.x * CELL + 4, g.food.y * CELL + 4, CELL - 8, CELL - 8);
    ctx.shadowBlur = 0;

    // Snake
    g.snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? "#86efac" : i % 2 === 0 ? "#16a34a" : "#15803d";
      if (i === 0) { ctx.shadowColor = "#4ade80"; ctx.shadowBlur = 8; }
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
      ctx.shadowBlur = 0;
    });
  }

  // Draw once on mount
  useEffect(() => { draw(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Game loop — restarts whenever status flips to "running"
  useEffect(() => {
    statusRef.current = status;
    if (status !== "running") return;

    const interval = setInterval(() => {
      if (statusRef.current !== "running") return;
      const g = gameRef.current;
      g.dir = g.nextDir;

      const head = g.snake[0];
      const next: Point = { x: head.x, y: head.y };
      if (g.dir === "UP")    next.y -= 1;
      if (g.dir === "DOWN")  next.y += 1;
      if (g.dir === "LEFT")  next.x -= 1;
      if (g.dir === "RIGHT") next.x += 1;

      // Collisions
      if (
        next.x < 0 || next.x >= COLS ||
        next.y < 0 || next.y >= ROWS ||
        g.snake.some((s) => s.x === next.x && s.y === next.y)
      ) {
        statusRef.current = "dead";
        setStatus("dead");
        draw();
        return;
      }

      const ate = next.x === g.food.x && next.y === g.food.y;
      g.snake = [next, ...g.snake];
      if (ate) {
        g.score += 10;
        setScore(g.score);
        g.food = rndFood(g.snake);
      } else {
        g.snake.pop();
      }
      draw();
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const dirMap: Record<string, Dir> = {
        ArrowUp: "UP", w: "UP", W: "UP",
        ArrowDown: "DOWN", s: "DOWN", S: "DOWN",
        ArrowLeft: "LEFT", a: "LEFT", A: "LEFT",
        ArrowRight: "RIGHT", d: "RIGHT", D: "RIGHT",
      };
      const newDir = dirMap[e.key];
      if (!newDir) return;
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault();

      const g = gameRef.current;
      if (newDir !== OPPOSITE[g.dir]) g.nextDir = newDir;

      if (statusRef.current !== "running") startGame();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function startGame() {
    gameRef.current = initState();
    setScore(0);
    setStatus("running");
  }

  function steer(dir: Dir) {
    const g = gameRef.current;
    if (dir !== OPPOSITE[g.dir]) g.nextDir = dir;
    if (statusRef.current !== "running") startGame();
  }

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
          width={WIDTH}
          height={HEIGHT}
          className="block"
          style={{ imageRendering: "pixelated" }}
        />

        {status !== "running" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0f0a]/85 backdrop-blur-sm">
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
              onClick={startGame}
              className="border border-green-600 text-green-400 text-sm px-6 py-2 rounded hover:bg-green-600/10 transition-colors font-mono cursor-pointer"
            >
              {status === "dead" ? "[ RESTART ]" : "[ START ]"}
            </button>
            <p className="text-gray-700 text-xs mt-4">Arrow keys or WASD to move</p>
          </div>
        )}
      </div>

      {/* Mobile D-pad */}
      <div className="grid grid-cols-3 gap-1 mt-1 md:hidden">
        <div />
        <button onPointerDown={() => steer("UP")}   className="w-10 h-10 flex items-center justify-center border border-green-900/50 rounded text-green-600 text-xs hover:border-green-600 hover:text-green-400 active:bg-green-600/10 transition-colors select-none">▲</button>
        <div />
        <button onPointerDown={() => steer("LEFT")} className="w-10 h-10 flex items-center justify-center border border-green-900/50 rounded text-green-600 text-xs hover:border-green-600 hover:text-green-400 active:bg-green-600/10 transition-colors select-none">◄</button>
        <button onPointerDown={() => steer("DOWN")} className="w-10 h-10 flex items-center justify-center border border-green-900/50 rounded text-green-600 text-xs hover:border-green-600 hover:text-green-400 active:bg-green-600/10 transition-colors select-none">▼</button>
        <button onPointerDown={() => steer("RIGHT")}className="w-10 h-10 flex items-center justify-center border border-green-900/50 rounded text-green-600 text-xs hover:border-green-600 hover:text-green-400 active:bg-green-600/10 transition-colors select-none">►</button>
      </div>
    </div>
  );
}
