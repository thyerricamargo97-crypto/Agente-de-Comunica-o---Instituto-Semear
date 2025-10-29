import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { OutputDisplay } from './components/OutputDisplay';
import { generateCampaignCommunications, refineCampaignCommunications } from './services/geminiService';
import { CampaignInput } from './types';
import { INITIAL_CAMPAIGN_INPUT } from './constants';

const App: React.FC = () => {
  const [campaignInput, setCampaignInput] = useState<CampaignInput>(INITIAL_CAMPAIGN_INPUT);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refinementInput, setRefinementInput] = useState<string>('');
  
  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedContent('');

    try {
      const content = await generateCampaignCommunications(campaignInput);
      setGeneratedContent(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefine = async () => {
    if (!refinementInput.trim()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const content = await refineCampaignCommunications(generatedContent, refinementInput, campaignInput);
      setGeneratedContent(content);
      setRefinementInput(''); // Clear input on success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <InputForm 
            campaignInput={campaignInput}
            setCampaignInput={setCampaignInput}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
          <OutputDisplay
            content={generatedContent}
            isLoading={isLoading}
            error={error}
            campaignInput={campaignInput}
            refinementInput={refinementInput}
            setRefinementInput={setRefinementInput}
            onRefine={handleRefine}
          />
        </div>
      </main>
    </div>
  );
};

export default App;