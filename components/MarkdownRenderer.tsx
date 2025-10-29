import React from 'react';
import { Attachment } from '../types';

interface MarkdownRendererProps {
    markdownText: string;
    attachments: Attachment[];
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdownText, attachments }) => {
    
    // Process text line by line
    const lines = markdownText.split('\n');

    const renderLine = (line: string, index: number) => {
        let processedLine = line;

        // Handle bold text: **text**
        processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Handle images: ![alt text](image_name.ext)
        processedLine = processedLine.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, imageName) => {
            const attachment = attachments.find(f => f.name === imageName.trim());
            if (attachment) {
                return `<img src="data:${attachment.mimeType};base64,${attachment.data}" alt="${alt}" class="my-4 rounded-lg max-w-full" />`;
            }
            return `<!-- Image not found: ${imageName} -->`;
        });
        
        // Use dangerouslySetInnerHTML to render the HTML tags
        // Add a class for styling paragraphs
        return <p key={index} className="mb-2" dangerouslySetInnerHTML={{ __html: processedLine || '&nbsp;' }} />;
    };

    return (
        <div className="prose prose-invert prose-sm text-slate-300 whitespace-pre-wrap">
           {lines.map(renderLine)}
        </div>
    );
};