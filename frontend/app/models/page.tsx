'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  Download,
  Eye,
  Layers,
  Search,
  FileText,
  Users,
  Calendar,
  Cpu,
  HardDrive
} from 'lucide-react';

interface Model {
  id: string;
  name: string;
  type: 'Detection' | 'Classification' | 'Inspection' | 'OCR' | 'Re-ID';
  version: string;
  accuracy: number;
  size: string;
  format: string;
  createdAt: string;
  deployments: number;
  status: 'active' | 'archived' | 'training';
}

export default function ModelsPage() {
  const models: Model[] = [
    {
      id: '1',
      name: 'Tyre Tread Detection',
      type: 'Detection',
      version: 'v2.0',
      accuracy: 94.2,
      size: '45.2 MB',
      format: 'RKNN',
      createdAt: '2025-01-15',
      deployments: 3,
      status: 'active'
    },
    {
      id: '2',
      name: 'PCB Inspection',
      type: 'Inspection',
      version: 'v1.5',
      accuracy: 87.5,
      size: '32.1 MB',
      format: 'RKNN',
      createdAt: '2025-01-10',
      deployments: 1,
      status: 'active'
    },
    {
      id: '3',
      name: 'Product Classification',
      type: 'Classification',
      version: 'v3.1',
      accuracy: 91.8,
      size: '28.7 MB',
      format: 'RKNN',
      createdAt: '2025-01-08',
      deployments: 5,
      status: 'active'
    },
    {
      id: '4',
      name: 'Document OCR',
      type: 'OCR',
      version: 'v1.0',
      accuracy: 89.3,
      size: '52.4 MB',
      format: 'RKNN',
      createdAt: '2025-01-05',
      deployments: 0,
      status: 'training'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Detection': return Eye;
      case 'Classification': return Layers;
      case 'Inspection': return Search;
      case 'OCR': return FileText;
      case 'Re-ID': return Users;
      default: return Brain;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Detection': return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
      case 'Classification': return 'bg-green-500/20 text-green-400 border-green-500/20';
      case 'Inspection': return 'bg-purple-500/20 text-purple-400 border-purple-500/20';
      case 'OCR': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20';
      case 'Re-ID': return 'bg-red-500/20 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/20';
      case 'training': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20';
      case 'archived': return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white">Model Hub</h1>
            <p className="text-slate-400 mt-2">Manage your trained AI models and versions</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Brain className="mr-2 h-4 w-4" />
            Import Model
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-effect border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Models</CardTitle>
              <Brain className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{models.length}</div>
              <p className="text-xs text-slate-400">Trained models</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Active Models</CardTitle>
              <Cpu className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {models.filter(m => m.status === 'active').length}
              </div>
              <p className="text-xs text-slate-400">Currently deployed</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Avg Accuracy</CardTitle>
              <Brain className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {(models.reduce((sum, m) => sum + m.accuracy, 0) / models.length).toFixed(1)}%
              </div>
              <p className="text-xs text-slate-400">Model performance</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-slate-700/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Size</CardTitle>
              <HardDrive className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">158.4 MB</div>
              <p className="text-xs text-slate-400">Storage used</p>
            </CardContent>
          </Card>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {models.map((model) => {
            const TypeIcon = getTypeIcon(model.type);
            return (
              <Card key={model.id} className="glass-effect border-slate-700/50 hover:border-slate-600/50 transition-colors group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(model.type)}`}>
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-white group-hover:text-blue-400 transition-colors">
                          {model.name}
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          {model.type} • {model.version}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(model.status)}>
                      {model.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Accuracy</span>
                      <div className="text-white font-medium">{model.accuracy}%</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Size</span>
                      <div className="text-white font-medium">{model.size}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Format</span>
                      <div className="text-white font-medium">{model.format}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Deployments</span>
                      <div className="text-white font-medium">{model.deployments}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar className="h-3 w-3" />
                    Created {new Date(model.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Download className="mr-1 h-3 w-3" />
                      Download
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Deploy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}