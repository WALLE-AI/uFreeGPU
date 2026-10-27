import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import {
  Activity, ArrowDownLeft, ArrowRight, ArrowUpRight, Bell, CalendarDays, Check,
  CheckCircle2, ChevronDown, ChevronRight, CircleHelp, Clock3,
  Coins, Cpu, Download, Filter, HardDrive, LayoutDashboard,
  Menu, Network, Plus, Search, Server, Settings2, ShieldCheck, SlidersHorizontal,
  TrendingUp, Wallet, Wifi, X, Zap,
} from 'lucide-react';
import NodeObservability from './NodeObservability';

type View = 'overview' | 'resources' | 'monitor' | 'orders' | 'earnings' | 'settings';
type Status = 'running' | 'idle' | 'offline' | 'review';
type Resource = {
  id: string; name: string; model: string; cards: number; memory: number;
  location: string; kind: '个人设备' | '机构机房'; status: Status;
  usage: number; temperature: number; price: number; uptime: string;
};
type Order = { id: string; resource: string; customer: string; duration: string; amount: number; status: '运行中' | '已完成' | '待结算'; time: string };

const seedResources: Resource[] = [
  { id: 'GPU-0829', name: '上海创作者工作站', model: 'RTX 4090', cards: 4, memory: 24, location: '上海 · 浦东', kind: '个人设备', status: 'running', usage: 78, temperature: 62, price: 2.10, uptime: '32 天' },
  { id: 'GPU-1024', name: '北京 A100 训练集群', model: 'A100 80GB', cards: 8, memory: 80, location: '北京 · 海淀', kind: '机构机房', status: 'running', usage: 92, temperature: 55, price: 8.50, uptime: '118 天' },
  { id: 'GPU-0411', name: '广州实验室闲置池', model: 'RTX 3090', cards: 4, memory: 24, location: '广州 · 天河', kind: '机构机房', status: 'idle', usage: 0, temperature: 38, price: 1.20, uptime: '18 天' },
  { id: 'GPU-0205', name: '武汉双卡工作站', model: 'RTX 4080', cards: 2, memory: 16, location: '武汉 · 洪山', kind: '个人设备', status: 'offline', usage: 0, temperature: 0, price: 1.50, uptime: '29 天' },
  { id: 'GPU-0901', name: '杭州 H100 算力池', model: 'H100 80GB', cards: 8, memory: 80, location: '杭州 · 滨江', kind: '机构机房', status: 'running', usage: 84, temperature: 59, price: 13.80, uptime: '67 天' },
];
const seedOrders: Order[] = [
  { id: 'ORD-20261027-0821', resource: '上海创作者工作站', customer: '星河智能科技', duration: '12 小时 36 分', amount: 105.84, status: '运行中', time: '今天 08:21' },
  { id: 'ORD-20261027-0736', resource: '北京 A100 训练集群', customer: '深蓝模型实验室', duration: '18 小时 12 分', amount: 1237.60, status: '运行中', time: '今天 07:36' },
  { id: 'ORD-20261026-1934', resource: '杭州 H100 算力池', customer: '云图数据', duration: '8 小时', amount: 883.20, status: '待结算', time: '昨天 19:34' },
  { id: 'ORD-20261026-1108', resource: '广州实验室闲置池', customer: '个人开发者 · 李', duration: '6 小时', amount: 28.80, status: '已完成', time: '昨天 11:08' },
];
const trend = [42, 50, 47, 61, 56, 67, 59, 76, 71, 82, 69, 86, 77, 94];
const statusText: Record<Status, string> = { running: '运行中', idle: '待租赁', offline: '已离线', review: '审核中' };
const nav: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: '工作台', icon: LayoutDashboard },
  { id: 'resources', label: '资源管理', icon: Server },
  { id: 'monitor', label: '节点监控', icon: Activity },
  { id: 'orders', label: '租赁订单', icon: CalendarDays },
  { id: 'earnings', label: '收益结算', icon: Wallet },
  { id: 'settings', label: '供给设置', icon: Settings2 },
];
const currency = (n: number) => `¥${n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function loadResources(): Resource[] {
  try {
    const saved = localStorage.getItem('ufreegpu-admin-resources');
    return saved ? JSON.parse(saved) as Resource[] : seedResources;
  } catch { return seedResources; }
}

function loadSettings() {
  const defaults = { autoAccept: true, temperature: 82, maintenance: false, email: true };
  try {
    const saved = localStorage.getItem('ufreegpu-admin-settings');
    return saved ? { ...defaults, ...JSON.parse(saved) } as typeof defaults : defaults;
  } catch { return defaults; }
}

function Button({ children, onClick, variant = 'primary', icon: Icon, type = 'button', disabled = false, title }: {
  children: ReactNode; onClick?: () => void; variant?: 'primary' | 'outline' | 'ghost'; icon?: typeof Plus;
  type?: 'button' | 'submit'; disabled?: boolean; title?: string;
}) {
  return <button type={type} onClick={onClick} disabled={disabled} title={title} className={`btn btn-${variant}`}>
    {Icon && <Icon size={16} strokeWidth={2} />}{children}
  </button>;
}

function Badge({ status }: { status: Status | Order['status'] }) {
  const tone = status === 'running' || status === '运行中' ? 'green' : status === 'idle' || status === '待结算' ? 'blue' : status === 'offline' ? 'gray' : status === 'review' ? 'amber' : 'gray';
  return <span className={`badge badge-${tone}`}><span className="badge-dot" />{status in statusText ? statusText[status as Status] : status}</span>;
}

function Modal({ title, subtitle, onClose, children }: { title: string; subtitle?: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-head"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div><button className="icon-button" onClick={onClose} aria-label="关闭"><X size={19} /></button></div>
      {children}
    </div>
  </div>;
}

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return <label className="field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>;
}

function App() {
  const [view, setView] = useState<View>('overview');
  const [resources, setResources] = useState<Resource[]>(loadResources);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | Status>('all');
  const [orderFilter, setOrderFilter] = useState<'全部' | Order['status']>('全部');
  const [modal, setModal] = useState<'add' | 'withdraw' | 'price' | null>(null);
  const [selected, setSelected] = useState<Resource | null>(null);
  const [monitorNodeId, setMonitorNodeId] = useState(seedResources[0].id);
  const [toast, setToast] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [withdrawn, setWithdrawn] = useState(0);
  const [settings, setSettings] = useState(loadSettings);
  const [period, setPeriod] = useState<7 | 14>(14);
  const [newResource, setNewResource] = useState({ name: '', model: 'RTX 4090', cards: '1', location: '', kind: '个人设备' as Resource['kind'], price: '2.10' });
  const [newPrice, setNewPrice] = useState('');

  useEffect(() => { localStorage.setItem('ufreegpu-admin-resources', JSON.stringify(resources)); }, [resources]);
  useEffect(() => { if (!toast) return; const t = window.setTimeout(() => setToast(''), 3500); return () => clearTimeout(t); }, [toast]);
  const filtered = useMemo(() => resources.filter(r => (filter === 'all' || r.status === filter) && `${r.name} ${r.model} ${r.id} ${r.location}`.toLowerCase().includes(query.toLowerCase())), [resources, filter, query]);
  const onlineCards = resources.filter(r => r.status === 'running' || r.status === 'idle').reduce((sum, r) => sum + r.cards, 0);
  const activeCards = resources.filter(r => r.status === 'running').reduce((sum, r) => sum + r.cards, 0);
  const utilization = onlineCards ? Math.round(activeCards / onlineCards * 100) : 0;
  const availableBalance = 12840.50 - withdrawn;
  const activeOrders = seedOrders.filter(o => o.status === '运行中').length;
  const visibleTrend = trend.slice(-period);

  function navigate(next: View) { setView(next); setMobileOpen(false); setQuery(''); setFilter('all'); }
  function inspectResource(resource: Resource) { setMonitorNodeId(resource.id); navigate('monitor'); }
  function addResource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const count = Number(newResource.cards);
    const price = Number(newResource.price);
    if (!newResource.name.trim() || !newResource.location.trim() || count < 1 || price <= 0) return;
    setResources(prev => [{ id: `GPU-${String(Date.now()).slice(-6)}`, name: newResource.name.trim(), model: newResource.model, cards: count, memory: newResource.model.includes('80GB') ? 80 : newResource.model.includes('4080') ? 16 : 24, location: newResource.location.trim(), kind: newResource.kind, status: 'review', usage: 0, temperature: 0, price, uptime: '0 天' }, ...prev]);
    setModal(null); setNewResource({ name: '', model: 'RTX 4090', cards: '1', location: '', kind: '个人设备', price: '2.10' });
    navigate('resources'); setToast('资源已提交，审核通过后可上架租赁');
  }
  function toggleResource(resource: Resource) {
    if (resource.status === 'review') { setToast('资源审核通过后才能操作'); return; }
    if (resource.status === 'running') { setToast('资源有运行中的任务，请等待订单结束后下架'); return; }
    setResources(prev => prev.map(r => r.id === resource.id ? { ...r, status: r.status === 'offline' ? 'idle' : 'offline' } : r));
    setToast(resource.status === 'offline' ? '资源已重新上架' : '资源已下架');
  }
  function savePrice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const price = Number(newPrice);
    if (!selected || price <= 0) return;
    setResources(prev => prev.map(r => r.id === selected.id ? { ...r, price } : r));
    setModal(null); setSelected(null); setToast('资源价格已更新');
  }
  function withdraw(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setWithdrawn(prev => prev + availableBalance); setModal(null);
    setToast(`提现申请已提交，金额 ${currency(availableBalance)}`);
  }

  const resourceTable = (limit?: number) => <div className="table-scroll"><table className="data-table"><thead><tr><th>资源 / 设备</th><th>状态</th><th>GPU 使用率</th><th>温度</th><th>单价</th><th>操作</th></tr></thead><tbody>
    {filtered.slice(0, limit).map(r => <tr key={r.id}>
      <td><div className="resource-cell"><span className="gpu-icon"><Cpu size={19} /></span><div><strong>{r.name}</strong><small>{r.model} · {r.cards} 卡 · {r.location}</small></div></div></td>
      <td><Badge status={r.status} /></td>
      <td><div className="usage-cell"><div className="mini-track"><span style={{ width: `${r.usage}%` }} /></div><span>{r.usage}%</span></div></td>
      <td><span className={r.temperature > 75 ? 'warm' : ''}>{r.temperature ? `${r.temperature}°C` : '—'}</span></td>
      <td><strong className="price">{currency(r.price)}</strong><small className="per-hour">/ 卡 / 时</small></td>
      <td><div className="row-actions"><button title="查看节点监控" aria-label={`查看${r.name}监控`} onClick={() => inspectResource(r)}><Activity size={16} /></button><button title="调整价格" aria-label={`调整${r.name}价格`} onClick={() => { setSelected(r); setNewPrice(String(r.price)); setModal('price'); }}><Settings2 size={16} /></button><button title={r.status === 'offline' ? '上架资源' : '下架资源'} aria-label={`${r.status === 'offline' ? '上架' : '下架'}${r.name}`} onClick={() => toggleResource(r)}><ArrowUpRight size={16} className={r.status === 'offline' ? 'rotate-180' : ''} /></button></div></td>
    </tr>)}
    {filtered.length === 0 && <tr><td colSpan={6} className="empty">没有符合条件的资源</td></tr>}
  </tbody></table></div>;

  return <div className="app-shell">
    {mobileOpen && <button className="mobile-scrim" onClick={() => setMobileOpen(false)} aria-label="关闭导航" />}
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="brand"><span className="brand-mark"><Network size={20} strokeWidth={2.4} /></span><div><strong>uFreeGPU</strong><small>PROVIDER CONSOLE</small></div></div>
      <div className="workspace-switch"><span className="workspace-avatar">U</span><span><strong>优算科技工作空间</strong><small>已认证机构供给方</small></span><ChevronDown size={15} /></div>
      <div className="sidebar-label">工作空间</div>
      <nav className="side-nav" aria-label="主导航">{nav.map(item => { const Icon = item.icon; return <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => navigate(item.id)}><Icon size={18} /><span>{item.label}</span>{item.id === 'orders' && <em>{activeOrders}</em>}</button>; })}</nav>
      <div className="sidebar-bottom"><div className="sidebar-help"><span className="help-icon"><CircleHelp size={18} /></span><strong>需要接入帮助？</strong><p>查看接入文档或联系供给方支持。</p><button onClick={() => { setModal('add'); setMobileOpen(false); }}>查看接入流程 <ArrowRight size={14} /></button></div><div className="sidebar-foot"><ShieldCheck size={15} /> 安全可信的算力供给网络</div></div>
    </aside>

    <div className="main-column">
      <header className="topbar"><div className="topbar-left"><button className="icon-button mobile-menu" aria-label="打开导航" onClick={() => setMobileOpen(true)}><Menu size={21} /></button><span className="breadcrumb">供给方控制台 <ChevronRight size={15} /> <strong>{nav.find(n => n.id === view)?.label}</strong></span></div><div className="topbar-right"><span className="system-status"><span /> 系统运行正常</span><span className="top-divider" /><div className="notification-wrap"><button className="icon-button notification-button" title="通知" aria-label="查看通知" onClick={() => setNotificationsOpen(!notificationsOpen)}><Bell size={19} /><i /></button>{notificationsOpen && <div className="notification-pop"><strong>通知中心</strong><p><span className="notification-dot" />GPU-0411 目前空闲，可接受新订单</p><p><span className="notification-dot green" />昨日收益已完成结算</p><button onClick={() => setNotificationsOpen(false)}>知道了</button></div>}</div><span className="top-divider" /><span className="user-avatar">高</span><span className="user-name">高同学</span><ChevronDown size={15} className="user-chevron" /></div></header>

      <main className="content">
        {view === 'monitor' && <NodeObservability nodes={resources} initialNodeId={monitorNodeId} onBack={() => navigate('resources')} onNotify={setToast} />}
        {view === 'overview' && <>
          <div className="page-heading"><div><div className="eyebrow">PROVIDER OVERVIEW <span>·</span> 2026.10.27</div><h1>工作台</h1><p>早上好，高同学。这里是您的 GPU 资源与收益概况。</p></div><Button icon={Plus} onClick={() => setModal('add')}>接入 GPU 资源</Button></div>
          <section className="stats-grid" aria-label="供给概况">
            <div className="stat"><div className="stat-top"><span>累计收益</span><span className="stat-icon teal"><Wallet size={18} /></span></div><div className="stat-value">¥ 48,629<span>.80</span></div><div className="stat-foot"><span className="positive"><TrendingUp size={13} /> 12.8%</span> 较上月同期</div></div>
            <div className="stat"><div className="stat-top"><span>本月预计收益</span><span className="stat-icon blue"><Coins size={18} /></span></div><div className="stat-value">¥ 16,842<span>.50</span></div><div className="stat-foot">按当前资源出租率预测</div></div>
            <div className="stat"><div className="stat-top"><span>在线 GPU</span><span className="stat-icon violet"><Cpu size={18} /></span></div><div className="stat-value">{onlineCards}<span className="stat-unit"> / {resources.reduce((n, r) => n + r.cards, 0)} 卡</span></div><div className="stat-foot"><span className="status-dot" /> {resources.filter(r => r.status === 'running' || r.status === 'idle').length} 个节点在线</div></div>
            <div className="stat"><div className="stat-top"><span>资源出租率</span><span className="stat-icon orange"><Activity size={18} /></span></div><div className="stat-value">{utilization}<span className="stat-unit">%</span></div><div className="stat-foot">当前 {activeCards} 卡正在承载任务</div></div>
          </section>
          <div className="overview-grid"><section className="panel income-panel"><div className="panel-heading"><div><h2>收益趋势</h2><p>近 {period} 天资源出租收益</p></div><select className="period-button" aria-label="收益趋势时间范围" value={period} onChange={e => setPeriod(Number(e.target.value) as 7 | 14)}><option value={14}>近 14 天</option><option value={7}>近 7 天</option></select></div><div className="chart-summary"><strong>{period === 14 ? '¥ 7,382.40' : '¥ 4,162.80'}</strong><span className="positive"><TrendingUp size={14} /> {period === 14 ? '18.6%' : '9.4%'}</span></div><div className="chart"><div className="chart-lines"><span>¥800</span><span>¥600</span><span>¥400</span><span>¥200</span><span>¥0</span></div><div className="chart-bars">{visibleTrend.map((v, i) => <div className="chart-column" key={i}><span style={{ height: `${v}%` }} title={`10月${28 - period + i}日 · ¥${Math.round(v * 8.4)}`} /></div>)}</div></div><div className="chart-labels">{(period === 14 ? ['10/14','10/17','10/20','10/23','10/27'] : ['10/21','10/23','10/25','10/27']).map(label => <span key={label}>{label}</span>)}</div></section>
            <section className="panel activity-panel"><div className="panel-heading"><div><h2>待办与动态</h2><p>需要关注的资源状态</p></div><span className="activity-count">3 项</span></div><div className="activity-list"><div className="activity-item"><span className="activity-icon amber"><HardDrive size={17} /></span><div><strong>1 台设备已离线</strong><p>武汉双卡工作站 · 连接中断</p><small>今天 09:24</small></div><button title="查看资源" onClick={() => navigate('resources')}><ChevronRight size={18} /></button></div><div className="activity-item"><span className="activity-icon blue"><Clock3 size={17} /></span><div><strong>待结算订单</strong><p>杭州 H100 算力池 · ¥883.20</p><small>昨天 19:34</small></div><button title="查看订单" onClick={() => navigate('orders')}><ChevronRight size={18} /></button></div><div className="activity-item"><span className="activity-icon green"><CheckCircle2 size={17} /></span><div><strong>昨日收益已结算</strong><p>到账金额 ¥2,186.50</p><small>今天 00:08</small></div><button title="查看收益" onClick={() => navigate('earnings')}><ChevronRight size={18} /></button></div></div></section></div>
          <section className="panel resource-panel"><div className="panel-heading"><div><h2>资源运行概览</h2><p>实时掌握所有接入节点的运行状态</p></div><button className="text-link" onClick={() => navigate('resources')}>查看全部资源 <ArrowRight size={15} /></button></div>{resourceTable(4)}</section>
        </>}

        {view === 'resources' && <><div className="page-heading"><div><div className="eyebrow">RESOURCE MANAGEMENT</div><h1>资源管理</h1><p>管理设备、调整定价并监控 GPU 运行状态。</p></div><Button icon={Plus} onClick={() => setModal('add')}>接入 GPU 资源</Button></div><div className="resource-summary"><div><span className="summary-icon blue"><Server size={18} /></span><span>资源总数</span><strong>{resources.length}</strong></div><div><span className="summary-icon green"><Wifi size={18} /></span><span>在线节点</span><strong>{resources.filter(r => r.status === 'running' || r.status === 'idle').length}</strong></div><div><span className="summary-icon orange"><Zap size={18} /></span><span>运行任务</span><strong>{activeOrders}</strong></div><div><span className="summary-icon violet"><Cpu size={18} /></span><span>GPU 总量</span><strong>{resources.reduce((n, r) => n + r.cards, 0)} 卡</strong></div></div><section className="panel full-panel"><div className="panel-heading"><div><h2>全部资源</h2><p>共 {filtered.length} 条资源</p></div><div className="table-tools"><label className="search-box"><Search size={16} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索设备名称 / 型号" aria-label="搜索资源" /></label><span className="select-wrap"><Filter size={15} /><select aria-label="筛选资源状态" value={filter} onChange={e => setFilter(e.target.value as typeof filter)}><option value="all">全部状态</option><option value="running">运行中</option><option value="idle">待租赁</option><option value="offline">已离线</option><option value="review">审核中</option></select><ChevronDown size={14} /></span></div></div>{resourceTable()}<div className="table-footer">显示 {filtered.length} 条资源 <span>共 {resources.length} 条</span></div></section></>}

        {view === 'orders' && <><div className="page-heading"><div><div className="eyebrow">RENTAL ORDERS</div><h1>租赁订单</h1><p>查看资源出租记录、任务状态与订单收入。</p></div><Button variant="outline" icon={Download} onClick={() => { const rows = [['订单编号','资源','租户','时长','金额','状态','时间'], ...seedOrders.map(o => [o.id,o.resource,o.customer,o.duration,String(o.amount),o.status,o.time])]; const blob = new Blob(['\uFEFF' + rows.map(row => row.join(',')).join('\n')], { type: 'text/csv;charset=utf-8' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'ufreegpu-orders.csv'; a.click(); URL.revokeObjectURL(a.href); setToast('订单报表已导出'); }}>导出报表</Button></div><div className="tabs">{(['全部', '运行中', '待结算', '已完成'] as const).map(tab => <button key={tab} className={orderFilter === tab ? 'selected' : ''} onClick={() => setOrderFilter(tab)}>{tab}{tab === '运行中' && <span>{activeOrders}</span>}</button>)}</div><section className="panel full-panel"><div className="panel-heading"><div><h2>订单列表</h2><p>按创建时间排序</p></div><span className="muted-count">{seedOrders.filter(o => orderFilter === '全部' || o.status === orderFilter).length} 笔订单</span></div><div className="table-scroll"><table className="data-table order-table"><thead><tr><th>订单编号</th><th>资源 / 租户</th><th>使用时长</th><th>订单金额</th><th>状态</th><th>创建时间</th></tr></thead><tbody>{seedOrders.filter(o => orderFilter === '全部' || o.status === orderFilter).map(o => <tr key={o.id}><td className="mono">{o.id}</td><td><strong>{o.resource}</strong><small className="block-small">{o.customer}</small></td><td>{o.duration}</td><td><strong>{currency(o.amount)}</strong></td><td><Badge status={o.status} /></td><td>{o.time}</td></tr>)}</tbody></table></div></section></>}

        {view === 'earnings' && <><div className="page-heading"><div><div className="eyebrow">EARNINGS & PAYOUTS</div><h1>收益结算</h1><p>查看出租收益与结算记录，管理可提现余额。</p></div><Button icon={ArrowUpRight} onClick={() => setModal('withdraw')} disabled={availableBalance <= 0}>申请提现</Button></div><div className="earnings-hero"><div><span>可提现余额</span><strong>{currency(availableBalance)}</strong><p>结算至已绑定的对公账户 · 预计 T+1 到账</p></div><span className="earnings-symbol"><Wallet size={34} /></span></div><div className="earning-stats"><div><span>本月已结算</span><strong>¥16,842.50</strong><small><ArrowUpRight size={13} /> 较上月 +12.8%</small></div><div><span>待结算收益</span><strong>¥2,384.20</strong><small>任务结束后进入结算</small></div><div><span>累计提现</span><strong>{currency(35789.30 + withdrawn)}</strong><small>历史到账金额</small></div></div><section className="panel full-panel"><div className="panel-heading"><div><h2>近期资金明细</h2><p>收益和提现记录</p></div></div><div className="transaction"><span className="trans-icon income"><ArrowDownLeft size={18} /></span><div><strong>资源出租收益</strong><small>上海创作者工作站 · 订单结算</small></div><span className="trans-time">10月27日 00:08</span><strong className="trans-amount">+¥286.50</strong></div><div className="transaction"><span className="trans-icon income"><ArrowDownLeft size={18} /></span><div><strong>资源出租收益</strong><small>北京 A100 训练集群 · 订单结算</small></div><span className="trans-time">10月26日 00:12</span><strong className="trans-amount">+¥1,900.00</strong></div><div className="transaction"><span className="trans-icon expense"><ArrowUpRight size={18} /></span><div><strong>账户提现</strong><small>对公账户 · 尾号 6628</small></div><span className="trans-time">10月23日 14:20</span><strong>-¥8,000.00</strong></div>{withdrawn > 0 && <div className="transaction"><span className="trans-icon expense"><ArrowUpRight size={18} /></span><div><strong>提现申请处理中</strong><small>对公账户 · 尾号 6628</small></div><span className="trans-time">刚刚</span><strong>-{currency(withdrawn)}</strong></div>}</section></>}

        {view === 'settings' && <><div className="page-heading"><div><div className="eyebrow">SUPPLY SETTINGS</div><h1>供给设置</h1><p>配置资源调度、设备保护和通知偏好。</p></div></div><div className="settings-layout"><section className="panel settings-panel"><div className="panel-heading"><div><h2>调度与安全</h2><p>适用于当前工作空间下的资源</p></div><SlidersHorizontal size={19} /></div><div className="setting-row"><div><strong>自动接单</strong><p>空闲资源自动接受符合配置的租赁请求</p></div><button className={`switch ${settings.autoAccept ? 'on' : ''}`} role="switch" aria-checked={settings.autoAccept} aria-label="自动接单" onClick={() => setSettings(s => ({ ...s, autoAccept: !s.autoAccept }))}><span /></button></div><div className="setting-row"><div><strong>温度保护阈值</strong><p>达到阈值时暂停接单，保护设备硬件</p></div><div className="number-control"><input type="number" min="60" max="95" value={settings.temperature} aria-label="温度保护阈值" onChange={e => setSettings(s => ({ ...s, temperature: Math.min(95, Math.max(60, Number(e.target.value) || 60)) }))} /><span>°C</span></div></div><div className="setting-row"><div><strong>维护模式</strong><p>暂停接收新订单，现有任务不受影响</p></div><button className={`switch ${settings.maintenance ? 'on' : ''}`} role="switch" aria-checked={settings.maintenance} aria-label="维护模式" onClick={() => setSettings(s => ({ ...s, maintenance: !s.maintenance }))}><span /></button></div><div className="setting-row"><div><strong>邮件通知</strong><p>接收资源异常、订单与结算提醒</p></div><button className={`switch ${settings.email ? 'on' : ''}`} role="switch" aria-checked={settings.email} aria-label="邮件通知" onClick={() => setSettings(s => ({ ...s, email: !s.email }))}><span /></button></div><div className="settings-actions"><Button onClick={() => { localStorage.setItem('ufreegpu-admin-settings', JSON.stringify(settings)); setToast('供给设置已保存'); }}>保存设置</Button></div></section><section className="panel account-panel"><div className="panel-heading"><div><h2>供给方资料</h2><p>已完成平台认证</p></div><ShieldCheck size={19} color="#15876e" /></div><dl><div><dt>主体名称</dt><dd>优算科技（上海）有限公司</dd></div><div><dt>供给方类型</dt><dd>机构 / 个人混合供给</dd></div><div><dt>结算账户</dt><dd>招商银行 · 尾号 6628</dd></div><div><dt>认证状态</dt><dd><span className="verified"><Check size={13} /> 已认证</span></dd></div></dl></section></div></>}
      </main>
    </div>

    {toast && <div className="toast" role="status"><CheckCircle2 size={18} />{toast}<button onClick={() => setToast('')} aria-label="关闭提示"><X size={15} /></button></div>}
    {modal === 'add' && <Modal title="接入 GPU 资源" subtitle="填写设备信息，提交后进入平台审核流程。" onClose={() => setModal(null)}><div className="steps"><span className="current">1 <b>填写信息</b></span><i /><span>2 <b>安装节点</b></span><i /><span>3 <b>平台审核</b></span></div><form onSubmit={addResource} className="modal-form"><div className="form-grid"><Field label="资源名称"><input required placeholder="例如：上海 4090 工作站" value={newResource.name} onChange={e => setNewResource({ ...newResource, name: e.target.value })} /></Field><Field label="供给类型"><select value={newResource.kind} onChange={e => setNewResource({ ...newResource, kind: e.target.value as Resource['kind'] })}><option>个人设备</option><option>机构机房</option></select></Field><Field label="GPU 型号"><select value={newResource.model} onChange={e => setNewResource({ ...newResource, model: e.target.value })}><option>RTX 4090</option><option>RTX 3090</option><option>RTX 4080</option><option>A100 80GB</option><option>H100 80GB</option></select></Field><Field label="GPU 数量"><input type="number" min="1" max="128" required value={newResource.cards} onChange={e => setNewResource({ ...newResource, cards: e.target.value })} /></Field><Field label="设备所在地区"><input required placeholder="例如：上海 · 浦东" value={newResource.location} onChange={e => setNewResource({ ...newResource, location: e.target.value })} /></Field><Field label="每卡每小时价格"><div className="input-prefix"><span>¥</span><input type="number" min="0.01" step="0.01" required value={newResource.price} onChange={e => setNewResource({ ...newResource, price: e.target.value })} /></div></Field></div><div className="form-note"><ShieldCheck size={17} /> 提交后将生成接入指引，节点完成连通性验证后上架。</div><div className="modal-actions"><Button variant="outline" onClick={() => setModal(null)}>取消</Button><Button type="submit" icon={ArrowRight}>提交资源</Button></div></form></Modal>}
    {modal === 'price' && selected && <Modal title="调整资源价格" subtitle={`${selected.name} · ${selected.model}`} onClose={() => setModal(null)}><form className="modal-form" onSubmit={savePrice}><Field label="每卡每小时价格" hint={`当前价格 ${currency(selected.price)} / 卡 / 时`}><div className="input-prefix"><span>¥</span><input autoFocus type="number" min="0.01" step="0.01" required value={newPrice} onChange={e => setNewPrice(e.target.value)} /></div></Field><div className="form-note"><CircleHelp size={17} /> 新价格仅对后续创建的订单生效。</div><div className="modal-actions"><Button variant="outline" onClick={() => setModal(null)}>取消</Button><Button type="submit">保存价格</Button></div></form></Modal>}
    {modal === 'withdraw' && <Modal title="申请提现" subtitle="请确认本次提现金额与到账账户。" onClose={() => setModal(null)}><form className="modal-form" onSubmit={withdraw}><div className="withdraw-amount"><span>提现金额</span><strong>{currency(availableBalance)}</strong></div><div className="withdraw-account"><span>到账账户</span><strong>招商银行 · 对公账户 · 尾号 6628</strong></div><div className="form-note"><Clock3 size={17} /> 预计 1 个工作日内到账，实际时间以银行处理为准。</div><div className="modal-actions"><Button variant="outline" onClick={() => setModal(null)}>取消</Button><Button type="submit">确认提现</Button></div></form></Modal>}
  </div>;
}

export default App;
