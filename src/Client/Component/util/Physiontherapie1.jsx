import { useEffect } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';

import DC from '../../assets/images/DSC01864-2880w.webp'
import Wave from '../../assets/images/wave.svg'
import fb from "../../assets/images/fb.png";
import insta from "../../assets/images/insta.png";
import Image1 from '../../assets/images/T+2+2023-11-08+10_33_40-2880w.webp'
import image3 from '../../assets/images/shutterstock_575303488-684747b5-2880w.webp'
import image5 from '../../assets/images/image5.jpg';
import image6 from '../../assets/images/image6.jpg';
import image7 from '../../assets/images/image7.jpg';
import image8 from '../../assets/images/image8.jpg';
import image9 from '../../assets/images/image9.jpg';
import image10 from '../../assets/images/image10.jpg';
import image13 from '../../assets/images/image13.jpg';
import image14 from '../../assets/images/image14.jpg';
import image15 from '../../assets/images/image15.jpg';

// import OpacityComponent from './OpacityComponent';




function Physiontherapie1() {

  useEffect(() => {
    AOS.init({
      duration: 1000, // Durée de l'animation
      once: true,     // L'animation ne se répète qu'une seule fois
    });
  }, []);

  return (
    <div>
      <div className=" w-full h-screen overflow-hidden relative">
        <img
          src={DC}
          alt="FAQ"
          className="w-full h-full object-cover"
        />


        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-between">

          <div data-aos="zoom-in" className="absolute bottom-1/2 sm:bottom-1/3 max-sm:bottom-1/3 flex flex-col max-sm:left-0 sm:flex sm:justify-start text-white p-4 lg:ml-14">
            <h1 className="max-sm:text-5xl sm:text-6xl font-dmsans mb-2">Prévention</h1>
            <h2 className="text-customGreen sm:text-4xl font-dmsans max-sm:text-2xl" >
              GlobalHealth - Therapy & Training Center
            </h2>
          </div>

          <div className="hidden md:flex absolute top-2/4 sm:bottom-6 left-24 max-sm:left-6  max-sm:bottom-44 sm:right-16 flex flex-row items-end justify-self-end gap-4 sm:flex-col w-12 z-40">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <div className="bg-white rounded-full w-10 sm:w-11 hover:translate-x-4 transition-all cursor-pointer shadow-lg p-2.5 flex items-center justify-center">
                <img src={fb} alt="facebook" className="w-full" />
              </div>
            </a>

            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <div className="bg-white rounded-full w-10 sm:w-11 hover:translate-x-4 transition-all cursor-pointer shadow-lg p-2.5 flex items-center justify-center">
                <img src={insta} alt="instagram" className="w-full" />
              </div>
            </a>
          </div>

          <div className="absolute bottom-0 w-full">
            <img src={Wave} alt="kante" className="w-full" />
          </div>
        </div>
      </div>
      {/* </div> */}
      <div className="bg-white max-w-0xl mx-auto p-4 md:p-6 font-salam" >
        <h2 className="text-4xl md:text-4xl font-salam pl-64 max-sm:pl-0 text-blue-900 mb-4 text-center md:text-left">physiothérapie</h2>
        <p className="text-gray-700 mb-6 md:mb-8 pl-64 w-10/12 max-sm:w-full max-sm:pl-0 leading-relaxed text-left md:text-left">
          En physiothérapie, nos thérapeutes expérimentés vous aideront en cas de plaintes aiguës ou chroniques. Qu'il s'agisse de physiothérapie (PT), de physiothérapie sur appareil (KGG), de thérapie manuelle (MT), de physiothérapie neurologique (PT-CNS) ou de fango et massage (KMT), nous mettons tout en œuvre pour vous remettre en forme après des problèmes musculaires et articulaires, des maux de dos ou après des accidents de sport et de travail.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pl-40 max-sm:pl-0 overflow-hidden w-11/12 max-sm:w-full h-full md:h-[250px]">
          <div data-aos="fade-right" className="overflow-hidden">
            <img
              src={Image1}
              alt="Physiothérapie 1"
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            />
          </div>
          <div data-aos="fade-left" className="overflow-hidden">
            <img
              src={image15}
              alt="Physiothérapie 2"
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            />
          </div>
        </div>
      </div>

      {/* section1 */}

      <div className="bg-gray-100 flex gap-10 justify-between max-sm:flex-col-reverse">
        <div className="p-20 w-15/16 max-sm:p-6 max-sm:w-full" >
          <h1 className="text-4xl text-blue-950 font-dmsans max-sm:text-2xl">physiothérapie</h1>
          <h2 className="text-1.5xl text-gray-800 font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0" >
            Le but de la physiothérapie est de maintenir, d’améliorer ou de restaurer la mobilité et la fonctionnalité du patient après une blessure. Différentes mesures sont appliquées au cours de la thérapie.
          </h2>
          <h1 className="text-3xl text-customGreen font-dmsans mt-10 max-sm:text-2xl py-6">Les mesures thérapeutiques servent à</h1>

          <div className="mt-5">
            {[
              { idx: ">", p: "soulagement de la douleur" },
              { idx: ">", p: "agilité, force, endurance et coordination" },
              { idx: ">", p: "amélioration du système cardiovasculaire" },
              { idx: ">", p: "amélioration de la mobilité active et passive" },

            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-row text-gray-700 font-dmsans text-xl md:text-xl pb-4 px-5 max-sm:text-base"
              >
                <div className="pr-4 text-customGreen">{item.idx} </div>
                <div dangerouslySetInnerHTML={{ __html: item.p }}></div>
              </div>
            ))}
          </div>

        </div>
        <div data-aos="fade-left" className="w-4/6 max-sm:w-full max-sm:p-4">
          <img src={image3} alt='inter' className="h-full object-cover max-sm:h-auto" />
        </div>
      </div>
      {/* section2 */}

      <div className="bg-customBleu flex gap-10 justify-between max-sm:flex-col">
        <div data-aos="fade-right" className="w-4/6 max-sm:w-full max-sm:p-4">
          <img src={image14} alt='chelsea' className="h-full w-full object-cover max-sm:h-auto" />
        </div>
        <div className="px-20 pb-20 pt-32 w-15/16 max-sm:p-6 max-sm:w-full">
          <h1 className="text-4xl text-white font-dmsans max-sm:text-2xl">thérapie manuelle</h1>
          <h2 className="text-1.5xl text-gray-300 font-sans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            La thérapie manuelle est utilisée pour traiter les troubles fonctionnels du système musculo-squelettique (articulations, muscles, nerfs, tissu conjonctif).
          </h2>
          <h2 className="text-1.5xl text-gray-300 font-sans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Cette forme de thérapie agit directement sur le métabolisme des tissus, ce qui peut améliorer la mobilité
            et réduire la pression. Le soulagement de la douleur a également un large éventail d’effets.
          </h2>
          <h2 className="text-1.5xl text-gray-300 font-sans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            De plus, il comprend des techniques diagnostiques et thérapeutiques sur la colonne vertébrale et
            les articulations des extrémités, qui  <b className='text-white'>sont utilisées pour détecter et corriger les troubles.</b>
          </h2>


        </div>
      </div>

      {/* section 3 */}

      <div className="bg-gray-100 flex gap-10 justify-between max-sm:flex-col-reverse">
        <div className="p-20 w-15/16 max-sm:p-6 max-sm:w-full">
          <h1 className="text-4xl text-blue-950 font-dmsans max-sm:text-2xl">PNF</h1>
          <h1 className="text-3xl text-customGreen font-dmsans mt-10 max-sm:text-2xl py-6">Facilitation neuromusculaire proprioceptive</h1>
          <h2 className="text-1.5xl text-gray-800 font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Le but de la physiothérapie est de maintenir, d’améliorer ou de restaurer la mobilité et la fonctionnalité du patient après une blessure.
            Différentes mesures sont appliquées au cours de la thérapie.
          </h2>

          <h2 className="text-1.5xl text-gray-800 font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Le PNF stimule et active les récepteurs des articulations, des muscles et des tendons par une stimulation ciblée.
            La stimulation  <b className='text-black'>favorise la perception</b> , essentielle à l’organisation du mouvement.
          </h2>
          <h2 className="text-1.5xl text-gray-900 font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Le PNF favorise l’interaction entre les récepteurs, les nerfs et les muscles. Si ces éléments fonctionnent bien ensemble,
            tous <b className='text-black'>les mouvements quotidiens</b> deviennent plus faciles pour le patient
            . Le PNF peut également être utilisé avec beaucoup de succès dans les conditions orthopédiques et postopératoires.
          </h2>

          <h2 className="text-1.5xl text-gray-900 font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Les indications du traitement de physiothérapie du SNC concernent toutes les maladies du
            <b className='text-black'> système nerveux central :</b>
          </h2>

          <h2 className="text-1.5xl text-gray-900 font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Accident vasculaire cérébral, maladie de Parkinson, traumatisme crânien, sclérose en plaques,
            post-hémorragie cérébrale, diverses maladies neuromusculaires...
          </h2>

        </div>
        <div data-aos="fade-left" className="w-4/6 max-sm:w-full max-sm:p-4">
          <img src={Image1} alt='inter' className="h-full object-cover max-sm:h-auto" />
        </div>
      </div>

      {/* section5 */}

      <div className="bg-customBleu flex gap-10 justify-between max-sm:flex-col">
        <div data-aos="fade-right" className="w-4/6 max-sm:w-full max-sm:p-4">
          <img src={image6} alt='chelsea' className="h-full w-full object-cover max-sm:h-auto" />
        </div>
        <div className="px-20 pb-20 pt-32 w-15/16 max-sm:p-6 max-sm:w-full">
          <h1 className="text-4xl text-white font-dmsans max-sm:text-2xl">Bobath</h1>
          <h1 className="text-3xl text-customGreen font-dmsans mt-10 max-sm:text-2xl py-3">Physiothérapie sur une base neurophysiologique</h1>
          <h2 className="text-1.5xl text-gray-300 font-sans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Notre système nerveux a la capacité d’apprendre tout au long de notre vie. Après un dommage, la plasticité du cerveau permet
            d'activer de nouvelles capacités. <b className='text-white'>Après un accident vasculaire cérébral,</b> les patients
            ont souvent tendance à négliger le côté paralysé de leur corps et à compenser encore plus leurs limitations avec
            le côté mobile de leur corps. Cependant, de tels mouvements unilatéraux n'aident le patient que superficiellement,
            car le côté le plus affecté
            n'a pas la possibilité de recevoir et de traiter de nouvelles informations. Le cerveau n’a donc pas pour tâche de se restructurer.
          </h2>
          <h2 className="text-1.5xl text-gray-300 font-sans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Le principe principal du concept Bobath implique davantage le côté le plus affecté du corps dans les mouvements du quotidien en le stimulant sensoriellement afin de garder ses mouvements en harmonie avec le côté le moins affecté du corps. Travailler avec le concept Bobath ne nécessite essentiellement aucun exercice standardisé.
            <b className='text-white'>On y apprend</b>  plutôt des activités thérapeutiques quotidiennes  que le patient rencontre dans son environnement privé.
          </h2>


        </div>
      </div>

      {/* section 6 */}

      <div className="bg-gray-100 flex gap-10 justify-between max-sm:flex-col-reverse">
        <div className="p-20 w-15/16 max-sm:p-6 max-sm:w-full">
          <h1 className="text-4xl text-blue-950 font-dmsans max-sm:text-2xl">DLM</h1>
          <h1 className="text-3xl text-customGreen font-dmsans mt-10 max-sm:text-2xl py-6">Drainage lymphatique manuel</h1>
          <h2 className="text-1.5xl text-gray-800 font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Le drainage lymphatique manuel est une forme de thérapie physique. Son mode d'action est large et il est principalement utilisé comme thérapie contre les œdèmes et la décongestion des zones gonflées du corps, telles que le tronc et les extrémités (bras et jambes),
            qui peuvent survenir après <b className='text-black'>un traumatisme ou une intervention chirurgicale .</b>
          </h2>

          <h2 className="text-1.5xl text-gray-800 font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Die manuelle Lymphdrainage ist eine Therapieform der physikalischen Anwendungen. Ihre Wirkungsweise ist breit gefächert und sie
            dient vor allem als Ödem- und Entstauungstherapie geschwollener Körperregionen,
            wie Rumpf und Extremitäten (Arme und Beine), welche nach Traumata oder Operationen entstehen können.
          </h2>
          <h2 className="text-1.5xl text-gray-900 font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Cette thérapie est particulièrement souvent  nécessaire <b className='text-black'>après l'ablation d'une tumeur  . </b>
            Grâce à des techniques de mouvements circulaires
            , appliquées avec une légère pression, le liquide est déplacé du tissu vers le système lymphatique.
            Le drainage lymphatique manuel affecte principalement la peau et la zone sous-cutanée et n'a pas pour
            but d'augmenter la circulation sanguine, comme dans le massage classique.
          </h2>

          <h2 className="text-1.5xl text-gray-900 font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            D'autres indications sont toutes les maladies orthopédiques et traumatologiques qui s'accompagnent d'œdèmes
            (luxations, foulures, entorses, déchirures des fibres musculaires, etc.).
          </h2>

          <h2 className="text-1.5xl text-gray-900 font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Le drainage lymphatique manuel est également utilisé en cas de brûlures, de coup du lapin, de maladie
            de Sudeck et d'affections médicales similaires.
          </h2>

        </div>
        <div data-aos="fade-left" className="w-4/6 max-sm:w-full max-sm:p-4">
          <img src={image8} alt='inter' className="h-full object-cover max-sm:h-auto" />
        </div>
      </div>

      {/* section 7 */}

      <div className="bg-customBleu flex gap-10 justify-between max-sm:flex-col">
        <div data-aos="fade-right" className="w-4/6 max-sm:w-full max-sm:p-4">
          <img src={image7} alt='chelsea' className="h-full w-full object-cover max-sm:h-auto" />
        </div>
        <div className="px-20 pb-20 pt-32 w-15/16 max-sm:p-6 max-sm:w-full">
          <h1 className="text-4xl text-white font-dmsans max-sm:text-2xl">KGG</h1>
          <h1 className="text-3xl text-customGreen font-dmsans mt-10 max-sm:text-2xl py-3">physiothérapie sur l'appareil</h1>
          <h2 className="text-1.5xl text-gray-300 font-sans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            La physiothérapie sur appareil (KGG) est utilisée pour entraîner  <b className='text-white'>des séquences de mouvements  physiologiques et
              renforcer les muscles</b> à l'aide d'équipements d'entraînement .
          </h2>
          <h2 className="text-1.5xl text-gray-300 font-sans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Après de longues périodes de repos dues à des douleurs persistantes et à une posture protectrice ou après une intervention chirurgicale,
            les muscles perdent rapidement leur force ou parfois même dégénèrent (atrophie). Des stimuli de force ciblés conduisent à la reconstruction musculaire en termes
            d’endurance, de taille et de force explosive. Cela  favorise <b className='text-white'>la stabilité des articulations ,</b> par exemple au niveau de l’épaule.
          </h2>
          <h2 className="text-1.5xl text-gray-300 font-sans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            En particulier dans le cas d' <b className='text-white'>une prothèse articulaire</b>  du genou (TEP du genou) ou de la hanche (TEP de la hanche),
            un renforcement musculaire ultérieur est nécessaire. En entraînant les muscles centraux,
            <b className='text-white'>les problèmes de dos</b>  (cervicaux, thoraciques, lombaires) peuvent également être traités avec succès.
          </h2>

        </div>
      </div>

      {/* section 8 */}

      <div className="bg-gray-100 flex gap-10 justify-between max-sm:flex-col-reverse">
        <div className="p-20 w-15/16 max-sm:p-6 max-sm:w-full">
          <h1 className="text-4xl text-blue-950 font-dmsans max-sm:text-2xl">KMT</h1>
          <h1 className="text-3xl text-customGreen font-dmsans mt-10 max-sm:text-2xl py-6">Thérapie de massage classique</h1>
          <h2 className="text-1.5xl text-gray-800 font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Le massage est l’une des méthodes de guérison les plus connues et les plus anciennes. Les massages peuvent être utilisés
            comme traitement autonome, mais ils peuvent également être utilisés en complément d'autres formes de thérapie =  <b className='text-black'>physiothérapie .</b>
          </h2>

          <h2 className="text-1.5xl text-gray-800 font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Die manuelle Lymphdrainage ist eine Therapieform der physikalischen Anwendungen. Ihre Wirkungsweise ist breit gefächert und sie
            dient vor allem als Ödem- und Entstauungstherapie geschwollener Körperregionen,
            wie Rumpf und Extremitäten (Arme und Beine), welche nach Traumata oder Operationen entstehen können.
          </h2>
          <h2 className="text-1.5xl text-gray-900 font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Le but du massage classique est de détendre les muscles tendus, de favoriser la circulation sanguine et le métabolisme,
            d'avoir un effet positif sur la circulation, <b className='text-black'>la pression artérielle </b> , la respiration et le psychisme et
            <b className='text-black'>de réduire la douleur .</b> Différentes techniques de préhension sont utilisées par le thérapeute en fonction de l'effet recherché.
          </h2>

        </div>
        <div data-aos="fade-left" className="w-4/6 max-sm:w-full max-sm:p-4">
          <img src={image5} alt='inter' className="h-full object-cover max-sm:h-auto" />
        </div>
      </div>

      {/* section 9 */}

      <div className="bg-customBleu flex gap-10 justify-between max-sm:flex-col">
        <div data-aos="fade-right" className="w-4/6 max-sm:w-full max-sm:p-4">
          <img src={image9} alt='chelsea' className="h-full w-full object-cover max-sm:h-auto" />
        </div>
        <div className="px-20 pb-20 pt-32 w-15/16 max-sm:p-6 max-sm:w-full">
          <h1 className="text-4xl text-white font-dmsans max-sm:text-2xl">Bande kinésio</h1>
          <h2 className="text-1.5xl text-gray-300 font-sans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Le Kinesio Tape est une bande élastique en coton avec une couche adhésive acrylique. Cela signifie que la
            bande  s'adapte particulièrement bien à chaque <b className='text-white'>mouvement naturel du corps  .</b> Le kinesiotape reste sur la peau pendant quatre à sept jours et est imperméable.
          </h2>
          <h2 className="text-1.5xl text-gray-300 font-sans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Le ruban kinésio est utilisé pour diverses plaintes et blessures, telles que les maux de dos, les douleurs au genou,
            les douleurs à l'épaule ou les douleurs musculaires aux jambes. <b className='text-white'>Il stimule</b> le  processus de guérison du corps en
            fournissant <b className='text-white'>soutien et stabilité </b>
            sans affecter la mobilité. C'est pour cette raison que le taping médical est souvent utilisé comme méthode de traitement complémentaire.
          </h2>
          <h2 className="text-1.5xl text-gray-300 font-sans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            La bande élastique crée des espaces libres entre la peau supérieure et inférieure, où se trouvent
            de nombreux récepteurs de nerfs, de vaisseaux sanguins et lymphatiques.
          </h2>
          <h2 className="text-1.5xl text-gray-300 font-sans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            85 % des capteurs de douleur sont situés sur la couche la plus externe de la peau. Le ruban
            active le système analgésique. La douleur disparaît, permettant au patient de mieux bouger et de retrouver la fonction musculaire d’origine.
            Une amélioration est souvent perceptible lors du traitement par le thérapeute.
          </h2>

        </div>
      </div>

      {/* section 10 */}

      <div className="bg-gray-100 flex gap-10 justify-between max-sm:flex-col-reverse">
        <div className="p-20 w-15/16 max-sm:p-6 max-sm:w-full">
          <h1 className="text-4xl text-blue-950 font-dmsans max-sm:text-2xl">thérapie par la chaleur</h1>
          <h2 className="text-1.5xl text-gray-800 font-dmsans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            La chaleur agréable émise par un caloporteur ou une lampe chauffante est destinée à détendre
            les  muscles avant même le début de la thérapie .
          </h2>
          <h1 className="text-3xl text-customGreen font-dmsans mt-10 max-sm:text-2xl py-6">Objectifs de la thermothérapie</h1>

          <div className="mt-5">
            {[
              { idx: ">", p: "La chaleur stimule la circulation sanguine dans les tissus et les muscles." },
              { idx: ">", p: "Les muscles sont déjà irrigués par le sang, ce qui permet au thérapeute  <b>de mieux relâcher les zones tendues.</b>" },
              { idx: ">", p: "La chaleur est toujours utilisée lorsque l’augmentation du flux sanguin (hyperémie) est utile pour guérir des symptômes. Cela s’applique par exemple aux douleurs causées par des tensions musculaires ainsi qu’aux douleurs chroniques les plus courantes. Une fois la phase inflammatoire terminée, il est également utilisé dans les cas de traumatisme dans lesquels une structure du tissu conjonctif comme les ligaments, les tendons, le fascia, la capsule ou les muscles a été blessée. La chaleur favorise divers processus de guérison. Il conduit à une régénération plus rapide après un effort physique. Le fond est l'effet régulateur relaxant et sympathique." },

            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-row text-gray-700 font-dmsans text-xl md:text-xl pb-4 px-5 max-sm:text-base"
              >
                <div className="pr-4 text-customGreen">{item.idx} </div>
                <div dangerouslySetInnerHTML={{ __html: item.p }}></div>
              </div>
            ))}
          </div>

        </div>
        <div data-aos="fade-left" className="w-4/6 max-sm:w-full max-sm:p-4">
          <img src={image10} alt='inter' className="h-full object-cover max-sm:h-auto" />
        </div>
      </div>

      {/* section 11 */}

      <div className="bg-customBleu flex gap-10 justify-between max-sm:flex-col">
        <div data-aos="fade-right" className="w-4/6 max-sm:w-full max-sm:p-4">
          <img src={image13} alt='chelsea' className="h-full w-full object-cover max-sm:h-auto" />
        </div>
        <div className="px-20 pb-20 pt-32 w-15/16 max-sm:p-6 max-sm:w-full">
          <h1 className="text-4xl text-white font-dmsans max-sm:text-2xl">Vieillir, rester jeune grâce au golf</h1>
          <h2 className="text-1.5xl text-gray-300 font-sans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Profitez d'une saison de golf plus longue grâce à une formation de physiothérapie de golf éprouvée.
            Augmentez vos performances et réduisez vos risques de blessures. Durant le cours, vous apprendrez des stratégies
            qui vous permettront de jouer au golf malgré les handicaps physiques. Profitez
            du sport du golf en optimisant vos compétences individuelles.
          </h2>
          <h1 className="text-3xl text-customGreen font-dmsans mt-10 max-sm:text-2xl py-6">Contenu de la formation de physiothérapie de golf</h1>

          <div className="mt-5">
            {[
              { idx: ">", p: "Physiothérapie sportive spécifique au golf" },
              { idx: ">", p: "spécification de golf Blessures (épaule, articulation métatarsophalangienne, coude, cheville, poignet)" },
              { idx: ">", p: "Jouer au golf après une crise cardiaque" },
              { idx: ">", p: "Le golf pour les problèmes de colonne vertébrale" },
              { idx: ">", p: "Jouer au golf avec la spondylose " },
              { idx: ">", p: "Jouer au golf après une opération du disque " },
              { idx: ">", p: "Jouer au golf avec une scoliose" },
              { idx: ">", p: "Golf avec prothèse de hanche et de genou" },

            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-row text-gray-300 font-dmsans text-xl md:text-xl pb-4 px-5 max-sm:text-base"
              >
                <div className="pr-4 text-customGreen">{item.idx} </div>
                <div dangerouslySetInnerHTML={{ __html: item.p }}></div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  )
}

export default Physiontherapie1
