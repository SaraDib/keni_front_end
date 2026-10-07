import React, { useState, useEffect } from 'react';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import { HelpCircle } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import { PageHeader, Alert, LoadingState } from '../ui';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentFaq, setCurrentFaq] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les FAQs
  const fetchFaqs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/faqs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setFaqs(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des FAQs');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // Colonnes du tableau
  const columns = [
    {
      header: "Question (Fr)", accessor: "Question",
      render: (item) => (
        <div className="max-w-xs truncate font-medium text-gray-900" title={item.Question}>{item.Question}</div>
      )
    },
    {
      header: "Question (Ar)", accessor: "QuestionAR",
      render: (item) => (
        <div className="max-w-xs truncate text-right" dir="rtl" title={item.QuestionAR}>{item.QuestionAR}</div>
      )
    },
    {
      header: "Réponse (Fr)",
      accessor: "Reponse",
      render: (item) => (
        <div className="max-w-xs truncate" title={item.Reponse}>
          {item.Reponse}
        </div>
      )
    },
    {
      header: "Réponse (Ar)",
      accessor: "ReponseAR",
      render: (item) => (
        <div className="max-w-xs truncate text-right" dir="rtl" title={item.ReponseAR}>
          {item.ReponseAR}
        </div>
      )
    }
  ];

  // Champs du formulaire
  const formFields = [
    { name: "Question", label: "Question (Français)", type: "text", required: true, fullWidth: true },
    { name: "QuestionAR", label: "Question (Arabe)", type: "text", required: true, fullWidth: true },
    { name: "Reponse", label: "Réponse (Français)", type: "textarea", required: true, rows: 4, fullWidth: true },
    { name: "ReponseAR", label: "Réponse (Arabe)", type: "textarea", required: true, rows: 4, fullWidth: true }
  ];

  // Ajouter FAQ
  const handleAdd = () => {
    setCurrentFaq(null);
    setShowForm(true);
  };

  // Modifier FAQ
  const handleEdit = (faq) => {
    setCurrentFaq(faq);
    setShowForm(true);
  };

  // Supprimer FAQ
  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      if (Array.isArray(id)) {
        await Promise.all(id.map(singleId =>
          axios.delete(`${API_BASE_URL}/faqs/${singleId}`, { headers })
        ));
      } else {
        await axios.delete(`${API_BASE_URL}/faqs/${id}`, { headers });
      }

      await fetchFaqs();
      setError(null);
    } catch (err) {
      setError('Erreur lors de la suppression');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Soumettre formulaire
  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const dataWithEnterprise = {
        ...formData,
        ID_Entreprise: 1
      };

      if (currentFaq) {
        await axios.put(`${API_BASE_URL}/faqs/${currentFaq.ID_FAQ}`, dataWithEnterprise, { headers });
      } else {
        await axios.post(`${API_BASE_URL}/faqs`, dataWithEnterprise, { headers });
      }

      await fetchFaqs();
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError("Erreur lors de l'enregistrement");
      console.error("Erreur:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        icon={HelpCircle}
        title="FAQ"
        description="Gérez les questions fréquemment posées qui apparaîtront sur votre site (FR & AR)."
      />

      {error && <Alert tone="error">{error}</Alert>}

      {isLoading ? (
        <LoadingState />
      ) : showForm ? (
        <CrudForm
          title="FAQ"
          fields={formFields}
          initialData={currentFaq}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          isEdit={!!currentFaq}
        />
      ) : (
        <CrudTable
          title="Questions fréquemment posées"
          columns={columns}
          data={faqs}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          idField="ID_FAQ"
          emptyMessage="Aucune FAQ disponible. Cliquez sur 'Ajouter' pour créer votre première FAQ."
        />
      )}
    </div>
  );
};

export default FAQ;
