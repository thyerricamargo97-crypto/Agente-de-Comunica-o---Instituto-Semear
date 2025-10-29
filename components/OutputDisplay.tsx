import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Spinner } from './ui/Spinner';
import { MarkdownRenderer } from './MarkdownRenderer';
import { CampaignInput, Attachment } from '../types';
import { generateDoc } from '../services/htmlDocGenerator';
import { Textarea } from './ui/FormControls';
import { Button } from './ui/Button';

interface OutputDisplayProps {
    content: string;
    isLoading: boolean;
    error: string | null;
    campaignInput: CampaignInput;
    refinementInput: string;
    setRefinementInput: (value: string) => void;
    onRefine: () => void;
}

const CopyIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);


const COMMUNICATION_SEPARATOR = "\n---\n---\n---\n";

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ 
    content, 
    isLoading, 
    error, 
    campaignInput,
    refinementInput,
    setRefinementInput,
    onRefine
}) => {
    const [copied, setCopied] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    
    const isIdle = !isLoading && !content && !error;
    
    const finalCommunications = content.split(COMMUNICATION_SEPARATOR).filter(c => c.trim().length > 0);
    const hasContent = !isLoading && content && finalCommunications.length > 0;

    const handleCopy = () => {
        navigator.clipboard.writeText(content).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleDownload = async () => {
        if (!content) return;
        setIsDownloading(true);
        try {
            await generateDoc(content, campaignInput);
        } catch (err) {
            console.error("Failed to generate DOC", err);
            // Optionally, show an error message to the user
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="sticky top-24 space-y-8">
            <Card>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-100">Resultados Gerados</h2>
                     <span className="text-xs font-mono text-slate-400">FINAL OUTPUT</span>
                </div>
                
                <div className="relative">
                    {hasContent && (
                         <div className="absolute -top-11 right-0 z-10 flex space-x-2">
                            <button 
                                onClick={handleCopy} 
                                className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1 rounded-md text-xs flex items-center space-x-1 transition"
                                disabled={isDownloading || isLoading}
                            >
                               {copied ? <CheckIcon /> : <CopyIcon />}
                               <span>{copied ? 'Copiado!' : 'Copiar Markdown'}</span>
                            </button>
                             <button 
                                onClick={handleDownload} 
                                className="bg-sky-600 hover:bg-sky-700 text-white px-2 py-1 rounded-md text-xs flex items-center space-x-1 transition disabled:bg-slate-500 disabled:cursor-wait"
                                disabled={isDownloading || isLoading}
                            >
                               <DownloadIcon />
                               <span>{isDownloading ? 'Baixando...' : 'Baixar .doc'}</span>
                            </button>
                        </div>
                    )}
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {isLoading && !hasContent && (
                            <div className="bg-slate-800/50 rounded-lg p-4 min-h-[300px] flex flex-col items-center justify-center">
                                <Spinner />
                                <p className="mt-2 text-slate-400">O agente está escrevendo...</p>
                            </div>
                        )}
                        {error && (
                            <div className="text-red-400 bg-red-900/20 p-4 rounded-lg">
                                <p className="font-semibold">Ocorreu um erro geral:</p>
                                <p>{error}</p>
                            </div>
                        )}
                        {isIdle && (
                            <div className="bg-slate-800/50 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
                                <p className="text-slate-500">As comunicações geradas aparecerão aqui.</p>
                            </div>
                        )}
                        {hasContent && finalCommunications.map((comm, index) => (
                           <div key={index} className="bg-slate-800/50 rounded-lg p-4 text-slate-300 text-sm border border-slate-700/50">
                               <MarkdownRenderer 
                                    markdownText={comm} 
                                    attachments={[...campaignInput.mediaAttachments, campaignInput.emailBanner, campaignInput.referenceModel].filter(Boolean) as Attachment[]}
                                />
                           </div>
                        ))}
                    </div>
                </div>

                {hasContent && (
                    <div className="mt-6 pt-6 border-t border-slate-700 space-y-4">
                        <p className="text-sm text-slate-400">
                           <span className="font-bold text-slate-300">PLANO DE COMUNICAÇÃO COMPLETO GERADO.</span> Para fazer ajustes (ex: reposicionamento de imagem, alteração de texto), indique o 'A. ID da Comunicação' que deseja mudar e a nova instrução. (Ex: 'A. ID: PS-2026-E-03 - Mover a imagem anexada para o final do e-mail e mudar o tom para 'Motivacional').
                        </p>
                        <Textarea 
                            label="Instruções para ajuste:"
                            name="refinement"
                            value={refinementInput}
                            onChange={(e) => setRefinementInput(e.target.value)}
                            rows={3}
                            placeholder="Seja específico na sua instrução..."
                        />
                        <Button
                            onClick={onRefine}
                            disabled={isLoading || !refinementInput.trim()}
                            className="w-full"
                        >
                            {isLoading ? 'Ajustando...' : 'Ajustar Comunicação'}
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
};