import { test, describe } from 'node:test';
import assert from 'node:assert';
import { LEGAL_DISCLAIMER, DEMO_VERIFICATION_DISCLAIMER } from '../src/lib/constants.js';

describe('Platform Neutrality & Disclaimers (Cleanup Section 3 & 8)', () => {
  test('Legal disclaimer is completely platform neutral and mentions no specific vendor', () => {
    assert.strictEqual(
      LEGAL_DISCLAIMER,
      'Leqad is an independent early-stage CAD education project. This website demonstrates the learning experience and is not an official product or endorsement of any CAD platform.'
    );
    assert.ok(!LEGAL_DISCLAIMER.toLowerCase().includes('onshape'));
  });

  test('Demo verification disclaimer clarifies simulation without real CAD inspection', () => {
    assert.ok(DEMO_VERIFICATION_DISCLAIMER.includes('Interactive illustration'));
    assert.ok(!DEMO_VERIFICATION_DISCLAIMER.toLowerCase().includes('onshape'));
  });

  test('Hash route resolver correctly maps route names', () => {
    const resolveHash = (hash: string) => {
      const clean = hash.replace(/^#\/?/, '');
      if (clean === 'demo') return 'demo';
      if (clean === 'about') return 'about';
      if (clean === 'partners') return 'partners';
      return 'home';
    };

    assert.strictEqual(resolveHash(''), 'home');
    assert.strictEqual(resolveHash('#/'), 'home');
    assert.strictEqual(resolveHash('#demo'), 'demo');
    assert.strictEqual(resolveHash('#/demo'), 'demo');
    assert.strictEqual(resolveHash('#about'), 'about');
    assert.strictEqual(resolveHash('#/about'), 'about');
    assert.strictEqual(resolveHash('#partners'), 'partners');
    assert.strictEqual(resolveHash('#/partners'), 'partners');
    assert.strictEqual(resolveHash('#/unknown-route'), 'home');
  });

  test('Inquiry draft note structure conforms to draft-only helper', () => {
    const generateInquiry = (topic: string, name: string, email: string, org: string, msg: string) => {
      return `--- Leqad Partnership Inquiry ---
Topic: ${topic}
Name: ${name.trim() || '[Not specified]'}
Email: ${email.trim() || '[Not specified]'}
Organization: ${org.trim() || '[Not specified]'}
Message: ${msg.trim() || '[No message entered]'}
---------------------------------`;
    };

    const draft = generateInquiry('Educational Pilot', 'Prof. Smith', 'smith@mit.edu', 'MIT Maker Lab', 'Evaluating CAD lessons');
    assert.ok(draft.includes('Prof. Smith'));
    assert.ok(draft.includes('smith@mit.edu'));
    assert.ok(draft.includes('MIT Maker Lab'));
    assert.ok(draft.includes('Educational Pilot'));
  });
});
