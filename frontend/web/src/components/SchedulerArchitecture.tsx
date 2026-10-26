import React, { useState } from 'react';
import { SchedulingSimulationTask } from '../types/gpu';
import { SIMULATION_TASKS } from '../data/mockData';
import { 
  Layers, 
  Cpu, 
  ShieldCheck, 
  RotateCcw, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  HardDrive, 
  Zap, 
  Database,
  ArrowRight,
  Server
} from 'lucide-react';

export const SchedulerArchitecture: React.FC = () => {
  const [tasks, setTasks] = useState<SchedulingSimulationTask[]>(SIMULATION_TASKS);
  const [outageSimulated, setOutageSimulated] = useState<boolean>(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([
    '[06:58:02] [SCHEDULER] 调度系统初始化就绪，已纳管 1,428 个异构 GPU 计算节点',
    '[06:58:14] [QOS_ENGINE] 节点 #A829 (4x 4090) 探活正常，PCIe 4.0 x16 带宽 28.4 GB/s，评定为 Tier A',
    '[06:58:20] [QOS_ENGINE] 节点 #B102 (1x A100) 探活正常，独享公网 BGP，评定为 Tier S',
    '[06:59:01] [MATCHMAKER] 成功为用户 task-101 匹配最优散户卡 #A829:Slot0 (¥2.10/h)'
  ]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setSimulationLogs((prev) => [`[${time}] ${msg}`, ...prev.slice(0, 15)]);
  };

  // Simulate Sudden Outage of retail miner A
  const handleSimulateOutage = () => {
    setOutageSimulated(true);
    addLog('[CRITICAL] 🚨 探测到散户节点 #A829 心跳中断！连续 3 秒无回应 (可能发生家庭断电或拔网线)');
    addLog('[STORAGE] 🔒 触发分布式存储安全锁：JuiceFS 数据盘立即冻结只读快照，防止数据损坏');
    
    // Update task-101 to migrating
    setTasks((prev) =>
      prev.map((t) =>
        t.matchedNodeId === 'node-a829'
          ? {
              ...t,
              status: '容灾漂移保护',
              matchedNodeCode: '正在寻找同档备用节点...',
            }
          : t
      )
    );

    // After 2.5s, auto-reschedule to standby node
    setTimeout(() => {
      addLog('[FAILOVER] ⚡ 调度决策引擎在备用池中命中同档节点 #D205 (备用 4090 / 华中联通)');
      addLog('[CONTAINER] 🚀 在新节点秒级拉起预热镜像容器，挂载同一份网络持久盘');
      addLog('[RECOVERY] ✅ 训练任务无缝续跑！从最近的 Epoch Checkpoint 自动恢复，总耗时 3.4 秒');
      
      setTasks((prev) =>
        prev.map((t) =>
          t.matchedNodeId === 'node-a829'
            ? {
                ...t,
                status: '运行中',
                matchedNodeId: 'node-d205',
                matchedNodeCode: '#D205 (自动容灾备用节点)',
                reason: '节点A异常掉线，调度系统已在4秒内自动漂移至同型号备用4090，数据0丢失',
              }
            : t
        )
      );
    }, 2500);
  };

  const handleResetSimulation = () => {
    setOutageSimulated(false);
    setTasks(SIMULATION_TASKS);
    addLog('[SYSTEM] 🔄 仿真器重置至初始多用户调度状态');
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-indigo-400" />
          异构 GPU 动态调度系统 · 架构全景与容灾方案
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          针对“平台零自持显卡，通过调度散户与机房杂乱显卡赋能 10 万+ AI 开发者”的工业级系统架构落地指导
        </p>
      </div>

      {/* 1. Core Architectural Pillars Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Layer 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">1. 边缘守护引擎 (omni-daemon)</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              散户节点安装后运行的轻量级 Linux Daemon，负责全自动化纳管与探活。
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span><strong>硬件基准测试：</strong> 自动探测 CUDA 版本、PCIe Gen 吞吐、显存带宽与散热体质。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span><strong>Kata 安全沙箱：</strong> 租户代码与容器运行在独立轻量级虚拟层，散户绝对无法偷看租户模型和代码。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span><strong>秒级心跳探针：</strong> 1秒一次健康检查，温度过高（&gt;78°C）自动降频并保护散户硬件寿命。</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Layer 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-cyan-600/10 text-cyan-400 flex items-center justify-center mb-4">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">2. P2P 穿透与隧道中继网关</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              解决“散户 95% 处于家庭宽带、无公网 IP、NAT 层级复杂”的核心网络痛点。
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span><strong>STUN/TURN 动态穿透：</strong> 支持 Full-Cone 和对称 NAT 打洞，建立直接点对点加密通道。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span><strong>全国 BGP 骨干中继保底：</strong> 打洞失败时，流量无缝走北京/上海/广州高速中继节点，保证 SSH 与 Jupyter 延迟 &lt;30ms。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span><strong>虚拟网络端口映射：</strong> 用户终端直接访问 <code>connect.omnigpu.cloud:PORT</code> 即可直通散户容器。</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Layer 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-600/10 text-amber-400 flex items-center justify-center mb-4">
              <HardDrive className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">3. 算存分离与故障无感漂移</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              散户随时可能关机拔网线？依靠算存分离架构彻底解决可靠性危机。
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>数据不落散户盘：</strong> 租户所有数据集、代码和权重挂载在分布式存储 (JuiceFS/S3) 上，本地仅作只读缓存。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>自动 Checkpoint 快照：</strong> 训练框架自动每 15 分钟或每 Epoch 保存状态到分布式数据盘。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>5秒热备漂移：</strong> 散户掉线后，调度器立刻在同档备用节点拉起镜像，挂载原数据盘并继续训练。</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Interactive Scheduler Simulation Sandbox */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-base font-bold text-white">
                10 万用户请求与异构散户卡 · 实时调度算法沙盘
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              测试调度算法如何撮合不同任务需求，并验证散户节点突发离线时的自动容灾漂移
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateOutage}
              disabled={outageSimulated}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                outageSimulated
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              模拟散户A突然拔网线/断电
            </button>

            <button
              onClick={handleResetSimulation}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              重置沙盘
            </button>
          </div>
        </div>

        {/* Live Matching Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">任务 ID / 用户类型</th>
                <th className="py-3 px-3">任务类型</th>
                <th className="py-3 px-3">需求显卡 / 预算上限</th>
                <th className="py-3 px-3">调度器命中算力节点</th>
                <th className="py-3 px-3">状态</th>
                <th className="py-3 px-3">调度匹配决策依据</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {tasks.map((task) => {
                const isFailed = task.status === '容灾漂移保护';
                return (
                  <tr key={task.id} className="hover:bg-slate-850/50">
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-white">{task.id}</div>
                      <div className="text-[11px] text-slate-400">{task.userType}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-200">
                      {task.taskTitle}
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <div>{task.requestedCards}x {task.requestedModel}</div>
                      <div className="text-slate-400 text-[10px]">≤ ¥{task.budgetPerHourMax.toFixed(2)}/h</div>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span className={`font-semibold ${isFailed ? 'text-amber-400' : 'text-indigo-400'}`}>
                        {task.matchedNodeCode}
                      </span>
                      <div className="text-[10px] text-slate-500">穿透往返延时: {task.routingLatencyMs}ms</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                        isFailed
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {isFailed ? <Activity className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                        {task.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[11px] text-slate-400 max-w-xs">
                      {task.reason}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Live Engine Terminal Output */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-mono flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              分布式调度内核实时事件流 (Live Event Stream)
            </span>
            <span className="text-[10px] text-slate-500">毫秒级事件总线</span>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-1.5 max-h-48 overflow-y-auto">
            {simulationLogs.map((log, index) => (
              <div
                key={index}
                className={`${
                  log.includes('CRITICAL')
                    ? 'text-red-400 font-bold'
                    : log.includes('RECOVERY') || log.includes('成功')
                    ? 'text-emerald-400'
                    : log.includes('FAILOVER') || log.includes('STORAGE')
                    ? 'text-amber-300'
                    : 'text-slate-400'
                }`}
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Detailed Business & Operation Model Q&A */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white">
          解答您的商业落地疑惑：如何把 10 万租户与散户算力运转起来？
        </h3>

        <div className="grid md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
            <div className="font-semibold text-white text-sm">
              Q: 显卡型号非常杂乱（4090/A100/3090/4080），如何统一让 10W 用户选择？
            </div>
            <p className="text-slate-400 leading-relaxed">
              <strong>A: 标签化与任务向导化。</strong> 我们不强制用户懂底层硬件，而是分为“大模型微调推荐 (A100/H100)”、“性价比训练推荐 (4090 24G)”、“Diffusion绘图推荐 (3090/4080)”。用户只需选择预装镜像，调度器自动根据 VRAM 和带宽匹配最经济的散户或机房卡。
            </p>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
            <div className="font-semibold text-white text-sm">
              Q: 散户A这个月提供4张4090，B提供1张A100，他们如何结算？
            </div>
            <p className="text-slate-400 leading-relaxed">
              <strong>A: 托管分成与待机保底。</strong> 平台采用 Escrow 托管模式：租户按小时支付（如 4090 付 ¥2.1/h），平台扣除 15% 调度与穿透服务费，¥1.78/h 实时进入散户 A 的账户；若未租出，平台发放基础待机电费津贴（¥0.30/h），散户随时发起提现。
            </p>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
            <div className="font-semibold text-white text-sm">
              Q: 租户的代码和训练数据，散户会不会偷偷拷贝走？
            </div>
            <p className="text-slate-400 leading-relaxed">
              <strong>A: Kata 虚拟化沙箱 + 算存加密。</strong> 散户的宿主机无法通过普通 <code>docker exec</code> 或查看目录来读取租户文件。租户数据盘直接走平台云端挂载，在散户本地不落盘；训练结束容器自动安全销毁并释放显存。
            </p>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
            <div className="font-semibold text-white text-sm">
              Q: 散户家庭宽带断线、掉电怎么办？
            </div>
            <p className="text-slate-400 leading-relaxed">
              <strong>A: 心跳超时自动无感漂移。</strong> 核心在于“算存分离”：因为数据都在云端 JuiceFS 网盘上，一旦散户机器失联超过 3 秒，调度系统立即在资源池寻找备用卡拉起，租户不需要重新上传数据，直接接着跑。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
