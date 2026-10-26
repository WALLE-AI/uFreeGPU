import React, { useState } from 'react';
import { 
  X, 
  ChevronDown, 
  MoreHorizontal, 
  Sparkles, 
  MessageSquare, 
  Check, 
  Lock, 
  Smartphone, 
  ShieldCheck,
  User,
  Cpu
} from 'lucide-react';
import datacenterImg from '../assets/images/datacenter_servers_1793029539676.jpg';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (userProfile: {
    name: string;
    role: 'developer' | 'provider';
    walletBalance: number;
    avatar: string;
  }) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  onClose,
  onLoginSuccess,
}) => {
  // Main Tab: 'login' | 'register'
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login Sub-mode: 'password' | 'sms'
  const [loginMode, setLoginMode] = useState<'password' | 'sms'>('password');

  // Form Fields
  const [phone, setPhone] = useState<string>('13888888888');
  const [password, setPassword] = useState<string>('••••••••');
  const [smsCode, setSmsCode] = useState<string>('684210');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number>(0);

  // Send SMS verification code countdown
  const handleSendCode = () => {
    if (countdown > 0) return;
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'register' && !agreeTerms) {
      alert('请先勾选同意《服务协议》和《隐私政策》');
      return;
    }

    onLoginSuccess({
      name: activeTab === 'register' ? '新注册AI开发者' : '高同学 (AI开发者)',
      role: 'developer',
      walletBalance: activeTab === 'register' ? 296.50 : 286.50, // Register gives +10 bonus
      avatar: 'U',
    });
  };

  // Quick 1-Click Demo Profiles
  const handleQuickDemoLogin = (type: 'dev' | 'provider_a' | 'provider_b') => {
    if (type === 'dev') {
      onLoginSuccess({
        name: '高同学 (AI开发者)',
        role: 'developer',
        walletBalance: 286.50,
        avatar: 'U',
      });
    } else if (type === 'provider_a') {
      onLoginSuccess({
        name: '合作者A (4卡4090矿主)',
        role: 'provider',
        walletBalance: 3420.00,
        avatar: 'A',
      });
    } else {
      onLoginSuccess({
        name: '极客B (A100 IDC托管)',
        role: 'provider',
        walletBalance: 2950.00,
        avatar: 'B',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col md:flex-row font-sans overflow-y-auto">
      
      {/* ================= LEFT COLUMN (机房实拍与品牌宣传 - 1:1还原截图) ================= */}
      <div className="w-full md:w-[32vw] md:min-w-[340px] md:max-w-[460px] shrink-0 relative bg-slate-950 flex flex-col justify-between p-8 md:p-12 text-white min-h-[460px] md:min-h-screen overflow-hidden">
        {/* Background Image with Dark Blue Vignette */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${datacenterImg})` }}
        />
        {/* Deep blue overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030d22]/85 via-[#030d22]/70 to-[#030d22]/95" />

        {/* Top: AutoDL Polygon Logo Icon + uFreeGPU Name */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/30">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white font-sans">
            uFreeGPU
          </span>
        </div>

        {/* Center: uFreeGPU AI算力云 + 弹性 / 好用 / 省钱 */}
        <div className="relative z-10 my-auto py-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-6">
            uFreeGPU AI算力云
          </h2>
          <ul className="space-y-4 text-white text-lg font-normal tracking-wide pl-1">
            <li className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>弹性</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>好用</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>省钱</span>
            </li>
          </ul>
        </div>

        {/* Bottom: 机房实拍 */}
        <div className="relative z-10 text-center text-xs text-white/40 tracking-widest font-light">
          机房实拍
        </div>
      </div>

      {/* ================= RIGHT COLUMN (白色登录 / 注册表单区域) ================= */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 relative bg-white min-h-[500px]">
        {/* Top Right: Return to product intro button */}
        <div className="flex justify-end w-full">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            title="关闭并返回首页"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Centered Form Card (Exact match to screenshot) */}
        <div className="w-full max-w-[380px] mx-auto my-auto space-y-7">
          
          {/* Tabs: 登录 vs 注册 */}
          <div className="flex items-center justify-center gap-14 text-lg font-bold">
            {/* 登录 Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`pb-2 transition-colors cursor-pointer relative ${
                activeTab === 'login'
                  ? 'text-[#2b66f6] font-bold after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#2b66f6] after:rounded-full'
                  : 'text-slate-800 font-bold hover:text-[#2b66f6]'
              }`}
            >
              登录
            </button>

            {/* 注册 Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`pb-2 transition-colors cursor-pointer relative ${
                activeTab === 'register'
                  ? 'text-[#2b66f6] font-bold after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#2b66f6] after:rounded-full'
                  : 'text-slate-800 font-bold hover:text-[#2b66f6]'
              }`}
            >
              注册
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Field 1: Phone number with +86 and country dropdown */}
            <div className="border border-slate-200 rounded-md flex items-center px-3 py-2.5 focus-within:border-[#2b66f6] transition-colors bg-white">
              <div className="flex items-center gap-1 text-xs text-slate-600 font-mono select-none cursor-pointer">
                <span>+86</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <span className="w-px h-4 bg-slate-200 mx-3 shrink-0" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="请输入手机号"
                className="flex-1 bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-mono"
                required
              />
              <MoreHorizontal className="w-4 h-4 text-slate-300 shrink-0" />
            </div>

            {/* Field 2: Password (when in password mode) or SMS Verification (when in SMS mode or Register) */}
            {activeTab === 'login' && loginMode === 'password' && (
              <div className="border border-slate-200 rounded-md flex items-center px-3 py-2.5 focus-within:border-[#2b66f6] transition-colors bg-white">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="flex-1 bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
                  required
                />
                <MoreHorizontal className="w-4 h-4 text-slate-300 shrink-0" />
              </div>
            )}

            {(activeTab === 'register' || (activeTab === 'login' && loginMode === 'sms')) && (
              <div className="border border-slate-200 rounded-md flex items-center px-3 py-2 focus-within:border-[#2b66f6] transition-colors bg-white">
                <input
                  type="text"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value)}
                  placeholder="请输入验证码"
                  className="flex-1 bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-mono tracking-wider"
                  required
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  className="text-xs text-[#2b66f6] hover:text-blue-700 font-medium px-2 py-1 select-none cursor-pointer whitespace-nowrap"
                >
                  {countdown > 0 ? `${countdown}秒后重发` : '获取验证码'}
                </button>
              </div>
            )}

            {/* Field 3: Set Password (Register Only) */}
            {activeTab === 'register' && (
              <div className="border border-slate-200 rounded-md flex items-center px-3 py-2.5 focus-within:border-[#2b66f6] transition-colors bg-white">
                <input
                  type="password"
                  placeholder="设置登录密码 (8-20位字符)"
                  className="flex-1 bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
                  required
                />
              </div>
            )}

            {/* Terms checkbox for register */}
            {activeTab === 'register' && (
              <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-0 accent-[#2b66f6] cursor-pointer"
                />
                <span>
                  我已阅读并同意
                  <span className="text-[#2b66f6] hover:underline cursor-pointer">《服务协议》</span>
                  和
                  <span className="text-[#2b66f6] hover:underline cursor-pointer">《隐私政策》</span>
                </span>
              </div>
            )}

            {/* Blue Submit Button: 登录 / 注册 */}
            <button
              type="submit"
              className="w-full bg-[#2b66f6] hover:bg-[#1f56e0] text-white py-2.5 rounded-md font-medium text-sm transition-colors shadow-2xs cursor-pointer mt-5"
            >
              {activeTab === 'login' ? '登录' : '注册并领取 ¥10 算力代金券'}
            </button>

            {/* Secondary Button: 微信登录 / 微信一键快速注册 */}
            <button
              type="button"
              onClick={() => {
                onLoginSuccess({
                  name: '微信扫码用户',
                  role: 'developer',
                  walletBalance: 286.50,
                  avatar: 'W',
                });
              }}
              className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 rounded-md text-xs mt-3 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#07C160]">
                <path d="M8.5 2C4.36 2 1 4.91 1 8.5c0 1.95.96 3.71 2.5 4.93L2.5 17l4.13-1.65c.6.14 1.23.22 1.87.22.25 0 .5-.02.74-.04C9.1 14.93 9 14.23 9 13.5 9 9.36 12.36 6 16.5 6c.55 0 1.08.05 1.6.15C17.06 3.73 13.1 2 8.5 2zm-2 4.5c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm4 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm6 3c-3.59 0-6.5 2.46-6.5 5.5s2.91 5.5 6.5 5.5c.53 0 1.05-.06 1.54-.18L21 21.5l-1-2.5c1.23-1 2-2.38 2-3.85 0-3.04-2.91-5.5-6.5-5.5zm-2 3c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75zm4 0c.41 0 .75.34.75.75s-.34.75-.75.75-.75-.34-.75-.75.34-.75.75-.75z" />
              </svg>
              <span>{activeTab === 'login' ? '微信登录' : '微信一键授权注册'}</span>
            </button>

            {/* Bottom Auxiliary Links (1:1 from screenshot) */}
            {activeTab === 'login' ? (
              <div className="flex items-center justify-between text-xs text-[#2b66f6] pt-1">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setLoginMode(loginMode === 'password' ? 'sms' : 'password')}
                    className="hover:underline cursor-pointer"
                  >
                    {loginMode === 'password' ? '短信登录' : '密码登录'}
                  </button>
                  <button
                    type="button"
                    onClick={() => alert('子账号登录系统：支持企业多账号权限隔离与配额分配')}
                    className="hover:underline cursor-pointer"
                  >
                    子账号登录
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => alert('请通过手机短信验证码快速重置密码')}
                  className="hover:underline cursor-pointer"
                >
                  忘记密码？
                </button>
              </div>
            ) : (
              <div className="text-center text-xs text-slate-500 pt-1">
                已有账号？{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-[#2b66f6] hover:underline font-medium cursor-pointer"
                >
                  去登录
                </button>
              </div>
            )}
          </form>

          {/* Quick Demo Login Bar for Evaluators */}
          <div className="pt-6 border-t border-slate-100">
            <div className="text-[11px] text-slate-400 mb-2 flex items-center justify-between">
              <span>测试体验快速通道 (免验证码一键直达)：</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('dev')}
                className="py-1.5 px-2 bg-blue-50/70 hover:bg-blue-100/70 text-[#2b66f6] rounded border border-blue-200/60 text-[11px] font-medium transition-colors"
                title="以 AI 算法开发者身份登录"
              >
                开发者高同学
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('provider_a')}
                className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded border border-slate-200 text-[11px] font-medium transition-colors"
                title="以 4卡4090 散户矿主身份登录"
              >
                散户合作者A
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('provider_b')}
                className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded border border-slate-200 text-[11px] font-medium transition-colors"
                title="以 A100 IDC 极客身份登录"
              >
                极客B (A100)
              </button>
            </div>
          </div>

        </div>

        {/* Footer info on right side */}
        <div className="text-center text-[11px] text-slate-400 pt-6">
          © 2026 uFreeGPU. 工业级去中心化异构算力调度系统
        </div>
      </div>

    </div>
  );
};
