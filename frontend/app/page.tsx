'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, Shield, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate login delay
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify({ username: credentials.username }));
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Brand */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-2xl bg-blue-600/20 border border-blue-500/20">
              <Brain className="h-12 w-12 text-blue-400" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Edgeble AI</h1>
            <p className="text-slate-400 mt-2">Edge AI Orchestration Platform</p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="glass-effect border-slate-700/50">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">Welcome back</CardTitle>
            <CardDescription className="text-center text-slate-400">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-300">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="p-2 rounded-lg bg-green-600/20 border border-green-500/20 mx-auto w-fit">
              <Zap className="h-5 w-5 text-green-400" />
            </div>
            <p className="text-xs text-slate-400">Fast Training</p>
          </div>
          <div className="space-y-2">
            <div className="p-2 rounded-lg bg-purple-600/20 border border-purple-500/20 mx-auto w-fit">
              <Brain className="h-5 w-5 text-purple-400" />
            </div>
            <p className="text-xs text-slate-400">Smart Deploy</p>
          </div>
          <div className="space-y-2">
            <div className="p-2 rounded-lg bg-orange-600/20 border border-orange-500/20 mx-auto w-fit">
              <Shield className="h-5 w-5 text-orange-400" />
            </div>
            <p className="text-xs text-slate-400">Secure Updates</p>
          </div>
        </div>

        {/* Demo credentials hint */}
        <div className="text-center text-xs text-slate-500">
          Demo: Use any username/password to continue
        </div>
      </div>
    </div>
  );
}