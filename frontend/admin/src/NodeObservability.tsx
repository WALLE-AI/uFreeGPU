import { useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowLeft, Check, CheckCircle2, ChevronDown,
  Clock3, Copy, Cpu, Fan, Gauge, HardDrive, Info, Network, RefreshCw,
  Search, Server, Thermometer, Wifi, Zap,
} from 'lucide-react';

export type MonitorNode = {
  id: string;
  name: string;
  model: string;
  cards: number;
  memory: number;
  location: string;
  kind: '个人设备' | '机构机房';
  status: 'running' | 'idle' | 'offline' | 'review';
  usage: number;
  temperature: number;
  uptime: string;
};

type Metric = 'gpu' | 'memory' | 'temperature' | 'power';
type Range = '1h' | '24h' | '7d';
type DetailTab = 'events' | 'logs';

const metrics: { id: Metric; label: string; unit: string; icon: typeof Cpu }[] = [
  { id: 'gpu', label: 'GPU 利用率', unit: '%', icon: Activity },
  { id: 'memory', label: '显存占用', unit: '%', icon: HardDrive },
  { id: 'temperature', label: '核心温度', unit: '°C', icon: Thermometer },
  { id: 'power', label: '整卡功耗', unit: 'W', icon: Zap },
];

const formatTime = () => new Date().toLocaleTimeString('zh-CN', { hour12: false });

function makeSeries(node: MonitorNode, metric: Metric, range: Range, tick: number) {
  const count = range === '1h' ? 20 : range === '24h' ? 24 : 14;
  const base = metric === 'gpu' ? node.usage : metric === 'memory' ? node.usage * .74 : metric === 'temperature' ? node.temperature : node.usage * 4.1;
  const spread = metric === 'power' ? 44 : metric === 'temperature' ? 5 : 13;
  return Array.from({ length: count }, (_, i) => {
    if (node.status === 'offline' || node.status === 'review') return 0;
    const variation = Math.sin((i + node.cards + tick * .7) * 1.7) * spread * .55 + Math.cos(i * .64 + node.id.length) * spread * .45;
    return Math.max(0, Math.round(metric === 'temperature' ? Math.min(95, base + variation) : metric === 'power' ? Math.min(700, base + variation) : Math.min(100, base + variation)));
  });
}

function LineChart({ values, metric, range }: { values: number[]; metric: Metric; range: Range }) {
  const max = metric === 'power' ? 500 : metric === 'temperature' ? 100 : 100;
  const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${100 - Math.min(value / max, 1) * 100}`).join(' ');
  const area = `0,100 ${points} 100,100`;
  const unit = metrics.find(item => item.id === metric)?.unit;
  const labels = range === '1h' ? ['60 分前', '45 分前', '30 分前', '15 分前', '现在'] : range === '24h' ? ['00:00', '06:00', '12:00', '18:00', '现在'] : ['7 天前', '5 天前', '3 天前', '1 天前', '现在'];
  return <div className="monitor-chart" role="img" aria-label={`${metrics.find(item => item.id === metric)?.label}趋势，最新值 ${values.at(-1)}${unit}`}>
    <div className="monitor-axis">{[max, max * .75, max * .5, max * .25, 0].map(value => <span key={value}>{Math.round(value)}{unit}</span>)}</div>
    <div className="monitor-plot"><div className="monitor-grid" /><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polygon points={area} fill="url(#monitor-fill)" /><polyline points={points} fill="none" stroke="#2563eb" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" /><defs><linearGradient id="monitor-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#60a5fa" stopOpacity=".25" /><stop offset="100%" stopColor="#60a5fa" stopOpacity=".02" /></linearGradient></defs></svg></div>
    <div className="monitor-chart-labels">{labels.map(label => <span key={label}>{label}</span>)}</div>
  </div>;
}

export default function NodeObservability({ nodes, initialNodeId, onBack, onNotify }: {
  nodes: MonitorNode[];
  initialNodeId: string;
  onBack: () => void;
  onNotify: (message: string) => void;
}) {
  const [nodeId, setNodeId] = useState(initialNodeId);
  const [metric, setMetric] = useState<Metric>('gpu');
  const [range, setRange] = useState<Range>('24h');
  const [tab, setTab] = useState<DetailTab>('events');
  const [eventFilter, setEventFilter] = useState<'all' | 'warning' | 'info'>('all');
  const [logQuery, setLogQuery] = useState('');
  const [acknowledged, setAcknowledged] = useState<string[]>([]);
  const [tick, setTick] = useState(0);
  const [updatedAt, setUpdatedAt] = useState(formatTime);
  const node = nodes.find(item => item.id === nodeId) ?? nodes[0];
  const unavailable = !node || node.status === 'offline' || node.status === 'review';
  const values = useMemo(() => node ? makeSeries(node, metric, range, tick) : [], [node, metric, range, tick]);
  if (!node) return <div className="monitor-empty">暂无可监控节点。<button onClick={onBack}>返回资源管理</button></div>;

  const memoryUsed = Math.round(node.memory * (node.usage / 100) * 10) / 10;
  const alerts = [
    ...(node.status === 'offline' ? [{ id: `${node.id}-disconnect`, level: 'warning' as const, title: '节点连接中断', detail: 'Daemon 心跳超时，节点已停止接收新任务。', time: '09:24' }] : []),
    ...(node.status === 'running' && node.usage >= 80 ? [{ id: `${node.id}-load`, level: 'warning' as const, title: 'GPU 持续高负载', detail: '利用率超过 80%，请关注温度与散热状态。', time: '08:42' }] : []),
    { id: `${node.id}-heartbeat`, level: 'info' as const, title: node.status === 'review' ? '等待节点审核' : '节点状态检查', detail: node.status === 'review' ? '提交成功，等待平台完成连通性验证。' : '最近一次采集和节点状态已同步。', time: '08:30' },
  ];
  const events = alerts.filter(item => eventFilter === 'all' || item.level === eventFilter);
  const logEntries = node.status === 'review'
    ? [{ time: '09:24:18', level: 'INFO', text: 'resource submitted; awaiting connectivity verification' }, { time: '09:23:58', level: 'INFO', text: `gpu inventory declared: ${node.cards} device(s)` }]
    : [
      { time: '09:24:18', level: node.status === 'offline' ? 'ERROR' : 'INFO', text: node.status === 'offline' ? 'heartbeat timeout: connection to scheduler lost' : 'telemetry snapshot received from node agent' },
      { time: '09:23:58', level: 'INFO', text: `gpu inventory synced: ${node.cards} device(s) available` },
      { time: '09:22:16', level: node.usage >= 80 ? 'WARN' : 'INFO', text: node.usage >= 80 ? 'gpu utilization above threshold: 80%' : 'health probe completed successfully' },
      { time: '09:18:03', level: 'INFO', text: 'rental scheduler policy check completed' },
      { time: '09:15:40', level: 'INFO', text: 'node agent connected to control plane' },
    ];
  const logs = logEntries.filter(item => `${item.level} ${item.text} ${item.time}`.toLowerCase().includes(logQuery.toLowerCase()));

  return <div className="monitor-page">
    <div className="monitor-heading"><div><button className="monitor-back" onClick={onBack}><ArrowLeft size={15} /> 返回资源管理</button><div className="eyebrow">NODE OBSERVABILITY</div><h1>节点监控</h1><p>查看租赁节点健康、单卡负载、告警与运行记录。</p></div><div className="monitor-heading-actions"><span className="monitor-demo"><Info size={14} /> 演示数据 · 待接入监控 API</span><button className="btn btn-outline" onClick={() => { setTick(value => value + 1); setUpdatedAt(formatTime()); onNotify('演示快照已刷新'); }}><RefreshCw size={15} /> 刷新快照</button></div></div>

    <section className="monitor-node-bar"><div className="monitor-node-primary"><span className="monitor-node-icon"><Server size={22} /></span><div><label htmlFor="monitor-node-select">当前节点</label><div className="monitor-node-select"><select id="monitor-node-select" value={node.id} onChange={event => { setNodeId(event.target.value); setAcknowledged([]); }}><option value={node.id}>{node.name} · {node.id}</option>{nodes.filter(item => item.id !== node.id).map(item => <option value={item.id} key={item.id}>{item.name} · {item.id}</option>)}</select><ChevronDown size={16} /></div><small>{node.model} · {node.cards} 卡 · {node.location}</small></div></div><div className="monitor-node-meta"><span className={`monitor-state state-${node.status}`}><i />{node.status === 'running' ? '运行中' : node.status === 'idle' ? '待租赁' : node.status === 'offline' ? '已离线' : '审核中'}</span><span><Clock3 size={14} /> 最近采集 {unavailable ? '—' : updatedAt}</span><span><Wifi size={14} /> 在线时长 {node.uptime}</span></div></section>

    <section className="monitor-kpis" aria-label="节点关键指标">
      <div className="monitor-kpi"><span><Activity size={16} /> GPU 利用率</span><strong>{unavailable ? '—' : `${node.usage}%`}</strong><small>{unavailable ? '当前无采集数据' : '节点平均负载'}</small></div>
      <div className="monitor-kpi"><span><HardDrive size={16} /> 显存占用</span><strong>{unavailable ? '—' : `${memoryUsed} GB`}</strong><small>单卡容量 {node.memory} GB</small></div>
      <div className="monitor-kpi"><span><Thermometer size={16} /> 核心温度</span><strong>{unavailable ? '—' : `${node.temperature}°C`}</strong><small>保护阈值 82°C</small></div>
      <div className="monitor-kpi"><span><Network size={16} /> 网络延迟</span><strong>{unavailable ? '—' : `${node.kind === '机构机房' ? 8 : 22} ms`}</strong><small>至平台调度网关</small></div>
    </section>

    <div className="monitor-main-grid"><section className="panel monitor-trend"><div className="panel-heading"><div><h2>性能趋势</h2><p>节点指标的历史变化</p></div><div className="monitor-range" role="group" aria-label="趋势时间范围">{(['1h', '24h', '7d'] as const).map(item => <button key={item} className={range === item ? 'active' : ''} onClick={() => setRange(item)}>{item === '1h' ? '1 小时' : item === '24h' ? '24 小时' : '7 天'}</button>)}</div></div><div className="monitor-metric-tabs" role="tablist" aria-label="监控指标">{metrics.map(item => { const Icon = item.icon; return <button role="tab" aria-selected={metric === item.id} className={metric === item.id ? 'active' : ''} key={item.id} onClick={() => setMetric(item.id)}><Icon size={14} />{item.label}</button>; })}</div>{unavailable ? <div className="monitor-no-data"><Info size={22} /><strong>暂无指标数据</strong><span>{node.status === 'review' ? '节点审核通过并成功接入后显示监控指标。' : '节点离线，恢复连接后可继续采集指标。'}</span></div> : <LineChart values={values} metric={metric} range={range} />}</section>
      <section className="panel monitor-health"><div className="panel-heading"><div><h2>节点健康</h2><p>运行环境与资源占用</p></div><span className={unavailable ? 'health-unavailable' : 'health-good'}>{unavailable ? '待检查' : '状态良好'}</span></div><div className="health-list"><div><span><Cpu size={16} /> CPU 使用率</span><strong>{unavailable ? '—' : `${Math.min(92, Math.round(node.usage * .58 + 12))}%`}</strong><i><b style={{ width: unavailable ? 0 : `${Math.min(92, Math.round(node.usage * .58 + 12))}%` }} /></i></div><div><span><HardDrive size={16} /> 内存使用率</span><strong>{unavailable ? '—' : `${Math.min(88, Math.round(node.usage * .41 + 24))}%`}</strong><i><b style={{ width: unavailable ? 0 : `${Math.min(88, Math.round(node.usage * .41 + 24))}%` }} /></i></div><div><span><Fan size={16} /> 风扇转速</span><strong>{unavailable ? '—' : `${Math.min(88, Math.round(node.temperature * .85))}%`}</strong><i><b style={{ width: unavailable ? 0 : `${Math.min(88, Math.round(node.temperature * .85))}%` }} /></i></div></div><div className="health-foot"><span><CheckCircle2 size={15} /> Daemon {unavailable ? '未连接' : '已连接'}</span><span><Gauge size={15} /> 保护阈值 82°C</span></div></section></div>

    <section className="panel monitor-slots"><div className="panel-heading"><div><h2>GPU 槽位</h2><p>共 {node.cards} 张显卡 · 每卡状态与硬件读数</p></div><span className="muted-count">{unavailable ? 0 : node.status === 'idle' ? 0 : Math.max(1, Math.round(node.cards * node.usage / 100))} 卡承载任务</span></div><div className="table-scroll"><table className="data-table"><thead><tr><th>槽位</th><th>型号 / 显存</th><th>任务状态</th><th>利用率</th><th>温度</th><th>功耗</th></tr></thead><tbody>{Array.from({ length: node.cards }, (_, index) => { const occupied = node.status === 'running' && index < Math.max(1, Math.round(node.cards * node.usage / 100)); const utilization = unavailable ? 0 : occupied ? Math.min(99, node.usage + (index % 3 - 1) * 7) : 0; return <tr key={index}><td className="mono">GPU {String(index).padStart(2, '0')}</td><td><strong>{node.model}</strong><small className="block-small">{node.memory} GB 显存</small></td><td><span className={`badge ${occupied ? 'badge-green' : 'badge-gray'}`}><span className="badge-dot" />{unavailable ? '不可用' : occupied ? '租赁中' : '空闲'}</span></td><td><div className="usage-cell"><div className="mini-track"><span style={{ width: `${utilization}%` }} /></div><span>{unavailable ? '—' : `${utilization}%`}</span></div></td><td>{unavailable ? '—' : `${occupied ? node.temperature + index % 3 - 1 : Math.max(32, node.temperature - 19)}°C`}</td><td>{unavailable ? '—' : `${occupied ? Math.round(node.usage * 3.1 + index * 7) : 42} W`}</td></tr>; })}</tbody></table></div></section>

    <section className="panel monitor-details"><div className="monitor-detail-head"><div><h2>告警与运行记录</h2><p>定位节点异常与调度事件</p></div><div className="monitor-detail-tabs" role="tablist" aria-label="运行记录视图"><button role="tab" aria-selected={tab === 'events'} className={tab === 'events' ? 'active' : ''} onClick={() => setTab('events')}>告警事件 <span>{alerts.filter(item => item.level === 'warning' && !acknowledged.includes(item.id)).length}</span></button><button role="tab" aria-selected={tab === 'logs'} className={tab === 'logs' ? 'active' : ''} onClick={() => setTab('logs')}>节点日志</button></div></div>
      {tab === 'events' ? <><div className="monitor-filter" role="group" aria-label="事件级别筛选">{([['all','全部事件'],['warning','告警'],['info','信息']] as const).map(([value,label]) => <button key={value} className={eventFilter === value ? 'active' : ''} onClick={() => setEventFilter(value)}>{label}</button>)}</div><div className="monitor-event-list">{events.length ? events.map(event => <div className="monitor-event" key={event.id}><span className={`event-icon ${event.level}`}>{event.level === 'warning' ? <AlertTriangle size={16} /> : <Info size={16} />}</span><div><strong>{event.title}</strong><p>{event.detail}</p><small>今天 {event.time} · {node.id}</small></div><div className="event-action">{event.level === 'warning' && <button disabled={acknowledged.includes(event.id)} onClick={() => { setAcknowledged(items => [...items, event.id]); onNotify('告警已确认'); }}>{acknowledged.includes(event.id) ? <><Check size={14} /> 已确认</> : '确认告警'}</button>}</div></div>) : <div className="monitor-list-empty">当前筛选下没有事件</div>}</div></> : <><div className="monitor-log-tools"><label className="search-box"><Search size={15} /><input value={logQuery} onChange={event => setLogQuery(event.target.value)} placeholder="搜索日志内容" aria-label="搜索节点日志" /></label><button className="btn btn-outline" onClick={async () => { try { await navigator.clipboard.writeText(logs.map(item => `[${item.time}] ${item.level} ${item.text}`).join('\n')); onNotify('当前日志已复制'); } catch { onNotify('复制失败，请检查浏览器权限'); } }}><Copy size={15} /> 复制日志</button></div><div className="monitor-log-list">{logs.length ? logs.map((log, index) => <div key={`${log.time}-${index}`}><time>{log.time}</time><span className={`log-${log.level.toLowerCase()}`}>{log.level}</span><code>{log.text}</code></div>) : <div className="monitor-list-empty">没有匹配的日志</div>}</div></>}
    </section>
  </div>;
}
