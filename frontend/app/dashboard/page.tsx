'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Plus, 
  Activity, 
  Cpu, 
  Database, 
  Settings,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Play
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';

interface Project {
  id: string;
  name: string;
  type: string;
  status: 'training' | 'deployed' | 'monitoring' | 'idle';
  accuracy: number;
  lastTrained: string;
  deviceCount: number;
  modelVersion: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Tyre Tread Detection',
      type: 'Detection',
      status: 'deployed',
      accuracy: 94.2,
      lastTrained: '2 hours ago',
      deviceCount: 3,
      modelVersion: 'v1.2'
    },
    {
      id: '2',
      name: 'PCB Inspection',
      type: 'Inspection',
      status: 'training',
      accuracy: 87.5,
      lastTrained: '1 day ago',
      deviceCount: 1,
      modelVersion: 'v0.8'
    },
    {
      id: '3',
      name: 'Product Classification',
      type: 'Classification',
      status: 'monitoring',
      accuracy: 91.8,
      lastTrained: '3 days ago',
      deviceCount: 5,
      modelVersion: 'v2.1'
    }
  ]);

  const stats = {
    totalProjects: projects.length,
    activeDevices: projects.reduce((sum, p) => sum + p.deviceCount, 0),
    avgAccuracy: projects.reduce((sum, p) => sum + p.accuracy, 0) / projects.length,
    deploymentsToday: 12
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'training': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'deployed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'monitoring': return <Activity className="h-4 w-4 text-blue-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'training': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'deployed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'monitoring': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white">Project Dashboard Demo</h1>
            <p className="text-slate-400 mt-2">Manage your Edge AI projects and deployments</p>
          </div>
          <Button 
            onClick={() => router.push('/projects/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-effect border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Projects</CardTitle>
              <Brain className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalProjects}</div>
              <p className="text-xs text-slate-400">Active AI models</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Active Devices</CardTitle>
              <Cpu className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.activeDevices}</div>
              <p className="text-xs text-slate-400">Connected edge devices</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Avg Accuracy</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.avgAccuracy.toFixed(1)}%</div>
              <p className="text-xs text-slate-400">Model performance</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Deployments</CardTitle>
              <Database className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.deploymentsToday}</div>
              <p className="text-xs text-slate-400">Today</p>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Recent Projects</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="glass-effect border-slate-700/50 hover:border-slate-600/50 transition-colors group cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white group-hover:text-blue-400 transition-colors">
                        {project.name}
                      </CardTitle>
                      <CardDescription className="text-slate-400 mt-1">
                        {project.type} • Model {project.modelVersion}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(project.status)}
                        {project.status}
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Accuracy</span>
                      <span className="text-white font-medium">{project.accuracy}%</span>
                    </div>
                    <Progress value={project.accuracy} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-slate-400">
                      <Cpu className="inline h-3 w-3 mr-1" />
                      {project.deviceCount} devices
                    </div>
                    <div className="text-slate-400">
                      Trained {project.lastTrained}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                      onClick={() => router.push(`/projects/${project.id}/monitor`)}
                    >
                      <Activity className="mr-1 h-3 w-3" />
                      Monitor
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => router.push(`/projects/${project.id}/train`)}
                    >
                      <Play className="mr-1 h-3 w-3" />
                      Retrain
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
