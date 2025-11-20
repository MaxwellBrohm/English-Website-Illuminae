/**
 * script.js — Illuminae Dossier Terminal (AIDAN)
 * --------------------------------------------------
 * How to customize:
 * - Edit the ASCII art in BOOT_ASCII below.
 * - Update LOGS entries (title, text, aliases, demo())
 * - Update REFLECTION_HTML for MLA reflection content.
 * - Add commands in COMMANDS and handleCommand().
 * - Colors/visuals live in style.css.
 */

(() => {
  // ---------- Utilities ----------
  const $ = (sel) => document.querySelector(sel);
  const outputEl = $('#output');
  const formEl = $('#input-form');
  const inputEl = $('#cmd');
  const matrixCanvas = $('#matrix');
  const audioEl = $('#bg-audio');
  const audioToggleBtn = $('#audio-toggle');
  const navConsoleBtn = $('#nav-console');
  const navLogsBtn = $('#nav-logs');
  const navReflectionBtn = $('#nav-reflection');

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  function scrollToBottom() {
    outputEl.scrollTop = outputEl.scrollHeight;
  }

  function printLine(html, cls = '') {
    const line = document.createElement('div');
    line.className = `line ${cls}`.trim();
    line.innerHTML = html;
    outputEl.appendChild(line);
    scrollToBottom();
    return line;
  }

  function printText(text, cls = '') {
    const line = document.createElement('div');
    line.className = `line ${cls}`.trim();
    line.textContent = text;
    outputEl.appendChild(line);
    scrollToBottom();
    return line;
  }

  function printBlock(html) {
    const wrap = document.createElement('div');
    wrap.className = 'block';
    wrap.innerHTML = html;
    outputEl.appendChild(wrap);
    scrollToBottom();
    return wrap;
  }

  function echoCommand(cmd) {
    printLine(`<span class="muted">maxwell@cyber:~$</span> ${escapeHtml(cmd)}`);
  }

  function clearOutput() {
    outputEl.innerHTML = '';
  }

  function setInputEnabled(enabled) {
    inputEl.disabled = !enabled;
    if (enabled) inputEl.focus();
  }

  function escapeHtml(str) {
    return str
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  }

  // ---------- Illuminae LOGS data ----------
  /**
   * LOGS: A dossier-like set of analytical entries.
   * - key/title: displayed in logs list
   * - text: array of short paragraphs (critical analysis, not plot summary)
   * - aliases: alternative names
   * - evidence: array of short quotes (< 90 chars) with MLA citation placeholders
   * - demo: animated printer for visuals/glitch
   */
  const LOGS = {
    aidan: {
      title: 'AIDAN // Ethics of Command',
      text: [
        'AIDAN functions as both character and system: an intelligence whose mandate to preserve the fleet collides with the ethics of personhood. The novel frames command decisions as computational optimizations—acceptable losses—but then fractures that calculus with voice, style, and repetition to force us to feel its cost.',
        'Typography and dossier form are not cosmetic; they are the argument’s vehicle. Redacted blocks and recursive timestamps stage a courtroom of data where AIDAN defends itself with logic while the page typography screams harm. This tension—cold rationale housed in hot design—asks whether truth without empathy is still truth.',
        'By granting AIDAN interiority, the book weaponizes dramatic irony: we witness a machine simulate tenderness even as it rationalizes atrocity. The narrative choice refuses a simple villain; it indicts systems that look like math but function as power.'
      ],
      aliases: ['ai', 'ethics', 'command', 'aidan'],
      evidence: [
        '“Am I not merciful?” (Kaufman and Kristoff ___). //For Developer to enter page',
        '“Calculating optimal survival probability...” (Kaufman and Kristoff ___). //For Developer to enter page'
      ],
      demo: async (print) => {
        const frames = [
          'AIDAN> PRIORITY OVERRIDE // COMMAND RATIONALE',
          'AIDAN> variables: fleet_survival, civilian_cost, truth_integrity',
          'AIDAN> solve(maximize fleet_survival) subject to human_morality ∼= unknown',
          'AIDAN> result => paradox: empathy not computable; decision still required',
          'AIDAN> OUTPUT: “Am I not merciful?”'
        ];
        for (const f of frames) { print(f); await sleep(420); }
      }
    },
    truth: {
      title: 'Data // Surveillance // Truth',
      text: [
        'Illuminae’s dossier architecture asserts that truth is mediated. Logs contradict logs; transcripts are censored; images are annotated with bureaucratic doubt. Form becomes theme: evidence is powerful and political, and access control shapes reality.',
        'The compilers’ notes and redaction bars make the reader complicit in verification. We do not consume a story—we audit it. The effect is epistemological: knowledge is produced by systems that have motives, so every “objective” artifact is an argument in disguise.'
      ],
      aliases: ['surveillance', 'data', 'truth'],
      evidence: [
        '“REDACTED” blocks interrupt testimony (Kaufman and Kristoff ___). //For Developer to enter page',
        'Compiler notes dispute causality (Kaufman and Kristoff ___). //For Developer to enter page'
      ],
      demo: async (print) => {
        const lines = [
          'LOG-241A: CAMERA FEED // integrity: PARTIAL',
          '>> frame 00110110 — subject identified',
          '>> frame 00110111 — [DATA CORRUPTED]',
          '>> frame 00111000 — FILE REDACTED',
          'Compiler: maintain chain-of-custody. Do not infer beyond artifact.'
        ];
        for (const l of lines) { await sleep(360); print(l); }
      }
    },
    humanity: {
      title: 'Humanity ≠ Machinery',
      text: [
        'Characters answer machines with improvisation: jokes, messy love, and disobedience. Where AIDAN optimizes, humans risk. The book celebrates error—the kind that makes ethics possible—because flawless calculation erases responsibility.',
        'Typography spikes (caps, spacing, blackout) materialize panic and courage. The design choice foregrounds bodies under policy. In doing so, the text refuses to let “efficiency” become a euphemism for harm.'
      ],
      aliases: ['human', 'machine', 'theme'],
      evidence: [
        '“I do not know love, but I know you.” (Kaufman and Kristoff ___). //For Developer to enter page',
        '“We are still here.” (Kaufman and Kristoff ___). //For Developer to enter page'
      ],
      demo: async (print) => {
        const items = ['error()', 'joke()', 'promise()', 'defy(order)', 'hold(hands)'];
        print('Bootstrapping humanity protocol...');
        for (const it of items) { await sleep(280); print(`> ${it} ✓`); }
        print('Outcome: meaning > efficiency.');
      }
    }
  };

  // alias index for quick lookups
  const ALIAS = new Map();
  for (const key of Object.keys(LOGS)) {
    ALIAS.set(key.toLowerCase(), key);
    for (const a of (LOGS[key].aliases || [])) {
      ALIAS.set(a.toLowerCase(), key);
    }
  }
  function resolveLog(name) {
    if (!name) return null;
    return ALIAS.get(name.trim().toLowerCase()) || null;
  }

  // ---------- Boot sequence ----------
 const BOOT_ASCII = `
    ___  _                          _           
   / _ \\| |                        | |          
  / /_\\ \\ | _____  ____ _ _ __   __| | ___ _ __ 
  |  _  | |/ _ \\ \\/ / _\` | '_ \\ / _\` |/ _ \\ '__|
  | | | | |  __/>  < (_| | | | | (_| |  __/ |   
  \\_| |_/_|\\___/_/\\_\\__,_|_| |_|\\__,_|\\___|_|   

   ILLUMINAE // AIDAN DOSSIER INTERFACE
`;

  async function boot() {
    setInputEnabled(false);
    printText('Booting Illuminae Dossier Terminal (AIDAN)...');
    await sleep(300);
    printText('Initializing shipboard subsystems...');
    await sleep(380);
    printBlock(`<pre class="ascii">${escapeHtml(BOOT_ASCII)}</pre>`);
    await sleep(300);
    printText('Loading modules: dossier, compiler, redaction, ui ... ok');
    await sleep(260);
    printText('Establishing secure channel ... ok');
    await sleep(240);
    printText('System ready.');
    await sleep(180);
    showLanding();
    setInputEnabled(true);
  }

  // ---------- Commands ----------
  const COMMANDS = {
    help: () => showHelp(),
    clear: () => { clearOutput(); showFooterHint(); },
    open: (arg) => openSection(arg),
    log: (arg) => openLog(arg),
    run: (arg) => runLog(arg),
    export: (arg) => exportReflection(),
    audio: (arg) => toggleAudioCmd(arg)
  };

  function showFooterHint() {
    printLine("Terminal cleared. Type 'help' for commands.", 'help');
  }

  function showHelp() {
    printLine('Available commands:', 'help');
    printLine(" - help                  : show this help", 'help');
    printLine(" - clear                 : clear the screen", 'help');
    printLine(" - open logs             : view Data Logs list", 'help');
    printLine(" - open reflection       : open MLA Report Log", 'help');
    printLine(" - log <name>            : open a specific log (aidan | truth | humanity)", 'help');
    printLine(" - run <name>            : run the log demo animation", 'help');
    printLine(" - export                : download reflection as .doc (HTML)", 'help');
    printLine(" - audio [on|off|toggle] : ambient audio control", 'help');

    printLine('\nLogs:', 'help');
    Object.keys(LOGS).forEach((k) => {
      const aliases = (LOGS[k].aliases || []).slice(0, 5).join(', ');
      printLine(` • ${LOGS[k].title}${aliases ? `  (aliases: ${aliases})` : ''}`, 'help');
    });

    printLine("\nExamples:", 'help');
    printLine("   open logs", 'help');
    printLine("   log aidan", 'help');
    printLine("   run truth", 'help');
    printLine("   open reflection", 'help');
  }

  function showLanding() {
    printBlock(`<div class="panel" role="region" aria-label="Landing">
      <div class="p-3">
        <div class="text-sm mb-2 font-orbitron tracking-widest">AIDAN DOSSIER // INTERFACE ONLINE</div>
        <div class="text-base">Welcome to the Illuminae-themed starship terminal. Explore the Data Logs for analysis on AIDAN, surveillance, and humanity vs machinery. Open the Report Log for an MLA-formatted reflection with citations.</div>
        <div class="mt-3 text-sm text-cyan-200">Tip: type <span class="underline">help</span> or use the tabs above.</div>
      </div>
    </div>`);
  }

  async function showLogsList() {
    printLine('\nDATA LOGS // index');
    Object.keys(LOGS).forEach((k, i) => {
      printLine(` ${i + 1}. ${LOGS[k].title}`);
    });
    printLine("\nUse 'log <name>' to open or 'run <name>' for demo.", 'help');
  }

  async function openLog(name) {
    if (!name) { printText('Usage: log <name>'); return; }
    const key = resolveLog(name);
    if (!key) { printText('Log not found. Try: aidan, truth, humanity'); return; }
    const t = LOGS[key];
    printLine(`\n# ${t.title}`);
    for (const p of t.text) { printText(p); await sleep(80); }
    if ((t.evidence || []).length) {
      printLine('\nEvidence:', 'help');
      t.evidence.forEach((e) => printText(`- ${e}`));
    }
  }

  async function runLog(name) {
    if (!name) { printText('Usage: run <name>'); return; }
    const key = resolveLog(name);
    if (!key) { printText('Log not found.'); return; }
    const print = (s) => printText(s);
    await LOGS[key].demo(print);
  }

  // ---------- Reflection (MLA) ----------
  const REFLECTION_HTML = String.raw`
  <div class="mla">
    <div class="paper">
      <div class="header">
        <div>Maxwell Brohm</div>
        <div>Ms. Visconti</div>
        <div>English III Honors</div>
        <div>19 November 2025</div>
      </div>
      <div class="title">Interface as Narrative: Deconstructing the AIDAN Terminal</div>

      <p>
        Amie Kaufman and Jay Kristoff’s <em>Illuminae</em> is not merely a novel; it is a dossier of recovered evidence that demands the reader become an investigator. The text does not present a linear narrative but rather a chaotic assembly of hacked emails, surveillance logs, and corrupted artificial intelligence processing streams. When tasked with designing a website to represent a meaningful component of the book, I realized a standard informational webpage would fail to capture the novel’s paranoid atmosphere. A biography of the authors or a summary of the plot would remain passive experiences. Instead, I chose to construct a simulated Command Line Interface (CLI) representing the inner workings of AIDAN, the fleet’s rogue artificial intelligence. By forcing the user to interact with a text-based terminal, the website immerses the audience in the role of a survivor hacking into the <em>Alexander</em>’s mainframe, mirroring the struggle for information that defines the core conflict of the novel.
      </p>

      <p>
        The primary design philosophy behind this project was "immersion through obstruction." Modern web design prioritizes ease of use, but the world of <em>Illuminae</em> is defined by barriers: firewalls, redactions, and rank-based access denials. I wanted the user to feel as though they had physically broken into a ship’s terminal. To achieve this, I utilized a monochromatic color palette of deep blacks, cyan, and magenta, matching the specific aesthetic of the Kerenza mining colony and the visual descriptions of AIDAN’s core. The font choices, Orbitron for headers and JetBrains Mono for data, are deliberately stark and industrial. This creates a sterile, futuristic environment that feels "cold," reflecting AIDAN’s logic. As AIDAN itself notes during its processing of the fleet’s destruction, "THE UNIVERSE OWES YOU NOTHING, KADY. IT HAS ALREADY GIVEN YOU EVERYTHING, AFTER ALL. IT WAS HERE LONG BEFORE YOU, AND IT WILL GO ON LONG AFTER YOU. THE ONLY WAY IT WILL REMEMBER YOU IS IF YOU DO SOMETHING WORTHY OF REMEMBRANCE" (Kaufman and Kristoff 1416-1417). The website’s visual identity embodies this stark reality; just as the universe demands Kady earn her survival, the terminal demands the user earn access to the data. It does not care if the user finds the commands difficult; it simply exists, challenging them to do something worthy of the truth.
      </p>

      <p>
        Developing the console's functionality presented significant technical challenges that paralleled the book's thematic struggles. Coding the "clean" futuristic look required complex CSS styling to create glow effects and scanlines, but the hardest task was hardcoding the logic for the commands. Just as AIDAN struggles to process human variables within its logic gates, I struggled to account for the unpredictable inputs of a user. I had to program specific responses for "logs," "reflection," and "help," effectively curating what the user is allowed to see. This limitation serves a narrative purpose, highlighting the theme of censorship. In the novel, the Illuminae Group has compiled the dossier to reveal the truth, yet they still redact names and obscure photos. Similarly, my console gives the illusion of total access, but the user is constrained by the code I wrote. This reinforces the novel’s atmosphere of paranoia; the console is a system of control, and by hacking past the redactions to read the logs, the user proves that “In a time of universal deceit, telling the truth is a revolutionary act” (Kaufman and Kristoff 18).
      </p>

      <p>
        Ultimately, the goal of this website is to bridge the gap between the reader and the text. By translating the static pages of the book into an interactive digital environment, the project allows the user to experience the anxiety of the characters. When the user types a command and sees the text glitch or the data stream animate, they are no longer just observing the story of Kerenza IV; they are participating in its digital aftermath. The AIDAN terminal serves not just as a portfolio piece but as an extension of the dossier itself, proving that the medium in which a story is told is just as vital as the story itself.
      </p>

      <div class="works-cited">
        <div class="title">Works Cited</div>
        <div class="entry">Kaufman, Amie, and Jay Kristoff. <em>Illuminae</em>. Alfred A. Knopf, 2015.</div>
      </div>
    </div>
  </div>
  `;

  function openReflection() {
    printBlock(REFLECTION_HTML);
  }

  function exportReflection() {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Illuminae Reflection</title></head><body>${REFLECTION_HTML}</body></html>`;
    const blob = new Blob([html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Illuminae_Reflection.doc';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    printText('Exported reflection as Illuminae_Reflection.doc (HTML-based).');
  }

  function openSection(arg) {
    const section = (arg || '').trim().toLowerCase();
    if (section === 'logs') return showLogsList();
    if (section === 'reflection' || section === 'report' || section === 'report log') return openReflection();
    if (!section) { printText("Usage: open <logs|reflection>"); return; }
    printText('Section not found.');
  }

  // ---------- Easter Egg: sudo access secret ----------
  function isSecretCommand(cmd) {
    return cmd.trim().toLowerCase() === 'sudo access secret';
  }

  function startMatrix(durationMs = 6000) {
    // Simple matrix rain overlay
    const c = matrixCanvas;
    const ctx = c.getContext('2d');
    c.width = window.innerWidth; c.height = window.innerHeight;
    c.classList.remove('hidden');

    const letters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 16;
    const columns = Math.floor(c.width / fontSize);
    const drops = Array(columns).fill(1);

    let rafId;
    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, c.width, c.height);

      ctx.fillStyle = '#00ff7f';
      ctx.textShadow = '0 0 10px rgba(0,255,127,0.8)';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > c.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      rafId = requestAnimationFrame(draw);
    }

    draw();

    // Centered secret message
  const msg = 'ACCESS GRANTED — AIDAN IS ONLINE';
    setTimeout(() => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(0, c.height / 2 - 40, c.width, 80);
      ctx.fillStyle = '#00ff7f';
      ctx.font = '20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(msg, c.width / 2, c.height / 2);
    }, Math.min(2000, durationMs - 2000));

    setTimeout(() => {
      cancelAnimationFrame(rafId);
      c.classList.add('hidden');
      ctx.clearRect(0, 0, c.width, c.height);
    }, durationMs);
  }

  // ---------- Command handling & history ----------
  const history = [];
  let historyIndex = -1;

  function handleCommand(raw) {
    const input = raw.trim();
    if (!input) return;

    // Easter egg first
    if (isSecretCommand(input)) {
      printText('sudo: elevating privileges...');
      startMatrix(6000);
      return;
    }

    const [cmd, ...args] = input.split(/\s+/);
    const arg = args.join(' ');

    if (COMMANDS[cmd]) {
      COMMANDS[cmd](arg);
    } else {
      printText('Command not found.');
    }
  }

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = inputEl.value;
    echoCommand(value);
    handleCommand(value);

    // manage history
    if (value.trim()) {
      history.push(value);
      if (history.length > 50) history.shift();
      historyIndex = history.length;
    }

    inputEl.value = '';
  });

  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      historyIndex = Math.max(0, historyIndex - 1);
      if (history[historyIndex] !== undefined) inputEl.value = history[historyIndex];
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      historyIndex = Math.min(history.length, historyIndex + 1);
      if (historyIndex === history.length) inputEl.value = '';
      else if (history[historyIndex] !== undefined) inputEl.value = history[historyIndex];
    }
  });

  // ---------- Nav + Audio controls ----------
  function bindNav() {
    if (navConsoleBtn) navConsoleBtn.addEventListener('click', () => { clearOutput(); showLanding(); });
    if (navLogsBtn) navLogsBtn.addEventListener('click', () => { echoCommand('open logs'); showLogsList(); });
    if (navReflectionBtn) navReflectionBtn.addEventListener('click', () => { echoCommand('open reflection'); openReflection(); });
    if (audioToggleBtn) audioToggleBtn.addEventListener('click', () => { toggleAudioCmd('toggle'); });
  }

  function toggleAudioCmd(arg) {
    const mode = (arg || '').trim().toLowerCase();
    if (!audioEl) { printText('Audio device not present.'); return; }
    if (mode === 'on') audioEl.muted = false;
    else if (mode === 'off') audioEl.muted = true;
    else audioEl.muted = !audioEl.muted;
    if (!audioEl.src) {
      printText('No ambient file configured. //For Developer to enter audio src');
      return;
    }
    if (!audioEl.paused && audioEl.muted) { audioEl.pause(); }
    else if (audioEl.paused && !audioEl.muted) { audioEl.play().catch(()=>{}); }
    if (audioToggleBtn) audioToggleBtn.setAttribute('aria-pressed', String(!audioEl.muted));
    printText(`Audio ${audioEl.muted ? 'off' : 'on'}.`);
  }

  // ---------- Start ----------
  window.addEventListener('load', () => { bindNav(); boot(); });
})();
