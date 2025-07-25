export interface NarrativeOption {
  optionKey: string;
  content: string;
  narrative: string;
}

export interface PlayResult {
  narrative: string;
  options: NarrativeOption[];
}

export const fetchNarrative = async (option?: string): Promise<PlayResult> => {
  const res = await fetch('http://localhost:3000/play', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ option }),
  });
  return res.json();
};
