import saveAs from 'file-saver';
import { CampaignInput, Attachment } from '../types';

const COMMUNICATION_SEPARATOR = "\n---\n---\n---\n";

function generateHtmlContent(content: string, campaign: CampaignInput): string {
    const allAttachments = [...campaign.mediaAttachments, campaign.emailBanner, campaign.referenceModel].filter(Boolean) as Attachment[];
    const communications = content.split(COMMUNICATION_SEPARATOR).filter(c => c.trim());

    let html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>${campaign.campaignId || 'Plano de Comunicação'}</title>
            <style>
                body { font-family: Calibri, Arial, sans-serif; font-size: 12pt; line-height: 1.5; color: #000; }
                p { margin: 0 0 1em 0; }
                strong { font-weight: bold; }
                hr { border: 0; border-top: 1px solid #ccc; margin: 1em 0; }
                img { max-width: 550px; height: auto; border-radius: 8px; margin: 1em 0; display: block; }
                .communication-block { page-break-after: always; }
                .communication-block:last-child { page-break-after: auto; }
                h3 { font-size: 14pt; font-weight: bold; margin-bottom: 1em; color: #333; }
            </style>
        </head>
        <body>
    `;

    communications.forEach((comm) => {
        html += `<div class="communication-block">`;
        const lines = comm.trim().split('\n');
        
        lines.forEach(line => {
            let processedLine = line.trim();

            if (!processedLine) {
                html += `<p>&nbsp;</p>`; // Empty line
                return;
            }
            
            // Image
            const imageMatch = processedLine.match(/!\[(.*?)\]\((.*?)\)/);
            if (imageMatch) {
                const imageName = imageMatch[2].trim();
                const attachment = allAttachments.find(f => f.name === imageName);
                if (attachment) {
                    html += `<img src="data:${attachment.mimeType};base64,${attachment.data}" alt="${imageMatch[1]}" />`;
                }
                return;
            }

            // Horizontal rule
            if (processedLine === '---') {
                html += '<hr />';
                return;
            }

            // Bold text for ID and other parts
            processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            
            // Check if it's the Communication ID line and make it a heading
            if (line.trim().startsWith('**') && line.includes(campaign.campaignId)) {
                 const idText = line.trim().replace(/\*\*/g, '');
                 html += `<h3>${idText}</h3>`;
            } else {
                 html += `<p>${processedLine}</p>`;
            }
        });
        
        html += `</div>`;
    });

    html += `</body></html>`;
    return html;
}


export const generateDoc = async (content: string, campaign: CampaignInput): Promise<void> => {
    const htmlString = generateHtmlContent(content, campaign);
    const blob = new Blob([`
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>Word export</title></head>
        <body>${htmlString}</body>
        </html>
    `], { 
        type: 'application/msword;charset=utf-8' 
    });
    saveAs(blob, `${campaign.campaignId || 'plano-de-comunicacao'}.doc`);
};