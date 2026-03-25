import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Terminal, User, Folder, Mail, FileText,
  Monitor, X, Minus, Square, Search, Grid, Wifi, Battery,
  Volume2, Power, Download, Send, Globe, Github, Linkedin,
  ArrowLeft, ArrowRight, RotateCw, Home, Plus
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* UTILS                                                                      */
/* -------------------------------------------------------------------------- */

const playStartupSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    [261.63, 329.63, 392.00, 523.25].forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.1 + (index * 0.05));
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 3);
    });
  } catch (e) { console.error("Audio failed", e); }
};

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                                                  */
/* -------------------------------------------------------------------------- */

const SYSTEM_APPS = {
  SETTINGS: { id: 'settings', icon: Monitor, title: 'Settings', color: 'bg-gray-500' },
  TERMINAL: { id: 'terminal', icon: Terminal, title: 'Terminal', color: 'bg-gray-800' },
  ABOUT: { id: 'about', icon: User, title: 'About Me.txt', color: 'bg-blue-600' },
  PROJECTS: { id: 'projects', icon: Folder, title: 'Projects', color: 'bg-orange-500' },
  SKILLS: { id: 'skills', icon: Monitor, title: 'System Monitor', color: 'bg-green-600' },
  CONTACT: { id: 'contact', icon: Mail, title: 'Thunderbird Mail', color: 'bg-blue-500' },
  RESUME: { id: 'resume', icon: FileText, title: 'Resume.pdf', color: 'bg-red-600' },
  BROWSER: { id: 'browser', icon: Globe, title: 'Firefox', color: 'bg-orange-600' },
};

/* -------------------------------------------------------------------------- */
/* COMPONENTS                                                                 */
/* -------------------------------------------------------------------------- */

const BootScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing...");
  const [consoleLog, setConsoleLog] = useState([]);

  useEffect(() => {
    playStartupSound();
    const statuses = [
      { p: 10, text: "Loading kernel modules..." },
      { p: 30, text: "Mounting file systems..." },
      { p: 50, text: "Starting network manager..." },
      { p: 70, text: "Initializing creative systems..." },
      { p: 85, text: "Loading user profile: Ashish Kumar Laheri..." },
      { p: 95, text: "Starting graphical interface..." },
      { p: 100, text: "Ready." }
    ];
    let currentStep = 0;
    const timer = setInterval(() => {
      if (currentStep >= statuses.length) { clearInterval(timer); setTimeout(onComplete, 800); return; }
      const step = statuses[currentStep];
      setProgress(step.p); setStatusText(step.text); setConsoleLog(prev => [...prev.slice(-4), `[ OK ] ${step.text}`]);
      currentStep++;
    }, 600);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#2c001e] flex flex-col items-center justify-center text-white font-ubuntu overflow-hidden z-[9999]">
      {/* Reverted to authentic Ubuntu SVG Logo */}
      <div className="mb-8 animate-pulse">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" fill="#E95420" />
          <path d="M50 22C65.464 22 78 34.536 78 50C78 65.464 65.464 78 50 78C34.536 78 22 65.464 22 50C22 34.536 34.536 22 50 22ZM50 12C29.0132 12 12 29.0132 12 50C12 70.9868 29.0132 88 50 88C70.9868 88 88 70.9868 88 50C88 29.0132 70.9868 12 50 12Z" fill="white" fillOpacity="0.2" />
          <path fillRule="evenodd" clipRule="evenodd" d="M26.4 50C26.4 36.9665 36.9665 26.4 50 26.4C55.035 26.4 59.7186 28.0036 63.6358 30.7608L67.6568 25.4385C62.6253 21.3653 56.5592 19.1 50 19.1C32.936 19.1 19.1 32.936 19.1 50C19.1 56.5592 21.3653 62.6253 25.4385 67.6568L30.7608 63.6358C28.0036 59.7186 26.4 55.035 26.4 50ZM80.9 50C80.9 56.5592 78.6347 62.6253 74.5615 67.6568L69.2392 63.6358C71.9964 59.7186 73.6 55.035 73.6 50C73.6 36.9665 63.0335 26.4 50 26.4C48.9667 26.4 47.9515 26.4682 46.958 26.6001L44.8252 19.8808C46.5165 19.3629 48.2435 19.1 50 19.1C67.064 19.1 80.9 32.936 80.9 50Z" fill="white" />
          <circle cx="21" cy="50" r="5" fill="white" />
          <circle cx="68" cy="22" r="5" fill="white" />
          <circle cx="68" cy="78" r="5" fill="white" />
        </svg>
      </div>
      <h1 className="text-4xl font-light mb-2 tracking-wide">ubuntu</h1>
      <div className="w-64 h-1.5 bg-[#5e2750] rounded-full overflow-hidden mb-6 relative">
        <div className="h-full bg-[#E95420] transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
      </div>
      <div className="text-center h-24">
        <h2 className="text-xl font-medium text-white mb-1">ASHISH KUMAR LAHERI</h2>
        <p className="text-[#E95420] text-sm font-bold uppercase tracking-wider mb-2">Full Stack Developer</p>
        <p className="text-gray-400 text-xs font-mono h-4">{statusText}</p>
      </div>
      <button onClick={onComplete} className="absolute bottom-8 right-8 text-gray-500 hover:text-white text-xs uppercase tracking-widest transition-colors">Skip Boot sequence</button>
    </div>
  );
};

// --- LOCK SCREEN COMPONENT ---
const LockScreen = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    // Fake authentication delay
    setTimeout(() => {
      onUnlock();
    }, 800);
  };

  const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center text-white z-[9999] bg-cover bg-center select-none"
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 20% 40%, rgba(94,39,80,0.95) 0%, transparent 60%),
          radial-gradient(ellipse 60% 80% at 80% 60%, rgba(75,0,130,0.85) 0%, transparent 55%),
          linear-gradient(135deg, #1a0030 0%, #2c001e 30%, #300a24 55%, #1e0050 80%, #0d0020 100%)
        `
      }}
    >
      <div className="absolute top-16 flex flex-col items-center text-center">
        <h1 className="text-7xl font-light tracking-tight drop-shadow-lg mb-2">{time}</h1>
        <p className="text-xl font-normal text-white/90 drop-shadow-md">{date}</p>
      </div>

      <div className="flex flex-col items-center mt-32 bg-black/40 p-8 rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl transition-all duration-300">
        <div className="w-24 h-24 rounded-full bg-gray-600 border-2 border-white/20 shadow-md flex items-center justify-center overflow-hidden mb-4">
          <User size={48} className="text-white/70" />
        </div>
        <h2 className="text-xl font-medium mb-6">Ashish Kumar Laheri</h2>

        <form onSubmit={handleSubmit} className="flex flex-col items-center w-64">
          <div className="relative w-full">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1e1e1e]/80 border border-white/20 rounded-lg px-4 py-2.5 text-center text-white outline-none focus:border-[#E95420] focus:ring-1 focus:ring-[#E95420] transition-all placeholder-white/30"
              placeholder="Press Enter to login..."
              autoFocus
              disabled={isAuthenticating}
            />
            {isAuthenticating && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-[#E95420] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <button type="submit" className="hidden">Login</button>
        </form>
      </div>

      <div className="absolute bottom-6 right-6 flex gap-4 text-white/50">
        <Wifi size={20} />
        <Battery size={20} />
      </div>
    </div>
  );
};

// --- SETTINGS APP ---
const WALLPAPERS = {
  aurora: {
    bg: `
      radial-gradient(ellipse 80% 60% at 20% 40%, rgba(94,39,80,0.9) 0%, transparent 60%),
      radial-gradient(ellipse 60% 80% at 80% 60%, rgba(75,0,130,0.7) 0%, transparent 55%),
      radial-gradient(ellipse 50% 50% at 50% 100%, rgba(48,10,36,1) 0%, transparent 70%),
      linear-gradient(135deg, #1a0030 0%, #2C001E 30%, #300A24 55%, #1e0050 80%, #0d0020 100%)
    `,
    name: 'Dark Ubuntu Aurora'
  },
  jellyfish: {
    bg: 'linear-gradient(135deg, #4B3382 0%, #D44E72 50%, #E95420 100%)',
    name: 'Jammy Jellyfish'
  },
  classic: {
    bg: 'linear-gradient(to bottom right, #E95420, #77216F, #2C001E)',
    name: 'Classic Ubuntu'
  },
  dark: {
    bg: '#1a1a1a',
    name: 'Pitch Black'
  }
};

const SettingsApp = ({ currentWallpaper, setWallpaper }) => (
  <div className="flex h-full bg-[#FAFAFA] text-gray-800 font-ubuntu">
    {/* Sidebar */}
    <div className="w-64 bg-gray-100 border-r border-gray-300 flex flex-col pt-4 overflow-y-auto">
      <div className="px-6 pb-4 cursor-default font-bold text-gray-500 text-sm">Settings</div>
      <button className="flex items-center gap-3 px-6 py-2.5 bg-[#E95420]/10 text-[#E95420] border-l-4 border-[#E95420] text-sm font-medium">
        <Monitor size={18} /> Background
      </button>
    </div>

    {/* Main Content */}
    <div className="flex-1 p-8 overflow-y-auto">
      <h2 className="text-2xl font-light mb-8">Background</h2>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(WALLPAPERS).map(([key, wp]) => (
          <div key={key} className="flex flex-col gap-2">
            <button
              onClick={() => setWallpaper(key)}
              className={`w-full aspect-video rounded-lg shadow-sm border-4 transition-transform hover:scale-[1.03] ${currentWallpaper === key ? 'border-[#E95420]' : 'border-transparent ring-1 ring-gray-300'}`}
              style={{ background: wp.bg }}
            />
            <span className="text-sm text-center font-medium text-gray-600">{wp.name}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- TERMINAL APP (UPDATED) ---
const TerminalApp = () => {
  const [history, setHistory] = useState([
    { type: 'output', content: 'Welcome to Ubuntu 22.04 LTS (GNU/Linux 5.15.0-generic x86_64)' },
    { type: 'output', content: ' ' },
    { type: 'output', content: ' * Documentation:  <span class="underline text-blue-400">https://help.ubuntu.com</span>' },
    { type: 'output', content: ' * Management:     <span class="underline text-blue-400">https://landscape.canonical.com</span>' },
    { type: 'output', content: ' * Support:        <span class="underline text-blue-400">https://ubuntu.com/advantage</span>' },
    { type: 'output', content: ' ' },
    { type: 'output', content: 'Type "help" to see available commands.' },
    { type: 'output', content: ' ' },
  ]);
  const [input, setInput] = useState('');
  const [currentDir, setCurrentDir] = useState('~');
  const bottomRef = useRef(null);

  // Simulated File System
  const fileSystem = {
    '~': {
      'projects': { type: 'dir' },
      'skills': { type: 'dir' },
      'documents': { type: 'dir' },
      'about.txt': { type: 'file', content: 'Hi, I am Ashish Kumar Laheri.\nA passionate Full Stack Developer specialized in React, Node.js, and Cloud Architecture.' },
      'contact.md': { type: 'file', content: 'Email: yoashishkumar13@gmail.com\nGithub: github.com/ashish\nLinkedIn: linkedin.com/in/ashish' },
      'secret.txt': { type: 'file', content: 'You found the easter egg! 🥚\nCode is poetry.' }
    },
    '~/projects': {
      'n8n-news-discord': { type: 'file', content: 'AI-powered tech news bot for Discord using n8n and Google Gemini.' },
      'Kali-mcp-server': { type: 'file', content: 'Dockerized Kali pentest tools exposed as a REST API.' },
      'Git-Stalker': { type: 'file', content: 'Next.js application for exploring GitHub profiles and activity.' }
    },
    '~/skills': {
      'frontend': { type: 'file', content: 'React, Tailwind, Next.js, Redux, TypeScript' },
      'backend': { type: 'file', content: 'Node.js, Express, Python, PostgreSQL, MongoDB' },
      'devops': { type: 'file', content: 'Docker, AWS, CI/CD, Git' }
    },
    '~/documents': {
      'resume.pdf': { type: 'file', content: '%PDF-1.4 ... [Binary data] ...\n(Use the PDF Viewer app to read this)' }
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const fullCmd = input.trim();
      if (!fullCmd) {
        setHistory([...history, { type: 'input', content: '', path: currentDir }]);
        setInput('');
        return;
      }

      const parts = fullCmd.split(' ');
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);

      const newHistory = [...history, { type: 'input', content: fullCmd, path: currentDir }];

      // Helper to log output
      const log = (text, className = 'text-gray-300') => {
        if (Array.isArray(text)) {
          text.forEach(line => newHistory.push({ type: 'output', content: line, className }));
        } else {
          newHistory.push({ type: 'output', content: text, className });
        }
      };

      switch (cmd) {
        case 'help':
          log([
            'GNU bash, version 5.1.16(1)-release (x86_64-pc-linux-gnu)',
            'These shell commands are defined internally.  Type `help` to see this list.',
            ' ',
            '  ls [dir]    List directory contents',
            '  cd [dir]    Change the shell working directory',
            '  cat [file]  Concatenate files and print on the standard output',
            '  pwd         Print name of current/working directory',
            '  clear       Clear the terminal screen',
            '  whoami      Print effective userid',
            '  neofetch    Print system info',
            '  date        Print the system date and time',
            '  matrix      Awaken the system',
            '  sudo        Execute a command as another user'
          ]);
          break;

        case 'ls':
          // Resolve target directory
          let targetPath = currentDir;
          if (args[0]) {
            if (args[0] === '~') targetPath = '~';
            else if (args[0] === '..') targetPath = currentDir === '~' ? '~' : '~'; // Simple parent logic (always back to root in this flat mock)
            else targetPath = currentDir === '~' ? `~/${args[0]}` : args[0];
          }

          // Flattened lookup for simple mock
          const dirContent = fileSystem[targetPath];

          if (dirContent) {
            const items = Object.keys(dirContent).map(key => {
              const isDir = dirContent[key].type === 'dir';
              // Blue for dirs, White for files
              return `<span class="${isDir ? 'text-blue-400 font-bold' : 'text-gray-200'}">${key}</span>`;
            });
            log(items.join('  '));
          } else {
            log(`ls: cannot access '${args[0]}': No such file or directory`, 'text-red-400');
          }
          break;

        case 'cd':
          if (!args[0] || args[0] === '~') {
            setCurrentDir('~');
          } else if (args[0] === '..') {
            setCurrentDir('~'); // Mock logic: assume only 1 level depth
          } else {
            const target = currentDir === '~' ? `~/${args[0]}` : args[0];
            // Check if it exists and is a directory
            if (fileSystem[target] && !fileSystem[target].content) {
              setCurrentDir(target);
            } else if (fileSystem[target]) {
              log(`cd: ${args[0]}: Not a directory`, 'text-red-400');
            } else {
              log(`cd: ${args[0]}: No such file or directory`, 'text-red-400');
            }
          }
          break;

        case 'cat':
          if (!args[0]) {
            log('cat: missing operand');
          } else {
            const dir = fileSystem[currentDir];
            const file = dir[args[0]];
            if (file) {
              if (file.type === 'dir') {
                log(`cat: ${args[0]}: Is a directory`, 'text-red-400');
              } else {
                log(file.content);
              }
            } else {
              log(`cat: ${args[0]}: No such file or directory`, 'text-red-400');
            }
          }
          break;

        case 'matrix':
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
          let count = 0;
          const matrixInterval = setInterval(() => {
            if (count > 25) {
              clearInterval(matrixInterval);
              setHistory(prev => [...prev, { type: 'output', content: 'Wake up, Neo...', className: 'text-green-300 font-bold mt-2' }]);
              return;
            }
            const line = Array.from({ length: Math.floor(globalThis.window.innerWidth / 20) }, () => chars[Math.floor(Math.random() * chars.length)]).join(' ');
            setHistory(prev => [...prev, { type: 'output', content: line, className: 'text-green-500 opacity-80' }]);
            count++;
          }, 75);
          break;

        case 'sudo':
          if (args[0] === 'rm' && args[1] === '-rf' && args[2] === '/') {
            log('Nice try. I am not deleting myself today.', 'text-red-500 font-bold');
          } else {
            log('[sudo] password for ashish: ');
            setTimeout(() => {
              setHistory(prev => [...prev, { type: 'output', content: 'Sorry, try again.', className: 'text-red-400' }]);
            }, 1500);
          }
          break;

        case 'neofetch':
          log([
            '            .-/+osssso+/-.               <span class="font-bold text-[#E95420]">ashish@portfolio</span>',
            '        .://++/-.    .-/++//:.           ----------------',
            '      .://:.              .:/+:          <span class="font-bold text-[#E95420]">OS</span>: Ubuntu 22.04 LTS x86_64',
            '     -/:.                    .:/-        <span class="font-bold text-[#E95420]">Host</span>: React Portfolio Browser',
            '    :/:                        :/:       <span class="font-bold text-[#E95420]">Kernel</span>: 5.15.0-generic',
            '   :/:                          :/:      <span class="font-bold text-[#E95420]">Uptime</span>: ' + Math.floor(performance.now() / 60000) + ' mins',
            '  :/:                            :/:     <span class="font-bold text-[#E95420]">Packages</span>: 1337 (npm)',
            '  :/:                            :/:     <span class="font-bold text-[#E95420]">Shell</span>: bash 5.1.16',
            '  :/:                            :/:     <span class="font-bold text-[#E95420]">Resolution</span>: 1920x1080',
            '   :/:                          :/:      <span class="font-bold text-[#E95420]">DE</span>: GNOME',
            '    :/:                        :/:       <span class="font-bold text-[#E95420]">WM</span>: ReactWM',
            '     -/:.                    .:/-        <span class="font-bold text-[#E95420]">Theme</span>: Yaru-Dark [GTK2/3]',
            '      .://:.              .:/+:          <span class="font-bold text-[#E95420]">Icons</span>: Yaru [GTK2/3]',
            '        .://++/-.    .-/++//:.           <span class="font-bold text-[#E95420]">Terminal</span>: Portfolio-Term',
            '            .-/+osssso+/-.               <span class="font-bold text-[#E95420]">CPU</span>: Simulated V8 Core',
            '                                         <span class="font-bold text-[#E95420]">GPU</span>: WebGL Renderer',
            ' ',
            '                                         <span class="text-black bg-black">   </span><span class="text-red-500 bg-red-500">   </span><span class="text-green-500 bg-green-500">   </span><span class="text-yellow-500 bg-yellow-500">   </span><span class="text-blue-500 bg-blue-500">   </span><span class="text-purple-500 bg-purple-500">   </span><span class="text-cyan-500 bg-cyan-500">   </span><span class="text-white bg-white">   </span>'
          ]);
          break;

        case 'pwd':
          log(`/home/ashish${currentDir.replace('~', '')}`);
          break;
        case 'whoami':
          log('ashish');
          break;
        case 'date':
          log(new Date().toString());
          break;
        case 'clear':
          setHistory([]);
          setInput('');
          return;

        default:
          log(`Command '${cmd}' not found. Did you mean:`);
          log(`  command 'ls' from deb coreutils`, 'text-gray-500');
          log(`Try: apt install <deb name>`, 'text-gray-500');
      }

      setHistory(newHistory);
      setInput('');
    }
  };

  return (
    <div className="h-full bg-[#300A24] text-white font-mono p-4 text-sm overflow-y-auto" onClick={() => document.getElementById('term-input').focus()}>
      {history.map((line, i) => (
        <div key={i} className="mb-1 break-words">
          {line.type === 'input' && (
            <span className="mr-2">
              <span className="text-[#87A922]">ashish@ubuntu</span>:<span className="text-blue-400">{line.path}</span>$
            </span>
          )}
          <span
            className={line.className || 'text-gray-300'}
            dangerouslySetInnerHTML={{ __html: line.content }}
          />
        </div>
      ))}
      <div className="flex">
        <span className="mr-2">
          <span className="text-[#87A922]">ashish@ubuntu</span>:<span className="text-blue-400">{currentDir}</span>$
        </span>
        <input
          id="term-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          className="bg-transparent border-none outline-none flex-1 text-white"
          autoFocus
          autoComplete="off"
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

// --- WINDOW MANAGER HOOK ---
const useWindowManager = () => {
  const [windows, setWindows] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [zIndexCounter, setZIndexCounter] = useState(10);

  const openWindow = (appId, props = {}) => {
    setZIndexCounter(z => z + 1);
    const existing = windows.find(w => w.appId === appId);
    if (existing) {
      if (existing.minimized) {
        setWindows(prev => prev.map(w => w.id === existing.id ? { ...w, minimized: false, zIndex: zIndexCounter + 1 } : w));
      } else {
        setActiveId(existing.id);
        setWindows(prev => prev.map(w => w.id === existing.id ? { ...w, zIndex: zIndexCounter + 1 } : w));
      }
      return;
    }
    const newWindow = {
      id: Date.now(),
      appId,
      title: SYSTEM_APPS[appId.toUpperCase()]?.title || 'Application',
      zIndex: zIndexCounter + 1,
      minimized: false,
      maximized: false,
      position: { x: 80 + (windows.length * 20), y: 60 + (windows.length * 20) },
      size: { width: 800, height: 600 },
      ...props
    };
    setWindows([...windows, newWindow]);
    setActiveId(newWindow.id);
  };

  const closeWindow = (id) => setWindows(prev => prev.filter(w => w.id !== id));
  const minimizeWindow = (id) => { setWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: true } : w)); setActiveId(null); };
  const maximizeWindow = (id) => setWindows(prev => prev.map(w => w.id === id ? { ...w, maximized: !w.maximized } : w));
  const focusWindow = (id) => { setZIndexCounter(z => z + 1); setActiveId(id); setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: zIndexCounter + 1, minimized: false } : w)); };
  const updateWindowPosition = (id, pos) => setWindows(prev => prev.map(w => w.id === id ? { ...w, position: pos } : w));
  const updateWindowSize = (id, size) => setWindows(prev => prev.map(w => w.id === id ? { ...w, size } : w));

  return { windows, activeId, openWindow, closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindowPosition, updateWindowSize };
};

// --- DRAGGABLE WINDOW COMPONENT ---
const Window = ({ window, onClose, onMinimize, onMaximize, onFocus, onMove, onResize, children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(globalThis.window.innerWidth < 768);
    checkMobile();
    globalThis.window.addEventListener('resize', checkMobile);
    return () => globalThis.window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseDown = (e) => {
    if (window.maximized || isMobile || e.target.closest('.window-controls')) return;
    setIsDragging(true);
    setDragOffset({ x: e.clientX - window.position.x, y: e.clientY - window.position.y });
    onFocus(window.id);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      onMove(window.id, { x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
    };
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, window.id, onMove]);

  const style = window.maximized || isMobile ? {
    top: '32px', left: '64px', right: 0, bottom: 0, width: 'calc(100% - 64px)', height: 'calc(100% - 32px)', transform: 'none', borderRadius: 0
  } : {
    top: window.position.y, left: window.position.x, width: window.size.width, height: window.size.height,
  };

  if (window.minimized) return null;

  return (
    <div
      className={`fixed flex flex-col bg-[#3c3c3c] shadow-2xl overflow-hidden border border-black/40 window-anim ${isDragging ? '' : 'window-layout-transition'} ${window.maximized ? '' : 'rounded-xl'}`}
      style={{ ...style, zIndex: window.zIndex, boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)' }}
      onMouseDown={() => onFocus(window.id)}
    >
      <div className="h-9 bg-[#2d2d2d] flex items-center px-3 select-none cursor-default border-b border-black/40" onMouseDown={handleMouseDown} onDoubleClick={() => onMaximize(window.id)}>
        {/* Ubuntu/GNOME style: colored buttons on LEFT */}
        <div className="window-controls flex items-center gap-2 mr-3">
          <button
            onClick={() => onClose(window.id)}
            className="w-3 h-3 rounded-full bg-[#FC5753] hover:bg-[#e84844] border border-[#e04840]/60 flex items-center justify-center group transition-colors"
            title="Close"
          >
            <X size={7} className="opacity-0 group-hover:opacity-100 text-[#7a0000]" />
          </button>
          <button
            onClick={() => onMinimize(window.id)}
            className="w-3 h-3 rounded-full bg-[#FDBC40] hover:bg-[#f0b030] border border-[#df9f10]/60 flex items-center justify-center group transition-colors"
            title="Minimize"
          >
            <Minus size={7} className="opacity-0 group-hover:opacity-100 text-[#7a5000]" />
          </button>
          <button
            onClick={() => onMaximize(window.id)}
            className="w-3 h-3 rounded-full bg-[#34C749] hover:bg-[#28b03c] border border-[#20a030]/60 flex items-center justify-center group transition-colors"
            title="Maximize"
          >
            <Square size={6} className="opacity-0 group-hover:opacity-100 text-[#005010]" />
          </button>
        </div>
        <div className="text-gray-300 text-sm font-ubuntu font-medium flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          {SYSTEM_APPS[window.appId.toUpperCase()] && React.createElement(SYSTEM_APPS[window.appId.toUpperCase()].icon, { size: 14 })}
          {window.title}
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-[#F7F7F7] relative">
        {children}
      </div>
      {!window.maximized && !isMobile && (
        <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50" onMouseDown={(e) => {
          e.stopPropagation();
          const startX = e.clientX; const startY = e.clientY;
          const startW = window.size.width; const startH = window.size.height;
          const handleResize = (ev) => onResize(window.id, { width: Math.max(300, startW + (ev.clientX - startX)), height: Math.max(200, startH + (ev.clientY - startY)) });
          const stopResize = () => { document.removeEventListener('mousemove', handleResize); document.removeEventListener('mouseup', stopResize); };
          document.addEventListener('mousemove', handleResize); document.addEventListener('mouseup', stopResize);
        }} />
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* APP CONTENTS                                                               */
/* -------------------------------------------------------------------------- */

const BrowserHome = ({ onNavigate }) => (
  <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-8">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-16 h-16 bg-[#E95420] rounded-full flex items-center justify-center shadow-lg">
        <Globe size={40} className="text-white" />
      </div>
      <h1 className="text-4xl font-light">Firefox Start</h1>
    </div>

    <div className="w-full max-w-xl relative">
      <input
        type="text"
        placeholder="Search the web or enter address"
        className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E95420] text-lg"
        onKeyDown={(e) => {
          if (e.key === 'Enter') onNavigate(e.target.value);
        }}
      />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
    </div>

    <div className="grid grid-cols-4 gap-6 mt-12 w-full max-w-2xl">
      {[
        { name: 'Wikipedia', url: 'https://www.wikipedia.org' },
        { name: 'Github', url: 'https://github.com' },
        { name: 'Bing', url: 'https://www.bing.com' },
        { name: 'React', url: 'https://react.dev' }
      ].map(site => (
        <button
          key={site.name}
          onClick={() => onNavigate(site.url)}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-12 h-12 bg-white rounded-lg shadow flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-xl font-bold text-gray-600">{site.name[0]}</span>
          </div>
          <span className="text-sm text-gray-600">{site.name}</span>
        </button>
      ))}
    </div>
  </div>
);

const BrowserApp = ({ initialUrl }) => {
  const [tabs, setTabs] = useState([
    { id: 1, url: initialUrl || 'home', title: initialUrl ? 'Page' : 'New Tab', isLoading: false }
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [urlInput, setUrlInput] = useState('');

  // Sync input with active tab
  useEffect(() => {
    const activeTab = tabs.find(t => t.id === activeTabId);
    if (activeTab) {
      setUrlInput(activeTab.url === 'home' ? '' : activeTab.url);
    }
  }, [activeTabId, tabs]);

  const addTab = () => {
    const newId = Math.max(...tabs.map(t => t.id), 0) + 1;
    setTabs([...tabs, { id: newId, url: 'home', title: 'New Tab', isLoading: false }]);
    setActiveTabId(newId);
  };

  const closeTab = (e, id) => {
    e.stopPropagation();
    const newTabs = tabs.filter(t => t.id !== id);
    if (newTabs.length === 0) {
      addTab(); // Don't allow 0 tabs
    } else {
      setTabs(newTabs);
      if (activeTabId === id) {
        setActiveTabId(newTabs[newTabs.length - 1].id);
      }
    }
  };

  const updateTab = (id, updates) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const navigate = (url, id = activeTabId) => {
    let target = url.trim();
    if (!target) return;
    if (target === 'home') {
      updateTab(id, { url: 'home', title: 'New Tab', isLoading: false });
      return;
    }

    // Heuristic for URLs vs Search
    if (!target.startsWith('http') && !target.startsWith('about:')) {
      if (target.includes('.') && !target.includes(' ')) {
        target = `https://${target}`;
      } else {
        target = `https://www.bing.com/search?q=${encodeURIComponent(target)}`;
      }
    }

    updateTab(id, { url: target, title: target, isLoading: true });
    setUrlInput(target);
  };

  return (
    <div className="h-full flex flex-col bg-white w-full text-gray-800">

      {/* Tab Bar */}
      <div className="h-10 bg-[#DEE1E6] flex items-end px-2 space-x-1 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`
               group relative flex items-center max-w-[200px] min-w-[120px] h-8 px-3 text-xs rounded-t-lg cursor-default select-none transition-colors
               ${activeTabId === tab.id ? 'bg-white shadow-sm z-10' : 'bg-transparent hover:bg-white/50 text-gray-600'}
             `}
          >
            <span className="truncate flex-1 mr-2">{tab.title}</span>
            <button
              onClick={(e) => closeTab(e, tab.id)}
              className="p-0.5 rounded-full hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={10} />
            </button>
          </div>
        ))}
        <button onClick={addTab} className="p-1 hover:bg-gray-300 rounded ml-1 text-gray-600">
          <Plus size={16} />
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-white border-b border-gray-200 z-20">
        <div className="flex gap-1 text-gray-500">
          <button className="p-1.5 hover:bg-gray-100 rounded" disabled><ArrowLeft size={16} /></button>
          <button className="p-1.5 hover:bg-gray-100 rounded" disabled><ArrowRight size={16} /></button>
          <button className="p-1.5 hover:bg-gray-100 rounded" onClick={() => updateTab(activeTabId, { isLoading: true })}><RotateCw size={16} /></button>
          <button className="p-1.5 hover:bg-gray-100 rounded" onClick={() => navigate('home')}><Home size={16} /></button>
        </div>
        <form
          className="flex-1"
          onSubmit={(e) => { e.preventDefault(); navigate(urlInput); }}
        >
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onFocus={(e) => e.target.select()}
            className="w-full px-4 py-1.5 text-sm bg-gray-100 border-transparent rounded-full focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            placeholder="Search with Bing or enter address"
          />
        </form>
      </div>

      {/* Content Area - Render ALL tabs but hide inactive ones to preserve state (real browser behavior) */}
      <div className="flex-1 relative bg-white overflow-hidden">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className="absolute inset-0 w-full h-full bg-white"
            style={{ display: activeTabId === tab.id ? 'block' : 'none' }}
          >
            {tab.url === 'home' ? (
              <BrowserHome onNavigate={(url) => navigate(url, tab.id)} />
            ) : (
              <>
                {tab.isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <iframe
                  src={tab.url}
                  title={`Tab ${tab.id}`}
                  className="w-full h-full border-none"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
                  onLoad={() => updateTab(tab.id, { isLoading: false })}
                />
                <div className="absolute bottom-0 w-full bg-yellow-50 text-yellow-800 text-[10px] p-1 text-center border-t border-yellow-200 opacity-80 hover:opacity-100 transition-opacity">
                  Note: Major sites (Google/YouTube) block iframes. Try Wikipedia, Bing, or documentation sites.
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const AboutApp = () => {
  const lines = [
    { n: 1, text: '# About Ashish Kumar Laheri', type: 'h1' },
    { n: 2, text: '', type: 'blank' },
    { n: 3, text: 'Name:    Ashish Kumar Laheri', type: 'key' },
    { n: 4, text: 'Role:    Full Stack Developer & Automation Engineer', type: 'key' },
    { n: 5, text: 'Location: India', type: 'key' },
    { n: 6, text: 'Email:   yoashishkumar13@gmail.com', type: 'key' },
    { n: 7, text: '', type: 'blank' },
    { n: 8, text: '## About Me', type: 'h2' },
    { n: 9, text: '', type: 'blank' },
    { n: 10, text: "I'm a passionate Full Stack Developer who loves building things", type: 'text' },
    { n: 11, text: 'at the intersection of web, automation, and AI. I enjoy turning', type: 'text' },
    { n: 12, text: 'complex problems into clean, elegant software solutions.', type: 'text' },
    { n: 13, text: '', type: 'blank' },
    { n: 14, text: '## Projects (see /Projects folder on desktop)', type: 'h2' },
    { n: 15, text: '', type: 'blank' },
    { n: 16, text: '  → n8n-news-discord   — AI-powered Discord news bot', type: 'proj' },
    { n: 17, text: '  → Kali-mcp-server    — Dockerized Kali pentest REST API', type: 'proj' },
    { n: 18, text: '  → Git-Stalker        — GitHub profile explorer in Next.js', type: 'proj' },
    { n: 19, text: '', type: 'blank' },
    { n: 20, text: '## Tech Stack', type: 'h2' },
    { n: 21, text: '', type: 'blank' },
    { n: 22, text: '  Frontend:  React · Next.js · TypeScript · Tailwind CSS', type: 'tech' },
    { n: 23, text: '  Backend:   Node.js · Express · Python · PostgreSQL · MongoDB', type: 'tech' },
    { n: 24, text: '  DevOps:    Docker · AWS · n8n · Git · CI/CD', type: 'tech' },
    { n: 25, text: '  AI/ML:     Google Gemini · LangChain · REST APIs', type: 'tech' },
    { n: 26, text: '', type: 'blank' },
    { n: 27, text: '## Links', type: 'h2' },
    { n: 28, text: '', type: 'blank' },
    { n: 29, text: '  GitHub:   https://github.com/ashishlaheri', type: 'link' },
    { n: 30, text: '  LinkedIn: https://linkedin.com/in/ashish-kumar-laheri', type: 'link' },
    { n: 31, text: '', type: 'blank' },
    { n: 32, text: '# EOF — thanks for visiting! 🚀', type: 'comment' },
  ];

  const colorMap = {
    h1: 'text-[#E95420] font-bold text-base',
    h2: 'text-purple-400 font-semibold',
    key: 'text-green-400',
    text: 'text-gray-300',
    blank: 'text-transparent',
    proj: 'text-yellow-300',
    tech: 'text-cyan-300',
    link: 'text-blue-400 underline',
    comment: 'text-gray-500 italic',
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-sm font-mono">
      {/* Gedit-style header */}
      <div className="bg-[#2d2d2d] border-b border-black/40 px-4 py-2 flex items-center gap-3 shrink-0">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FC5753]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FDBC40]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#34C749]" />
        </div>
        <span className="text-gray-400 text-xs ml-2">about_me.md — Text Editor</span>
        <div className="ml-auto flex gap-3 text-gray-500 text-xs">
          <span>Ln 1, Col 1</span>
          <span>UTF-8</span>
          <span>Markdown</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Line numbers gutter */}
        <div className="bg-[#252525] border-r border-black/30 px-3 py-4 text-gray-600 text-right select-none shrink-0" style={{ minWidth: '42px' }}>
          {lines.map(l => (
            <div key={l.n} className="leading-6 text-xs">{l.n}</div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 leading-6">
          {lines.map(l => (
            <div key={l.n} className={`${colorMap[l.type] || 'text-gray-300'} whitespace-pre`}>
              {l.text || '\u00A0'}
            </div>
          ))}

          {/* Social link buttons */}
          <div className="mt-6 flex gap-3">
            <a
              href="https://github.com/ashishlaheri"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs transition-colors border border-gray-600"
            >
              <Github size={14} /> GitHub
            </a>
            <a
              href="https://linkedin.com/in/ashish-kumar-laheri"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-xs transition-colors border border-blue-600"
            >
              <Linkedin size={14} /> LinkedIn
            </a>
            <a
              href="mailto:yoashishkumar13@gmail.com"
              className="flex items-center gap-2 px-4 py-2 bg-[#E95420] hover:bg-[#d04515] text-white rounded-lg text-xs transition-colors"
            >
              <Mail size={14} /> Email Me
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};


const REAL_PROJECTS = [
  {
    id: 1,
    title: 'n8n-news-discord',
    type: 'Automation',
    tagline: 'AI-powered tech news bot for Discord',
    color: '#5865F2',
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-500',
    fillColor: 'text-indigo-400',
    github: 'https://github.com/ashishlaheri/n8n-news-discord',
    description: 'Automates the extraction of top technology news from RSS feeds using n8n and delivers AI-summarized updates directly to a Discord server. Fetches, filters, formats, and posts tech news — all without manual effort.',
    stack: ['n8n', 'Google Gemini AI', 'RSS Feeds', 'Discord Webhook', 'LangChain'],
    features: [
      'Fetches top 5 articles from BleepingComputer RSS feed',
      'Summarizes each article in 15 words using Google Gemini AI',
      'Runs a fun ping test with a Ryan Reynolds-style humorous summary',
      'Merges news + ping output and posts everything to a Discord channel',
      'Demonstrates n8n + AI + automation integration in a single workflow',
    ],
  },
  {
    id: 2,
    title: 'Kali-mcp-server',
    type: 'Security / DevOps',
    tagline: 'Dockerized Kali pentest tools as a REST API',
    color: '#22c55e',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    fillColor: 'text-green-500',
    github: 'https://github.com/ashishlaheri/Kali-mcp-server',
    description: 'A Dockerized MCP server that exposes Kali Linux penetration testing tools as a REST API. Designed for educational network analysis within authorized lab environments.',
    stack: ['Docker', 'Python', 'Kali Linux', 'REST API', 'nmap', 'sqlmap'],
    features: [
      'Exposes nmap, nikto, sqlmap, wpscan, dirb & searchsploit via HTTP',
      'Fully containerized — one docker build and it just works',
      'Simple POST /run endpoint with tool name + args',
      'Scoped for legal, authorized lab use only',
      'Easy to extend with additional Kali tools',
    ],
  },
  {
    id: 3,
    title: 'Git-Stalker',
    type: 'Developer Tool',
    tagline: 'GitHub profile explorer & activity tracker',
    color: '#f97316',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-500',
    fillColor: 'text-orange-400',
    github: 'https://github.com/ashishlaheri/Git-Stalker',
    description: 'A Next.js application that lets you explore any GitHub user\'s profile, repositories, and activity in a clean, modern UI. Built with TypeScript and Firebase Studio.',
    stack: ['Next.js', 'TypeScript', 'Firebase Studio', 'GitHub API', 'CSS'],
    features: [
      'Look up any GitHub user by username',
      'View profile info, repos, stars, and follower count',
      'Explore contribution activity and recent commits',
      'Built with 96.6% TypeScript for type-safe reliability',
      'Bootstrapped with Firebase Studio for rapid prototyping',
    ],
  },
];

const ProjectsApp = ({ openBrowser }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [clickTimer, setClickTimer] = useState(null);

  const handleClick = (project) => {
    if (clickTimer) {
      // Double click detected
      clearTimeout(clickTimer);
      setClickTimer(null);
      setSelectedProject(project);
    } else {
      const timer = setTimeout(() => {
        setClickTimer(null);
      }, 300);
      setClickTimer(timer);
    }
  };

  if (selectedProject) {
    const p = selectedProject;
    return (
      <div className="h-full bg-gray-50 flex flex-col text-gray-800">
        {/* Breadcrumb toolbar */}
        <div className="bg-white border-b p-2 flex items-center gap-2 text-sm text-gray-500 shadow-sm shrink-0">
          <button
            onClick={() => setSelectedProject(null)}
            className="flex items-center gap-1.5 hover:bg-gray-100 px-2 py-1 rounded transition-colors text-gray-600 font-medium"
          >
            <ArrowLeft size={14} />
            Projects
          </button>
          <span>/</span>
          <span className="text-gray-800 font-medium">{p.title}</span>
        </div>

        {/* Detail content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 ${p.bgColor} rounded-xl flex items-center justify-center shadow-sm shrink-0`}>
                <Folder size={36} className={p.iconColor} fill="currentColor" fillOpacity={0.3} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{p.title}</h1>
                <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: p.color }}>{p.type}</span>
                <p className="text-gray-500 text-sm mt-1">{p.tagline}</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 mb-4 shadow-sm">
              <h2 className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">About</h2>
              <p className="text-gray-700 leading-relaxed">{p.description}</p>
            </div>

            {/* Tech Stack */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 mb-4 shadow-sm">
              <h2 className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-3">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {p.stack.map(tech => (
                  <span key={tech} className="px-3 py-1 text-sm rounded-full border font-medium" style={{ borderColor: p.color, color: p.color, backgroundColor: p.bgColor.replace('bg-', '') }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 mb-5 shadow-sm">
              <h2 className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-3">Key Features</h2>
              <ul className="space-y-2">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* GitHub Button */}
            <button
              onClick={() => window.open(p.github, '_blank', 'noopener,noreferrer')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-white font-semibold shadow-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: p.color }}
            >
              <Github size={18} />
              View on GitHub
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Nautilus-style toolbar */}
      <div className="bg-white border-b p-3 flex items-center gap-3 text-gray-600 shadow-sm shrink-0">
        <div className="bg-gray-100 px-4 py-1 rounded w-full text-sm border text-gray-500 select-none">
          Home / ashish / Projects
        </div>
        <Search size={16} className="shrink-0" />
      </div>

      <div className="p-2 px-4 text-xs text-gray-400 border-b bg-white">
        {REAL_PROJECTS.length} items · Double-click a folder to open
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {REAL_PROJECTS.map(p => (
            <div
              key={p.id}
              className={`group flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer transition-all border border-transparent hover:border-opacity-30 hover:shadow-sm select-none`}
              style={{ '--hover-color': p.color }}
              onClick={() => handleClick(p)}
              onDoubleClick={() => setSelectedProject(p)}
            >
              <div className={`w-16 h-16 ${p.bgColor} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                <Folder size={32} className={p.iconColor} fill="currentColor" fillOpacity={0.3} />
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-800 leading-tight">{p.title}</div>
                <div className="text-xs mt-0.5 font-medium px-2 py-0.5 rounded-full text-white inline-block mt-1" style={{ backgroundColor: p.color }}>
                  {p.type}
                </div>
                <div className="text-xs text-gray-400 mt-1 leading-snug">{p.tagline}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SkillsApp = () => {
  const [cpuHistory, setCpuHistory] = useState(() => Array.from({ length: 60 }, () => Math.random() * 30 + 10));
  const [ramUsage, setRamUsage] = useState(62);
  const [activeTab, setActiveTab] = useState('skills');

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuHistory(prev => {
        const newVal = Math.max(5, Math.min(95, prev[prev.length - 1] + (Math.random() - 0.48) * 12));
        return [...prev.slice(1), newVal];
      });
      setRamUsage(prev => Math.max(45, Math.min(85, prev + (Math.random() - 0.5) * 3)));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const allSkills = [
    {
      category: 'Frontend', color: '#E95420', items: [
        { name: 'React', level: 95 }, { name: 'Next.js', level: 85 },
        { name: 'TypeScript', level: 80 }, { name: 'Tailwind CSS', level: 98 },
        { name: 'HTML/CSS', level: 96 },
      ]
    },
    {
      category: 'Backend', color: '#22c55e', items: [
        { name: 'Node.js', level: 85 }, { name: 'Express', level: 82 },
        { name: 'Python', level: 75 }, { name: 'PostgreSQL', level: 70 },
        { name: 'MongoDB', level: 73 },
      ]
    },
    {
      category: 'DevOps & Tools', color: '#3b82f6', items: [
        { name: 'Docker', level: 78 }, { name: 'Git', level: 92 },
        { name: 'AWS', level: 65 }, { name: 'CI/CD', level: 72 },
        { name: 'n8n', level: 85 },
      ]
    },
    {
      category: 'AI & APIs', color: '#a855f7', items: [
        { name: 'Google Gemini', level: 80 }, { name: 'LangChain', level: 70 },
        { name: 'REST APIs', level: 90 }, { name: 'Discord API', level: 82 },
      ]
    },
  ];

  const currentCpu = Math.round(cpuHistory[cpuHistory.length - 1]);
  const maxCpu = 60; // Y-axis max %
  const svgW = 400; const svgH = 80;
  const points = cpuHistory.map((v, i) => `${(i / 59) * svgW},${svgH - (v / maxCpu) * svgH}`).join(' ');

  return (
    <div className="h-full bg-[#1e1e1e] text-gray-200 flex flex-col font-mono text-sm">
      {/* Tab bar */}
      <div className="flex border-b border-gray-700 bg-[#252525] shrink-0">
        {['skills', 'monitor'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 text-sm capitalize transition-colors ${activeTab === tab
                ? 'border-t-2 border-[#E95420] bg-[#1e1e1e] text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
          >
            {tab === 'skills' ? 'Skills' : 'System Monitor'}
          </button>
        ))}
      </div>

      {activeTab === 'skills' && (
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {allSkills.map((cat) => (
              <div key={cat.category} className="space-y-3">
                <h3 className="font-bold text-base pb-2 border-b border-gray-700" style={{ color: cat.color }}>
                  {cat.category}
                </h3>
                <div className="space-y-3">
                  {cat.items.map(skill => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-1 text-xs">
                        <span className="text-gray-300">{skill.name}</span>
                        <span className="text-gray-500">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${skill.level}%`,
                            background: `linear-gradient(90deg, ${cat.color}aa, ${cat.color})`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'monitor' && (
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* CPU Chart */}
          <div className="bg-[#252525] rounded-lg border border-gray-700 p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[#E95420] font-bold text-xs uppercase tracking-wider">CPU Usage</span>
              <span className="text-white font-bold text-lg">{currentCpu}%</span>
            </div>
            <div className="relative bg-[#1a1a1a] rounded overflow-hidden" style={{ height: '80px' }}>
              <svg width="100%" height="80" viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E95420" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#E95420" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                <polygon
                  points={`0,${svgH} ${points} ${svgW},${svgH}`}
                  fill="url(#cpuGrad)"
                />
                <polyline
                  points={points}
                  fill="none"
                  stroke="#E95420"
                  strokeWidth="2"
                />
              </svg>
              <div className="absolute top-1 left-2 text-gray-600 text-[10px]">60%</div>
              <div className="absolute bottom-1 left-2 text-gray-600 text-[10px]">0%</div>
            </div>
          </div>

          {/* RAM */}
          <div className="bg-[#252525] rounded-lg border border-gray-700 p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-green-400 font-bold text-xs uppercase tracking-wider">Memory (RAM)</span>
              <span className="text-white font-bold">{ramUsage.toFixed(1)}% of 16 GB</span>
            </div>
            <div className="h-6 bg-[#1a1a1a] rounded-full overflow-hidden border border-gray-700">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${ramUsage}%`,
                  background: 'linear-gradient(90deg, #16a34a, #22c55e)'
                }}
              />
            </div>
          </div>

          {/* Disk */}
          <div className="bg-[#252525] rounded-lg border border-gray-700 p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-blue-400 font-bold text-xs uppercase tracking-wider">Disk / (root)</span>
              <span className="text-white font-bold">42% of 512 GB</span>
            </div>
            <div className="h-6 bg-[#1a1a1a] rounded-full overflow-hidden border border-gray-700">
              <div className="h-full rounded-full" style={{ width: '42%', background: 'linear-gradient(90deg, #1d4ed8, #3b82f6)' }} />
            </div>
          </div>

          {/* Process list */}
          <div className="bg-[#252525] rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-xs uppercase tracking-wider mb-3">Process List</div>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-500 border-b border-gray-700">
                  <th className="text-left pb-1">Process</th>
                  <th className="text-right pb-1">CPU</th>
                  <th className="text-right pb-1">Memory</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {[
                  { name: 'portfolio-os', cpu: `${currentCpu}%`, mem: '64 MB' },
                  { name: 'vite (HMR)', cpu: '2.1%', mem: '128 MB' },
                  { name: 'node_modules', cpu: '0.8%', mem: '256 MB' },
                  { name: 'react-dom', cpu: '1.2%', mem: '32 MB' },
                ].map(p => (
                  <tr key={p.name} className="text-gray-300">
                    <td className="py-1 text-green-400">{p.name}</td>
                    <td className="py-1 text-right">{p.cpu}</td>
                    <td className="py-1 text-right text-blue-300">{p.mem}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};


const ContactApp = () => {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;

    setStatus('sending');

    try {
      const response = await fetch("https://formspree.io/f/mnneljwb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ email: '', subject: '', message: '' });
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#F5F5F5] text-gray-900 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#E95420] to-[#c74418] text-white p-3 flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <Mail size={20} />
          <span className="font-bold tracking-wide">Write: New Message</span>
        </div>
        <div className="text-xs opacity-80">Thunderbird Mail</div>
      </div>

      {/* Form */}
      <div className="p-6 flex-1 overflow-auto">
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm space-y-4 max-w-3xl mx-auto h-full flex flex-col">

          {/* Status Messages */}
          {status === 'success' && (
            <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded flex items-center gap-2 text-sm">
              <span className="font-bold">✓</span> Message sent successfully!
            </div>
          )}
          {status === 'error' && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded flex items-center gap-2 text-sm">
              <span className="font-bold">⚠</span> Failed to send. Please try again later.
            </div>
          )}

          {/* To Field (Read-only) */}
          <div className="grid grid-cols-[80px_1fr] items-center gap-4">
            <label className="text-gray-500 text-right font-medium text-sm">To:</label>
            <div className="bg-gray-100 px-3 py-1.5 rounded border border-gray-200 text-gray-600 text-sm font-mono flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              yoashishkumar13@gmail.com
            </div>
          </div>

          {/* From Field (User Email) */}
          <div className="grid grid-cols-[80px_1fr] items-center gap-4">
            <label className="text-gray-500 text-right font-medium text-sm">From:</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className="w-full border border-gray-300 rounded px-3 py-1.5 focus:border-[#E95420] focus:ring-1 focus:ring-[#E95420] outline-none text-gray-800 text-sm transition-colors bg-white"
            />
          </div>

          {/* Subject Field */}
          <div className="grid grid-cols-[80px_1fr] items-center gap-4">
            <label className="text-gray-500 text-right font-medium text-sm">Subject:</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Project Inquiry..."
              className="w-full border-b border-gray-300 focus:border-[#E95420] outline-none py-1 text-gray-800 text-sm bg-transparent transition-colors"
            />
          </div>

          {/* Message Area */}
          <div className="flex-1 flex flex-col mt-2">
            <textarea
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              className="w-full flex-1 border border-gray-300 rounded p-4 resize-none focus:border-[#E95420] focus:ring-1 focus:ring-[#E95420] outline-none text-gray-800 text-sm leading-relaxed bg-white"
              placeholder="Write your message here..."
            ></textarea>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
            <div className="text-xs text-gray-400">
              {status === 'sending' ? 'Sending via Formspree...' : 'Ready to send'}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setFormData({ email: '', subject: '', message: '' })} className="px-4 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 text-sm transition-colors">
                Discard
              </button>
              <button
                type="submit"
                disabled={status === 'sending'}
                className={`px-6 py-2 bg-[#E95420] text-white rounded hover:bg-[#d04515] flex items-center gap-2 shadow-sm text-sm font-medium transition-all ${status === 'sending' ? 'opacity-70 cursor-wait' : ''}`}
              >
                {status === 'sending' ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send size={16} />
                )}
                {status === 'sending' ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

// --- DRAGGABLE ICON COMPONENT ---
const DraggableIcon = ({ id, label, icon, action, initialX, initialY, updatePosition }) => {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, posX: pos.x, posY: pos.y };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      setPos({
        x: dragStart.current.posX + (e.clientX - dragStart.current.x),
        y: dragStart.current.posY + (e.clientY - dragStart.current.y)
      });
    };
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        updatePosition(id, pos);
      }
    };
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, id, pos, updatePosition]);

  return (
    <div
      className="absolute flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-white/10 cursor-pointer group transition-colors select-none w-24"
      style={{ top: pos.y, left: pos.x, zIndex: isDragging ? 50 : 10 }}
      onMouseDown={handleMouseDown}
      onDoubleClick={(e) => { e.stopPropagation(); action(); }}
    >
      <div className="relative pointer-events-none">{icon}</div>
      <span className="text-xs text-center text-white drop-shadow font-medium pointer-events-none" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
        {label}
      </span>
    </div>
  );
};

export default function UbuntuPortfolio() {
  const [booted, setBooted] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [contextMenu, setContextMenu] = useState(null); // { x, y }
  const [showAppLauncher, setShowAppLauncher] = useState(false);
  const [wallpaper, setWallpaper] = useState('aurora');
  const wm = useWindowManager();

  const [desktopIcons, setDesktopIcons] = useState([
    { id: 'projects', label: 'Projects', icon: <Folder size={48} className="text-orange-400 drop-shadow-lg" fill="rgba(251,146,60,0.35)" />, action: () => wm.openWindow('projects'), x: 20, y: 20 },
    { id: 'resume', label: 'Resume.pdf', icon: <FileText size={48} className="text-red-400 drop-shadow-lg" fill="rgba(248,113,113,0.2)" />, action: () => wm.openWindow('resume'), x: 20, y: 120 },
    { id: 'github', label: 'GitHub', icon: <Github size={48} className="text-white/80 drop-shadow-lg" />, action: () => globalThis.window.open('https://github.com/ashishlaheri', '_blank'), x: 20, y: 220 },
    { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={48} className="text-blue-400 drop-shadow-lg" fill="rgba(96,165,250,0.2)" />, action: () => globalThis.window.open('https://linkedin.com/in/ashish-kumar-laheri', '_blank'), x: 20, y: 320 },
    { id: 'easter_egg', label: 'easter_egg.sh', icon: <Terminal size={48} className="text-green-400 drop-shadow-lg" fill="rgba(74,222,128,0.1)" />, action: () => wm.openWindow('terminal'), x: 20, y: 420 },
    {
      id: 'trash', label: 'Trash',
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="12" y="16" width="24" height="26" rx="3" fill="rgba(156,163,175,0.3)" stroke="rgba(156,163,175,0.6)" strokeWidth="1.5" />
          <rect x="10" y="13" width="28" height="4" rx="2" fill="rgba(156,163,175,0.5)" stroke="rgba(156,163,175,0.6)" strokeWidth="1" />
          <rect x="19" y="10" width="10" height="4" rx="2" fill="rgba(156,163,175,0.4)" stroke="rgba(156,163,175,0.5)" strokeWidth="1" />
        </svg>
      ),
      action: () => { }, x: 20, y: 520
    }
  ]);

  const updateIconPosition = (id, pos) => {
    setDesktopIcons(prev => prev.map(icon => icon.id === id ? { ...icon, x: pos.x, y: pos.y } : icon));
  };

  const handleBootComplete = useCallback(() => { setBooted(true); }, []);
  useEffect(() => { const timer = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(timer); }, []);
  const formatTime = (date) => date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const formatDate = (date) => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  // Active window label for top bar
  const activeWindow = wm.windows.find(w => w.id === wm.activeId && !w.minimized);
  const activeAppId = activeWindow?.appId?.toUpperCase();
  const activeAppTitle = activeAppId ? SYSTEM_APPS[activeAppId]?.title : null;

  const handleDesktopContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const renderWindowContent = (appId, props) => {
    switch (appId) {
      case 'settings': return <SettingsApp currentWallpaper={wallpaper} setWallpaper={setWallpaper} />;
      case 'terminal': return <TerminalApp />;
      case 'about': return <AboutApp />;
      case 'projects': return <ProjectsApp openBrowser={(url) => wm.openWindow('browser', { initialUrl: url })} />;
      case 'skills': return <SkillsApp />;
      case 'contact': return <ContactApp />;
      case 'browser': return <BrowserApp initialUrl={props.initialUrl} />;
      case 'resume': return (
        <div className="h-full w-full bg-gray-100 flex flex-col">
          <div className="bg-white border-b py-2 px-4 flex justify-between items-center shadow-sm shrink-0">
            <span className="text-gray-700 font-medium text-sm flex items-center gap-2">
              <FileText size={16} className="text-red-500" />
              resume.pdf
            </span>
            <a
              href="/resume.pdf"
              download="Ashish_Kumar_Laheri_CV.pdf"
              className="px-4 py-1.5 bg-[#E95420] text-white text-sm rounded hover:bg-[#d04515] flex items-center gap-2 transition-colors shadow-sm"
            >
              <Download size={16} /> Download
            </a>
          </div>
          <div className="flex-1 w-full overflow-hidden bg-gray-200">
            <iframe
              src="/resume.pdf#toolbar=0"
              className="w-full h-full border-none"
              title="Resume PDF Viewer"
            />
          </div>
        </div>
      );
      default: return <div className="p-4">App content not found</div>;
    }
  };

  if (!booted) return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300&display=swap');`}</style>
      <BootScreen onComplete={handleBootComplete} />
    </>
  );

  if (isLocked) return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300&display=swap');`}</style>
      <LockScreen onUnlock={() => setIsLocked(false)} />
    </>
  );

  return (
    <div
      className="h-screen w-screen overflow-hidden select-none relative font-sans text-white"
      style={{ background: WALLPAPERS[wallpaper].bg }}
      onClick={() => setContextMenu(null)}
      onContextMenu={handleDesktopContextMenu}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300&display=swap');
        .font-ubuntu { font-family: 'Ubuntu', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .dock-icon-label {
          position: absolute; left: calc(100% + 12px); top: 50%; transform: translateY(-50%);
          background: rgba(30,30,30,0.95); color: white; padding: 4px 10px; border-radius: 6px;
          font-size: 12px; white-space: nowrap; pointer-events: none; opacity: 0;
          border: 1px solid rgba(255,255,255,0.1); transition: opacity 0.15s ease;
          backdrop-filter: blur(8px);
        }
        .dock-item:hover .dock-icon-label { opacity: 1; }
        .dock-item:hover .dock-btn { transform: scale(1.18) translateY(-3px); }
        .dock-btn { transition: transform 0.15s ease; }
        @keyframes aurora {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.05); }
        }
        .aurora-glow { animation: aurora 8s ease-in-out infinite; }
        @keyframes windowOpen {
          0% { opacity: 0; transform: scale(0.95) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .window-anim { animation: windowOpen 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        /* Smooth window layout transitions, but ignore them while dragging so mouse sync is perfect */
        .window-layout-transition { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>

      {/* Aurora glow layer */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="aurora-glow absolute w-[700px] h-[500px] rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #E95420 0%, transparent 70%)', top: '-100px', left: '-100px' }} />
        <div className="aurora-glow absolute w-[600px] h-[600px] rounded-full opacity-15 blur-3xl" style={{ background: 'radial-gradient(circle, #7b2d8b 0%, transparent 70%)', bottom: '-150px', right: '-100px', animationDelay: '4s' }} />
      </div>

      {/* TOP BAR */}
      <div className="h-8 bg-black/60 backdrop-blur-md flex justify-between items-center px-4 absolute top-0 w-full z-[10000] shadow-md text-sm border-b border-white/5">
        <div className="flex items-center gap-4">
          <span className="font-bold cursor-pointer hover:bg-white/10 px-2 py-1 rounded transition-colors" onClick={() => wm.openWindow('about')}>Activities</span>
          {activeAppTitle && (
            <span className="text-white/80 font-medium">{activeAppTitle}</span>
          )}
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center leading-none">
          <span className="font-medium text-sm">{formatTime(currentTime)}</span>
          <span className="text-[10px] text-white/60">{formatDate(currentTime)}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2 text-xs items-center">
            <Wifi size={14} />
            <Volume2 size={14} />
            <Battery size={14} />
          </div>
          <Power size={14} className="cursor-pointer hover:text-[#E95420] transition-colors" onClick={() => window.location.reload()} />
        </div>
      </div>

      {/* DOCK — floating pill */}
      <div className="absolute top-1/2 left-2 -translate-y-1/2 z-[9999] flex flex-col items-center py-3 px-1.5 gap-1"
        style={{
          background: 'rgba(20,20,20,0.75)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)'
        }}
      >
        {Object.values(SYSTEM_APPS).map(app => {
          const isOpen = wm.windows.some(w => w.appId === app.id);
          const isActive = wm.activeId && wm.windows.find(w => w.id === wm.activeId)?.appId === app.id;
          return (
            <div key={app.id} className="dock-item relative flex justify-center py-0.5">
              {/* Active indicator dot */}
              {isOpen && (
                <div className={`absolute -left-1 top-1/2 -translate-y-1/2 rounded-full transition-all ${isActive ? 'w-1.5 h-4 bg-white' : 'w-1 h-1 bg-white/50'
                  }`} />
              )}
              <button
                onClick={() => wm.openWindow(app.id)}
                className={`dock-btn p-2 rounded-xl transition-all ${isActive ? 'bg-white/15' : 'hover:bg-white/10'
                  }`}
              >
                <app.icon
                  size={26}
                  className={`${app.color} text-white p-0.5 rounded-lg`}
                />
              </button>
              <span className="dock-icon-label">{app.title}</span>
            </div>
          );
        })}
        {/* Separator */}
        <div className="w-8 h-px bg-white/20 my-1" />
        <div className="dock-item relative flex justify-center py-0.5">
          <button
            className={`dock-btn p-2 rounded-xl transition-all ${showAppLauncher ? 'bg-white/20' : 'hover:bg-white/10'}`}
            onClick={() => {
              setShowAppLauncher(!showAppLauncher);
              // Hide context menu if open
              setContextMenu(null);
            }}
          >
            <Grid size={26} className="text-white/70" />
          </button>
          <span className="dock-icon-label">Show Applications</span>
        </div>
      </div>

      {/* DESKTOP AREA */}
      <div className="absolute top-8 left-16 right-0 bottom-0 p-6 overflow-hidden">
        {desktopIcons.map(icon => (
          <DraggableIcon
            key={icon.id}
            id={icon.id}
            label={icon.label}
            icon={icon.icon}
            action={icon.action}
            initialX={icon.x}
            initialY={icon.y}
            updatePosition={updateIconPosition}
          />
        ))}
      </div>

      {/* RIGHT-CLICK CONTEXT MENU */}
      {contextMenu && (
        <div
          className="fixed z-[99999] bg-[#1e1e1e]/95 backdrop-blur-sm border border-white/10 rounded-lg shadow-2xl py-1 min-w-[200px] text-sm"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          {[
            { label: 'Open Terminal', icon: Terminal, action: () => { wm.openWindow('terminal'); setContextMenu(null); } },
            { label: 'View Projects', icon: Folder, action: () => { wm.openWindow('projects'); setContextMenu(null); } },
            { label: 'Contact Me', icon: Mail, action: () => { wm.openWindow('contact'); setContextMenu(null); } },
            null, // separator
            { label: 'Change Background', icon: Monitor, action: () => setContextMenu(null) },
            { label: 'About This Portfolio', icon: User, action: () => { wm.openWindow('about'); setContextMenu(null); } },
          ].map((item, i) =>
            item === null ? (
              <div key={i} className="my-1 border-t border-white/10" />
            ) : (
              <button
                key={i}
                onClick={item.action}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/10 text-gray-200 text-left transition-colors"
              >
                <item.icon size={14} className="text-gray-400" />
                {item.label}
              </button>
            )
          )}
        </div>
      )}

      {/* GNOME APP LAUNCHER OVERLAY */}
      {showAppLauncher && (
        <div
          className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-xl flex flex-col items-center pt-24 px-8 pb-12 transition-all duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAppLauncher(false);
          }}
        >
          {/* Search bar */}
          <div className="w-full max-w-2xl bg-white/10 border border-white/20 rounded-full flex items-center px-4 py-3 mb-16 shadow-lg backdrop-blur-md">
            <Search size={20} className="text-white/60 mr-3" />
            <input
              type="text"
              placeholder="Type to search..."
              className="bg-transparent border-none outline-none text-white text-lg w-full placeholder-white/50"
              autoFocus
            />
          </div>

          {/* App Grid */}
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-8 gap-y-12 max-w-5xl w-full">
            {Object.values(SYSTEM_APPS).map(app => (
              <div
                key={app.id}
                className="flex flex-col items-center gap-3 group cursor-pointer"
                onClick={() => {
                  wm.openWindow(app.id);
                  setShowAppLauncher(false);
                }}
              >
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200 ${app.color ? app.color.replace('bg-', 'bg-') : 'bg-gray-700'}`}>
                  <app.icon size={36} className="text-white" />
                </div>
                <span className="text-white text-sm font-medium drop-shadow-md text-center leading-tight px-1">{app.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WINDOWS */}
      {wm.windows.map(window => (
        <Window key={window.id} window={window} onClose={wm.closeWindow} onMinimize={wm.minimizeWindow} onMaximize={wm.maximizeWindow} onFocus={wm.focusWindow} onMove={wm.updateWindowPosition} onResize={wm.updateWindowSize}>
          {renderWindowContent(window.appId, window)}
        </Window>
      ))}
    </div>
  );
}


