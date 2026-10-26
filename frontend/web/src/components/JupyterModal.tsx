import React, { useState } from 'react';
import { UserInstance } from '../types/gpu';
import { 
  Play, 
  RotateCcw, 
  Plus, 
  FileCode, 
  Folder, 
  Save, 
  Terminal, 
  Check, 
  Cpu, 
  Maximize2,
  HardDrive
} from 'lucide-react';

interface JupyterModalProps {
  instance: UserInstance;
  onClose: () => void;
}

export const JupyterModal: React.FC<JupyterModalProps> = ({
  instance,
  onClose,
}) => {
  const [isRunningCell1, setIsRunningCell1] = useState<boolean>(false);
  const [cell1Output, setCell1Output] = useState<string | null>(
    `CUDA Available: True\nDevice 0: NVIDIA GeForce ${instance.gpuModel} (24GB VRAM)\nCompute Capability: 8.9\nInitial Allocated VRAM: 0.72 GB`
  );

  const [isRunningCell2, setIsRunningCell2] = useState<boolean>(false);
  const [cell2Output, setCell2Output] = useState<string | null>(null);

  const [userCode, setUserCode] = useState<string>(
    `# 在散户显卡上即时训练测试\nimport time\nprint(f"当前节点编号: ${instance.nodeCode} | 运行正常")`
  );
  const [userOutput, setUserOutput] = useState<string | null>(null);

  const handleRunCell1 = () => {
    setIsRunningCell1(true);
    setTimeout(() => {
      setCell1Output(
        `CUDA Available: True\nDevice 0: NVIDIA GeForce ${instance.gpuModel} (${instance.vramTotalGb}GB VRAM)\nPyTorch Version: 2.4.0+cu124\nAllocated VRAM: 1.84 GB / ${instance.vramTotalGb} GB (Active)`
      );
      setIsRunningCell1(false);
    }, 600);
  };

  const handleRunCell2 = () => {
    setIsRunningCell2(true);
    setTimeout(() => {
      const ms = (12.4 + Math.random() * 3).toFixed(2);
      const tflops = (145 + Math.random() * 20).toFixed(1);
      setCell2Output(
        `[PyTorch CUDA Benchmark]\n• 10000x10000 FP32 GEMM 耗时: ${ms} ms\n• 实测等效算力: ~${tflops} TFLOPS\n• 显卡当前核心温度: 58°C (运行正常)`
      );
      setIsRunningCell2(false);
    }, 900);
  };

  const handleRunUserCode = () => {
    setUserOutput(
      `当前节点编号: ${instance.nodeCode} | 运行正常\n挂载 JuiceFS 分布式网盘: /root/autodl-tmp (${instance.diskTotalGb} GB 可用)\n进程执行退出代码: 0 (Success)`
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-hidden">
      <div className="bg-[#1e1e1e] border border-slate-700 rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Jupyter Top Menu */}
        <div className="bg-[#2d2d2d] border-b border-slate-700 px-4 py-2 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold font-mono text-[11px]">
                J
              </div>
              <span className="font-bold text-white">JupyterLab 4.1</span>
            </div>

            <div className="hidden sm:flex items-center gap-3 text-slate-400 text-[11px]">
              <span className="hover:text-white cursor-pointer">File</span>
              <span className="hover:text-white cursor-pointer">Edit</span>
              <span className="hover:text-white cursor-pointer">View</span>
              <span className="hover:text-white cursor-pointer">Run</span>
              <span className="hover:text-white cursor-pointer">Kernel</span>
              <span className="hover:text-white cursor-pointer">Settings</span>
            </div>

            <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
              [main_experiment.ipynb] · 宿主节点 {instance.nodeCode}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Python 3.11 (ipykernel) · 空闲
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white px-2 py-1 rounded text-xs"
            >
              关闭
            </button>
          </div>
        </div>

        {/* Jupyter Main Workspace Split */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left File Tree Sidebar */}
          <div className="w-48 sm:w-56 bg-[#252526] border-r border-slate-700 p-3 flex flex-col justify-between text-xs text-slate-300 select-none">
            <div className="space-y-1">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-2">
                文件浏览器
              </div>

              <div className="flex items-center gap-2 py-1 px-2 rounded hover:bg-[#2a2d2e] cursor-pointer text-slate-400">
                <Folder className="w-3.5 h-3.5 text-indigo-400" />
                <span>autodl-tmp (网盘)</span>
              </div>
              <div className="flex items-center gap-2 py-1 px-2 rounded hover:bg-[#2a2d2e] cursor-pointer text-slate-400">
                <Folder className="w-3.5 h-3.5 text-indigo-400" />
                <span>checkpoints/</span>
              </div>
              <div className="flex items-center gap-2 py-1 px-2 rounded hover:bg-[#2a2d2e] cursor-pointer text-slate-400">
                <Folder className="w-3.5 h-3.5 text-indigo-400" />
                <span>datasets/</span>
              </div>
              <div className="flex items-center gap-2 py-1 px-2 rounded bg-[#37373d] text-white cursor-pointer font-medium">
                <FileCode className="w-3.5 h-3.5 text-amber-400" />
                <span>main_experiment.ipynb</span>
              </div>
              <div className="flex items-center gap-2 py-1 px-2 rounded hover:bg-[#2a2d2e] cursor-pointer text-slate-400">
                <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                <span>train_lora.py</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-700 text-[11px] text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>GPU 型号:</span>
                <span className="font-mono text-white">{instance.gpuModel}</span>
              </div>
              <div className="flex justify-between">
                <span>显存:</span>
                <span className="font-mono text-emerald-400">{instance.vramTotalGb}GB</span>
              </div>
            </div>
          </div>

          {/* Right Notebook Canvas */}
          <div className="flex-1 bg-[#1e1e1e] p-4 md:p-6 overflow-y-auto space-y-6">
            {/* Cell 1: Environment & CUDA Check */}
            <div className="bg-[#252526] border border-slate-700 rounded-xl overflow-hidden shadow-lg">
              <div className="bg-[#2d2d2d] px-3 py-1.5 flex items-center justify-between text-xs text-slate-400 border-b border-slate-700">
                <span className="font-mono text-[11px] text-amber-400">[1] CUDA 设备初始化检查</span>
                <button
                  onClick={handleRunCell1}
                  disabled={isRunningCell1}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
                >
                  <Play className="w-3 h-3" />
                  {isRunningCell1 ? '执行中...' : '运行单元格 (Shift+Enter)'}
                </button>
              </div>

              <div className="p-3.5 font-mono text-xs text-slate-200 bg-[#1e1e1e]">
                <pre>{`import torch
print("CUDA Available:", torch.cuda.is_available())
print(f"Device 0: {torch.cuda.get_device_name(0)}")
print(f"Compute Capability: {torch.cuda.get_device_capability(0)}")
print(f"Initial Allocated VRAM: {round(torch.cuda.memory_allocated(0)/(1024**3), 2)} GB")`}</pre>
              </div>

              {cell1Output && (
                <div className="p-3.5 bg-[#181818] border-t border-slate-800 font-mono text-xs text-emerald-400 whitespace-pre-wrap">
                  {cell1Output}
                </div>
              )}
            </div>

            {/* Cell 2: GPU Benchmark Matrix multiplication */}
            <div className="bg-[#252526] border border-slate-700 rounded-xl overflow-hidden shadow-lg">
              <div className="bg-[#2d2d2d] px-3 py-1.5 flex items-center justify-between text-xs text-slate-400 border-b border-slate-700">
                <span className="font-mono text-[11px] text-amber-400">[2] 显卡 10000x10000 FP32 算力压测</span>
                <button
                  onClick={handleRunCell2}
                  disabled={isRunningCell2}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
                >
                  <Play className="w-3 h-3" />
                  {isRunningCell2 ? '压测中...' : '运行压测单元格'}
                </button>
              </div>

              <div className="p-3.5 font-mono text-xs text-slate-200 bg-[#1e1e1e]">
                <pre>{`# 验证当前散户显卡的实际 TFLOPS 吞吐能力
x = torch.randn(10000, 10000, device='cuda')
start = torch.cuda.Event(enable_timing=True)
end = torch.cuda.Event(enable_timing=True)
start.record()
y = torch.matmul(x, x)
end.record()
torch.cuda.synchronize()
print(f"[PyTorch CUDA Benchmark]\\n• 10000x10000 FP32 GEMM 耗时: {start.elapsed_time(end):.2f} ms")`}</pre>
              </div>

              {cell2Output && (
                <div className="p-3.5 bg-[#181818] border-t border-slate-800 font-mono text-xs text-cyan-300 whitespace-pre-wrap">
                  {cell2Output}
                </div>
              )}
            </div>

            {/* Cell 3: Interactive scratchpad */}
            <div className="bg-[#252526] border border-slate-700 rounded-xl overflow-hidden shadow-lg">
              <div className="bg-[#2d2d2d] px-3 py-1.5 flex items-center justify-between text-xs text-slate-400 border-b border-slate-700">
                <span className="font-mono text-[11px] text-slate-400">[3] 自定义 Python 交互编辑</span>
                <button
                  onClick={handleRunUserCode}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
                >
                  <Play className="w-3 h-3" />
                  执行代码
                </button>
              </div>

              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                rows={3}
                className="w-full p-3.5 font-mono text-xs text-white bg-[#1e1e1e] focus:outline-none resize-none"
              />

              {userOutput && (
                <div className="p-3.5 bg-[#181818] border-t border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap">
                  {userOutput}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
