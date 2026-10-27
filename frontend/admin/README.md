# uFreeGPU 供给方管理端

独立的 React + Tailwind CSS 管理界面，供个人与机构接入和管理 GPU 资源。

```bash
npm install
npm run dev
```

默认开发地址：`http://localhost:3001/`。运行 `npm run build` 可执行 TypeScript 检查并生成生产构建。

当前为前端交互原型。资源和供给设置保存在浏览器 `localStorage`；订单、收益和账户资料为演示数据，实际结算及设备接入需要对接服务端。

节点监控页提供指标趋势、单卡状态、告警和日志的交互演示。监控数据为模拟快照，接入真实遥测 API 后才能用于运行决策。
