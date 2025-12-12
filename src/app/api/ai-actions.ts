'use server';

import type { GeneralChatInput } from '@/ai/flows/general-chat-flow';
import { generalChat } from '@/ai/flows/general-chat-flow';
import type { DiagnosePlantInput } from '@/ai/flows/plant-diagnoser-flow';
import { diagnosePlant } from '@/ai/flows/plant-diagnoser-flow';
import type { SmartAlertingSystemInput } from '@/ai/flows/smart-alerting-system';
import { smartAlertingSystem } from '@/ai/flows/smart-alerting-system';

export async function runGeneralChat(input: GeneralChatInput) {
  return await generalChat(input);
}

export async function runDiagnosePlant(input: DiagnosePlantInput) {
  return await diagnosePlant(input);
}

export async function runSmartAlerting(input: SmartAlertingSystemInput) {
  return await smartAlertingSystem(input);
}
