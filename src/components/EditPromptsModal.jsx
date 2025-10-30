import { useState, useEffect } from 'react';
import { X, Save, FileText, Plus } from 'lucide-react';

export default function EditPromptsModal({ isOpen, onClose, templates, onSave, onAdd, writingTypes }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateContent, setTemplateContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    writing_type: '',
    name: '',
    template_content: '',
    version: 1,
    notes: ''
  });

  useEffect(() => {
    if (templates && templates.length > 0 && !selectedTemplate && !isCreating) {
      setSelectedTemplate(templates[0]);
      setTemplateContent(templates[0].template_content);
    }
  }, [templates, selectedTemplate, isCreating]);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setTemplateContent(template.template_content);
  };

  const handleSave = async () => {
    if (!selectedTemplate) return;
    
    setIsSaving(true);
    try {
      await onSave(selectedTemplate.id, { template_content: templateContent });
      alert('Template saved successfully!');
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreate = async () => {
    if (!newTemplate.writing_type || !newTemplate.name || !newTemplate.template_content) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsSaving(true);
    try {
      await onAdd(newTemplate);
      setIsCreating(false);
      setNewTemplate({
        writing_type: '',
        name: '',
        template_content: '',
        version: 1,
        notes: ''
      });
      alert('Template created successfully!');
    } catch (error) {
      console.error('Error creating template:', error);
      alert('Failed to create template. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const startCreating = () => {
    setIsCreating(true);
    setSelectedTemplate(null);
  };

  const cancelCreating = () => {
    setIsCreating(false);
    setNewTemplate({
      writing_type: '',
      name: '',
      template_content: '',
      version: 1,
      notes: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Edit Prompt Templates</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col sm:flex-row">
          {/* Sidebar - Template List */}
          <div className="w-full sm:w-64 border-b sm:border-b-0 sm:border-r border-slate-200 overflow-y-auto bg-slate-50 p-4 max-h-48 sm:max-h-none">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Templates</h3>
              {onAdd && (
                <button
                  onClick={startCreating}
                  className="p-1 hover:bg-purple-100 rounded transition-colors"
                  title="Add New Template"
                >
                  <Plus className="w-4 h-4 text-purple-600" />
                </button>
              )}
            </div>
            <div className="space-y-2">
              {templates?.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    setIsCreating(false);
                    handleTemplateSelect(template);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedTemplate?.id === template.id && !isCreating
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="font-medium text-sm">{template.name}</div>
                  <div className={`text-xs mt-1 ${
                    selectedTemplate?.id === template.id && !isCreating ? 'text-indigo-100' : 'text-slate-500'
                  }`}>
                    {template.writing_type.replace('_', ' ')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Editor */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {isCreating ? (
              // Create New Template Form
              <>
                <div className="p-6 border-b border-slate-200 bg-white">
                  <h3 className="text-lg font-semibold text-slate-800">Create New Prompt Template</h3>
                  <p className="text-sm text-slate-600 mt-1">Define a new template for a writing type</p>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Writing Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newTemplate.writing_type}
                        onChange={(e) => setNewTemplate({...newTemplate, writing_type: e.target.value})}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select writing type...</option>
                        {writingTypes?.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Template Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newTemplate.name}
                        onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                        placeholder="e.g., Cold Email Template"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={newTemplate.notes}
                      onChange={(e) => setNewTemplate({...newTemplate, notes: e.target.value})}
                      placeholder="Any notes about this template..."
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Template Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={newTemplate.template_content}
                      onChange={(e) => setNewTemplate({...newTemplate, template_content: e.target.value})}
                      className="w-full h-80 p-4 font-mono text-sm text-slate-700 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
                      placeholder="Enter your prompt template here..."
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">Available Placeholders:</h4>
                    <div className="text-xs text-blue-800 space-y-1">
                      <p><code className="bg-blue-100 px-1 rounded">{'{profile.name}'}</code>, <code className="bg-blue-100 px-1 rounded">{'{profile.email}'}</code>, <code className="bg-blue-100 px-1 rounded">{'{profile.current_position}'}</code></p>
                      <p><code className="bg-blue-100 px-1 rounded">{'{companyName}'}</code>, <code className="bg-blue-100 px-1 rounded">{'{roleName}'}</code>, <code className="bg-blue-100 px-1 rounded">{'{roleLevel}'}</code></p>
                      <p><code className="bg-blue-100 px-1 rounded">{'{tone}'}</code>, <code className="bg-blue-100 px-1 rounded">{'{wordLimit}'}</code>, <code className="bg-blue-100 px-1 rounded">{'{specificDetails}'}</code></p>
                      <p><code className="bg-blue-100 px-1 rounded">{'{linkedinPersonInfo}'}</code>, <code className="bg-blue-100 px-1 rounded">{'{jobDescription}'}</code>, <code className="bg-blue-100 px-1 rounded">{'{companyInfo}'}</code></p>
                    </div>
                  </div>
                </div>
              </>
            ) : selectedTemplate && (
              <>
                <div className="p-6 border-b border-slate-200 bg-white">
                  <h3 className="text-lg font-semibold text-slate-800">{selectedTemplate.name}</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Writing Type: <span className="font-medium">{selectedTemplate.writing_type}</span> • 
                    Version: <span className="font-medium">{selectedTemplate.version}</span>
                  </p>
                  {selectedTemplate.notes && (
                    <p className="text-sm text-slate-500 mt-2 italic">{selectedTemplate.notes}</p>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <div className="bg-slate-100 px-4 py-2 border-b border-slate-200">
                      <p className="text-xs text-slate-600 font-medium">
                        Template Content (Use placeholders like {'{profile.name}'}, {'{companyName}'}, {'{wordLimit}'}, etc.)
                      </p>
                    </div>
                    <textarea
                      value={templateContent}
                      onChange={(e) => setTemplateContent(e.target.value)}
                      className="w-full h-96 p-4 font-mono text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      placeholder="Enter your prompt template here..."
                    />
                  </div>

                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">Available Placeholders:</h4>
                    <div className="text-xs text-blue-800 space-y-1">
                      <p><code className="bg-blue-100 px-1 rounded">{'{profile.name}'}</code>, <code className="bg-blue-100 px-1 rounded">{'{profile.email}'}</code>, <code className="bg-blue-100 px-1 rounded">{'{profile.current_position}'}</code></p>
                      <p><code className="bg-blue-100 px-1 rounded">{'{companyName}'}</code>, <code className="bg-blue-100 px-1 rounded">{'{roleName}'}</code>, <code className="bg-blue-100 px-1 rounded">{'{roleLevel}'}</code></p>
                      <p><code className="bg-blue-100 px-1 rounded">{'{tone}'}</code>, <code className="bg-blue-100 px-1 rounded">{'{wordLimit}'}</code>, <code className="bg-blue-100 px-1 rounded">{'{specificDetails}'}</code></p>
                      <p><code className="bg-blue-100 px-1 rounded">{'{linkedinPersonInfo}'}</code>, <code className="bg-blue-100 px-1 rounded">{'{jobDescription}'}</code>, <code className="bg-blue-100 px-1 rounded">{'{companyInfo}'}</code></p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 p-4 sm:p-6 border-t border-slate-200 bg-white">
          <button
            onClick={isCreating ? cancelCreating : onClose}
            className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors font-medium text-slate-700"
          >
            {isCreating ? 'Cancel' : 'Close'}
          </button>
          <button
            onClick={isCreating ? handleCreate : handleSave}
            disabled={isSaving || (isCreating ? (!newTemplate.writing_type || !newTemplate.name || !newTemplate.template_content) : !templateContent.trim())}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {isCreating ? 'Creating...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isCreating ? 'Create Template' : 'Save Template'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
