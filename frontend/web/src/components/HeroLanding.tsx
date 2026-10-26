import React, { useState } from 'react';
import { 
  Rocket, 
  Coins, 
  ShieldCheck, 
  Radio, 
  Cpu, 
  Zap, 
  Check, 
  ArrowRight, 
  Layers, 
  RotateCcw, 
  Terminal, 
  Lock,
  Server
} from 'lucide-react';

interface HeroLandingProps {
  onGoToMarket: () => void;
  onGoToProvider: () => void;
  onGoToArchitecture: () => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onGoToMarket,
  onGoToProvider,
  onGoToArchitecture,
}) => {
  const [calcModel, setCalcModel] = useState<'4090' | 'A100' | '3090'>('4090');
  const [calcHours, setCalcHours] = useState<number>(100);

  const priceRates = {
    '4090': { omni: 2.1, cloud: 7.8, label: 'RTX 4090 24G' },
    'A100': { omni: 8.5, cloud: 22.0, label: 'NVIDIA A100 80G' },
    '3090': { omni: 1.2, cloud: 4.5, label: 'RTX 3090 24G' },
  };

  const currentRate = priceRates[calcModel];
  const omniCost = Math.round(currentRate.omni * calcHours);
  const cloudCost = Math.round(currentRate.cloud * calcHours);
  const savedCost = cloudCost - omniCost;

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Banner */}
      <section className="relative pt-12 pb-8 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.18),rgba(255,255,255,0))]"></div>
        
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 mb-6">
            <span>下一代分布式异构 GPU 动态调度网络</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-400">参考 AutoDL 工业级体验</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight text-balance">
            聚合全网散户与机房闲置 GPU <br />
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              成本降低 50% 的 AI 开发算力调度系统
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-slate-300 text-base md:text-lg mb-8 leading-relaxed">
            平台零显卡自持，智能统一调度成千上万个散户节点（如 A 出租 4 张 4090、B 出租 1 张 A100）。
            秒级拉起 JupyterLab、SSH 与 Docker 沙箱环境，为 10 万+ AI 开发者提供极致性价比的弹性算力。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button
              onClick={onGoToMarket}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 text-sm"
            >
              <Rocket className="w-4 h-4" />
              租赁实例 (开箱即用)
            </button>
            <button
              onClick={onGoToProvider}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Coins className="w-4 h-4 text-amber-400" />
              出租闲置显卡赚钱
            </button>
          </div>

          {/* 4-Column Proof Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur">
            <div className="text-left">
              <div className="text-2xl md:text-3xl font-extrabold text-white font-mono tabular-nums">100,000+</div>
              <div className="text-xs text-slate-400 mt-1">注册活跃 AI 开发者</div>
            </div>
            <div className="text-left">
              <div className="text-2xl md:text-3xl font-extrabold text-indigo-400 font-mono tabular-nums">1,428 卡</div>
              <div className="text-xs text-slate-400 mt-1">在线纳管异构算力池</div>
            </div>
            <div className="text-left">
              <div className="text-2xl md:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">99.5%</div>
              <div className="text-xs text-slate-400 mt-1">SLA 容灾自动漂移率</div>
            </div>
            <div className="text-left">
              <div className="text-2xl md:text-3xl font-extrabold text-cyan-400 font-mono tabular-nums">¥1.2/h</div>
              <div className="text-xs text-slate-400 mt-1">4090/3090 散户起租价</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Dual-sided Value Proposition */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">双端生态协同：打通 10 万租户与海量散户</h2>
          <p className="text-slate-400 text-sm mt-2">解决 AI 开发者“租卡贵、排队长”难题，盘活散户与矿工闲置硬件资产</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Demand: AI Developers */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-indigo-500/40 transition-colors">
            <div className="w-12 h-12 bg-indigo-600/15 text-indigo-400 rounded-xl flex items-center justify-center text-xl mb-6">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">对于 10 万+ AI 开发者 & 算法工程师</h3>
            <p className="text-xs text-slate-400 mb-6">做实验、微调大模型、跑 Diffusion 绘图，告别昂贵的传统公有云</p>

            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-white">极致价格优势：</strong> 散户 4090 仅需 ¥2.1/h，3090 仅需 ¥1.2/h，成本不到头部公有云的三分之一。
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-white">AutoDL 级易用体验：</strong> 网页一键打开 JupyterLab、VSCode Remote，或者复制 SSH 直连命令，无需繁琐配置。
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-white">算存分离与无感迁移：</strong> 数据盘与代码保存在分布式对象存储中，若散户节点意外断网，5秒内自动迁移至备用节点并恢复 Checkpoint。
                </div>
              </li>
            </ul>

            <button
              onClick={onGoToMarket}
              className="mt-8 text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors"
            >
              浏览当前可用算力节点 <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Supply: GPU Providers */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 bg-amber-600/15 text-amber-400 rounded-xl flex items-center justify-center text-xl mb-6">
              <Coins className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">对于 GPU 闲置拥有者（散户/矿工/机房）</h3>
            <p className="text-xs text-slate-400 mb-6">A 出租 4 张 4090，B 出租 1 张 A100，一键托管自动收益</p>

            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-white">一键脚本极速纳管：</strong> 一行命令安装轻量 Daemon 守护进程，自动完成基准测试与网络 P2P 打洞接入。
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-white">硬件与安全绝对隔离：</strong> 使用 Kata Container/Docker 沙箱，租户无法访问宿主机文件；内置温控保护，超过阈值自动保护。
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-white">按秒计费托管保障：</strong> 跑卡按秒计费，平台设立履约担保金，支持灵活排程（如仅夜间 22:00-08:00 闲置出租）。
                </div>
              </li>
            </ul>

            <button
              onClick={onGoToProvider}
              className="mt-8 text-sm font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
            >
              接入我的显卡节点赚钱 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Interactive Pricing Calculator */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">算力成本对比测算器</h3>
              <p className="text-xs text-slate-400">对比使用 uFreeGPU 分布式算力与传统集中式公有云的开销</p>
            </div>
            
            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-medium">
              <button
                onClick={() => setCalcModel('4090')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  calcModel === '4090' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                RTX 4090 (24G)
              </button>
              <button
                onClick={() => setCalcModel('A100')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  calcModel === 'A100' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                A100 (80G)
              </button>
              <button
                onClick={() => setCalcModel('3090')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  calcModel === '3090' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                RTX 3090 (24G)
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>预计累计训练/运行时间:</span>
              <span className="font-mono text-white text-sm font-semibold tabular-nums">{calcHours} 小时</span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={calcHours}
              onChange={(e) => setCalcHours(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-center">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">uFreeGPU 平台开销</div>
              <div className="text-2xl font-bold text-indigo-400 font-mono tabular-nums">
                ¥{omniCost}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">¥{currentRate.omni}/h 均价</div>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">传统商业公有云</div>
              <div className="text-2xl font-bold text-slate-400 font-mono tabular-nums">
                ¥{cloudCost}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">¥{currentRate.cloud}/h 行业基准</div>
            </div>

            <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-900/40">
              <div className="text-xs text-emerald-400 mb-1 font-medium">预计节省开支</div>
              <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
                ¥{savedCost}
              </div>
              <div className="text-[11px] text-emerald-500/80 mt-1">降幅高达 {Math.round((savedCost / cloudCost) * 100)}%</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Four Core Technical Pillars */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">四大核心架构：解决散户异构算力的信任与稳定</h2>
          <p className="text-slate-400 text-sm mt-2">如何让不可靠的散户硬件，对外提供金融级的稳定算力服务？</p>
        </div>

        <div className="grid md:grid-cols-4 gap-5">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="w-10 h-10 rounded-lg bg-indigo-600/10 text-indigo-400 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-white text-sm mb-2">1. Kata 沙箱安全隔离</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              散户看不到租户代码和模型！采用硬件级虚拟化容器，防止算力提供方嗅探内存与窃取研究成果。
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="w-10 h-10 rounded-lg bg-cyan-600/10 text-cyan-400 flex items-center justify-center mb-4">
              <Radio className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-white text-sm mb-2">2. P2P 穿透与加密中继</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              散户家庭宽带无公网 IP？基于 WireGuard 与 WebRTC 全自动打洞，全国骨干 BGP 网关保底中继加速。
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="w-10 h-10 rounded-lg bg-amber-600/10 text-amber-400 flex items-center justify-center mb-4">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-white text-sm mb-2">3. 故障 5 秒无感漂移</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              散户突然关机断电？JuiceFS 分布式网盘实时同步 Checkpoint，调度器 5 秒内在同档节点自动拉起续跑。
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="w-10 h-10 rounded-lg bg-emerald-600/10 text-emerald-400 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-white text-sm mb-2">4. 异构矩阵动态评分</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              自动探测 PCIe 带宽、显存体质、掉线率，划分为 Tier S/A/B 三级，为 10 万租户提供最优性价比匹配。
            </p>
          </div>
        </div>
      </section>

      {/* 5. Bottom CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-gradient-to-b from-indigo-950/40 to-slate-900 border border-indigo-900/30 rounded-2xl p-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            准备好体验极速弹性的 GPU 算力调度了吗？
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mb-6">
            新用户注册即赠送 ¥10 算力代金券，开箱即用 JupyterLab，秒级开启您的 AI 训练。
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onGoToMarket}
              className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-indigo-600/20"
            >
              前往算力商城立即选卡
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
