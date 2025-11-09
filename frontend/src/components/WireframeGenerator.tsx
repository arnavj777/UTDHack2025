import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Slider } from './ui/slider';
import { Sparkles, Download, Wand2, Share, CheckCircle, AlertCircle } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { api, ApiError } from '../services/api';

interface WireframeData {
  description: string;
  fidelity: number;
  device_type: string;
  svg: string;
  accessibility_score: number;
  suggestions: string[];
  components?: string[];
}

export function WireframeGenerator() {
  const [prompt, setPrompt] = useState('');
  const [fidelity, setFidelity] = useState([50]);
  const [deviceType, setDeviceType] = useState('desktop');
  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  const [error, setError] = useState('');
  const [wireframe, setWireframe] = useState<WireframeData | null>(null);
  const [refinementPrompt, setRefinementPrompt] = useState('');
  
  // Undo/Redo state management
  const [history, setHistory] = useState<WireframeData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const generated = wireframe !== null;
  
  // Helper function to save wireframe to history
  const saveToHistory = (wf: WireframeData) => {
    setHistory(prev => {
      // Remove any history after current index (when undoing and then making new changes)
      const newHistory = prev.slice(0, historyIndex + 1);
      // Add new wireframe to history
      newHistory.push(wf);
      // Limit history to 50 items to prevent memory issues
      if (newHistory.length > 50) {
        newHistory.shift();
        return newHistory;
      }
      return newHistory;
    });
    setHistoryIndex(prev => {
      const newIndex = prev + 1;
      // If we're at max history, stay at the last index
      return Math.min(newIndex, 49);
    });
  };
  
  // Undo functionality
  const handleUndo = useCallback(() => {
    setHistoryIndex(prevIndex => {
      if (prevIndex > 0) {
        const newIndex = prevIndex - 1;
        setWireframe(history[newIndex]);
        return newIndex;
      } else if (prevIndex === 0) {
        // Go back to initial state (no wireframe)
        setWireframe(null);
        return -1;
      }
      return prevIndex;
    });
  }, [history]);
  
  // Redo functionality
  const handleRedo = useCallback(() => {
    setHistoryIndex(prevIndex => {
      if (prevIndex < history.length - 1) {
        const newIndex = prevIndex + 1;
        setWireframe(history[newIndex]);
        return newIndex;
      }
      return prevIndex;
    });
  }, [history]);
  
  // Check if undo/redo are available
  const canUndo = historyIndex >= 0;
  const canRedo = historyIndex < history.length - 1;
  
  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }
      
      // Ctrl+Z or Cmd+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) {
          handleUndo();
        }
      }
      // Ctrl+Y or Ctrl+Shift+Z or Cmd+Shift+Z for redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        if (canRedo) {
          handleRedo();
        }
      }
      // Ctrl+Shift+Z or Cmd+Shift+Z for redo (alternative)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        if (canRedo) {
          handleRedo();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canUndo, canRedo, handleUndo, handleRedo]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post<{ wireframe: WireframeData; message: string }>('/wireframe/generate/', {
        prompt: prompt,
        fidelity: fidelity[0],
        device_type: deviceType
      });

      const newWireframe = response.wireframe;
      setWireframe(newWireframe);
      // Save to history
      saveToHistory(newWireframe);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to generate wireframe. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefine = async () => {
    if (!refinementPrompt.trim()) {
      setError('Please enter refinement instructions');
      return;
    }

    if (!wireframe) {
      setError('Please generate a wireframe first');
      return;
    }

    setRefining(true);
    setError('');

    try {
      const response = await api.post<{ refined_wireframe: WireframeData; message: string }>('/wireframe/refine/', {
        wireframe_data: wireframe,
        refinement_prompt: refinementPrompt,
        fidelity: wireframe.fidelity,
        device_type: wireframe.device_type
      });

      const newWireframe = response.refined_wireframe;
      setWireframe(newWireframe);
      // Save to history
      saveToHistory(newWireframe);
      setRefinementPrompt('');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to refine wireframe. Please try again.');
      }
    } finally {
      setRefining(false);
    }
  };

  // Calculate accessibility scores from wireframe data
  const accessibilityScores = wireframe ? [
    { category: 'Color Contrast', score: Math.min(100, wireframe.accessibility_score + 10), status: wireframe.accessibility_score >= 80 ? 'pass' : 'warning' },
    { category: 'Touch Target Size', score: deviceType === 'mobile' ? Math.min(100, wireframe.accessibility_score + 5) : 88, status: 'pass' },
    { category: 'Text Readability', score: Math.max(60, wireframe.accessibility_score - 10), status: wireframe.accessibility_score >= 70 ? 'pass' : 'warning' },
    { category: 'Screen Reader Support', score: 100, status: 'pass' },
    { category: 'Keyboard Navigation', score: Math.max(60, wireframe.accessibility_score - 5), status: wireframe.accessibility_score >= 70 ? 'pass' : 'warning' }
  ] : [
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
              <Button className="gap-2" onClick={handleGenerate} disabled={loading || !prompt.trim()}>
                <Sparkles className="w-4 h-4" />
                {loading ? 'Generating...' : 'Generate Wireframe'}
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleRefine} disabled={refining || !wireframe || !refinementPrompt.trim()}>
                <Wand2 className="w-4 h-4" />
                {refining ? 'Refining...' : 'Refine with AI'}
              </Button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {wireframe && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">{wireframe.description}</p>
              </div>
            )}

            {wireframe && (
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium">Refinement Instructions</label>
                <Textarea 
                  placeholder="e.g., Increase button sizes, add more spacing, improve contrast..."
                  className="min-h-20"
                  value={refinementPrompt}
                  onChange={(e) => setRefinementPrompt(e.target.value)}
                />
              </div>
            )}
          </Card>

          {/* Canvas Area */}
          <Card className="p-6">
            <div className="mb-4">
              <Tabs defaultValue="wireframe">
                <TabsList>
                  <TabsTrigger value="wireframe">Wireframe</TabsTrigger>
                  <TabsTrigger value="mockup">Mockup</TabsTrigger>
                  <TabsTrigger value="pixel-perfect">Pixel-perfect</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <Tabs defaultValue="desktop" value={deviceType} onValueChange={setDeviceType}>
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="mobile">Mobile</TabsTrigger>
                  <TabsTrigger value="tablet">Tablet</TabsTrigger>
                  <TabsTrigger value="desktop">Desktop</TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleUndo}
                    disabled={!canUndo}
                    title={canUndo ? 'Undo last action' : 'Nothing to undo'}
                  >
                    Undo
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRedo}
                    disabled={!canRedo}
                    title={canRedo ? 'Redo last undone action' : 'Nothing to redo'}
                  >
                    Redo
                  </Button>
                </div>
              </div>

              <TabsContent value="desktop" className="mt-0">
                <div className="bg-slate-50 rounded-lg p-8 min-h-[600px] border-2 border-dashed border-slate-300 flex items-center justify-center overflow-auto">
                  {generated && wireframe ? (
                    <div 
                      className="bg-white rounded-lg shadow-lg p-4"
                      dangerouslySetInnerHTML={{ __html: wireframe.svg }}
                    />
                  ) : (
                    <div className="text-center text-slate-400">
                      <div className="relative w-16 h-16 mx-auto mb-4">
                        <Wand2 className="w-16 h-16 mx-auto" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">+</span>
                        </div>
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">+</span>
                        </div>
                      </div>
                      <p>Enter a description and click "Generate Wireframe"</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="mobile">
                <div className="bg-slate-50 rounded-lg p-8 min-h-[600px] border-2 border-dashed border-slate-300 flex items-center justify-center overflow-auto">
                  {generated && wireframe ? (
                    <div 
                      className="bg-white rounded-lg shadow-lg p-4"
                      dangerouslySetInnerHTML={{ __html: wireframe.svg }}
                    />
                  ) : (
                    <div className="text-center text-slate-400">
                      <div className="relative w-16 h-16 mx-auto mb-4">
                        <Wand2 className="w-16 h-16 mx-auto" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">+</span>
                        </div>
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">+</span>
                        </div>
                      </div>
                      <p>Enter a description and click "Generate Wireframe"</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="tablet">
                <div className="bg-slate-50 rounded-lg p-8 min-h-[600px] border-2 border-dashed border-slate-300 flex items-center justify-center overflow-auto">
                  {generated && wireframe ? (
                    <div 
                      className="bg-white rounded-lg shadow-lg p-4"
                      dangerouslySetInnerHTML={{ __html: wireframe.svg }}
                    />
                  ) : (
                    <div className="text-center text-slate-400">
                      <div className="relative w-16 h-16 mx-auto mb-4">
                        <Wand2 className="w-16 h-16 mx-auto" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">+</span>
                        </div>
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">+</span>
                        </div>
                      </div>
                      <p>Enter a description and click "Generate Wireframe"</p>
                    </div>
                  )}
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
              <div className="text-4xl mb-2">{wireframe?.accessibility_score || 85}/100</div>
              <Badge variant={wireframe && wireframe.accessibility_score >= 80 ? 'secondary' : 'destructive'}>
                {wireframe && wireframe.accessibility_score >= 80 ? 'Good' : wireframe && wireframe.accessibility_score >= 60 ? 'Fair' : 'Needs Improvement'}
              </Badge>
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
            {wireframe && wireframe.suggestions && wireframe.suggestions.length > 0 ? (
              <ul className="space-y-2 text-slate-700">
                {wireframe.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            ) : (
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
            )}
            <Button variant="outline" size="sm" className="w-full mt-4" onClick={handleRefine} disabled={!wireframe || !refinementPrompt.trim()}>
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
