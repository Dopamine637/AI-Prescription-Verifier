import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Calculator, User, Weight, Calendar, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DosageResult {
  recommendedDose: string;
  maxDailyDose: string;
  frequency: string;
  warnings: string[];
  ageGroup: string;
}

interface DrugDosageInfo {
  name: string;
  pediatricDose: string;
  adultDose: string;
  elderlyDose: string;
  maxDaily: string;
  warnings: string[];
}

export function DosageCalculator() {
  const [patientData, setPatientData] = useState({
    age: '',
    weight: '',
    drugName: '',
    indication: ''
  });
  const [dosageResult, setDosageResult] = useState<DosageResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  // Mock dosage database
  const dosageDatabase: Record<string, DrugDosageInfo> = {
    'acetaminophen': {
      name: 'Acetaminophen',
      pediatricDose: '10-15 mg/kg every 4-6 hours',
      adultDose: '500-1000 mg every 4-6 hours',
      elderlyDose: '325-650 mg every 4-6 hours',
      maxDaily: '4000 mg (adult), 3000 mg (elderly)',
      warnings: ['Hepatotoxicity risk with overdose', 'Reduce dose in liver disease']
    },
    'ibuprofen': {
      name: 'Ibuprofen',
      pediatricDose: '5-10 mg/kg every 6-8 hours',
      adultDose: '200-400 mg every 4-6 hours',
      elderlyDose: '200 mg every 6-8 hours',
      maxDaily: '1200 mg (OTC), 2400 mg (prescription)',
      warnings: ['GI bleeding risk', 'Avoid in renal impairment', 'Use caution in elderly']
    },
    'amoxicillin': {
      name: 'Amoxicillin',
      pediatricDose: '20-40 mg/kg/day divided every 8 hours',
      adultDose: '250-500 mg every 8 hours',
      elderlyDose: '250-500 mg every 8-12 hours',
      maxDaily: '1500 mg (standard), 3000 mg (severe infections)',
      warnings: ['Adjust dose in renal impairment', 'Check for penicillin allergy']
    },
    'metformin': {
      name: 'Metformin',
      pediatricDose: '500 mg twice daily (>10 years)',
      adultDose: '500-1000 mg twice daily',
      elderlyDose: '500 mg once or twice daily',
      maxDaily: '2000-2550 mg',
      warnings: ['Contraindicated in severe renal impairment', 'Monitor for lactic acidosis']
    }
  };

  const getAgeGroup = (age: number) => {
    if (age < 2) return 'infant';
    if (age < 12) return 'child';
    if (age < 18) return 'adolescent';
    if (age < 65) return 'adult';
    return 'elderly';
  };

  const calculateDosage = () => {
    const age = parseInt(patientData.age);
    const weight = parseFloat(patientData.weight);
    const drugName = patientData.drugName.toLowerCase();

    if (!age || !weight || !drugName) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (age < 0 || age > 120) {
      toast({
        title: "Invalid Age",
        description: "Please enter a valid age between 0-120 years",
        variant: "destructive"
      });
      return;
    }

    if (weight < 1 || weight > 300) {
      toast({
        title: "Invalid Weight",
        description: "Please enter a valid weight between 1-300 kg",
        variant: "destructive"
      });
      return;
    }

    const drugInfo = dosageDatabase[drugName];
    if (!drugInfo) {
      toast({
        title: "Drug Not Found",
        description: "Dosage information not available for this medication",
        variant: "destructive"
      });
      return;
    }

    setIsCalculating(true);

    // Simulate calculation delay
    setTimeout(() => {
      const ageGroup = getAgeGroup(age);
      let recommendedDose = '';
      let frequency = '';
      
      switch (ageGroup) {
        case 'infant':
        case 'child':
          recommendedDose = drugInfo.pediatricDose;
          frequency = 'As per pediatric guidelines';
          break;
        case 'adolescent':
        case 'adult':
          recommendedDose = drugInfo.adultDose;
          frequency = 'Standard adult dosing';
          break;
        case 'elderly':
          recommendedDose = drugInfo.elderlyDose;
          frequency = 'Reduced frequency for elderly';
          break;
      }

      const result: DosageResult = {
        recommendedDose,
        maxDailyDose: drugInfo.maxDaily,
        frequency,
        warnings: drugInfo.warnings,
        ageGroup: ageGroup.charAt(0).toUpperCase() + ageGroup.slice(1)
      };

      setDosageResult(result);
      setIsCalculating(false);

      toast({
        title: "Dosage Calculated",
        description: `Recommendation generated for ${drugInfo.name}`,
      });
    }, 1500);
  };

  const resetCalculator = () => {
    setPatientData({ age: '', weight: '', drugName: '', indication: '' });
    setDosageResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Patient Information Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Age (years)
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="e.g., 35"
                value={patientData.age}
                onChange={(e) => setPatientData(prev => ({ ...prev, age: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight" className="flex items-center gap-2">
                <Weight className="w-4 h-4" />
                Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="e.g., 70.5"
                value={patientData.weight}
                onChange={(e) => setPatientData(prev => ({ ...prev, weight: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="drug">Medication</Label>
            <Select 
              value={patientData.drugName} 
              onValueChange={(value) => setPatientData(prev => ({ ...prev, drugName: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select medication" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="acetaminophen">Acetaminophen (Tylenol)</SelectItem>
                <SelectItem value="ibuprofen">Ibuprofen (Advil)</SelectItem>
                <SelectItem value="amoxicillin">Amoxicillin</SelectItem>
                <SelectItem value="metformin">Metformin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="indication">Indication (Optional)</Label>
            <Input
              id="indication"
              placeholder="e.g., Pain relief, infection treatment"
              value={patientData.indication}
              onChange={(e) => setPatientData(prev => ({ ...prev, indication: e.target.value }))}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={calculateDosage}
              disabled={isCalculating}
              className="flex-1"
            >
              <Calculator className="w-4 h-4 mr-2" />
              {isCalculating ? "Calculating..." : "Calculate Dosage"}
            </Button>
            <Button variant="outline" onClick={resetCalculator}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dosage Results */}
      {dosageResult && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Dosage Recommendation
              <Badge variant="outline">{dosageResult.ageGroup} Patient</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Recommended Dose</Label>
                <p className="text-lg font-semibold text-primary">{dosageResult.recommendedDose}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Maximum Daily Dose</Label>
                <p className="text-lg font-semibold text-accent">{dosageResult.maxDailyDose}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Dosing Frequency</Label>
              <p className="text-base">{dosageResult.frequency}</p>
            </div>

            {dosageResult.warnings.length > 0 && (
              <Alert className="border-l-4 border-l-warning">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Important Safety Information</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {dosageResult.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Disclaimer</AlertTitle>
              <AlertDescription>
                This dosage calculation is for informational purposes only. Always consult with a healthcare 
                professional before starting, stopping, or changing any medication regimen. Individual patient 
                factors may require dose adjustments.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}