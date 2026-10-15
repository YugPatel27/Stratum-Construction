import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import QuoteForm, { buildMailto, validate } from '../../src/components/ui/QuoteForm';
import { installBrowserStubs, Shell } from './helpers';

beforeEach(() => installBrowserStubs());

describe('quote form validation', () => {
  it('reports every missing field', () => {
    expect(Object.keys(validate({ name: '', email: 'nope', phone: '', type: 'x', message: 'short' }))).toEqual(['name', 'email', 'message']);
  });
  it('accepts a complete request', () => {
    expect(validate({ name: 'Asha', email: 'asha@company.com', phone: '', type: 'x', message: 'Four floors, new site.' })).toEqual({});
  });
  it('builds an encoded mailto link with all details', () => {
    const href = buildMailto({ name: 'Asha M', email: 'a@b.co', phone: '123', type: 'Warehouse', message: 'Need 5,000 sq ft & a yard' });
    expect(href.startsWith('mailto:')).toBe(true);
    expect(decodeURIComponent(href)).toContain('Project type: Warehouse');
    expect(decodeURIComponent(href)).toContain('Phone: 123');
    expect(href).not.toContain(' ');
  });
});

describe('quote form UI', () => {
  it('shows accessible errors on an empty submit and does not send', () => {
    render(
      <Shell>
        <QuoteForm />
      </Shell>,
    );
    fireEvent.click(screen.getByRole('button', { name: /send quote request/i }));
    expect(screen.getAllByRole('alert').length).toBe(3);
    expect(screen.getByLabelText(/your name/i)).toHaveAttribute('aria-invalid', 'true');
  });
});
