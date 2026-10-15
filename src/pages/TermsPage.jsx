import React from 'react';
import LegalDocument from '@/components/legal/LegalDocument';
import { legal } from '@/data/legalData';

export default function TermsPage() {
  return <LegalDocument doc={legal.terms} path="/terms" />;
}
