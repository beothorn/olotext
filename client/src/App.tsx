import { useState, useEffect } from 'react';
import { fetchNarrative } from './api';

export default function App() {
  const [narration, setNarration] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async (choiceId?: string) => {
    setLoading(true);
    const res = await fetchNarrative(choiceId);
    setNarration(res.narration);
    setOptions(res.options);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h1>Olotext</h1>
      {loading && <p>Loading...</p>}
      <p data-testid="narration">{narration}</p>
      <ul>
        {options.map((o, i) => (
          <li key={i}>
            <button onClick={() => load(o)}>{o}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
