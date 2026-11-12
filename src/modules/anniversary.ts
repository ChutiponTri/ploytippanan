// นับเวลาตั้งแต่ 15 พฤษภาคม 2553 (2010-05-15)
export const anniversaryDate = new Date('2010-05-15T00:00:00+07:00');

/** Full years since the anniversary (goes up on 15 May each year). */
export function yearsSinceAnniversary(now = new Date()): number {
  let years = now.getFullYear() - anniversaryDate.getFullYear();
  const beforeAnniversary =
    now.getMonth() < anniversaryDate.getMonth() ||
    (now.getMonth() === anniversaryDate.getMonth() && now.getDate() < anniversaryDate.getDate());
  if (beforeAnniversary) years--;
  return years;
}
