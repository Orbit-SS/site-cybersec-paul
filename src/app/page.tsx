import SnakeGame from "@/components/SnakeGame";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0f0a] text-gray-100 font-mono">
      {/* Nav */}
      <nav className="border-b border-green-900/40 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0a0f0a]/95 backdrop-blur z-50">
        <div className="flex items-center gap-2">
          <span className="text-green-400 text-xl font-bold tracking-widest">HYDRA</span>
          <span className="text-green-700 text-xs border border-green-800 px-1.5 py-0.5 rounded">LEARN</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#modules" className="hover:text-green-400 transition-colors">Modules</a>
          <a href="#commands" className="hover:text-green-400 transition-colors">Commands</a>
          <a href="#protocols" className="hover:text-green-400 transition-colors">Protocols</a>
          <a href="#cta" className="hover:text-green-400 transition-colors">Get Started</a>
        </div>
        <a
          href="#cta"
          className="text-xs border border-green-600 text-green-400 px-4 py-2 rounded hover:bg-green-600/10 transition-colors"
        >
          Start Learning
        </a>
      </nav>

      {/* Hero */}
      <section className="relative px-6 pt-24 pb-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#14532d22_0%,_transparent_70%)]" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs text-green-500 border border-green-800 bg-green-950/30 px-3 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Authorized Learning Environment · Ethical Use Only
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="text-white">Hello</span>{" "}
            <span className="text-green-400">Paul</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-4 leading-relaxed">
            The industry-standard network login auditing tool. Learn how security professionals
            test authentication systems through structured, hands-on curriculum.
          </p>
          <p className="text-xs text-gray-600 max-w-xl mx-auto mb-10">
            All exercises are performed in controlled lab environments. This course is designed for
            penetration testers, CTF competitors, and security researchers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#modules"
              className="bg-green-600 hover:bg-green-500 text-black font-bold px-8 py-3 rounded transition-colors text-sm"
            >
              View Curriculum
            </a>
            <a
              href="#commands"
              className="border border-green-800 hover:border-green-600 text-green-400 px-8 py-3 rounded transition-colors text-sm"
            >
              Quick Reference
            </a>
          </div>
        </div>

        {/* Terminal mockup */}
        <div className="relative max-w-3xl mx-auto mt-20">
          <div className="bg-[#0d1117] border border-green-900/50 rounded-lg overflow-hidden shadow-2xl shadow-green-950/50 text-left">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-green-900/30 bg-[#080d08]">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-3 text-xs text-gray-600">terminal — hydra</span>
            </div>
            <div className="p-6 text-sm space-y-2 overflow-x-auto">
              <p>
                <span className="text-green-600">$ </span>
                <span className="text-green-300">hydra -L users.txt -P passwords.txt ssh://192.168.1.10</span>
              </p>
              <p className="text-gray-500">Hydra v9.5 (c) 2023 by van Hauser/THC &amp; David Maciejak</p>
              <p className="text-gray-500">[DATA] max 16 tasks per 1 server, overall 16 tasks</p>
              <p className="text-gray-500">[DATA] attacking ssh://192.168.1.10:22/</p>
              <p>
                <span className="text-yellow-400">[22][ssh] </span>
                <span className="text-gray-400">host: 192.168.1.10  </span>
                <span className="text-green-400">login: admin  password: P@ssw0rd</span>
              </p>
              <p className="text-gray-500">1 of 1 target successfully completed, 1 valid password found</p>
              <p>
                <span className="text-green-600">$ </span>
                <span className="text-green-300 animate-pulse">_</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-green-900/20 py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "50+", label: "Supported Protocols" },
            { value: "12", label: "Learning Modules" },
            { value: "100+", label: "Hands-on Labs" },
            { value: "v9.5", label: "Latest Version" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-green-400 mb-1">{stat.value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="px-6 py-24 max-w-6xl mx-auto">
        <div className="mb-14 text-center">
          <p className="text-green-600 text-xs uppercase tracking-widest mb-3">Curriculum</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Learning Modules</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">
            From installation to advanced attack techniques — structured for beginners through professionals.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod, i) => (
            <div
              key={mod.title}
              className="bg-[#0d1117] border border-green-900/30 rounded-lg p-6 hover:border-green-700/50 transition-colors group"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-green-800 text-xs font-mono">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded border ${
                    mod.level === "Beginner"
                      ? "border-blue-800 text-blue-400"
                      : mod.level === "Intermediate"
                      ? "border-yellow-800 text-yellow-400"
                      : "border-red-900 text-red-400"
                  }`}
                >
                  {mod.level}
                </span>
              </div>
              <h3 className="font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                {mod.title}
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-4">{mod.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {mod.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-green-700 border border-green-900/50 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Commands Reference */}
      <section id="commands" className="bg-[#080d08] border-y border-green-900/20 px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14 text-center">
            <p className="text-green-600 text-xs uppercase tracking-widest mb-3">Quick Reference</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Common Commands</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {commands.map((cmd) => (
              <div key={cmd.label} className="bg-[#0d1117] border border-green-900/30 rounded-lg p-5">
                <p className="text-xs text-gray-500 mb-2">{cmd.label}</p>
                <code className="block text-green-300 text-sm bg-black/40 px-3 py-2 rounded mb-3 overflow-x-auto whitespace-nowrap">
                  {cmd.command}
                </code>
                <p className="text-xs text-gray-600">{cmd.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Protocols */}
      <section id="protocols" className="px-6 py-24 max-w-5xl mx-auto">
        <div className="mb-14 text-center">
          <p className="text-green-600 text-xs uppercase tracking-widest mb-3">Coverage</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Supported Protocols</h2>
          <p className="text-gray-500 mt-3 text-sm">
            Hydra supports over 50 protocols. Here are the most commonly tested in practice.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {protocols.map((p) => (
            <div
              key={p.name}
              className={`border rounded-lg px-4 py-3 text-center min-w-[90px] ${
                p.highlight
                  ? "border-green-600/60 bg-green-950/20 text-green-300"
                  : "border-green-900/30 bg-[#0d1117] text-gray-400"
              }`}
            >
              <div className="font-bold text-sm">{p.name}</div>
              <div className="text-xs text-gray-600 mt-0.5">{p.port}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Snake Game */}
      <section className="px-6 py-24 max-w-5xl mx-auto">
        <div className="mb-14 text-center">
          <p className="text-green-600 text-xs uppercase tracking-widest mb-3">Mini-Game</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Snake</h2>
          <p className="text-gray-500 mt-3 text-sm max-w-md mx-auto">
            Take a break. Arrow keys or WASD to play.
          </p>
        </div>
        <div className="flex justify-center">
          <SnakeGame />
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="px-6 py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#0d1117] border border-green-700/40 rounded-2xl p-12">
            <div className="text-green-400 text-4xl mb-6">⌘</div>
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start?</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Set up your lab environment and begin with Module 01. All you need is a Linux machine
              and authorization to test your own systems or a dedicated lab network.
            </p>
            <div className="bg-black/40 rounded-lg p-4 mb-8 text-left">
              <p className="text-xs text-gray-600 mb-2"># Install Hydra on Debian/Ubuntu</p>
              <code className="text-green-300 text-sm">sudo apt-get install hydra</code>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#modules"
                className="bg-green-600 hover:bg-green-500 text-black font-bold px-8 py-3 rounded transition-colors text-sm"
              >
                Begin Module 01
              </a>
              <a
                href="https://github.com/vanhauser-thc/thc-hydra"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-green-800 hover:border-green-600 text-green-400 px-8 py-3 rounded transition-colors text-sm"
              >
                View Source on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-green-900/20 px-6 py-8 text-center">
        <p className="text-xs text-gray-700">
          For educational purposes only. Always obtain proper written authorization before testing any system you do not own.
        </p>
        <p className="text-xs text-gray-800 mt-2">
          THC-Hydra is developed by van Hauser/THC. This is an independent learning resource.
        </p>
      </footer>
    </main>
  );
}

const modules = [
  {
    title: "Introduction & Installation",
    description:
      "Overview of Hydra's architecture, installation on Linux/macOS/Windows, and understanding legal scope.",
    level: "Beginner",
    tags: ["setup", "install", "overview"],
  },
  {
    title: "Basic Syntax & Flags",
    description:
      "Learn the core CLI syntax, essential flags (-l, -L, -p, -P, -t, -s), and how to read output.",
    level: "Beginner",
    tags: ["-l", "-p", "-t", "flags"],
  },
  {
    title: "Wordlist Strategy",
    description:
      "Curating effective username and password wordlists using SecLists, rockyou, and custom generation.",
    level: "Beginner",
    tags: ["wordlists", "SecLists", "rockyou"],
  },
  {
    title: "SSH & FTP Brute Force",
    description:
      "Hands-on labs targeting SSH and FTP services in an isolated lab. Tuning threads and timeouts.",
    level: "Intermediate",
    tags: ["ssh", "ftp", "lab"],
  },
  {
    title: "HTTP Form Attacks",
    description:
      "Attacking HTTP POST login forms. Identifying failure strings with -F and success patterns with -S.",
    level: "Intermediate",
    tags: ["http-post-form", "-F", "-S"],
  },
  {
    title: "RDP, SMB & Windows Services",
    description:
      "Testing Windows authentication over RDP and SMB — common targets in Active Directory environments.",
    level: "Intermediate",
    tags: ["rdp", "smb", "windows"],
  },
  {
    title: "Database Services",
    description:
      "Auditing MySQL, PostgreSQL, and MSSQL authentication endpoints using Hydra's database modules.",
    level: "Intermediate",
    tags: ["mysql", "postgres", "mssql"],
  },
  {
    title: "Rate Limiting & Evasion",
    description:
      "Understanding account lockout policies, timing delays (-W, -c), and how defenders detect brute force.",
    level: "Intermediate",
    tags: ["-W", "-c", "lockout"],
  },
  {
    title: "Proxy & SOCKS Support",
    description:
      "Routing Hydra through SOCKS4/5 proxies and HTTP proxies for lab routing and segmented networks.",
    level: "Intermediate",
    tags: ["proxy", "socks", "routing"],
  },
  {
    title: "Restore & Session Files",
    description:
      "Using -R and -o to save and restore sessions, and parsing output for reporting.",
    level: "Intermediate",
    tags: ["-R", "-o", "sessions"],
  },
  {
    title: "CTF Challenges",
    description:
      "Solving real CTF challenges using Hydra as part of a broader exploitation chain. TryHackMe & HTB walkthroughs.",
    level: "Advanced",
    tags: ["CTF", "TryHackMe", "HTB"],
  },
  {
    title: "Scripting & Automation",
    description:
      "Wrapping Hydra in Bash and Python scripts for automated credential auditing pipelines.",
    level: "Advanced",
    tags: ["bash", "python", "automation"],
  },
];

const commands = [
  {
    label: "Single username, password list",
    command: "hydra -l admin -P passwords.txt ssh://10.0.0.1",
    description: "Test one username against a full password wordlist over SSH.",
  },
  {
    label: "Username list, password list",
    command: "hydra -L users.txt -P pass.txt ftp://10.0.0.1",
    description: "Try all username/password combinations against an FTP server.",
  },
  {
    label: "HTTP POST form login",
    command: 'hydra -l admin -P pass.txt 10.0.0.1 http-post-form "/login:user=^USER^&pass=^PASS^:Invalid"',
    description: "Brute-force a web login form, using 'Invalid' as the failure string.",
  },
  {
    label: "Set threads and timeout",
    command: "hydra -l root -P pass.txt -t 4 -W 3 ssh://10.0.0.1",
    description: "Use 4 threads with a 3-second wait between attempts to avoid lockout.",
  },
  {
    label: "RDP attack",
    command: "hydra -l administrator -P pass.txt rdp://10.0.0.1",
    description: "Test Windows Remote Desktop Protocol credentials.",
  },
  {
    label: "Save & restore session",
    command: "hydra -l admin -P pass.txt -o results.txt -R ssh://10.0.0.1",
    description: "Output results to a file and enable session restore on interrupt.",
  },
];

const protocols = [
  { name: "SSH", port: "22", highlight: true },
  { name: "FTP", port: "21", highlight: true },
  { name: "HTTP", port: "80", highlight: true },
  { name: "HTTPS", port: "443", highlight: true },
  { name: "RDP", port: "3389", highlight: true },
  { name: "SMB", port: "445", highlight: true },
  { name: "MySQL", port: "3306", highlight: true },
  { name: "PostgreSQL", port: "5432", highlight: true },
  { name: "MSSQL", port: "1433", highlight: false },
  { name: "Telnet", port: "23", highlight: false },
  { name: "SMTP", port: "25", highlight: false },
  { name: "POP3", port: "110", highlight: false },
  { name: "IMAP", port: "143", highlight: false },
  { name: "LDAP", port: "389", highlight: false },
  { name: "VNC", port: "5900", highlight: false },
  { name: "Redis", port: "6379", highlight: false },
  { name: "MongoDB", port: "27017", highlight: false },
  { name: "Cisco", port: "23", highlight: false },
  { name: "SNMP", port: "161", highlight: false },
  { name: "SIP", port: "5060", highlight: false },
];
