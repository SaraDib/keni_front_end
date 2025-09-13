import React, { useState, useEffect } from 'react';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import { HelpCircle } from 'lucide-react';
import axios from 'axios';

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
      const response = await axios.get('http://localhost:8000/api/faqs', {
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
    { header: "Question (Fr)", accessor: "Question" },
    { header: "Question (Ar)", accessor: "QuestionAR",
      render: (item) => (
        <div className="text-right" dir="rtl">{item.QuestionAR}</div>
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
          axios.delete(`http://localhost:8000/api/faqs/${singleId}`, { headers })
        ));
      } else {
        await axios.delete(`http://localhost:8000/api/faqs/${id}`, { headers });
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
        await axios.put(`http://localhost:8000/api/faqs/${currentFaq.ID_FAQ}`, dataWithEnterprise, { headers });
      } else {
        await axios.post('http://localhost:8000/api/faqs', dataWithEnterprise, { headers });
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
    <div className="p-4 md:p-6">
      <div className="flex items-center mb-6">
        <HelpCircle className="text-blue-500 mr-2" size={24} />
        <h1 className="text-xl md:text-2xl font-bold">FAQ</h1>
      </div>
      
      <p className="mb-6 text-gray-600">
        Gérez les questions fréquemment posées qui apparaîtront sur votre site (FR & AR).
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
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
