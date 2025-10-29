import { GoogleGenAI } from "@google/genai";
import { CampaignInput } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function buildCampaignPrompt(campaign: CampaignInput): string {
    let prompt = `
**Você é um Especialista em Comunicação de Campanhas de Engajamento do Instituto Semear.**

Sua missão é processar o plano de comunicação abaixo e gerar o texto final para cada etapa, em formato Markdown, incluindo a mídia anexada de forma integrada. Mantenha sempre um tom que promova autoderança, potencial e a missão do Instituto Semear.

**IMPORTANTE: Inicie sua resposta DIRETAMENTE com a primeira comunicação. NÃO inclua saudações, preâmbulos ou qualquer texto introdutório.**

---

**SEÇÃO 1: PLANO DE COMUNICAÇÃO (OBJETIVO GERAL)**

*   **A. ID da Campanha:** ${campaign.campaignId}
*   **B. Objetivo Principal:** ${campaign.objective}
*   **C. Público-Alvo:** ${campaign.targetAudience}
*   **D. Estilo/Tom Geral:** ${campaign.tone}
*   **E. Chamada para Ação (CTA) Principal:** ${campaign.cta}

---

**SEÇÃO 2: RECURSOS GLOBAIS E REGRAS DE MÍDIA**

*   **2.1. Lista de Arquivos Anexados:**
    *   **Faixa de E-mail (Banner):** ${campaign.emailBanner ? campaign.emailBanner.name : 'Nenhum'}
    *   **Outras Mídias (Imagens/Gifs):** ${campaign.mediaAttachments.length > 0 ? campaign.mediaAttachments.map(f => f.name).join(', ') : 'Nenhuma'}

*   **2.2. Modelo de Comunicação (Referência de Estilo):**
    ${campaign.referenceModel ? `Um arquivo chamado "${campaign.referenceModel.name}" foi fornecido como modelo. ${campaign.referenceModel.content ? `Seu conteúdo é:\n"""\n${campaign.referenceModel.content}\n"""` : ''} Use-o como forte inspiração para o tom e estilo.` : 'Nenhum modelo de comunicação fornecido.'}

*   **2.3. Links Obrigatórios (para o corpo do e-mail):**
    "${campaign.mandatoryLinks}"
    *Regra:* Inclua as informações e links desta seção de forma fluida e natural DENTRO DO CORPO de TODAS as comunicações de canal "E-mail".

*   **2.4. Rodapé Fixo (Obrigatório):**
    "${campaign.fixedFooter}"
    *Regra:* O texto do rodapé deve ser inserido obrigatoriamente ao final de TODA comunicação, separado do corpo por uma linha horizontal (\`---\`).

---

**SEÇÃO 3: ITENS DO PLANO (SEQUÊNCIA DE COMUNICAÇÃO)**

Você deve gerar o conteúdo para a seguinte sequência de comunicações:

| A. ID da Comunicação | B. Canal | C. Data de Envio | D. Observações/Diretrizes | E. Mídia Anexada a Usar |
|---|---|---|---|---|
`;

    campaign.sequence.forEach(step => {
        prompt += `| ${step.communicationId} | ${step.channel} | ${step.sendDate} | ${step.notes} | ${step.mediaAttachmentName || 'Nenhuma'} |\n`;
    });

    prompt += `
---

**⚙️ SEÇÃO 4: REGRAS DE GERAÇÃO E SAÍDA**

*   **Regra da Faixa de E-mail (Banner):** Se uma "Faixa de E-mail (Banner)" for fornecida na Seção 2.1, você DEVE inseri-la como o PRIMEIRO item no corpo de TODAS as comunicações de canal "E-mail", logo após a linha "Assunto:". Use o formato Markdown: \`![Banner do E-mail](NOME_DO_ARQUIVO_DO_BANNER.ext)\`, onde o nome do arquivo é o que está listado na Seção 2.1.
*   **Regra de Inclusão de Mídia:** Para cada item do plano que tiver um nome de arquivo na coluna "E. Mídia Anexada a Usar", você deve inserir a imagem correspondente diretamente no corpo da comunicação. Use o formato Markdown exato: \`![Descrição da Imagem](NOME_DO_ARQUIVO.ext)\`, substituindo \`NOME_DO_ARQUIVO.ext\` pelo nome do arquivo especificado na coluna E. Posicione a imagem de forma nativa e integrada ao texto para maximizar o impacto.
*   **Inclusão de ID:** Comece CADA comunicação com seu 'A. ID da Comunicação' em uma linha separada e em negrito. Exemplo: **PS-2026-E-01**
*   **Inclusão de Canal:** Logo após a linha do ID, adicione uma linha indicando o canal em negrito, usando o valor da coluna 'B. Canal'. Exemplo: **Canal: E-mail**
*   **Emails:** Para e-mails, sempre inclua uma linha de \`Assunto:\`.
*   **Separador Obrigatório:** Separe CADA comunicação gerada com a seguinte linha tripla, sem nenhuma outra modificação: \`\n---\n---\n---\n\`
*   **Inicie a geração agora. NÃO inclua saudações, preâmbulos ou a instrução de revisão final. Sua resposta deve conter APENAS as comunicações e os separadores.**
`;
    
    return prompt;
}


export const generateCampaignCommunications = async (campaign: CampaignInput): Promise<string> => {
    const model = 'gemini-2.5-pro';
    const prompt = buildCampaignPrompt(campaign);

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate campaign. Please check your API key and network connection.");
    }
};

export const refineCampaignCommunications = async (
    originalContent: string,
    refinementInstruction: string,
    campaign: CampaignInput
): Promise<string> => {
    const model = 'gemini-2.5-pro';

    const prompt = `
**Você é um Especialista em Comunicação de Campanhas de Engajamento do Instituto Semear.**

Sua missão é refinar um plano de comunicação que você gerou anteriormente, com base em novas instruções do usuário.

**PLANO DE COMUNICAÇÃO ORIGINAL GERADO:**
---
${originalContent}
---

**INSTRUÇÃO DE AJUSTE DO USUÁRIO:**
---
"${refinementInstruction}"
---

**TAREFA:**
Re-escreva e retorne o PLANO DE COMUNICAÇÃO COMPLETO, aplicando a instrução de ajuste do usuário.
Mantenha toda a formatação original (IDs, Assuntos, negrito, imagens, rodapé e separadores \`--- --- ---\`).
Sua resposta deve conter APENAS as comunicações atualizadas e os separadores, sem nenhum outro texto, saudação ou explicação.
`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error calling Gemini API for refinement:", error);
        throw new Error("Failed to refine campaign. Please check your API key and network connection.");
    }
};