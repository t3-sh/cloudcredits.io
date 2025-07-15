#!/usr/bin/env node
/**
 * Clean Text Scraper using BrowserQL
 * 
 * This script uses Browserless' BrowserQL API to extract clean text content
 * from web pages, removing scraping residue and unnecessary elements.
 * 
 * Usage:
 *   node scripts/scrape-clean-text.js <url>
 * 
 * Environment Variables:
 *   BROWSERLESS_API_KEY - Your Browserless API token
 * 
 * Example:
 *   node scripts/scrape-clean-text.js https://example.com/startup-program
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { htmlToText } = require('html-to-text');

// Load environment variables from .claude/settings.local.json
function loadBrowserlessToken() {
  const settingsPath = path.join(process.cwd(), '.claude', 'settings.local.json');
  
  try {
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    return settings.env.BROWSERLESS_API_KEY;
  } catch (error) {
    console.error('Error loading Browserless API key from settings:', error.message);
    return process.env.BROWSERLESS_API_KEY;
  }
}

async function scrapeCleanText(url) {
  const token = loadBrowserlessToken();
  
  if (!token) {
    throw new Error('BROWSERLESS_API_KEY not found in environment variables or .claude/settings.local.json');
  }

  const requestBody = JSON.stringify({
    url: url,
    content: true,
    screenshot: false
  });

  const options = {
    hostname: 'production-sfo.browserless.io',
    port: 443,
    path: `/unblock?token=${token}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Content-Length': Buffer.byteLength(requestBody)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (response.error) {
            reject(new Error(`Browserless error: ${response.error}`));
            return;
          }
          
          if (!response.content) {
            reject(new Error('No content returned from Browserless /unblock'));
            return;
          }
          
          // Extract title from the HTML
          const titleMatch = response.content.match(/<title[^>]*>([^<]*)<\/title>/i);
          const title = titleMatch ? titleMatch[1] : '';
          
          // Use html-to-text with clean configuration
          const cleanText = htmlToText(response.content, {
            wordwrap: false,
            preserveNewlines: false,
            ignoreHref: true,
            ignoreImage: true,
            selectors: [
              // Skip navigation and layout elements
              { selector: 'nav', format: 'skip' },
              { selector: 'header', format: 'skip' },
              { selector: 'footer', format: 'skip' },
              { selector: 'script', format: 'skip' },
              { selector: 'style', format: 'skip' },
              { selector: 'noscript', format: 'skip' },
              { selector: '.nav', format: 'skip' },
              { selector: '.navigation', format: 'skip' },
              { selector: '.header', format: 'skip' },
              { selector: '.footer', format: 'skip' },
              { selector: '.breadcrumb', format: 'skip' },
              { selector: '.menu', format: 'skip' }
            ]
          });
          
          const result = {
            url: url,
            status: 200,
            title: title,
            metaDescription: '',
            content: cleanExtractedText(cleanText),
            success: true
          };
          
          resolve(result);
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });
    
    req.write(requestBody);
    req.end();
  });
}


// Clean and format the extracted text
function cleanExtractedText(content) {
  if (!content) return '';
  
  // Fix encoding issues
  let cleaned = content
    .replace(/���/g, "'")                    // Fix apostrophe encoding
    .replace(/â€™/g, "'")                   // Fix apostrophe encoding
    .replace(/â€œ/g, '"')                   // Fix quote encoding
    .replace(/â€/g, '"')                    // Fix quote encoding
    .replace(/\s+/g, ' ')                    // Replace multiple spaces with single space
    .replace(/\n\s*\n/g, '\n')              // Remove empty lines
    .replace(/\t/g, ' ')                     // Replace tabs with spaces
    .trim();                                 // Remove leading/trailing whitespace
  
  // Remove common navigation and footer elements
  const cleanupPatterns = [
    // Navigation patterns
    /^(Demo|Get Started|Products|Pricing|Blog|About|Contact|Home|Login|Sign up|Register)\s+/gi,
    /\s+(Demo|Get Started|Products|Pricing|Blog|About|Contact|Home|Login|Sign up|Register)$/gi,
    /^.*?(Iterate|Evaluate|Deploy|Monitor|Analytics|Gateway|Playground|Evaluations|Datasets|Deployments|Logs)\s+/gi,
    
    // Footer patterns
    /©\s*\d{4}.*$/gi,
    /All rights reserved.*$/gi,
    /\s+(GitHub|Twitter|LinkedIn|YouTube|Facebook|Instagram)\s*$/gi,
    /\s+(Documentation|API Reference|DPA|Report vulnerability|Connect|Resources|Wikipedia|Careers|Book a Demo)\s*$/gi,
    
    // Common web elements
    /Skip to main content/gi,
    /Skip to content/gi,
    /Cookie Policy/gi,
    /Privacy Policy/gi,
    /Terms of Service/gi,
    /Follow us on/gi,
    /Subscribe to our newsletter/gi,
    /Back to top/gi,
    /Menu/gi,
    /Navigation/gi,
    /Search/gi,
    /Footer/gi,
    /Header/gi,
    
    // Specific cleanup for common patterns
    /^.*?Products\s+Across\s+your\s+journey.*?Blog\s+/gi,
    /Start\s+your\s+journey.*?Get\s+Started\s*$/gi,
    /©.*?Connect.*?(GitHub|Twitter|LinkedIn|YouTube).*?$/gi,
    /Pillars.*?Connect.*?(GitHub|Twitter|LinkedIn|YouTube).*?$/gi
  ];
  
  cleanupPatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  // Remove excessive spacing and clean up sentence fragments
  cleaned = cleaned
    .replace(/\s+/g, ' ')                    // Normalize spaces again
    .replace(/\.\s*\.\s*/g, '. ')           // Fix double periods
    .replace(/\s+\./g, '.')                  // Fix spaces before periods
    .replace(/\s+,/g, ',')                   // Fix spaces before commas
    .replace(/\s+:/g, ':')                   // Fix spaces before colons
    .trim();
  
  return cleaned;
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node scripts/scrape-clean-text.js <url>');
    process.exit(1);
  }
  
  const url = args[0];
  
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    console.error('Error: URL must start with http:// or https://');
    process.exit(1);
  }
  
  try {
    console.error(`Scraping clean text from: ${url}`);
    
    const result = await scrapeCleanText(url);
    const cleanedContent = cleanExtractedText(result.content);
    
    // Output result as JSON to stdout
    const output = {
      url: result.url,
      status: result.status,
      title: result.title,
      metaDescription: result.metaDescription,
      content: cleanedContent,
      success: result.success,
      contentLength: cleanedContent.length
    };
    
    console.log(JSON.stringify(output, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}