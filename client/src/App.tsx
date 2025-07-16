import { useState, useEffect } from 'react';
import { fetchNarrative } from './api';

export default function App() {
  const [narrative, setNarrative] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async (option?: string) => {
    setLoading(true);
    const res = await fetchNarrative(option);
    setNarrative(res.narrative);
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
      <p data-testid="narration">{narrative}</p>
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
