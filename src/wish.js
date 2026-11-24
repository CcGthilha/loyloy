// มีตัวเชื่อมที่มองไม่เห็น (U+2060) ในคำว่า สักนิด กันบรรทัดตัดกลางคำ
export const OUR_WISH = 'เค้าขอให้เราตีกันน้อยลงสัก⁠นิด แต่ตีกันไปนานๆหน่อย'

// กุญแจสาธารณะ: ใช้ล็อกคำขอได้อย่างเดียว คนที่เปิดอ่านได้คือคนถือลิงก์ #me.…
export const OWNER_PUBLIC = 'Z6flyCxKp8LGK8d1A47B59OK7_1EOyZZa2SaCOffEEE'

export const WISH_MAX = 60

// ตัดตามตัวอักษรที่ตาเห็น ไม่ให้สระ/วรรณยุกต์ไทยหรืออิโมจิขาดครึ่ง
const segmenter = new Intl.Segmenter('th', { granularity: 'grapheme' })
export const cleanWish = (text) => clip(text).trim()
export const clip = (text) =>
  typeof text === 'string'
    ? Array.from(segmenter.segment(text.slice(0, WISH_MAX * 12)), (s) => s.segment).slice(0, WISH_MAX).join('')
    : ''
