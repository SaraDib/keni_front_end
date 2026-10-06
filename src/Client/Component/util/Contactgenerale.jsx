import amwaj from '../../assets/images/wave-white-bottom.svg';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import API_BASE_URL from '../../../config';
import { useTranslation } from 'react-i18next';

function Contactgenerale() {
    const [formData, setFormData] = useState({
        ID_Entreprise: '1', // Valeur par défaut ou à récupérer dynamiquement
        Nom: '',
        Email: '',
        Telephone: '',
        Message: ''
    });
    const { t, i18n } = useTranslation();
    const [centres, setCentres] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });

        const fetchCentres = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/centres`);
                setCentres(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching centres:", error);
                setLoading(false);
            }
        };

        fetchCentres();
    }, []);


    // Handle input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/contact-us`, formData, {
                headers: { "Content-Type": "application/json" }
            });

            if (response.status === 201) {
                toast.success("Message envoyé avec succès !");
                console.log('res', response.data);
                setFormData({
                    ID_Entreprise: '1',
                    Nom: '',
                    Email: '',
                    Telephone: '',
                    Message: ''
                }); // Reset form
            } else {
                toast.error("Échec de l'envoi du message !");
            }
        } catch (error) {
            console.error('Erreur:', error);
            toast.error("Une erreur s'est produite. Veuillez réessayer !");
        }
    };
    return (
        <div>
            <Toaster position="bottom-left" />
            <div className='bg-gray-300 pb-10'>
                <img src={amwaj} alt="amwaj" className='z-80 w-full' />

                <div data-aos="fade-zoom-in" data-aos-easing="ease-in-back" data-aos-delay="100" data-aos-offset="0"
                    className='flex flex-col md:flex-row gap-10 px-4 md:px-10'>

                    <div className="flex-1">
                        <div className='flex mt-10'>
                            <div className='flex flex-col gap-6 ml-4 md:ml-10'>
                                <h1 className='text-3xl md:text-4xl text-blue-900 font-dmsans'>Contact général</h1>
                                <h2 className="text-xl md:text-2xl text-customGreen font-dmsans md:ml-9 mb-6 md:mb-12">Écrivez-nous</h2>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full mb-10 px-4 md:px-10'>
                            {[
                                { label: 'Nom complet*', name: 'Nom', type: 'text' },
                                { label: 'Adresse email*', name: 'Email', type: 'email' },
                                { label: 'Téléphone', name: 'Telephone', type: 'text' }
                            ].map(({ label, name, type }, index) => (
                                <div key={index} className="flex flex-col gap-1">
                                    <h4 className="text-lg text-gray-600">{label}</h4>
                                    <input
                                        type={type}
                                        name={name}
                                        value={formData[name]}
                                        onChange={handleChange}
                                        required={name === 'Nom' || name === 'Email'}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition duration-300"
                                    />
                                </div>
                            ))}

                            <div className="flex flex-col gap-1">
                                <h4 className="text-lg text-gray-600">Message*</h4>
                                <textarea
                                    name="Message"
                                    value={formData.Message}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition duration-300"
                                    rows="4"
                                ></textarea>
                            </div>

                            <button type="submit" className="bg-customGreen transition-all duration-300 w-full md:w-1/3 text-white px-6 py-3 rounded-full mt-4 hover:bg-blue-800">
                                Soumettre
                            </button>
                        </form>
                    </div>

                    <div className="flex-1 mt-10 md:mt-16 mb-2">
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-customGreen"></div>
                            </div>
                        ) : centres.length > 0 ? (
                            centres.map((centre, cIndex) => (
                                <div key={centre.ID_Center} className={cIndex > 0 ? 'mt-10' : ''}>
                                    <h2 className="text-xl md:text-2xl text-customGreen font-dmsans mb-6">
                                        {i18n.language === 'ar' && centre.NomAR ? centre.NomAR : centre.Nom}
                                    </h2>
                                    <div className='space-y-3'>
                                        {centre.horaires && centre.horaires.length > 0 ? (
                                            centre.horaires.map((item, index) => (
                                                <div key={index} className='flex justify-between text-gray-700 font-dmsans text-lg md:text-xl border-b pb-4'>
                                                    <div>{i18n.language === 'ar' && item.Day_Start_AR ? item.Day_Start_AR : item.Day_Start}</div>
                                                    <div className='mr-4 md:mr-10'>
                                                        {item.isClosed ? (i18n.language === 'ar' ? 'مغلق' : 'Fermé') : `${item.Time_Start.substring(0, 5)} - ${item.Time_End.substring(0, 5)}`}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 italic">Aucun horaire défini</p>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-10">Aucun centre ou horaire trouvé</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contactgenerale;
