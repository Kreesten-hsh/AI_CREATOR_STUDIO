import type { Day } from '../../types/course';

export const day09: Day = {
  id: 'day-09',
  dayNumber: 9,
  sprintId: 'sprint-2',
  title: 'GAMIFICATION, FEEDBACK VISUEL & ITÉRATION CLAUDE',
  italicTitleWord: 'ITÉRATION',
  objective: 'Intégrer des barres de progression dynamiques, des badges débloqués et maîtriser les techniques d\'itération chirurgicale dans Claude sans régression.',
  deliverableSummary: 'Application interactive bonifiée avec feedback visuel en direct et protocole d\'itération',
  isSkeletonPlaceholder: false,
  steps: [
    {
      id: 'day-09-step-1',
      type: 'concept',
      number: 1,
      title: 'Comprendre',
      subtitle: 'La boucle d\'engagement et les règles d\'itération sans casse',
      completionLabel: 'Valider l\'étape 1 : Comprendre',
      blocks: [
        {
          id: 'day-09-prose-1',
          type: 'prose',
          eyebrow: 'LEÇON 09 : COMPRENDRE LES FONDATIONS',
          title: 'Maintenir l\'utilisateur actif grâce au feedback immédiat',
          italicAccent: 'Progression',
          highlightPill: 'La règle d\'or : rendre chaque action visible instantanément avec une jauge et des paliers de réussite explicites.',
          paragraphs: [
            'L\'un des plus grands atouts d\'un outil interactif face à un document statique est sa capacité à fournir un retour visuel en temps réel. Lorsqu\'un utilisateur coche une étape et voit sa jauge passer immédiatement de 20 % à 40 %, son cerveau enregistre un progrès tangible. Ce mécanisme d\'accomplissement élimine le sentiment de surcharge et encourage à poursuivre jusqu\'au bout.',
            'L\'intégration de micro-récompenses (comme des badges qui s\'illuminent dès qu\'une section est achevée) matérialise des victoires d\'étape sans jamais infantiliser l\'utilisateur.',
            'Cependant, pour ajouter ces fonctionnalités dans votre code existant, vous devez maîtriser l\'art de l\'itération chirurgicale dans Claude. L\'erreur fatale des débutants est de donner une consigne vague du type « Ajoute des animations et améliore le design ». Face à un prompt flou, Claude a tendance à réécrire tout le script, à oublier certaines fonctionnalités déjà codées ou à tronquer le fichier. Pour itérer avec succès, il faut cibler la modification comme un chirurgien.',
            'Appliquez systématiquement le principe de l\'itération par brique unique : ne demandez jamais 5 fonctionnalités à la fois. Demandez d\'abord la barre de progression, testez-la dans l\'Artifact, puis demandez les badges une fois l\'étape précédente validée.',
          ],
          bullets: [
            'Toujours faire une copie de sauvegarde de votre code fonctionnel avant de demander une modification à Claude.',
            'Nommer précisément l\'élément à créer ou à modifier dans votre prompt (ex. « Ajoute la fonction updateProgress() sans modifier les fonctions calculateCapacity() existantes »).',
            'Demander à Claude de renvoyer l\'intégralité du fichier mis à jour ou le bloc exact à remplacer.',
          ],
        },
        {
          id: 'day-09-quiz-1',
          type: 'quiz',
          title: 'Validation des techniques d\'itération',
          description: 'Vérifiez vos réflexes avant de faire évoluer votre artefact dans Claude.',
          questions: [
            {
              id: 'q9-1',
              question: 'Quelle est la méthode recommandée pour faire modifier du code par Claude sans perdre ce qui marchait déjà ?',
              options: [
                'Lui donner une consigne ultra-ciblée précisant la fonction exacte à ajouter sans toucher aux autres',
                'Lui demander d\'improviser selon son humeur',
                'Effacer toute la conversation et recommencer de zéro',
              ],
              correctIndex: 0,
              explanation: 'L\'itération chirurgicale évite les régressions en ciblant explicitement la fonction ou le composant à enrichir.',
            },
            {
              id: 'q9-2',
              question: 'Comment anime-t-on une barre de progression en JavaScript vanille ?',
              options: [
                'En modifiant la propriété style.width en pourcentage sur l\'élément de la barre de progression',
                'En téléchargeant un plugin payant de 10 Mo',
                'En rechargeant toute la page web',
              ],
              correctIndex: 0,
              explanation: 'Une simple ligne comme element.style.width = pct + "%" avec une transition CSS fluide suffit à créer une animation nette et légère.',
            },
          ],
        },
      ],
    },
    {
      id: 'day-09-step-2',
      type: 'prompt',
      number: 2,
      title: 'Prompt Claude',
      subtitle: 'Prompt d\'injection de jauge de progression et de badges',
      completionLabel: 'Valider l\'étape 2 : Prompt Claude',
      blocks: [
        {
          id: 'day-09-prompt-builder',
          type: 'prompt-builder',
          title: 'Prompt d\'Itération Chirurgicale : Jauge & Récompenses',
          description:
            'Ce prompt fournit à Claude le protocole exact pour greffer une barre de progression dynamique et 3 badges débloquables sur votre code existant. Veillez à télécharger ou copier une sauvegarde de votre Artifact fonctionnel avant d\'exécuter l\'itération.',
          deliverableTarget: 'claude-artifact',
          fields: [
            {
              key: 'business',
              label: 'Thématique du produit ({{business}})',
              placeholder: 'Votre activité',
              profileBinding: 'business',
            },
            {
              key: 'mainObjective',
              label: 'Grand jalon de réussite ({{mainObjective}})',
              placeholder: 'ex. Feuille de route 30 jours validée',
              profileBinding: 'mainObjective',
            },
          ],
          template: `Tu es mon Développeur Frontend Senior. Nous itérons sur le code HTML/CSS/JS de notre application existante.

OBJECTIF DE CETTE ITÉRATION :
Ajouter une barre de progression dynamique en temps réel et un système de 3 badges débloquables au fur et à mesure que l'utilisateur valide ses actions.

INSTRUCTIONS CHIRURGICALES STRICTES :
1. CONSERVER L'EXISTANT : Ne modifie ni la navigation par onglets, ni le sélecteur de profil, ni les formules de calcul existantes.
2. AJOUTER LA BARRE DE PROGRESSION EN TÊTE DE PAGE :
   - Insère un conteneur .progress-bar-container stylisé selon l'identité visuelle de l'application.
   - Affiche un texte d'état dynamique : "X / Y actions validées (Z %)".
   - Insère une piste de progression arrondie (.progress-track) avec une barre intérieure (.progress-fill) aux couleurs d'accent de votre charte dont la largeur s'anime avec une transition CSS fluide (transition: width 0.3s ease).
3. AJOUTER LES 3 BADGES DE RÉUSSITE DÉBLOQUABLES :
   - Badge 1 : Débloqué dès que la première section ou diagnostic est validé.
   - Badge 2 : Débloqué dès que 50 % des actions sont cochées.
   - Badge 3 : Débloqué dès que 100 % des actions sont complétées (Objectif : {{mainObjective}}).
   - État verrouillé : opacité réduite (opacity: 0.45) et fond neutre.
   - État débloqué (.unlocked) : opacité 1, fond d'accent débloqué selon votre charte graphique, texte net et ombre nette.
4. METTRE À JOUR LA FONCTION D'ACTION :
   - Crée la fonction updateProgress() qui compte les cases cochées, calcule le pourcentage arrondi, met à jour la largeur de la jauge et active la classe .unlocked sur les badges mérités.
   - Appelle updateProgress() dans toggleTask() et dans loadState() pour restaurer l'état exact au rechargement.

Génère le code complet du fichier index.html mis à jour dans un Artifact unique.`,
        },
      ],
    },
    {
      id: 'day-09-step-3',
      type: 'example',
      number: 3,
      title: 'Exemple guidé',
      subtitle: 'La mécanique de feedback d\'apres-hub-interactif.html',
      completionLabel: 'Valider l\'étape 3 : Exemple guidé',
      blocks: [
        {
          id: 'day-09-example-prose',
          type: 'prose',
          eyebrow: 'ANALYSE DU CODE RÉEL',
          title: 'Comment la jauge et les badges communiquent',
          italicAccent: 'Précision',
          paragraphs: [
            'Dans notre démonstration phare (apres-hub-interactif.html), observez la fonction updateProgress() :',
            'Elle parcourt la liste des identifiants de tâches, compte combien sont vraies dans checkedTasks, puis calcule le pourcentage : Math.round((completedCount / allTasks.length) * 100).',
            'Ensuite, elle modifie deux éléments : le texte du compteur (« 4 / 11 actions validées (36 %) ») et la largeur de la jauge en CSS : progressFill.style.width = pct + "%".',
            'Enfin, des conditions simples déclenchent les badges : si les 3 premières tâches sont faites, document.getElementById("badge-1").classList.add("unlocked"). L\'effet visuel est immédiat et gratifiant.',
          ],
        },
        {
          id: 'day-09-example-copy',
          type: 'copy',
          title: 'La Fonction updateProgress() en Action',
          label: 'FONCTION-UPDATE-PROGRESS.JS',
          content: `function updateProgress() {
  const allTasks = ['task-1','task-2','task-3','task-4','task-5','task-6','task-7','task-8','task-9','task-10','task-11'];
  let completedCount = 0;

  allTasks.forEach(id => {
    if (Boolean(checkedTasks[id])) completedCount++;
  });

  const pct = Math.round((completedCount / allTasks.length) * 100);
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-text').textContent = completedCount + ' / ' + allTasks.length + ' actions validées (' + pct + ' %)';

  // Déblocage des badges
  const week1Done = checkedTasks['task-1'] && checkedTasks['task-2'] && checkedTasks['task-3'];
  const allDone = completedCount === allTasks.length;

  document.getElementById('badge-1').classList.toggle('unlocked', Boolean(week1Done));
  document.getElementById('badge-3').classList.toggle('unlocked', Boolean(allDone));
}`,
          notes: 'Ce bloc compact gère simultanément la jauge, le texte descriptif et les états des badges.',
        },
        {
          id: 'day-09-example-resources',
          type: 'resource',
          title: 'Styles & Sélecteurs de Gamification',
          description: 'Téléchargez les règles CSS de la barre de progression et des badges.',
          resources: [
            {
              id: 'res-css-progress',
              title: 'Styles CSS de la Barre & des Badges',
              category: 'template',
              description: 'Extrait CSS complet prêt à intégrer dans votre balise <style>.',
              format: 'CSS',
              downloadFilename: 'styles-progression-badges.css',
              downloadContent: `.progress-track { background: var(--bg-muted, #F1F5F9); border: 2px solid var(--border-color, #0F172A); height: 18px; border-radius: 999px; overflow: hidden; }\n.progress-fill { background: var(--primary, #2563EB); height: 100%; width: 0%; transition: width 0.3s ease; }\n.badge-chip { opacity: 0.45; background: var(--bg-muted, #F1F5F9); border: 2px solid var(--border-color, #0F172A); padding: 6px 12px; font-weight: 700; }\n.badge-chip.unlocked { opacity: 1; background: var(--accent, #38BDF8); }\n`,
            },
          ],
        },
      ],
    },
    {
      id: 'day-09-step-4',
      type: 'your-turn',
      number: 4,
      title: 'À vous de jouer',
      subtitle: 'Ajoutez votre barre de progression et débloquez vos badges',
      completionLabel: 'Valider le livrable de la Leçon 09',
      blocks: [
        {
          id: 'day-09-exercise-1',
          type: 'text-exercise',
          title: 'Espace de Travail Pratique : Votre Parcours Gamifié',
          instructions: 'Exécutez l\'itération dans Claude, testez le comportement de votre barre de progression lorsque vous cochez des actions, et décrivez ci-dessous les 3 badges de réussite que vous avez configurés pour votre client.',
          placeholder: 'Badge 1 : [Condition de déblocage] + [Nom du badge]\nBadge 2 : [Condition de déblocage] + [Nom du badge]\nBadge 3 : [Condition de déblocage] + [Nom du badge]\nConfirmation du test de la jauge en direct...',
          maxLength: 3000,
        },
        {
          id: 'day-09-checklist-1',
          type: 'checklist',
          title: 'Vérification de Fin de Leçon 09',
          description: 'Validez chaque élément avant de préparer l\'exportation et la mise en ligne (Leçon 10).',
          items: [
            {
              id: 'chk-09-1',
              label: 'La barre de progression se met à jour visuellement dès que je coche ou décoche une action',
            },
            {
              id: 'chk-09-2',
              label: 'Le texte du compteur indique correctement le nombre d\'actions et le pourcentage exact',
            },
            {
              id: 'chk-09-3',
              label: 'Les badges s\'illuminent dès que les conditions prévues sont remplies',
            },
          ],
        },
      ],
    },
  ],
};
