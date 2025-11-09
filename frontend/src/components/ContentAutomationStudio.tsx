import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Sparkles, Copy, Download, RefreshCw, FileText, Mail, Share2, Edit, Plus, Trash2 } from 'lucide-react';
import { contentAssetService } from '../services/gtmService';
import { ContentAsset } from '../types/ContentAsset';
import { ApiError } from '../services/api';
import { aiService } from '../services/aiService';
import { toast } from './ui/use-toast';

export function ContentAutomationStudio() {
  const navigate = useNavigate();
  const [contentAssets, setContentAssets] = useState<ContentAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generatingContent, setGeneratingContent] = useState(false);
  const [showAIContent, setShowAIContent] = useState(false);
  const [aiContent, setAiContent] = useState<any>(null);

  useEffect(() => {
    loadContentAssets();
  }, []);

  const loadContentAssets = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await contentAssetService.list();
      setContentAssets(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load content assets. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this content asset?')) return;
    try {
      await contentAssetService.delete(id);
      await loadContentAssets();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to delete content asset. Please try again.');
      }
    }
  };

  const handleGenerateContent = async () => {
    try {
      setGeneratingContent(true);
      const response = await aiService.generateContent('marketing content', 'Product feature');
      const content = response.data || response;
      
      setAiContent(content);
      setShowAIContent(true);
      
      toast({
        title: "AI Content Generated",
        description: "View the full content in the dialog",
      });
    } catch (err: any) {
      console.error('Error generating content:', err);
      const errorMessage = err instanceof ApiError ? err.message : (err.message || 'Failed to generate content. Please try again.');
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setGeneratingContent(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="mb-2">Content Automation Studio</h1>
          <p className="text-slate-600">AI-generated content for your product launch</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export All
          </Button>
          <Button className="gap-2" onClick={() => navigate('/workspace/content-automation/create')}>
            <Plus className="w-4 h-4" />
            Add Content Asset
          </Button>
        </div>
      </div>

      {/* Saved Content Assets */}
      {contentAssets.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4">Saved Content Assets</h3>
          {loading ? (
            <p className="text-slate-600">Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="space-y-3">
              {contentAssets.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                  <div className="flex-1">
                    <h4 className="font-medium">{asset.title}</h4>
                    {asset.description && <p className="text-slate-600 text-sm mt-1">{asset.description}</p>}
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{asset.content_type || 'release-notes'}</Badge>
                      <Badge variant="outline">{asset.status || 'draft'}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/workspace/content-automation/edit/${asset.id}`)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(asset.id)}>
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

      {/* Quick Generate */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="mb-3">Quick Generate</h4>
            <p className="text-slate-700 mb-4">
              Tell me about your feature and I'll generate all launch content for you
            </p>
            <Textarea 
              placeholder="e.g., We're launching biometric authentication (Face ID and fingerprint) to make login faster and more secure..."
              className="mb-3"
            />
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                type="button"
                onClick={handleGenerateContent}
                disabled={generatingContent}
              >
                {generatingContent ? 'Generating...' : 'Generate All Content'}
              </Button>
              <Select defaultValue="professional">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional Tone</SelectItem>
                  <SelectItem value="casual">Casual Tone</SelectItem>
                  <SelectItem value="technical">Technical Tone</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic Tone</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="release-notes" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="release-notes">Release Notes</TabsTrigger>
          <TabsTrigger value="sales-deck">Sales Deck</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="blog">Blog Post</TabsTrigger>
        </TabsList>

        {/* Release Notes */}
        <TabsContent value="release-notes">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3>Release Notes</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Regenerate
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Copy className="w-4 h-4" />
                      Copy
                    </Button>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <div className="bg-slate-50 rounded-lg p-6">
                    <h2 className="mb-4">Version 2.5.0 - January 15, 2026</h2>
                    
                    <h3 className="text-blue-600 mb-3">🎉 New Features</h3>
                    <ul className="space-y-2 mb-6">
                      <li>
                        <strong>Biometric Authentication:</strong> Login instantly with Face ID or fingerprint. 
                        Say goodbye to passwords and enjoy secure, seamless access to your account.
                      </li>
                      <li>
                        <strong>Dark Mode:</strong> Easy on the eyes, especially at night. Toggle between 
                        light and dark themes in Settings.
                      </li>
                      <li>
                        <strong>Enhanced Security:</strong> Additional layer of protection for transactions 
                        over $500 with automatic re-authentication.
                      </li>
                    </ul>

                    <h3 className="text-green-600 mb-3">✨ Improvements</h3>
                    <ul className="space-y-2 mb-6">
                      <li>Faster app loading times (40% improvement)</li>
                      <li>Improved accessibility with better screen reader support</li>
                      <li>Redesigned settings page for easier navigation</li>
                    </ul>

                    <h3 className="text-orange-600 mb-3">🔧 Bug Fixes</h3>
                    <ul className="space-y-2">
                      <li>Fixed issue with transaction history not loading on slower connections</li>
                      <li>Resolved crash when splitting bills with more than 5 people</li>
                      <li>Corrected timezone display for scheduled transfers</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <Card className="p-6">
                <h4 className="mb-4">Options</h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label>Length</label>
                    <Select defaultValue="standard">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brief">Brief</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label>Include</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked />
                        <span>Known Issues</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked />
                        <span>Screenshots</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" />
                        <span>Technical Details</span>
                      </label>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    Customize
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Sales Deck */}
        <TabsContent value="sales-deck">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3>Sales Deck Outline</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Generate Slides</Button>
                <Button variant="outline" size="sm">Export to PPTX</Button>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { slide: 1, title: 'Cover: Introducing Biometric Authentication', notes: 'Bold hero image, company logo' },
                { slide: 2, title: 'The Problem: Password Fatigue', notes: '67% of users prefer biometric auth (stat)' },
                { slide: 3, title: 'Our Solution: Face ID & Fingerprint', notes: 'Demo screenshots, key benefits' },
                { slide: 4, title: 'How It Works', notes: '3-step visual flow diagram' },
                { slide: 5, title: 'Security & Compliance', notes: 'Bank-level encryption, SOC 2 certified' },
                { slide: 6, title: 'Customer Benefits', notes: '70% faster login, 95% success rate' },
                { slide: 7, title: 'Pricing & Availability', notes: 'Available to all users, free feature' },
                { slide: 8, title: 'Call to Action', notes: 'Enable biometric auth today' }
              ].map((slide, index) => (
                <Card key={index} className="p-4 hover:border-blue-300 cursor-pointer transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">Slide {slide.slide}</Badge>
                        <h4>{slide.title}</h4>
                      </div>
                      <p className="text-slate-600">{slide.notes}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Email Templates */}
        <TabsContent value="email">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4>Customer Announcement Email</h4>
                <Button variant="outline" size="sm" className="gap-2">
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
              </div>

              <div className="bg-slate-50 rounded-lg p-6 space-y-4">
                <div>
                  <div className="text-slate-600 mb-2">Subject Line:</div>
                  <div className="p-3 bg-white rounded border">
                    🎉 Login Just Got Faster: Biometric Auth is Here!
                  </div>
                </div>

                <div>
                  <div className="text-slate-600 mb-2">Preview Text:</div>
                  <div className="p-3 bg-white rounded border">
                    Face ID & fingerprint login now available. No more passwords!
                  </div>
                </div>

                <div>
                  <div className="text-slate-600 mb-2">Body:</div>
                  <div className="p-4 bg-white rounded border space-y-3 text-slate-700">
                    <p>Hi [First Name],</p>
                    <p>
                      Great news! We've just launched biometric authentication, making it faster 
                      and more secure than ever to access your account.
                    </p>
                    <p><strong>What's new:</strong></p>
                    <ul className="list-disc ml-6 space-y-1">
                      <li>Login with Face ID or fingerprint</li>
                      <li>70% faster than typing passwords</li>
                      <li>Bank-level security you can trust</li>
                    </ul>
                    <p>
                      Enable biometric auth in Settings → Security in just 30 seconds.
                    </p>
                    <div className="p-3 bg-blue-600 text-white text-center rounded">
                      [Enable Biometric Auth]
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4>Sales Team Email</h4>
                <Button variant="outline" size="sm" className="gap-2">
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
              </div>

              <div className="bg-slate-50 rounded-lg p-6">
                <div className="p-4 bg-white rounded border space-y-3 text-slate-700">
                  <p><strong>Subject:</strong> New Feature Alert: Biometric Authentication</p>
                  <p>Team,</p>
                  <p>
                    We're launching biometric authentication on January 15th. Here's what you need to know:
                  </p>
                  <p><strong>Key Selling Points:</strong></p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>70% faster login experience</li>
                    <li>Addresses #1 customer complaint (password resets)</li>
                    <li>Matches features of Chime, Cash App competitors</li>
                    <li>No additional cost to customers</li>
                  </ul>
                  <p><strong>Sales Enablement:</strong></p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Demo video: [link]</li>
                    <li>Sales deck: [link]</li>
                    <li>FAQ sheet: [link]</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Social Media */}
        <TabsContent value="social">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                platform: 'Twitter/X',
                post: '🎉 Say goodbye to passwords! Biometric authentication is now live. Login with Face ID or your fingerprint in seconds. \n\n✨ 70% faster\n🔒 Bank-level secure\n💯 Free for all users\n\nEnable it now in Settings → Security',
                hashtags: '#Fintech #Biometric #MobileBanking',
                chars: '240/280'
              },
              {
                platform: 'LinkedIn',
                post: "We're excited to announce the launch of biometric authentication for our mobile banking app! \n\nThis feature addresses one of the biggest pain points our customers face: password fatigue. With Face ID and fingerprint support, users can now access their accounts 70% faster while enjoying enterprise-grade security.\n\nKey benefits:\n• Seamless user experience\n• Reduced password reset requests by 60%\n• Industry-standard security compliance\n• Zero additional cost to users\n\nAvailable now on iOS and Android.",
                hashtags: '#ProductLaunch #Fintech #Innovation',
                chars: '450/3000'
              },
              {
                platform: 'Instagram',
                post: '✨ Login just got a major upgrade!\n\nIntroducing biometric authentication:\n→ Face ID on iOS\n→ Fingerprint on Android\n→ 70% faster login\n→ No more password resets\n\nSwipe to see how easy it is 👉\n\n[Image carousel: 1. Hero shot, 2. Demo, 3. Settings screen]',
                hashtags: '#Banking #TechUpdate #AppFeature',
                chars: '280/2200'
              },
              {
                platform: 'Facebook',
                post: "Big news! 🎉\n\nWe've just launched biometric authentication to make banking even easier and more secure.\n\nNow you can:\n✓ Login with your face or fingerprint\n✓ Skip the password every time\n✓ Enjoy faster, safer access to your money\n\nIt's free, it's secure, and it's ready for you to enable right now.\n\nTap the link to learn more and get started! 👇",
                hashtags: '',
                chars: '350/63,206'
              }
            ].map((social, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    <h4>{social.platform}</h4>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 mb-3">
                  <div className="whitespace-pre-line text-slate-700 mb-3">{social.post}</div>
                  {social.hashtags && (
                    <div className="text-blue-600">{social.hashtags}</div>
                  )}
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>{social.chars} characters</span>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Blog Post */}
        <TabsContent value="blog">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3>Blog Post Draft</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Save Draft</Button>
                <Button variant="outline" size="sm">Preview</Button>
                <Button variant="outline" size="sm">Export to CMS</Button>
              </div>
            </div>

            <div className="prose max-w-none bg-slate-50 rounded-lg p-8">
              <h1>The Future of Secure Banking: Introducing Biometric Authentication</h1>
              
              <p className="text-slate-500">
                By Product Team • January 15, 2026 • 5 min read
              </p>

              <p>
                We're excited to announce that biometric authentication is now available for all users. 
                This feature represents a significant leap forward in both security and user experience.
              </p>

              <h2>Why We Built This</h2>
              <p>
                Over the past year, we've heard from thousands of customers about the challenges of 
                password-based authentication. Our data showed that 42% of login attempts failed due to 
                incorrect passwords, and password reset requests were our #1 support issue.
              </p>

              <p>
                We knew we had to do better.
              </p>

              <h2>What's New</h2>
              <p>
                Starting today, you can use Face ID on iOS or fingerprint authentication on Android to 
                access your account instantly. No more typing passwords, no more resets, no more friction.
              </p>

              <h2>The Benefits</h2>
              <ul>
                <li><strong>70% faster login:</strong> Average login time drops from 7 seconds to just 2 seconds</li>
                <li><strong>95% success rate:</strong> Biometric auth succeeds on first attempt 95% of the time</li>
                <li><strong>Bank-level security:</strong> Your biometric data never leaves your device</li>
              </ul>

              <h2>How to Enable It</h2>
              <p>
                Getting started is simple:
              </p>
              <ol>
                <li>Open the app and go to Settings</li>
                <li>Tap on Security</li>
                <li>Enable "Biometric Authentication"</li>
                <li>Follow the prompts to set it up (takes less than 30 seconds)</li>
              </ol>

              <h2>Looking Ahead</h2>
              <p>
                This is just the beginning. We're already working on additional security features and 
                improvements based on your feedback. Stay tuned for more updates!
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
                <p className="mb-0">
                  <strong>Ready to try it?</strong> Enable biometric authentication in your app settings today.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Content Generation Dialog */}
      <Dialog open={showAIContent} onOpenChange={setShowAIContent}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              AI-Generated Content
            </DialogTitle>
            <DialogDescription>
              AI-powered marketing content for your product
            </DialogDescription>
          </DialogHeader>
          
          {aiContent && (
            <div className="space-y-6 py-4">
              {aiContent.title && (
                <div>
                  <h4 className="font-semibold mb-2">Title</h4>
                  <p className="text-slate-700">{aiContent.title}</p>
                </div>
              )}

              {aiContent.body && (
                <div>
                  <h4 className="font-semibold mb-2">Content</h4>
                  <p className="text-slate-700 whitespace-pre-wrap">{aiContent.body}</p>
                </div>
              )}

              {aiContent.social_media_posts && (
                <div>
                  <h4 className="font-semibold mb-2">Social Media Posts</h4>
                  {Array.isArray(aiContent.social_media_posts) ? (
                    <div className="space-y-2">
                      {aiContent.social_media_posts.map((post: any, index: number) => (
                        <Card key={index} className="p-3">
                          {typeof post === 'string' ? (
                            <p className="text-slate-700">{post}</p>
                          ) : (
                            <>
                              {post.platform && <Badge variant="outline" className="mb-2">{post.platform}</Badge>}
                              {post.content && <p className="text-slate-700">{post.content}</p>}
                            </>
                          )}
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-700">{aiContent.social_media_posts}</p>
                  )}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowAIContent(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
