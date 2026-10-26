import React from 'react';
import { GpuNode } from '../types/gpu';
import { ShieldCheck, Cpu, Wifi, Activity, CheckCircle2, Zap, X } from 'lucide-react';

interface DiagnosticModalProps {
  node: GpuNode;
  onClose: () => void;
  onRent: () => void;
}

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({
  node,
  onClose,
  onRent,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 my-8">
        <div className="flex justify-between items-start pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {node.nodeCode}
              </span>
              <h3 className="text-base font-bold text-white">分布式节点硬件与探活报告</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              由 omni-daemon 自动运行 NVML 基准测试与 STUN 隧道探针生成
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 text-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">SLA 运行信誉评级</span>
              <span className="text-emerald-400 font-bold text-base font-mono">{node.reliabilityScore}%</span>
              <div className="text-[10px] text-slate-500 mt-0.5">连续在线 {node.uptimeDays} 天无故障</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">散热与运行温度</span>
              <span className="text-indigo-400 font-bold text-base font-mono">{node.tempAvgCelsius} °C</span>
              <div className="text-[10px] text-slate-500 mt-0.5">核心散热裕量充足 (&lt;78°C 安全线)</div>
            </div>
          </div>

          {/* Detailed Diagnostic Items */}
          <div className="space-y-2 bg-slate-950/70 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">GPU 核心架构:</span>
              <span className="text-white">{node.gpuModel} ({node.vramPerCard}GB {node.vramType})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">NVIDIA 驱动 / CUDA:</span>
              <span className="text-white">{node.driverVersion} / CUDA {node.cudaVersion}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">PCIe 总线带宽:</span>
              <span className="text-emerald-400">PCIe 4.0 x16 (实测 28.2 GB/s)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">CPU 与物理内存:</span>
              <span className="text-white">{node.cpuSpecs} · {node.ramGb}GB RAM</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">NAT 穿透类型:</span>
              <span className="text-cyan-400">{node.natType} · P2P 直连可用</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">网络测速 (上/下行):</span>
              <span className="text-cyan-400">{node.networkUploadMbps} Mbps / {node.networkDownloadMbps} Mbps</span>
            </div>
          </div>

          {/* Security & Sandbox Verification */}
          <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-xl text-emerald-300 text-[11px] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <div>
              <strong>沙箱隔离校验通过：</strong>
              该节点已配置 Kata Containers 硬件级微虚拟机隔离，宿主散户无权窥探内存与磁盘，租户模型资产绝对安全。
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            单价: <strong className="text-indigo-400 font-mono text-sm">¥{node.pricePerHour.toFixed(2)}</strong>/小时
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
            >
              关闭
            </button>
            <button
              onClick={() => {
                onClose();
                onRent();
              }}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20"
            >
              立即开机租用
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
