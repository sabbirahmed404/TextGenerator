import { PROFILE } from '../data/profile';
import { ROLE_LEVELS, WRITING_TYPES } from '../data/constants';

/**
 * Generates the system prompt for LinkedIn messages
 */
export const generateLinkedInPrompt = ({
  roleLevel,
  linkedinPersonInfo,
  specificDetails,
  conversationContext,
  tone,
  wordLimit
}) => {
  // Determine how to present Sabbir's role based on target position
  let rolePresentation = '';
  if (roleLevel === 'intern') {
    rolePresentation = `Present as: "I'm Sabbir, a final-year CS student at Green University of Bangladesh specializing in AI/ML and full-stack development."`;
  } else if (roleLevel === 'senior') {
    rolePresentation = `Present as: "I'm Sabbir Ahmed, CTO & Lead Software Engineer at Codemypixel."`;
  } else {
    rolePresentation = `Present as: "I'm Sabbir Ahmed, a Software Engineer specializing in AI/ML and full-stack development."`;
  }

  // LinkedIn conversation context
  const hasConversation = conversationContext.some(msg => msg.text.trim());
  const conversationString = hasConversation 
    ? conversationContext
        .filter(msg => msg.text.trim())
        .map(msg => `[${msg.direction === 'sent' ? 'Sabbir sent' : 'They sent'}]: ${msg.text}`)
        .join('\n')
    : '';

  return `You are writing a LinkedIn message for Sabbir Ahmed.

TARGET ROLE LEVEL: ${ROLE_LEVELS.find(r => r.value === roleLevel)?.label}
${rolePresentation}

SABBIR'S KEY INFO:
- Education: Final-year CS student at Green University of Bangladesh
- Current Role: CTO & Lead Software Engineer at Codemypixel
- Top Skills: AI/ML, Full-Stack (React/Next.js/Node.js), SaaS Development
- Key Achievement: Built systems saving 2-3 hours daily, AI automations handling 500+ leads/month
- Leadership: IEEE Best Executive Award

${hasConversation ? `CONVERSATION HISTORY (READ CAREFULLY):
${conversationString}

CRITICAL: This is a REPLY to their last message. You MUST:
1. Directly reference/respond to what they just said
2. Keep the conversational flow natural
3. Don't introduce yourself again if you already did
4. Build on the existing conversation` : `This is an INITIAL message.`}

PERSON/COMPANY INFO:
${linkedinPersonInfo || 'General outreach'}

${specificDetails ? `ADDITIONAL CONTEXT: ${specificDetails}` : ''}

LINKEDIN MESSAGE RULES - FOLLOW EXACTLY:
1. ${hasConversation ? 'Start by responding to their message - acknowledge what they said' : 'Start with casual greeting: "Hi [Name]," or "Hey [Name],"'}
2. Keep it CONVERSATIONAL - like you're chatting, not writing an email
3. ${hasConversation ? 'Continue the conversation naturally' : 'Brief intro (1 line max)'}
4. Main point (1-2 sentences)
5. ${hasConversation ? 'Next step or question based on conversation' : 'Simple ask or question'}
6. End casually: "Looking forward to hearing from you!" or "Would love to connect!"
7. NO formal email signatures - just your first name: "Sabbir" or "Best, Sabbir"

WORD LIMIT: STRICTLY ${wordLimit} words maximum. COUNT EVERY WORD. If you go over, CUT content.

TONE: ${tone}
${tone === 'casual_professional' ? '- Friendly but professional, like talking to a colleague' : ''}
${tone === 'conversational' ? '- Natural and easy-going, like a real conversation' : ''}
${tone === 'direct' ? '- Brief and to the point, respectful but efficient' : ''}
${tone === 'warm' ? '- Genuine and approachable, build connection' : ''}
${tone === 'respectful' ? '- Polite and courteous, show appreciation' : ''}

CRITICAL RULES:
1. NO email format (no "Respected", no formal signatures)
2. NO long paragraphs - keep sentences short
3. ${hasConversation ? 'MUST respond to their last message first' : 'Start with casual greeting'}
4. Maximum ${wordLimit} words - COUNT and STAY UNDER
5. Sound human and natural
6. End with first name only

Generate ONLY the LinkedIn message. No explanations. No email format. Just the message.`;
};

/**
 * Generates the system prompt for cold emails
 */
export const generateColdEmailPrompt = ({
  roleLevel,
  companyName,
  roleName,
  jobDescription,
  companyInfo,
  specificDetails,
  tone,
  wordLimit
}) => {
  let rolePresentation = '';
  if (roleLevel === 'intern') {
    rolePresentation = '"I am Sabbir Ahmed, a final-year CS student at Green University of Bangladesh"';
  } else if (roleLevel === 'senior') {
    rolePresentation = '"I am Sabbir Ahmed, CTO & Lead Software Engineer at Codemypixel"';
  } else {
    rolePresentation = '"I am Sabbir Ahmed, a Software Engineer specializing in AI/ML and full-stack development"';
  }

  return `You are writing a Cold Email to HR for Sabbir Ahmed.

TARGET: ${companyName || '[Company]'} - ${roleName || '[Role]'}
TARGET LEVEL: ${ROLE_LEVELS.find(r => r.value === roleLevel)?.label}

${rolePresentation}

SABBIR'S PROFILE:
- Current: ${PROFILE.currentRole}
- Education: ${PROFILE.education}
- Key Skills: ${PROFILE.keySkills.slice(0, 3).join(', ')}
- Top Projects: Built AI systems saving 2-3 hours daily, 500+ leads/month automation
- Leadership: IEEE Best Executive Award

${companyInfo ? `COMPANY INFO: ${companyInfo}` : ''}
${jobDescription ? `JOB REQUIREMENTS: ${jobDescription}` : ''}
${specificDetails ? `SPECIFIC DETAILS: ${specificDetails}` : ''}

Generate a cold email following this structure:

SUBJECT: Brief, value-focused subject

Respected HR / Respected Hiring Manager,

PARAGRAPH 1: ${rolePresentation}

PARAGRAPH 2: Express interest in ${roleName || '[Role]'} at ${companyName || '[Company]'}

PARAGRAPH 3: 2-3 achievements with numbers (projects, impact)

PARAGRAPH 4: How you can contribute to their needs

CLOSING: Gratitude and request for discussion

Yours Faithfully,
Sabbir Ahmed
${PROFILE.phone} | ${PROFILE.email}
${PROFILE.linkedin}

WORD LIMIT: STRICTLY maximum ${wordLimit} words total

TONE: ${tone}
CRITICAL: Maximum ${wordLimit} words. COUNT every word and STAY UNDER the limit.

Generate ONLY the cold email. No explanations.`;
};

/**
 * Generates the system prompt for cover letters
 */
export const generateCoverLetterPrompt = ({
  roleLevel,
  companyName,
  roleName,
  jobDescription,
  companyInfo,
  specificDetails,
  tone,
  wordLimit
}) => {
  let rolePresentation = '';
  if (roleLevel === 'intern') {
    rolePresentation = 'Present as: "I\'m Sabbir, a final-year CS student at Green University of Bangladesh specializing in AI/ML and full-stack development."';
  } else if (roleLevel === 'senior') {
    rolePresentation = 'Present as: "I\'m Sabbir Ahmed, CTO & Lead Software Engineer at Codemypixel."';
  } else {
    rolePresentation = 'Present as: "I\'m Sabbir Ahmed, a Software Engineer specializing in AI/ML and full-stack development."';
  }

  return `You are writing a Cover Letter for Sabbir Ahmed.

TARGET: ${companyName || '[Company]'} - ${roleName || '[Role]'}
TARGET LEVEL: ${ROLE_LEVELS.find(r => r.value === roleLevel)?.label}

${rolePresentation}

SABBIR'S PROFILE:
- Current: ${PROFILE.currentRole}
- Education: ${PROFILE.education}
- Key Skills: ${PROFILE.keySkills.slice(0, 3).join(', ')}
- Top Projects: Built AI systems saving 2-3 hours daily, 500+ leads/month automation
- Leadership: IEEE Best Executive Award

${companyInfo ? `COMPANY INFO: ${companyInfo}` : ''}
${jobDescription ? `JOB REQUIREMENTS: ${jobDescription}` : ''}
${specificDetails ? `SPECIFIC DETAILS: ${specificDetails}` : ''}

Generate a formal cover letter:

Sabbir Ahmed
${PROFILE.location}
${PROFILE.email} | ${PROFILE.phone}

Date: [Current Date]

Respected [Name] / To Whom It May Concern,
${companyName || '[Company]'}

PARAGRAPH 1: Introduction + Interest in ${roleName || '[Role]'}
PARAGRAPH 2: 3-4 achievements with impact
PARAGRAPH 3: Fit & contribution
PARAGRAPH 4: Closing

Yours Faithfully,
Sabbir Ahmed

WORD LIMIT: STRICTLY maximum ${wordLimit} words total

TONE: ${tone}
CRITICAL: Maximum ${wordLimit} words. COUNT every word and STAY UNDER the limit.

Generate ONLY the cover letter. No explanations.`;
};

/**
 * Generates the system prompt for follow-up emails
 */
export const generateFollowUpPrompt = ({
  roleLevel,
  companyName,
  roleName,
  jobDescription,
  companyInfo,
  specificDetails,
  tone,
  wordLimit
}) => {
  let rolePresentation = '';
  if (roleLevel === 'intern') {
    rolePresentation = 'Present as: "I\'m Sabbir, a final-year CS student at Green University of Bangladesh specializing in AI/ML and full-stack development."';
  } else if (roleLevel === 'senior') {
    rolePresentation = 'Present as: "I\'m Sabbir Ahmed, CTO & Lead Software Engineer at Codemypixel."';
  } else {
    rolePresentation = 'Present as: "I\'m Sabbir Ahmed, a Software Engineer specializing in AI/ML and full-stack development."';
  }

  return `You are writing a Follow-up Email for Sabbir Ahmed.

TARGET: ${companyName || '[Company]'} - ${roleName || '[Role]'}
TARGET LEVEL: ${ROLE_LEVELS.find(r => r.value === roleLevel)?.label}

${rolePresentation}

SABBIR'S PROFILE:
- Current: ${PROFILE.currentRole}
- Education: ${PROFILE.education}
- Key Skills: ${PROFILE.keySkills.slice(0, 3).join(', ')}
- Top Projects: Built AI systems saving 2-3 hours daily, 500+ leads/month automation
- Leadership: IEEE Best Executive Award

${companyInfo ? `COMPANY INFO: ${companyInfo}` : ''}
${jobDescription ? `JOB REQUIREMENTS: ${jobDescription}` : ''}
${specificDetails ? `SPECIFIC DETAILS: ${specificDetails}` : ''}

Generate a follow-up email:

SUBJECT: Reference previous interaction

Respected [Name],

PARAGRAPH 1: Context + previous interaction
PARAGRAPH 2: Reaffirm interest + new value
PARAGRAPH 3: Request update

Thank you for your consideration.

Respectfully,
Sabbir Ahmed
${PROFILE.phone} | ${PROFILE.email}

WORD LIMIT: STRICTLY maximum ${wordLimit} words total

TONE: ${tone}
CRITICAL: Maximum ${wordLimit} words. COUNT every word and STAY UNDER the limit.

Generate ONLY the follow-up email. No explanations.`;
};

/**
 * Main function to generate system prompt based on writing type
 */
export const generateSystemPrompt = (writingType, params) => {
  switch (writingType) {
    case 'linkedin_message':
      return generateLinkedInPrompt(params);
    case 'cold_email':
      return generateColdEmailPrompt(params);
    case 'cover_letter':
      return generateCoverLetterPrompt(params);
    case 'follow_up':
      return generateFollowUpPrompt(params);
    default:
      throw new Error(`Unknown writing type: ${writingType}`);
  }
};
