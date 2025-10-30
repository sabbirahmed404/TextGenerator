import { getPromptTemplate, getProfile, getTones } from './database';

/**
 * Replaces placeholders in a template with actual values
 */
const replacePlaceholders = (template, data) => {
  let result = template;
  
  // Replace all placeholders with actual values
  Object.keys(data).forEach(key => {
    const placeholder = `{${key}}`;
    const value = data[key] || '';
    result = result.split(placeholder).join(value);
  });
  
  return result;
};

/**
 * Generates dynamic prompt from database template
 */
export const generateDynamicPrompt = async ({
  writingType,
  roleLevel,
  companyName,
  roleName,
  jobDescription,
  companyInfo,
  specificDetails,
  linkedinPersonInfo,
  conversationContext,
  tone,
  wordLimit
}) => {
  try {
    // Determine context for tones (email or linkedin)
    const isLinkedIn = writingType === 'linkedin_message';
    const isFollowUp = writingType === 'follow_up';
    const hasConversationContext = isLinkedIn || isFollowUp;
    const toneContext = isLinkedIn ? 'linkedin' : 'email';
    
    // Fetch template, profile, and tones from database
    const [template, profile, tones] = await Promise.all([
      getPromptTemplate(writingType),
      getProfile(),
      getTones(toneContext)
    ]);

    if (!template) {
      throw new Error(`No template found for writing type: ${writingType}`);
    }

    if (!profile) {
      throw new Error('No profile found in database');
    }

    // Prepare role presentation based on level
    let rolePresentation = '';
    if (roleLevel === 'intern') {
      rolePresentation = `Present as: "I'm ${profile.name}, a final-year CS student at Green University of Bangladesh specializing in AI/ML and full-stack development."`;
    } else if (roleLevel === 'senior') {
      rolePresentation = `Present as: "I'm ${profile.name}, CTO & Lead Software Engineer at Codemypixel."`;
    } else {
      rolePresentation = `Present as: "I'm ${profile.name}, a Software Engineer specializing in AI/ML and full-stack development."`;
    }

    // Prepare conversation context for LinkedIn & Follow-up emails
    const hasConversation = conversationContext?.some(msg => msg.text.trim());
    let conversationHistory = '';
    let conversationRule1 = '';
    let conversationRule2 = '';
    let conversationRule3 = '';
    let criticalRule = '';
    
    if (hasConversationContext) {
      if (hasConversation) {
        const conversationString = conversationContext
          .filter(msg => msg.text.trim())
          .map(msg => {
            const sender = msg.direction === 'sent' ? `${profile.name} sent` : 'They sent';
            const timestamp = msg.timestamp ? ` (${msg.timestamp})` : '';
            return `[${sender}${timestamp}]: ${msg.text}`;
          })
          .join('\n');
        
        conversationHistory = `CONVERSATION HISTORY (READ CAREFULLY):
${conversationString}

CRITICAL: This is a ${isFollowUp ? 'FOLLOW-UP' : 'REPLY'} to their last message. You MUST:
1. Directly reference/respond to what they just said
2. Keep the conversational flow natural
3. Don't introduce yourself again if you already did
4. Build on the existing conversation`;
        
        conversationRule1 = 'Start by responding to their message - acknowledge what they said';
        conversationRule2 = 'Continue the conversation naturally';
        conversationRule3 = 'Next step or question based on conversation';
        criticalRule = 'MUST respond to their last message first';
      } else {
        conversationHistory = isFollowUp ? 'This is an INITIAL follow-up email.' : 'This is an INITIAL message.';
        conversationRule1 = isLinkedIn ? 'Start with casual greeting: "Hi [Name]," or "Hey [Name],"' : 'Start with professional greeting: "Dear [Name]," or "Respected [Name],"';
        conversationRule2 = isFollowUp ? 'Reference previous interaction (application/interview)' : 'Brief intro (1 line max)';
        conversationRule3 = isFollowUp ? 'Express continued interest and request update' : 'Simple ask or question';
        criticalRule = isLinkedIn ? 'Start with casual greeting' : 'Start with professional greeting';
      }
    }

    // Get tone description from database
    const toneObj = tones.find(t => t.value === tone);
    const toneDescription = toneObj ? `- ${toneObj.description}` : '';

    // Prepare profile data
    const topSkills = Array.isArray(profile.key_skills) 
      ? profile.key_skills.slice(0, 3).join(', ')
      : profile.key_skills;
    
    const keyAchievement = 'Built systems saving 2-3 hours daily, 500+ leads/month automation';
    const keyProjects = 'Built AI systems saving 2-3 hours daily, 500+ leads/month automation';
    const leadership = Array.isArray(profile.leadership) && profile.leadership.length > 0
      ? profile.leadership[0]
      : 'IEEE Best Executive Award';

    // Create data object for placeholder replacement
    const data = {
      'profile.name': profile.name,
      'profile.email': profile.email,
      'profile.phone': profile.phone,
      'profile.location': profile.location,
      'profile.linkedin': profile.linkedin,
      'profile.github': profile.github,
      'profile.website': profile.website,
      'profile.current_position': profile.current_position,
      'profile.education': profile.education,
      'profile.topSkills': topSkills,
      'profile.technical_stack': profile.technical_stack,
      'profile.keyAchievement': keyAchievement,
      'profile.keyProjects': keyProjects,
      'profile.leadership': leadership,
      
      'roleLevel': roleLevel,
      'rolePresentation': rolePresentation,
      'companyName': companyName || '[Company]',
      'roleName': roleName || '[Role]',
      'jobDescription': jobDescription ? `JOB REQUIREMENTS: ${jobDescription}` : '',
      'companyInfo': companyInfo ? `COMPANY INFO: ${companyInfo}` : '',
      'specificDetails': specificDetails ? `SPECIFIC DETAILS: ${specificDetails}` : '',
      'linkedinPersonInfo': linkedinPersonInfo || 'General outreach',
      'tone': tone,
      'toneDescription': toneDescription,
      'wordLimit': wordLimit,
      
      // LinkedIn-specific
      'conversationHistory': conversationHistory,
      'conversationRule1': conversationRule1,
      'conversationRule2': conversationRule2,
      'conversationRule3': conversationRule3,
      'criticalRule': criticalRule,
    };

    // Replace placeholders in template
    const prompt = replacePlaceholders(template.template_content, data);

    return prompt;
  } catch (error) {
    console.error('Error generating dynamic prompt:', error);
    throw error;
  }
};
