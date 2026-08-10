const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'backend/controllers');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js') && f !== 'authController.js');

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace { hotelId: req.user.hotelId, ... } and variations
  content = content.replace(/,\s*hotelId:\s*req\.user\.hotelId/g, '');
  content = content.replace(/hotelId:\s*req\.user\.hotelId\s*,?/g, '');
  
  // Clean up any empty object queries that became empty {  }
  content = content.replace(/{\s*}/g, '{}');
  
  // Specific replacements for grcController and invoiceController
  content = content.replace(/const hotelId = req\.user\.hotelId(\s*\|\|\s*req\.user\._id)?;/g, '');
  content = content.replace(/const counterName = \grcNo_\$\{hotelId\}\;/g, 'const counterName = grcNo_zoox;');
  content = content.replace(/let counter = await GRCCounter\.findOne\({ name: counterName, hotelId }\);/g, 'let counter = await GRCCounter.findOne({ name: counterName });');
  content = content.replace(/,\s*hotelId\s*:\s*hotelId/g, '');
  content = content.replace(/hotelId\s*:\s*hotelId\s*,?/g, '');
  content = content.replace(/,\s*hotelId/g, '');
  content = content.replace(/const getCombinedStats = async \(start, end, source, hotelId\) => {/g, 'const getCombinedStats = async (start, end, source) => {');
  content = content.replace(/getCombinedStats\(start, end, source, hotelId\)/g, 'getCombinedStats(start, end, source)');
  content = content.replace(/getCombinedStats\(todayRange\.start, todayRange\.end, source, hotelId\)/g, 'getCombinedStats(todayRange.start, todayRange.end, source)');
  content = content.replace(/getCombinedStats\(monthRange\.start, monthRange\.end, source, hotelId\)/g, 'getCombinedStats(monthRange.start, monthRange.end, source)');
  content = content.replace(/getCombinedStats\(yearRange\.start, yearRange\.end, source, hotelId\)/g, 'getCombinedStats(yearRange.start, yearRange.end, source)');
  content = content.replace(/getCombinedStats\(dStart, dEnd, source, hotelId\)/g, 'getCombinedStats(dStart, dEnd, source)');
  content = content.replace(/getCombinedStats\(mStart, mEnd, source, hotelId\)/g, 'getCombinedStats(mStart, mEnd, source)');
  
  fs.writeFileSync(filePath, content);
}
console.log('Done!');
