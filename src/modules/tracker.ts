const DB_URL = 'https://ploy-ad78d-default-rtdb.asia-southeast1.firebasedatabase.app';

/** Firebase IP tracker (kept for compatibility with the original page). */
export async function trackVisitor(): Promise<void> {
  if (localStorage.getItem('ploy_visited_tracked')) return;
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data: { ip: string } = await response.json();

    await fetch(`${DB_URL}/ip.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ip: data.ip,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      }),
    });

    localStorage.setItem('ploy_visited_tracked', 'true');
  } catch (error) {
    console.error('Error tracking visitor:', error);
  }
}

/** Milestone event logger for Firebase. */
export async function logMilestone(eventName: string, extra: Record<string, unknown> = {}): Promise<void> {
  try {
    await fetch(`${DB_URL}/events.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: eventName, timestamp: new Date().toISOString(), ...extra }),
    });
  } catch {
    // silently handle
  }
}
