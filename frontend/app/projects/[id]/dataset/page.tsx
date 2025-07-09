'use client';

import { useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DashboardLayout } from '@/components/dashboard-layout';
import {
  Upload,
  Image as ImageIcon,
  X,
  Tag,
  Plus,
  ArrowRight,
  CheckCircle,
  FileImage
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UploadedImage {
  id: string;
  file: File;
  url: string;
  label: string;
}

export async function generateStaticParams() {
  return [{ id: '1' }];
}

export default function DatasetPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [currentLabel, setCurrentLabel] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        const newImage: UploadedImage = {
          id: Date.now().toString() + Math.random(),
          file,
          url,
          label: currentLabel || ''
        };
        setImages(prev => [...prev, newImage]);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== id);
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      return updated;
    });
  };

  const updateImageLabel = (id: string, label: string) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, label } : img
    ));
  };

  const handleStartTraining = () => {
    if (images.length === 0) {
      toast({
        title: "No images uploaded",
        description: "Please upload at least one image before starting training.",
        variant: "destructive"
      });
      return;
    }

    const unlabeledImages = images.filter(img => !img.label.trim());
    if (unlabeledImages.length > 0) {
      toast({
        title: "Unlabeled images",
        description: `Please add labels to all ${unlabeledImages.length} unlabeled images.`,
        variant: "destructive"
      });
      return;
    }

    // Save dataset and navigate to training
    const dataset = {
      projectId: params.id,
      images: images.map(img => ({
        name: img.file.name,
        label: img.label,
        size: img.file.size
      })),
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem(`dataset_${params.id}`, JSON.stringify(dataset));
    router.push(`/projects/${params.id}/train`);
  };

  const labeledCount = images.filter(img => img.label.trim()).length;
  const completionPercentage = images.length > 0 ? (labeledCount / images.length) * 100 : 0;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">Dataset Management</h1>
          <p className="text-slate-400">
            Upload and label your training images
          </p>
          
          {/* Progress */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">Dataset Progress</span>
              <span className="text-white">{labeledCount}/{images.length} labeled</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="glass-effect border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Images
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Add training images for your model
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="label" className="text-slate-300">Default Label</Label>
                  <Input
                    id="label"
                    placeholder="e.g., TBB, Defective, Class A"
                    value={currentLabel}
                    onChange={(e) => setCurrentLabel(e.target.value)}
                    className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>

                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragOver 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                >
                  <FileImage className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-300 mb-2">Drag & drop images here</p>
                  <p className="text-sm text-slate-400 mb-4">or</p>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Browse Files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                </div>

                <div className="text-xs text-slate-500">
                  Supported formats: JPG, PNG, GIF, WebP
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="glass-effect border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white text-sm">Dataset Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Total Images</span>
                  <span className="text-white font-medium">{images.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Labeled</span>
                  <span className="text-green-400 font-medium">{labeledCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Unlabeled</span>
                  <span className="text-yellow-400 font-medium">{images.length - labeledCount}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Image Gallery */}
          <div className="lg:col-span-2">
            <Card className="glass-effect border-slate-700/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Image Gallery ({images.length})
                  </CardTitle>
                  <Button
                    onClick={handleStartTraining}
                    disabled={images.length === 0 || completionPercentage < 100}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Start Training
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {images.length === 0 ? (
                  <div className="text-center py-16">
                    <ImageIcon className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg mb-2">No images uploaded yet</p>
                    <p className="text-slate-500 text-sm">Upload your first training image to get started</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image) => (
                      <div key={image.id} className="group relative">
                        <div className="aspect-square rounded-lg overflow-hidden bg-slate-800 border border-slate-700">
                          <img
                            src={image.url}
                            alt="Uploaded"
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Remove button */}
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(image.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>

                          {/* Label status */}
                          <div className="absolute top-2 left-2">
                            {image.label ? (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/20 text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Labeled
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/20 text-xs">
                                <Tag className="h-3 w-3 mr-1" />
                                Unlabeled
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Label input */}
                        <div className="mt-2">
                          <Input
                            placeholder="Add label..."
                            value={image.label}
                            onChange={(e) => updateImageLabel(image.id, e.target.value)}
                            className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 text-sm"
                          />
                        </div>
                      </div>
                    ))}
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