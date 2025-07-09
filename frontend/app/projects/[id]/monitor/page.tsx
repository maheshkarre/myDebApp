'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  Activity,
  Cpu,
  Thermometer,
  Zap,
  Camera,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Brain,
  Image as ImageIcon,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface DeviceMetrics {
  timestamp: string;
  temperature: number;
  cpuUsage: number;
  memoryUsage: number;
  fps: number;
  inferences: number;
}

interface InferenceResult {
  id: string;
  timestamp: string;
  image: string;
  predictions: Array<{
    class: string;
    confidence: number;
    bbox?: [number, number, number, number];
  }>;
  processingTime: number;
}

export async function generateStaticParams() {
  return [{ id: '1' }];
}

export default function MonitorPage() {
  const params = useParams();
  const [deviceMetrics, setDeviceMetrics] = useState<DeviceMetrics[]>([]);
  const [recentInferences, setRecentInferences] = useState<InferenceResult[]>([]);
  const [isLive, setIsLive] = useState(true);

  // Mock data generation
  useEffect(() => {
    const generateMockMetrics = () => {
      const now = new Date();
      const newMetric: DeviceMetrics = {
        timestamp: now.toISOString(),
        temperature: 45 + Math.random() * 10,
        cpuUsage: 20 + Math.random() * 30,
        memoryUsage: 40 + Math.random() * 20,
        fps: 24 + Math.random() * 6,
        inferences: Math.floor(Math.random() * 10)
      };

      setDeviceMetrics(prev => {
        const updated = [...prev, newMetric];
        return updated.slice(-50); // Keep last 50 points
      });

      // Occasionally add new inference results
      if (Math.random() < 0.3) {
        const newInference: InferenceResult = {
          id: Date.now().toString(),
          timestamp: now.toISOString(),
          image: 'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1',
          predictions: [
            {
              class: 'TBB',
              confidence: 0.92 + Math.random() * 0.07
            },
            {
              class: 'TBR',
              confidence: 0.85 + Math.random() * 0.10
            }
          ],
          processingTime: 45 + Math.random() * 20
        };

        setRecentInferences(prev => {
          return [newInference, ...prev].slice(0, 10);
        });
      }
    };

    // Initial data
    for (let i = 0; i < 20; i++) {
      setTimeout(() => generateMockMetrics(), i * 100);
    }

    // Live updates
    const interval = setInterval(generateMockMetrics, 2000);
    return () => clearInterval(interval);
  }, []);

  const currentMetrics = deviceMetrics[deviceMetrics.length - 1];
  const avgFPS = deviceMetrics.length > 0 
    ? deviceMetrics.reduce((sum, m) => sum + m.fps, 0) / deviceMetrics.length 
    : 0;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white">Live Monitoring</h1>
            <p className="text-slate-400 mt-2">Real-time device status and inference results</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={`${isLive ? 'bg-green-500/20 text-green-400 border-green-500/20' : 'bg-gray-500/20 text-gray-400 border-gray-500/20'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
              {isLive ? 'Live' : 'Offline'}
            </Badge>
            <Button
              onClick={() => setIsLive(!isLive)}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              {isLive ? 'Pause' : 'Resume'}
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-effect border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Device Status</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">Online</div>
              <p className="text-xs text-slate-400">EdgeBox-RPX3L-01</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Temperature</CardTitle>
              <Thermometer className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {currentMetrics ? Math.round(currentMetrics.temperature) : '45'}°C
              </div>
              <p className="text-xs text-slate-400">Normal range</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Average FPS</CardTitle>
              <Camera className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{Math.round(avgFPS)}</div>
              <p className="text-xs text-slate-400">Inference rate</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Model Version</CardTitle>
              <Brain className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">v2.0</div>
              <p className="text-xs text-slate-400">Active model</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* System Metrics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Charts */}
            <Card className="glass-effect border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  System Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-3">CPU & Memory Usage</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={deviceMetrics}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis 
                          dataKey="timestamp" 
                          stroke="#64748b" 
                          fontSize={12}
                          tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                        />
                        <YAxis 
                          stroke="#64748b" 
                          fontSize={12}
                          domain={[0, 100]}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: '1px solid #475569',
                            borderRadius: '8px'
                          }}
                          labelFormatter={(value) => new Date(value).toLocaleTimeString()}
                          formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="cpuUsage" 
                          stackId="1"
                          stroke="#3b82f6" 
                          fill="rgba(59, 130, 246, 0.2)"
                          name="CPU"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="memoryUsage" 
                          stackId="1"
                          stroke="#10b981" 
                          fill="rgba(16, 185, 129, 0.2)"
                          name="Memory"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-3">Temperature & FPS</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={deviceMetrics}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis 
                          dataKey="timestamp" 
                          stroke="#64748b" 
                          fontSize={12}
                          tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                        />
                        <YAxis 
                          yAxisId="temp"
                          stroke="#f97316" 
                          fontSize={12}
                          domain={[40, 70]}
                        />
                        <YAxis 
                          yAxisId="fps"
                          orientation="right"
                          stroke="#a855f7" 
                          fontSize={12}
                          domain={[20, 35]}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: '1px solid #475569',
                            borderRadius: '8px'
                          }}
                          labelFormatter={(value) => new Date(value).toLocaleTimeString()}
                        />
                        <Line 
                          yAxisId="temp"
                          type="monotone" 
                          dataKey="temperature" 
                          stroke="#f97316" 
                          strokeWidth={2}
                          dot={false}
                          name="Temperature (°C)"
                        />
                        <Line 
                          yAxisId="fps"
                          type="monotone" 
                          dataKey="fps" 
                          stroke="#a855f7" 
                          strokeWidth={2}
                          dot={false}
                          name="FPS"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Inferences */}
          <div className="space-y-6">
            <Card className="glass-effect border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Recent Inferences
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Latest AI model predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentInferences.length > 0 ? (
                  <div className="space-y-4">
                    {recentInferences.slice(0, 5).map((inference) => (
                      <div key={inference.id} className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                        <div className="flex items-start gap-3">
                          <img 
                            src={inference.image} 
                            alt="Inference"
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-slate-400">
                                {new Date(inference.timestamp).toLocaleTimeString()}
                              </span>
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/20 text-xs">
                                {inference.processingTime.toFixed(0)}ms
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              {inference.predictions.map((pred, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span className="text-white font-medium">{pred.class}</span>
                                  <span className="text-green-400">{(pred.confidence * 100).toFixed(1)}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ImageIcon className="h-12 w-12 text-slate-500 mx-auto mb-3" />
                    <p className="text-slate-400">No recent inferences</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Device Health */}
            <Card className="glass-effect border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Device Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-slate-300">CPU Usage</span>
                    </div>
                    <span className="text-white font-medium">
                      {currentMetrics ? Math.round(currentMetrics.cpuUsage) : '25'}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-slate-300">Memory</span>
                    </div>
                    <span className="text-white font-medium">
                      {currentMetrics ? Math.round(currentMetrics.memoryUsage) : '45'}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-orange-400" />
                      <span className="text-sm text-slate-300">Temperature</span>
                    </div>
                    <span className="text-white font-medium">
                      {currentMetrics ? Math.round(currentMetrics.temperature) : '45'}°C
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-purple-400" />
                      <span className="text-sm text-slate-300">NPU Load</span>
                    </div>
                    <span className="text-white font-medium">78%</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-700/50">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">All systems operational</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}