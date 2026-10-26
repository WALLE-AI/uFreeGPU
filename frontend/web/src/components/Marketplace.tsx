import React, { useState, useMemo } from 'react';
import { GpuNode } from '../types/gpu';
import { 
  AlertCircle, 
  HelpCircle, 
  Sparkles, 
  Search,
  Check,
  ShieldAlert,
  Flame,
  Info
} from 'lucide-react';

interface AutoDlCardItem {
  id: string;
  nodeCode: string;
  region: string;
  machineId: string;
  hashId: string;
  validUntil: string;
  hasCacheOptimization: boolean;
  modelTitle: string;
  idleCount: number;
  totalCount: number;
  cpuSpec: string;
  ramGb: number;
  systemDiskGb: number;
  dataDiskGb: number;
  expandableDiskGb: number;
  gpuDriver: string;
  cudaVersion: string;
  pricePerHour: number;
  memberPricePerHour: number;
  isRetail?: boolean;
  providerNote?: string;
  gpuCountAvailable: number;
  gpuCountTotal: number;
}

interface MarketplaceProps {
  nodes: GpuNode[];
  onRentNode: (node: GpuNode) => void;
  onOpenDiagnostic: (node: GpuNode) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  nodes,
  onRentNode,
  onOpenDiagnostic,
}) => {
  // 1. Billing method: 按量计费, 包日, 包周, 包月
  const [billingMethod, setBillingMethod] = useState<'hourly' | 'daily' | 'weekly' | 'monthly'>('hourly');

  // 2. Region selection: 西北B区, 北京B区, 重庆A区, 内蒙A区, 北京A区, 佛山区, V100专区, A800专区, 摩尔线程专区
  const [selectedRegion, setSelectedRegion] = useState<string>('西北B区');

  // 3. GPU Model Filter: multi-select / single select
  const [selectedGpuModels, setSelectedGpuModels] = useState<string[]>(['全部']);

  // 4. GPU Quantity
  const [selectedGpuQuantity, setSelectedGpuQuantity] = useState<number>(1);

  // Exact GPU models list matching screenshot
  const gpuFilterOptions = [
    { label: '全部', key: '全部', countText: '' },
    { label: 'vGPU-32GB', key: 'vGPU-32GB', countText: '(0/2542)' },
    { label: 'RTX 5090', key: 'RTX 5090', countText: '(0/2056)' },
    { label: 'RTX PRO 6000', key: 'RTX PRO 6000', countText: '(5/1588)' },
    { label: 'RTX 6000D', key: 'RTX 6000D', countText: '(0/464)' },
    { label: 'PRO 6000 Max-Q', key: 'PRO 6000 Max-Q', countText: '(0/8)' },
    { label: 'vGPU-48GB', key: 'vGPU-48GB', countText: '(1/970)' },
    { label: 'RTX 5090 D', key: 'RTX 5090 D', countText: '(0/240)' },
    { label: 'RTX PRO 5000', key: 'RTX PRO 5000', countText: '(0/80)' },
    { label: 'H800', key: 'H800', countText: '(0/96)' },
    { label: 'RTX 4090D', key: 'RTX 4090D', countText: '(0/1056)' },
    { label: 'RTX 4090', key: 'RTX 4090', countText: '(2/1776)' },
    { label: 'RTX 3090', key: 'RTX 3090', countText: '(3/210)' },
    { label: 'RTX 3080 Ti', key: 'RTX 3080 Ti', countText: '(0/376)' },
    { label: 'RTX 3080x2', key: 'RTX 3080x2', countText: '(0/316)' },
    { label: 'RTX A4000', key: 'RTX A4000', countText: '(0/24)' },
    { label: 'RTX 3060', key: 'RTX 3060', countText: '(0/32)' },
    { label: 'GTX 1080 Ti', key: 'GTX 1080 Ti', countText: '(0/14)' },
    { label: 'CPU', key: 'CPU', countText: '(0/320)' },
    { label: 'CPU-close-HT', key: 'CPU-close-HT', countText: '(0/6)' },
    { label: 'vGPU-48GB-350W', key: 'vGPU-48GB-350W', countText: '(0/152)' },
  ];

  const handleToggleGpuModel = (key: string) => {
    if (key === '全部') {
      setSelectedGpuModels(['全部']);
      return;
    }
    let newSelected = selectedGpuModels.filter((m) => m !== '全部');
    if (newSelected.includes(key)) {
      newSelected = newSelected.filter((m) => m !== key);
      if (newSelected.length === 0) newSelected = ['全部'];
    } else {
      newSelected.push(key);
    }
    setSelectedGpuModels(newSelected);
  };

  // Detailed AutoDL card items reflecting the screenshot and user's supply nodes (including 4090, A100, 3090, PRO 6000)
  const autoDlCards: AutoDlCardItem[] = useMemo(() => {
    return [
      {
        id: 'card-1',
        nodeCode: '#044机',
        region: '西北B区',
        machineId: '044机',
        hashId: '092744b87a',
        validUntil: '2027-10-01',
        hasCacheOptimization: true,
        modelTitle: 'vGPU-48GB / 48 GB',
        idleCount: 1,
        totalCount: 8,
        cpuSpec: '25 核，Xeon(R) Platinum 8470Q',
        ramGb: 92,
        systemDiskGb: 30,
        dataDiskGb: 50,
        expandableDiskGb: 50,
        gpuDriver: '595.71.05',
        cudaVersion: '≤ 13.2',
        pricePerHour: 3.03,
        memberPricePerHour: 2.88,
        gpuCountAvailable: 1,
        gpuCountTotal: 8,
      },
      {
        id: 'card-2',
        nodeCode: '#805机',
        region: '西北B区',
        machineId: '805机',
        hashId: '3f8d4293f0',
        validUntil: '2027-07-01',
        hasCacheOptimization: false,
        modelTitle: 'RTX PRO 6000 / 96 GB',
        idleCount: 0,
        totalCount: 9,
        cpuSpec: '22 核，Xeon(R) Platinum 8470Q',
        ramGb: 110,
        systemDiskGb: 30,
        dataDiskGb: 50,
        expandableDiskGb: 0,
        gpuDriver: '580.82.09',
        cudaVersion: '≤ 13.0',
        pricePerHour: 7.35,
        memberPricePerHour: 6.98,
        gpuCountAvailable: 0,
        gpuCountTotal: 9,
      },
      {
        id: 'card-3',
        nodeCode: '#B51机',
        region: '西北B区',
        machineId: 'B51机',
        hashId: 'ndkcfk2mjn',
        validUntil: '2027-07-01',
        hasCacheOptimization: true,
        modelTitle: 'RTX PRO 6000 / 96 GB',
        idleCount: 1,
        totalCount: 9,
        cpuSpec: '22 核，Xeon(R) Platinum 8470Q',
        ramGb: 110,
        systemDiskGb: 30,
        dataDiskGb: 50,
        expandableDiskGb: 174,
        gpuDriver: '580.95.05',
        cudaVersion: '13.0',
        pricePerHour: 7.35,
        memberPricePerHour: 7.35,
        gpuCountAvailable: 1,
        gpuCountTotal: 9,
      },
      // 散户合作者A (4卡4090)
      {
        id: 'card-4',
        nodeCode: '#A829',
        region: '西北B区',
        machineId: 'A829机',
        hashId: 'a829f041ee',
        validUntil: '2026-12-31',
        hasCacheOptimization: true,
        modelTitle: 'RTX 4090 / 24 GB',
        idleCount: 2,
        totalCount: 4,
        cpuSpec: '16 核，AMD Ryzen 7950X',
        ramGb: 64,
        systemDiskGb: 30,
        dataDiskGb: 50,
        expandableDiskGb: 500,
        gpuDriver: '535.104.05',
        cudaVersion: '≤ 12.2',
        pricePerHour: 2.10,
        memberPricePerHour: 1.99,
        isRetail: true,
        providerNote: '散户合作者A (工作室4卡4090，UPS保电，双千兆)',
        gpuCountAvailable: 2,
        gpuCountTotal: 4,
      },
      // 极客B (1卡A100)
      {
        id: 'card-5',
        nodeCode: '#B102',
        region: '北京B区',
        machineId: 'B102机',
        hashId: 'b102ec881c',
        validUntil: '2027-01-01',
        hasCacheOptimization: true,
        modelTitle: 'A100-PCIE / 80 GB',
        idleCount: 1,
        totalCount: 1,
        cpuSpec: '32 核，Intel Xeon Platinum',
        ramGb: 256,
        systemDiskGb: 30,
        dataDiskGb: 50,
        expandableDiskGb: 1000,
        gpuDriver: '535.54.03',
        cudaVersion: '≤ 12.2',
        pricePerHour: 8.50,
        memberPricePerHour: 8.07,
        providerNote: '极客B (IDC托管BGP千兆专线，大模型高显存)',
        gpuCountAvailable: 1,
        gpuCountTotal: 1,
      },
      // 散户C (4卡3090)
      {
        id: 'card-6',
        nodeCode: '#C411',
        region: '西北B区',
        machineId: 'C411机',
        hashId: 'c41109927b',
        validUntil: '2026-11-30',
        hasCacheOptimization: true,
        modelTitle: 'RTX 3090 / 24 GB',
        idleCount: 3,
        totalCount: 4,
        cpuSpec: '12 核，Intel i9-12900K',
        ramGb: 64,
        systemDiskGb: 30,
        dataDiskGb: 50,
        expandableDiskGb: 300,
        gpuDriver: '525.60.13',
        cudaVersion: '≤ 12.0',
        pricePerHour: 1.20,
        memberPricePerHour: 1.14,
        isRetail: true,
        providerNote: '散户C (高校闲置卡，适合低预算与绘图炼丹)',
        gpuCountAvailable: 3,
        gpuCountTotal: 4,
      },
    ];
  }, []);

  // Filter cards by selected GPU model and region
  const filteredCards = useMemo(() => {
    return autoDlCards.filter((card) => {
      // Model match
      if (!selectedGpuModels.includes('全部')) {
        const hasMatchedModel = selectedGpuModels.some((m) =>
          card.modelTitle.toLowerCase().includes(m.toLowerCase())
        );
        if (!hasMatchedModel) return false;
      }
      return true;
    });
  }, [autoDlCards, selectedGpuModels]);

  // Convert AutoDL card to GpuNode to feed the rent dialog
  const handleRentAutoDlCard = (card: AutoDlCardItem) => {
    const matchedNode: GpuNode = {
      id: card.id,
      nodeCode: card.nodeCode,
      providerName: card.providerNote || `${card.region} ${card.machineId}`,
      providerType: card.isRetail ? 'retail' : 'datacenter',
      gpuModel: card.modelTitle.includes('4090')
        ? 'RTX 4090'
        : card.modelTitle.includes('A100')
        ? 'NVIDIA A100-PCIE'
        : card.modelTitle.includes('3090')
        ? 'RTX 3090'
        : (card.modelTitle.split('/')[0].trim() as any),
      gpuCountTotal: card.totalCount,
      gpuCountAvailable: card.idleCount,
      vramPerCard: parseInt(card.modelTitle.split('/')[1]) || 24,
      vramType: card.modelTitle.includes('A100') ? 'HBM2e' : 'GDDR6X',
      driverVersion: card.gpuDriver,
      cudaVersion: card.cudaVersion.replace('≤', '').trim(),
      cpuSpecs: card.cpuSpec,
      ramGb: card.ramGb,
      diskGb: card.systemDiskGb + card.dataDiskGb,
      networkUploadMbps: card.isRetail ? 100 : 1000,
      networkDownloadMbps: card.isRetail ? 150 : 1000,
      natType: card.isRetail ? '全通内网P2P' : '独享公网IP',
      pricePerHour: card.pricePerHour,
      pricePerDay: card.pricePerHour * 20,
      priceSpotPerHour: card.pricePerHour * 0.6,
      reliabilityScore: 99.2,
      uptimeDays: 45,
      region: card.region,
      slaTier: card.isRetail ? 'Tier A (优质散户)' : 'Tier S (机房托管)',
      nvlinkSupported: card.modelTitle.includes('A100'),
      tempAvgCelsius: 56,
      status: card.idleCount > 0 ? 'online' : 'busy',
      description: card.providerNote || 'AutoDL 工业级标准算力节点',
    };

    onRentNode(matchedNode);
  };

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* Top Filter Card - Exactly as in AutoDL Screenshot */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 text-xs">
        {/* 计费方式 */}
        <div className="flex items-center gap-3">
          <span className="text-slate-500 w-16 shrink-0 text-right">计费方式：</span>
          <div className="flex items-center gap-2">
            {[
              { id: 'hourly', label: '按量计费' },
              { id: 'daily', label: '包日' },
              { id: 'weekly', label: '包周' },
              { id: 'monthly', label: '包月' },
            ].map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBillingMethod(b.id as any)}
                className={`px-4 py-1.5 rounded text-xs transition-colors ${
                  billingMethod === b.id
                    ? 'bg-[#dbeafe] text-[#2563eb] border border-[#93c5fd] font-medium'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* 选择地区 */}
        <div className="flex items-start gap-3">
          <span className="text-slate-500 w-16 shrink-0 text-right pt-1.5">选择地区：</span>
          <div className="space-y-2">
            {/* Main Regions */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                '西北B区',
                '北京B区',
                '重庆A区',
                '内蒙B区',
                '北京A区',
                '佛山区',
              ].map((reg) => (
                <button
                  key={reg}
                  type="button"
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-3 py-1.5 rounded text-xs transition-colors ${
                    selectedRegion === reg
                      ? 'bg-[#dbeafe] text-[#2563eb] border border-[#93c5fd] font-medium'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>

            {/* Sub-special zones */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                'V100专区',
                'A800专区',
                '摩尔线程专区',
              ].map((zone) => (
                <button
                  key={zone}
                  type="button"
                  onClick={() => setSelectedRegion(zone)}
                  className={`px-3 py-1.5 rounded text-xs transition-colors ${
                    selectedRegion === zone
                      ? 'bg-[#dbeafe] text-[#2563eb] border border-[#93c5fd] font-medium'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {zone}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* GPU型号 (Checkboxes in grid) */}
        <div className="flex items-start gap-3 pt-1">
          <span className="text-slate-500 w-16 shrink-0 text-right pt-0.5">GPU型号：</span>
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-2 gap-x-2 text-[11px] text-slate-700">
            {gpuFilterOptions.map((opt) => {
              const isChecked = selectedGpuModels.includes(opt.key);
              return (
                <label
                  key={opt.key}
                  className="flex items-center gap-1.5 cursor-pointer select-none hover:text-blue-600 whitespace-nowrap"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleGpuModel(opt.key)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-0 accent-blue-600 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>
                    {opt.label}
                    {opt.countText && (
                      <span className="text-slate-400 font-mono ml-0.5">{opt.countText}</span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* GPU数量 */}
        <div className="flex items-center gap-3 pt-1">
          <span className="text-slate-500 w-16 shrink-0 text-right">GPU数量：</span>
          <div className="flex flex-wrap items-center gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setSelectedGpuQuantity(num)}
                className={`w-7 h-7 rounded text-xs transition-colors flex items-center justify-center font-mono ${
                  selectedGpuQuantity === num
                    ? 'bg-[#dbeafe] text-[#2563eb] border border-[#93c5fd] font-bold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Instance Card List - Exactly as in AutoDL Screenshot */}
      <div className="space-y-4">
        {filteredCards.map((card) => {
          const isAvailable = card.idleCount >= selectedGpuQuantity && card.idleCount > 0;

          return (
            <div
              key={card.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-sm transition-all"
            >
              {/* Header Meta line */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                <div className="flex items-center gap-2">
                  <span>{card.region} / {card.machineId}</span>
                  <span>|</span>
                  <span>{card.hashId}</span>
                  <span className="ml-2 font-sans">可租用至：{card.validUntil}</span>
                  {card.isRetail && (
                    <span className="ml-2 text-[10px] bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.2 rounded font-sans font-medium">
                      散户优质算力
                    </span>
                  )}
                </div>

                {/* Right Optimization tag */}
                {card.hasCacheOptimization && (
                  <div className="flex items-center gap-1 text-[#ea580c] text-xs font-medium">
                    <div className="w-4 h-4 rounded-full border border-[#ea580c] flex items-center justify-center text-[10px]">
                      +
                    </div>
                    <span>缓存优化</span>
                  </div>
                )}
              </div>

              {/* Title and Available Count */}
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  {card.modelTitle}
                </h3>

                <div className="text-xs text-slate-500 font-mono">
                  空闲/总量{' '}
                  <span className="text-2xl font-bold text-slate-900 font-sans ml-1">
                    {card.idleCount}
                  </span>{' '}
                  / {card.totalCount}
                </div>
              </div>

              {/* Main 3 columns specs + Right price and Rent button */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center pt-1 border-t border-slate-100 text-xs">
                {/* Col 1: 每GPU分配 */}
                <div className="space-y-1.5">
                  <div className="text-slate-400 font-medium">每GPU分配</div>
                  <div className="text-slate-700 font-mono">
                    CPU: <span className="text-slate-900 font-bold">{card.cpuSpec.split(' ')[0]} 核</span>，{card.cpuSpec.split('，')[1] || ''}
                  </div>
                  <div className="text-slate-700 font-mono">
                    内存: <span className="text-slate-900 font-bold">{card.ramGb} GB</span>
                  </div>
                </div>

                {/* Col 2: 硬盘 */}
                <div className="space-y-1.5">
                  <div className="text-slate-400 font-medium">硬盘</div>
                  <div className="text-slate-700 font-mono">
                    系统盘: {card.systemDiskGb} GB
                  </div>
                  <div className="text-slate-700 font-mono">
                    数据盘: {card.dataDiskGb} GB ，可扩容 {card.expandableDiskGb} GB
                  </div>
                </div>

                {/* Col 3: 其它 */}
                <div className="space-y-1.5">
                  <div className="text-slate-400 font-medium">其它</div>
                  <div className="text-slate-700 font-mono">
                    GPU驱动: {card.gpuDriver}
                  </div>
                  <div className="text-slate-700 font-mono flex items-center gap-1">
                    <span>CUDA版本: {card.cudaVersion}</span>
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>

                {/* Col 4: Price & 1卡可租 / 已租完 Button */}
                <div className="text-right flex flex-col items-end justify-center">
                  <div className="text-2xl font-bold text-[#ef4444] font-mono leading-none mb-1">
                    ¥ {card.pricePerHour.toFixed(2)}
                    <span className="text-xs text-slate-400 font-normal ml-0.5 font-sans">/时</span>
                  </div>

                  <div className="text-[11px] text-slate-400 mb-2 font-mono">
                    会员最低享9.5折 ¥{card.memberPricePerHour.toFixed(2)}/时
                  </div>

                  <button
                    onClick={() => handleRentAutoDlCard(card)}
                    disabled={!isAvailable}
                    className={`px-6 py-2 rounded font-medium text-xs transition-colors shadow-sm whitespace-nowrap min-w-[96px] ${
                      isAvailable
                        ? 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white cursor-pointer'
                        : 'bg-[#93c5fd]/50 text-white cursor-not-allowed'
                    }`}
                  >
                    {isAvailable ? `${selectedGpuQuantity}卡可租` : '已租完'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
