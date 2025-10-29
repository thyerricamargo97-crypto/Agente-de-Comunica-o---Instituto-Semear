import { CampaignInput } from './types';

export const CHANNELS: CampaignInput['sequence'][0]['channel'][] = ['E-mail', 'WhatsApp'];
export const TONES: CampaignInput['tone'][] = ['Formal', 'Informal', 'Motivacional', 'Urgente', 'Celebrativo'];

export const INITIAL_CAMPAIGN_INPUT: CampaignInput = {
  campaignId: '',
  objective: '',
  tone: 'Formal',
  targetAudience: '',
  cta: '',
  mandatoryLinks: '',
  fixedFooter: '',
  emailBanner: null,
  mediaAttachments: [],
  referenceModel: null,
  sequence: []
};
