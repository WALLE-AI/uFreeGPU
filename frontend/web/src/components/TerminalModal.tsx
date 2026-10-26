import React, { useState, useRef, useEffect } from 'react';
import { UserInstance } from '../types/gpu';
import { Terminal as TerminalIcon, X, Maximize2, Sparkles } from 'lucide-react';

interface TerminalModalProps {
  instance: UserInstance;
  onClose: () => void;
}

export const TerminalModal: React.FC<TerminalModalProps> = ({
  instance,
  onClose,
}) => {
  const [history, setHistory] = useState<Array<{ cmd?: string; out: string; type: 'cmd' | 'out' }>>([
    {
      out: `Linux omnigpu-${instance.id} 5.15.0-105-generic #115-Ubuntu SMP\nWelcome to OmniGPU Sandboxed Environment (AutoDL Equivalent)\nAll files in /root/autodl-tmp are backed up to distributed storage.\nType 'nvidia-smi', 'df -h', or 'help' to start.`,
      type: 'out'
    }
  ]);
  const [currentInput, setCurrentInput] = useState<string>('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase() === 'clear') {
      setHistory([]);
      setCurrentInput('');
      return;
    }

    let output = '';
    const lower = trimmed.toLowerCase();

    if (lower === 'nvidia-smi') {
      output = `+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 535.104.05             Driver Version: 535.104.05     CUDA Version: 12.2     |
|-----------------------------------------+------------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
|                                         |                        |               MIG M. |
|=========================================+========================+======================|
|   0  NVIDIA GeForce ${instance.gpuModel.padEnd(16, ' ')} On   | 00000000:01:00.0   Off |                  N/A |
| 62%   58C    P2             345W / 450W |  ${instance.vramUsedGb * 1024}MiB / ${instance.vramTotalGb * 1024}MiB |    ${instance.gpuUsagePercent}%      Default |
|                                         |                        |                  N/A |
+-----------------------------------------+------------------------+----------------------+
                                                                                         
+-----------------------------------------------------------------------------------------+
| Processes:                                                                              |
|  GPU   GI   CI        PID   Type   Process name                              GPU Memory |
|        ID   ID                                                               Usage      |
|=========================================================================================|
|    0   N/A  N/A      8419      C   /usr/bin/python3 (train_worker)             21840MiB |
+-----------------------------------------------------------------------------------------+`;
    } else if (lower === 'df -h') {
      output = `Filesystem                     Size  Used Avail Use% Mounted on
overlay                         50G   14G   36G  28% /
tmpfs                           32G     0   32G   0% /dev/shm
juicefs://omnigpu-cluster      500G  112G  388G  23% /root/autodl-tmp (分布式网盘)`;
    } else if (lower === 'python -v' || lower === 'python3 --version' || lower === 'python --version') {
      output = `Python 3.11.8 (main, Feb 12 2026, 14:50:00) [GCC 11.4.0 on linux]`;
    } else if (lower === 'help') {
      output = `支持的交互式测试命令:
• nvidia-smi   - 查看显卡状态与 VRAM 显存占用
• df -h        - 查看本地系统盘与分布式 JuiceFS 网盘挂载
• python       - 运行 Python 环境
• uname -a     - 查看沙箱宿主内核版本
• clear        - 清屏`;
    } else if (lower.startsWith('cat') || lower.startsWith('ls')) {
      output = `autodl-tmp  checkpoints  datasets  main_experiment.ipynb  requirements.txt  train_lora.py`;
    } else {
      output = `omnigpu: ${trimmed}: command executed successfully (exit code 0)`;
    }

    setHistory((prev) => [
      ...prev,
      { cmd: trimmed, out: output, type: 'cmd' },
      { out: output, type: 'out' }
    ]);
    setCurrentInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-hidden">
      <div className="bg-[#0c0c0c] border border-slate-700 rounded-2xl w-full max-w-4xl h-[75vh] flex flex-col shadow-2xl overflow-hidden font-mono text-xs">
        {/* Terminal Header */}
        <div className="bg-[#1a1a1a] border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white text-xs">
              Web Terminal - root@omnigpu-{instance.id} (宿主节点 {instance.nodeCode})
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Command Bar */}
        <div className="bg-[#141414] border-b border-slate-800/80 px-4 py-2 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-500 shrink-0">快捷指令:</span>
          {['nvidia-smi', 'df -h', 'ls -la', 'python --version', 'help', 'clear'].map((cmd) => (
            <button
              key={cmd}
              onClick={() => executeCommand(cmd)}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-colors"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Terminal Screen Canvas */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-slate-200 font-mono">
          {history.map((item, idx) => {
            if (item.type === 'cmd') {
              return (
                <div key={idx} className="flex items-center gap-2 text-cyan-400 font-bold">
                  <span>root@omnigpu-{instance.id}:~#</span>
                  <span className="text-white">{item.cmd}</span>
                </div>
              );
            }
            return (
              <div key={idx} className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                {item.out}
              </div>
            );
          })}

          {/* Active Input Line */}
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <span>root@omnigpu-{instance.id}:~#</span>
            <input
              type="text"
              autoFocus
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-white focus:outline-none font-mono"
            />
          </div>

          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
};
