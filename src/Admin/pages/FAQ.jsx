import React, { useState, useEffect } from 'react';
import CrudTable from '../components/CrudTable';
import CrudForm from '../components/CrudForm';
import { HelpCircle } from 'lucide-react';
import axios from 'axios';

const FAQ = () => {
  // État pour stocker les données
  const [faqs, setFaqs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentFaq, setCurrentFaq] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les FAQs depuis l'API
  const fetchFaqs = async () => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      // Make the API request with the Authorization header
      const response = await axios.get('http://keniweb.test/api/faqs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
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

  // Définition des colonnes du tableau
  const columns = [
    { header: "Question", accessor: "Question" },
    { 
      header: "Réponse", 
      accessor: "reponse",
      render: (item) => (
        <div className="max-w-xs truncate" title={item.Reponse}>
          {item.Reponse}
        </div>
      )
    }
  ];

  // Définition des champs du formulaire
  const formFields = [
    { 
      name: "Question", 
      label: "Question", 
      type: "text", 
      required: true,
      fullWidth: true
    },
    { 
      name: "Reponse", 
      label: "Réponse", 
      type: "textarea", 
      required: true,
      rows: 4,
      fullWidth: true
    }
  ];

  // Gérer l'ajout d'une FAQ
  const handleAdd = () => {
    setCurrentFaq(null);
    setShowForm(true);
  };

  // Gérer la modification d'une FAQ
  const handleEdit = (faq) => {
    setCurrentFaq(faq);
    setShowForm(true);
  };

  // Gérer la suppression d'une FAQ
  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      if (Array.isArray(id)) {
        // Suppression multiple
        await Promise.all(id.map(singleId => 
          axios.delete(`http://keniweb.test/api/faqs/${singleId}`, { headers })
        ));
      } else {
        // Suppression unique
        await axios.delete(`http://keniweb.test/api/faqs/${id}`, { headers });
      }
      await fetchFaqs(); // Recharger les données
      setError(null);
    } catch (err) {
      setError('Erreur lors de la suppression');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      
      // Add ID_Entreprise to the form data
      const dataWithEnterprise = {
        ...formData,
        ID_Entreprise: 1
      };
      
      if (currentFaq) {
        // Mise à jour
        await axios.put(`http://keniweb.test/api/faqs/${currentFaq.ID_FAQ}`, dataWithEnterprise, { headers });
      } else {
        // Ajout
        await axios.post('http://keniweb.test/api/faqs', dataWithEnterprise, { headers });
      }
      await fetchFaqs(); // Recharger les données
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError('Erreur lors de l\'enregistrement');
      console.error('Erreur:', err);
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
        Gérez les questions fréquemment posées qui apparaîtront sur votre site.
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