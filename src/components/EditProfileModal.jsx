import { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';

export default function EditProfileModal({ isOpen, onClose, profile, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
    current_position: '',
    education: '',
    key_skills: [],
    technical_stack: '',
    top_projects: [],
    leadership: [],
    certifications: []
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        linkedin: profile.linkedin || '',
        github: profile.github || '',
        website: profile.website || '',
        current_position: profile.current_position || '',
        education: profile.education || '',
        key_skills: profile.key_skills || [],
        technical_stack: profile.technical_stack || '',
        top_projects: profile.top_projects || [],
        leadership: profile.leadership || [],
        certifications: profile.certifications || []
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const addArrayItem = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const removeArrayItem = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index)
    });
  };

  const updateArrayItem = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray
    });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      top_projects: [...formData.top_projects, { name: '', impact: '' }]
    });
  };

  const removeProject = (index) => {
    setFormData({
      ...formData,
      top_projects: formData.top_projects.filter((_, i) => i !== index)
    });
  };

  const updateProject = (index, field, value) => {
    const newProjects = [...formData.top_projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setFormData({
      ...formData,
      top_projects: newProjects
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Personal Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">LinkedIn</label>
                <input
                  type="text"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">GitHub</label>
                <input
                  type="text"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Website</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Professional Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Current Position</label>
              <input
                type="text"
                value={formData.current_position}
                onChange={(e) => setFormData({ ...formData, current_position: e.target.value })}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Education</label>
              <textarea
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                rows={2}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Technical Stack</label>
              <textarea
                value={formData.technical_stack}
                onChange={(e) => setFormData({ ...formData, technical_stack: e.target.value })}
                rows={2}
                placeholder="Comma-separated technologies..."
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Key Skills */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Key Skills</h3>
              <button
                onClick={() => addArrayItem('key_skills')}
                className="flex items-center gap-2 px-3 py-1 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors text-indigo-700 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Skill
              </button>
            </div>
            
            <div className="space-y-2">
              {formData.key_skills.map((skill, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => updateArrayItem('key_skills', index, e.target.value)}
                    className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Skill description..."
                  />
                  <button
                    onClick={() => removeArrayItem('key_skills', index)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Top Projects */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Top Projects</h3>
              <button
                onClick={addProject}
                className="flex items-center gap-2 px-3 py-1 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors text-indigo-700 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Project
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.top_projects.map((project, index) => (
                <div key={index} className="p-4 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <input
                      type="text"
                      value={project.name || ''}
                      onChange={(e) => updateProject(index, 'name', e.target.value)}
                      className="flex-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Project name..."
                    />
                    <button
                      onClick={() => removeProject(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    value={project.impact || ''}
                    onChange={(e) => updateProject(index, 'impact', e.target.value)}
                    rows={2}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Project impact..."
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Leadership */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Leadership</h3>
              <button
                onClick={() => addArrayItem('leadership')}
                className="flex items-center gap-2 px-3 py-1 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors text-indigo-700 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Role
              </button>
            </div>
            
            <div className="space-y-2">
              {formData.leadership.map((role, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => updateArrayItem('leadership', index, e.target.value)}
                    className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Leadership role..."
                  />
                  <button
                    onClick={() => removeArrayItem('leadership', index)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Certifications</h3>
              <button
                onClick={() => addArrayItem('certifications')}
                className="flex items-center gap-2 px-3 py-1 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors text-indigo-700 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Certification
              </button>
            </div>
            
            <div className="space-y-2">
              {formData.certifications.map((cert, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={cert}
                    onChange={(e) => updateArrayItem('certifications', index, e.target.value)}
                    className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Certification name..."
                  />
                  <button
                    onClick={() => removeArrayItem('certifications', index)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 p-4 sm:p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors font-medium text-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !formData.name || !formData.email}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
