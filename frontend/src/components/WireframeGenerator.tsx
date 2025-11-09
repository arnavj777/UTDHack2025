import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Slider } from './ui/slider';
import { Sparkles, Download, Play, Wand2, Share, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export function WireframeGenerator() {
  const [prompt, setPrompt] = useState('');
  const [fidelity, setFidelity] = useState([50]);

  const generated = prompt.length > 0;

  const accessibilityScores = [
    { category: 'Color Contrast', score: 95, status: 'pass' },
    { category: 'Touch Target Size', score: 88, status: 'pass' },
    { category: 'Text Readability', score: 72, status: 'warning' },
    { category: 'Screen Reader Support', score: 100, status: 'pass' },
    { category: 'Keyboard Navigation', score: 65, status: 'warning' }
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="mb-2">Wireframe & Mockup Generator</h1>
          <p className="text-slate-600">Generate wireframes from text descriptions with AI</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export to Figma
          </Button>
          <Button variant="outline" className="gap-2">
            <Share className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Generator Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="mb-4">Describe Your Design</h3>
            
            <Textarea 
              placeholder="e.g., Create a mobile banking dashboard with account balance at the top, recent transactions below, and quick action buttons for transfer and pay bills..."
              className="min-h-32 mb-4"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <div className="space-y-4 mb-4">
              <div>
                <label className="mb-2 block">Fidelity Level</label>
                <div className="flex items-center gap-4">
                  <span className="text-slate-600">Low-fi</span>
                  <Slider 
                    value={fidelity} 
                    onValueChange={setFidelity}
                    min={0}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-slate-600">High-fi</span>
                </div>
                <div className="flex justify-between mt-2 text-slate-500">
                  <span>Wireframe</span>
                  <span>Mockup</span>
                  <span>Pixel-perfect</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="gap-2">
                <Sparkles className="w-4 h-4" />
                Generate Wireframe
              </Button>
              <Button variant="outline" className="gap-2">
                <Wand2 className="w-4 h-4" />
                Refine with AI
              </Button>
            </div>
          </Card>

          {/* Canvas Area */}
          <Card className="p-6">
            <Tabs defaultValue="desktop">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="mobile">Mobile</TabsTrigger>
                  <TabsTrigger value="tablet">Tablet</TabsTrigger>
                  <TabsTrigger value="desktop">Desktop</TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Undo</Button>
                  <Button variant="outline" size="sm">Redo</Button>
                </div>
              </div>

              <TabsContent value="desktop" className="mt-0">
                <div className="bg-slate-50 rounded-lg p-8 min-h-[600px] border-2 border-dashed border-slate-300">
                  {generated ? (
                    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
                      {/* Mock Wireframe */}
                      <div className="border-b pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="h-6 w-32 bg-slate-200 rounded" />
                          <div className="h-8 w-8 bg-slate-200 rounded-full" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 space-y-4">
                          <div className="h-32 bg-blue-100 rounded-lg p-4">
                            <div className="h-4 w-24 bg-blue-300 rounded mb-2" />
                            <div className="h-8 w-40 bg-blue-400 rounded" />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="h-4 w-32 bg-slate-200 rounded" />
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="flex items-center gap-3 p-3 border rounded">
                                <div className="h-10 w-10 bg-slate-200 rounded-full" />
                                <div className="flex-1 space-y-2">
                                  <div className="h-3 w-3/4 bg-slate-200 rounded" />
                                  <div className="h-2 w-1/2 bg-slate-100 rounded" />
                                </div>
                                <div className="h-4 w-16 bg-slate-200 rounded" />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="h-4 w-24 bg-slate-200 rounded" />
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                              <div className="h-6 w-6 bg-slate-300 rounded" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-slate-400">
                        <Wand2 className="w-16 h-16 mx-auto mb-4" />
                        <p>Enter a description and click "Generate Wireframe"</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="mobile">
                <div className="bg-slate-50 rounded-lg p-8 min-h-[600px] flex items-center justify-center border-2 border-dashed border-slate-300">
                  <div className="text-slate-400">Mobile view</div>
                </div>
              </TabsContent>

              <TabsContent value="tablet">
                <div className="bg-slate-50 rounded-lg p-8 min-h-[600px] flex items-center justify-center border-2 border-dashed border-slate-300">
                  <div className="text-slate-400">Tablet view</div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Component Library */}
          <Card className="p-6">
            <h3 className="mb-4">Drag & Drop Components</h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                'Header', 'Button', 'Input', 'Card',
                'Nav Menu', 'Footer', 'Image', 'Text Block',
                'Form', 'Table', 'Chart', 'Modal'
              ].map((component, index) => (
                <div 
                  key={index}
                  className="p-4 border-2 border-dashed border-slate-300 rounded-lg text-center cursor-move hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <div className="h-8 w-8 bg-slate-200 rounded mx-auto mb-2" />
                  <span className="text-slate-600">{component}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Accessibility Score */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h4>Accessibility Score</h4>
            </div>
            
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">85/100</div>
              <Badge variant="secondary">Good</Badge>
            </div>

            <div className="space-y-3">
              {accessibilityScores.map((score, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-600">{score.category}</span>
                    <div className="flex items-center gap-2">
                      <span>{score.score}</span>
                      {score.status === 'pass' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                      )}
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        score.status === 'pass' ? 'bg-green-600' : 'bg-orange-500'
                      }`}
                      style={{width: `${score.score}%`}}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" size="sm" className="w-full mt-4">
              View Full Report
            </Button>
          </Card>

          {/* AI Suggestions */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h4>AI Suggestions</h4>
            </div>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span>Increase button size to 44px for better touch targets</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span>Add more spacing between form fields</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                <span>Use higher contrast text for readability</span>
              </li>
            </ul>
            <Button variant="outline" size="sm" className="w-full mt-4">
              Apply All
            </Button>
          </Card>

          {/* Export Options */}
          <Card className="p-6">
            <h4 className="mb-4">Export Options</h4>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Download className="w-4 h-4" />
                Export to Figma
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Download className="w-4 h-4" />
                Export as PNG
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Download className="w-4 h-4" />
                Export as SVG
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Download className="w-4 h-4" />
                Export as React Code
              </Button>
            </div>
          </Card>

          {/* Version History */}
          <Card className="p-6">
            <h4 className="mb-4">Version History</h4>
            <div className="space-y-2 text-slate-600">
              <div className="flex items-center justify-between">
                <span>Current</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div>v1.2 - 2 hours ago</div>
              <div>v1.1 - Yesterday</div>
              <div>v1.0 - 3 days ago</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
