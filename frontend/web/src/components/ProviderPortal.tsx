import React, { useState } from 'react';
import { ProviderWorker } from '../types/gpu';
import { 
  Coins, 
  Server, 
  Plus, 
  Cpu, 
  Thermometer, 
  Zap, 
  Activity, 
  CheckCircle2, 
  Sliders, 
  ArrowUpRight, 
  ShieldCheck,
  Clock,
  Wifi,
  Lock
} from 'lucide-react';

interface ProviderPortalProps {
  workers: ProviderWorker[];
  onOpenAddNodeModal: () => void;
}

export const ProviderPortal: React.FC<ProviderPortalProps> = ({
  workers,
  onOpenAddNodeModal,
}) => {
  const [selectedWorkerIndex, setSelectedWorkerIndex] = useState<number>(0);
  const [withdrawalAlert, setWithdrawalAlert] = useState<string | null>(null);

  const currentWorker = workers[selectedWorkerIndex] || workers[0];

  const totalMonthlyProjected = workers.reduce((acc, w) => acc + w.monthlyProjectedEarnings, 0);
  const totalSettled = workers.reduce((acc, w) => acc + w.settledEarningsThisMonth, 0);
  const totalUnsettled = workers.reduce((acc, w) => acc + w.unsettledEarnings, 0);

  const handleWithdraw = () => {
    setWithdrawalAlert(`已成功发起 ¥${totalSettled} 提现申请！款项将在 2 小时内自动结算至绑定的支付宝/对公账户。`);
    setTimeout(() => setWithdrawalAlert(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <Coins className="w-6 h-6 text-amber-400" />
            算力提供商 · 散户与机房接入中心
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            盘活闲置显卡资产：支持散户 4090/3090 与 IDC A100/H100 接入，一行脚本纳管，秒级结算变现
          </p>
        </div>

        <button
          onClick={onOpenAddNodeModal}
          className="self-start md:self-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-600/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          接入新显卡节点 (出卡赚钱)
        </button>
      </div>

      {withdrawalAlert && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{withdrawalAlert}</span>
        </div>
      )}

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>预计本月总收入</span>
            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">持续出租</span>
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums">
            ¥{totalMonthlyProjected.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            基于当前纳管显卡历史出租负荷计算
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>本月已结算收益 (可提现)</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">T+1 到账</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            ¥{totalSettled.toLocaleString()}
          </div>
          <div className="mt-2">
            <button
              onClick={handleWithdraw}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              申请提现至银行卡/支付宝 <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="text-xs text-slate-400 mb-1">正在跑卡待结算 (实时撮合)</div>
          <div className="text-2xl font-bold text-cyan-400 font-mono tabular-nums">
            ¥{totalUnsettled.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            租户任务完成后按秒打入账户
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="text-xs text-slate-400 mb-1">全网节点综合 SLA 履约率</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
            99.6%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            已获得平台优先派单置顶权益
          </div>
        </div>
      </div>

      {/* Node Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {workers.map((worker, idx) => (
          <button
            key={worker.id}
            onClick={() => setSelectedWorkerIndex(idx)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-2 border ${
              selectedWorkerIndex === idx
                ? 'bg-slate-800 text-white border-amber-500/50 shadow-md'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border-slate-800'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-amber-400" />
            <span>{worker.nodeCode} {worker.nodeName}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 font-mono text-cyan-400">
              {worker.cards.length} 张卡
            </span>
          </button>
        ))}
      </div>

      {/* Detailed Selected Node View */}
      {currentWorker && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          {/* Node Meta & Health */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {currentWorker.nodeCode}
                </span>
                <h3 className="text-lg font-bold text-white">{currentWorker.nodeName}</h3>
                <span className="text-xs text-slate-400 font-mono">({currentWorker.os})</span>
                <span className="text-xs text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {currentWorker.daemonVersion}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 flex-wrap">
                <span>网络位置: <strong className="text-slate-200">{currentWorker.ipMasked}</strong></span>
                <span aria-hidden="true">·</span>
                <span>穿透协议: <span className="text-cyan-400">{currentWorker.natMethod}</span></span>
                <span aria-hidden="true">·</span>
                <span>P2P 隧道延迟: <span className="font-mono text-emerald-400">{currentWorker.p2pLatencyMs}ms</span></span>
              </div>
            </div>

            {/* Provider Policy Settings */}
            <div className="flex items-center gap-3">
              <div className="text-xs text-right hidden sm:block">
                <div className="text-slate-400">温控安全阈值: <strong className="text-white font-mono">{currentWorker.temperatureLimit}°C</strong></div>
                <div className="text-slate-500 text-[10px]">超过阈值自动降额保硬件</div>
              </div>

              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-xs flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-300">出租策略: {currentWorker.autoSchedule}</span>
              </div>
            </div>
          </div>

          {/* Cards Hardware Matrix */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                宿主机显卡运行槽位监控 (Slot 0 - Slot {currentWorker.cards.length - 1})
              </h4>
              <span className="text-xs text-slate-400">
                实时采集驱动遥测数据 (每 3 秒心跳刷新)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentWorker.cards.map((card) => (
                <div
                  key={card.slot}
                  className={`p-4 rounded-xl border transition-all ${
                    card.isOccupied
                      ? 'bg-indigo-950/20 border-indigo-500/40'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-400">
                          PCIe Slot #{card.slot}
                        </span>
                        {card.isOccupied ? (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            正在运行租户任务
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                            闲置待命中 (补贴中)
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-bold text-white mt-1">{card.model}</div>
                      {card.renterUsername && (
                        <div className="text-xs text-indigo-300 mt-0.5">
                          租户: <span className="font-mono">{card.renterUsername}</span>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <div className={`text-sm font-bold font-mono ${
                        card.isOccupied ? 'text-emerald-400' : 'text-slate-400'
                      }`}>
                        {card.isOccupied ? '+¥2.10/h 收益' : '+¥0.30/h 待机'}
                      </div>
                    </div>
                  </div>

                  {/* Telemetry metrics for this card */}
                  <div className="grid grid-cols-3 gap-2 text-xs bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                    <div>
                      <div className="text-slate-400 text-[10px] flex items-center gap-1">
                        <Thermometer className="w-3 h-3 text-red-400" />
                        核心温度
                      </div>
                      <div className={`font-mono font-bold mt-0.5 ${
                        card.temp > 70 ? 'text-amber-400' : 'text-white'
                      }`}>
                        {card.temp} °C
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-400 text-[10px] flex items-center gap-1">
                        <Activity className="w-3 h-3 text-cyan-400" />
                        风扇转速
                      </div>
                      <div className="font-mono font-bold mt-0.5 text-white">
                        {card.fanSpeed}%
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-400 text-[10px] flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-400" />
                        整卡功耗
                      </div>
                      <div className="font-mono font-bold mt-0.5 text-white">
                        {card.powerWatt} W
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Supplier Protection & Guarantees */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 text-xs text-slate-400">
            <div className="font-semibold text-white flex items-center gap-1.5 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              散户提供者权益保障体系
            </div>
            <div className="grid md:grid-cols-3 gap-4 pt-1">
              <div>
                <strong className="text-slate-300">防黑客与宿主防护：</strong>
                租户运行于沙箱容器中，系统禁止执行底层系统调用（如刷显卡 BIOS、修改宿主机根分区）。
              </div>
              <div>
                <strong className="text-slate-300">硬件过热熔断机制：</strong>
                一旦显卡温度触及保护阈值（如78°C），Daemon 会立即在2秒内将任务转移，保护显卡寿命。
              </div>
              <div>
                <strong className="text-slate-300">闲置待机保底收益：</strong>
                即便当前没有租户下单，只要宿主机保持在线待命状态，平台发放待机电费津贴。
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
