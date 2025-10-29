export interface Attachment {
  name: string;
  mimeType: string;
  data: string; // base64 encoded string
  content?: string; // Optional text content for .txt files
}

export interface SequenceStep {
  id: string; // Unique ID for React key
  communicationId: string;
  channel: 'E-mail' | 'WhatsApp';
  sendDate: string;
  notes: string;
  mediaAttachmentName: string; // Name of the attachment to use
}

export interface CampaignInput {
  campaignId: string;
  objective: string; // Formerly topic
  tone: 'Formal' | 'Informal' | 'Motivacional' | 'Urgente' | 'Celebrativo';
  targetAudience: string;
  cta: string;
  emailBanner: Attachment | null;
  mediaAttachments: Attachment[];
  referenceModel: Attachment | null;
  mandatoryLinks: string;
  fixedFooter: string;
  sequence: SequenceStep[];
}