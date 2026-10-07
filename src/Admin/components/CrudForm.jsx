import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import MapSelector from './MapSelector';
import {
  Card, Button, IconButton, Field, Input, Textarea, Select, FileInput, FormActions, checkboxClass,
} from '../ui';

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
    const error = !!errors[field.name];
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            rows={field.rows || 4}
            error={error}
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
            className={checkboxClass}
          />
        );

      case 'file':
        return (
          <FileInput
            id={field.name}
            name={field.name}
            onChange={handleChange}
            accept={field.accept || ''}
          />
        );

      case 'select':
        return (
          <Select
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            error={error}
          >
            <option value="">Sélectionner...</option>
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
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
          <Input
            type={field.type || 'text'}
            id={field.name}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            error={error}
            placeholder={field.placeholder || ''}
          />
        );
    }
  };

  return (
    <Card
      title={isEdit ? `Modifier ${title}` : `Ajouter ${title}`}
      actions={<IconButton icon={X} label="Fermer" onClick={onCancel} />}
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {fields.map((field) => (
            <Field
              key={field.name}
              label={field.label}
              htmlFor={field.name}
              required={field.required}
              error={errors[field.name]}
              className={field.fullWidth ? "md:col-span-2" : ""}
            >
              {renderField(field)}
            </Field>
          ))}
        </div>

        <FormActions>
          <Button variant="secondary" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" icon={Save}>
            {isEdit ? 'Mettre à jour' : 'Enregistrer'}
          </Button>
        </FormActions>
      </form>
    </Card>
  );
};

export default CrudForm;
