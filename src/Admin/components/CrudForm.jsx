import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import MapSelector from './MapSelector';

const CrudForm = ({ 
  title, 
  fields, 
  initialData, 
  onSubmit, 
  onCancel,
  isEdit = false
}) => {
  const [formData, setFormData] = useState(initialData || {});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Effacer l'erreur lorsque l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    let isValid = true;

    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} est requis`;
        isValid = false;
      }
      
      if (field.type === 'email' && formData[field.name] && 
          !/\S+@\S+\.\S+/.test(formData[field.name])) {
        newErrors[field.name] = 'Email invalide';
        isValid = false;
      }
      
      if (field.type === 'tel' && formData[field.name] && 
          !/^[0-9+\s()-]{8,15}$/.test(formData[field.name])) {
        newErrors[field.name] = 'Numéro de téléphone invalide';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            rows={field.rows || 4}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[field.name] ? 'border-red-500' : ''}`}
            placeholder={field.placeholder || ''}
          />
        );
      
      case 'checkbox':
        return (
          <input
            type="checkbox"
            id={field.name}
            name={field.name}
            checked={formData[field.name] || false}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        );
      
      case 'file':
        return (
          <input
            type="file"
            id={field.name}
            name={field.name}
            onChange={handleChange}
            accept={field.accept || ''}
            className={`mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${errors[field.name] ? 'border-red-500' : ''}`}
          />
        );
      
      case 'select':
        return (
          <select
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[field.name] ? 'border-red-500' : ''}`}
          >
            <option value="">Sélectionner...</option>
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'date':
        return (
          <input
            type="date"
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[field.name] ? 'border-red-500' : ''}`}
          />
        );
      
      case 'time':
        return (
          <input
            type="time"
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[field.name] ? 'border-red-500' : ''}`}
          />
        );
      
      case 'map':
        return (
          <MapSelector
            value={formData[field.name] || ''}
            onChange={(value) => {
              setFormData({ ...formData, [field.name]: value });
              // Effacer l'erreur lorsque l'utilisateur modifie le champ
              if (errors[field.name]) {
                setErrors({ ...errors, [field.name]: null });
              }
            }}
          />
        );
      
      default:
        return (
          <input
            type={field.type || 'text'}
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors[field.name] ? 'border-red-500' : ''}`}
            placeholder={field.placeholder || ''}
          />
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-lg font-semibold text-gray-800">
          {isEdit ? `Modifier ${title}` : `Ajouter ${title}`}
        </h2>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.name} className={field.fullWidth ? "col-span-1 md:col-span-2" : ""}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
              {errors[field.name] && (
                <p className="mt-1 text-sm text-red-500">{errors[field.name]}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
          >
            <Save size={16} className="mr-1" />
            {isEdit ? 'Mettre à jour' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrudForm;