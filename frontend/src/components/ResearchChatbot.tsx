import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Sparkles, Loader2, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { geminiChatService } from '../services/researchService';
import { ApiError } from '../services/api';
import { SentimentTrendCard } from './SentimentTrendCard';

export function ResearchChatbot() {
  const [images, setImages] = useState<string[]>([]); // Base64 encoded images
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [prompt, setPrompt] = useState('');
  const [responseText, setResponseText] = useState('');
  const [overallScore, setOverallScore] = useState<number | undefined>();
  const [sentimentScore, setSentimentScore] = useState<number | undefined>();
  const [trendScore, setTrendScore] = useState<number | undefined>();
  const [keywords, setKeywords] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle paste events for images
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          e.preventDefault();
          const blob = item.getAsFile();
          if (blob) {
            handleImageFile(blob);
          }
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, []);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB');
      return;
    }

    try {
      const base64 = await convertFileToBase64(file);
      setImages(prev => [...prev, base64]);
      setError('');
    } catch (err) {
      setError('Failed to process image');
      console.error('Error processing image:', err);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      handleImageFile(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (images.length === 0 || isLoading) return;

    setIsLoading(true);
    setError('');
    
    // Store images temporarily for the API call
    const imagesToAnalyze = [...images];

    try {
      // Send images to API for analysis
      const response = await geminiChatService.sendMessage(
        'Analyze this product image and provide detailed feature explanations.', 
        [],
        imagesToAnalyze
      );

      // Update scores from response - backend always returns scores now
      console.log('Analysis complete:', {
        overall_score: response.overall_score,
        sentiment_score: response.sentiment_score,
        trend_score: response.trend_score,
        keywords: response.keywords
      });
      
      // Always update scores (backend guarantees they exist)
      setOverallScore(response.overall_score ?? 50.0);
      setSentimentScore(response.sentiment_score ?? 50.0);
      setTrendScore(response.trend_score ?? 50.0);
      setKeywords(response.keywords || []);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to analyze image. Please try again.');
      }
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setError('');
    setImages([]);
    setPrompt('');
    setResponseText('');
    setOverallScore(undefined);
    setSentimentScore(undefined);
    setTrendScore(undefined);
    setKeywords([]);
  };

  const handleAsk = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError('');
    setResponseText('');

    try {
      const response = await geminiChatService.sendMessage(prompt, [], images);

      // Update response text and scores
      setResponseText(response.message || '');
      setOverallScore(response.overall_score ?? 50.0);
      setSentimentScore(response.sentiment_score ?? 50.0);
      setTrendScore(response.trend_score ?? 50.0);
      setKeywords(response.keywords || []);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to get response. Please try again.');
      }
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Product Analysis</h1>
          <p className="text-slate-600">
            Upload or paste product images to get instant sentiment and trend analysis scores.
          </p>
        </div>
        <Button variant="outline" onClick={handleClear} className="gap-2">
          <Trash2 className="w-4 h-4" />
          Clear Analysis
        </Button>
      </div>

      {/* Sentiment Trend Card */}
      <SentimentTrendCard
        overallScore={overallScore}
        sentimentScore={sentimentScore}
        trendScore={trendScore}
        keywords={keywords}
        isLoading={isLoading}
      />

      {/* Text Prompt */}
      <Card className="flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>Ask the Research Assistant</CardTitle>
              <CardDescription>
                Enter a question or prompt about your research. You can also attach images.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col p-6 gap-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask anything about your research… e.g., 'Summarize key themes in recent user interviews about onboarding.'"
            className="min-h-28"
          />
          <div className="flex gap-3 justify-end">
            <Button onClick={handleAsk} disabled={isLoading || !prompt.trim()} className="px-6">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Thinking...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Ask
                </>
              )}
            </Button>
          </div>
          {responseText && (
            <div className="whitespace-pre-wrap text-sm bg-slate-50 border rounded-md p-4">
              {responseText}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Upload Interface */}
      <Card className="flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>Upload Product Image</CardTitle>
              <CardDescription>
                Upload or paste an image to analyze sentiment and trends
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col p-6">
          {/* Image Preview Area */}
          {images.length > 0 && (
            <div className="mb-4 p-4 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
              <div className="flex flex-wrap gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Uploaded image ${index + 1}`}
                      className="max-w-full max-h-64 object-contain rounded-md border border-slate-200 bg-white p-2"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {images.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
              <ImageIcon className="w-12 h-12 text-slate-400 mb-4" />
              <p className="text-slate-600 mb-2">No image uploaded</p>
              <p className="text-sm text-slate-500">Upload or paste an image to get started</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
              <p className="text-slate-600">Analyzing image and calculating scores...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 mb-4">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div ref={messagesEndRef} />

          {/* Input Area */}
          <div className="border-t pt-4 mt-4">
            <div className="flex gap-3">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
                accept="image/*"
                multiple
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="flex-1"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
              <Button
                onClick={handleAnalyze}
                disabled={(images.length === 0) || isLoading}
                size="lg"
                className="px-8"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-3 text-center">
              Paste an image (Ctrl+V) or upload a file to analyze
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
