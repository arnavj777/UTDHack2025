import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Sparkles, TrendingUp, DollarSign, Users, Target, Download, Plus, Edit, Trash2 } from 'lucide-react';
import { marketSizingService } from '../services/strategyService';
import { MarketSizing } from '../types/MarketSizing';
import { ApiError } from '../services/api';
import { aiService } from '../services/aiService';
import { toast } from './ui/use-toast';

export function MarketSizingSimulator() {
  const navigate = useNavigate();
  const [marketSizings, setMarketSizings] = useState<MarketSizing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tam, setTam] = useState(250);
  const [sam, setSam] = useState(75);
  const [som, setSom] = useState(12);
  const [marketShare, setMarketShare] = useState([3]);
  const [avgRevenue, setAvgRevenue] = useState(120);
  const [gettingAnalysis, setGettingAnalysis] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  useEffect(() => {
    loadMarketSizings();
  }, []);

  const loadMarketSizings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await marketSizingService.list();
      setMarketSizings(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load market sizing analyses. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this market sizing analysis?')) return;
    try {
      await marketSizingService.delete(id);
      await loadMarketSizings();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to delete market sizing analysis. Please try again.');
      }
    }
  };

  const calculatedRevenue = (som * 1000000 * (marketShare[0] / 100) * avgRevenue) / 1000000;

  const handleGetMarketAnalysis = async () => {
    try {
      setGettingAnalysis(true);
      const response = await aiService.getMarketAnalysis('SaaS/Product Management Tools', 'Product managers, product teams, startups');
      const analysis = response.data || response;
      
      setAiAnalysis(analysis);
      setShowAIAnalysis(true);
      
      toast({
        title: "AI Market Analysis Generated",
        description: "View the full analysis in the dialog",
      });
    } catch (err: any) {
      console.error('Error getting market analysis:', err);
      const errorMessage = err instanceof ApiError ? err.message : (err.message || 'Failed to get market analysis. Please try again.');
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setGettingAnalysis(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="mb-2">Market Sizing Simulator</h1>
          <p className="text-slate-600">Calculate TAM, SAM, SOM and forecast revenue scenarios</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2" 
            type="button"
            onClick={handleGetMarketAnalysis}
            disabled={gettingAnalysis}
          >
            <Sparkles className="w-4 h-4" />
            {gettingAnalysis ? 'Analyzing...' : 'AI Market Analysis'}
          </Button>
          <Button className="gap-2" type="button" onClick={() => navigate('/workspace/market-sizing/create')}>
            <Plus className="w-4 h-4" />
            Add Market Sizing
          </Button>
        </div>
      </div>

      {/* Saved Analyses List */}
      {marketSizings.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4">Saved Market Sizing Analyses</h3>
          {loading ? (
            <p className="text-slate-600">Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="space-y-3">
              {marketSizings.map((ms) => (
                <div key={ms.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                  <div className="flex-1">
                    <h4 className="font-medium">{ms.title}</h4>
                    {ms.description && <p className="text-slate-600 text-sm mt-1">{ms.description}</p>}
                    <div className="flex gap-4 mt-2 text-sm text-slate-600">
                      {ms.tam && <span>TAM: ${ms.tam}B</span>}
                      {ms.sam && <span>SAM: ${ms.sam}B</span>}
                      {ms.som && <span>SOM: ${ms.som}B</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/workspace/market-sizing/edit/${ms.id}`)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(ms.id)}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Market Size */}
          <Card className="p-6">
            <h3 className="mb-6">Market Size Calculation</h3>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Total Addressable Market (TAM)</Label>
                  <span className="text-blue-600">${tam}B</span>
                </div>
                <Slider 
                  value={[tam]} 
                  onValueChange={(v) => setTam(v[0])}
                  min={0}
                  max={500}
                  step={5}
                  className="py-4"
                />
                <p className="text-slate-500">
                  Total revenue opportunity if you achieved 100% market share
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Serviceable Addressable Market (SAM)</Label>
                  <span className="text-purple-600">${sam}B</span>
                </div>
                <Slider 
                  value={[sam]} 
                  onValueChange={(v) => setSam(v[0])}
                  min={0}
                  max={tam}
                  step={5}
                  className="py-4"
                />
                <p className="text-slate-500">
                  Portion of TAM your product/service can serve
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Serviceable Obtainable Market (SOM)</Label>
                  <span className="text-green-600">${som}B</span>
                </div>
                <Slider 
                  value={[som]} 
                  onValueChange={(v) => setSom(v[0])}
                  min={0}
                  max={sam}
                  step={1}
                  className="py-4"
                />
                <p className="text-slate-500">
                  Realistic market share you can capture in near term
                </p>
              </div>
            </div>

            {/* Visual Representation */}
            <div className="mt-6 pt-6 border-t">
              <div className="relative h-64 flex items-end gap-4">
                <div className="flex-1 bg-blue-100 rounded-t-lg" style={{height: '100%'}}>
                  <div className="h-full flex items-center justify-center flex-col">
                    <div>TAM</div>
                    <div className="text-2xl">${tam}B</div>
                  </div>
                </div>
                <div className="flex-1 bg-purple-200 rounded-t-lg" style={{height: `${(sam/tam) * 100}%`}}>
                  <div className="h-full flex items-center justify-center flex-col">
                    <div>SAM</div>
                    <div className="text-2xl">${sam}B</div>
                  </div>
                </div>
                <div className="flex-1 bg-green-300 rounded-t-lg" style={{height: `${(som/tam) * 100}%`}}>
                  <div className="h-full flex items-center justify-center flex-col">
                    <div>SOM</div>
                    <div className="text-2xl">${som}B</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Revenue Forecast */}
          <Card className="p-6">
            <h3 className="mb-6">Revenue Forecast</h3>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="marketShare">Target Market Share (%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider 
                      value={marketShare} 
                      onValueChange={setMarketShare}
                      min={0.1}
                      max={10}
                      step={0.1}
                      className="flex-1"
                    />
                    <span className="w-16 text-right">{marketShare[0]}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avgRevenue">Avg Revenue per Customer ($)</Label>
                  <Input 
                    id="avgRevenue"
                    type="number"
                    value={avgRevenue}
                    onChange={(e) => setAvgRevenue(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 pt-4">
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="text-slate-600 mb-1">Potential Customers</div>
                  <div className="text-2xl">{((som * 1000000 * (marketShare[0] / 100)) / 1000).toFixed(0)}K</div>
                </Card>
                <Card className="p-4 bg-purple-50 border-purple-200">
                  <div className="text-slate-600 mb-1">Annual Revenue</div>
                  <div className="text-2xl">${calculatedRevenue.toFixed(1)}M</div>
                </Card>
                <Card className="p-4 bg-green-50 border-green-200">
                  <div className="text-slate-600 mb-1">Monthly Recurring</div>
                  <div className="text-2xl">${(calculatedRevenue / 12).toFixed(2)}M</div>
                </Card>
              </div>
            </div>
          </Card>

          {/* Scenarios */}
          <Card className="p-6">
            <h3 className="mb-4">Scenario Planning</h3>
            <Tabs defaultValue="conservative">
              <TabsList>
                <TabsTrigger value="conservative">Conservative</TabsTrigger>
                <TabsTrigger value="moderate">Moderate</TabsTrigger>
                <TabsTrigger value="aggressive">Aggressive</TabsTrigger>
              </TabsList>

              <TabsContent value="conservative" className="space-y-4 mt-4">
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-slate-600 mb-1">Year 1</div>
                    <div>$2.4M</div>
                  </div>
                  <div>
                    <div className="text-slate-600 mb-1">Year 2</div>
                    <div>$5.8M</div>
                  </div>
                  <div>
                    <div className="text-slate-600 mb-1">Year 3</div>
                    <div>$12.1M</div>
                  </div>
                  <div>
                    <div className="text-slate-600 mb-1">Year 4</div>
                    <div>$23.5M</div>
                  </div>
                </div>
                <p className="text-slate-500">Growth Rate: 85% YoY • Market Share: 0.5% → 2%</p>
              </TabsContent>

              <TabsContent value="moderate" className="space-y-4 mt-4">
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-slate-600 mb-1">Year 1</div>
                    <div>$4.3M</div>
                  </div>
                  <div>
                    <div className="text-slate-600 mb-1">Year 2</div>
                    <div>$11.2M</div>
                  </div>
                  <div>
                    <div className="text-slate-600 mb-1">Year 3</div>
                    <div>$26.8M</div>
                  </div>
                  <div>
                    <div className="text-slate-600 mb-1">Year 4</div>
                    <div>$54.7M</div>
                  </div>
                </div>
                <p className="text-slate-500">Growth Rate: 140% YoY • Market Share: 1% → 4.5%</p>
              </TabsContent>

              <TabsContent value="aggressive" className="space-y-4 mt-4">
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-slate-600 mb-1">Year 1</div>
                    <div>$8.1M</div>
                  </div>
                  <div>
                    <div className="text-slate-600 mb-1">Year 2</div>
                    <div>$24.5M</div>
                  </div>
                  <div>
                    <div className="text-slate-600 mb-1">Year 3</div>
                    <div>$67.3M</div>
                  </div>
                  <div>
                    <div className="text-slate-600 mb-1">Year 4</div>
                    <div>$156.2M</div>
                  </div>
                </div>
                <p className="text-slate-500">Growth Rate: 200% YoY • Market Share: 2% → 13%</p>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* AI Insights Panel */}
        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h4>AI Market Insights</h4>
            </div>
            <ul className="space-y-3">
              <li className="text-slate-700">
                Mobile banking TAM growing at 12.3% CAGR through 2028
              </li>
              <li className="text-slate-700">
                Your target demographic (25-40) represents 45% of digital banking users
              </li>
              <li className="text-slate-700">
                Competitors have 8-15% market share in this segment
              </li>
              <li className="text-slate-700">
                Recommended focus: Differentiate on AI features and personalization
              </li>
            </ul>
            <Button variant="outline" size="sm" className="w-full mt-4">
              View Full Analysis
            </Button>
          </Card>

          <Card className="p-6">
            <h4 className="mb-4">Key Assumptions</h4>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2" />
                <span>US mobile banking market size</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2" />
                <span>Target age group 25-40 years</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2" />
                <span>$120 average annual revenue per user</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2" />
                <span>3 year market capture timeline</span>
              </li>
            </ul>
            <Button variant="ghost" size="sm" className="w-full mt-4">
              Edit Assumptions
            </Button>
          </Card>

          <Card className="p-6">
            <h4 className="mb-4">Data Sources</h4>
            <ul className="space-y-2 text-slate-600">
              <li>• Statista Market Reports</li>
              <li>• CB Insights</li>
              <li>• Internal customer data</li>
              <li>• Competitor public filings</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* AI Market Analysis Dialog */}
      <Dialog open={showAIAnalysis} onOpenChange={setShowAIAnalysis}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              AI Market Analysis
            </DialogTitle>
            <DialogDescription>
              Comprehensive market sizing analysis with TAM, SAM, and SOM estimates
            </DialogDescription>
          </DialogHeader>
          
          {aiAnalysis && (
            <div className="space-y-6 py-4">
              {/* Market Sizing Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="text-sm text-slate-600 mb-1">TAM</div>
                  <div className="text-2xl font-bold">${aiAnalysis.tam}B</div>
                  <div className="text-xs text-slate-500 mt-1">Total Addressable Market</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-slate-600 mb-1">SAM</div>
                  <div className="text-2xl font-bold">${aiAnalysis.sam}B</div>
                  <div className="text-xs text-slate-500 mt-1">Serviceable Addressable Market</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-slate-600 mb-1">SOM</div>
                  <div className="text-2xl font-bold">${aiAnalysis.som}B</div>
                  <div className="text-xs text-slate-500 mt-1">Serviceable Obtainable Market</div>
                </Card>
              </div>

              {/* Growth Trends */}
              {aiAnalysis.growth_trends && (
                <div>
                  <h4 className="font-semibold mb-2">Growth Trends</h4>
                  <p className="text-slate-700">{aiAnalysis.growth_trends}</p>
                </div>
              )}

              {/* Market Segments */}
              {aiAnalysis.segments && aiAnalysis.segments.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Market Segments</h4>
                  <div className="space-y-2">
                    {aiAnalysis.segments.map((segment: any, index: number) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium">{segment.name}</h5>
                            <p className="text-sm text-slate-600">Size: {segment.size}</p>
                          </div>
                          <Badge variant={segment.growth === 'High' ? 'default' : segment.growth === 'Medium' ? 'secondary' : 'outline'}>
                            {segment.growth} Growth
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Competitive Landscape */}
              {aiAnalysis.competitive_landscape && (
                <div>
                  <h4 className="font-semibold mb-2">Competitive Landscape</h4>
                  <p className="text-slate-700">{aiAnalysis.competitive_landscape}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowAIAnalysis(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
