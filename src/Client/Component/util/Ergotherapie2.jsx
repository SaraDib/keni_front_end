import { useEffect } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';

import imagego from '../../assets/images/ergothérapie2.jpg';
import main from '../../assets/images/main.jpg';
import inter from '../../assets/images/inter.jpg';
import fcb from '../../assets/images/fcb.jpg';
import chel from '../../assets/images/Ergothérapie.webp';

function Ergotherapie2() {
  useEffect(() => {
    AOS.init({
      duration: 2000, // Durée de l'animation
      once: true, // L'animation ne se répète qu'une seule fois
    });
  }, []);

  return (
    <div>
      {/* Section 1 */}
      <div className="bg-white px-44 py-10 flex flex-col gap-10 max-sm:px-4 max-sm:py-6">
        <h1 className="text-4xl text-blue-950 font-dmsans max-sm:text-2xl">Ergothérapie</h1>
        <h2 className="text-1.5xl text-gray-900 font-sans max-sm:text-lg">
          « Nous permettons à nos clients de gérer leur situation de santé actuelle grâce à des stratégies d'ergothérapie et en même temps de les accompagner dans l'utilisation des ressources qu'ils ont apprises ou réapprises dans leur vie quotidienne privée ou professionnelle et dans leur réintégration personnelle dans la vie sociale. »
        </h2>
        <h2 className="text-3xl text-customGreen font-dmsans max-sm:text-2xl">Stratégies d'ergothérapie</h2>

        <div className="-mt-5">
          {[
            { idx: ".", p: "Entraînement des capacités motrices et sensorielles" },
            { idx: ".", p: "formation à l'entraide et fourniture d'aide" },
            { idx: ".", p: "Accompagnement pour retrouver et améliorer les activités de la vie quotidienne" },
            { idx: ".", p: "Entraînement cognitif et neuropsychologique" },
            { idx: ".", p: "Formation socio-communicative" },
            { idx: ".", p: "Préparation à la réinsertion professionnelle" },
            { idx: ".", p: "Aménagement de l'espace de vie et aides" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-row text-gray-700 font-dmsans text-xl md:text-xl pb-4 px-5 max-sm:text-base"
            >
              <div className="pr-4 text-customGreen">{item.idx} </div>
              <div>{item.p}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2 */}
      <div className="bg-gray-300 flex gap-10 justify-between max-sm:flex-col-reverse">
        <div className="p-20 w-15/16 max-sm:p-6 max-sm:w-full">
          <h1 className="text-4xl text-blue-950 font-dmsans max-sm:text-2xl">procédures et thérapies</h1>
          <h2 className="text-1.5xl text-gray-900 font-sans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Si, en tant que personne, vous êtes limité dans votre liberté d'action, nous, à la Maison de l'ergothérapie, serons heureux de vous soutenir. Grâce à notre accompagnement, nos conseils et notre thérapie, nous vous aidons à aborder les activités quotidiennes de manière plus autonome. Nous renforçons vos compétences dans les domaines des soins personnels et de la vie privée afin que vous puissiez à nouveau profiter d'une meilleure qualité de vie. Les personnes de tous âges peuvent être affectées par des limitations fondamentales. Avec notre aide, vous pouvez prévenir les symptômes pour une santé durable.
          </h2>
          <h1 className="text-3xl text-customGreen font-dmsans mt-10 max-sm:text-2xl">Neurologie – le traitement du système nerveux</h1>
          <h2 className="text-1.5xl text-gray-900 font-sans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Les lésions du cerveau, de la moelle épinière ou du système nerveux central constituent des problèmes médicaux particulièrement complexes. Les personnes concernées sont confrontées à des limitations profondes et profondes. Ici aussi, vous pouvez compter sur notre travail professionnel. Grâce à des méthodes de traitement neuroscientifiques modernes, à des procédures de test et à des méthodes de traitement, nous vous aidons à retrouver votre liberté d’action.
          </h2>
        </div>

        <div data-aos="fade-left" className="w-4/6 max-sm:w-full max-sm:p-4">
          <img src={imagego} alt='scsd' className="h-full w-full max-sm:h-auto" />
        </div>
      </div>

      {/* Section 3 */}

      <div className="bg-customBleu flex gap-10 justify-between max-sm:flex-col ">
        <div data-aos="fade-right" className="w-4/6 max-sm:w-full max-sm:p-4">
          <img src={main} alt='kj' className="h-full w-full max-sm:h-auto" />
        </div>

        <div className="p-20 w-15/16 max-sm:p-6 max-sm:w-full">
          <h1 className="text-4xl text-white font-dmsans max-sm:text-2xl">Thérapie de la main</h1>
          <h2 className="text-1.5xl text-gray-300 font-sans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Dans ce service, nous traitons les maladies et blessures congénitales, acquises et dégénératives des membres supérieurs. Elles se déroulent de manière conservatrice ou postopératoire. L'objectif est de restaurer la fonctionnalité d'origine et la compétence quotidienne dans le travail et la vie quotidienne individuelle par des mesures appropriées. Les mesures thérapeutiques comprennent des techniques de thérapie manuelle, le traitement des cicatrices, des techniques des tissus mous, un entraînement de la motricité fine, des exercices de renforcement, une thérapie par le miroir ou des applications thermiques.
          </h2>
        </div>
      </div>

      {/* Section 4 */}
      <div className="bg-white flex gap-10 justify-between max-sm:flex-col-reverse">
        <div className="p-20 w-15/16 max-sm:p-6 max-sm:w-full">
          <h1 className="text-4xl text-blue-950 font-dmsans max-sm:text-2xl">L'orthopédie contre les troubles de l'appareil locomoteur</h1>
          <h2 className="text-1.5xl text-gray-900 font-sans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Les maladies congénitales ou chroniques ainsi que les accidents peuvent entraîner une limitation légère ou sévère de votre système musculo-squelettique. Les causes et les problèmes sont variés, mais dans notre traitement individuel, nous utilisons les méthodes les plus adaptées pour vous permettre de retrouver votre liberté de mouvement. Il s’agit par exemple d’exercices et de conseils sur la mobilité ou l’entraînement avec des prothèses.
          </h2>
        </div>

        <div data-aos="fade-left" className="w-4/6 max-sm:w-full max-sm:p-4">
          <img src={inter} alt='dkoif' className="h-full w-full max-sm:h-auto" />
        </div>
      </div>

      {/* Section 5 */}
      <div className="bg-customBleu flex gap-10 justify-between max-sm:flex-col">

        <div data-aos="fade-right" className="w-4/6 max-sm:w-full max-sm:p-4">
          <img src={fcb} alt='kuoip' className="h-full w-full max-sm:h-auto" />
        </div>

        <div className="px-20 pb-20 pt-32 w-15/16 max-sm:p-6 max-sm:w-full">
          <h1 className="text-4xl text-white font-dmsans max-sm:text-2xl">Traitement psychiatrique</h1>
          <h2 className="text-1.5xl text-gray-300 font-sans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            La santé mentale de nos patients est aussi importante pour nous que leur bien-être physique. Ici aussi, le spectre des troubles et des problèmes est très large. Qu’il s’agisse d’anxiété, de psychose, de dépendance ou de démence, nous prenons soin de vous avec les moyens idéaux. Par exemple, nous utilisons l’ergothérapie ou la thérapie par le travail.
          </h2>
        </div>
      </div>

      {/* Section 6 */}
      <div className="bg-white flex gap-10 justify-between max-sm:flex-col-reverse">
        <div className="p-20 w-15/16 max-sm:p-6 max-sm:w-full">
          <h1 className="text-4xl text-blue-950 font-dmsans max-sm:text-2xl">Traitement rhumatologique</h1>
          <h2 className="text-1.5xl text-gray-900 font-sans mt-6 pr-6 max-sm:text-lg max-sm:pr-0">
            Dans le domaine de la rhumatologie, nous traitons les maladies inflammatoires chroniques et leurs conséquences du spectre rhumatismal. Notre objectif ici est de soulager la douleur et de maintenir les fonctions actuelles de l’épaule, du bras et de la main. En plus de la mobilisation passive et active, le traitement comprend entre autres des conseils quotidiens, une protection articulaire et des applications thermiques (à prescrire en remède complémentaire sur l'ordonnance).
          </h2>
        </div>

        <div data-aos="fade-left" className="w-4/6 max-sm:w-full max-sm:p-4">
          <img src={chel} alt='jcdjs' className="h-full w-full max-sm:h-auto" />
        </div>
      </div>
    </div>
  );
}

export default Ergotherapie2;