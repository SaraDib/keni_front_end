import { useEffect } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';

import inter from '../../assets/images/wmn.jpg';
import fcb from '../../assets/images/kora.jpg';
import chel from '../../assets/images/dhar.jpg';

export default function Prevention2(){
    
      useEffect(() => {
        AOS.init({
          duration: 2000, // Durée de l'animation
          once: true, // L'animation ne se répète qu'une seule fois
        });
      }, []);

    return(
    <div>
        {/* section1 */}
        <div className="bg-white px-44 py-10 flex flex-col gap-10 max-sm:px-4 max-sm:py-6">
            <h1 className="text-4xl text-blue-950 font-dmsans max-sm:text-3xl">prévention</h1>
            <h2 className="text-1.5xl text-gray-700 font-sans max-sm:text-lg">
            La prévention fait référence aux mesures préventives visant à <b className='text-black'>maintenir un état de santé </b> 
            ou <b className='text-black'>à éviter la récurrence d'une maladie .</b> 
            Les compagnies d’assurance maladie sont encouragées à promouvoir des mesures préventives comme moyen d’aider les gens à s’aider eux-mêmes.
            Des offres préventives sont disponibles dans les domaines de l'exercice,
            de la santé du dos, du système cardiovasculaire, de la relaxation, de l'ergonomie et de la promotion de la santé en entreprise (PSE).
            </h2>
            <h1 className="text-3xl text-customGreen font-dmsans mt-10 max-sm:text-2xl py-6">Cours de prévention à venir</h1>
            <h2 className="text-1.5xl text-gray-700 font-sans max-sm:text-lg flex gap-5">
            <b><p className='text-customGreen'> > </p></b>Lundi 31.3.2025 TK-BackTraining - Dos plus - Entraînement musculaire sain avec équipement
            </h2>
            <h2 className="text-1.5xl text-gray-700 font-sans max-sm:text-lg flex gap-5">
            <b><p className='text-customGreen'> > </p></b> Jeudi 03.4.2025 Entraînement des épaules, du cou et du dos - Dos plus - Entraînement musculaire sain avec équipement
            </h2>
         </div>

         {/* section2 */}
         <div className="bg-gray-100 flex gap-10 justify-between max-sm:flex-col-reverse">
          <div className="p-20 w-15/16 max-sm:p-6 max-sm:w-full">
          <h1 className="text-4xl text-blue-950 font-dmsans max-sm:text-2xl">AOK - Entraînement d'endurance musculaire</h1>
          <h2 className="text-1.5xl text-gray-900 font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
          La vie quotidienne exige beaucoup de nous. L’exercice régulier et modéré répond donc au désir de <b className='text-black'>soulagement</b>  et donc
            <b className='text-black'>de détente </b> de nombreuses personnes  . 
          </h2>
          <h2 className="text-1.5xl text-gray-900 font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
          Dans le cours « AOK – Strength Endurance Training », vous apprendrez à réaliser de manière autonome des exercices d’entraînement en 
          force-endurance, à la fois à la maison et dans le studio où se déroule ce cours. L’entraînement en force et endurance améliore votre
           bien-être physique. Profitez de l'opportunité de six semaines pour découvrir 
          l'atmosphère d'entraînement optimale pour vous en pratiquant une activité de manière détendue. Cela garantira votre bonne santé à
            long terme.       
           </h2>

            <div className='bg-customGreen p-8 mt-10 flex-col'>
            <h1 className="text-3xl text-white font-dmsans max-sm:text-2xl">AOK force endurance 8 semaines</h1>
            <h2 className="text-1.5xl text-white font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">Les assurés de l'AOK Rheinland/Hamburg peuvent se faire délivrer un bon 
                « actif et en bonne santé »</h2>
                <hr className='h-1 my-8'  />
            <h2 className="text-1.5xl text-white font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Prix ​​150,- €
            </h2>
            <h2 className="text-1.5xl text-white font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Remboursement pour les assurés d'autres caisses d'assurance maladie 75.- à 150.- €
            </h2>
            </div>

        </div>
        <div data-aos="fade-left" className="w-4/6 max-sm:w-full max-sm:p-4">
          <img src={inter} alt='inter' className="h-full object-cover max-sm:h-auto" />
        </div>
        </div>

        {/* section3 */}
        <div className="bg-customBleu flex gap-10 justify-between max-sm:flex-col">
        <div data-aos="fade-right" className="w-4/6 max-sm:w-full max-sm:p-4">
          <img src={chel} alt='chelsea' className="h-full object-cover max-sm:h-auto" />
        </div>

        <div className="px-20 pb-20 pt-32 w-15/16 max-sm:p-6 max-sm:w-full">
          <h1 className="text-4xl text-white font-dmsans max-sm:text-2xl">retour plus</h1>
          <h2 className="text-1.5xl text-gray-300 font-sans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Ici, vous apprendrez d'abord à bien connaître votre dos : ce qui lui est bon, ce qu'il n'aime pas du tout et quels exercices l'aident
            à rester en forme. Théorie et pratique alternent. Vous apprendrez tout sur les étirements appropriés, la coordination ciblée et
            l'entraînement musculaire. Il y a aussi des pauses
            pour se détendre. Sur cette base, vous découvrirez ensuite  dans la 
            deuxième partie la formation aux équipements axés sur la santé  .  </h2>
       
            <div className='bg-customGreen p-8 mt-10 flex-col'>
            <h1 className="text-3xl text-white font-dmsans max-sm:text-2xl">TK-Retour plus 9 semaines</h1>
            <h2 className="text-1.5xl text-white font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0"><b>à partir du 31.3 lundi 19h00</b></h2>
            <h2 className="text-1.5xl text-white font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0"><b>à partir du 3 avril Les jeudis à 19h00</b></h2>
    
                <hr className='h-1 my-8'  />

            <h2 className="text-1.5xl text-white font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Prix ​​150,- €
            </h2>
            <h2 className="text-1.5xl text-white font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Remboursement pour les assurés d'autres caisses d'assurance maladie 75.- à 150.- €
            </h2>
            </div>
       </div>
       
      </div>

       {/* section4 */}
       
       <div  className="bg-gray-100 flex gap-10 justify-between max-sm:flex-col-reverse">
          <div className="p-20 w-15/16 max-sm:p-6 max-sm:w-full">
          <h1 className="text-4xl text-blue-950 font-dmsans max-sm:text-2xl">Gymnastique vertébrale</h1>
          <h2 className="text-1.5xl text-gray-800 font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
          Dans le cours sur la colonne vertébrale, vous apprendrez les positions de départ de base pour les <b>exercices fonctionnels </b> 
           et l'utilisation correcte du petit équipement. Après la phase d'échauffement, certains groupes musculaires importants
            pour la stabilisation du dos sont renforcés de manière intensive par des exercices avec ou sans petit matériel.
             La priorité ici est <b>d’entraîner la force, l’endurance</b>   , la coordination et l’équilibre pour renforcer les muscles plus profonds.
              Le programme de  mobilisation, d'étirement
           et de relaxation qui suit améliore la mobilité et le métabolisme pour la régénération après l'exercice.
          </h2>
          <h2 className="text-1.5xl text-gray-900 font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
          Entraînement. Vous recevrez également des exercices à faire à la maison afin de pouvoir continuer à vous entraîner après le cours.       
           </h2>

           <h2 className="text-1.5xl text-gray-900 font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
           La gymnastique vertébrale est idéale pour les adultes ayant un mode de vie sédentaire, causé par un travail de bureau ou un manque de mouvement dans la vie quotidienne. Les personnes qui ont déjà souffert de maux de dos ou qui ont un risque auto-évalué de souffrir de maux de dos. Les personnes qui
           présentent des facteurs de risque typiques d’intensification ou de chronicisation des maux de dos.
           </h2>

        </div>
        <div data-aos="fade-left" className="w-4/6 max-sm:w-full max-sm:p-4">
          <img src={fcb} alt='inter' className="h-full object-cover max-sm:h-auto" />
        </div>
        </div>
        {/* section5 */}

        <div className="bg-customBleu flex gap-10 justify-between max-sm:flex-col">
        <div data-aos="fade-right" className="w-4/6 max-sm:w-full max-sm:p-4">
          <img src={chel} alt='chelsea' className="h-full w-full max-sm:h-auto" />
        </div>

        <div className="px-20 pb-20 pt-32 w-15/16 max-sm:p-6 max-sm:w-full">
          <h1 className="text-4xl text-white font-dmsans max-sm:text-2xl">Yoga</h1>
          <h2 className="text-1.5xl text-gray-300 font-sans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
          L’intégration consciente de la respiration, de la posture et du mouvement distingue le yoga
           de la gymnastique ou d’autres exercices physiques. .  </h2>

           <div className="mt-5">
          {[
            { idx: ">", p: "Le yoga augmente la force et la flexibilité" },
            { idx: ">", p: "Améliore votre propre conscience corporelle" },
            { idx: ">", p: "Réduit la tension et la douleur" },
            { idx: ">", p: "Soulage les maux liés à l'âge" },
            { idx: ">", p: "Conduit à la paix intérieure et à l'équilibre" },
            { idx: ">", p: "Améliore la qualité de vie et la forme mentale." },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-row text-gray-300 font-dmsans text-xl md:text-xl pb-4 px-5 max-sm:text-base"
            >
              <div className="pr-4 text-customGreen">{item.idx} </div>
              <div>{item.p}</div>
            </div>
          ))}
        </div>
            
       </div>
       
      </div>

    </div>

    );
}