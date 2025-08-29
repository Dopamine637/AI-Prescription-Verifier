import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Brain, FileText, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExtractedDrug {
  name: string;
  dosage?: string;
  frequency?: string;
  route?: string;
  duration?: string;
  confidence: number;
}

interface NLPResult {
  originalText: string;
  extractedDrugs: ExtractedDrug[];
  medicalEntities: string[];
  processingTime: number;
}

export function NLPAnalyzer() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<NLPResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Sample medical texts for demo
  const sampleTexts = [
    "Patient started on metformin 500mg twice daily with meals. Continue aspirin 81mg once daily for cardioprotection. Prescribe lisinopril 10mg daily for hypertension management.",
    "Discharge medications: Warfarin 5mg daily, INR target 2-3. Atorvastatin 40mg at bedtime. Metoprolol 25mg twice daily. Follow up in 1 week for INR check.",
    "Current regimen includes ibuprofen 400mg every 6 hours as needed for pain, omeprazole 20mg daily for GERD, and amlodipine 5mg once daily for BP control."
  ];

  // Mock NLP processing function
  const processText = async (text: string): Promise<NLPResult> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simple regex-based extraction (mock AI)
    const drugPatterns = [
      /(\b(?:metformin|warfarin|aspirin|lisinopril|atorvastatin|metoprolol|ibuprofen|omeprazole|amlodipine|acetaminophen|amoxicillin)\b)\s*(\d+\s*(?:mg|g|mcg))?\s*(?:(once|twice|three times|four times)\s*(?:daily|a day|per day)?|(daily|q\d+h|bid|tid|qid|prn))?/gi,
    ];

    const extractedDrugs: ExtractedDrug[] = [];
    const medicalEntities: string[] = [];

    // Extract drugs
    drugPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const drug: ExtractedDrug = {
          name: match[1].toLowerCase(),
          dosage: match[2] || undefined,
          frequency: match[3] || match[4] || undefined,
          confidence: Math.random() * 0.3 + 0.7 // Mock confidence 70-100%
        };

        // Avoid duplicates
        const exists = extractedDrugs.find(d => 
          d.name === drug.name && d.dosage === drug.dosage
        );
        
        if (!exists) {
          extractedDrugs.push(drug);
        }
      }
    });

    // Extract medical entities (mock)
    const entityPatterns = [
      /\b(hypertension|diabetes|GERD|cardioprotection|pain|BP control)\b/gi,
      /\b(INR|target|follow up|discharge)\b/gi
    ];

    entityPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        if (!medicalEntities.includes(match[1].toLowerCase())) {
          medicalEntities.push(match[1].toLowerCase());
        }
      }
    });

    return {
      originalText: text,
      extractedDrugs,
      medicalEntities,
      processingTime: 1.8 + Math.random() * 0.4 // Mock processing time
    };
  };

  const analyzeText = async () => {
    if (!inputText.trim()) {
      toast({
        title: "No Text Provided",
        description: "Please enter medical text to analyze",
        variant: "destructive"
      });
      return;
    }

    if (inputText.length < 10) {
      toast({
        title: "Text Too Short",
        description: "Please provide more detailed medical text for analysis",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const analysisResult = await processText(inputText);
      setResult(analysisResult);
      
      toast({
        title: "Analysis Complete",
        description: `Extracted ${analysisResult.extractedDrugs.length} medication(s) and ${analysisResult.medicalEntities.length} medical entities`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "An error occurred during text processing",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const loadSampleText = (index: number) => {
    setInputText(sampleTexts[index]);
    setResult(null);
  };

  const clearAll = () => {
    setInputText('');
    setResult(null);
  };

  const getConfidenceColor = (confidence: number): "success" | "warning" | "destructive" => {
    if (confidence >= 0.9) return 'success';
    if (confidence >= 0.7) return 'warning';
    return 'destructive';
  };

  const getConfidenceBadge = (confidence: number) => {
    const percentage = Math.round(confidence * 100);
    return (
      <Badge variant={getConfidenceColor(confidence)}>
        {percentage}% confidence
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI-Powered Medical Text Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="medical-text">Medical Text or Clinical Notes</Label>
            <Textarea
              id="medical-text"
              placeholder="Enter medical text, clinical notes, prescription information, or discharge summaries..."
              className="min-h-[120px] resize-none"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {inputText.length} characters • AI will extract drug names, dosages, frequencies, and medical entities
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={analyzeText}
              disabled={isProcessing}
              className="flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              {isProcessing ? "Processing..." : "Analyze with AI"}
            </Button>
            <Button variant="outline" onClick={clearAll}>
              Clear
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="text-sm font-medium">Sample Medical Texts</Label>
            <div className="grid grid-cols-1 gap-2">
              {sampleTexts.map((_, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => loadSampleText(index)}
                  className="justify-start text-left text-xs p-2 h-auto"
                >
                  <FileText className="w-3 h-3 mr-2 flex-shrink-0" />
                  Sample {index + 1}: {sampleTexts[index].substring(0, 80)}...
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {result && (
        <div className="space-y-4">
          {/* Processing Info */}
          <Alert className="border-l-4 border-l-success">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Analysis Complete</AlertTitle>
            <AlertDescription>
              Processed {result.originalText.length} characters in {result.processingTime.toFixed(1)} seconds. 
              Extracted {result.extractedDrugs.length} medication(s) and {result.medicalEntities.length} medical entities.
            </AlertDescription>
          </Alert>

          {/* Extracted Medications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Extracted Medications ({result.extractedDrugs.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {result.extractedDrugs.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No medications detected in the provided text
                </p>
              ) : (
                <div className="space-y-3">
                  {result.extractedDrugs.map((drug, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium capitalize">{drug.name}</h4>
                          {getConfidenceBadge(drug.confidence)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {drug.dosage && (
                            <span>Dosage: <strong>{drug.dosage}</strong></span>
                          )}
                          {drug.frequency && (
                            <span>Frequency: <strong>{drug.frequency}</strong></span>
                          )}
                          {drug.route && (
                            <span>Route: <strong>{drug.route}</strong></span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Medical Entities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Medical Entities ({result.medicalEntities.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {result.medicalEntities.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No medical entities detected
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {result.medicalEntities.map((entity, index) => (
                    <Badge key={index} variant="outline" className="capitalize">
                      {entity}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Alert className="border-l-4 border-l-warning">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>AI Analysis Disclaimer</AlertTitle>
            <AlertDescription>
              This AI-powered analysis is for informational purposes only and should not replace professional medical judgment. 
              Always verify extracted information with original medical records and consult healthcare professionals for 
              clinical decision-making. The accuracy of extraction may vary based on text complexity and formatting.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}