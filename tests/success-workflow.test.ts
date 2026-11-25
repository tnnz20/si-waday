import 'dotenv/config';
import assert from 'node:assert/strict';
import test from 'node:test';

import { db } from '../app/db/index.server';
import {
  getPublicTicketWithFeedback,
  getTicketByNumber,
  getTicketFeedbacks,
} from '../app/lib/ticket.server';

test.after(async () => {
  await db.$client.end();
});

test('success receipt workflow resolves public-safe ticket and feedbacks without throwing', async () => {
  // Test resolving a known seeded ticket via internal lookup
  const ticket = await getTicketByNumber('ASP-2026-1001');
  assert.ok(ticket, 'Ticket ASP-2026-1001 should exist in seeded database');
  assert.equal(ticket.ticketNumber, 'ASP-2026-1001');
  assert.equal(ticket.type, 'dapil');
  assert.ok(ticket.reporterName);

  const feedbacks = await getTicketFeedbacks(ticket.id);
  assert.ok(Array.isArray(feedbacks));
  assert.ok(feedbacks.length > 0, 'ASP-2026-1001 should have at least one feedback record');
  assert.ok(feedbacks[0].rating >= 1 && feedbacks[0].rating <= 5);

  // Public receipt DTO must redact sensitive citizen PII
  const publicResult = await getPublicTicketWithFeedback('ASP-2026-1001');
  assert.ok(publicResult);
  assert.equal(publicResult.ticket.ticketNumber, 'ASP-2026-1001');
  assert.match(publicResult.ticket.maskedNik, /^\d{6}\*{6}\d{4}$/);
  assert.equal('reporterNik' in publicResult.ticket, false);
  assert.equal('reporterPhone' in publicResult.ticket, false);
  assert.equal('reporterAddress' in publicResult.ticket, false);
  assert.equal('idCardUrl' in publicResult.ticket, false);
  assert.ok(publicResult.feedback);

  // Non-existent ticket number must return null cleanly without fallback
  const missingResult = await getPublicTicketWithFeedback('ASP-NON-EXISTENT-9999');
  assert.equal(missingResult, null);
});
