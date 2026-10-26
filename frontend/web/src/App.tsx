import React, { useState } from 'react';
import { GpuNode, UserInstance, ProviderWorker } from './types/gpu';
import { 
  INITIAL_GPU_NODES, 
  INITIAL_USER_INSTANCES, 
  INITIAL_PROVIDER_WORKERS 
} from './data/mockData';
import { Header } from './components/Header';
import { HeroLanding } from './components/HeroLanding';
import { Marketplace } from './components/Marketplace';
import { MyInstances } from './components/MyInstances';
import { ProviderPortal } from './components/ProviderPortal';
import { SchedulerArchitecture } from './components/SchedulerArchitecture';
import { RentModal } from './components/RentModal';
import { JupyterModal } from './components/JupyterModal';
import { TerminalModal } from './components/TerminalModal';
import { AddNodeModal } from './components/AddNodeModal';
import { DiagnosticModal } from './components/DiagnosticModal';
import { LoginModal } from './components/LoginModal';
import { ImagesRepository } from './components/ImagesRepository';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    role: 'developer' | 'provider';
    walletBalance: number;
    avatar: string;
  }>({
    name: 'AI 开发者 (高同学)',
    role: 'developer',
    walletBalance: 286.50,
    avatar: 'U',
  });

  const [currentTab, setCurrentTab] = useState<'hero' | 'market' | 'instances' | 'provider' | 'architecture' | 'images'>('hero');
  const [gpuNodes, setGpuNodes] = useState<GpuNode[]>(INITIAL_GPU_NODES);
  const [userInstances, setUserInstances] = useState<UserInstance[]>(INITIAL_USER_INSTANCES);
  const [providerWorkers, setProviderWorkers] = useState<ProviderWorker[]>(INITIAL_PROVIDER_WORKERS);

  // Modal States
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [rentingNode, setRentingNode] = useState<GpuNode | null>(null);
  const [activeJupyterInstance, setActiveJupyterInstance] = useState<UserInstance | null>(null);
  const [activeTerminalInstance, setActiveTerminalInstance] = useState<UserInstance | null>(null);
  const [isAddNodeModalOpen, setIsAddNodeModalOpen] = useState<boolean>(false);
  const [diagnosticNode, setDiagnosticNode] = useState<GpuNode | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Login handler
  const handleLoginSuccess = (profile: {
    name: string;
    role: 'developer' | 'provider';
    walletBalance: number;
    avatar: string;
  }) => {
    setCurrentUser(profile);
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    // 登录成功后直接进入算力商城 (gemini-code-1793022530639.html)
    setCurrentTab('market');
    showToast(`欢迎回来，${profile.name}！已进入异构算力自由市场。`);
  };

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentTab('hero');
    showToast('您已安全退出登录，已返回平台介绍首页。');
  };

  // When clicking Rent from Hero page
  const handleHeroRentClick = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      showToast('请先登录或注册 uFreeGPU 账户以开始租赁 GPU 实例。');
    } else {
      setCurrentTab('market');
    }
  };

  const handleHeroProviderClick = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      showToast('请先登录供卡矿主/散户账户。');
    } else {
      setCurrentTab('provider');
    }
  };

  // Total available GPUs count
  const totalAvailableGpus = gpuNodes.reduce((acc, n) => acc + n.gpuCountAvailable, 0);

  // Instance creation handler
  const handleConfirmCreateInstance = (instanceData: Partial<UserInstance>) => {
    const newId = `inst-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullInstance: UserInstance = {
      id: newId,
      name: instanceData.name || '全新算力实例',
      nodeId: instanceData.nodeId || gpuNodes[0].id,
      nodeCode: instanceData.nodeCode || gpuNodes[0].nodeCode,
      providerType: instanceData.providerType || 'retail',
      gpuModel: instanceData.gpuModel || 'RTX 4090',
      gpuCount: instanceData.gpuCount || 1,
      status: 'running',
      image: instanceData.image || 'PyTorch 2.4.0',
      uptimeHours: 0.1,
      pricePerHour: instanceData.pricePerHour || 2.1,
      costTotal: 0.21,
      sshCommand: instanceData.sshCommand || `ssh root@connect.ufreegpu.cloud -p 32588`,
      sshPort: instanceData.sshPort || 32588,
      jupyterPort: 8888,
      gpuUsagePercent: 15,
      vramUsedGb: 1.5,
      vramTotalGb: instanceData.vramTotalGb || 24,
      cpuUsagePercent: 10,
      ramUsedGb: 12.0,
      ramTotalGb: instanceData.ramTotalGb || 64,
      diskUsedGb: 18,
      diskTotalGb: instanceData.diskTotalGb || 100,
      autoCheckpoint: instanceData.autoCheckpoint ?? true,
      billingType: instanceData.billingType || 'on-demand',
      createdAt: new Date().toLocaleString(),
    };

    // Deduct cards from node
    setGpuNodes((prev) =>
      prev.map((n) =>
        n.id === fullInstance.nodeId
          ? { ...n, gpuCountAvailable: Math.max(0, n.gpuCountAvailable - fullInstance.gpuCount) }
          : n
      )
    );

    // Deduct deposit
    setCurrentUser((prev) => ({
      ...prev,
      walletBalance: Math.max(0, prev.walletBalance - 10.0),
    }));
    setUserInstances((prev) => [fullInstance, ...prev]);
    setRentingNode(null);
    setCurrentTab('instances');
    showToast(`🎉 成功创建实例 ${fullInstance.name}！已自动完成 P2P 穿透与环境准备，点击即可启动 JupyterLab 或 SSH。`);
  };

  // Toggle instance pause / running
  const handleToggleStatus = (instanceId: string) => {
    setUserInstances((prev) =>
      prev.map((inst) => {
        if (inst.id === instanceId) {
          const nextStatus = inst.status === 'running' ? 'paused' : 'running';
          showToast(`实例 ${inst.name} 已${nextStatus === 'running' ? '启动' : '暂停'}并挂起显卡资源`);
          return {
            ...inst,
            status: nextStatus,
            gpuUsagePercent: nextStatus === 'running' ? 45 : 0,
            vramUsedGb: nextStatus === 'running' ? 8.2 : 0,
          };
        }
        return inst;
      })
    );
  };

  // Simulate failover migration
  const handleMigrateInstance = (instanceId: string) => {
    setUserInstances((prev) =>
      prev.map((inst) => (inst.id === instanceId ? { ...inst, status: 'migrating' } : inst))
    );
    showToast('🚨 散户节点离线事件触发：正在冻结 Checkpoint，准备在 3 秒内自动漂移至备用同档节点...');

    setTimeout(() => {
      setUserInstances((prev) =>
        prev.map((inst) => {
          if (inst.id === instanceId) {
            return {
              ...inst,
              status: 'running',
              nodeCode: '#D205 (容灾备用)',
              nodeId: 'node-d205',
              sshPort: 38290,
              sshCommand: `ssh root@connect.ufreegpu.cloud -p 38290 -i ~/.ssh/id_rsa`,
            };
          }
          return inst;
        })
      );
      showToast('✅ 容灾漂移完成！已自动连接至备用节点 #D205，JuiceFS 网盘已重新挂载，训练任务无感续跑。');
    }, 2800);
  };

  // Delete instance
  const handleDeleteInstance = (instanceId: string) => {
    const target = userInstances.find((i) => i.id === instanceId);
    if (target) {
      // Return card count to node
      setGpuNodes((prev) =>
        prev.map((n) =>
          n.id === target.nodeId
            ? { ...n, gpuCountAvailable: Math.min(n.gpuCountTotal, n.gpuCountAvailable + target.gpuCount) }
            : n
        )
      );
    }
    setUserInstances((prev) => prev.filter((i) => i.id !== instanceId));
    showToast('实例已释放，停止计费，数据盘已安全同步至对象存储。');
  };

  // Add new host node from provider portal
  const handleSuccessAddNode = (newWorker: ProviderWorker, newNode: GpuNode) => {
    setProviderWorkers((prev) => [newWorker, ...prev]);
    setGpuNodes((prev) => [newNode, ...prev]);
    setIsAddNodeModalOpen(false);
    showToast(`🎉 节点 ${newWorker.nodeCode} 纳管成功！${newNode.gpuCountTotal} 张显卡已上架至算力大厅开始接单。`);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      isLoggedIn 
        ? 'bg-[#f4f6f9] text-slate-800' 
        : 'bg-[#030712] text-slate-100 selection:bg-indigo-500 selection:text-white'
    }`}>
      {/* Top Navigation */}
      <Header
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        instancesCount={userInstances.length}
        availableGpuCount={totalAvailableGpus}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenRegister={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Global Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 max-w-md bg-slate-900 border border-blue-500/50 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs flex items-center gap-3 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span className="flex-1 leading-relaxed">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white text-xs ml-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 md:py-8">
        {!isLoggedIn ? (
          // 未登录：用户访问 Hero 门户产品介绍
          <HeroLanding
            onGoToMarket={handleHeroRentClick}
            onGoToProvider={handleHeroProviderClick}
            onGoToArchitecture={handleHeroRentClick}
          />
        ) : (
          // 登录成功后：核心为【算力商城】与【我的实例】 (AutoDL 体验)
          <>
            {currentTab === 'market' && (
              <Marketplace
                nodes={gpuNodes}
                onRentNode={(node) => setRentingNode(node)}
                onOpenDiagnostic={(node) => setDiagnosticNode(node)}
              />
            )}

            {currentTab === 'instances' && (
              <MyInstances
                instances={userInstances}
                onOpenJupyter={(inst) => setActiveJupyterInstance(inst)}
                onOpenTerminal={(inst) => setActiveTerminalInstance(inst)}
                onToggleStatus={handleToggleStatus}
                onMigrateInstance={handleMigrateInstance}
                onDeleteInstance={handleDeleteInstance}
                onGoToMarket={() => setCurrentTab('market')}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className={`py-8 text-center text-xs transition-colors ${
        isLoggedIn 
          ? 'border-t border-slate-200 bg-white text-slate-500' 
          : 'border-t border-slate-900 bg-slate-950 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${isLoggedIn ? 'text-slate-800' : 'text-slate-300'}`}>uFreeGPU</span>
            <span aria-hidden="true">·</span>
            <span>下一代去中心化 GPU 动态调度网络</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            {!isLoggedIn ? (
              <>
                <button onClick={() => setCurrentTab('hero')} className="hover:text-white transition-colors">
                  产品介绍
                </button>
                <button onClick={() => setIsLoginModalOpen(true)} className="hover:text-white transition-colors">
                  登录 / 注册
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setCurrentTab('market')} className="hover:text-blue-600 transition-colors">
                  算力商城
                </button>
                <button onClick={() => setCurrentTab('instances')} className="hover:text-blue-600 transition-colors">
                  控制台
                </button>
              </>
            )}
          </div>

          <div>
            <span>© 2026 uFreeGPU. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* Login & Register Modal */}
      {isLoginModalOpen && (
        <LoginModal
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Modals */}
      {rentingNode && (
        <RentModal
          node={rentingNode}
          currentUser={currentUser}
          onClose={() => setRentingNode(null)}
          onConfirm={handleConfirmCreateInstance}
          onRecharge={(amount) => {
            setCurrentUser((prev) => ({
              ...prev,
              walletBalance: prev.walletBalance + amount,
            }));
            showToast(`充值成功！已成功充值 ¥${amount.toFixed(2)} 到您的算力账户。`);
          }}
        />
      )}

      {activeJupyterInstance && (
        <JupyterModal
          instance={activeJupyterInstance}
          onClose={() => setActiveJupyterInstance(null)}
        />
      )}

      {activeTerminalInstance && (
        <TerminalModal
          instance={activeTerminalInstance}
          onClose={() => setActiveTerminalInstance(null)}
        />
      )}

      {isAddNodeModalOpen && (
        <AddNodeModal
          onClose={() => setIsAddNodeModalOpen(false)}
          onSuccessAdd={handleSuccessAddNode}
        />
      )}

      {diagnosticNode && (
        <DiagnosticModal
          node={diagnosticNode}
          onClose={() => setDiagnosticNode(null)}
          onRent={() => {
            const target = diagnosticNode;
            setDiagnosticNode(null);
            setRentingNode(target);
          }}
        />
      )}
    </div>
  );
}
