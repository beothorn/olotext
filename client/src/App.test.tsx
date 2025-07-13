import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as api from './api';
import App from './App';

vi.mock('./api');

(api.fetchNarrative as vi.Mock).mockResolvedValue({
  narration: 'Hello world',
  options: ['opt1', 'opt2'],
});

describe('App', () => {
  it('renders narrative and options', async () => {
    render(<App />);
    expect(await screen.findByText('Hello world')).toBeInTheDocument();
    expect(await screen.findByText('opt1')).toBeInTheDocument();
  });
});
