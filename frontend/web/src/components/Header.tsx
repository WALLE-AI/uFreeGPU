import React, { useState } from 'react';
import { Network, Server, Play, Coins, Layers, Cpu, LogOut, ChevronDown, User, Disc, LayoutDashboard } from 'lucide-react';

interface HeaderProps {
  isLoggedIn: boolean;
  currentUser: {
    name: string;
    role: 'developer' | 'provider';
    walletBalance: number;
    avatar: string;
  };
  currentTab: 'hero' | 'market' | 'instances' | 'provider' | 'architecture' | 'images';
  setCurrentTab: (tab: 'hero' | 'market' | 'instances' | 'provider' | 'architecture' | 'images') => void;
  instancesCount: number;
  availableGpuCount: number;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isLoggedIn,
  currentUser,
  currentTab,
  setCurrentTab,
  instancesCount,
  availableGpuCount,
  onOpenLogin,
  onOpenRegister,
  onLogout,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);

  return (
    <header className={`sticky top-0 z-50 backdrop-blur transition-colors ${
      isLoggedIn 
        ? 'border-b border-slate-200 bg-white/95 text-slate-800 shadow-xs' 
        : 'border-b border-slate-800 bg-slate-900/80 text-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <button 
          onClick={() => {
            if (isLoggedIn) {
              setCurrentTab('market');
            } else {
              setCurrentTab('hero');
            }
          }}
          className="flex items-center gap-3 text-left focus:outline-none group whitespace-nowrap shrink-0"
        >
          <div className="bg-blue-600 p-2 rounded-lg text-white font-bold text-lg flex items-center justify-center shadow-md shadow-blue-600/20">
            <Network className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
          </div>
          <span className={`text-xl font-bold tracking-tight ${
            isLoggedIn 
              ? 'text-slate-900' 
              : 'bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent'
          }`}>
            uFreeGPU
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        {!isLoggedIn ? (
          // 未登录状态导航
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
            <button
              onClick={() => setCurrentTab('hero')}
              className={`hover:text-indigo-400 transition ${currentTab === 'hero' ? 'text-indigo-400 font-medium' : ''}`}
            >
              产品介绍
            </button>
            <button
              onClick={onOpenLogin}
              className="hover:text-indigo-400 transition"
            >
              算力商城
            </button>
          </nav>
        ) : (
          // 登录成功后：导航栏仅保留【算力商城】与【我的实例】两个模块 (AutoDL 风格)
          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            <button
              onClick={() => setCurrentTab('market')}
              className={`transition py-2 flex items-center gap-2 ${
                currentTab === 'market'
                  ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Server className="w-4 h-4 text-blue-600" />
              算力商城
            </button>

            <button
              onClick={() => setCurrentTab('instances')}
              className={`transition py-2 flex items-center gap-2 ${
                currentTab === 'instances'
                  ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" />
              控制台
              {instancesCount > 0 && (
                <span className="text-[11px] font-mono px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-full font-bold">
                  {instancesCount}
                </span>
              )}
            </button>
          </nav>
        )}

        {/* Zone 3: Actions & User Avatar */}
        <div className="flex items-center space-x-4">
          {!isLoggedIn ? (
            // Unauthenticated buttons
            <>
              <button
                onClick={onOpenLogin}
                className="text-sm text-slate-300 hover:text-white font-medium px-3 py-1.5 transition"
              >
                登录
              </button>
              <button
                onClick={onOpenRegister}
                className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-xl transition shadow-lg shadow-indigo-600/30 whitespace-nowrap"
              >
                免费注册 / 开箱即用
              </button>
            </>
          ) : (
            // Authenticated indicators matching AutoDL
            <>
              <div className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5 whitespace-nowrap font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                全网可用算力: <span className="font-mono tabular-nums font-semibold">{availableGpuCount}</span> 卡
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center font-bold text-sm text-white transition focus:outline-none shadow-sm"
                  title="用户菜单"
                >
                  {currentUser.avatar}
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl p-2 shadow-xl z-50 text-xs">
                    <div className="p-2.5 border-b border-slate-100">
                      <div className="font-bold text-slate-900 text-xs">{currentUser.name}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        钱包余额: <span className="font-mono text-emerald-600 font-bold">¥{currentUser.walletBalance.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setCurrentTab('market');
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition"
                      >
                        算力商城
                      </button>
                      <button
                        onClick={() => {
                          setCurrentTab('instances');
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition"
                      >
                        控制台 ({instancesCount})
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        退出登录 (回到官网)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
