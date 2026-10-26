import React, { useState, useMemo } from 'react';
import { UserInstance } from '../types/gpu';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Terminal, 
  BookOpen, 
  Trash2, 
  Copy, 
  Check, 
  HardDrive, 
  Cpu, 
  Activity, 
  Clock, 
  ShieldAlert,
  Server,
  Layers,
  LayoutDashboard,
  CreditCard,
  Key,
  FolderTree,
  Search,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Plus
} from 'lucide-react';

interface MyInstancesProps {
  instances: UserInstance[];
  onOpenJupyter: (instance: UserInstance) => void;
  onOpenTerminal: (instance: UserInstance) => void;
  onToggleStatus: (instanceId: string) => void;
  onMigrateInstance: (instanceId: string) => void;
  onDeleteInstance: (instanceId: string) => void;
  onGoToMarket: () => void;
}

export const MyInstances: React.FC<MyInstancesProps> = ({
  instances,
  onOpenJupyter,
  onOpenTerminal,
  onToggleStatus,
  onMigrateInstance,
  onDeleteInstance,
  onGoToMarket,
}) => {
  // Console Left Sidebar Active Tab
  const [activeSidebarTab, setActiveSidebarTab] = useState<'containers' | 'storage' | 'images' | 'billing' | 'ssh'>('containers');
  
  // Status filter inside containers
  const [statusFilter, setStatusFilter] = useState<'all' | 'running' | 'paused'>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedSshModal, setSelectedSshModal] = useState<UserInstance | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter instances
  const filteredInstances = useMemo(() => {
    return instances.filter((inst) => {
      if (statusFilter === 'running' && inst.status !== 'running') return false;
      if (statusFilter === 'paused' && inst.status !== 'paused') return false;
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const matchName = inst.name.toLowerCase().includes(kw);
        const matchGpu = inst.gpuModel.toLowerCase().includes(kw);
        const matchNode = inst.nodeCode.toLowerCase().includes(kw);
        if (!matchName && !matchGpu && !matchNode) return false;
      }
      return true;
    });
  }, [instances, statusFilter, searchKeyword]);

  const runningCount = instances.filter((i) => i.status === 'running').length;
  const pausedCount = instances.filter((i) => i.status === 'paused').length;

  return (
    <div className="font-sans text-slate-800">
      {/* Console Top Breadcrumb / Title */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <LayoutDashboard className="w-4 h-4 text-blue-600" />
            控制台
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600 font-medium">
            {activeSidebarTab === 'containers' && '容器实例'}
            {activeSidebarTab === 'storage' && '文件存储网盘'}
            {activeSidebarTab === 'images' && '自定义镜像'}
            {activeSidebarTab === 'billing' && '消费账单'}
            {activeSidebarTab === 'ssh' && 'SSH密钥对'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onGoToMarket}
            className="px-4 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium text-xs rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            租用新实例
          </button>
        </div>
      </div>

      {/* Main Console Layout: Left Sidebar + Right Content (Aligned Bottom) */}
      <div className="flex flex-col md:flex-row items-stretch gap-5">
        
        {/* ================= LEFT SIDEBAR (控制台左侧栏: 底部与右侧对齐) ================= */}
        <aside className="w-full md:w-56 shrink-0 bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
          <div className="space-y-5">
            {/* Group 1: 算力资源 */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-slate-400 px-3 uppercase tracking-wider mb-2">
                算力与资产
              </div>

            {/* 容器实例 (Requested by user) */}
            <button
              type="button"
              onClick={() => setActiveSidebarTab('containers')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                activeSidebarTab === 'containers'
                  ? 'bg-[#e0edff] text-[#2563eb] font-bold border-l-4 border-[#2563eb]'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Server className={`w-4 h-4 ${activeSidebarTab === 'containers' ? 'text-[#2563eb]' : 'text-slate-400'}`} />
                <span>容器实例</span>
              </div>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                activeSidebarTab === 'containers'
                  ? 'bg-blue-100 text-[#2563eb]'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {instances.length}
              </span>
            </button>

            {/* 文件存储网盘 */}
            <button
              type="button"
              onClick={() => setActiveSidebarTab('storage')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                activeSidebarTab === 'storage'
                  ? 'bg-[#e0edff] text-[#2563eb] font-bold border-l-4 border-[#2563eb]'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <HardDrive className={`w-4 h-4 ${activeSidebarTab === 'storage' ? 'text-[#2563eb]' : 'text-slate-400'}`} />
                <span>文件存储网盘</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">JuiceFS</span>
            </button>

            {/* 自定义镜像 */}
            <button
              type="button"
              onClick={() => setActiveSidebarTab('images')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                activeSidebarTab === 'images'
                  ? 'bg-[#e0edff] text-[#2563eb] font-bold border-l-4 border-[#2563eb]'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className={`w-4 h-4 ${activeSidebarTab === 'images' ? 'text-[#2563eb]' : 'text-slate-400'}`} />
                <span>自定义镜像</span>
              </div>
              <span className="text-[10px] text-slate-400">2个</span>
            </button>
          </div>

          {/* Group 2: 账务与凭证 */}
          <div className="space-y-1 pt-3 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-400 px-3 uppercase tracking-wider mb-2">
              财务与设置
            </div>

            {/* 消费账单 */}
            <button
              type="button"
              onClick={() => setActiveSidebarTab('billing')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                activeSidebarTab === 'billing'
                  ? 'bg-[#e0edff] text-[#2563eb] font-bold border-l-4 border-[#2563eb]'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className={`w-4 h-4 ${activeSidebarTab === 'billing' ? 'text-[#2563eb]' : 'text-slate-400'}`} />
                <span>消费账单</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-mono font-medium">按秒结算</span>
            </button>

            {/* SSH密钥 */}
            <button
              type="button"
              onClick={() => setActiveSidebarTab('ssh')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                activeSidebarTab === 'ssh'
                  ? 'bg-[#e0edff] text-[#2563eb] font-bold border-l-4 border-[#2563eb]'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Key className={`w-4 h-4 ${activeSidebarTab === 'ssh' ? 'text-[#2563eb]' : 'text-slate-400'}`} />
                <span>SSH密钥对</span>
              </div>
            </button>
          </div>
        </div>

        {/* Bottom Failover Health Badge (Aligned with bottom of right side) */}
        <div className="mt-auto pt-4">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>uFreeGPU 容灾漂移系统</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              散户节点离线5秒内无感漂移，JuiceFS 网盘跨机保留。
            </p>
          </div>
        </div>
      </aside>

        {/* ================= RIGHT MAIN AREA (控制台右侧主内容) ================= */}
        <main className="flex-1 w-full space-y-4">
          
          {/* TAB 1: 容器实例 (Primary view) */}
          {activeSidebarTab === 'containers' && (
            <div className="space-y-4">
              {/* Filter and Search Bar */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                {/* Status Switcher */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                      statusFilter === 'all'
                        ? 'bg-white text-slate-900 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    全部 ({instances.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('running')}
                    className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                      statusFilter === 'running'
                        ? 'bg-white text-blue-600 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    运行中 ({runningCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('paused')}
                    className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                      statusFilter === 'paused'
                        ? 'bg-white text-slate-900 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    已关机 ({pausedCount})
                  </button>
                </div>

                {/* Search Box */}
                <div className="flex items-center gap-2 w-full sm:w-72">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      placeholder="搜索实例名称/GPU/节点ID..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Empty State */}
              {filteredInstances.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-2xs">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                    <Server className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">未找到匹配的容器实例</h3>
                  <p className="text-xs text-slate-500 mb-4">
                    前往算力商城挑选 RTX 4090、A100、3090 或 PRO 6000，秒级拉起 PyTorch / JupyterLab 开发环境。
                  </p>
                  <button
                    onClick={onGoToMarket}
                    className="px-5 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-medium rounded-lg shadow-2xs transition-colors"
                  >
                    前往算力商城选卡
                  </button>
                </div>
              ) : (
                /* Instance Cards List */
                <div className="space-y-4">
                  {filteredInstances.map((inst) => {
                    const isRunning = inst.status === 'running';
                    const isMigrating = inst.status === 'migrating';

                    return (
                      <div
                        key={inst.id}
                        className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-2xs transition-all space-y-4"
                      >
                        {/* Row 1: Instance Name, Node Info, Status & Quick Action Buttons */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-base text-slate-900">{inst.name}</span>
                              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                {inst.gpuModel} × {inst.gpuCount}卡
                              </span>
                              <span className="text-[11px] font-mono text-slate-400">
                                宿主节点: {inst.nodeCode}
                              </span>
                              {inst.providerType === 'retail' && (
                                <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.2 rounded font-medium">
                                  散户合作节点
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                              <span>环境镜像: <span className="text-slate-600 font-medium">{inst.image}</span></span>
                              <span>·</span>
                              <span>创建时间: {inst.createdAt}</span>
                            </div>
                          </div>

                          {/* Top Right Status & Primary Launch Buttons */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                              isRunning
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : isMigrating
                                ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}>
                              <span className={`w-2 h-2 rounded-full ${
                                isRunning ? 'bg-emerald-500 animate-pulse' : isMigrating ? 'bg-amber-500' : 'bg-slate-400'
                              }`} />
                              <span>{isRunning ? '运行中' : isMigrating ? '容灾漂移中...' : '已关机'}</span>
                            </div>

                            {/* 快捷 Launch: JupyterLab */}
                            {isRunning && (
                              <button
                                onClick={() => onOpenJupyter(inst)}
                                className="px-3.5 py-1.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                                title="打开 JupyterLab 在线交互笔记本"
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>JupyterLab</span>
                              </button>
                            )}

                            {/* 快捷 Launch: Web 终端 */}
                            {isRunning && (
                              <button
                                onClick={() => onOpenTerminal(inst)}
                                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1 cursor-pointer font-mono"
                                title="打开网页 Web Terminal"
                              >
                                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Web 终端</span>
                              </button>
                            )}

                            {/* 快捷 SSH 登录 */}
                            {isRunning && (
                              <button
                                onClick={() => setSelectedSshModal(inst)}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Key className="w-3.5 h-3.5 text-slate-500" />
                                <span>SSH 登录</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Row 2: Real-time Telemetry Dashboard (Gauges) */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 text-xs">
                          {/* GPU Usage */}
                          <div>
                            <div className="flex justify-between text-slate-500 mb-1">
                              <span className="flex items-center gap-1">
                                <Activity className="w-3.5 h-3.5 text-blue-600" />
                                GPU 利用率
                              </span>
                              <span className="font-mono font-bold text-slate-800">{isRunning ? `${inst.gpuUsagePercent}%` : '0%'}</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${isRunning ? inst.gpuUsagePercent : 0}%` }}
                              />
                            </div>
                          </div>

                          {/* VRAM */}
                          <div>
                            <div className="flex justify-between text-slate-500 mb-1">
                              <span className="flex items-center gap-1">
                                <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                                显存占用
                              </span>
                              <span className="font-mono text-slate-800">
                                {isRunning ? inst.vramUsedGb.toFixed(1) : '0'} / {inst.vramTotalGb} GB
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${isRunning ? (inst.vramUsedGb / inst.vramTotalGb) * 100 : 0}%` }}
                              />
                            </div>
                          </div>

                          {/* CPU & RAM */}
                          <div>
                            <div className="flex justify-between text-slate-500 mb-1">
                              <span>内存 (RAM)</span>
                              <span className="font-mono text-slate-800">
                                {isRunning ? inst.ramUsedGb.toFixed(1) : '0'} / {inst.ramTotalGb} GB
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${isRunning ? (inst.ramUsedGb / inst.ramTotalGb) * 100 : 0}%` }}
                              />
                            </div>
                          </div>

                          {/* Disk */}
                          <div>
                            <div className="flex justify-between text-slate-500 mb-1">
                              <span className="flex items-center gap-1">
                                <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                                存储盘 (JuiceFS)
                              </span>
                              <span className="font-mono text-slate-800">
                                {inst.diskUsedGb} / {inst.diskTotalGb} GB
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-slate-600 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${(inst.diskUsedGb / inst.diskTotalGb) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Row 3: Billing Rate, Action Buttons (Pause, Failover Drill, Delete) */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 text-xs">
                          <div className="flex items-center gap-4 text-slate-500">
                            <div>
                              资费：
                              <span className="text-[#ef4444] font-bold font-mono text-sm ml-0.5">
                                ¥{inst.pricePerHour.toFixed(2)}
                              </span>
                              <span className="text-[11px] text-slate-400 font-sans">/时</span>
                              <span className="text-[10px] text-slate-400 ml-1">({inst.billingType === 'on-demand' ? '按量计费' : '包日独享'})</span>
                            </div>

                            <div className="border-l border-slate-200 pl-3">
                              已运行：<span className="font-mono font-medium text-slate-700">{inst.uptimeHours.toFixed(1)} 小时</span>
                            </div>
                          </div>

                          {/* Operations */}
                          <div className="flex items-center gap-2">
                            {/* Pause / Start */}
                            <button
                              onClick={() => onToggleStatus(inst.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                                isRunning
                                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                              <span>{isRunning ? '关机 (保留数据)' : '开机'}</span>
                            </button>

                            {/* Failover drill */}
                            {isRunning && (
                              <button
                                onClick={() => onMigrateInstance(inst.id)}
                                disabled={isMigrating}
                                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                                title="模拟散户节点离线事件，测试 3 秒内 Checkpoint 冻结并自动迁移至备用节点"
                              >
                                <RotateCcw className={`w-3 h-3 ${isMigrating ? 'animate-spin' : ''}`} />
                                <span>散户掉线演练</span>
                              </button>
                            )}

                            {/* Release */}
                            <button
                              onClick={() => {
                                if (confirm(`确认释放实例 "${inst.name}" 吗？释放后将归还 GPU 算力并停止计费。`)) {
                                  onDeleteInstance(inst.id);
                                }
                              }}
                              className="px-2.5 py-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="释放实例"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: 文件存储网盘 */}
          {activeSidebarTab === 'storage' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-blue-600" />
                    JuiceFS 分布式对象存储网盘
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    跨机持久化共享存储，散户显卡切换或实例重新开机时，数据盘文件自动实时同步。
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-bold text-blue-600">已用 16.0 GB / 免费额度 50 GB</div>
                  <div className="text-[11px] text-slate-400">扩容资费: ¥0.0003/GB/时</div>
                </div>
              </div>

              {/* Virtual Folders */}
              <div className="space-y-2">
                <div className="text-slate-700 font-semibold mb-2">默认挂载目录：</div>
                {[
                  { path: '/root/autodl-tmp', name: '临时高速缓存目录 (本地NVMe SSD)', size: '12.4 GB', desc: '用于训练临时 Checkpoint 与解包数据，读写速度 > 3500MB/s' },
                  { path: '/root/autodl-fs', name: '持久化网盘目录 (分布式对象存储)', size: '3.6 GB', desc: '长期保留权重模型、代码库与训练日志，关机永不丢失' },
                ].map((dir, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FolderTree className="w-5 h-5 text-amber-500" />
                      <div>
                        <div className="font-mono font-bold text-slate-900">{dir.path}</div>
                        <div className="text-slate-500 text-[11px]">{dir.name} · {dir.desc}</div>
                      </div>
                    </div>
                    <span className="font-mono font-medium text-slate-700">{dir.size}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg text-slate-600 leading-relaxed text-[11px]">
                💡 <strong>文件上传提示：</strong> 您可以直接在实例的 JupyterLab 界面中拖拽上传大文件，也可以通过 <code>scp -P 端口 文件名 root@connect.omnigpu.cloud:/root/autodl-fs/</code> 高速传输数据集。
              </div>
            </div>
          )}

          {/* TAB 3: 自定义镜像 */}
          {activeSidebarTab === 'images' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-blue-600" />
                    我的自定义镜像与快照
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    保存您配置好的 CUDA / pip / conda 专属环境，随时用于新建主机。
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => alert('请在运行中的实例操作栏点击「保存为镜像」，系统将对容器自动生成只读快照。')}
                  className="px-3.5 py-1.5 bg-[#2563eb] text-white rounded-lg font-medium shadow-2xs hover:bg-[#1d4ed8]"
                >
                  创建新镜像
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'PyTorch-2.4-DeepSeek-vLLM-Custom', size: '18.2 GB', tag: 'v1.2', updated: '2026-10-24', desc: '预装 flash-attn 2.6.3 与 DeepSeek 适配环境' },
                  { name: 'Stable-Diffusion-Forge-ControlNet-Full', size: '24.5 GB', tag: 'v2.0', updated: '2026-10-20', desc: '包含常用大模型底模与 10+ 常用 LoRA' },
                ].map((img, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{img.name}</span>
                        <span className="px-2 py-0.2 bg-blue-100 text-blue-700 rounded font-mono text-[10px]">{img.tag}</span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-1">{img.desc}</p>
                      <span className="text-[10px] text-slate-400">更新时间: {img.updated}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-800">{img.size}</div>
                      <button
                        type="button"
                        onClick={onGoToMarket}
                        className="text-[#2563eb] hover:underline text-xs mt-1 block"
                      >
                        使用此镜像开机 →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: 消费账单 */}
          {activeSidebarTab === 'billing' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5 text-xs">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  消费明细与账单
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  平台实行极简透明的按秒计费体系，精准扣费，随时关机即停。
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[11px]">本月算力消费总额</span>
                  <span className="font-mono text-xl font-bold text-slate-900 mt-1 block">¥ 48.20</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[11px]">累计优惠代金券抵扣</span>
                  <span className="font-mono text-xl font-bold text-emerald-600 mt-1 block">-¥ 10.00</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[11px]">当前每小时运行总费率</span>
                  <span className="font-mono text-xl font-bold text-[#ef4444] mt-1 block">
                    ¥{instances.filter(i => i.status === 'running').reduce((acc, c) => acc + c.pricePerHour, 0).toFixed(2)}/时
                  </span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-4 bg-[#f8fafc] text-slate-500 font-medium py-2 px-3 border-b border-slate-200">
                  <div>结算时间</div>
                  <div>实例名称 / 显卡型号</div>
                  <div>运行时长</div>
                  <div className="text-right">结算扣费</div>
                </div>
                {[
                  { time: '2026-10-26 14:00', name: 'RTX 4090 × 1卡', duration: '2.5小时', cost: '¥5.25' },
                  { time: '2026-10-25 18:30', name: 'A100-PCIE × 1卡', duration: '1.2小时', cost: '¥10.20' },
                  { time: '2026-10-24 10:15', name: 'RTX 3090 × 2卡', duration: '4.0小时', cost: '¥9.60' },
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-4 items-center py-2.5 px-3 border-b border-slate-100 font-mono text-slate-700">
                    <div className="text-slate-500 font-sans">{row.time}</div>
                    <div className="font-medium text-slate-900">{row.name}</div>
                    <div>{row.duration}</div>
                    <div className="text-right text-[#ef4444] font-bold">{row.cost}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SSH 密钥 */}
          {activeSidebarTab === 'ssh' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5 text-xs">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Key className="w-5 h-5 text-blue-600" />
                  SSH 公钥管理
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  上传本地 <code>~/.ssh/id_rsa.pub</code> 公钥，开机时自动注入宿主机容器，免密秒连。
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">默认平台公钥 (uFreeGPU Key)</span>
                    <span className="px-2 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-medium">默认已激活</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">SHA256: 4f98...b21c</span>
                </div>
                <div className="font-mono text-[11px] text-slate-600 bg-white p-2.5 rounded border border-slate-200 truncate">
                  ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC10d4ec45... user@ufreegpu-client
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* SSH Connection Details Modal */}
      {selectedSshModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-slate-900">SSH 远程终端连接信息</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  已通过 uFreeGPU P2P 穿透中继分配内网安全端口
                </p>
              </div>
              <button
                onClick={() => setSelectedSshModal(null)}
                className="text-slate-400 hover:text-slate-600 text-xs p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 mb-1 block font-medium">一键 SSH 命令：</label>
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-blue-700 text-[11px] overflow-x-auto">
                  <span className="flex-1 select-all">{selectedSshModal.sshCommand}</span>
                  <button
                    onClick={() => handleCopy(selectedSshModal.sshCommand, 'ssh-cmd')}
                    className="p-1 text-slate-400 hover:text-slate-700 shrink-0 cursor-pointer"
                    title="复制命令"
                  >
                    {copiedId === 'ssh-cmd' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">登录主机 Host</span>
                  <span className="font-mono text-xs text-slate-800">connect.ufreegpu.cloud</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">映射端口 Port</span>
                  <span className="font-mono text-xs text-blue-600 font-bold">{selectedSshModal.sshPort}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">登录用户名</span>
                  <span className="font-mono text-xs text-slate-800 font-bold">root</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">认证方式</span>
                  <span className="font-mono text-xs text-emerald-600">默认 SSH Key 免密</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50/60 border border-blue-200/60 rounded-lg text-slate-600 text-[11px] leading-relaxed">
                💡 <strong>提示：</strong> 支持直接使用 VSCode Remote-SSH 插件连接！在本地配置 <code>Host ufreegpu</code> 即可直接在本地编写代码并利用散户显卡运行。
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedSshModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
