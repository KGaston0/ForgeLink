import { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchBlueprints, createBlueprint, updateBlueprint } from '@/features/graphs/api/graphService';
import Sidebar from '@/components/layout/Sidebar';
import LoadingSpinner from '@/components/ui/loading-spinner';

const INITIAL_FORM_STATE = {
  name: '',
  description: '',
  category: 'General',
  is_frame: false,
  color: '#3B82F6',
};

// ...existing code...

// Live preview node mockup - Pixel-perfect replica of actual canvas nodes
function NodePreview({ formData }) {
  const { name, category, color, is_frame } = formData;
  const defaultColor = color || '#3B82F6';

  if (is_frame) {
    // FRAME CONTAINER - 400x300
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0d0d0f] bg-[radial-gradient(circle,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[length:20px_20px] border border-dashed border-[rgba(99,102,241,0.1)] rounded-lg">
        <div 
          className="w-[400px] h-[300px] rounded-2xl border-2 shadow-sm relative overflow-hidden transition-all scale-75 transform origin-center"
          style={{ 
            borderColor: `${defaultColor}80`,
            backgroundColor: `${defaultColor}0A`
          }}
        >
          {/* Frame Header Tab */}
          <div 
            className="absolute top-0 left-0 px-4 py-2 flex items-center gap-8 rounded-br-2xl border-b border-r"
            style={{ 
              backgroundColor: `${defaultColor}33`, 
              borderColor: `${defaultColor}4D`
            }}
          >
            <div className="flex flex-col">
              <span className="text-[9px] font-bold tracking-widest uppercase opacity-70 text-white">
                Frame
              </span>
              <span className="text-sm font-bold text-white truncate max-w-[150px]">
                {name || 'Frame Name'}
              </span>
            </div>
            <ChevronLeft className="w-4 h-4 text-white opacity-70 shrink-0" />
          </div>

          {/* Frame content hint */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <span className="text-xs text-white font-medium">Container for child nodes</span>
          </div>
        </div>
      </div>
    );
  }

  // STANDARD NODE - 160x80
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#0d0d0f] bg-[radial-gradient(circle,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[length:20px_20px] border border-dashed border-[rgba(99,102,241,0.1)] rounded-lg">
      <div 
        className="w-[160px] h-[80px] rounded-xl overflow-hidden border border-gray-700 shadow-lg flex flex-col bg-[#1e1e24] scale-150 transform origin-center transition-all"
        style={{ borderColor: `${defaultColor}cc` }}
      >
        {/* Header */}
        <div 
          className="px-3 py-1.5 flex justify-between items-center"
          style={{ backgroundColor: defaultColor }}
        >
          <span className="text-[10px] font-bold text-white uppercase tracking-wider truncate">
            {category || 'GENERAL'}
          </span>
          <ChevronRight className="w-3 h-3 text-white shrink-0" />
        </div>

        {/* Body */}
        <div className="flex-1 px-3 py-2 flex items-center">
          <span className="text-sm font-semibold text-white truncate">
            {name || 'Node Name'}
          </span>
        </div>
      </div>
    </div>
  );
}

// Combobox creatable para categorías
function CategoryCombobox({ value, onChange, existingCategories = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef(null);

  // Filtrar categorías basadas en input
  const filteredCategories = existingCategories.filter(cat =>
    cat.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSelect = (category) => {
    setInputValue(category);
    onChange(category);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 200);
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className="relative">
      <label htmlFor="category" className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-1.5">
        Category
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id="category"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={handleBlur}
          placeholder="e.g., Worldbuilding, Gameplay"
          className="w-full px-3 py-2 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg text-sm text-[rgb(var(--color-text))] placeholder-[rgb(var(--color-text-secondary))]/50 focus:outline-none focus:border-cyan-500 transition-colors"
          autoComplete="off"
        />

        {/* Dropdown list */}
        {isOpen && (filteredCategories.length > 0 || inputValue) && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
            {/* Existing categories */}
            {filteredCategories.map(category => (
              <button
                key={category}
                type="button"
                onClick={() => handleSelect(category)}
                className="w-full text-left px-3 py-2 hover:bg-[rgb(var(--color-bg-secondary))] text-sm text-[rgb(var(--color-text))] transition-colors"
              >
                {category}
              </button>
            ))}

            {/* "Create new" option if typing custom value */}
            {inputValue && !filteredCategories.includes(inputValue) && (
              <button
                type="button"
                onClick={() => handleSelect(inputValue)}
                className="w-full text-left px-3 py-2 hover:bg-cyan-500/10 text-sm text-cyan-400 transition-colors border-t border-[rgb(var(--color-border))] font-medium"
              >
                + Create "{inputValue}"
              </button>
            )}
          </div>
        )}
      </div>
      <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
        Free text - select existing or type a new one
      </p>
    </div>
  );
}

export default function BlueprintBuilderPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [existingCategories, setExistingCategories] = useState([]);

  // Load blueprint if editing
  useEffect(() => {
    if (!id) {
      loadExistingCategories();
      return;
    }

    const loadBlueprint = async () => {
      try {
        setLoading(true);
        const response = await fetchBlueprints({ id });
        const blueprint = response.results?.[0] || response;

        if (blueprint) {
          setFormData({
            name: blueprint.name || '',
            description: blueprint.description || '',
            category: blueprint.category || 'General',
            is_frame: blueprint.is_frame || false,
            color: blueprint.color || '#3B82F6',
          });
        }
        
        loadExistingCategories();
      } catch (err) {
        console.error('[BlueprintBuilderPage] Error loading blueprint:', err);
        setError(err.response?.data?.detail || 'Error loading blueprint');
      } finally {
        setLoading(false);
      }
    };

    loadBlueprint();
  }, [id]);

  // Load existing categories from all blueprints
  const loadExistingCategories = async () => {
    try {
      const response = await fetchBlueprints({ limit: 100 });
      const blueprints = response.results || response;
      
      const categories = new Set(['General']);
      blueprints.forEach(bp => {
        if (bp.category) categories.add(bp.category);
      });
      
      setExistingCategories(Array.from(categories).sort());
    } catch (err) {
      console.error('[BlueprintBuilderPage] Error loading categories:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleColorChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      color: value.startsWith('#') ? value : `#${value}`,
    }));
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      category: category || 'General',
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Validate
    if (!formData.name.trim()) {
      setError('Blueprint name is required');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category.trim() || 'General',
        is_frame: formData.is_frame,
        color: formData.color,
        schema: {},
      };

      if (id) {
        // Update existing
        await updateBlueprint(id, payload);
      } else {
        // Create new
        await createBlueprint(payload);
      }

      // Navigate back to blueprints
      navigate('/node-types');
    } catch (err) {
      console.error('[BlueprintBuilderPage] Error saving blueprint:', err);
      setError(err.response?.data?.detail || 'Failed to save blueprint');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/node-types');
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-[rgb(var(--color-bg))] border-b border-[rgb(var(--color-border))] px-8 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div>
              <h1 className="text-2xl font-bold text-[rgb(var(--color-text))]">
                {id ? 'Edit Blueprint' : 'Create Blueprint'}
              </h1>
              <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-0.5">
                {id ? 'Update your blueprint template' : 'Design a new custom node type'}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))] bg-[rgb(var(--color-bg-secondary))] hover:bg-[rgb(var(--color-border))] rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                aria-busy={saving}
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Blueprint'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Error message */}
            {error && (
              <div role="alert" className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* Split layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Form Settings */}
              <div className="space-y-6">
                <div className="bg-[rgb(var(--color-bg-secondary))]/30 border border-[rgb(var(--color-border))] rounded-xl p-6 space-y-4">
                  {/* Name field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-1.5">
                      Blueprint Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Character, Location, Spell"
                      className="w-full px-3 py-2 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg text-sm text-[rgb(var(--color-text))] placeholder-[rgb(var(--color-text-secondary))]/50 focus:outline-none focus:border-cyan-500 transition-colors"
                      required
                      autoComplete="off"
                    />
                    <p className="mt-1 text-xs text-[rgb(var(--color-text-secondary))]">
                      This is the custom semantic type (e.g., "Car", "Spell")
                    </p>
                  </div>

                  {/* Description field */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-1.5">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe what this blueprint is for..."
                      rows="4"
                      className="w-full px-3 py-2 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg text-sm text-[rgb(var(--color-text))] placeholder-[rgb(var(--color-text-secondary))]/50 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                      autoComplete="off"
                    />
                  </div>

                  {/* Category with combobox */}
                  <CategoryCombobox
                    value={formData.category}
                    onChange={handleCategoryChange}
                    existingCategories={existingCategories}
                  />

                  {/* Color field */}
                  <div>
                    <label htmlFor="color" className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-1.5">
                      Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        id="color"
                        type="color"
                        name="color"
                        value={formData.color}
                        onChange={handleColorChange}
                        className="h-10 w-16 rounded cursor-pointer border-2 border-[rgb(var(--color-border))]"
                      />
                      <input
                        type="text"
                        value={formData.color}
                        onChange={handleColorChange}
                        placeholder="#3B82F6"
                        className="flex-1 px-3 py-2 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg text-sm text-[rgb(var(--color-text))] focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  {/* Is Frame toggle */}
                  <div className="border-t border-[rgb(var(--color-border))] pt-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_frame"
                        checked={formData.is_frame}
                        onChange={handleChange}
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                      <div>
                        <p className="text-sm font-medium text-[rgb(var(--color-text))]">
                          Render as Frame
                        </p>
                        <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                          Makes this a large container for grouping nodes
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right: Live Preview */}
              <div className="space-y-6">
                <div className="bg-[rgb(var(--color-bg-secondary))]/30 border border-[rgb(var(--color-border))] rounded-xl p-6">
                  <h2 className="text-sm font-semibold text-[rgb(var(--color-text))] mb-4">
                    Live Preview
                  </h2>
                  <div className="h-80">
                    <NodePreview formData={formData} />
                  </div>
                </div>

                {/* Info box */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-xs text-blue-400 leading-relaxed">
                    <span className="font-semibold">💡 Tip:</span> The preview shows how your blueprint will appear as a node on the canvas. Frames are larger containers, while normal nodes are compact.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}






