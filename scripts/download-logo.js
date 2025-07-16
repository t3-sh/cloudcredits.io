#!/usr/bin/env node
/**
 * Logo Download Script using Brandfetch API
 * 
 * This script downloads provider logos and extracts brand colors from Brandfetch.
 * It handles SVG and PNG formats, saves logos to the correct location, and returns
 * brand information including accent colors.
 * 
 * Usage:
 *   node scripts/download-logo.js <domain> <provider-slug>
 * 
 * Environment Variables:
 *   BRANDFETCH_API_KEY - Your Brandfetch API token
 * 
 * Example:
 *   node scripts/download-logo.js instabug.com instabug
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables from .claude/settings.local.json
function loadBrandfetchToken() {
  const settingsPath = path.join(process.cwd(), '.claude', 'settings.local.json');
  
  try {
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    return settings.env.BRANDFETCH_API_KEY;
  } catch (error) {
    console.error('Error loading Brandfetch API key from settings:', error.message);
    return process.env.BRANDFETCH_API_KEY;
  }
}

async function fetchBrandData(domain) {
  const token = loadBrandfetchToken();
  
  if (!token) {
    throw new Error('BRANDFETCH_API_KEY not found in environment variables or .claude/settings.local.json');
  }

  const options = {
    hostname: 'api.brandfetch.io',
    port: 443,
    path: `/v2/brands/${domain}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
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
          if (res.statusCode === 404) {
            resolve(null); // Brand not found, this is acceptable
            return;
          }
          
          if (res.statusCode !== 200) {
            reject(new Error(`Brandfetch API returned status ${res.statusCode}: ${data}`));
            return;
          }
          
          const response = JSON.parse(data);
          resolve(response);
        } catch (error) {
          reject(new Error(`Failed to parse Brandfetch response: ${error.message}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(new Error(`Brandfetch request failed: ${error.message}`));
    });
    
    req.end();
  });
}

async function downloadFile(url, outputPath) {
  const { spawn } = require('child_process');
  
  return new Promise((resolve, reject) => {
    const curl = spawn('curl', [
      '-L',              // Follow redirects
      '-s',              // Silent mode
      '-S',              // Show errors
      '-f',              // Fail on server errors
      '-o', outputPath,  // Output to file
      url
    ]);
    
    let errorOutput = '';
    
    curl.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    curl.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        // Clean up partial file
        fs.unlink(outputPath, () => {});
        reject(new Error(`curl failed with exit code ${code}: ${errorOutput}`));
      }
    });
    
    curl.on('error', (error) => {
      reject(new Error(`Failed to spawn curl: ${error.message}`));
    });
  });
}

function extractLogo(brandData) {
  if (!brandData || !brandData.logos || brandData.logos.length === 0) {
    return null;
  }
  
  // Prefer SVG format logos
  const svgLogo = brandData.logos.find(logo => {
    if (!logo.formats) return false;
    return logo.formats.some(format => format.format === 'svg');
  });
  
  if (svgLogo) {
    const svgFormat = svgLogo.formats.find(format => format.format === 'svg');
    return {
      url: svgFormat.src,
      format: 'svg',
      type: svgLogo.type
    };
  }
  
  // Fallback to high-quality PNG
  const pngLogo = brandData.logos.find(logo => {
    if (!logo.formats) return false;
    return logo.formats.some(format => format.format === 'png');
  });
  
  if (pngLogo) {
    // Find the highest quality PNG
    const pngFormats = pngLogo.formats.filter(format => format.format === 'png');
    const bestPng = pngFormats.reduce((best, current) => {
      const currentSize = (current.width || 0) * (current.height || 0);
      const bestSize = (best.width || 0) * (best.height || 0);
      return currentSize > bestSize ? current : best;
    });
    
    return {
      url: bestPng.src,
      format: 'png',
      type: pngLogo.type
    };
  }
  
  return null;
}

function extractAccentColor(brandData) {
  if (!brandData || !brandData.colors || brandData.colors.length === 0) {
    return '#2BDFDC'; // Default color
  }
  
  // Look for accent color first
  const accentColor = brandData.colors.find(color => color.type === 'accent');
  if (accentColor && accentColor.hex) {
    return accentColor.hex;
  }
  
  // Fallback to primary color
  const primaryColor = brandData.colors.find(color => color.type === 'primary');
  if (primaryColor && primaryColor.hex) {
    return primaryColor.hex;
  }
  
  // Use the first available color
  if (brandData.colors[0] && brandData.colors[0].hex) {
    return brandData.colors[0].hex;
  }
  
  return '#2BDFDC'; // Default color
}

async function downloadLogo(domain, providerSlug) {
  try {
    console.error(`Fetching brand data for: ${domain}`);
    
    const brandData = await fetchBrandData(domain);
    
    if (!brandData) {
      return {
        success: false,
        reason: 'Brand not found in Brandfetch',
        color: '#2BDFDC',
        logoDownloaded: false
      };
    }
    
    const logo = extractLogo(brandData);
    const accentColor = extractAccentColor(brandData);
    
    const result = {
      success: true,
      domain: domain,
      providerSlug: providerSlug,
      color: accentColor,
      logoDownloaded: false,
      brandData: {
        name: brandData.name || '',
        description: brandData.description || ''
      }
    };
    
    if (logo) {
      try {
        // Ensure the directory exists
        const logoDir = path.join(process.cwd(), 'public', 'images', 'providers');
        if (!fs.existsSync(logoDir)) {
          fs.mkdirSync(logoDir, { recursive: true });
        }
        
        // Always save as .svg extension, even for PNG files
        const outputPath = path.join(logoDir, `${providerSlug}.svg`);
        
        console.error(`Downloading logo from: ${logo.url}`);
        await downloadFile(logo.url, outputPath);
        
        result.logoDownloaded = true;
        result.logoPath = outputPath;
        result.logoFormat = logo.format;
        result.logoType = logo.type;
        
        console.error(`Logo saved to: ${outputPath}`);
      } catch (downloadError) {
        console.error(`Logo download failed: ${downloadError.message}`);
        result.logoDownloaded = false;
        result.downloadError = downloadError.message;
      }
    } else {
      result.logoDownloaded = false;
      result.reason = 'No suitable logo found in brand data';
    }
    
    return result;
    
  } catch (error) {
    return {
      success: false,
      error: error.message,
      color: '#2BDFDC',
      logoDownloaded: false
    };
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage: node scripts/download-logo.js <domain> <provider-slug>');
    console.error('Example: node scripts/download-logo.js instabug.com instabug');
    process.exit(1);
  }
  
  const domain = args[0];
  const providerSlug = args[1];
  
  // Basic domain validation
  if (!domain.includes('.')) {
    console.error('Error: Domain must be a valid domain name (e.g., example.com)');
    process.exit(1);
  }
  
  // Basic slug validation
  if (!/^[a-z0-9-]+$/.test(providerSlug)) {
    console.error('Error: Provider slug must contain only lowercase letters, numbers, and hyphens');
    process.exit(1);
  }
  
  try {
    const result = await downloadLogo(domain, providerSlug);
    
    // Output result as JSON to stdout
    console.log(JSON.stringify(result, null, 2));
    
    // Exit with appropriate code
    process.exit(result.success ? 0 : 1);
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}