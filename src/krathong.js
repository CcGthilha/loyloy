export const NAME_MAX = 12
export const WISH_MAX = 60

// ตัดตามตัวอักษรที่ตาเห็น ไม่ให้สระ/วรรณยุกต์ไทยหรืออิโมจิขาดครึ่ง
const segmenter = new Intl.Segmenter('th', { granularity: 'grapheme' })
export const clip = (text, max) =>
  typeof text === 'string'
    ? Array.from(segmenter.segment(text.slice(0, max * 12)), (s) => s.segment).slice(0, max).join('')
    : ''
