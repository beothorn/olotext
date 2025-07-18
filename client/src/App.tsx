import { useState, useEffect } from 'react';
import { fetchNarrative, NarrativeOption } from './api';

export default function App() {
  const [narrative, setNarrative] = useState('');
  const [options, setOptions] = useState<NarrativeOption[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async (optionKey?: string) => {
    setLoading(true);
    const res = await fetchNarrative(optionKey);
    setNarrative(res.narrative);
    setOptions(res.options);
    setLoading(false);
  };

  const handleOption = (o: NarrativeOption) => {
    setNarrative(o.narrative);
    setOptions([]);
    load(o.optionKey);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h1>Olotext</h1>
      {loading && <p>Loading...</p>}
      <p data-testid="narration">{narrative}</p>
      <ul>
        {options.map((o, i) => (
          <li key={i}>
            <button onClick={() => handleOption(o)}>{o.content}</button>
          </li>
        ))} 
      </ul>
    </div>
  );
}
