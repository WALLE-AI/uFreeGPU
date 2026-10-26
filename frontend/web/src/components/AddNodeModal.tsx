import React, { useState } from 'react';
import { ProviderWorker, GpuNode } from '../types/gpu';
import { 
  Server, 
  Copy, 
  Check, 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  Zap, 
  Flame, 
  ArrowRight
} from 'lucide-react';

interface AddNodeModalProps {
  onClose: () => void;
  onSuccessAdd: (newWorker: ProviderWorker, newNode: GpuNode) => void;
}

export const AddNodeModal: React.FC<AddNodeModalProps> = ({
  onClose,
  onSuccessAdd,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedOs, setSelectedOs] = useState<'ubuntu' | 'debian' | 'wsl'>('ubuntu');
  const [selectedModel, setSelectedModel] = useState<'4090' | 'A100' | '3090' | '4080'>('4090');
  const [cardCount, setCardCount] = useState<number>(4);
  const [nodeCustomName, setNodeCustomName] = useState<string>('Home-Studio-Node-02');
  const [tempLimit, setTempLimit] = useState<number>(78);

  const [testingStage, setTestingStage] = useState<'idle' | 'running' | 'success'>('idle');
  const [testLogs, setTestLogs] = useState<string[]>([]);

  const installCommand = `curl -sSL https://omnigpu.cloud/agent/install.sh | sudo bash -s -- --token=og_live_a983b_${selectedModel}_${cardCount}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Run simulated benchmark test
  const handleStartProbe = () => {
    setTestingStage('running');
    setTestLogs([
      '⚡ [1/4] 正在连接宿主机 omni-daemon 守护进程...',
      '🔍 [1/4] NVML API 初始化: 探测到 NVIDIA Driver 535.104.05, CUDA 12.2',
    ]);

    setTimeout(() => {
      setTestLogs((prev) => [
        ...prev,
        `✅ [2/4] 硬件识别成功: 发现 ${cardCount} 张 ${
          selectedModel === '4090' ? 'RTX 4090 24GB' : selectedModel === 'A100' ? 'A100 80GB' : 'RTX 3090 24GB'
        }`,
        '🚀 [2/4] PCIe Gen 4 x16 带宽压力测试通过 (28.4 GB/s), 无掉盘隐患',
      ]);
    }, 1000);

    setTimeout(() => {
      setTestLogs((prev) => [
        ...prev,
        '🌐 [3/4] 网络探测: 判定为 Full-Cone NAT, 自动建立 WireGuard P2P 加密隧道',
        '🔒 [3/4] Kata 容器安全沙箱检查通过, 宿主机根文件系统已只读锁定',
      ]);
    }, 2000);

    setTimeout(() => {
      setTestLogs((prev) => [
        ...prev,
        '🎉 [4/4] 节点认证完毕! 信誉初始评分 99.0%, 已正式接入 OmniGPU 10万租户调度池！',
      ]);
      setTestingStage('success');
    }, 3000);
  };

  const handleCompleteRegistration = () => {
    const randomCode = `#A${Math.floor(830 + Math.random() * 50)}`;
    const newWorker: ProviderWorker = {
      id: `worker-${Date.now()}`,
      ownerName: '当前散户提供者',
      nodeCode: randomCode,
      nodeName: nodeCustomName,
      os: 'Ubuntu 22.04 LTS (Kernel 5.15)',
      ipMasked: '222.66.***.*** (上海电信双千兆)',
      natMethod: 'FullCone P2P NAT (无需公网IP)',
      p2pLatencyMs: 14,
      cards: Array.from({ length: cardCount }, (_, i) => ({
        slot: i,
        model: selectedModel === '4090' ? 'NVIDIA GeForce RTX 4090 24GB' : selectedModel === 'A100' ? 'NVIDIA A100-PCIE 80GB' : 'NVIDIA RTX 3090 24GB',
        vramGb: selectedModel === 'A100' ? 80 : 24,
        temp: 42,
        fanSpeed: 40,
        powerWatt: 65,
        isOccupied: false,
      })),
      monthlyProjectedEarnings: selectedModel === '4090' ? 2100 * cardCount : 4200 * cardCount,
      settledEarningsThisMonth: 0,
      unsettledEarnings: 0,
      onlineUptimePercent: 100,
      status: 'active',
      temperatureLimit: tempLimit,
      autoSchedule: '24小时全天',
      daemonVersion: 'omni-daemon v2.4.1 (Active)',
    };

    const newNode: GpuNode = {
      id: `node-${Date.now()}`,
      nodeCode: randomCode,
      providerName: '当前散户提供者 (新增节点)',
      providerType: 'retail',
      gpuModel: selectedModel === '4090' ? 'RTX 4090' : selectedModel === 'A100' ? 'NVIDIA A100-PCIE' : 'RTX 3090',
      gpuCountTotal: cardCount,
      gpuCountAvailable: cardCount,
      vramPerCard: selectedModel === 'A100' ? 80 : 24,
      vramType: selectedModel === 'A100' ? 'HBM2e' : 'GDDR6X',
      driverVersion: '535.104.05',
      cudaVersion: '12.2',
      cpuSpecs: '16 vCPU AMD Ryzen 7950X',
      ramGb: 64,
      diskGb: 500,
      networkUploadMbps: 120,
      networkDownloadMbps: 200,
      natType: '全通内网P2P',
      pricePerHour: selectedModel === '4090' ? 2.1 : selectedModel === 'A100' ? 8.5 : 1.2,
      pricePerDay: selectedModel === '4090' ? 45 : 180,
      priceSpotPerHour: selectedModel === '4090' ? 1.45 : 5.9,
      reliabilityScore: 99.0,
      uptimeDays: 1,
      region: '华东-上海散户池',
      slaTier: 'Tier A (优质散户)',
      nvlinkSupported: false,
      tempAvgCelsius: 48,
      status: 'online',
      description: '散户新增节点，多卡就绪，已配温控与掉电保护',
    };

    onSuccessAdd(newWorker, newNode);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8">
        <div className="flex justify-between items-start pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-amber-400" />
              接入新显卡节点 · 散户供卡变现
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              只需 1 行命令安装轻量 Daemon，自动穿透 NAT，秒级接入 10 万租户调度大厅
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 text-sm"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Step 1: Select OS */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">
              1. 选择宿主机系统环境：
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'ubuntu', label: 'Ubuntu 20.04/22.04 LTS (推荐)' },
                { id: 'debian', label: 'Debian 12 / Arch Linux' },
                { id: 'wsl', label: 'Windows 11 (WSL2 直通)' },
              ].map((os) => (
                <button
                  key={os.id}
                  type="button"
                  onClick={() => setSelectedOs(os.id as any)}
                  className={`p-2.5 rounded-xl border text-left font-medium transition-colors ${
                    selectedOs === os.id
                      ? 'bg-amber-950/30 border-amber-500 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {os.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Hardware specs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                显卡型号：
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
              >
                <option value="4090">NVIDIA RTX 4090 (24GB)</option>
                <option value="A100">NVIDIA A100-PCIE (80GB)</option>
                <option value="3090">NVIDIA RTX 3090 (24GB)</option>
                <option value="4080">NVIDIA RTX 4080 (16GB)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                出租显卡张数：
              </label>
              <select
                value={cardCount}
                onChange={(e) => setCardCount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none font-mono"
              >
                <option value={1}>1 张显卡</option>
                <option value={2}>2 张显卡</option>
                <option value={4}>4 张显卡 (推荐)</option>
                <option value={8}>8 张显卡</option>
              </select>
            </div>
          </div>

          {/* Step 3: Command Generator */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-slate-300 font-semibold">
                2. 在宿主机终端执行安装命令：
              </label>
              <span className="text-[10px] text-slate-500">无需手动配置端口映射，自动建立 P2P 隧道</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-amber-300 text-[11px] overflow-x-auto">
              <span className="flex-1 select-all">{installCommand}</span>
              <button
                onClick={handleCopy}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg shrink-0 transition-colors"
                title="复制一键脚本"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Step 4: Safety & Temperature Control */}
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-400" />
                显卡最高温控安全保护阈值：
              </span>
              <span className="font-mono text-amber-400 font-bold text-sm">{tempLimit}°C</span>
            </div>
            <input
              type="range"
              min="70"
              max="85"
              step="1"
              value={tempLimit}
              onChange={(e) => setTempLimit(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">
              保护显卡寿命：当任何一张显卡温度超过 {tempLimit}°C 时，Daemon 会主动触发任务优雅迁移，绝不伤卡。
            </p>
          </div>

          {/* Step 5: Live Test & Registration Output */}
          {testingStage !== 'idle' && (
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1 max-h-36 overflow-y-auto">
              {testLogs.map((log, i) => (
                <div key={i} className={log.includes('✅') || log.includes('🎉') ? 'text-emerald-400' : 'text-slate-300'}>
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            预计该节点月收益: <strong className="text-amber-400 font-mono text-sm">
              ¥{(cardCount * (selectedModel === '4090' ? 2100 : selectedModel === 'A100' ? 4200 : 1200)).toLocaleString()}
            </strong> /月
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
            >
              取消
            </button>

            {testingStage === 'idle' && (
              <button
                onClick={handleStartProbe}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                执行连通性与硬件体检测试
              </button>
            )}

            {testingStage === 'running' && (
              <button
                disabled
                className="px-5 py-2.5 bg-slate-800 text-slate-400 rounded-xl text-xs font-bold cursor-not-allowed flex items-center gap-1.5"
              >
                <Activity className="w-3.5 h-3.5 animate-spin" />
                正在校验显卡与 NAT 隧道...
              </button>
            )}

            {testingStage === 'success' && (
              <button
                onClick={handleCompleteRegistration}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-600/25"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                完成纳管，立即上线接单
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
