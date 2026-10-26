import React, { useState } from 'react';
import { GpuNode, UserInstance } from '../types/gpu';
import { 
  HelpCircle, 
  ChevronDown, 
  Check, 
  X, 
  Flame, 
  ArrowUpDown, 
  Info,
  CreditCard,
  CheckCircle2
} from 'lucide-react';

interface RentModalProps {
  node: GpuNode;
  currentUser?: {
    name: string;
    role: 'developer' | 'provider';
    walletBalance: number;
    avatar: string;
  };
  onClose: () => void;
  onConfirm: (instanceData: Partial<UserInstance>) => void;
  onRecharge?: (amount: number) => void;
}

export const RentModal: React.FC<RentModalProps> = ({
  node,
  currentUser = { name: 'AI 开发者', role: 'developer', walletBalance: 286.50, avatar: 'U' },
  onClose,
  onConfirm,
  onRecharge,
}) => {
  // 1. Billing method
  const [billingMethod, setBillingMethod] = useState<'hourly' | 'daily' | 'weekly' | 'monthly'>('hourly');

  // 2. GPU Count
  const [selectedCardsCount, setSelectedCardsCount] = useState<number>(1);

  // 3. Disk expansion
  const [needDiskExpand, setNeedDiskExpand] = useState<boolean>(false);
  const [expandedDiskGb, setExpandedDiskGb] = useState<number>(50);

  // 4. Image selection
  const [imageTab, setImageTab] = useState<'base' | 'community' | 'mine'>('base');
  const [isImageDropdownOpen, setIsImageDropdownOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>(
    'PyTorch 2.4.0 / Python 3.11 / CUDA 12.4'
  );

  // 5. Coupon
  const [isCouponDropdownOpen, setIsCouponDropdownOpen] = useState<boolean>(false);
  const [selectedCoupon, setSelectedCoupon] = useState<string>('新用户注册体验券 (抵扣 ¥10.00)');

  // 6. Modals inside create page
  const [showBillingRulesModal, setShowBillingRulesModal] = useState<boolean>(false);
  const [showCostDetailModal, setShowCostDetailModal] = useState<boolean>(false);
  const [showRechargeModal, setShowRechargeModal] = useState<boolean>(false);
  const [rechargeAmountInput, setRechargeAmountInput] = useState<number>(100);

  // Specifications calculation
  const cpuCoresPerCard = parseInt(node.cpuSpecs.split(' ')[0]) || 22;
  const ramGbPerCard = Math.floor(node.ramGb / Math.max(1, node.gpuCountTotal)) || 64;
  const totalCpuCores = cpuCoresPerCard * selectedCardsCount;
  const totalRamGb = ramGbPerCard * selectedCardsCount;
  const totalDiskGb = 50 + (needDiskExpand ? expandedDiskGb : 0);

  // Price calculations
  let basePricePerHour = node.pricePerHour * selectedCardsCount;
  if (billingMethod === 'daily') {
    basePricePerHour = (node.pricePerDay / 24) * selectedCardsCount;
  } else if (billingMethod === 'weekly') {
    basePricePerHour = (node.pricePerDay * 0.9 / 24) * selectedCardsCount;
  } else if (billingMethod === 'monthly') {
    basePricePerHour = (node.pricePerDay * 0.8 / 24) * selectedCardsCount;
  }

  // Disk cost: 0.0003/GB/hour
  const diskCostPerHour = needDiskExpand ? expandedDiskGb * 0.0003 : 0;
  const totalConfigPricePerHour = basePricePerHour + diskCostPerHour;

  // Coupon discount
  let couponDiscount = 0;
  if (selectedCoupon.includes('¥10.00')) {
    couponDiscount = 10.00;
  } else if (selectedCoupon.includes('¥5.00')) {
    couponDiscount = 5.00;
  }

  // Handle final create
  const handleCreateAndBoot = () => {
    onConfirm({
      name: `${node.gpuModel}-${node.nodeCode || 'B51'}-任务实例`,
      nodeId: node.id,
      nodeCode: node.nodeCode || '#B51机',
      providerType: node.providerType,
      gpuModel: node.gpuModel,
      gpuCount: selectedCardsCount,
      status: 'running',
      image: selectedImage,
      uptimeHours: 0.1,
      pricePerHour: totalConfigPricePerHour,
      costTotal: 0.0,
      sshCommand: `ssh root@connect.ufreegpu.cloud -p ${Math.floor(30000 + Math.random() * 9000)}`,
      sshPort: Math.floor(30000 + Math.random() * 9000),
      jupyterPort: 8888,
      gpuUsagePercent: 18,
      vramUsedGb: 1.8,
      vramTotalGb: node.vramPerCard * selectedCardsCount,
      cpuUsagePercent: 12,
      ramUsedGb: 14.5,
      ramTotalGb: totalRamGb,
      diskUsedGb: 16,
      diskTotalGb: totalDiskGb + 30,
      autoCheckpoint: true,
      billingType: billingMethod === 'hourly' ? 'on-demand' : 'daily',
      createdAt: new Date().toLocaleString(),
    });
  };

  const imageOptions = [
    {
      title: 'PyTorch 2.4.0 / Python 3.11 / CUDA 12.4',
      tag: 'AutoDL官方推荐',
      desc: '预装 torchvision, torchaudio, transformers, vLLM 0.6.3',
    },
    {
      title: 'PyTorch 2.1.2 / Python 3.10 / CUDA 12.1',
      tag: '高稳定版',
      desc: '预装 flash-attn, xformers, accelerate, diffusers',
    },
    {
      title: 'DeepSeek-R1 & V3 / vLLM 0.6.3 / PyTorch 2.4 / CUDA 12.4',
      tag: '大模型专用',
      desc: '优化长文本显存分配，支持 AWQ / GPTQ 量化一键部署',
    },
    {
      title: 'TensorFlow 2.16.1 / Python 3.10 / CUDA 12.2',
      tag: '标准版',
      desc: 'Google 官方深度学习框架，含 Keras 3.0',
    },
    {
      title: 'Stable Diffusion WebUI / Forge / PyTorch 2.1 / CUDA 12.1',
      tag: 'AI画图一键包',
      desc: '开箱即用 SD WebUI, ControlNet, 常见热门采样器',
    },
    {
      title: 'Ubuntu 22.04 / Miniconda3 / CUDA 12.2 Base',
      tag: '极简底包',
      desc: '纯净轻量 Linux 开发环境，无预装多余 Python 依赖包',
    },
  ];

  const communityImages = [
    { title: 'Qwen2.5-7B-Instruct 全量推理环境 (含WebUI)' },
    { title: 'ChatGLM3-6B 知识库微调标准镜像' },
    { title: 'ComfyUI 旗舰整合包 (含50+常用节点扩展插件)' },
    { title: 'YOLOv10 / YOLOv8 目标检测与跟踪推理镜像' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#f4f6f9] overflow-y-auto text-slate-800 font-sans">
      {/* Top Header / Breadcrumb */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-800 text-xs flex items-center gap-1 font-medium transition-colors"
            >
              ← 返回算力市场
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-sm font-bold text-slate-900">
              创建主机 / 租赁实例 ({node.region} · {node.gpuModel})
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Form Body */}
      <div className="max-w-6xl mx-auto px-4 py-6 pb-32 space-y-4">
        
        {/* ================= CARD 1: 计费方式 ================= */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-slate-600 text-xs w-20 shrink-0 text-right font-medium">计费方式：</span>
            <div className="flex items-center gap-2">
              {[
                { id: 'hourly', label: '按量计费' },
                { id: 'daily', label: '包日' },
                { id: 'weekly', label: '包周' },
                { id: 'monthly', label: '包月' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setBillingMethod(m.id as any)}
                  className={`px-4 py-1.5 rounded text-xs transition-colors ${
                    billingMethod === m.id
                      ? 'bg-[#e0edff] text-[#2563eb] border border-[#90bbf8] font-medium'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {m.label}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setShowBillingRulesModal(true)}
                className="text-[#2563eb] text-xs hover:underline ml-2 cursor-pointer font-medium"
              >
                计费规则
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-400 pl-23 leading-relaxed">
            创建完主机后仍然可以转换计费方式。如选择按量计费，价格发生变动以实例开机时的价格为准
          </div>
        </div>

        {/* ================= CARD 2: 选择主机 ================= */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-5">
          {/* Label + Host Table */}
          <div className="flex items-start gap-3">
            <span className="text-slate-600 text-xs w-20 shrink-0 text-right font-medium pt-2">选择主机：</span>
            
            <div className="flex-1 overflow-x-auto">
              <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                {/* Table Header */}
                <div className="grid grid-cols-8 bg-[#f8fafc] text-slate-500 font-medium py-2.5 px-3 border-b border-slate-200 text-center">
                  <div className="text-left pl-2">主机ID</div>
                  <div>算力型号/显存</div>
                  <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-slate-800">
                    <span>空闲GPU</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                  <div>每GPU分配</div>
                  <div>CPU型号</div>
                  <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-slate-800">
                    <span>硬盘</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                  <div>驱动/CUDA</div>
                  <div>价格(单卡)</div>
                </div>

                {/* Table Selected Row (Exact match to screenshot) */}
                <div className="grid grid-cols-8 items-center py-3.5 px-3 bg-white hover:bg-blue-50/20 transition-colors text-center">
                  {/* Col 1: Radio & Machine ID */}
                  <div className="flex items-center gap-2 text-left pl-2">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-[#2563eb] flex items-center justify-center shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
                    </span>
                    <span className="font-bold text-[#2563eb]">
                      {node.nodeCode ? node.nodeCode.replace('#', '') : 'B51机'}
                    </span>
                  </div>

                  {/* Col 2: GPU Model & VRAM */}
                  <div className="text-slate-800 leading-tight">
                    <div className="font-medium">{node.gpuModel}</div>
                    <div className="text-slate-500 text-[11px]">{node.vramPerCard * (node.gpuModel.includes('6000') ? 4 : 1)}GB</div>
                  </div>

                  {/* Col 3: Idle / Total */}
                  <div className="font-mono text-slate-700">
                    <span className="font-bold text-slate-900 text-sm">
                      {Math.max(1, node.gpuCountAvailable)}
                    </span>
                    <span className="text-slate-400 ml-1">/ {node.gpuCountTotal || 9}</span>
                  </div>

                  {/* Col 4: Per GPU Alloc */}
                  <div className="text-slate-700 text-[11px] leading-tight">
                    <div>CPU: {cpuCoresPerCard}核</div>
                    <div>内存: {ramGbPerCard}GB</div>
                  </div>

                  {/* Col 5: CPU Model */}
                  <div className="text-slate-700 text-[11px] font-sans px-1">
                    {node.cpuSpecs || 'Xeon(R) Platinum 8470Q'}
                  </div>

                  {/* Col 6: Disk */}
                  <div className="text-slate-700 text-[11px] leading-tight">
                    <div>数据盘: 50GB</div>
                    <div className="text-slate-500">可扩容: 174GB</div>
                  </div>

                  {/* Col 7: Driver / CUDA */}
                  <div className="text-slate-700 text-[11px] leading-tight">
                    <div>驱动: {node.driverVersion || '580.95.05'}</div>
                    <div>CUDA: {node.cudaVersion || '13.0'}</div>
                  </div>

                  {/* Col 8: Price (Single Card) */}
                  <div className="leading-tight">
                    <div className="text-[#ef4444] font-bold font-mono text-sm">
                      ¥{node.pricePerHour.toFixed(2)}/时
                    </div>
                    <div className="text-slate-400 text-[11px] font-mono line-through">
                      ¥{(node.pricePerHour * 1.05).toFixed(2)}/时
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* GPU 数量 */}
          <div className="flex items-center gap-3">
            <span className="text-slate-600 text-xs w-20 shrink-0 text-right font-medium">GPU数量：</span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((cnt) => {
                const isSelectable = cnt <= Math.max(1, node.gpuCountAvailable);
                return (
                  <button
                    key={cnt}
                    type="button"
                    disabled={!isSelectable}
                    onClick={() => setSelectedCardsCount(cnt)}
                    className={`w-7 h-7 rounded text-xs transition-colors flex items-center justify-center font-mono ${
                      selectedCardsCount === cnt
                        ? 'bg-[#e0edff] text-[#2563eb] border border-[#90bbf8] font-bold'
                        : isSelectable
                        ? 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 cursor-pointer'
                        : 'bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed'
                    }`}
                  >
                    {cnt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 数据盘扩容 */}
          <div className="flex items-center gap-3">
            <span className="text-slate-600 text-xs w-20 shrink-0 text-right font-medium">数据盘：</span>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-slate-700">免费50GB</span>
              
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={needDiskExpand}
                  onChange={(e) => setNeedDiskExpand(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-0 accent-blue-600 cursor-pointer w-3.5 h-3.5"
                />
                <span>需要扩容</span>
              </label>

              {needDiskExpand && (
                <div className="flex items-center gap-3 bg-blue-50/60 border border-blue-200 px-3 py-1 rounded-lg text-xs animate-fade-in">
                  <span className="text-slate-600">额外扩容容量:</span>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    value={expandedDiskGb}
                    onChange={(e) => setExpandedDiskGb(Number(e.target.value))}
                    className="w-32 accent-blue-600 cursor-pointer"
                  />
                  <span className="font-mono text-blue-700 font-bold">+{expandedDiskGb} GB</span>
                  <span className="text-slate-400 text-[11px]">(+¥{(expandedDiskGb * 0.0003).toFixed(3)}/时)</span>
                </div>
              )}
            </div>
          </div>

          {/* Light-Blue Summary Box (Exact match to screenshot) */}
          <div className="bg-[#eef5fe] border border-[#dbeafe] rounded-lg p-4 text-xs text-slate-700">
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-center">
              <div className="text-slate-500 font-medium">实例规格：</div>

              <div>
                <span className="text-slate-400 block text-[11px]">GPU型号</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {node.gpuModel} * {selectedCardsCount}卡
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">CPU</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {totalCpuCores}核心
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">内存</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {totalRamGb}GB
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">系统盘</span>
                <span className="font-semibold text-slate-900 font-mono">
                  30GB
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">数据盘</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {needDiskExpand ? `免费50GB + 扩容${expandedDiskGb}GB SSD` : '免费50GB SSD'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CARD 3: 镜像 ================= */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-slate-600 text-xs w-20 shrink-0 text-right font-medium">镜像：</span>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setImageTab('base')}
                className={`px-4 py-1.5 rounded text-xs transition-colors ${
                  imageTab === 'base'
                    ? 'bg-[#e0edff] text-[#2563eb] border border-[#90bbf8] font-medium'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                基础镜像
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setImageTab('community')}
                  className={`px-4 py-1.5 rounded text-xs transition-colors ${
                    imageTab === 'community'
                      ? 'bg-[#e0edff] text-[#2563eb] border border-[#90bbf8] font-medium'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  社区镜像
                </button>
                <span className="absolute -top-1.5 -right-1 bg-[#ef4444] text-white text-[9px] font-bold px-1 rounded-full leading-none py-0.5">
                  hot
                </span>
              </div>

              <button
                type="button"
                onClick={() => setImageTab('mine')}
                className={`px-4 py-1.5 rounded text-xs transition-colors ${
                  imageTab === 'mine'
                    ? 'bg-[#e0edff] text-[#2563eb] border border-[#90bbf8] font-medium'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                我的镜像
              </button>

              <a
                href="#help"
                onClick={(e) => {
                  e.preventDefault();
                  alert('如需定制特殊环境，请拉起基础镜像后在终端内执行 conda/pip/apt 安装，或在控制台使用「保存为我的镜像」功能。');
                }}
                className="text-[#2563eb] text-xs hover:underline ml-2 cursor-pointer font-medium"
              >
                没有我要的环境？
              </a>
            </div>
          </div>

          <div className="text-xs text-slate-400 pl-23 leading-relaxed">
            基础镜像包含常用基本软件，如：深度学习框架、Miniconda等。如需其他软件可创建后安装
          </div>

          {/* Image Select Dropdown */}
          <div className="pl-23">
            <div className="relative max-w-2xl">
              <button
                type="button"
                onClick={() => setIsImageDropdownOpen(!isImageDropdownOpen)}
                className="w-full bg-white border border-slate-300 hover:border-slate-400 rounded-lg px-3.5 py-2.5 text-xs text-left flex items-center justify-between text-slate-800 transition-colors cursor-pointer"
              >
                <span className="truncate font-medium text-slate-900">
                  {selectedImage || '请选择框架名称/框架版本/Python版本/CUDA版本'}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
              </button>

              {isImageDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-30 max-h-64 overflow-y-auto p-1.5 space-y-1">
                  {imageTab === 'base' ? (
                    imageOptions.map((opt, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedImage(opt.title);
                          setIsImageDropdownOpen(false);
                        }}
                        className={`p-2.5 rounded-lg cursor-pointer text-xs transition-colors flex items-start justify-between ${
                          selectedImage === opt.title
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-slate-900">{opt.title}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</div>
                        </div>
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-mono shrink-0 ml-2">
                          {opt.tag}
                        </span>
                      </div>
                    ))
                  ) : (
                    communityImages.map((c, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedImage(c.title);
                          setIsImageDropdownOpen(false);
                        }}
                        className="p-2.5 rounded-lg cursor-pointer text-xs hover:bg-slate-50 text-slate-700 flex items-center justify-between"
                      >
                        <span className="font-medium text-slate-900">{c.title}</span>
                        <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-medium">社区热门</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= CARD 4: 优惠券 ================= */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-600 text-xs w-20 shrink-0 text-right font-medium">优惠券：</span>
            
            <div className="relative max-w-xs flex-1">
              <button
                type="button"
                onClick={() => setIsCouponDropdownOpen(!isCouponDropdownOpen)}
                className="w-full bg-white border border-slate-300 hover:border-slate-400 rounded-lg px-3 py-2 text-xs text-left flex items-center justify-between text-slate-800 transition-colors cursor-pointer"
              >
                <span className="truncate">{selectedCoupon}</span>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
              </button>

              {isCouponDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-30 p-1 space-y-1 text-xs">
                  {[
                    '不使用优惠券',
                    '新用户注册体验券 (抵扣 ¥10.00)',
                    '老用户返现抵扣券 (抵扣 ¥5.00)',
                  ].map((cpn, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedCoupon(cpn);
                        setIsCouponDropdownOpen(false);
                      }}
                      className={`p-2 rounded cursor-pointer ${
                        selectedCoupon === cpn ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {cpn}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ================= FIXED BOTTOM ACTION BAR (Footer) ================= */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 py-3 px-6 md:px-12 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left / Center Cost & Balance Indicators */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600">
            {/* 日常费用 */}
            <div className="flex items-center gap-1">
              <span>日常费用：</span>
              <span className="text-[#ef4444] font-bold text-lg font-mono">¥0.00</span>
              <span className="text-slate-400">/日</span>
              <button
                type="button"
                onClick={() => setShowBillingRulesModal(true)}
                className="text-slate-400 hover:text-slate-600 ml-0.5"
                title="日常存储与关机待机费用说明"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 配置费用 */}
            <div className="flex items-center gap-1.5">
              <span>配置费用：</span>
              <span className="text-[#ef4444] font-bold text-lg font-mono">
                ¥{totalConfigPricePerHour.toFixed(2)}
              </span>
              <span className="text-slate-400">/时</span>
              <button
                type="button"
                onClick={() => setShowCostDetailModal(true)}
                className="text-[#2563eb] hover:underline ml-1 cursor-pointer font-medium"
              >
                费用明细
              </button>
            </div>

            {/* 账户余额 */}
            <div className="flex items-center gap-1.5 border-l border-slate-200 pl-4">
              <span>账户余额：</span>
              <span className="font-mono font-bold text-slate-900">
                ¥{currentUser.walletBalance.toFixed(2)}
              </span>

              {currentUser.walletBalance <= 0 ? (
                <button
                  type="button"
                  onClick={() => setShowRechargeModal(true)}
                  className="text-[#2563eb] font-medium hover:underline ml-1 cursor-pointer"
                >
                  余额不足去充值
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowRechargeModal(true)}
                  className="text-[#2563eb] hover:underline ml-1 cursor-pointer"
                >
                  去充值
                </button>
              )}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-xs font-medium transition-colors"
            >
              取消
            </button>

            <button
              type="button"
              onClick={handleCreateAndBoot}
              className="px-8 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded text-xs font-medium shadow-sm transition-colors cursor-pointer"
            >
              创建并开机
            </button>
          </div>
        </div>
      </div>

      {/* 计费规则弹窗 */}
      {showBillingRulesModal && (
        <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs text-slate-700">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm">AutoDL 计费规则说明</h4>
              <button onClick={() => setShowBillingRulesModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="space-y-2 leading-relaxed">
              <p><strong>1. 按量计费（按秒计费）：</strong> 实例开机期间按整卡配置费用精确计费；随时可关机，关机后立即停止计算 GPU 与 CPU 费用。</p>
              <p><strong>2. 日常费用（关机仅存数据）：</strong> 关机状态下免费保留系统盘 30GB 与数据盘 50GB。仅在扩容数据盘时产生极低存储费（约 ¥0.0003/GB/时）。</p>
              <p><strong>3. 转换计费方式：</strong> 主机创建后，可在「我的实例」控制台随时转换至包日或包月特惠套餐。</p>
            </div>
            <div className="text-right pt-2">
              <button
                onClick={() => setShowBillingRulesModal(false)}
                className="px-4 py-1.5 bg-[#2563eb] text-white rounded text-xs font-medium"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 费用明细弹窗 */}
      {showCostDetailModal && (
        <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs text-slate-700">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm">费用明细构成</h4>
              <button onClick={() => setShowCostDetailModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>GPU 算力 ({node.gpuModel} * {selectedCardsCount}卡):</span>
                <span className="font-mono font-bold text-slate-900">¥{(node.pricePerHour * selectedCardsCount).toFixed(2)}/时</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>CPU & 内存分配 ({totalCpuCores}核 / {totalRamGb}GB):</span>
                <span className="font-mono text-emerald-600 font-medium">免费配比包含</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>系统盘 (30GB SSD):</span>
                <span className="font-mono text-emerald-600 font-medium">免费包含</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>数据盘基础 (50GB SSD):</span>
                <span className="font-mono text-emerald-600 font-medium">免费包含</span>
              </div>
              {needDiskExpand && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>数据盘扩容 (+{expandedDiskGb}GB):</span>
                  <span className="font-mono text-slate-900 font-medium">+¥{(expandedDiskGb * 0.0003).toFixed(3)}/时</span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-100 text-[#ef4444]">
                  <span>优惠券抵扣:</span>
                  <span className="font-mono font-bold">-¥{couponDiscount.toFixed(2)} 首期抵扣</span>
                </div>
              )}
              <div className="flex justify-between pt-2 text-sm font-bold text-slate-900">
                <span>总计实付预估：</span>
                <span className="text-[#ef4444] font-mono">¥{totalConfigPricePerHour.toFixed(2)}/时</span>
              </div>
            </div>
            <div className="text-right pt-2">
              <button
                onClick={() => setShowCostDetailModal(false)}
                className="px-4 py-1.5 bg-[#2563eb] text-white rounded text-xs font-medium"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 充值弹窗 */}
      {showRechargeModal && (
        <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs text-slate-700">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm">账户充值</h4>
              <button onClick={() => setShowRechargeModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="space-y-3">
              <p className="text-slate-500">当前余额：<span className="font-mono font-bold text-slate-900">¥{currentUser.walletBalance.toFixed(2)}</span></p>
              <div className="grid grid-cols-3 gap-2">
                {[50, 100, 200].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setRechargeAmountInput(amt)}
                    className={`py-2 rounded font-mono font-bold border transition-colors ${
                      rechargeAmountInput === amt ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    ¥{amt}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRechargeModal(false)}
                className="px-4 py-1.5 bg-slate-100 text-slate-700 rounded text-xs font-medium"
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (onRecharge) onRecharge(rechargeAmountInput);
                  setShowRechargeModal(false);
                }}
                className="px-4 py-1.5 bg-[#2563eb] text-white rounded text-xs font-medium"
              >
                确认充值 (模拟已到账)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
