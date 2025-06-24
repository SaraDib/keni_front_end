import { useEffect } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';

import fcb from '../../assets/images/kdbc.jpg';
import doctor from '../../assets/images/doctor.jpg';


export default function Sport2(){

    useEffect(() => {
            AOS.init({
              duration: 2000, // Durée de l'animation
              once: true, // L'animation ne se répète qu'une seule fois
            });
          }, []);

          const schedule = [
            ["08h00 - 08h45 Rééducation sportive (Anastasia)", "9h00 – 09h45 Rééducation (Christine)", "11h00 - 11h45 Rééducation (Michelle)", "08h00 - 08h45 Rééducation (Brigitte)", "10h00 - 10h45 Rééducation sportive (Anastasia)"],
            ["09h00 - 09h45 Rééducation sportive (Anastasia)", "13:00 - 13:45 Rééducation (Brigitte)", "13:00 - 13:45 Rééducation (Christine)", "9h00 – 09h45 Rééducation (Christine)", "11h00 - 11h45 Rééducation sportive (Anastasia)"],
            ["10h00 - 10h45 Rééducation sportive (Anastasia)", "14h00 - 14h45 Rééducation sportive (Brigitte)", "14:00 - 14:45 Rééducation (Christine)", "15h00 - 15h45 Rééducation sportive (Michelle)", "12h00 - 12h45 Rééducation (Michelle)"],
            ["15h00 - 15h45 Rééducation sportive (Michelle)", "", "17h00 - 17h45 Rééducation sportive (Christine)", "16h00 - 16h45 Rééducation (Michelle)", ""],
            ["16h00 - 16h45 Rééducation (Michelle)", "", "18h00 - 18h45 Rééducation (Christine)", "18h00 - 19h00 Prévention (Maren-Louisa)", ""],
            ["19h00 - 20h00 Prévention (Alina)", "", "19:00 - 19:45 Rééducation (Christine)", "", ""],
          ];

    return( 
        <div>
            {/* Section 1 */}
            <div className="bg-white px-44 py-10 flex flex-col gap-4 max-sm:px-4 max-sm:py-6">
            <h1 className="text-4xl text-blue-950 mb-5 font-dmsans max-sm:text-3xl">Rééducation orthopédique sportive</h1>
            <h2 className="text-1.5xl text-gray-700 font-sans max-sm:text-lg">
            Les sports de rééducation offrent à toutes les personnes souffrant <b className="text-black">de limitations orthopédiques </b> la possibilité de 
            se remettre en mouvement. Une douleur constante, une mobilité limitée et un manque d’équilibre ne sont 
            <b className="text-black"> pas des raisons pour rester inactif .</b> 
            </h2>
            <h2 className="text-1.5xl text-gray-700 font-sans max-sm:text-lg ">Rehasport Frintrop eV propose
                  <b className="text-black"> plus de 25 cours</b>  de rééducation sportive dans les locaux du centre de santé et de sport.
            </h2>
            <h2 className="text-1.5xl text-gray-700 font-sans max-sm:text-lg ">
            Venez  nous voir <b className="text-black">avec ou sans prescription médicale</b>  et découvrez comment 
            le sport de rééducation peut vous rendre à nouveau mobile et réduire votre douleur.
            </h2>
            <h2 className="text-1.5xl text-gray-700 font-sans max-sm:text-lg ">
            Qu’est-ce qui nous distingue des autres prestataires de services de réadaptation sportive ?
            </h2>
            <h2 className="text-1.5xl text-gray-700 font-sans max-sm:text-lg ">
            Les exercices des groupes sportifs de rééducation visent à permettre à chacun, même à ceux qui présentent des plaintes différentes,
             de participer au groupe et  <b className="text-black">d'améliorer la posture, l'équilibre, la mobilité et la force .</b> En plus du programme général d'exercices
              en groupe, nous vous offrons la possibilité de travailler spécifiquement sur votre condition médicale.
             Nos <b className="text-black">options de formation professionnelles et personnalisées</b>   pourraient vous aider à vivre une vie sans douleur à long terme.            </h2>
            </div>

            {/* Section 2 */}
            <div className="bg-gray-200 px-44 py-10 flex flex-col gap-4 max-sm:px-4 max-sm:py-6">
                <h1 className="text-4xl text-blue-950 mb-5 mt-10 font-dmsans max-sm:text-3xl">Rééducation orthopédique sportive</h1>
                <h2 className="text-1.5xl text-gray-900 font-sans max-sm:text-lg">
                L’exercice est l’une des pierres angulaires du traitement du diabète et présente de nombreux autres effets positifs.
                Faire de l’exercice en groupe est amusant, facilite la prise en main et est motivant.
                </h2>
            </div>

            {/* Section 3 */}
            <div className="bg-white px-44 py-10 flex flex-col gap-4 max-sm:px-4 max-sm:py-6">
                <h1 className="text-4xl text-blue-950 mb-5 mt-10 font-dmsans max-sm:text-3xl">rééducation sport pulmonaire</h1>
                <h2 className="text-1.5xl text-gray-900 font-sans max-sm:text-lg">
                L'exercice pulmonaire est une forme d'exercice qui complète la thérapie pour les patients souffrant <b className="text-black"></b>de maladies chroniques
                obstructives des voies respiratoires et des poumons .
                </h2>
                <h2 className="text-1.5xl text-gray-900 font-sans max-sm:text-lg">
                Les tableaux cliniques importants sont :
                </h2>
                <div className="mt-5">
          {[
            { idx: ">", p: "asthme bronchique" },
            { idx: ">", p: "MPOC" },
            { idx: ">", p: "Maladies pulmonaires interstitielles" },
            { idx: ">", p: "fibrose kystique" },
            { idx: ">", p: "Hypertension pulmonaire" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-row text-gray-800 font-dmsans text-xl md:text-xl pb-4 px-5 max-sm:text-base"
            >
              <div className="pr-4 text-customGreen font-extrabold">{item.idx} </div>
              <div>{item.p}</div>
            </div>
            ))}
            </div>
            <h2 className="text-1.5xl text-gray-900 mt-5 font-dmsans max-sm:text-lg">
            La participation <b className="text-black">à l'exercice pulmonaire</b> dépend de la gravité de l'atteinte fonctionnelle de la maladie respiratoire primaire et
             de toute maladie
             concomitante, en particulier du système cardiovasculaire. Un examen médical et une prescription sont donc nécessaires au préalable.           
             </h2>

             <h2 className="text-1.5xl text-gray-900 mt-5 font-dmsans max-sm:text-lg">
                Si les conditions de santé sont remplies selon les critères
                 d'inclusion et d'exclusion définis, la participation aux sports pulmonaires peut être prescrite par le médecin traitant
                  au moyen du formulaire 56 « Demande de remboursement des frais pour les sports de rééducation ».
             </h2>
             <h1 className="text-4xl text-customGreen mt-7 font-dmsans max-sm:text-3xl">Objectifs</h1>
             <h2 className="text-1.5xl text-gray-900 font-dmsans max-sm:text-lg">
             La pratique continue des sports pulmonaires - avec des instructeurs spécialisés qualifiés - permet d'atteindre
            les objectifs suivants en plus de l'expérience de groupe et du plaisir de l'exercice :
             </h2>
             <div className="mt-5">
          {[
            { idx: ">", p: "Amélioration de la force, de l'endurance, de la mobilité et de la coordination" },
            { idx: ">", p: "Réduction de l'essoufflement et des exacerbations, stabilisation de la maladie" },
            { idx: ">", p: "augmentation des performances" },
            { idx: ">", p: "améliorer la gestion quotidienne" },
            { idx: ">", p: "Renforcer la confiance en ses propres performances et la confiance en soi" },
            { idx: ">", p: "Une meilleure intégration sociale grâce à des activités partagées" },
            { idx: ">", p: "améliorer la qualité de vie" },
            { idx: ">", p: "Réduction des réhospitalisations" },

          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-row text-gray-800 font-dmsans text-xl md:text-xl pb-4 px-5 max-sm:text-base"
            >
              <div className="pr-4 text-customGreen font-extrabold">{item.idx} </div>
              <div>{item.p}</div>
            </div>
            ))}
            </div>
            
            </div>
            
            {/* Section 4 */}
            <div  className="bg-gray-100 flex gap-10 justify-between max-sm:flex-col-reverse">
          <div className="p-20 w-15/16 max-sm:p-6 max-sm:w-full">
          <h1 className="text-4xl text-blue-950 font-dmsans max-sm:text-2xl">Association</h1>
          <h2 className="text-2xl text-customGreen font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
          Notre devise : « Le mouvement c'est la vie »
          </h2>
          <h2 className="text-1.5xl text-gray-900 font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
          Nous sommes un fournisseur qualifié de sports de réadaptation. Notre objectif est de motiver toutes les personnes, en
           particulier celles ayant des limitations fonctionnelles, physiques et d’activité, à participer à un sport indépendant 
           et à long terme.
           </h2>

           <h2 className="text-1.5xl text-gray-900 font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
           L'association Rehasport Frintrop eV est affiliée à RehaSport Deutschland eV 
           <p className='text-customGreen'><a href='.'>www.rehasport-deutschland.de .</a> </p>
           </h2>

        </div>
        <div data-aos="fade-left" className="w-4/6 max-sm:w-full max-sm:p-4">
          <img src={fcb} alt='inter' className="h-full object-cover max-sm:h-auto" />
        </div>
            </div>

            {/* Section 5 */}
            <div className="bg-customBleu flex gap-10 justify-between max-sm:flex-col">
                <div data-aos="fade-right" className="w-4/6 max-sm:w-full max-sm:p-4">
                    <img src={doctor} alt='doctor' className="h-full object-cover max-sm:h-auto" />
                </div>

            <div className="px-20 pb-20 pt-32 w-15/16 max-sm:p-6 max-sm:w-full">
            <h1 className="text-4xl text-white font-dmsans max-sm:text-2xl">Règlements</h1>
            <h2 className="text-1.5xl text-gray-300 font-sans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Vous pouvez pratiquer des sports de rééducation avec nous conformément au § 44 du Code social IX sur ordonnance (formulaire 56).
             Tout médecin en exercice peut délivrer cette ordonnance. Cela ne pèse pas sur son budget. Avant de commencer une activité sportive
              de rééducation, la prescription doit être approuvée par votre caisse d'assurance maladie.
             Le règlement standard pour les sports de rééducation prévoit 50 unités, auxquelles vous pouvez participer 1 à 2 fois par semaine.
               </h2>
               <h2 className="text-1.5xl text-gray-300 font-sans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
               Une nouvelle ordonnance peut être délivrée après une prestation de réadaptation médicale ambulatoire ou hospitalière.
               D'autres réglementations ultérieures sont généralement possibles à une date ultérieure.
               </h2>
               <h2 className="text-1.5xl text-gray-300 font-sans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
               Afin de maintenir votre <b className='text-white'>habitude sportive préférée</b>   , il est possible de pratiquer des sports de rééducation même sans ordonnance.
               </h2>
                </div>
            </div>

            {/* Section 6 */}
            <div className="bg-white px-44 py-10 flex flex-col gap-4 max-sm:px-4 max-sm:py-6">
                <h2 className="text-1.5xl text-gray-900 font-sans max-sm:text-lg">
                    Nos cours ont lieu régulièrement chaque semaine à des horaires différents. Trouvez le cours qui vous convient le mieux
                    et rejoignez-nous.
                    Nous attendons votre visite avec impatience et serons heureux de vous conseiller si vous avez des questions !
                </h2>

                <div className="pt-10 p-4 max-w-full overflow-hidden bg-white ">
          <h1 className="text-4xl text-blue-950 font-dmsans max-sm:text-2xl">Plan de formation</h1>
          <div className="max-w-full overflow-auto border border-gray-300 rounded-lg" style={{ maxHeight: '400px' }}>
          <table className="w-full border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="p-3 border border-gray-300">Lundi</th>
                <th className="p-3 border border-gray-300">Mardi</th>
                <th className="p-3 border border-gray-300">Mercredi</th>
                <th className="p-3 border border-gray-300">Jeudi</th>
                <th className="p-3 border border-gray-300">Vendredi</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`p-2 md:p-4 border border-gray-300 ${cell ? "text-gray-700" : "bg-gray-100"}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

            </div>
        </div>
    )
}