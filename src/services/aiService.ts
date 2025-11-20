import Constants from 'expo-constants';

const OPENAI_API_KEY = Constants.expoConfig?.extra?.openaiApiKey;
const OPENAI_API_URL = 'https://api.openai.com/v1';

interface WhisperResponse {
  text: string;
}

interface GPTResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

/**
 * Convert audio to text using OpenAI Whisper API
 */
async function transcribeAudio(audioUri: string): Promise<string> {
  const formData = new FormData();
  
  // Create file blob from audio URI
  const response = await fetch(audioUri);
  const blob = await response.blob();
  
  formData.append('file', blob, 'audio.m4a');
  formData.append('model', 'whisper-1');

  const whisperResponse = await fetch(`${OPENAI_API_URL}/audio/transcriptions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: formData,
  });

  if (!whisperResponse.ok) {
    throw new Error(`Whisper API error: ${whisperResponse.statusText}`);
  }

  const data: WhisperResponse = await whisperResponse.json();
  return data.text;
}

/**
 * Extract tasks from transcript using GPT-4
 */
async function extractTasks(transcript: string): Promise<string[]> {
  const prompt = `Extract actionable tasks from this voice note. Return ONLY a JSON array of task strings in uppercase, with no additional text or formatting. Each task should be a clear, concise action item.

Voice note: "${transcript}"

Return format: ["TASK 1", "TASK 2", "TASK 3"]`;

  const gptResponse = await fetch(`${OPENAI_API_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a task extraction assistant. Extract clear, actionable tasks from voice notes and return them as a JSON array of uppercase strings.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
    }),
  });

  if (!gptResponse.ok) {
    throw new Error(`GPT API error: ${gptResponse.statusText}`);
  }

  const data: GPTResponse = await gptResponse.json();
  const content = data.choices[0].message.content;

  try {
    const tasks = JSON.parse(content);
    return Array.isArray(tasks) ? tasks : [];
  } catch (error) {
    console.error('Failed to parse GPT response:', content);
    return [];
  }
}

import { Task } from '../types/Task';
import { parseDateFromText } from './dateParser';

/**
 * Main function: Parse voice recording to tasks
 * Currently using smart mock - real API integration is a future feature
 */
export async function parseVoiceToTasks(_audioUri: string): Promise<Task[]> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Smart mock: Generate realistic tasks with dates
  const taskTemplates = [
    { text: 'EMAIL SARAH', datePhrase: 'today' },
    { text: 'EMAIL JOHN ABOUT PROJECT', datePhrase: 'tomorrow' },
    { text: 'CALL DENTIST', datePhrase: 'tomorrow at 2pm' },
    { text: 'CALL MOM', datePhrase: 'friday' },
    { text: 'BUY MILK AND EGGS', datePhrase: null },
    { text: 'BUY GROCERIES', datePhrase: 'this week' },
    { text: 'MEETING WITH SARAH AT 3PM', datePhrase: 'friday at 3pm' },
    { text: 'MEETING WITH TEAM', datePhrase: 'monday at 10am' },
    { text: 'FINISH REPORT', datePhrase: 'next week' },
    { text: 'FINISH PROJECT PROPOSAL', datePhrase: 'friday' },
    { text: 'REVIEW DOCUMENT', datePhrase: 'tomorrow' },
    { text: 'REVIEW CODE CHANGES', datePhrase: 'today' },
    { text: 'PAY BILLS', datePhrase: 'this week' },
    { text: 'PAY RENT', datePhrase: 'next week' },
    { text: 'BOOK FLIGHT TO NYC', datePhrase: 'next week' },
    { text: 'BOOK HOTEL RESERVATION', datePhrase: 'tomorrow' },
  ];

  // Randomly select 2-4 tasks
  const numTasks = Math.floor(Math.random() * 3) + 2; // 2-4 tasks
  const selectedTasks: Task[] = [];
  const usedIndices = new Set<number>();

  for (let i = 0; i < numTasks; i++) {
    let taskIndex: number;
    // Ensure we don't repeat tasks
    do {
      taskIndex = Math.floor(Math.random() * taskTemplates.length);
    } while (usedIndices.has(taskIndex) && usedIndices.size < taskTemplates.length);
    
    usedIndices.add(taskIndex);
    const template = taskTemplates[taskIndex];
    
    const task: Task = {
      id: `task-${Date.now()}-${i}`,
      text: template.text, // Keep for backward compatibility
      title: template.text,
      description: undefined,
      completed: false,
      dueDate: template.datePhrase ? parseDateFromText(template.datePhrase) : undefined,
      createdAt: new Date(),
    };
    
    selectedTasks.push(task);
  }

  console.log('Mock parsed tasks:', selectedTasks);
  return selectedTasks;
}

/* 
 * FUTURE FEATURE: Real API integration
 * Uncomment below when ready to integrate with OpenAI APIs
 */

/*
export async function parseVoiceToTasks(audioUri: string): Promise<string[]> {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Transcribing audio...');
    const transcript = await transcribeAudio(audioUri);
    console.log('Transcript:', transcript);

    console.log('Extracting tasks...');
    const tasks = await extractTasks(transcript);
    console.log('Extracted tasks:', tasks);

    return tasks;
  } catch (error) {
    console.error('Error parsing voice to tasks:', error);
    throw error;
  }
}
*/
