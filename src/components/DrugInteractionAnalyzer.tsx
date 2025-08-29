import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Drug {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
}

interface Interaction {
  drug1: string;
  drug2: string;
  severity: 'low' | 'moderate' | 'high' | 'severe';
  description: string;
  recommendation: string;
}

export function DrugInteractionAnalyzer() {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [newDrug, setNewDrug] = useState({ name: '', dosage: '', frequency: '' });
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  // Mock drug interaction database
  const mockInteractions = [
    {
      drugs: ['warfarin', 'aspirin'],
      severity: 'high' as const,
      description: 'Increased risk of bleeding when used together',
      recommendation: 'Monitor INR levels closely and consider alternative anticoagulation'
    },
    {
      drugs: ['lisinopril', 'potassium'],
      severity: 'moderate' as const,
      description: 'May cause hyperkalemia (elevated potassium levels)',
      recommendation: 'Monitor serum potassium levels regularly'
    },
    {
      drugs: ['metformin', 'iodine'],
      severity: 'moderate' as const,
      description: 'Contrast agents may increase risk of lactic acidosis',
      recommendation: 'Temporarily discontinue metformin before procedures with contrast'
    }
  ];

  const addDrug = () => {
    if (!newDrug.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a drug name",
        variant: "destructive"
      });
      return;
    }

    const drug: Drug = {
      id: Date.now().toString(),
      name: newDrug.name.trim().toLowerCase(),
      dosage: newDrug.dosage,
      frequency: newDrug.frequency
    };

    setDrugs(prev => [...prev, drug]);
    setNewDrug({ name: '', dosage: '', frequency: '' });
    
    toast({
      title: "Drug Added",
      description: `${drug.name} has been added to the analysis`,
    });
  };

  const removeDrug = (id: string) => {
    setDrugs(prev => prev.filter(drug => drug.id !== id));
    setInteractions([]);
  };

  const analyzeInteractions = async () => {
    if (drugs.length < 2) {
      toast({
        title: "Insufficient Data",
        description: "Please add at least 2 drugs to analyze interactions",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const foundInteractions: Interaction[] = [];

    // Check all drug pairs
    for (let i = 0; i < drugs.length; i++) {
      for (let j = i + 1; j < drugs.length; j++) {
        const drug1 = drugs[i].name.toLowerCase();
        const drug2 = drugs[j].name.toLowerCase();

        // Find matching interactions in mock database
        const interaction = mockInteractions.find(mock => 
          (mock.drugs.includes(drug1) && mock.drugs.includes(drug2))
        );

        if (interaction) {
          foundInteractions.push({
            drug1: drugs[i].name,
            drug2: drugs[j].name,
            severity: interaction.severity,
            description: interaction.description,
            recommendation: interaction.recommendation
          });
        }
      }
    }

    setInteractions(foundInteractions);
    setIsAnalyzing(false);

    if (foundInteractions.length === 0) {
      toast({
        title: "Analysis Complete",
        description: "No significant interactions detected between the entered medications",
      });
    } else {
      toast({
        title: "Interactions Found",
        description: `${foundInteractions.length} potential interaction(s) detected`,
        variant: "destructive"
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe': return 'destructive';
      case 'high': return 'destructive';
      case 'moderate': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'severe':
      case 'high':
        return <XCircle className="w-4 h-4" />;
      case 'moderate':
        return <AlertTriangle className="w-4 h-4" />;
      case 'low':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Drug Input Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-secondary/30 rounded-lg">
        <div>
          <Label htmlFor="drug-name">Drug Name</Label>
          <Input
            id="drug-name"
            placeholder="e.g., Aspirin"
            value={newDrug.name}
            onChange={(e) => setNewDrug(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="dosage">Dosage</Label>
          <Input
            id="dosage"
            placeholder="e.g., 100mg"
            value={newDrug.dosage}
            onChange={(e) => setNewDrug(prev => ({ ...prev, dosage: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="frequency">Frequency</Label>
          <Input
            id="frequency"
            placeholder="e.g., Daily"
            value={newDrug.frequency}
            onChange={(e) => setNewDrug(prev => ({ ...prev, frequency: e.target.value }))}
          />
        </div>
        <div className="flex items-end">
          <Button 
            onClick={addDrug} 
            className="w-full"
            variant="default"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Drug
          </Button>
        </div>
      </div>

      {/* Current Drugs List */}
      {drugs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Medications ({drugs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {drugs.map((drug) => (
                <div key={drug.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium capitalize">{drug.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {drug.dosage} {drug.frequency && `• ${drug.frequency}`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDrug(drug.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <Button 
              onClick={analyzeInteractions}
              disabled={isAnalyzing || drugs.length < 2}
              className="w-full"
              variant="default"
            >
              {isAnalyzing ? (
                "Analyzing Interactions..."
              ) : (
                "Analyze Drug Interactions"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {interactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-destructive">
              Interaction Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {interactions.map((interaction, index) => (
              <Alert key={index} className={`border-l-4 ${
                interaction.severity === 'severe' || interaction.severity === 'high' 
                  ? 'border-l-destructive' 
                  : interaction.severity === 'moderate' 
                  ? 'border-l-warning' 
                  : 'border-l-success'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(interaction.severity)}
                    <div>
                      <AlertTitle className="flex items-center gap-2 mb-1">
                        <span className="capitalize">{interaction.drug1}</span>
                        <span>+</span>
                        <span className="capitalize">{interaction.drug2}</span>
                        <Badge variant={getSeverityColor(interaction.severity) as "success" | "warning" | "destructive" | "secondary"}>
                          {interaction.severity.toUpperCase()}
                        </Badge>
                      </AlertTitle>
                      <AlertDescription className="mb-2">
                        {interaction.description}
                      </AlertDescription>
                      <div className="bg-muted/50 p-3 rounded-md">
                        <p className="text-sm font-medium mb-1">Recommendation:</p>
                        <p className="text-sm">{interaction.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* No Interactions Found */}
      {drugs.length >= 2 && interactions.length === 0 && !isAnalyzing && (
        <Alert className="border-l-4 border-l-success">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>No Interactions Detected</AlertTitle>
          <AlertDescription>
            No significant interactions were found between the entered medications. 
            However, always consult with a healthcare professional before making any changes to your medication regimen.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}