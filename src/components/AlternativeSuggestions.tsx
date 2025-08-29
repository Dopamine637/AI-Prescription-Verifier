import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Search, ArrowRight, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Alternative {
  name: string;
  mechanismOfAction: string;
  efficacy: 'equivalent' | 'similar' | 'lower';
  sideEffects: string[];
  contraindications: string[];
  advantages: string[];
  costComparison: 'lower' | 'similar' | 'higher';
}

interface AlternativeResult {
  originalDrug: string;
  reason: string;
  alternatives: Alternative[];
}

export function AlternativeSuggestions() {
  const [searchData, setSearchData] = useState({
    drugName: '',
    reason: '',
    patientAge: '',
    conditions: ''
  });
  const [results, setResults] = useState<AlternativeResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  // Mock alternatives database
  const alternativesDatabase: Record<string, Alternative[]> = {
    'warfarin': [
      {
        name: 'Rivaroxaban (Xarelto)',
        mechanismOfAction: 'Direct Factor Xa inhibitor',
        efficacy: 'equivalent',
        sideEffects: ['Bleeding', 'Nausea', 'Dizziness'],
        contraindications: ['Active bleeding', 'Severe renal impairment'],
        advantages: ['No routine monitoring required', 'Fewer drug interactions'],
        costComparison: 'higher'
      },
      {
        name: 'Dabigatran (Pradaxa)',
        mechanismOfAction: 'Direct thrombin inhibitor',
        efficacy: 'equivalent',
        sideEffects: ['Bleeding', 'Dyspepsia', 'Abdominal pain'],
        contraindications: ['Mechanical heart valves', 'Severe renal impairment'],
        advantages: ['Predictable anticoagulation', 'Reversible with idarucizumab'],
        costComparison: 'higher'
      }
    ],
    'ibuprofen': [
      {
        name: 'Acetaminophen (Tylenol)',
        mechanismOfAction: 'Central COX inhibition',
        efficacy: 'similar',
        sideEffects: ['Hepatotoxicity (rare)', 'Minimal GI effects'],
        contraindications: ['Severe liver disease'],
        advantages: ['Lower GI bleeding risk', 'Safe in kidney disease'],
        costComparison: 'lower'
      },
      {
        name: 'Topical Diclofenac',
        mechanismOfAction: 'Topical NSAID',
        efficacy: 'similar',
        sideEffects: ['Local skin irritation', 'Minimal systemic effects'],
        contraindications: ['Open wounds at application site'],
        advantages: ['Reduced systemic side effects', 'Lower drug interactions'],
        costComparison: 'higher'
      }
    ],
    'metformin': [
      {
        name: 'Sitagliptin (Januvia)',
        mechanismOfAction: 'DPP-4 inhibitor',
        efficacy: 'similar',
        sideEffects: ['Upper respiratory infections', 'Headache'],
        contraindications: ['Type 1 diabetes', 'Diabetic ketoacidosis'],
        advantages: ['Weight neutral', 'Low hypoglycemia risk'],
        costComparison: 'higher'
      },
      {
        name: 'Empagliflozin (Jardiance)',
        mechanismOfAction: 'SGLT2 inhibitor',
        efficacy: 'equivalent',
        sideEffects: ['UTIs', 'Genital infections', 'Dehydration'],
        contraindications: ['Severe renal impairment', 'Type 1 diabetes'],
        advantages: ['Cardiovascular benefits', 'Weight loss'],
        costComparison: 'higher'
      }
    ]
  };

  const searchAlternatives = async () => {
    const drugName = searchData.drugName.toLowerCase();
    
    if (!drugName || !searchData.reason) {
      toast({
        title: "Missing Information",
        description: "Please enter both drug name and reason for seeking alternatives",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const alternatives = alternativesDatabase[drugName];
    
    if (!alternatives) {
      setResults({
        originalDrug: searchData.drugName,
        reason: searchData.reason,
        alternatives: []
      });
      
      toast({
        title: "No Alternatives Found",
        description: "Alternative suggestions not available for this medication",
        variant: "destructive"
      });
    } else {
      setResults({
        originalDrug: searchData.drugName,
        reason: searchData.reason,
        alternatives
      });
      
      toast({
        title: "Alternatives Found",
        description: `${alternatives.length} alternative medication(s) suggested`,
      });
    }

    setIsSearching(false);
  };

  const getEfficacyBadge = (efficacy: string) => {
    switch (efficacy) {
      case 'equivalent': return <Badge variant="success">Equivalent Efficacy</Badge>;
      case 'similar': return <Badge variant="secondary">Similar Efficacy</Badge>;
      case 'lower': return <Badge variant="warning">Lower Efficacy</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getCostBadge = (cost: string) => {
    switch (cost) {
      case 'lower': return <Badge variant="success">Lower Cost</Badge>;
      case 'similar': return <Badge variant="secondary">Similar Cost</Badge>;
      case 'higher': return <Badge variant="warning">Higher Cost</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const resetSearch = () => {
    setSearchData({ drugName: '', reason: '', patientAge: '', conditions: '' });
    setResults(null);
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Find Alternative Medications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="drug-search">Current Medication</Label>
              <Select 
                value={searchData.drugName} 
                onValueChange={(value) => setSearchData(prev => ({ ...prev, drugName: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select medication" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warfarin">Warfarin</SelectItem>
                  <SelectItem value="ibuprofen">Ibuprofen</SelectItem>
                  <SelectItem value="metformin">Metformin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Alternative</Label>
              <Select 
                value={searchData.reason} 
                onValueChange={(value) => setSearchData(prev => ({ ...prev, reason: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="drug-interaction">Drug Interaction</SelectItem>
                  <SelectItem value="side-effects">Side Effects</SelectItem>
                  <SelectItem value="contraindication">Contraindication</SelectItem>
                  <SelectItem value="cost">Cost Concerns</SelectItem>
                  <SelectItem value="efficacy">Efficacy Issues</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient-age">Patient Age (Optional)</Label>
              <Input
                id="patient-age"
                type="number"
                placeholder="e.g., 65"
                value={searchData.patientAge}
                onChange={(e) => setSearchData(prev => ({ ...prev, patientAge: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="conditions">Comorbidities (Optional)</Label>
              <Input
                id="conditions"
                placeholder="e.g., Diabetes, Hypertension"
                value={searchData.conditions}
                onChange={(e) => setSearchData(prev => ({ ...prev, conditions: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={searchAlternatives}
              disabled={isSearching}
              className="flex-1"
            >
              <Search className="w-4 h-4 mr-2" />
              {isSearching ? "Searching..." : "Find Alternatives"}
            </Button>
            <Button variant="outline" onClick={resetSearch}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results && (
        <div className="space-y-4">
          {results.alternatives.length === 0 ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>No Alternatives Available</AlertTitle>
              <AlertDescription>
                No alternative medications are available in our database for {results.originalDrug}. 
                Please consult with a healthcare professional for personalized recommendations.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="flex items-center gap-2 text-lg font-medium">
                <span className="capitalize">{results.originalDrug}</span>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
                <span>Alternative Options</span>
                <Badge variant="outline">{results.alternatives.length} Found</Badge>
              </div>

              <div className="grid gap-4">
                {results.alternatives.map((alternative, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-xl">{alternative.name}</CardTitle>
                        <div className="flex gap-2">
                          {getEfficacyBadge(alternative.efficacy)}
                          {getCostBadge(alternative.costComparison)}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {alternative.mechanismOfAction}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-success mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Advantages
                          </h4>
                          <ul className="text-sm space-y-1">
                            {alternative.advantages.map((advantage, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-success">•</span>
                                {advantage}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-warning mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Side Effects
                          </h4>
                          <ul className="text-sm space-y-1">
                            {alternative.sideEffects.map((effect, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-warning">•</span>
                                {effect}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium text-destructive mb-2">Contraindications</h4>
                        <ul className="text-sm space-y-1">
                          {alternative.contraindications.map((contraindication, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-destructive">•</span>
                              {contraindication}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          <Alert className="border-l-4 border-l-primary">
            <Info className="h-4 w-4" />
            <AlertTitle>Important Notice</AlertTitle>
            <AlertDescription>
              These suggestions are for informational purposes only. Any medication changes should 
              be discussed with and approved by a qualified healthcare professional. Consider patient-specific 
              factors including allergies, kidney function, drug interactions, and individual response to therapy.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}