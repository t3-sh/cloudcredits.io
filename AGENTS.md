# Code Agent Instructions for cloudcredits.io

IMPORTANT: only follow these instructions if you were asked to add a new program/deal (content update request). Otherwise, ignore this file.

## How to add a new provider and program

When a user requests adding a new provider or program, follow this systematic process to replicate the n8n workflow functionality:

### Step 1: Extract Program URL from Issue
1. From the GitHub issue description, extract the program URL
2. This should be a single, valid URL to the startup program page

### Step 2: Scrape and Process Program Content
1. **Primary Method**: Use the clean text scraping script (`scripts/scrape-clean-text.js`) for comprehensive extraction
2. **Fallback Methods**: If the script fails or content is insufficient, use WebFetch or WebSearch tools
3. The script automatically cleans scraping residue (headers, footers, navigation elements)
4. Focus on extracting only meaningful program information about the deal, offer, or startup program
5. Preserve all important details without changing wording

#### Clean Text Scraping Script Usage
Use the dedicated script for robust and clean content extraction:

**Script Location**: `scripts/scrape-clean-text.js`
**Usage**: 
```bash
node scripts/scrape-clean-text.js <url>
```

**Example Usage**:
```bash
node scripts/scrape-clean-text.js https://example.com/startup-program
```

**Script Features**:
- Uses BrowserQL (Browserless' recommended approach) for text extraction
- Automatically removes common navigation and footer elements
- Normalizes whitespace and formatting
- Returns clean, structured JSON output
- Handles authentication using `BROWSERLESS_API_KEY` from environment variables available to you.

is**Output Format**:
```json
{
  "url": "https://example.com/startup-program",
  "status": 200,
  "title": "Program Title",
  "metaDescription": "Program description",
  "content": "Clean text content without scraping residue...",
  "success": true,
  "contentLength": 1234
}
```

**Error Handling and Fallback Strategy**:
1. **Primary**: Try the clean text scraping script first
2. **Fallback 1**: If script fails (API error, timeout, or insufficient content), use WebFetch tool
3. **Fallback 2**: If WebFetch provides insufficient details, use WebSearch tool to find additional information
4. **Content Validation**: Ensure extracted content includes:
   - Program benefits and features
   - Eligibility requirements
   - Application process details
   - Pricing/value information
   - Contact or support information

**Script Technical Details**:
- Uses Browserless `/unblock` endpoint for full HTML extraction
- Employs `html-to-text` npm package for professional text conversion
- Automatically handles authentication via query parameter
- Skips navigation, header, footer, and script elements
- Returns structured data with metadata
- Extracts content from full HTML including expanded elements

### Step 3: Enrich Program Data
Use this exact prompt to enhance the program information:

**Prompt**: "You will be given the initial information about the offer/deal/startup program below. Do a thorough online search and enrich this data from official source as much as possible. Especially focus on sections such as benefits, eligibility, FAQs. 

IMPORTANT: Only consider official sources from the providers of the deal. 

IMPORTANT: Return the full report without references."

**Input format**: 
```
---
INITIAL DATA ABOUT DEAL FROM {original_url}
---

{cleaned_scraped_content}
```

Focus on:
- Benefits and features
- Eligibility requirements and restrictions
- Application process details
- Frequently asked questions
- Program duration and timelines
- Contact information and support

### Step 4: Generate Structured Data
Generate TWO separate data structures using these exact prompts:

#### A. Program Data (YAML)
Use this exact prompt to generate the program JSON:

**Prompt**: "You are given the scraped text from the offer page containing information about cloud providers' programs, credits, discounts, etc. Your responsibility is to parse the content into the predefined JSON structure and return formatted JSON.

RULES:
1. Parse as much information as possible from the given website content. Don't drop anything.
2. Write about providers as third party. So refer to them/their, etc, instead of us, our, etc.
3. CRITICAL: Make sure you assign the most appropriate tags from the ones defined in src/tags.ts (ALLOWED_TAGS array).
4. Refer to the good examples of existing programs."

**Input format**:
```
---
INITIAL PROGRAM DATA
---

{cleaned_scraped_content}

---
ENRICHED PROGRAM DATA
---

{enriched_program_data}
```

Create a comprehensive program file following this structure:
```yaml
provider_slug: "provider-name"
title: "Program Name"
meta_title: "SEO-friendly title"
intro: "Brief compelling description (1-2 lines)"
description: "Detailed program description"
status: "Active"
url: "https://program-url.com"
min_value: 1000
max_value: 50000
value_type: "credits" # or "discount"
currency: "USD" # if applicable
tags: ["relevant", "tags"]
date: 2025-01-15

tiers:
  - name: "Tier Name"
    intro: "Tier description"
    max_value: 10000
    url: "https://tier-url.com"
    benefits:
      - "Benefit 1"
      - "Benefit 2"
    benefits_level: 1-3
    duration: ["time period"]
    eligibility:
      - "Requirement 1"
      - "Requirement 2"
    effort_level: 1-3
    timeline_indication: "processing time"
    steps_to_apply:
      - name: "Step name"
        description: "Step description"
        action: "Action text"
        action_url: "https://action-url.com"

faq:
  - question: "Question?"
    answer: "Answer"
```

#### B. Provider Data (YAML)
Use this exact prompt to generate the provider JSON:

**Prompt**: "Based on the offer information, you must compile a summary YAML about provider. Only return final JSON and nothing else. It must follow the JSON schema strictly and it must respect the max size of fields in JSON schema (if set).

CRITICAL: Make sure you assign the most appropriate tags from the ones defined in src/tags.ts (ALLOWED_TAGS array).

Refer to the below good examples."

**Input format**:
```
---
OFFER DATA
---
{program_json_output}
```

**Reference Examples**:
- Scaleway example: Active European cloud provider with €36,000 credits, purple color #8C3FED, cloud/europe tags
- MongoDB example: Active document database with $500 credits, green color #00EC64, database tag

Create or update provider file:
```yaml
active: true
name: "Provider Name"
short_name: "Provider"
slug: "provider-slug"
url: "https://provider.com"
color: "#HEX-COLOR"
best_deal: "Brief description of best offer"
intro: "Provider description"
video: ""
tags: ["relevant", "tags"]
```

### Step 5: Handle Provider Logo
1. Check if provider already exists at `src/content/providers/{slug}.yaml`
2. If provider is new, use the logo download script to get logo and brand color:
   ```bash
   node scripts/download-logo.js <domain> <provider-slug>
   ```
   - Example: `node scripts/download-logo.js instabug.com instabug`
   - Script automatically downloads SVG format if available (or high-quality PNG)
   - Saves to `public/images/providers/{slug}.svg`
   - Returns brand color and logo information in JSON format
3. If logo cannot be found, proceed without logo (GitHub Action will handle any necessary notifications)

### Step 6: Create Files
1. **Provider file**: `src/content/providers/{slug}.yaml`
2. **Program file**: `src/content/programs/{slug}/{program-title-kebab-case}.yaml`
3. **Logo file** (if new provider): `public/images/providers/{slug}.svg`

### Step 7: Complete Process
1. Ensure all files are created with proper content and formatting
2. Validate that provider and program YAML files follow the specified structure
3. Confirm logo is downloaded (if applicable) and saved correctly
4. CRITICAL: before pushing any code try to build project first to make sure it builds with `pnpm run build`. Otherwise solve build issues first
5. The GitHub Action will automatically handle branch creation, commits, and PR creation

### Program Data Examples
Reference these exact examples when generating program data:

**Example 1 - Scaleway (Credits Program)**:
```json
{
  "provider_slug": "scaleway",
  "title": "Scaleway Startup Program",
  "meta_title": "Cloud Support for Startups",
  "intro": "Get up to €36,000 cost-coverage for cloud services with free consulting support from solution architects and access to a 800+ startup community",
  "description": "Time-limited cloud partnership program offering infrastructure credits, technical guidance, and community benefits for European startups at different growth stages. Participants gain access to Scaleway's partner ecosystem with over €250,000 in value.",
  "status": "Active",
  "url": "https://www.scaleway.com/en/startup-program/",
  "min_value": 1000,
  "max_value": 36000,
  "tags": ["cloud", "europe"],
  "date": "2025-02-25",
  "tiers": [
    {
      "name": "Founders Program",
      "intro": "For youngest projects launching in startup-friendly environment with initial cloud cost coverage",
      "max_value": 1000,
      "url": "https://www.scaleway.com/en/startup-program/",
      "benefits": [
        "€1,000 cloud credits over 1 year",
        "Technical content library and scaling resources",
        "Multi-cloud product access",
        "Dedicated Program Lead onboarding",
        "Access to Scaleway community Slack channel (800+ members)"
      ],
      "benefits_level": 1,
      "duration": ["1 year"],
      "eligibility": [
        "Early-stage startups",
        "Pre-revenue projects"
      ],
      "effort_level": 1,
      "timeline_indication": "7 business days",
      "steps_to_apply": [
        {
          "name": "Create Scaleway Account",
          "description": "Scaleway can't process your application without an account",
          "action": "Register",
          "action_url": "https://account.scaleway.com/register"
        },
        {
          "name": "Complete Application Form",
          "description": "Fill out the application form (~15 minutes)",
          "action": "Apply Now",
          "action_url": "https://www.scaleway.com/en/startup-program/"
        }
      ]
    }
  ],
  "faq": [
    {
      "question": "What is the Scaleway Startup Program?",
      "answer": "A time-limited cloud partnership program providing infrastructure credits and technical assistance. Participants leverage Scaleway's public cloud infrastructure along with advisory resources and community support."
    }
  ]
}
```

**Example 2 - HubSpot (Discount Program)**:
```json
{
  "provider_slug": "hubspot",
  "title": "HubSpot for Startups",
  "meta_title": "HubSpot for Startups - CloudCredits.io",
  "intro": "Eligible startups save 30%-75% on HubSpot's AI-powered CRM platform trusted by 248,000+ growing businesses",
  "description": "Multi-year discount program offering decreasing annual discounts on Professional/Enterprise CRM packages for qualified startups, with additional resources for fundraising and scaling operations.",
  "status": "Active",
  "url": "https://www.hubspot.com/startups",
  "min_value": 30,
  "max_value": 75,
  "value_type": "discount",
  "currency": "USD",
  "tags": ["crm", "sales", "marketing"],
  "date": "2025-02-25",
  "tiers": [
    {
      "name": "75% off year one",
      "intro": "Max discount for startups with up to $2M funding",
      "max_value": 75,
      "url": "https://www.hubspot.com/startups",
      "benefits": [
        "75% first-year discount",
        "50% second-year discount",
        "25% third-year discount"
      ],
      "benefits_level": 2,
      "duration": ["3 years"],
      "eligibility": [
        "Raised funding up to $2M",
        "Associated with one of HubSpot's approved VC, Incubator, or Accelerator partners"
      ],
      "effort_level": 3,
      "timeline_indication": "Immediate activation upon approval",
      "steps_to_apply": [
        {
          "name": "Apply Here",
          "description": "Apply for the program on HubSpot's website",
          "action": "Apply Now",
          "action_url": "https://app.hubspot.com/signup-hubspot/hubspot-for-startups"
        }
      ]
    }
  ]
}
```

### Provider Data Examples
Reference these exact examples when generating provider data:

**Scaleway Provider Example**:
```json
{
  "active": true,
  "name": "Scaleway",
  "short_name": "Scaleway",
  "slug": "scaleway",
  "url": "https://www.scaleway.com",
  "color": "#8C3FED",
  "best_deal": "Up to €36,000 credits for 1 year",
  "intro": "European cloud provider offering bare metal, compute, and storage with focus on developer experience.",
  "video": "",
  "tags": ["cloud", "europe"]
}
```

**MongoDB Provider Example**:
```json
{
  "active": true,
  "name": "MongoDB",
  "short_name": "MongoDB",
  "slug": "mongodb",
  "color": "#00EC64",
  "url": "https://www.mongodb.com",
  "intro": "A modern document database that empowers agile development with flexible schema design and global scalability.",
  "best_deal": "$500 credits for MongoDB Atlas",
  "video": "",
  "tags": ["database"]
}
```

### Important Guidelines:
- Write about providers in third person (they/their, not us/our)  
- Assign appropriate tags from the ALLOWED_TAGS array defined in src/tags.ts
- Follow existing examples for structure and formatting
- Use kebab-case for file names and slugs
- Ensure all URLs are valid and accessible
- Include comprehensive FAQ section when possible
- Set appropriate effort_level (1=easy, 2=medium, 3=hard) and benefits_level (1=basic, 2=good, 3=excellent)
- Always use current date in YYYY-MM-DD format
- Include value_type field for discount programs ("discount" vs "credits")
- Add currency field when applicable (USD, EUR, etc.)

### Available Tags:
CRITICAL: Use only tags from the ALLOWED_TAGS array defined in src/tags.ts. Before assigning tags, always reference this file to ensure you're using valid tags.

### File Structure:
```
src/content/
├── providers/
│   └── {slug}.yaml
├── programs/
│   └── {slug}/
│       └── {program-title}.yaml
public/images/providers/
└── {slug}.svg
```

### Logo Download Script Usage
Use the dedicated script for downloading provider logos and extracting brand colors:

**Script Location**: `scripts/download-logo.js`
**Usage**: 
```bash
node scripts/download-logo.js <domain> <provider-slug>
```

**Example Usage**:
```bash
node scripts/download-logo.js instabug.com instabug
```

**Script Features**:
- Uses Brandfetch API to fetch brand data and logos
- Automatically downloads SVG format logos (preferred) or high-quality PNG
- Handles redirects and follows download URLs properly
- Extracts accent colors from brand data
- Saves logos to `public/images/providers/{slug}.svg`
- Returns structured JSON output with brand information
- Handles authentication using `BRANDFETCH_API_KEY` from environment variables

**Output Format**:
```json
{
  "success": true,
  "domain": "instabug.com",
  "providerSlug": "instabug",
  "color": "#64b5f9",
  "logoDownloaded": true,
  "brandData": {
    "name": "Instabug",
    "description": "AI-powered mobile observability platform..."
  },
  "logoPath": "/path/to/public/images/providers/instabug.svg",
  "logoFormat": "svg",
  "logoType": "logo"
}
```

**Error Handling**:
- If Brandfetch API returns 404 or brand not found, returns success=false with default color
- If logo download fails, continues with brand color extraction but logoDownloaded=false
- Always returns a valid color (defaults to #2BDFDC if none found)
- Never fails the entire process due to logo issues - always provides usable output

**Script Technical Details**:
- Uses Brandfetch `/v2/brands/{domain}` endpoint for brand data
- Prefers SVG format logos over PNG for better scalability
- Uses curl with redirect following for reliable file downloads
- Automatically creates directory structure if needed
- Validates domain and provider slug inputs
# Claude Code Instructions for cloudcredits.io

IMPORTANT: only follow these instructions if you were asked to add a new program/deal (content update request). Otherwise, ignore this file.

## How to add a new provider and program

When a user requests adding a new provider or program, follow this systematic process to replicate the n8n workflow functionality:

### Step 1: Extract Program URL from Issue
1. From the GitHub issue description, extract the program URL
2. This should be a single, valid URL to the startup program page

### Step 2: Scrape and Process Program Content
1. **Primary Method**: Use the clean text scraping script (`scripts/scrape-clean-text.js`) for comprehensive extraction
2. **Fallback Methods**: If the script fails or content is insufficient, use WebFetch or WebSearch tools
3. The script automatically cleans scraping residue (headers, footers, navigation elements)
4. Focus on extracting only meaningful program information about the deal, offer, or startup program
5. Preserve all important details without changing wording

#### Clean Text Scraping Script Usage
Use the dedicated script for robust and clean content extraction:

**Script Location**: `scripts/scrape-clean-text.js`
**Usage**: 
```bash
node scripts/scrape-clean-text.js <url>
```

**Example Usage**:
```bash
node scripts/scrape-clean-text.js https://example.com/startup-program
```

**Script Features**:
- Uses BrowserQL (Browserless' recommended approach) for text extraction
- Automatically removes common navigation and footer elements
- Normalizes whitespace and formatting
- Returns clean, structured JSON output
- Handles authentication using `BROWSERLESS_API_KEY` from environment variables available to Claude.

is**Output Format**:
```json
{
  "url": "https://example.com/startup-program",
  "status": 200,
  "title": "Program Title",
  "metaDescription": "Program description",
  "content": "Clean text content without scraping residue...",
  "success": true,
  "contentLength": 1234
}
```

**Error Handling and Fallback Strategy**:
1. **Primary**: Try the clean text scraping script first
2. **Fallback 1**: If script fails (API error, timeout, or insufficient content), use WebFetch tool
3. **Fallback 2**: If WebFetch provides insufficient details, use WebSearch tool to find additional information
4. **Content Validation**: Ensure extracted content includes:
   - Program benefits and features
   - Eligibility requirements
   - Application process details
   - Pricing/value information
   - Contact or support information

**Script Technical Details**:
- Uses Browserless `/unblock` endpoint for full HTML extraction
- Employs `html-to-text` npm package for professional text conversion
- Automatically handles authentication via query parameter
- Skips navigation, header, footer, and script elements
- Returns structured data with metadata
- Extracts content from full HTML including expanded elements

### Step 3: Enrich Program Data
Use this exact prompt to enhance the program information:

**Prompt**: "You will be given the initial information about the offer/deal/startup program below. Do a thorough online search and enrich this data from official source as much as possible. Especially focus on sections such as benefits, eligibility, FAQs. 

IMPORTANT: Only consider official sources from the providers of the deal. 

IMPORTANT: Return the full report without references."

**Input format**: 
```
---
INITIAL DATA ABOUT DEAL FROM {original_url}
---

{cleaned_scraped_content}
```

Focus on:
- Benefits and features
- Eligibility requirements and restrictions
- Application process details
- Frequently asked questions
- Program duration and timelines
- Contact information and support

### Step 4: Generate Structured Data
Generate TWO separate data structures using these exact prompts:

#### A. Program Data (YAML)
Use this exact prompt to generate the program JSON:

**Prompt**: "You are given the scraped text from the offer page containing information about cloud providers' programs, credits, discounts, etc. Your responsibility is to parse the content into the predefined JSON structure and return formatted JSON.

RULES:
1. Parse as much information as possible from the given website content. Don't drop anything.
2. Write about providers as third party. So refer to them/their, etc, instead of us, our, etc.
3. CRITICAL: Make sure you assign the most appropriate tags from the ones defined in src/tags.ts (ALLOWED_TAGS array).
4. Refer to the good examples of existing programs."

**Input format**:
```
---
INITIAL PROGRAM DATA
---

{cleaned_scraped_content}

---
ENRICHED PROGRAM DATA
---

{enriched_program_data}
```

Create a comprehensive program file following this structure:
```yaml
provider_slug: "provider-name"
title: "Program Name"
meta_title: "SEO-friendly title"
intro: "Brief compelling description (1-2 lines)"
description: "Detailed program description"
status: "Active"
url: "https://program-url.com"
min_value: 1000
max_value: 50000
value_type: "credits" # or "discount"
currency: "USD" # if applicable
tags: ["relevant", "tags"]
date: 2025-01-15

tiers:
  - name: "Tier Name"
    intro: "Tier description"
    max_value: 10000
    url: "https://tier-url.com"
    benefits:
      - "Benefit 1"
      - "Benefit 2"
    benefits_level: 1-3
    duration: ["time period"]
    eligibility:
      - "Requirement 1"
      - "Requirement 2"
    effort_level: 1-3
    timeline_indication: "processing time"
    steps_to_apply:
      - name: "Step name"
        description: "Step description"
        action: "Action text"
        action_url: "https://action-url.com"

faq:
  - question: "Question?"
    answer: "Answer"
```

#### B. Provider Data (YAML)
Use this exact prompt to generate the provider JSON:

**Prompt**: "Based on the offer information, you must compile a summary YAML about provider. Only return final JSON and nothing else. It must follow the JSON schema strictly and it must respect the max size of fields in JSON schema (if set).

CRITICAL: Make sure you assign the most appropriate tags from the ones defined in src/tags.ts (ALLOWED_TAGS array).

Refer to the below good examples."

**Input format**:
```
---
OFFER DATA
---
{program_json_output}
```

**Reference Examples**:
- Scaleway example: Active European cloud provider with €36,000 credits, purple color #8C3FED, cloud/europe tags
- MongoDB example: Active document database with $500 credits, green color #00EC64, database tag

Create or update provider file:
```yaml
active: true
name: "Provider Name"
short_name: "Provider"
slug: "provider-slug"
url: "https://provider.com"
color: "#HEX-COLOR"
best_deal: "Brief description of best offer"
intro: "Provider description"
video: ""
tags: ["relevant", "tags"]
```

### Step 5: Handle Provider Logo
1. Check if provider already exists at `src/content/providers/{slug}.yaml`
2. If provider is new, use the logo download script to get logo and brand color:
   ```bash
   node scripts/download-logo.js <domain> <provider-slug>
   ```
   - Example: `node scripts/download-logo.js instabug.com instabug`
   - Script automatically downloads SVG format if available (or high-quality PNG)
   - Saves to `public/images/providers/{slug}.svg`
   - Returns brand color and logo information in JSON format
3. If logo cannot be found, proceed without logo (GitHub Action will handle any necessary notifications)

### Step 6: Create Files
1. **Provider file**: `src/content/providers/{slug}.yaml`
2. **Program file**: `src/content/programs/{slug}/{program-title-kebab-case}.yaml`
3. **Logo file** (if new provider): `public/images/providers/{slug}.svg`

### Step 7: Complete Process
1. Ensure all files are created with proper content and formatting
2. Validate that provider and program YAML files follow the specified structure
3. Confirm logo is downloaded (if applicable) and saved correctly
4. CRITICAL: before pushing any code try to build project first to make sure it builds with `pnpm run build`. Otherwise solve build issues first
5. The GitHub Action will automatically handle branch creation, commits, and PR creation

### Program Data Examples
Reference these exact examples when generating program data:

**Example 1 - Scaleway (Credits Program)**:
```json
{
  "provider_slug": "scaleway",
  "title": "Scaleway Startup Program",
  "meta_title": "Cloud Support for Startups",
  "intro": "Get up to €36,000 cost-coverage for cloud services with free consulting support from solution architects and access to a 800+ startup community",
  "description": "Time-limited cloud partnership program offering infrastructure credits, technical guidance, and community benefits for European startups at different growth stages. Participants gain access to Scaleway's partner ecosystem with over €250,000 in value.",
  "status": "Active",
  "url": "https://www.scaleway.com/en/startup-program/",
  "min_value": 1000,
  "max_value": 36000,
  "tags": ["cloud", "europe"],
  "date": "2025-02-25",
  "tiers": [
    {
      "name": "Founders Program",
      "intro": "For youngest projects launching in startup-friendly environment with initial cloud cost coverage",
      "max_value": 1000,
      "url": "https://www.scaleway.com/en/startup-program/",
      "benefits": [
        "€1,000 cloud credits over 1 year",
        "Technical content library and scaling resources",
        "Multi-cloud product access",
        "Dedicated Program Lead onboarding",
        "Access to Scaleway community Slack channel (800+ members)"
      ],
      "benefits_level": 1,
      "duration": ["1 year"],
      "eligibility": [
        "Early-stage startups",
        "Pre-revenue projects"
      ],
      "effort_level": 1,
      "timeline_indication": "7 business days",
      "steps_to_apply": [
        {
          "name": "Create Scaleway Account",
          "description": "Scaleway can't process your application without an account",
          "action": "Register",
          "action_url": "https://account.scaleway.com/register"
        },
        {
          "name": "Complete Application Form",
          "description": "Fill out the application form (~15 minutes)",
          "action": "Apply Now",
          "action_url": "https://www.scaleway.com/en/startup-program/"
        }
      ]
    }
  ],
  "faq": [
    {
      "question": "What is the Scaleway Startup Program?",
      "answer": "A time-limited cloud partnership program providing infrastructure credits and technical assistance. Participants leverage Scaleway's public cloud infrastructure along with advisory resources and community support."
    }
  ]
}
```

**Example 2 - HubSpot (Discount Program)**:
```json
{
  "provider_slug": "hubspot",
  "title": "HubSpot for Startups",
  "meta_title": "HubSpot for Startups - CloudCredits.io",
  "intro": "Eligible startups save 30%-75% on HubSpot's AI-powered CRM platform trusted by 248,000+ growing businesses",
  "description": "Multi-year discount program offering decreasing annual discounts on Professional/Enterprise CRM packages for qualified startups, with additional resources for fundraising and scaling operations.",
  "status": "Active",
  "url": "https://www.hubspot.com/startups",
  "min_value": 30,
  "max_value": 75,
  "value_type": "discount",
  "currency": "USD",
  "tags": ["crm", "sales", "marketing"],
  "date": "2025-02-25",
  "tiers": [
    {
      "name": "75% off year one",
      "intro": "Max discount for startups with up to $2M funding",
      "max_value": 75,
      "url": "https://www.hubspot.com/startups",
      "benefits": [
        "75% first-year discount",
        "50% second-year discount",
        "25% third-year discount"
      ],
      "benefits_level": 2,
      "duration": ["3 years"],
      "eligibility": [
        "Raised funding up to $2M",
        "Associated with one of HubSpot's approved VC, Incubator, or Accelerator partners"
      ],
      "effort_level": 3,
      "timeline_indication": "Immediate activation upon approval",
      "steps_to_apply": [
        {
          "name": "Apply Here",
          "description": "Apply for the program on HubSpot's website",
          "action": "Apply Now",
          "action_url": "https://app.hubspot.com/signup-hubspot/hubspot-for-startups"
        }
      ]
    }
  ]
}
```

### Provider Data Examples
Reference these exact examples when generating provider data:

**Scaleway Provider Example**:
```json
{
  "active": true,
  "name": "Scaleway",
  "short_name": "Scaleway",
  "slug": "scaleway",
  "url": "https://www.scaleway.com",
  "color": "#8C3FED",
  "best_deal": "Up to €36,000 credits for 1 year",
  "intro": "European cloud provider offering bare metal, compute, and storage with focus on developer experience.",
  "video": "",
  "tags": ["cloud", "europe"]
}
```

**MongoDB Provider Example**:
```json
{
  "active": true,
  "name": "MongoDB",
  "short_name": "MongoDB",
  "slug": "mongodb",
  "color": "#00EC64",
  "url": "https://www.mongodb.com",
  "intro": "A modern document database that empowers agile development with flexible schema design and global scalability.",
  "best_deal": "$500 credits for MongoDB Atlas",
  "video": "",
  "tags": ["database"]
}
```

### Important Guidelines:
- Write about providers in third person (they/their, not us/our)  
- Assign appropriate tags from the ALLOWED_TAGS array defined in src/tags.ts
- Follow existing examples for structure and formatting
- Use kebab-case for file names and slugs
- Ensure all URLs are valid and accessible
- Include comprehensive FAQ section when possible
- Set appropriate effort_level (1=easy, 2=medium, 3=hard) and benefits_level (1=basic, 2=good, 3=excellent)
- Always use current date in YYYY-MM-DD format
- Include value_type field for discount programs ("discount" vs "credits")
- Add currency field when applicable (USD, EUR, etc.)

### Available Tags:
CRITICAL: Use only tags from the ALLOWED_TAGS array defined in src/tags.ts. Before assigning tags, always reference this file to ensure you're using valid tags.

### File Structure:
```
src/content/
├── providers/
│   └── {slug}.yaml
├── programs/
│   └── {slug}/
│       └── {program-title}.yaml
public/images/providers/
└── {slug}.svg
```

### Logo Download Script Usage
Use the dedicated script for downloading provider logos and extracting brand colors:

**Script Location**: `scripts/download-logo.js`
**Usage**: 
```bash
node scripts/download-logo.js <domain> <provider-slug>
```

**Example Usage**:
```bash
node scripts/download-logo.js instabug.com instabug
```

**Script Features**:
- Uses Brandfetch API to fetch brand data and logos
- Automatically downloads SVG format logos (preferred) or high-quality PNG
- Handles redirects and follows download URLs properly
- Extracts accent colors from brand data
- Saves logos to `public/images/providers/{slug}.svg`
- Returns structured JSON output with brand information
- Handles authentication using `BRANDFETCH_API_KEY` from environment variables

**Output Format**:
```json
{
  "success": true,
  "domain": "instabug.com",
  "providerSlug": "instabug",
  "color": "#64b5f9",
  "logoDownloaded": true,
  "brandData": {
    "name": "Instabug",
    "description": "AI-powered mobile observability platform..."
  },
  "logoPath": "/path/to/public/images/providers/instabug.svg",
  "logoFormat": "svg",
  "logoType": "logo"
}
```

**Error Handling**:
- If Brandfetch API returns 404 or brand not found, returns success=false with default color
- If logo download fails, continues with brand color extraction but logoDownloaded=false
- Always returns a valid color (defaults to #2BDFDC if none found)
- Never fails the entire process due to logo issues - always provides usable output

**Script Technical Details**:
- Uses Brandfetch `/v2/brands/{domain}` endpoint for brand data
- Prefers SVG format logos over PNG for better scalability
- Uses curl with redirect following for reliable file downloads
- Automatically creates directory structure if needed
- Validates domain and provider slug inputs
