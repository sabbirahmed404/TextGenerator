import { useState, useEffect } from 'react';
import { Send, Copy, Check, Mail, Briefcase, Building2, FileText, Sparkles, MessageSquare, Clock, Save, Edit, User, Settings } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { getProfile, getWritingTypes, getTones, getRoleLevels, updateProfile, updatePromptTemplate, updateWritingType, addWritingType, deleteWritingType, updateTone, addTone, deleteTone, updateRoleLevel, addRoleLevel, deleteRoleLevel, getAllPromptTemplates } from '../utils/database';
import { generateDynamicPrompt } from '../utils/dynamicPromptGenerator';
import HistorySidebar from './HistorySidebar';
import EditProfileModal from './EditProfileModal';
import EditPromptsModal from './EditPromptsModal';
import EditConfigModal from './EditConfigModal';
import * as LucideIcons from 'lucide-react';

export default function InternshipAppGenerator() {
  const [writingType, setWritingType] = useState('cold_email');
  const [tone, setTone] = useState('professional');
  const [roleLevel, setRoleLevel] = useState('intern');
  const [companyName, setCompanyName] = useState('');
  const [roleName, setRoleName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [companyInfo, setCompanyInfo] = useState('');
  const [specificDetails, setSpecificDetails] = useState('');
  const [linkedinPersonInfo, setLinkedinPersonInfo] = useState('');
  const [wordLimit, setWordLimit] = useState(150);
  const [customWordLimit, setCustomWordLimit] = useState('');
  const [isCustomWordLimit, setIsCustomWordLimit] = useState(false);
  const [conversationContext, setConversationContext] = useState([
    { id: 1, direction: 'received', text: '', timestamp: '', datetime: '' }
  ]);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentHistoryId, setCurrentHistoryId] = useState(null);
  
  // Database data
  const [profile, setProfile] = useState(null);
  const [writingTypes, setWritingTypes] = useState([]);
  const [emailTones, setEmailTones] = useState([]);
  const [linkedinTones, setLinkedinTones] = useState([]);
  const [roleLevels, setRoleLevels] = useState([]);
  const [promptTemplates, setPromptTemplates] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPromptsModalOpen, setIsPromptsModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [configType, setConfigType] = useState(null);

  // Load data from database on mount
  useEffect(() => {
    loadDatabaseData();
  }, []);

  const loadDatabaseData = async () => {
    setIsLoadingData(true);
    try {
      const [profileData, typesData, emailTonesData, linkedinTonesData, levelsData, templatesData] = await Promise.all([
        getProfile(),
        getWritingTypes(),
        getTones('email'),
        getTones('linkedin'),
        getRoleLevels(),
        getAllPromptTemplates()
      ]);
      
      setProfile(profileData);
      setWritingTypes(typesData);
      setEmailTones(emailTonesData);
      setLinkedinTones(linkedinTonesData);
      setRoleLevels(levelsData);
      setPromptTemplates(templatesData);
    } catch (error) {
      console.error('Error loading database data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Reset history ID when user makes changes (to create new entries)
  const resetHistoryId = () => {
    if (currentHistoryId) {
      setCurrentHistoryId(null);
    }
  };

  // Update word limit and tone when writing type changes
  const handleWritingTypeChange = (type) => {
    setWritingType(type);
    resetHistoryId();
    const selectedType = writingTypes.find(t => t.value === type);
    if (selectedType && selectedType.length_options) {
      const midIndex = Math.floor(selectedType.length_options.length / 2);
      setWordLimit(selectedType.length_options[midIndex]);
    }
    // Reset custom word limit
    setIsCustomWordLimit(false);
    setCustomWordLimit('');
    // Reset tone to first option for the type
    if (type === 'linkedin_message') {
      setTone(linkedinTones[0]?.value || 'casual_professional');
    } else {
      setTone(emailTones[0]?.value || 'professional');
    }
  };

  const handleWordLimitChange = (value) => {
    if (value === 'custom') {
      setIsCustomWordLimit(true);
      setWordLimit(Number(customWordLimit) || 50);
    } else {
      setIsCustomWordLimit(false);
      setWordLimit(Number(value));
    }
  };

  const handleCustomWordLimitChange = (value) => {
    setCustomWordLimit(value);
    const numValue = Number(value);
    if (numValue > 0 && numValue <= 1000) {
      setWordLimit(numValue);
    }
  };

  const addConversationMessage = () => {
    // Smart default: alternate direction based on last message
    const lastMessage = conversationContext[conversationContext.length - 1];
    const newDirection = lastMessage.direction === 'sent' ? 'received' : 'sent';
    
    setConversationContext([
      ...conversationContext,
      { id: Date.now(), direction: newDirection, text: '', timestamp: '', datetime: '' }
    ]);
  };

  const removeConversationMessage = (id) => {
    if (conversationContext.length > 1) {
      setConversationContext(conversationContext.filter(msg => msg.id !== id));
    }
  };

  const updateConversationMessage = (id, field, value) => {
    setConversationContext(conversationContext.map(msg => 
      msg.id === id ? { ...msg, [field]: value } : msg
    ));
  };

  const generateContent = async () => {
    if (writingType === 'linkedin_message') {
      if (!linkedinPersonInfo.trim()) {
        alert('Please provide information about the person/company you\'re messaging!');
        return;
      }
    } else {
      if (!companyName.trim()) {
        alert('Please provide at least the company name!');
        return;
      }
    }

    setIsLoading(true);
    try {
      const params = {
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
      };

      const systemPrompt = await generateDynamicPrompt(params);
      
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error('API key not found. Please add VITE_GEMINI_API_KEY to your .env file');
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: systemPrompt
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2000,
            }
          })
        }
      );

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'API request failed');
      }
      
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      setGeneratedContent(content.trim());
      
      // Reset history ID before saving to create new entry
      setCurrentHistoryId(null);
      
      // Auto-save to history
      await saveToHistory(content.trim());
    } catch (error) {
      console.error('Error generating content:', error);
      setGeneratedContent('Sorry, there was an error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      generateContent();
    }
  };

  const saveToHistory = async (content = generatedContent) => {
    if (!content || !content.trim()) return;

    setIsSaving(true);
    try {
      // Generate a title based on the writing type and company/person
      let title = '';
      if (writingType === 'linkedin_message') {
        const personName = linkedinPersonInfo.split('\n')[0].substring(0, 50);
        title = `LinkedIn: ${personName}`;
      } else {
        title = `${WRITING_TYPES.find(t => t.value === writingType)?.label}: ${companyName || 'Untitled'}`;
      }

      const historyData = {
        writing_type: writingType,
        tone,
        role_level: roleLevel,
        word_limit: wordLimit,
        company_name: companyName || null,
        role_name: roleName || null,
        job_description: jobDescription || null,
        company_info: companyInfo || null,
        specific_details: specificDetails || null,
        linkedin_person_info: linkedinPersonInfo || null,
        conversation_context: writingType === 'linkedin_message' ? conversationContext : null,
        generated_content: content,
        title,
        is_favorite: false
      };

      if (currentHistoryId) {
        // Update existing history
        const { error } = await supabase
          .from('generation_history')
          .update({ ...historyData, updated_at: new Date().toISOString() })
          .eq('id', currentHistoryId);

        if (error) throw error;
      } else {
        // Create new history
        const { data, error } = await supabase
          .from('generation_history')
          .insert([historyData])
          .select();

        if (error) throw error;
        if (data && data[0]) {
          setCurrentHistoryId(data[0].id);
        }
      }
    } catch (error) {
      console.error('Error saving to history:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const loadFromHistory = (historyItem) => {
    setWritingType(historyItem.writing_type);
    setTone(historyItem.tone);
    setRoleLevel(historyItem.role_level);
    setWordLimit(historyItem.word_limit);
    setCompanyName(historyItem.company_name || '');
    setRoleName(historyItem.role_name || '');
    setJobDescription(historyItem.job_description || '');
    setCompanyInfo(historyItem.company_info || '');
    setSpecificDetails(historyItem.specific_details || '');
    setLinkedinPersonInfo(historyItem.linkedin_person_info || '');
    
    if (historyItem.conversation_context) {
      setConversationContext(historyItem.conversation_context);
    }
    
    setGeneratedContent(historyItem.generated_content || '');
    setCurrentHistoryId(historyItem.id);
    setIsSidebarOpen(false);
  };

  const createNew = () => {
    setWritingType('cold_email');
    setTone('professional');
    setRoleLevel('intern');
    setCompanyName('');
    setRoleName('');
    setJobDescription('');
    setCompanyInfo('');
    setSpecificDetails('');
    setLinkedinPersonInfo('');
    setWordLimit(150);
    setConversationContext([{ id: 1, direction: 'received', text: '', timestamp: '', datetime: '' }]);
    setGeneratedContent('');
    setCurrentHistoryId(null);
  };

  const selectedType = writingTypes.find(t => t.value === writingType);
  const TypeIcon = selectedType?.icon_name ? LucideIcons[selectedType.icon_name] || Mail : Mail;
  const isLinkedIn = writingType === 'linkedin_message';
  const availableTones = isLinkedIn ? linkedinTones : emailTones;
  
  // Handle config modal
  const openConfigModal = (type) => {
    setConfigType(type);
    setIsConfigModalOpen(true);
  };
  
  const getConfigData = () => {
    switch(configType) {
      case 'writing_types': return writingTypes;
      case 'tones': return [...emailTones, ...linkedinTones];
      case 'role_levels': return roleLevels;
      default: return [];
    }
  };
  
  const handleConfigSave = async (id, data) => {
    switch(configType) {
      case 'writing_types':
        await updateWritingType(id, data);
        break;
      case 'tones':
        await updateTone(id, data);
        break;
      case 'role_levels':
        await updateRoleLevel(id, data);
        break;
    }
    await loadDatabaseData();
  };
  
  const handleConfigAdd = async (data) => {
    switch(configType) {
      case 'writing_types':
        await addWritingType(data);
        break;
      case 'tones':
        await addTone(data);
        break;
      case 'role_levels':
        await addRoleLevel(data);
        break;
    }
    await loadDatabaseData();
  };
  
  const handleConfigDelete = async (id) => {
    switch(configType) {
      case 'writing_types':
        await deleteWritingType(id);
        break;
      case 'tones':
        await deleteTone(id);
        break;
      case 'role_levels':
        await deleteRoleLevel(id);
        break;
    }
    await loadDatabaseData();
  };
  
  const handleProfileSave = async (profileData) => {
    await updateProfile(profileData);
    await loadDatabaseData();
  };
  
  const handlePromptSave = async (id, data) => {
    await updatePromptTemplate(id, data);
    await loadDatabaseData();
  };
  
  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
      {/* Modals */}
      <EditProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSave={handleProfileSave}
      />
      
      <EditPromptsModal 
        isOpen={isPromptsModalOpen}
        onClose={() => setIsPromptsModalOpen(false)}
        templates={promptTemplates}
        onSave={handlePromptSave}
      />
      
      <EditConfigModal 
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        configType={configType}
        data={getConfigData()}
        onSave={handleConfigSave}
        onAdd={handleConfigAdd}
        onDelete={handleConfigDelete}
      />
      
      {/* History Sidebar */}
      <HistorySidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLoadHistory={loadFromHistory}
      />
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-blue-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl mb-6 shadow-lg">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent text-center">
                {profile?.name}'s Application Generator
              </h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="p-3 bg-white/70 backdrop-blur-sm hover:bg-white rounded-xl transition-all shadow-lg border border-white/20 group"
                  title="Edit Profile"
                >
                  <User className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={() => setIsPromptsModalOpen(true)}
                  className="p-3 bg-white/70 backdrop-blur-sm hover:bg-white rounded-xl transition-all shadow-lg border border-white/20 group"
                  title="Edit Prompts"
                >
                  <Edit className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={() => openConfigModal('writing_types')}
                  className="p-3 bg-white/70 backdrop-blur-sm hover:bg-white rounded-xl transition-all shadow-lg border border-white/20 group"
                  title="Edit Configuration"
                >
                  <Settings className="w-6 h-6 text-orange-600 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-3 bg-white/70 backdrop-blur-sm hover:bg-white rounded-xl transition-all shadow-lg border border-white/20 group"
                  title="View History"
                >
                  <Clock className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto mb-4 px-4 text-center">
              Professional applications that respect word limits and conversation context
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Input Section */}
          <div className="space-y-6">
            
            {/* Writing Type Selection */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <TypeIcon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-800">Writing Type</h2>
                </div>
                <button
                  onClick={() => openConfigModal('writing_types')}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Edit Writing Types"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {writingTypes.map((type) => {
                  const Icon = type.icon_name ? LucideIcons[type.icon_name] || Mail : Mail;
                  return (
                    <button
                      key={type.value}
                      onClick={() => handleWritingTypeChange(type.value)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        writingType === type.value
                          ? 'border-indigo-500 bg-indigo-50 shadow-md'
                          : 'border-slate-200 bg-white/50 hover:border-slate-300 hover:bg-white/70'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-5 h-5 text-indigo-600" />
                        <div className="font-medium text-slate-800">{type.label}</div>
                      </div>
                      <div className="text-sm text-slate-600">{type.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tone Selection */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-800">Tone {isLinkedIn && '(LinkedIn)'}</h2>
                </div>
                <button
                  onClick={() => openConfigModal('tones')}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Tones"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableTones.map((toneOption) => (
                  <button
                    key={toneOption.value}
                    onClick={() => {
                      setTone(toneOption.value);
                      resetHistoryId();
                    }}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      tone === toneOption.value
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-slate-200 bg-white/50 hover:border-slate-300 hover:bg-white/70'
                    }`}
                  >
                    <div className="font-medium text-slate-800">{toneOption.label}</div>
                    <div className="text-sm text-slate-600 mt-1">{toneOption.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Conditional Fields */}
            {isLinkedIn ? (
              // LinkedIn-specific fields
              <>
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-cyan-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-800">Person/Company Info</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Who are you messaging? *
                      </label>
                      <textarea
                        value={linkedinPersonInfo}
                        onChange={(e) => {
                          setLinkedinPersonInfo(e.target.value);
                          resetHistoryId();
                        }}
                        onKeyDown={handleKeyPress}
                        placeholder="Paste their LinkedIn profile info, company details, or what you know about them..."
                        className="w-full h-32 p-3 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/80 text-slate-700 placeholder-slate-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Position Level
                        </label>
                        <select
                          value={roleLevel}
                          onChange={(e) => setRoleLevel(e.target.value)}
                          className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/80 text-slate-700"
                        >
                          {roleLevels.map(level => (
                            <option key={level.value} value={level.value}>
                              {level.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Max Words
                        </label>
                        <select
                          value={isCustomWordLimit ? 'custom' : wordLimit}
                          onChange={(e) => handleWordLimitChange(e.target.value)}
                          className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/80 text-slate-700"
                        >
                          {selectedType?.length_options?.map(length => (
                            <option key={length} value={length}>
                              {length} words
                            </option>
                          ))}
                          <option value="custom">Custom</option>
                        </select>
                        {isCustomWordLimit && (
                          <input
                            type="number"
                            min="1"
                            max="1000"
                            value={customWordLimit}
                            onChange={(e) => handleCustomWordLimitChange(e.target.value)}
                            placeholder="Enter words (1-1000)"
                            className="w-full p-3 mt-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/80 text-slate-700"
                          />
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Additional Context (Optional)
                      </label>
                      <textarea
                        value={specificDetails}
                        onChange={(e) => setSpecificDetails(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Any specific details you want to mention?"
                        className="w-full h-20 p-3 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/80 text-slate-700 placeholder-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* LinkedIn Conversation Context */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-purple-600" />
                      </div>
                      <h2 className="text-2xl font-semibold text-slate-800">Conversation Context (Optional)</h2>
                    </div>
                    <button
                      onClick={addConversationMessage}
                      className="flex items-center gap-2 px-3 py-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors text-purple-700 font-medium text-sm"
                    >
                      <span className="text-lg">+</span>
                      Add
                    </button>
                  </div>

                  <p className="text-sm text-slate-600 mb-4">
                    If replying to existing messages, add them here for contextual response
                  </p>

                  <div className="space-y-3">
                    {conversationContext.map((msg, index) => (
                      <div key={msg.id} className="flex gap-3 items-start">
                        <div className="flex-1 space-y-2">
                          {/* Direction Toggle Buttons */}
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => updateConversationMessage(msg.id, 'direction', 'sent')}
                              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                                msg.direction === 'sent'
                                  ? 'bg-blue-500 text-white shadow-md'
                                  : 'bg-white/80 text-slate-600 border border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              You Sent →
                            </button>
                            <button
                              type="button"
                              onClick={() => updateConversationMessage(msg.id, 'direction', 'received')}
                              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                                msg.direction === 'received'
                                  ? 'bg-purple-500 text-white shadow-md'
                                  : 'bg-white/80 text-slate-600 border border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              ← They Sent
                            </button>
                          </div>
                          
                          {/* Message Text */}
                          <textarea
                            value={msg.text}
                            onChange={(e) => updateConversationMessage(msg.id, 'text', e.target.value)}
                            placeholder={`Message ${index + 1}...`}
                            className="w-full h-20 p-3 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/80 text-slate-700 placeholder-slate-400 text-sm"
                          />
                          
                          {/* Optional Timestamp */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={msg.timestamp || ''}
                              onChange={(e) => updateConversationMessage(msg.id, 'timestamp', e.target.value)}
                              placeholder="Timestamp (optional, e.g., '2 days ago')..."
                              className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 text-slate-600 placeholder-slate-400"
                            />
                            <input
                              type="datetime-local"
                              value={msg.datetime || ''}
                              onChange={(e) => {
                                updateConversationMessage(msg.id, 'datetime', e.target.value);
                                // Also update timestamp with formatted date/time if user wants
                                if (e.target.value) {
                                  const date = new Date(e.target.value);
                                  const formatted = date.toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                  });
                                  updateConversationMessage(msg.id, 'timestamp', formatted);
                                }
                              }}
                              className="w-full p-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 text-slate-600"
                              title="Pick date & time"
                            />
                          </div>
                        </div>
                        {conversationContext.length > 1 && (
                          <button
                            onClick={() => removeConversationMessage(msg.id)}
                            className="mt-1 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              // Email/Cover Letter fields
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-cyan-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-800">Application Details</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => {
                        setCompanyName(e.target.value);
                        resetHistoryId();
                      }}
                      placeholder="e.g., Cefalo, Brain Station 23"
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/80 text-slate-700"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Position Level *
                      </label>
                      <select
                        value={roleLevel}
                        onChange={(e) => setRoleLevel(e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/80 text-slate-700"
                      >
                        {roleLevels.map(level => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Max Words
                      </label>
                      <select
                        value={isCustomWordLimit ? 'custom' : wordLimit}
                        onChange={(e) => handleWordLimitChange(e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/80 text-slate-700"
                      >
                        {selectedType?.length_options?.map(length => (
                          <option key={length} value={length}>
                            {length} words
                          </option>
                        ))}
                        <option value="custom">Custom</option>
                      </select>
                      {isCustomWordLimit && (
                        <input
                          type="number"
                          min="1"
                          max="1000"
                          value={customWordLimit}
                          onChange={(e) => handleCustomWordLimitChange(e.target.value)}
                          placeholder="Enter words (1-1000)"
                          className="w-full p-3 mt-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/80 text-slate-700"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Role/Position Title
                    </label>
                    <input
                      type="text"
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      placeholder="e.g., Software Engineer Intern"
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/80 text-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Job Requirements (Optional)
                    </label>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Key requirements from job posting..."
                      className="w-full h-24 p-3 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/80 text-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Company Info (Optional)
                    </label>
                    <textarea
                      value={companyInfo}
                      onChange={(e) => setCompanyInfo(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="What you know about the company..."
                      className="w-full h-20 p-3 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/80 text-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Additional Details (Optional)
                    </label>
                    <textarea
                      value={specificDetails}
                      onChange={(e) => setSpecificDetails(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Specific things to mention..."
                      className="w-full h-20 p-3 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/80 text-slate-700"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={generateContent}
              disabled={isLoading || (isLinkedIn ? !linkedinPersonInfo.trim() : !companyName.trim())}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Generate (Max {wordLimit} words)
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 min-h-96">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-800">Generated Content</h2>
                </div>
                
                <div className="flex items-center gap-2">
                  {generatedContent && (
                    <>
                      <button
                        onClick={saveToHistory}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors text-indigo-700 font-medium disabled:opacity-50"
                        title="Save to History"
                      >
                        {isSaving ? (
                          <div className="w-4 h-4 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        {currentHistoryId ? 'Update' : 'Save'}
                      </button>
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-700 font-medium"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 text-green-600" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {generatedContent ? (
                <div className="bg-white/80 rounded-xl p-6 border border-slate-200">
                  <pre className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed">
                    {generatedContent}
                  </pre>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <TypeIcon className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg">Your {selectedType?.label.toLowerCase()} will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
