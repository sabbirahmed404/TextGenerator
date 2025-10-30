import { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Edit2, ChevronDown, ChevronUp, Smile } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// Available Lucide icons for selection
const AVAILABLE_ICONS = [
  'Mail', 'FileText', 'Briefcase', 'Send', 'MessageSquare', 
  'Building2', 'User', 'Users', 'Phone', 'Linkedin', 
  'Twitter', 'Github', 'Globe', 'Heart', 'Star',
  'Zap', 'Target', 'TrendingUp', 'Award', 'BookOpen',
  'Calendar', 'Clock', 'Coffee', 'Edit', 'Eye',
  'Flag', 'Gift', 'Home', 'Image', 'Layers'
];

// Available context field types
const CONTEXT_FIELD_TYPES = [
  { value: 'text', label: 'Text Input', description: 'Single line text field' },
  { value: 'textarea', label: 'Text Area', description: 'Multi-line text field' },
  { value: 'conversation', label: 'Conversation Context', description: 'Message thread builder' },
  { value: 'select', label: 'Dropdown Select', description: 'Choose from predefined options' }
];

// Field name presets for quick selection
const FIELD_NAME_PRESETS = [
  { value: 'companyName', label: 'Company Name', type: 'text' },
  { value: 'roleName', label: 'Role Name', type: 'text' },
  { value: 'jobDescription', label: 'Job Description', type: 'textarea' },
  { value: 'companyInfo', label: 'Company Info', type: 'textarea' },
  { value: 'linkedinPersonInfo', label: 'Person/Company Info', type: 'textarea' },
  { value: 'conversationContext', label: 'Conversation Context', type: 'conversation' },
  { value: 'specificDetails', label: 'Additional Context', type: 'textarea' }
];

export default function EditWritingTypeModal({ isOpen, onClose, data, onSave, onAdd, onDelete, onOpenPromptEditor }) {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [iconSearchTerm, setIconSearchTerm] = useState('');
  const [customEmoji, setCustomEmoji] = useState('');
  const [showContextFields, setShowContextFields] = useState(false);

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  const handleEdit = (item) => {
    setEditingItem({ ...item, context_fields: item.context_fields || [] });
    setShowIconSelector(false);
    setCustomEmoji('');
  };

  const handleSaveItem = async () => {
    setIsSaving(true);
    try {
      // Validate required fields
      if (!editingItem.value || !editingItem.label) {
        alert('Value and Label are required!');
        return;
      }

      if (editingItem.id) {
        await onSave(editingItem.id, editingItem);
      } else {
        await onAdd(editingItem);
      }
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving writing type:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this writing type?')) {
      setIsSaving(true);
      try {
        await onDelete(id);
      } catch (error) {
        console.error('Error deleting:', error);
        alert('Failed to delete. Please try again.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleAddNew = () => {
    const newItem = {
      value: '',
      label: '',
      description: '',
      icon_name: '',
      length_options: [50, 75, 100, 150, 200],
      context_fields: [],
      display_order: items.length + 1
    };
    setEditingItem(newItem);
  };

  const updateEditingField = (fieldName, value) => {
    setEditingItem({
      ...editingItem,
      [fieldName]: value
    });
  };

  const selectIcon = (iconName) => {
    updateEditingField('icon_name', iconName);
    setShowIconSelector(false);
    setCustomEmoji('');
  };

  const selectEmoji = () => {
    if (customEmoji.trim()) {
      updateEditingField('icon_name', `emoji:${customEmoji.trim()}`);
      setShowIconSelector(false);
    }
  };

  const addContextField = () => {
    const newField = {
      field_name: '',
      label: '',
      type: 'text',
      required: false
    };
    updateEditingField('context_fields', [...(editingItem.context_fields || []), newField]);
  };

  const updateContextField = (index, field, value) => {
    const updatedFields = [...(editingItem.context_fields || [])];
    updatedFields[index] = { ...updatedFields[index], [field]: value };
    updateEditingField('context_fields', updatedFields);
  };

  const removeContextField = (index) => {
    const updatedFields = (editingItem.context_fields || []).filter((_, i) => i !== index);
    updateEditingField('context_fields', updatedFields);
  };

  const applyPreset = (index, preset) => {
    updateContextField(index, 'field_name', preset.value);
    updateContextField(index, 'label', preset.label);
    updateContextField(index, 'type', preset.type);
  };

  const filteredIcons = AVAILABLE_ICONS.filter(icon =>
    icon.toLowerCase().includes(iconSearchTerm.toLowerCase())
  );

  const renderIcon = (iconName) => {
    if (!iconName) return <LucideIcons.Mail className="w-5 h-5 text-slate-400" />;
    
    if (iconName.startsWith('emoji:')) {
      const emoji = iconName.substring(6);
      return <span className="text-2xl">{emoji}</span>;
    }
    
    const Icon = LucideIcons[iconName] || LucideIcons.Mail;
    return <Icon className="w-5 h-5 text-indigo-600" />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Edit Writing Types</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {editingItem ? (
            // Edit Form
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">
                  {editingItem.id ? 'Edit Writing Type' : 'Add New Writing Type'}
                </h3>
                <button
                  onClick={() => setEditingItem(null)}
                  className="text-sm text-slate-600 hover:text-slate-800 underline"
                >
                  Back to list
                </button>
              </div>

              {/* Basic Info Section */}
              <div className="bg-blue-50 rounded-xl p-4 space-y-4">
                <h4 className="font-semibold text-blue-900 text-sm">Basic Information</h4>
                
                {/* Value (ID) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Value (ID) <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-slate-500 mb-2">
                    Unique identifier (e.g., "cold_email", "thank_you_note"). Use lowercase and underscores.
                  </p>
                  <input
                    type="text"
                    value={editingItem.value || ''}
                    onChange={(e) => updateEditingField('value', e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                    placeholder="e.g., cold_email"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  />
                </div>

                {/* Label */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Label <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-slate-500 mb-2">
                    Display name shown to users (e.g., "Cold Email to HR")
                  </p>
                  <input
                    type="text"
                    value={editingItem.label || ''}
                    onChange={(e) => updateEditingField('label', e.target.value)}
                    placeholder="e.g., Cold Email to HR"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <p className="text-xs text-slate-500 mb-2">
                    Brief description of what this writing type is used for
                  </p>
                  <input
                    type="text"
                    value={editingItem.description || ''}
                    onChange={(e) => updateEditingField('description', e.target.value)}
                    placeholder="e.g., Direct outreach to hiring manager"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  />
                </div>
              </div>

              {/* Icon Selection */}
              <div className="bg-purple-50 rounded-xl p-4 space-y-4">
                <h4 className="font-semibold text-purple-900 text-sm">Icon & Visual</h4>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Icon
                  </label>
                  <p className="text-xs text-slate-500 mb-2">
                    Select an icon or use a custom emoji to represent this writing type
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white border-2 border-slate-300 rounded-lg flex items-center justify-center">
                      {renderIcon(editingItem.icon_name)}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowIconSelector(!showIconSelector)}
                      className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-left flex items-center justify-between"
                    >
                      <span className="text-slate-700">
                        {editingItem.icon_name ? 
                          (editingItem.icon_name.startsWith('emoji:') ? 
                            `Emoji: ${editingItem.icon_name.substring(6)}` : 
                            editingItem.icon_name
                          ) : 
                          'Select Icon or Emoji'
                        }
                      </span>
                      {showIconSelector ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {showIconSelector && (
                    <div className="mt-3 bg-white border border-slate-300 rounded-lg p-4">
                      {/* Emoji Input */}
                      <div className="mb-4 pb-4 border-b border-slate-200">
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                          <Smile className="w-4 h-4" />
                          Custom Emoji
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={customEmoji}
                            onChange={(e) => setCustomEmoji(e.target.value)}
                            placeholder="Paste emoji here (e.g., 📧, 💼, ✉️)"
                            className="flex-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-lg"
                          />
                          <button
                            type="button"
                            onClick={selectEmoji}
                            disabled={!customEmoji.trim()}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Use
                          </button>
                        </div>
                      </div>

                      {/* Icon Search */}
                      <div className="mb-3">
                        <input
                          type="text"
                          value={iconSearchTerm}
                          onChange={(e) => setIconSearchTerm(e.target.value)}
                          placeholder="Search icons..."
                          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      {/* Icon Grid */}
                      <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto">
                        {filteredIcons.map((iconName) => {
                          const Icon = LucideIcons[iconName];
                          return (
                            <button
                              key={iconName}
                              type="button"
                              onClick={() => selectIcon(iconName)}
                              className={`p-3 rounded-lg border-2 hover:border-purple-500 hover:bg-purple-50 transition-all ${
                                editingItem.icon_name === iconName
                                  ? 'border-purple-500 bg-purple-50'
                                  : 'border-slate-200'
                              }`}
                              title={iconName}
                            >
                              <Icon className="w-5 h-5 mx-auto text-slate-700" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Length Options */}
              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="font-semibold text-green-900 text-sm mb-2">Word Count Options</h4>
                <p className="text-xs text-slate-500 mb-3">
                  Available word count options for this writing type (comma-separated numbers)
                </p>
                <input
                  type="text"
                  value={Array.isArray(editingItem.length_options) 
                    ? editingItem.length_options.join(', ') 
                    : editingItem.length_options || ''}
                  onChange={(e) => {
                    const values = e.target.value.split(',').map(v => {
                      const trimmed = v.trim();
                      return isNaN(trimmed) ? trimmed : Number(trimmed);
                    }).filter(v => v !== '');
                    updateEditingField('length_options', values);
                  }}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                  placeholder="e.g., 50, 75, 100, 150, 200"
                />
              </div>

              {/* Context Fields Configuration */}
              <div className="bg-amber-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-amber-900 text-sm">Context Fields</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Define which input fields users will see for this writing type
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowContextFields(!showContextFields)}
                    className="text-amber-700 hover:text-amber-900"
                  >
                    {showContextFields ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {showContextFields && (
                  <div className="space-y-3 mt-4">
                    {(editingItem.context_fields || []).map((field, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-amber-200">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-sm font-medium text-slate-700">Field {index + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeContextField(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Preset Selector */}
                        <div className="mb-3">
                          <label className="block text-xs font-medium text-slate-600 mb-1">Quick Preset</label>
                          <select
                            value=""
                            onChange={(e) => {
                              const preset = FIELD_NAME_PRESETS.find(p => p.value === e.target.value);
                              if (preset) applyPreset(index, preset);
                            }}
                            className="w-full p-2 text-sm border border-slate-300 rounded-lg bg-white"
                          >
                            <option value="">Select a preset...</option>
                            {FIELD_NAME_PRESETS.map((preset) => (
                              <option key={preset.value} value={preset.value}>
                                {preset.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                              Field Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={field.field_name || ''}
                              onChange={(e) => updateContextField(index, 'field_name', e.target.value)}
                              placeholder="e.g., companyName"
                              className="w-full p-2 text-sm border border-slate-300 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                              Label <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={field.label || ''}
                              onChange={(e) => updateContextField(index, 'label', e.target.value)}
                              placeholder="e.g., Company Name"
                              className="w-full p-2 text-sm border border-slate-300 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">Type</label>
                            <select
                              value={field.type || 'text'}
                              onChange={(e) => updateContextField(index, 'type', e.target.value)}
                              className="w-full p-2 text-sm border border-slate-300 rounded-lg"
                            >
                              {CONTEXT_FIELD_TYPES.map((type) => (
                                <option key={type.value} value={type.value}>
                                  {type.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex items-center pt-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={field.required || false}
                                onChange={(e) => updateContextField(index, 'required', e.target.checked)}
                                className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                              />
                              <span className="text-xs text-slate-700">Required</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addContextField}
                      className="w-full py-2 px-4 border-2 border-dashed border-amber-300 rounded-lg text-amber-700 hover:bg-amber-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Context Field
                    </button>
                  </div>
                )}
              </div>

              {/* Prompt Template Notice */}
              {editingItem.id && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                  <p className="text-sm text-indigo-900 mb-2">
                    <strong>📝 Prompt Template:</strong> Don't forget to create/edit the prompt template for this writing type!
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(null);
                      onOpenPromptEditor();
                    }}
                    className="text-sm text-indigo-600 hover:text-indigo-800 underline"
                  >
                    Open Prompt Template Editor →
                  </button>
                </div>
              )}

              {/* Save/Cancel Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={handleSaveItem}
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Writing Type
                    </>
                  )}
                </button>
                <button
                  onClick={() => setEditingItem(null)}
                  className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors font-medium text-slate-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // List View
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-600">Manage your writing types and templates</p>
                <button
                  onClick={handleAddNew}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add New
                </button>
              </div>

              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                      {renderIcon(item.icon_name)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-800">{item.label}</div>
                      <div className="text-sm text-slate-600">
                        Value: <code className="bg-slate-200 px-1 rounded text-xs">{item.value}</code>
                        {item.description && ` • ${item.description}`}
                      </div>
                      {item.context_fields && item.context_fields.length > 0 && (
                        <div className="text-xs text-slate-500 mt-1">
                          Fields: {item.context_fields.map(f => f.label).join(', ')}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {items.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    No writing types found. Click "Add New" to create one.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!editingItem && (
          <div className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-slate-200 bg-slate-50">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
