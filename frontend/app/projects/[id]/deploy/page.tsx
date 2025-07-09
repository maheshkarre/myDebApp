'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  Cpu,
  Wifi,
  Battery,
  Thermometer,
  HardDrive,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  Monitor,
  ArrowRight,
  Zap
} from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'updating';
  lastSeen: string;
  specs: {
    cpu: string;
    ram: string;
    storage: string;
    npu: string;
  };
  health: {
    temperature: number;
    cpuUsage: number;
    memoryUsage: number;
    batteryLevel?: number;
  };
  currentModel?: {
    version: string;
    accuracy: number;
  };
}

export async function generateStaticParams() {
  return [{ id: '1' }];
}

export default function DeployPage() {
  const router = useRouter();
  const params = useParams();
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [deploymentMethod, setDeploymentMethod] = useState<'full' | 'delta'>('full');
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'preparing' | 'uploading' | 'installing' | 'completed'>('idle');
  const [deploymentProgress, setDeploymentProgress] = useState(0);

  const devices: Device[] = [
    {
      id: 'device-001',
      name: 'EdgeBox-RPX3L-01',
      type: 'Rockchip RK3588',
      status: 'online',
      lastSeen: '2 minutes ago',
      specs: {
        cpu: 'ARM Cortex-A76/A55',
        ram: '8GB LPDDR4',
        storage: '64GB eMMC',
        npu: '6 TOPS'
      },
      health: {
        temperature: 45,
        cpuUsage: 23,
        memoryUsage: 34,
        batteryLevel: 85
      },
      currentModel: {
        version: 'v1.1',
        accuracy: 91.2
      }
    },
    {
      id: 'device-002',
      name: 'EdgeBox-RPX3L-02',
      type: 'Rockchip RK3588',
      status: 'online',
      lastSeen: '5 minutes ago',
      specs: {
        cpu: 'ARM Cortex-A76/A55',
        ram: '8GB LPDDR4',
        storage: '64GB eMMC',
        npu: '6 TOPS'
      },
      health: {
        temperature: 52,
        cpuUsage: 45,
        memoryUsage: 67
      }
    },
    {
      id: 'device-003',
      name: 'EdgeBox-RPX3L-03',
      type: 'Rockchip RK3588',
      status: 'offline',
      lastSeen: '2 hours ago',
      specs: {
        cpu: 'ARM Cortex-A76/A55',
        ram: '8GB LPDDR4',
        storage: '64GB eMMC',
        npu: '6 TOPS'
      },
      health: {
        temperature: 0,
        cpuUsage: 0,
        memoryUsage: 0
      }
    }
  ];

  const startDeployment = () => {
    if (!selectedDevice) return;

    setDeploymentStatus('preparing');
    setDeploymentProgress(10);

    // Simulate deployment process
    const intervals = [
      { status: 'uploading' as const, progress: 30, delay: 1500 },
      { status: 'uploading' as const, progress: 60, delay: 2000 },
      { status: 'installing' as const, progress: 80, delay: 1500 },
      { status: 'completed' as const, progress: 100, delay: 1000 }
    ];

    let currentStep = 0;
    const processStep = () => {
      if (currentStep < intervals.length) {
        const step = intervals[currentStep];
        setTimeout(() => {
          setDeploymentStatus(step.status);
          setDeploymentProgress(step.progress);
          currentStep++;
          processStep();
        }, step.delay);
      }
    };

    processStep();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <div className="w-2 h-2 rounded-full bg-green-500 pulse-glow" />;
      case 'offline': return <div className="w-2 h-2 rounded-full bg-red-500" />;
      case 'updating': return <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />;
      default: return <div className="w-2 h-2 rounded-full bg-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'offline': return 'text-red-400';
      case 'updating': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getDeploymentStatusInfo = () => {
    switch (deploymentStatus) {
      case 'preparing':
        return { text: 'Preparing deployment package...', icon: Clock };
      case 'uploading':
        return { text: 'Uploading to device...', icon: Download };
      case 'installing':
        return { text: 'Installing model...', icon: HardDrive };
      case 'completed':
        return { text: 'Deployment completed!', icon: CheckCircle };
      default:
        return { text: 'Ready to deploy', icon: Zap };
    }
  };

  const statusInfo = getDeploymentStatusInfo();
  const selectedDeviceData = devices.find(d => d.id === selectedDevice);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Model Deployment</h1>
          <p className="text-slate-400 mt-2">Deploy your trained model to edge devices</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Device Selection */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-effect border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Select Target Device</CardTitle>
                <CardDescription className="text-slate-400">
                  Choose an edge device for model deployment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={selectedDevice} onValueChange={setSelectedDevice}>
                  {devices.map((device) => (
                    <div key={device.id} className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value={device.id} id={device.id} />
                        <Label 
                          htmlFor={device.id} 
                          className="flex-1 cursor-pointer"
                        >
                          <Card className={`glass-effect transition-colors ${
                            selectedDevice === device.id 
                              ? 'border-blue-500/50 bg-blue-500/5' 
                              : 'border-slate-700/50 hover:border-slate-600/50'
                          }`}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="font-semibold text-white">{device.name}</h3>
                                  <p className="text-sm text-slate-400">{device.type}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(device.status)}
                                  <span className={`text-sm capitalize ${getStatusColor(device.status)}`}>
                                    {device.status}
                                  </span>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">CPU:</span>
                                    <span className="text-white">{device.specs.cpu}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">NPU:</span>
                                    <span className="text-white">{device.specs.npu}</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">RAM:</span>
                                    <span className="text-white">{device.specs.ram}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Storage:</span>
                                    <span className="text-white">{device.specs.storage}</span>
                                  </div>
                                </div>
                              </div>

                              {device.status === 'online' && (
                                <div className="grid grid-cols-3 gap-4 mt-4 pt-3 border-t border-slate-700/50">
                                  <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-xs text-slate-400 mb-1">
                                      <Thermometer className="h-3 w-3" />
                                      Temp
                                    </div>
                                    <div className="text-sm font-medium text-white">{device.health.temperature}°C</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 text-xs text-slate-400 mb-1">
                                      <Cpu className="h-3 w-3" />
                                      CPU
                                    </div>
                                    <div className="text-sm font-medium text-white">{device.health.cpuUsage}%</div>
                                  </div>
                                  {device.health.batteryLevel && (
                                    <div className="text-center">
                                      <div className="flex items-center justify-center gap-1 text-xs text-slate-400 mb-1">
                                        <Battery className="h-3 w-3" />
                                        Battery
                                      </div>
                                      <div className="text-sm font-medium text-white">{device.health.batteryLevel}%</div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {device.currentModel && (
                                <div className="mt-3 pt-3 border-t border-slate-700/50">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-400">Current Model:</span>
                                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/20 text-xs">
                                      {device.currentModel.version} • {device.currentModel.accuracy}%
                                    </Badge>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </Label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Deployment Method */}
            {selectedDevice && (
              <Card className="glass-effect border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Deployment Method</CardTitle>
                  <CardDescription className="text-slate-400">
                    Choose how to update the model on the device
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={deploymentMethod} onValueChange={(value: 'full' | 'delta') => setDeploymentMethod(value)}>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="full" id="full" />
                        <Label htmlFor="full" className="flex-1">
                          <div className="p-4 rounded-lg border border-slate-700/50 hover:border-slate-600/50 transition-colors">
                            <div className="flex items-start gap-3">
                              <HardDrive className="h-5 w-5 text-blue-400 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-white">Full Firmware Update</h4>
                                <p className="text-sm text-slate-400 mt-1">
                                  Complete system update including OS, drivers, and model
                                </p>
                                <div className="flex gap-4 mt-2 text-xs text-slate-500">
                                  <span>• ~500MB download</span>
                                  <span>• 5-10 minutes</span>
                                  <span>• Recommended for first deployment</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="delta" id="delta" />
                        <Label htmlFor="delta" className="flex-1">
                          <div className="p-4 rounded-lg border border-slate-700/50 hover:border-slate-600/50 transition-colors">
                            <div className="flex items-start gap-3">
                              <Zap className="h-5 w-5 text-green-400 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-white">Delta Update</h4>
                                <p className="text-sm text-slate-400 mt-1">
                                  Update only the model files, keeping existing system
                                </p>
                                <div className="flex gap-4 mt-2 text-xs text-slate-500">
                                  <span>• ~50MB download</span>
                                  <span>• 1-2 minutes</span>
                                  <span>• Faster, requires existing model</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Deployment Panel */}
          <div className="space-y-6">
            <Card className="glass-effect border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white">Deployment Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <statusInfo.icon className={`h-4 w-4 ${
                    deploymentStatus === 'completed' ? 'text-green-400' : 'text-blue-400'
                  }`} />
                  <span className="text-white text-sm">{statusInfo.text}</span>
                </div>

                {deploymentStatus !== 'idle' && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-white">{deploymentProgress}%</span>
                    </div>
                    <Progress value={deploymentProgress} className="h-2" />
                  </div>
                )}

                {deploymentStatus === 'idle' ? (
                  <Button
                    onClick={startDeployment}
                    disabled={!selectedDevice}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Start Deployment
                  </Button>
                ) : deploymentStatus === 'completed' ? (
                  <div className="space-y-3">
                    <div className="text-center py-4">
                      <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <p className="text-green-400 font-medium">Deployment Successful!</p>
                      <p className="text-slate-400 text-sm mt-1">Model v2.0 is now active</p>
                    </div>
                    <Button
                      onClick={() => router.push(`/projects/${params.id}/monitor`)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Monitor className="mr-2 h-4 w-4" />
                      Start Monitoring
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">Please wait...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedDeviceData && (
              <Card className="glass-effect border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Device Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Name</span>
                    <span className="text-white text-sm font-medium">{selectedDeviceData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Status</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedDeviceData.status)}
                      <span className={`text-sm capitalize ${getStatusColor(selectedDeviceData.status)}`}>
                        {selectedDeviceData.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Last Seen</span>
                    <span className="text-white text-sm">{selectedDeviceData.lastSeen}</span>
                  </div>
                  {selectedDeviceData.currentModel && (
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-sm">Current Model</span>
                      <span className="text-blue-400 text-sm">{selectedDeviceData.currentModel.version}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}