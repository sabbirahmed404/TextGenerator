import { useState } from 'react';
import { Send, Copy, Check, Mail, Briefcase, Building2, FileText, Sparkles, MessageSquare } from 'lucide-react';
import { PROFILE } from '../data/profile';
import { WRITING_TYPES, ROLE_LEVELS, TONES } from '../data/constants';
import { generateSystemPrompt } from '../utils/promptGenerator';

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
    { id: 1, direction: 'received', text: '' }
  ]);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Update word limit and tone when writing type changes
  const handleWritingTypeChange = (type) => {
    setWritingType(type);
    const selectedType = WRITING_TYPES.find(t => t.value === type);
    if (selectedType) {
      const midIndex = Math.floor(selectedType.lengthOptions.length / 2);
      setWordLimit(selectedType.lengthOptions[midIndex]);
    }
    // Reset custom word limit
    setIsCustomWordLimit(false);
    setCustomWordLimit('');
    // Reset tone to first option for the type
    if (type === 'linkedin_message') {
      setTone('casual_professional');
    } else {
      setTone('professional');
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
    setConversationContext([
      ...conversationContext,
      { id: Date.now(), direction: 'received', text: '' }
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
      if (!companyName.trim() || !roleName.trim()) {
        alert('Please provide at least the company name and role!');
        return;
      }
    }

    setIsLoading(true);
    try {
      const params = {
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

      const systemPrompt = generateSystemPrompt(writingType, params);
      
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error('API key not found. Please add VITE_GEMINI_API_KEY to your .env file');
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
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

  const selectedType = WRITING_TYPES.find(t => t.value === writingType);
  const TypeIcon = selectedType?.icon || Mail;
  const isLinkedIn = writingType === 'linkedin_message';
  const availableTones = isLinkedIn ? TONES.linkedin : TONES.email;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-blue-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl mb-6 shadow-lg">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
              Sabbir's Application Generator
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-4">
              Professional applications that respect word limits and conversation context
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Input Section */}
          <div className="space-y-6">
            
            {/* Writing Type Selection */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <TypeIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-800">Writing Type</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {WRITING_TYPES.map((type) => {
                  const Icon = type.icon;
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
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-800">Tone {isLinkedIn && '(LinkedIn)'}</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {availableTones.map((toneOption) => (
                  <button
                    key={toneOption.value}
                    onClick={() => setTone(toneOption.value)}
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
                        onChange={(e) => setLinkedinPersonInfo(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Paste their LinkedIn profile info, company details, or what you know about them..."
                        className="w-full h-32 p-3 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/80 text-slate-700 placeholder-slate-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Position Level
                        </label>
                        <select
                          value={roleLevel}
                          onChange={(e) => setRoleLevel(e.target.value)}
                          className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/80 text-slate-700"
                        >
                          {ROLE_LEVELS.map(level => (
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
                          {selectedType?.lengthOptions.map(length => (
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
                          <select
                            value={msg.direction}
                            onChange={(e) => updateConversationMessage(msg.id, 'direction', e.target.value)}
                            className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80"
                          >
                            <option value="received">They sent ←</option>
                            <option value="sent">You sent →</option>
                          </select>
                          <textarea
                            value={msg.text}
                            onChange={(e) => updateConversationMessage(msg.id, 'text', e.target.value)}
                            placeholder={`Message ${index + 1}...`}
                            className="w-full h-20 p-3 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/80 text-slate-700 placeholder-slate-400 text-sm"
                          />
                        </div>
                        {conversationContext.length > 1 && (
                          <button
                            onClick={() => removeConversationMessage(msg.id)}
                            className="mt-8 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g., Cefalo, Brain Station 23"
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/80 text-slate-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Position Level *
                      </label>
                      <select
                        value={roleLevel}
                        onChange={(e) => setRoleLevel(e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white/80 text-slate-700"
                      >
                        {ROLE_LEVELS.map(level => (
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
                        {selectedType?.lengthOptions.map(length => (
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
                      Role/Position Title *
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
              disabled={isLoading || (isLinkedIn ? !linkedinPersonInfo.trim() : (!companyName.trim() || !roleName.trim()))}
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
                
                {generatedContent && (
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
                )}
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
