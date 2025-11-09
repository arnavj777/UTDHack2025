// Response Parser Utilities for Gemini API responses
// Handles parsing of text-based research reports into structured TypeScript objects

import type {
  ResearchData,
  MarketOverview,
  TargetAudience,
  CompetitiveAnalysis,
  MarketTrends,
  DemandAnalysis,
  ResearchSources,
  Insights,
  Competitor,
  CustomerSegment,
  Trend,
  Barrier,
  Source,
  MarketShareData,
  TargetSegmentPriority,
} from '../types/MarketResearch.types';

// ============================================================================
// Section Splitting Logic
// ============================================================================

/**
 * Splits the Gemini response into sections based on headers
 * Handles both ## and ### markdown headers
 */
export function splitIntoSections(response: string): Record<string, string> {
  const sections: Record<string, string> = {};
  
  // Normalize line endings and split into lines
  const lines = response.replace(/\r\n/g, '\n').split('\n');
  
  let currentSection = '';
  let currentContent: string[] = [];
  
  for (const line of lines) {
    // Check for section headers (## or ###)
    const headerMatch = line.match(/^#{2,3}\s+(.+)$/);
    
    if (headerMatch) {
      // Save previous section if it exists
      if (currentSection) {
        sections[currentSection] = currentContent.join('\n').trim();
      }
      
      // Start new section
      currentSection = headerMatch[1].trim().toUpperCase();
      currentContent = [];
    } else if (currentSection) {
      // Add content to current section
      currentContent.push(line);
    }
  }
  
  // Save the last section
  if (currentSection) {
    sections[currentSection] = currentContent.join('\n').trim();
  }
  
  return sections;
}

/**
 * Cleans markdown formatting from text
 */
function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold **text**
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic *text*
    .replace(/__([^_]+)__/g, '$1') // Remove bold __text__
    .replace(/_([^_]+)_/g, '$1') // Remove italic _text_
    .replace(/~~([^~]+)~~/g, '$1') // Remove strikethrough ~~text~~
    .replace(/`([^`]+)`/g, '$1') // Remove inline code `text`
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .trim();
}

/**
 * Extracts bullet points from text content
 */
function extractBulletPoints(text: string): string[] {
  const lines = text.split('\n');
  const bullets: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    // Match various bullet formats: -, *, •, or numbered lists
    const bulletMatch = trimmed.match(/^[-*•]\s+(.+)$/) || trimmed.match(/^\d+\.\s+(.+)$/);
    
    if (bulletMatch) {
      const cleaned = cleanMarkdown(bulletMatch[1].trim());
      if (cleaned && cleaned.length > 0) {
        bullets.push(cleaned);
      }
    }
  }
  
  return bullets;
}

/**
 * Extracts key-value pairs from text (e.g., "TAM: $50B")
 */
function extractKeyValue(text: string, key: string): string {
  const regex = new RegExp(`${key}[:\s]+([^,\n]+)`, 'i');
  const match = text.match(regex);
  if (match) {
    return cleanMarkdown(match[1].trim());
  }
  return 'N/A';
}

/**
 * Safely parses a maturity level
 */
function parseMaturity(text: string): 'emerging' | 'established' | 'mature' {
  const lower = text.toLowerCase();
  if (lower.includes('emerging')) return 'emerging';
  if (lower.includes('mature')) return 'mature';
  return 'established';
}

/**
 * Safely parses impact/severity level
 */
function parseLevel(text: string): 'high' | 'medium' | 'low' {
  const lower = text.toLowerCase();
  if (lower.includes('high')) return 'high';
  if (lower.includes('low')) return 'low';
  return 'medium';
}

// ============================================================================
// Market Overview Parser
// ============================================================================

export function parseMarketOverview(sectionText: string): MarketOverview {
  try {
    
    return {
      industryDescription: {
        size: extractKeyValue(sectionText, 'size') || extractKeyValue(sectionText, 'market size'),
        maturity: parseMaturity(sectionText),
        keyTrends: extractBulletPoints(sectionText).slice(0, 5) || ['Data not available'],
      },
      marketSize: {
        tam: extractKeyValue(sectionText, 'TAM'),
        sam: extractKeyValue(sectionText, 'SAM'),
        som: extractKeyValue(sectionText, 'SOM'),
      },
      growthRate: {
        cagr: extractKeyValue(sectionText, 'CAGR'),
        yoyGrowth: extractKeyValue(sectionText, 'YoY') || extractKeyValue(sectionText, 'year-over-year'),
      },
      regulatoryFactors: extractBulletPoints(sectionText).filter(item => 
        item.toLowerCase().includes('regulat') || 
        item.toLowerCase().includes('complian') ||
        item.toLowerCase().includes('legal')
      ) || ['No specific regulatory factors identified'],
    };
  } catch (error) {
    console.error('Error parsing market overview:', error);
    return getDefaultMarketOverview();
  }
}

function getDefaultMarketOverview(): MarketOverview {
  return {
    industryDescription: {
      size: 'N/A',
      maturity: 'established',
      keyTrends: ['Data not available'],
    },
    marketSize: {
      tam: 'N/A',
      sam: 'N/A',
      som: 'N/A',
    },
    growthRate: {
      cagr: 'N/A',
      yoyGrowth: 'N/A',
    },
    regulatoryFactors: ['No data available'],
  };
}

// ============================================================================
// Target Audience Parser
// ============================================================================

export function parseTargetAudience(sectionText: string): TargetAudience {
  try {
    const bullets = extractBulletPoints(sectionText);
    
    return {
      demographics: {
        age: extractKeyValue(sectionText, 'age'),
        gender: extractKeyValue(sectionText, 'gender'),
        income: extractKeyValue(sectionText, 'income'),
        education: extractKeyValue(sectionText, 'education'),
        occupation: bullets.filter(item => 
          item.toLowerCase().includes('occupation') || 
          item.toLowerCase().includes('job') ||
          item.toLowerCase().includes('profession')
        ).slice(0, 3) || ['N/A'],
      },
      psychographics: {
        interests: bullets.filter(item => item.toLowerCase().includes('interest')).slice(0, 5) || ['N/A'],
        values: bullets.filter(item => item.toLowerCase().includes('value')).slice(0, 5) || ['N/A'],
        motivations: bullets.filter(item => item.toLowerCase().includes('motivat')).slice(0, 5) || ['N/A'],
        lifestyle: extractKeyValue(sectionText, 'lifestyle') || 'N/A',
      },
      behavioralData: {
        purchaseHabits: bullets.filter(item => 
          item.toLowerCase().includes('purchase') || 
          item.toLowerCase().includes('buying')
        ).slice(0, 3) || ['N/A'],
        usageFrequency: extractKeyValue(sectionText, 'frequency') || extractKeyValue(sectionText, 'usage'),
        brandLoyalty: extractKeyValue(sectionText, 'loyalty') || 'N/A',
      },
      painPoints: bullets.filter(item => 
        item.toLowerCase().includes('pain') || 
        item.toLowerCase().includes('challenge') ||
        item.toLowerCase().includes('problem')
      ) || ['No pain points identified'],
      customerSegments: parseCustomerSegments(sectionText),
    };
  } catch (error) {
    console.error('Error parsing target audience:', error);
    return getDefaultTargetAudience();
  }
}

function parseCustomerSegments(text: string): CustomerSegment[] {
  const segments: CustomerSegment[] = [];
  const lines = text.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.toLowerCase().includes('segment')) {
      const name = line.replace(/^[-*•]\s*/, '').replace(/segment[:\s]*/i, '').trim();
      const description = lines[i + 1]?.trim() || 'No description available';
      const size = extractKeyValue(lines.slice(i, i + 3).join('\n'), 'size');
      
      if (name) {
        segments.push({ name, description, size });
      }
    }
  }
  
  return segments.length > 0 ? segments : [
    { name: 'General Market', description: 'No specific segments identified', size: 'N/A' }
  ];
}

function getDefaultTargetAudience(): TargetAudience {
  return {
    demographics: {
      age: 'N/A',
      gender: 'N/A',
      income: 'N/A',
      education: 'N/A',
      occupation: ['N/A'],
    },
    psychographics: {
      interests: ['N/A'],
      values: ['N/A'],
      motivations: ['N/A'],
      lifestyle: 'N/A',
    },
    behavioralData: {
      purchaseHabits: ['N/A'],
      usageFrequency: 'N/A',
      brandLoyalty: 'N/A',
    },
    painPoints: ['No data available'],
    customerSegments: [{ name: 'General Market', description: 'No data available', size: 'N/A' }],
  };
}

// ============================================================================
// Competitive Analysis Parser
// ============================================================================

export function parseCompetitiveAnalysis(sectionText: string): CompetitiveAnalysis {
  try {
    const bullets = extractBulletPoints(sectionText);
    const cleanedText = cleanMarkdown(sectionText);
    
    // Extract comparison data more intelligently
    const pricing: string[] = [];
    const features: string[] = [];
    const marketing: string[] = [];
    
    for (const bullet of bullets) {
      const lower = bullet.toLowerCase();
      if (lower.includes('price') || lower.includes('cost') || lower.includes('pricing') || lower.includes('$') || lower.includes('fee')) {
        if (!pricing.includes(bullet) && bullet.length > 10) {
          pricing.push(bullet);
        }
      } else if (lower.includes('feature') || lower.includes('functionality') || lower.includes('capability') || lower.includes('tool') || lower.includes('service')) {
        if (!features.includes(bullet) && bullet.length > 10) {
          features.push(bullet);
        }
      } else if (lower.includes('market') || lower.includes('brand') || lower.includes('advertis') || lower.includes('promot') || lower.includes('campaign')) {
        if (!marketing.includes(bullet) && bullet.length > 10 && !lower.includes('market share')) {
          marketing.push(bullet);
        }
      }
    }
    
    // If we didn't find enough, extract from the full text
    if (pricing.length === 0 || features.length === 0 || marketing.length === 0) {
      const lines = cleanedText.split('\n');
      let inComparison = false;
      
      for (const line of lines) {
        const lower = line.toLowerCase();
        if (lower.includes('comparison') || lower.includes('competitive comparison')) {
          inComparison = true;
          continue;
        }
        
        if (inComparison) {
          const cleaned = cleanMarkdown(line.trim());
          if (cleaned && cleaned.length > 5) {
            const bulletMatch = cleaned.match(/^[-*•]\s+(.+)$/);
            if (bulletMatch) {
              const item = bulletMatch[1].trim();
              const itemLower = item.toLowerCase();
              
              if (itemLower.includes('price') && pricing.length < 3) {
                pricing.push(item);
              } else if (itemLower.includes('feature') && features.length < 5) {
                features.push(item);
              } else if ((itemLower.includes('market') || itemLower.includes('brand')) && marketing.length < 3 && !itemLower.includes('share')) {
                marketing.push(item);
              }
            }
          }
        }
      }
    }
    
    return {
      directCompetitors: parseCompetitors(sectionText, 'direct'),
      indirectCompetitors: parseCompetitors(sectionText, 'indirect'),
      marketShare: parseMarketShare(sectionText),
      swotAnalysis: parseSWOT(sectionText),
      comparison: {
        pricing: pricing.length > 0 ? pricing.slice(0, 5) : ['Pricing information not available'],
        features: features.length > 0 ? features.slice(0, 5) : ['Feature comparison not available'],
        marketing: marketing.length > 0 ? marketing.slice(0, 5) : ['Marketing strategy comparison not available'],
      },
    };
  } catch (error) {
    console.error('Error parsing competitive analysis:', error);
    return getDefaultCompetitiveAnalysis();
  }
}

function parseCompetitors(text: string, type: 'direct' | 'indirect'): Competitor[] {
  const competitors: Competitor[] = [];
  const lines = text.split('\n');
  let inSection = false;
  let sectionLines: string[] = [];
  
  // Find the section
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    
    if (line.includes(type) && (line.includes('competitor') || line.includes('competition'))) {
      inSection = true;
      continue;
    }
    
    // Stop when we hit the next major section
    if (inSection && (
      (type === 'direct' && line.includes('indirect')) ||
      line.includes('market share') ||
      line.includes('swot') ||
      line.includes('comparison') ||
      line.match(/^#{2,3}\s/)
    )) {
      break;
    }
    
    if (inSection) {
      sectionLines.push(lines[i]);
    }
  }
  
  // Parse competitors - group by competitor blocks
  // Strategy: Identify competitor blocks by looking for bullet points that start with company names
  const competitorBlocks: string[][] = [];
  let currentBlock: string[] = [];
  let i = 0;
  
  while (i < sectionLines.length) {
    const originalLine = sectionLines[i];
    const cleaned = cleanMarkdown(originalLine.trim());
    
    if (!cleaned) {
      i++;
      continue;
    }
    
    // Check if this line starts a new competitor
    const bulletMatch = cleaned.match(/^[-*•]\s*(.+)$/);
    const isNumberedList = cleaned.match(/^\d+[\.)]\s*(.+)$/);
    
    if (bulletMatch || isNumberedList) {
      const content = bulletMatch ? bulletMatch[1] : (isNumberedList ? isNumberedList[1] : '');
      
      // Check if this looks like a company name (starts with capital, relatively short, or contains company indicators)
      const looksLikeCompanyName = 
        content.match(/^[A-Z][A-Za-z0-9\s&.,'-]{1,50}(?:Inc\.?|LLC|Corp\.?|Ltd\.?|Company|Corporation|Technologies|Systems|Solutions|Group|Labs|Software|Services)?:?\s*$/) ||
        (content.length < 50 && content.split(/\s+/).length <= 5 && content.match(/^[A-Z]/));
      
      // Check if next line is also a bullet (indicating a new competitor)
      const nextLine = i + 1 < sectionLines.length ? cleanMarkdown(sectionLines[i + 1].trim()) : '';
      const nextIsBullet = nextLine.match(/^[-*•]\s*[A-Z]/) || nextLine.match(/^\d+[\.)]\s*[A-Z]/);
      
      if (looksLikeCompanyName) {
        // This is a new competitor
        // Save previous block
        if (currentBlock.length > 0) {
          competitorBlocks.push([...currentBlock]);
        }
        // Start new block
        currentBlock = [cleaned];
        
        // Collect all following lines that belong to this competitor
        // Stop when we hit another bullet with a company name, or a section header
        i++;
        while (i < sectionLines.length) {
          const nextOriginalLine = sectionLines[i];
          const nextCleaned = cleanMarkdown(nextOriginalLine.trim());
          
          if (!nextCleaned) {
            i++;
            continue;
          }
          
          // Check if this is a new competitor or section
          const nextBulletMatch = nextCleaned.match(/^[-*•]\s*(.+)$/);
          const nextNumberedMatch = nextCleaned.match(/^\d+[\.)]\s*(.+)$/);
          const nextContent = nextBulletMatch ? nextBulletMatch[1] : (nextNumberedMatch ? nextNumberedMatch[1] : '');
          const nextLooksLikeCompany = nextContent.match(/^[A-Z][A-Za-z0-9\s&.,'-]{1,50}(?:Inc\.?|LLC|Corp\.?|Ltd\.?|Company|Corporation)?:?\s*$/) ||
                                      (nextContent.length < 50 && nextContent.split(/\s+/).length <= 5 && nextContent.match(/^[A-Z]/));
          
          const lower = nextCleaned.toLowerCase();
          const isNewSection = lower.match(/^(direct|indirect|market share|swot|comparison|strengths|weaknesses|opportunities|threats|pricing|features|marketing)/);
          
          if ((nextBulletMatch || nextNumberedMatch) && nextLooksLikeCompany) {
            // This is a new competitor, break and let outer loop handle it
            break;
          } else if (isNewSection) {
            // This is a new section, stop
            break;
          } else {
            // This is part of current competitor's description
            currentBlock.push(nextCleaned);
            i++;
          }
        }
        // Don't increment i here since we want to process the new competitor in the next iteration
        continue;
      } else if (currentBlock.length > 0) {
        // Not a company name, but we have a current block - add to description
        currentBlock.push(cleaned);
      }
    } else if (currentBlock.length > 0) {
      // Continuation line for current competitor
      const lower = cleaned.toLowerCase();
      if (!lower.match(/^(direct|indirect|market share|swot|comparison)/)) {
        currentBlock.push(cleaned);
      } else {
        // New section starting
        break;
      }
    }
    
    i++;
  }
  
  // Don't forget the last block
  if (currentBlock.length > 0) {
    competitorBlocks.push(currentBlock);
  }
  
  // Parse each competitor block
  for (const block of competitorBlocks) {
    if (block.length === 0) continue;
    
    // First line should be the competitor name
    const firstLine = block[0];
    const nameMatch = firstLine.match(/^[-*•]\s*(.+)$/) || 
                     firstLine.match(/^\d+[\.)]\s*(.+)$/) ||
                     firstLine.match(/^([A-Z][A-Za-z0-9\s&.,-]+(?:Inc|LLC|Corp|Ltd|Company|Corporation)?):?\s*$/);
    
    if (!nameMatch) continue;
    
    let name = cleanMarkdown(nameMatch[1].trim());
    
    // If name contains a colon or dash, split it to get just the company name
    if (name.includes(':') || name.includes('–') || name.includes('-')) {
      const parts = name.split(/[:–—-]/).map(p => p.trim());
      name = parts[0];
    }
    
    // Clean up name - remove common suffixes if they're not part of the actual name
    name = name.replace(/\s*:\s*$/, '').trim();
    
    if (!name || name.length < 2) continue;
    
    // Collect all description lines (everything after the name line)
    const descriptionParts: string[] = [];
    let marketPosition = '';
    
    // Extract description from the first line if it contains a colon or dash
    const firstLineFull = cleanMarkdown(firstLine);
    const nameWithDesc = firstLineFull.match(/^[-*•]\s*(.+?)[:–—-]\s*(.+)$/) || 
                         firstLineFull.match(/^\d+[\.)]\s*(.+?)[:–—-]\s*(.+)$/);
    
    if (nameWithDesc) {
      // Name and description are on the same line
      descriptionParts.push(nameWithDesc[2].trim());
    } else if (firstLineFull.includes(':') || firstLineFull.includes('–') || firstLineFull.includes('-')) {
      // Try splitting by delimiter
      const parts = firstLineFull.split(/[:–—-]/).map(p => p.trim()).filter(p => p.length > 0);
      if (parts.length > 1) {
        // Remove the bullet and name, keep the rest as description
        const withoutBullet = firstLineFull.replace(/^[-*•]\s*/, '').replace(/^\d+[\.)]\s*/, '');
        const namePart = name.trim();
        if (withoutBullet.startsWith(namePart)) {
          const descPart = withoutBullet.substring(namePart.length).replace(/^[:–—-]\s*/, '').trim();
          if (descPart && descPart.length > 0) {
            descriptionParts.push(descPart);
          }
        } else {
          descriptionParts.push(...parts.slice(1));
        }
      }
    }
    
    // Process all remaining lines in the block as part of this competitor's description
    for (let i = 1; i < block.length; i++) {
      const line = block[i].trim();
      if (!line) continue;
      
      const cleaned = cleanMarkdown(line);
      if (!cleaned || cleaned.length === 0) continue;
      
      // Skip lines that are clearly section headers or new competitors
      const lower = cleaned.toLowerCase();
      if (lower.match(/^(direct|indirect|market share|swot|comparison|strengths|weaknesses|opportunities|threats)/)) {
        break;
      }
      
      // Check if this line is a bullet point that starts a new competitor
      const isNewCompetitorBullet = cleaned.match(/^[-*•]\s*[A-Z]/) && 
                                     cleaned.match(/^[-*•]\s*[A-Z][A-Za-z0-9\s&.,'-]{1,40}(?:Inc|LLC|Corp|Ltd|Company)?:?\s*$/);
      
      if (isNewCompetitorBullet) {
        // This looks like a new competitor, stop processing
        break;
      }
      
      // Check if this line mentions market position
      if (lower.includes('position:') || lower.includes('market position:')) {
        const positionMatch = cleaned.match(/(?:position|market position)[:\s]+(.+)/i);
        if (positionMatch) {
          marketPosition = positionMatch[1].trim();
        }
      } else {
        // This is description content - add it
        // Remove any leading bullets that might have been missed
        const descLine = cleaned.replace(/^[-*•]\s+/, '').trim();
        if (descLine && descLine.length > 0) {
          descriptionParts.push(descLine);
        }
      }
    }
    
    // Combine all description parts into one cohesive description
    // Filter out parts that are just the company name or too short
    const filteredParts = descriptionParts.filter(part => {
      const partLower = part.toLowerCase();
      const nameLower = name.toLowerCase();
      // Don't include if it's just the company name or a very short fragment
      return part.length > 3 && 
             !partLower.startsWith(nameLower) && 
             partLower !== nameLower &&
             !part.match(/^(the|a|an)\s+$/i);
    });
    
    let description = filteredParts
      .join(' ')
      .replace(/\s+/g, ' ')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .trim();
    
    // Remove the company name if it appears at the start of the description
    const nameLower = name.toLowerCase();
    if (description.toLowerCase().startsWith(nameLower)) {
      description = description.substring(name.length).trim();
      description = description.replace(/^[:\-–—,]\s*/, '').trim();
    }
    
    // Clean up any redundant phrases
    description = description.replace(/\b(the|a|an)\s+company\b/gi, '').trim();
    description = description.replace(/\s+/g, ' ').trim();
    
    // Ensure we have a meaningful description
    if (!description || description.length < 20) {
      // If we have content in the block, try to use it even if it's short
      if (block.length > 1) {
        const allContent = block.slice(1)
          .map(line => cleanMarkdown(line.trim()))
          .filter(line => {
            const lineLower = line.toLowerCase();
            return line && 
                   line.length > 5 && 
                   !lineLower.includes('market share') &&
                   !lineLower.includes('swot') &&
                   !lineLower.match(/^[-*•]\s*[A-Z]/);
          })
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 300); // Limit length
        
        if (allContent && allContent.length > 10) {
          description = allContent;
        } else {
          description = `${name} is a ${type} competitor in this market segment with established presence and offerings.`;
        }
      } else {
        // No additional content, create a descriptive default
        description = `${name} is a ${type} competitor in this market segment, providing products or services that compete directly in this space.`;
      }
    }
    
    // Final cleanup - ensure description doesn't start with the company name again
    if (description.toLowerCase().startsWith(nameLower + ' ')) {
      description = description.substring(name.length + 1).trim();
    }
    
    // Extract market position from description if not already found
    if (!marketPosition || marketPosition.length < 3) {
      const descLower = description.toLowerCase();
      if (descLower.includes('market leader') || descLower.includes('dominant') || descLower.includes('leading')) {
        marketPosition = 'Market Leader';
      } else if (descLower.includes('emerging') || descLower.includes('growing') || descLower.includes('rising')) {
        marketPosition = 'Growing Competitor';
      } else if (descLower.includes('established') || descLower.includes('major')) {
        marketPosition = 'Established Competitor';
      } else {
        marketPosition = 'Active Competitor';
      }
    }
    
    // Final cleanup
    description = description.replace(/\*\*/g, '').replace(/\*/g, '').trim();
    marketPosition = cleanMarkdown(marketPosition);
    
    competitors.push({
      name: name.trim(),
      description: description.trim(),
      marketPosition: marketPosition.trim() || 'Active Competitor',
    });
  }
  
  // If we still didn't find competitors, try a simpler line-by-line approach
  if (competitors.length === 0) {
    for (let i = 0; i < sectionLines.length; i++) {
      const line = sectionLines[i];
      const cleaned = cleanMarkdown(line.trim());
      if (!cleaned) continue;
      
      const bulletMatch = cleaned.match(/^[-*•]\s*(.+)$/);
      if (bulletMatch) {
        const content = bulletMatch[1];
        // Try to split by common delimiters
        const parts = content.split(/[:–—-]/).map(p => p.trim()).filter(p => p.length > 0);
        if (parts.length > 0 && parts[0].length > 1) {
          const name = parts[0];
          const description = parts.slice(1).join(' - ').trim() || `${name} is a ${type} competitor in this market`;
          competitors.push({
            name: name,
            description: description.length > 10 ? description : `${name} competes in this market with relevant products and services.`,
            marketPosition: 'Active Competitor',
          });
        }
      }
    }
  }
  
  // Filter out invalid competitors and limit count
  const validCompetitors = competitors.filter(c => 
    c.name && 
    c.name.length > 1 && 
    c.name !== 'N/A' &&
    c.description &&
    c.description.length > 5
  );
  
  return validCompetitors.length > 0 ? validCompetitors.slice(0, 6) : [
    { name: 'No competitors identified', description: 'Competitive landscape data not available for this market segment.', marketPosition: 'N/A' }
  ];
}

function parseMarketShare(text: string): MarketShareData[] {
  const shares: MarketShareData[] = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    const cleaned = cleanMarkdown(line.trim());
    // Try various formats: "Company: 25%", "Company - 25%", "Company (25%)", etc.
    const patterns = [
      /([^:–—-]+)[:–—-]\s*(\d+[%])/i,
      /([^\(]+)\s*\((\d+%)\)/i,
      /([^:]+):\s*(\d+(?:\.\d+)?%)/i,
    ];
    
    for (const pattern of patterns) {
      const match = cleaned.match(pattern);
      if (match) {
        const competitor = cleanMarkdown(match[1].trim());
        const share = match[2].trim();
        if (competitor && competitor.length > 0 && competitor.length < 50) {
          shares.push({ competitor, share });
          break;
        }
      }
    }
  }
  
  return shares.length > 0 ? shares.slice(0, 10) : [
    { competitor: 'Market share data not available', share: 'N/A' }
  ];
}

function parseSWOT(text: string): CompetitiveAnalysis['swotAnalysis'] {
  const swot = {
    strengths: [] as string[],
    weaknesses: [] as string[],
    opportunities: [] as string[],
    threats: [] as string[],
  };
  
  const lines = text.split('\n');
  let currentCategory: keyof typeof swot | null = null;
  let categoryStarted = false;
  
  for (const line of lines) {
    const lower = line.toLowerCase().trim();
    const cleaned = cleanMarkdown(line.trim());
    
    // Check for category headers
    if (lower.includes('strength') && !categoryStarted) {
      currentCategory = 'strengths';
      categoryStarted = true;
      continue;
    } else if (lower.includes('weakness') && !categoryStarted) {
      currentCategory = 'weaknesses';
      categoryStarted = true;
      continue;
    } else if (lower.includes('opportunit') && !categoryStarted) {
      currentCategory = 'opportunities';
      categoryStarted = true;
      continue;
    } else if (lower.includes('threat') && !categoryStarted) {
      currentCategory = 'threats';
      categoryStarted = true;
      continue;
    }
    
    // Reset category if we hit another major section
    if (cleaned.match(/^#{2,3}\s/) || (lower.includes('comparison') && categoryStarted)) {
      categoryStarted = false;
      currentCategory = null;
      continue;
    }
    
    // Extract items for current category
    if (currentCategory && cleaned) {
      // Check for bullet points
      const bulletMatch = cleaned.match(/^[-*•]\s+(.+)$/);
      if (bulletMatch) {
        const item = cleanMarkdown(bulletMatch[1].trim());
        if (item && item.length > 3 && !item.toLowerCase().includes('strength') && !item.toLowerCase().includes('weakness') && !item.toLowerCase().includes('opportunit') && !item.toLowerCase().includes('threat')) {
          swot[currentCategory].push(item);
        }
      } else if (cleaned.match(/^\d+[\.)]\s+(.+)$/)) {
        // Numbered list
        const numberedMatch = cleaned.match(/^\d+[\.)]\s+(.+)$/);
        if (numberedMatch) {
          const item = cleanMarkdown(numberedMatch[1].trim());
          if (item && item.length > 3) {
            swot[currentCategory].push(item);
          }
        }
      }
    }
  }
  
  // If we didn't find much, try extracting from all bullet points
  if (swot.strengths.length === 0 && swot.weaknesses.length === 0 && 
      swot.opportunities.length === 0 && swot.threats.length === 0) {
    const bullets = extractBulletPoints(text);
    // Distribute bullets to categories based on keywords
    for (const bullet of bullets) {
      const lower = bullet.toLowerCase();
      if (lower.includes('strong') || lower.includes('advantage') || lower.includes('benefit')) {
        swot.strengths.push(bullet);
      } else if (lower.includes('weak') || lower.includes('disadvantage') || lower.includes('limitation')) {
        swot.weaknesses.push(bullet);
      } else if (lower.includes('opportunity') || lower.includes('potential') || lower.includes('growth')) {
        swot.opportunities.push(bullet);
      } else if (lower.includes('threat') || lower.includes('risk') || lower.includes('challenge')) {
        swot.threats.push(bullet);
      }
    }
  }
  
  // Ensure each category has at least one item, but use better defaults
  if (swot.strengths.length === 0) {
    swot.strengths.push('Market analysis in progress');
  }
  if (swot.weaknesses.length === 0) {
    swot.weaknesses.push('Market analysis in progress');
  }
  if (swot.opportunities.length === 0) {
    swot.opportunities.push('Market analysis in progress');
  }
  if (swot.threats.length === 0) {
    swot.threats.push('Market analysis in progress');
  }
  
  // Limit to reasonable number of items
  swot.strengths = swot.strengths.slice(0, 5);
  swot.weaknesses = swot.weaknesses.slice(0, 5);
  swot.opportunities = swot.opportunities.slice(0, 5);
  swot.threats = swot.threats.slice(0, 5);
  
  return swot;
}

function getDefaultCompetitiveAnalysis(): CompetitiveAnalysis {
  return {
    directCompetitors: [{ name: 'N/A', description: 'N/A', marketPosition: 'N/A' }],
    indirectCompetitors: [{ name: 'N/A', description: 'N/A', marketPosition: 'N/A' }],
    marketShare: [{ competitor: 'N/A', share: 'N/A' }],
    swotAnalysis: {
      strengths: ['No data available'],
      weaknesses: ['No data available'],
      opportunities: ['No data available'],
      threats: ['No data available'],
    },
    comparison: {
      pricing: ['N/A'],
      features: ['N/A'],
      marketing: ['N/A'],
    },
  };
}

// ============================================================================
// Market Trends Parser
// ============================================================================

export function parseMarketTrends(sectionText: string): MarketTrends {
  try {
    return {
      emergingTrends: parseTrends(sectionText),
      unmetNeeds: extractBulletPoints(sectionText).filter(item =>
        item.toLowerCase().includes('unmet') ||
        item.toLowerCase().includes('gap') ||
        item.toLowerCase().includes('need')
      ) || ['No unmet needs identified'],
      growthDrivers: {
        technological: extractBulletPoints(sectionText).filter(item =>
          item.toLowerCase().includes('tech') ||
          item.toLowerCase().includes('ai') ||
          item.toLowerCase().includes('automation')
        ) || ['N/A'],
        social: extractBulletPoints(sectionText).filter(item =>
          item.toLowerCase().includes('social') ||
          item.toLowerCase().includes('remote') ||
          item.toLowerCase().includes('collaboration')
        ) || ['N/A'],
        economic: extractBulletPoints(sectionText).filter(item =>
          item.toLowerCase().includes('economic') ||
          item.toLowerCase().includes('cost') ||
          item.toLowerCase().includes('efficiency')
        ) || ['N/A'],
      },
      barriersToEntry: parseBarriers(sectionText),
    };
  } catch (error) {
    console.error('Error parsing market trends:', error);
    return getDefaultMarketTrends();
  }
}

function parseTrends(text: string): Trend[] {
  const trends: Trend[] = [];
  const bullets = extractBulletPoints(text);
  
  for (const bullet of bullets) {
    if (bullet.toLowerCase().includes('trend')) {
      const parts = bullet.split(/[-:]/);
      trends.push({
        name: parts[0].trim(),
        description: parts[1]?.trim() || bullet,
        impact: parseLevel(bullet),
      });
    }
  }
  
  return trends.length > 0 ? trends : [
    { name: 'No trends identified', description: 'N/A', impact: 'medium' }
  ];
}

function parseBarriers(text: string): Barrier[] {
  const barriers: Barrier[] = [];
  const bullets = extractBulletPoints(text);
  
  for (const bullet of bullets) {
    if (bullet.toLowerCase().includes('barrier') || bullet.toLowerCase().includes('entry')) {
      const parts = bullet.split(/[-:]/);
      barriers.push({
        type: parts[0].trim(),
        description: parts[1]?.trim() || bullet,
        severity: parseLevel(bullet),
      });
    }
  }
  
  return barriers.length > 0 ? barriers : [
    { type: 'No barriers identified', description: 'N/A', severity: 'low' }
  ];
}

function getDefaultMarketTrends(): MarketTrends {
  return {
    emergingTrends: [{ name: 'N/A', description: 'N/A', impact: 'medium' }],
    unmetNeeds: ['No data available'],
    growthDrivers: {
      technological: ['N/A'],
      social: ['N/A'],
      economic: ['N/A'],
    },
    barriersToEntry: [{ type: 'N/A', description: 'N/A', severity: 'low' }],
  };
}

// ============================================================================
// Demand Analysis Parser
// ============================================================================

export function parseDemandAnalysis(sectionText: string): DemandAnalysis {
  try {
    const bullets = extractBulletPoints(sectionText);
    
    return {
      historicalDemand: {
        trends: bullets.filter(item =>
          item.toLowerCase().includes('trend') ||
          item.toLowerCase().includes('historical') ||
          item.toLowerCase().includes('growth')
        ).slice(0, 5) || ['No historical data available'],
        seasonalEffects: bullets.filter(item =>
          item.toLowerCase().includes('seasonal') ||
          item.toLowerCase().includes('cyclical')
        ) || ['No seasonal effects identified'],
      },
      adoptionCurve: {
        currentStage: extractKeyValue(sectionText, 'stage') || extractKeyValue(sectionText, 'adoption'),
        description: bullets.find(item => item.toLowerCase().includes('adoption'))?.trim() || 'N/A',
      },
      marketReadiness: {
        score: extractKeyValue(sectionText, 'readiness') || extractKeyValue(sectionText, 'score'),
        factors: bullets.filter(item =>
          item.toLowerCase().includes('ready') ||
          item.toLowerCase().includes('factor')
        ).slice(0, 5) || ['N/A'],
      },
      elasticity: {
        priceElasticity: extractKeyValue(sectionText, 'price elasticity') || 'N/A',
        featureElasticity: extractKeyValue(sectionText, 'feature elasticity') || 'N/A',
      },
    };
  } catch (error) {
    console.error('Error parsing demand analysis:', error);
    return getDefaultDemandAnalysis();
  }
}

function getDefaultDemandAnalysis(): DemandAnalysis {
  return {
    historicalDemand: {
      trends: ['No data available'],
      seasonalEffects: ['No data available'],
    },
    adoptionCurve: {
      currentStage: 'N/A',
      description: 'N/A',
    },
    marketReadiness: {
      score: 'N/A',
      factors: ['N/A'],
    },
    elasticity: {
      priceElasticity: 'N/A',
      featureElasticity: 'N/A',
    },
  };
}

// ============================================================================
// Research Sources Parser
// ============================================================================

export function parseResearchSources(sectionText: string): ResearchSources {
  try {
    const bullets = extractBulletPoints(sectionText);
    
    return {
      primaryResearch: {
        methods: bullets.filter(item =>
          item.toLowerCase().includes('survey') ||
          item.toLowerCase().includes('interview') ||
          item.toLowerCase().includes('focus group') ||
          item.toLowerCase().includes('primary')
        ) || ['No primary research methods specified'],
        description: bullets.find(item => item.toLowerCase().includes('primary'))?.trim() || 'N/A',
      },
      secondaryResearch: {
        sources: parseSources(sectionText),
      },
    };
  } catch (error) {
    console.error('Error parsing research sources:', error);
    return getDefaultResearchSources();
  }
}

function parseSources(text: string): Source[] {
  const sources: Source[] = [];
  const bullets = extractBulletPoints(text);
  
  for (const bullet of bullets) {
    if (bullet.toLowerCase().includes('report') ||
        bullet.toLowerCase().includes('database') ||
        bullet.toLowerCase().includes('study') ||
        bullet.toLowerCase().includes('secondary')) {
      const parts = bullet.split(/[-:]/);
      sources.push({
        type: parts[0].trim(),
        name: parts[1]?.trim() || bullet,
        description: parts[2]?.trim(),
      });
    }
  }
  
  return sources.length > 0 ? sources : [
    { type: 'General', name: 'No specific sources identified', description: 'N/A' }
  ];
}

function getDefaultResearchSources(): ResearchSources {
  return {
    primaryResearch: {
      methods: ['No data available'],
      description: 'N/A',
    },
    secondaryResearch: {
      sources: [{ type: 'N/A', name: 'N/A', description: 'N/A' }],
    },
  };
}

// ============================================================================
// Insights Parser
// ============================================================================

export function parseInsights(sectionText: string): Insights {
  try {
    const bullets = extractBulletPoints(sectionText);
    
    return {
      interpretation: bullets.filter(item =>
        item.toLowerCase().includes('interpret') ||
        item.toLowerCase().includes('means') ||
        item.toLowerCase().includes('indicates')
      ).slice(0, 5) || ['No interpretation available'],
      targetSegments: parseTargetSegments(sectionText),
      positioning: {
        strategy: extractKeyValue(sectionText, 'strategy') || extractKeyValue(sectionText, 'positioning'),
        differentiators: bullets.filter(item =>
          item.toLowerCase().includes('different') ||
          item.toLowerCase().includes('unique') ||
          item.toLowerCase().includes('advantage')
        ).slice(0, 5) || ['N/A'],
      },
      risks: bullets.filter(item =>
        item.toLowerCase().includes('risk') ||
        item.toLowerCase().includes('challenge') ||
        item.toLowerCase().includes('gap')
      ) || ['No risks identified'],
      opportunities: {
        shortTerm: bullets.filter(item =>
          item.toLowerCase().includes('short') ||
          item.toLowerCase().includes('immediate') ||
          item.toLowerCase().includes('quick')
        ).slice(0, 3) || ['N/A'],
        longTerm: bullets.filter(item =>
          item.toLowerCase().includes('long') ||
          item.toLowerCase().includes('future') ||
          item.toLowerCase().includes('strategic')
        ).slice(0, 3) || ['N/A'],
      },
    };
  } catch (error) {
    console.error('Error parsing insights:', error);
    return getDefaultInsights();
  }
}

function parseTargetSegments(text: string): TargetSegmentPriority[] {
  const segments: TargetSegmentPriority[] = [];
  const lines = text.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (line.includes('priority') || line.includes('target segment')) {
      const match = lines[i].match(/(\d+)/);
      const priority = match ? parseInt(match[1]) : 1;
      const segment = lines[i].replace(/^[-*•]\s*/, '').replace(/priority[:\s]*\d+/i, '').trim();
      const rationale = lines[i + 1]?.trim() || 'No rationale provided';
      
      if (segment) {
        segments.push({ segment, priority, rationale });
      }
    }
  }
  
  return segments.length > 0 ? segments : [
    { segment: 'General Market', priority: 1, rationale: 'No specific segments identified' }
  ];
}

function getDefaultInsights(): Insights {
  return {
    interpretation: ['No data available'],
    targetSegments: [{ segment: 'N/A', priority: 1, rationale: 'N/A' }],
    positioning: {
      strategy: 'N/A',
      differentiators: ['N/A'],
    },
    risks: ['No data available'],
    opportunities: {
      shortTerm: ['N/A'],
      longTerm: ['N/A'],
    },
  };
}

// ============================================================================
// Main Parser Function
// ============================================================================

/**
 * Main function to parse complete Gemini response into ResearchData
 * Handles malformed responses gracefully with default values
 */
export function parseGeminiResponse(response: string): ResearchData {
  try {
    // Split response into sections
    const sections = splitIntoSections(response);
    
    // Parse each section with fallback to defaults
    return {
      marketOverview: parseMarketOverview(
        sections['MARKET OVERVIEW'] || sections['1. MARKET OVERVIEW'] || ''
      ),
      targetAudience: parseTargetAudience(
        sections['TARGET AUDIENCE'] || sections['2. TARGET AUDIENCE'] || ''
      ),
      competitiveAnalysis: parseCompetitiveAnalysis(
        sections['COMPETITIVE ANALYSIS'] || sections['3. COMPETITIVE ANALYSIS'] || ''
      ),
      marketTrends: parseMarketTrends(
        sections['MARKET TRENDS'] || sections['4. MARKET TRENDS'] || ''
      ),
      demandAnalysis: parseDemandAnalysis(
        sections['DEMAND ANALYSIS'] || sections['5. DEMAND ANALYSIS'] || ''
      ),
      researchSources: parseResearchSources(
        sections['RESEARCH SOURCES'] || sections['6. RESEARCH SOURCES'] || ''
      ),
      insights: parseInsights(
        sections['INSIGHTS AND RECOMMENDATIONS'] || 
        sections['7. INSIGHTS AND RECOMMENDATIONS'] ||
        sections['INSIGHTS'] || 
        ''
      ),
    };
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    // Return complete default data structure if parsing fails
    return {
      marketOverview: getDefaultMarketOverview(),
      targetAudience: getDefaultTargetAudience(),
      competitiveAnalysis: getDefaultCompetitiveAnalysis(),
      marketTrends: getDefaultMarketTrends(),
      demandAnalysis: getDefaultDemandAnalysis(),
      researchSources: getDefaultResearchSources(),
      insights: getDefaultInsights(),
    };
  }
}

