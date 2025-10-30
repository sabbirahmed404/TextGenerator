import { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Edit2 } from 'lucide-react';

export default function EditConfigModal({ isOpen, onClose, configType, data, onSave, onAdd, onDelete }) {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  const getTitle = () => {
    switch (configType) {
      case 'writing_types': return 'Edit Writing Types';
      case 'tones': return 'Edit Tones';
      case 'role_levels': return 'Edit Role Levels';
      default: return 'Edit Configuration';
    }
  };

  const getFields = () => {
    switch (configType) {
      case 'writing_types':
        return [
          { name: 'value', label: 'Value (ID)', type: 'text', required: true },
          { name: 'label', label: 'Label', type: 'text', required: true },
          { name: 'description', label: 'Description', type: 'text', required: false },
          { name: 'icon_name', label: 'Icon Name', type: 'text', required: false },
          { name: 'length_options', label: 'Length Options (comma-separated)', type: 'array', required: false },
        ];
      case 'tones':
        return [
          { name: 'value', label: 'Value (ID)', type: 'text', required: true },
          { name: 'label', label: 'Label', type: 'text', required: true },
          { name: 'description', label: 'Description', type: 'text', required: false },
          { name: 'context', label: 'Context', type: 'select', options: ['email', 'linkedin'], required: true },
        ];
      case 'role_levels':
        return [
          { name: 'value', label: 'Value (ID)', type: 'text', required: true },
          { name: 'label', label: 'Label', type: 'text', required: true },
        ];
      default:
        return [];
    }
  };

  const handleEdit = (item) => {
    setEditingItem({ ...item });
  };

  const handleSaveItem = async () => {
    setIsSaving(true);
    try {
      if (editingItem.id) {
        // Update existing item
        await onSave(editingItem.id, editingItem);
      } else {
        // Add new item
        await onAdd(editingItem);
      }
      setEditingItem(null);
      // Refresh will happen via parent component
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setIsSaving(true);
      try {
        await onDelete(id);
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete. Please try again.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleAddNew = () => {
    const newItem = { display_order: items.length + 1 };
    getFields().forEach(field => {
      if (field.type === 'array') {
        newItem[field.name] = [];
      } else {
        newItem[field.name] = '';
      }
    });
    setEditingItem(newItem);
  };

  const updateEditingField = (fieldName, value) => {
    setEditingItem({
      ...editingItem,
      [fieldName]: value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {editingItem ? (
            // Edit Form
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">
                  {editingItem.id ? 'Edit Item' : 'Add New Item'}
                </h3>
                <button
                  onClick={() => setEditingItem(null)}
                  className="text-sm text-slate-600 hover:text-slate-800"
                >
                  Back to list
                </button>
              </div>

              {getFields().map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  
                  {field.type === 'select' ? (
                    <select
                      value={editingItem[field.name] || ''}
                      onChange={(e) => updateEditingField(field.name, e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select...</option>
                      {field.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.type === 'array' ? (
                    <input
                      type="text"
                      value={Array.isArray(editingItem[field.name]) 
                        ? editingItem[field.name].join(', ') 
                        : editingItem[field.name] || ''}
                      onChange={(e) => {
                        const values = e.target.value.split(',').map(v => {
                          const trimmed = v.trim();
                          return isNaN(trimmed) ? trimmed : Number(trimmed);
                        });
                        updateEditingField(field.name, values);
                      }}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g., 50, 75, 100, 150"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={editingItem[field.name] || ''}
                      onChange={(e) => updateEditingField(field.name, e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  )}
                </div>
              ))}

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 pt-4">
                <button
                  onClick={handleSaveItem}
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save
                    </>
                  )}
                </button>
                <button
                  onClick={() => setEditingItem(null)}
                  className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors font-medium text-slate-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // List View
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-600">Manage your {configType.replace('_', ' ')}</p>
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
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-slate-800">{item.label}</div>
                      <div className="text-sm text-slate-600">
                        Value: <code className="bg-slate-200 px-1 rounded">{item.value}</code>
                        {item.description && ` • ${item.description}`}
                        {item.context && ` • Context: ${item.context}`}
                      </div>
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
                    No items found. Click "Add New" to create one.
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
