export type GpuModelType = 
  | 'RTX 4090' 
  | 'NVIDIA A100-PCIE' 
  | 'RTX 3090' 
  | 'RTX 4080' 
  | 'NVIDIA H100 SXM' 
  | 'NVIDIA L40S';

export type ProviderTier = 'Tier S (机房托管)' | 'Tier A (优质散户)' | 'Tier B (闲置极客)';

export interface GpuNode {
  id: string;
  nodeCode: string; // e.g. #A829
  providerName: string;
  providerType: 'retail' | 'datacenter' | 'miner';
  gpuModel: GpuModelType;
  gpuCountTotal: number;
  gpuCountAvailable: number;
  vramPerCard: number; // in GB
  vramType: string;
  driverVersion: string;
  cudaVersion: string;
  cpuSpecs: string;
  ramGb: number;
  diskGb: number;
  networkUploadMbps: number;
  networkDownloadMbps: number;
  natType: '全通内网P2P' | '中继网关加速' | '独享公网IP';
  pricePerHour: number;
  pricePerDay: number;
  priceSpotPerHour: number;
  reliabilityScore: number; // 99.2%
  uptimeDays: number;
  region: string;
  slaTier: ProviderTier;
  nvlinkSupported: boolean;
  tempAvgCelsius: number;
  status: 'online' | 'busy' | 'offline';
  description: string;
}

export interface UserInstance {
  id: string;
  name: string;
  nodeId: string;
  nodeCode: string;
  providerType: 'retail' | 'datacenter' | 'miner';
  gpuModel: GpuModelType;
  gpuCount: number;
  status: 'running' | 'paused' | 'creating' | 'migrating' | 'stopped';
  image: string;
  uptimeHours: number;
  pricePerHour: number;
  costTotal: number;
  sshCommand: string;
  sshPort: number;
  jupyterPort: number;
  gpuUsagePercent: number;
  vramUsedGb: number;
  vramTotalGb: number;
  cpuUsagePercent: number;
  ramUsedGb: number;
  ramTotalGb: number;
  diskUsedGb: number;
  diskTotalGb: number;
  autoCheckpoint: boolean;
  billingType: 'on-demand' | 'spot' | 'daily';
  createdAt: string;
}

export interface ProviderWorker {
  id: string;
  ownerName: string;
  nodeCode: string;
  nodeName: string;
  os: string;
  ipMasked: string;
  natMethod: string;
  p2pLatencyMs: number;
  cards: {
    slot: number;
    model: string;
    vramGb: number;
    temp: number;
    fanSpeed: number;
    powerWatt: number;
    isOccupied: boolean;
    renterUsername?: string;
  }[];
  monthlyProjectedEarnings: number;
  settledEarningsThisMonth: number;
  unsettledEarnings: number;
  onlineUptimePercent: number;
  status: 'active' | 'standby' | 'offline';
  temperatureLimit: number;
  autoSchedule: '24小时全天' | '夜间闲置 (22:00-08:00)' | '按需唤醒';
  daemonVersion: string;
}

export interface ImageTemplate {
  id: string;
  title: string;
  tag: string;
  category: 'PyTorch' | 'LLM微调与推理' | '生图绘图' | '深度学习基础';
  version: string;
  cudaVersion: string;
  pythonVersion: string;
  sizeGb: number;
  downloadsCount: string;
  description: string;
}

export interface SchedulingSimulationTask {
  id: string;
  taskTitle: string;
  userType: '算法实验室' | '独立AI开发者' | '高校研究生' | '初创企业';
  requestedModel: string;
  requestedCards: number;
  budgetPerHourMax: number;
  matchedNodeId: string;
  matchedNodeCode: string;
  matchScore: number;
  routingLatencyMs: number;
  status: '排队调度中' | '已分配算力' | '运行中' | '容灾漂移保护';
  reason: string;
}
