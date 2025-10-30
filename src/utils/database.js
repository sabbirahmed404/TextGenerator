import { supabase } from './supabase';

// ============ PROFILE ============

export const getProfile = async () => {
  try {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .eq('is_active', true)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

export const updateProfile = async (profileData) => {
  try {
    // First check if a profile exists
    const { data: existingProfile } = await supabase
      .from('profile')
      .select('id')
      .eq('is_active', true)
      .single();

    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from('profile')
        .update({ ...profileData, updated_at: new Date().toISOString() })
        .eq('id', existingProfile.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Insert new profile
      const { data, error } = await supabase
        .from('profile')
        .insert([profileData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// ============ WRITING TYPES ============

export const getWritingTypes = async () => {
  try {
    const { data, error } = await supabase
      .from('writing_types')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching writing types:', error);
    return [];
  }
};

export const addWritingType = async (writingTypeData) => {
  try {
    const { data, error } = await supabase
      .from('writing_types')
      .insert([writingTypeData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding writing type:', error);
    throw error;
  }
};

export const updateWritingType = async (id, writingTypeData) => {
  try {
    const { data, error } = await supabase
      .from('writing_types')
      .update({ ...writingTypeData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating writing type:', error);
    throw error;
  }
};

export const deleteWritingType = async (id) => {
  try {
    const { error } = await supabase
      .from('writing_types')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting writing type:', error);
    throw error;
  }
};

// ============ TONES ============

export const getTones = async (context = null) => {
  try {
    let query = supabase
      .from('tones')
      .select('*')
      .eq('is_active', true);
    
    if (context) {
      query = query.eq('context', context);
    }
    
    query = query.order('display_order', { ascending: true });
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching tones:', error);
    return [];
  }
};

export const addTone = async (toneData) => {
  try {
    const { data, error } = await supabase
      .from('tones')
      .insert([toneData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding tone:', error);
    throw error;
  }
};

export const updateTone = async (id, toneData) => {
  try {
    const { data, error } = await supabase
      .from('tones')
      .update({ ...toneData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating tone:', error);
    throw error;
  }
};

export const deleteTone = async (id) => {
  try {
    const { error } = await supabase
      .from('tones')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting tone:', error);
    throw error;
  }
};

// ============ ROLE LEVELS ============

export const getRoleLevels = async () => {
  try {
    const { data, error } = await supabase
      .from('role_levels')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching role levels:', error);
    return [];
  }
};

export const addRoleLevel = async (roleLevelData) => {
  try {
    const { data, error } = await supabase
      .from('role_levels')
      .insert([roleLevelData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding role level:', error);
    throw error;
  }
};

export const updateRoleLevel = async (id, roleLevelData) => {
  try {
    const { data, error } = await supabase
      .from('role_levels')
      .update({ ...roleLevelData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating role level:', error);
    throw error;
  }
};

export const deleteRoleLevel = async (id) => {
  try {
    const { error } = await supabase
      .from('role_levels')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting role level:', error);
    throw error;
  }
};

// ============ PROMPT TEMPLATES ============

export const getPromptTemplate = async (writingType) => {
  try {
    const { data, error } = await supabase
      .from('prompt_templates')
      .select('*')
      .eq('writing_type', writingType)
      .eq('is_active', true)
      .order('version', { ascending: false })
      .limit(1)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching prompt template:', error);
    return null;
  }
};

export const getAllPromptTemplates = async () => {
  try {
    const { data, error } = await supabase
      .from('prompt_templates')
      .select('*')
      .eq('is_active', true)
      .order('writing_type', { ascending: true })
      .order('version', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching prompt templates:', error);
    return [];
  }
};

export const updatePromptTemplate = async (id, templateData) => {
  try {
    const { data, error } = await supabase
      .from('prompt_templates')
      .update({ ...templateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating prompt template:', error);
    throw error;
  }
};

export const addPromptTemplate = async (templateData) => {
  try {
    const { data, error } = await supabase
      .from('prompt_templates')
      .insert([templateData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding prompt template:', error);
    throw error;
  }
};

export const deletePromptTemplate = async (id) => {
  try {
    const { error } = await supabase
      .from('prompt_templates')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting prompt template:', error);
    throw error;
  }
};
