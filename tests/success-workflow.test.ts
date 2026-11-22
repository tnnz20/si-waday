import assert from 'node:assert/strict';
import test from 'node:test';
import { getTicketByNumber, getTicketFeedbacks } from '../app/lib/ticket.server';

test('success receipt workflow resolves ticket and feedbacks without throwing', async () => {
  // Test resolving a known seeded ticket
  const ticket = await getTicketByNumber('ASP-2026-1001');
  assert.ok(ticket, 'Ticket ASP-2026-1001 should exist in seeded database');
  assert.equal(ticket.ticketNumber, 'ASP-2026-1001');
  assert.equal(ticket.type, 'dapil');
  assert.ok(ticket.reporterName);

  // Test feedbacks resolution for this ticket
  const feedbacks = await getTicketFeedbacks(ticket.id);
  assert.ok(Array.isArray(feedbacks));
  assert.ok(feedbacks.length > 0, 'ASP-2026-1001 should have at least one feedback record');
  assert.ok(feedbacks[0].rating >= 1 && feedbacks[0].rating <= 5);

  // Test invalid ticket number returns undefined/null gracefully
  const invalidTicket = await getTicketByNumber('ASP-NON-EXISTENT-9999');
  assert.equal(invalidTicket, undefined);

  process.exit(0);
});
