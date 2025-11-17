'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, CheckCircle, XCircle, Activity } from 'lucide-react';

export default function AdminPanel() {
  const [collectionStatus, setCollectionStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [validationStatus, setValidationStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [learningStatus, setLearningStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  
  const [collectionResult, setCollectionResult] = useState<string>('');
  const [processingResult, setProcessingResult] = useState<string>('');
  const [validationResult, setValidationResult] = useState<string>('');
  const [learningResult, setLearningResult] = useState<string>('');

  const triggerDataCollection = async () => {
    setCollectionStatus('running');
    setCollectionResult('');
    
    try {
      const response = await fetch('/api/trigger-collection', { method: 'POST' });
      const data = await response.json();
      
      if (data.success) {
        setCollectionStatus('success');
        setCollectionResult(`Collected ${data.items_collected || 0} items from ${data.sources_scraped || 0} sources`);
      } else {
        setCollectionStatus('error');
        setCollectionResult(data.message || 'Collection failed');
      }
    } catch (error) {
      setCollectionStatus('error');
      setCollectionResult(String(error));
    }
  };

  const triggerProcessing = async () => {
    setProcessingStatus('running');
    setProcessingResult('');
    
    try {
      const response = await fetch('/api/process', { method: 'POST' });
      const data = await response.json();
      
      if (data.success) {
        setProcessingStatus('success');
        setProcessingResult(`Processed ${data.raw_data_processed || 0} items, generated ${data.signals_generated || 0} signals (${data.high_confidence_signals || 0} high-confidence)`);
      } else {
        setProcessingStatus('error');
        setProcessingResult(data.error || 'Processing failed');
      }
    } catch (error) {
      setProcessingStatus('error');
      setProcessingResult(String(error));
    }
  };

  const triggerValidation = async () => {
    setValidationStatus('running');
    setValidationResult('');
    
    try {
      const response = await fetch('/api/validate-signals', { method: 'POST' });
      const data = await response.json();
      
      if (data.success) {
        setValidationStatus('success');
        setValidationResult(`Validated ${data.signals_validated || 0} signals: ${data.true_positives || 0} TP, ${data.false_positives || 0} FP, ${data.pending || 0} pending`);
      } else {
        setValidationStatus('error');
        setValidationResult(data.error || 'Validation failed');
      }
    } catch (error) {
      setValidationStatus('error');
      setValidationResult(String(error));
    }
  };

  const triggerLearning = async () => {
    setLearningStatus('running');
    setLearningResult('');
    
    try {
      const response = await fetch('/api/weekly-learning', { method: 'POST' });
      const data = await response.json();
      
      if (data.success) {
        setLearningStatus('success');
        setLearningResult(`Learning completed: Accuracy ${(data.overall_accuracy * 100).toFixed(1)}%, ${data.sources_updated || 0} sources updated`);
      } else {
        setLearningStatus('error');
        setLearningResult(data.error || 'Learning failed');
      }
    } catch (error) {
      setLearningStatus('error');
      setLearningResult(String(error));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Control Panel</h1>
          <p className="text-muted-foreground mt-2">Manually trigger system components for testing</p>
        </div>

        {/* Data Collection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(collectionStatus)}
              Data Collection
            </CardTitle>
            <CardDescription>
              Manually trigger data collection from all sources (RSS, Reddit, YouTube, etc.)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={triggerDataCollection} 
              disabled={collectionStatus === 'running'}
              className="w-full"
            >
              {collectionStatus === 'running' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Collecting Data...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Trigger Collection
                </>
              )}
            </Button>
            {collectionResult && (
              <div className={`p-3 rounded-md text-sm ${
                collectionStatus === 'success' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
              }`}>
                {collectionResult}
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Processing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(processingStatus)}
              AI Processing Pipeline
            </CardTitle>
            <CardDescription>
              Run the multi-agent AI pipeline (Collector → Analyst → Oracle)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={triggerProcessing} 
              disabled={processingStatus === 'running'}
              className="w-full"
            >
              {processingStatus === 'running' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Trigger Processing
                </>
              )}
            </Button>
            {processingResult && (
              <div className={`p-3 rounded-md text-sm ${
                processingStatus === 'success' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
              }`}>
                {processingResult}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Signal Validation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(validationStatus)}
              Signal Validation
            </CardTitle>
            <CardDescription>
              Validate pending signals against actual market movements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={triggerValidation} 
              disabled={validationStatus === 'running'}
              className="w-full"
            >
              {validationStatus === 'running' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Trigger Validation
                </>
              )}
            </Button>
            {validationResult && (
              <div className={`p-3 rounded-md text-sm ${
                validationStatus === 'success' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
              }`}>
                {validationResult}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Learning System */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(learningStatus)}
              Learning System
            </CardTitle>
            <CardDescription>
              Run the meta-analysis and update source credibility weights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={triggerLearning} 
              disabled={learningStatus === 'running'}
              className="w-full"
            >
              {learningStatus === 'running' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Learning...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Trigger Learning
                </>
              )}
            </Button>
            {learningResult && (
              <div className={`p-3 rounded-md text-sm ${
                learningStatus === 'success' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
              }`}>
                {learningResult}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="border-blue-500/20">
          <CardHeader>
            <CardTitle>Testing Flow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>1. <strong>Trigger Collection</strong> first to gather data from sources</p>
            <p>2. <strong>Trigger Processing</strong> to analyze data and generate signals</p>
            <p>3. Wait a few hours, then <strong>Trigger Validation</strong> to check signal accuracy</p>
            <p>4. After accumulating signals, <strong>Trigger Learning</strong> to improve the system</p>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button variant="outline" asChild>
            <a href="/">Back to Dashboard</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
