const fs = require('fs');

// Read the file
const filePath = './products_categorized.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Define the new prices for each category
const priceMap = {
  'copa_mundo_2026': 97.90,
  'brasileirao': 96.90,
  'europa': 99.90,
  'asia_america': 89.90,
  'selecoes': 109.90,
  'novos': 109.90
};

// For each category, find and replace all price: values
Object.entries(priceMap).forEach(([category, newPrice]) => {
  // Match patterns like price: 199.90, price: 175.9, price: 209.9, etc.
  const regex = new RegExp(`(key: '${category}'[\\s\\S]*?products: \\[)([\\s\\S]*?)(\\]\\s*\\},?\\s*\\])`, 'g');
  
  content = content.replace(regex, (match, prefix, products, suffix) => {
    // Replace all price: X.XX occurrences within this category's products
    let updatedProducts = products.replace(/price:\s*\d+(\.\d+)?/g, `price: ${newPrice}`);
    return prefix + updatedProducts + suffix;
  });
});

fs.writeFileSync(filePath, content);
console.log('Prices updated successfully!');
