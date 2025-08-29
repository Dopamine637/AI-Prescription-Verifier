import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Shield, Users, Brain } from "lucide-react";
import { DrugInteractionAnalyzer } from "@/components/DrugInteractionAnalyzer";
import { DosageCalculator } from "@/components/DosageCalculator";
import { AlternativeSuggestions } from "@/components/AlternativeSuggestions";
import { NLPAnalyzer } from "@/components/NLPAnalyzer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-medical">
      {/* Hero Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
        <div className="relative container mx-auto px-4 py-12">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Activity className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                MedGuard AI
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Advanced drug interaction analysis, age-specific dosage recommendations, 
              and intelligent alternative medication suggestions powered by AI.
            </p>
            
            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
              <Card className="medical-card hover:medical-glow transition-smooth animate-slide-up">
                <CardHeader className="text-center pb-4">
                  <Shield className="w-12 h-12 text-primary mx-auto mb-3" />
                  <CardTitle className="text-lg">Safety First</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive drug interaction detection with real-time safety alerts
                  </p>
                </CardContent>
              </Card>
              
              <Card className="medical-card hover:medical-glow transition-smooth animate-slide-up">
                <CardHeader className="text-center pb-4">
                  <Users className="w-12 h-12 text-accent mx-auto mb-3" />
                  <CardTitle className="text-lg">Age-Specific</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Precise dosage recommendations tailored to patient age and profile
                  </p>
                </CardContent>
              </Card>
              
              <Card className="medical-card hover:medical-glow transition-smooth animate-slide-up">
                <CardHeader className="text-center pb-4">
                  <Brain className="w-12 h-12 text-success mx-auto mb-3" />
                  <CardTitle className="text-lg">AI-Powered</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Advanced NLP for extracting drug information from medical text
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="interactions" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="interactions">Drug Interactions</TabsTrigger>
            <TabsTrigger value="dosage">Dosage Calculator</TabsTrigger>
            <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
            <TabsTrigger value="nlp">NLP Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="interactions" className="animate-fade-in">
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Drug Interaction Analysis
                </CardTitle>
                <CardDescription>
                  Enter multiple medications to check for potential interactions and safety concerns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DrugInteractionAnalyzer />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dosage" className="animate-fade-in">
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent" />
                  Age-Specific Dosage Calculator
                </CardTitle>
                <CardDescription>
                  Calculate appropriate medication dosages based on patient age and weight
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DosageCalculator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alternatives" className="animate-fade-in">
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-success" />
                  Alternative Medication Suggestions
                </CardTitle>
                <CardDescription>
                  Find safer or equivalent medications when interactions are detected
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AlternativeSuggestions />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nlp" className="animate-fade-in">
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  NLP Drug Information Extraction
                </CardTitle>
                <CardDescription>
                  Extract structured drug information from unstructured medical text using AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NLPAnalyzer />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;