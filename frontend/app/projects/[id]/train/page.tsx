'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  Play,
  Brain,
  Activity,
  CheckCircle,
  Clock,
  Zap,
  Database,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrainingMetrics {
  epoch: number;
  loss: number;
  accuracy: number;
  val_loss: number;
  val_accuracy: number;
}

export async function generateStaticParams() {
  return [{ id: '1' }];
}

export default function TrainPage() {
  const router = useRouter();
  const params = useParams();
  const [trainingStatus, setTrainingStatus] = useState<'idle' | 'preparing' | 'training' | 'converting' | 'completed'>('idle');
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [totalEpochs] = useState(50);
  const [metrics, setMetrics] = useState<TrainingMetrics[]>([]);
  const [colabNotebookUrl] = useState('https://colab.research.google.com/drive/1example');

  // Simulate training progress
  useEffect(() => {
    if (trainingStatus === 'training') {
      const interval = setInterval(() => {
        setCurrentEpoch(prev => {
          if (prev >= totalEpochs - 1) {
            setTrainingStatus('converting');
            return prev;
          }
          
          // Add new metric data
          const newMetric: TrainingMetrics = {
            epoch: prev + 1,
            loss: Math.max(0.1, 2.5 - (prev + 1) * 0.04 + Math.random() * 0.1),
            accuracy: Math.min(0.99, 0.3 + (prev + 1) * 0.012 + Math.random() * 0.02),
            val_loss: Math.max(0.12, 2.8 - (prev + 1) * 0.035 + Math.random() * 0.15),
            val_accuracy: Math.min(0.97, 0.25 + (prev + 1) * 0.011 + Math.random() * 0.03)
          };
          
          setMetrics(prevMetrics => [...prevMetrics, newMetric]);
          return prev + 1;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [trainingStatus, totalEpochs]);

  // Handle conversion completion
  useEffect(() => {
    if (trainingStatus === 'converting') {
      const timeout = setTimeout(() => {
        setTrainingStatus('completed');
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [trainingStatus]);

  const startTraining = () => {
    setTrainingStatus('preparing');
    setTimeout(() => setTrainingStatus('training'), 2000);
  };

  const deployModel = () => {
    router.push(`/projects/${params.id}/deploy`);
  };

  const getProgressPercentage = () => {
    switch (trainingStatus) {
      case 'preparing': return 5;
      case 'training': return 5 + (currentEpoch / totalEpochs) * 80;
      case 'converting': return 90;
      case 'completed': return 100;
      default: return 0;
    }
  };

  const getStatusInfo = () => {
    switch (trainingStatus) {
      case 'idle':
        return { text: 'Ready to start', color: 'bg-blue-500/20 text-blue-400 border-blue-500/20', icon: Play };
      case 'preparing':
        return { text: 'Preparing dataset', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20', icon: Clock };
      case 'training':
        return { text: `Training (${currentEpoch}/${totalEpochs})`, color: 'bg-green-500/20 text-green-400 border-green-500/20', icon: Brain };
      case 'converting':
        return { text: 'Converting to RKNN', color: 'bg-purple-500/20 text-purple-400 border-purple-500/20', icon: Zap };
      case 'completed':
        return { text: 'Training completed', color: 'bg-green-500/20 text-green-400 border-green-500/20', icon: CheckCircle };
    }
  };

  const statusInfo = getStatusInfo();
  const currentMetrics = metrics[metrics.length - 1];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white">Model Training</h1>
            <p className="text-slate-400 mt-2">Train your AI model with uploaded dataset</p>
          </div>
          <Button
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
            onClick={() => window.open(colabNotebookUrl, '_blank')}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in Colab
          </Button>
        </div>

        {/* Training Status */}
        <Card className="glass-effect border-slate-700/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/20">
                  <statusInfo.icon className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Training Pipeline</CardTitle>
                  <CardDescription className="text-slate-400">
                    Google Colab integration with RKNN conversion
                  </CardDescription>
                </div>
              </div>
              
              <Badge className={statusInfo.color}>
                <statusInfo.icon className="h-3 w-3 mr-1" />
                {statusInfo.text}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Overall Progress</span>
                <span className="text-white">{Math.round(getProgressPercentage())}%</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-3" />
            </div>

            {trainingStatus === 'idle' && (
              <div className="text-center py-8">
                <Button
                  onClick={startTraining}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Training
                </Button>
                <p className="text-slate-400 text-sm mt-4">
                  This will launch the training process in Google Colab
                </p>
              </div>
            )}

            {trainingStatus === 'completed' && (
              <div className="text-center py-8 space-y-4">
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Model training completed successfully!</span>
                </div>
                <p className="text-slate-400">Your model has been converted to RKNN format and is ready for deployment.</p>
                <Button
                  onClick={deployModel}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                >
                  Deploy to Device
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Metrics */}
          <div className="space-y-6">
            <Card className="glass-effect border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white text-sm">Current Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Epoch</span>
                    <span className="text-white font-medium">{currentEpoch}/{totalEpochs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Accuracy</span>
                    <span className="text-green-400 font-medium">
                      {currentMetrics ? (currentMetrics.accuracy * 100).toFixed(1) : '0.0'}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Loss</span>
                    <span className="text-blue-400 font-medium">
                      {currentMetrics ? currentMetrics.loss.toFixed(3) : '0.000'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Val Accuracy</span>
                    <span className="text-purple-400 font-medium">
                      {currentMetrics ? (currentMetrics.val_accuracy * 100).toFixed(1) : '0.0'}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white text-sm">Training Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Model Type</span>
                  <span className="text-white font-medium">Detection</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Batch Size</span>
                  <span className="text-white font-medium">16</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Learning Rate</span>
                  <span className="text-white font-medium">0.001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Optimizer</span>
                  <span className="text-white font-medium">Adam</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Training Charts */}
          <div className="lg:col-span-2">
            <Card className="glass-effect border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Training Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                {metrics.length > 0 ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-3">Accuracy</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={metrics}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis 
                            dataKey="epoch" 
                            stroke="#64748b" 
                            fontSize={12}
                          />
                          <YAxis 
                            stroke="#64748b" 
                            fontSize={12}
                            domain={[0, 1]}
                            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1e293b', 
                              border: '1px solid #475569',
                              borderRadius: '8px'
                            }}
                            formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, '']}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="accuracy" 
                            stroke="#22c55e" 
                            strokeWidth={2}
                            dot={false}
                            name="Training"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="val_accuracy" 
                            stroke="#a855f7" 
                            strokeWidth={2}
                            dot={false}
                            name="Validation"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-3">Loss</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={metrics}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis 
                            dataKey="epoch" 
                            stroke="#64748b" 
                            fontSize={12}
                          />
                          <YAxis 
                            stroke="#64748b" 
                            fontSize={12}
                            tickFormatter={(value) => value.toFixed(2)}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1e293b', 
                              border: '1px solid #475569',
                              borderRadius: '8px'
                            }}
                            formatter={(value: number) => [value.toFixed(3), '']}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="loss" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            dot={false}
                            name="Training"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="val_loss" 
                            stroke="#f97316" 
                            strokeWidth={2}
                            dot={false}
                            name="Validation"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Activity className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg mb-2">No training data yet</p>
                    <p className="text-slate-500 text-sm">Metrics will appear once training starts</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}