import React, { useState } from 'react';
import { IMAGE_TEMPLATES } from '../data/mockData';
import { ImageTemplate } from '../types/gpu';
import { 
  Disc, 
  Download, 
  Tag, 
  Terminal, 
  ExternalLink, 
  Search, 
  Check, 
  Play,
  Layers,
  Sparkles
} from 'lucide-react';

interface ImagesRepositoryProps {
  onLaunchImage: (image: ImageTemplate) => void;
}

export const ImagesRepository: React.FC<ImagesRepositoryProps> = ({
  onLaunchImage,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: '全部镜像' },
    { id: 'PyTorch', label: 'PyTorch 生态' },
    { id: 'LLM微调与推理', label: '大模型 / DeepSeek' },
    { id: '生图绘图', label: 'Stable Diffusion / ComfyUI' },
  ];

  const filteredImages = IMAGE_TEMPLATES.filter((img) => {
    if (selectedCategory !== 'all' && img.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        img.title.toLowerCase().includes(q) ||
        img.description.toLowerCase().includes(q) ||
        img.cudaVersion.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <Disc className="w-6 h-6 text-indigo-400" />
            官方与社区公共镜像仓库
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            预装完整 CUDA 驱动加速与常用 Python 依赖包，分秒级挂载拉起，告别繁琐的环境配置
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs w-full sm:w-auto">
            <span className="text-slate-400 w-20 shrink-0">镜像类别：</span>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap font-medium ${
                  selectedCategory === c.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="搜索镜像名称 / CUDA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Image Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredImages.map((img) => (
          <div
            key={img.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/50 transition-all flex flex-col justify-between group shadow-lg"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {img.tag}
                  </span>
                  <span className="text-xs text-slate-400">{img.category}</span>
                </div>
                <div className="text-right text-xs text-slate-400">
                  下载量: <span className="font-mono text-cyan-400 font-semibold">{img.downloadsCount}</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors mb-2">
                {img.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {img.description}
              </p>

              <div className="space-y-1.5 text-xs bg-slate-950/70 p-3 rounded-xl border border-slate-800 font-mono text-slate-400 mb-4">
                <div className="flex justify-between">
                  <span>驱动环境:</span>
                  <span className="text-slate-200">{img.cudaVersion} · {img.pythonVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span>镜像体积:</span>
                  <span className="text-slate-200">{img.sizeGb} GB (P2P 秒级加载)</span>
                </div>
                <div className="flex justify-between">
                  <span>版本号:</span>
                  <span className="text-indigo-400 font-semibold">{img.version}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                支持开箱即用 JupyterLab & VSCode
              </span>

              <button
                onClick={() => onLaunchImage(img)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/25 transition flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 text-emerald-300" />
                以该镜像租用 GPU
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
