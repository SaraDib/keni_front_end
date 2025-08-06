import amwaj from '../../assets/images/wave-white-bottom.svg'; 
import 'aos/dist/aos.css'; 
import AOS from 'aos';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

function Contactgenerale() {
    const [formData, setFormData] = useState({
        ID_Entreprise: '1', // Valeur par défaut ou à récupérer dynamiquement
        Nom: '',
        Email: '',
        Telephone: '',
        Message: ''
    });
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
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
            const response = await axios.post("http://localhost:8000/api/contact-us", formData, {
                headers: { "Content-Type": "application/json" }
            });

            if (response.status === 201) {
                toast.success("Message envoyé avec succès !");
                console.log('res' , response.data);
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

                    <div className="flex-1 mt-10 md:mt-28 mb-2">
                        <h2 className="text-xl md:text-2xl text-customGreen font-dmsans mb-8 md:mb-16">Horaires d'ouverture des formations</h2>
                        <div className='space-y-3'>
                            {[{ jour: "Lundi, Jeudi", horaire: "06:00 - 20:00" },
                              { jour: "Mardi, Mercredi", horaire: "08:00 - 20:00" },
                              { jour: "Vendredi", horaire: "08:00 - 19:00" },
                              { jour: "Samedi", horaire: "08:00 - 13:00" },
                              { jour: "Dimanche", horaire: "Fermé" }].map((item, index) => (
                                <div key={index} className='flex justify-between text-gray-700 font-dmsans text-lg md:text-xl border-b pb-4'>
                                    <div>{item.jour}</div>
                                    <div className='mr-4 md:mr-10'>{item.horaire}</div>
                                </div>
                            ))}
                        </div>

                        <h2 className='text-xl md:text-2xl text-customGreen font-dmsans mt-10'>Horaires d'ouverture de la thérapie</h2>
                        <div className='space-y-3 mt-6 md:mt-8'>
                            {[{ jour: "Lundi-Jeudi", horaire: "07:40 - 19:00" },
                              { jour: "Vendredi", horaire: "07:40 - 14:00" },
                              { jour: "Samedi-Dimanche", horaire: "Fermé" }].map((item, index) => (
                                <div key={index} className='flex justify-between text-gray-700 font-dmsans text-lg md:text-xl border-b pb-4'>
                                    <div>{item.jour}</div>
                                    <div className='mr-4 md:mr-10'>{item.horaire}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contactgenerale;
