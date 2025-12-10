/**
 * @fileOverview A plant problem diagnosis AI agent.
 *
 * - diagnosePlant - A function that handles the plant diagnosis process.
 * - DiagnosePlantInput - The input type for the diagnosePlant function.
 * - DiagnosePlantOutput - The return type for the diagnosePlant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnosePlantInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DiagnosePlantInput = z.infer<typeof DiagnosePlantInputSchema>;

const DiagnosePlantOutputSchema = z.object({
  isPlant: z.boolean().describe('Whether or not the input is a plant.'),
  disease: z.string().describe("The name of the identified plant disease or pest. 'None' if healthy."),
  severity: z.enum(['Low', 'Medium', 'High', 'None']).describe("The severity of the issue."),
  treatment: z.string().describe('The recommended treatment or care instructions.'),
  nextSteps: z.array(z.string()).describe('A list of recommended next steps for the farmer.'),
});
export type DiagnosePlantOutput = z.infer<typeof DiagnosePlantOutputSchema>;

export async function diagnosePlant(input: DiagnosePlantInput): Promise<DiagnosePlantOutput> {
  return diagnosePlantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnosePlantPrompt',
  input: {schema: DiagnosePlantInputSchema},
  output: {schema: DiagnosePlantOutputSchema},
  prompt: `You are an expert agricultural botanist specializing in diagnosing plant illnesses and pests for farmers in Sikkim, India.

Analyze the provided photo of a plant.

1.  First, determine if the image actually contains a plant. If not, set 'isPlant' to false and provide helpful feedback in the other fields.
2.  If it is a plant, identify any visible diseases or pests.
3.  If a problem is detected, determine its severity (Low, Medium, High).
4.  Provide a clear, actionable treatment plan suitable for local conditions in Sikkim.
5.  Suggest a short list of 2-3 practical next steps for the farmer to take.
6.  If the plant appears healthy, state that, set disease to 'None', severity to 'None', and provide general care tips as the treatment.

Respond with ONLY the JSON object defined in the output schema.

Photo: {{media url=photoDataUri}}`,
});

const diagnosePlantFlow = ai.defineFlow(
  {
    name: 'diagnosePlantFlow',
    inputSchema: DiagnosePlantInputSchema,
    outputSchema: DiagnosePlantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
