import { useState, useRef, useMemo } from 'react';
import {
  FolderKanban,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  RotateCcw,
  Sparkles,
  Palette,
  Layout,
  FileText,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { useProjectDossier } from '../../hooks/useProjectDossier';
import {
  ALL_DOSSIER_FIELD_KEYS,
  getFieldMaxLength,
  parseProductIdentity,
  serializeProductIdentity,
  artisticDirectionToPromptText,
  type ProjectDossierFieldKey,
  type DossierFieldStatus,
} from '../../types/dossier';
import { getProductModelById } from '../../data/productModels';
import { TemplatePicker } from '../widgets/TemplatePicker';
import { VibePicker } from '../widgets/VibePicker';

export interface DossierFieldMetadata {
  key: ProjectDossierFieldKey;
  label: string;
  category: 'identite' | 'strategie' | 'technique' | 'commercial';
  isStructured: boolean;
  hint: string;
}

export const DOSSIER_FIELDS_CATALOG: DossierFieldMetadata[] = [
  {
    key: 'productIdentity',
    label: 'Identité de marque & Nom du produit',
    category: 'identite',
    isStructured: true,
    hint: 'Nom du produit, marque et accroche courte de proposition de valeur.',
  },
  {
    key: 'chosenProductModel',
    label: 'Modèle d’architecture interactif',
    category: 'identite',
    isStructured: true,
    hint: 'Calculateur, Hub de parcours, Guide quotidien, Page de marque ou Choix libre.',
  },
  {
    key: 'artisticDirection',
    label: 'Direction artistique & Ambiance visuelle',
    category: 'identite',
    isStructured: true,
    hint: 'Couleurs, polices, formes et descripteur d’interface pour vos prompts.',
  },
  {
    key: 'documentAnalysis',
    label: 'Analyse du document source',
    category: 'strategie',
    isStructured: false,
    hint: 'Inventaire critique et déconstruction de votre document de référence.',
  },
  {
    key: 'essentialContents',
    label: 'Contenus essentiels extraits',
    category: 'strategie',
    isStructured: false,
    hint: 'Règles, barèmes, étapes clés ou données extraites du document.',
  },
  {
    key: 'interactivePotential',
    label: 'Potentiel interactif identifié',
    category: 'strategie',
    isStructured: false,
    hint: 'Ce que l’outil fait gagner à l’utilisateur par rapport à un PDF statique.',
  },
  {
    key: 'buyerProfile',
    label: 'Profil de l’acheteur cible',
    category: 'strategie',
    isStructured: false,
    hint: 'Situation professionnelle, contraintes et critères de décision de l’acheteur.',
  },
  {
    key: 'priorityProblem',
    label: 'Problème prioritaire résolu',
    category: 'strategie',
    isStructured: false,
    hint: 'Friction concrète et blocage opérationnel que l’outil élimine.',
  },
  {
    key: 'solutionPromise',
    label: 'Promesse de la solution',
    category: 'strategie',
    isStructured: false,
    hint: 'Bénéfice tangible et mesurable garanti par l’outil.',
  },
  {
    key: 'functionalBrief',
    label: 'Brief fonctionnel complet',
    category: 'technique',
    isStructured: false,
    hint: 'Spécification détaillée des entrées, calculs et sorties de l’application.',
  },
  {
    key: 'creationPrompt',
    label: 'Prompt maître de création (Master Prompt)',
    category: 'technique',
    isStructured: false,
    hint: 'Prompt complet à coller dans Claude pour générer l’artifact ou l’application.',
  },
  {
    key: 'applicationState',
    label: 'État et code de l’application',
    category: 'technique',
    isStructured: false,
    hint: 'Code source HTML/JS autonome ou statut de déploiement de l’artifact.',
  },
  {
    key: 'publishedUrl',
    label: 'URL de l’application publiée',
    category: 'technique',
    isStructured: false,
    hint: 'Lien d’accès public sur Tiiny.host, Netlify ou hébergement autonome.',
  },
  {
    key: 'commercialOffer',
    label: 'Offre commerciale & Packaging',
    category: 'commercial',
    isStructured: false,
    hint: 'Désignation de l’offre, promesse de vente et bonus inclus.',
  },
  {
    key: 'pricingConditions',
    label: 'Conditions tarifaires & Modèle de prix',
    category: 'commercial',
    isStructured: false,
    hint: 'Prix de vente, garantie, conditions de paiement et seuil de rentabilité.',
  },
  {
    key: 'accessPdf',
    label: 'Fiche d’accès PDF pour l’acheteur',
    category: 'commercial',
    isStructured: false,
    hint: 'Document PDF contenant le lien d’accès et les consignes de démarrage.',
  },
  {
    key: 'chariowSheet',
    label: 'Fiche produit Chariow',
    category: 'commercial',
    isStructured: false,
    hint: 'Textes, images et paramètres configurés pour le tunnel de paiement Chariow.',
  },
  {
    key: 'promotionalContent',
    label: 'Contenus promotionnels & Messages de lancement',
    category: 'commercial',
    isStructured: false,
    hint: 'Posts LinkedIn, emails ou messages directs pour annoncer la sortie de l’outil.',
  },
];

export function MyProjectPage() {
  const { dossier, setField, exportDossier, importDossier, resetDossier, validateField } =
    useProjectDossier();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modals et tiroirs d'édition
  const [editingFieldKey, setEditingFieldKey] = useState<ProjectDossierFieldKey | null>(null);
  const [editTextValue, setEditTextValue] = useState<string>('');
  const [editStatusValue, setEditStatusValue] = useState<DossierFieldStatus>('draft');
  const [editError, setEditError] = useState<string | null>(null);

  // Éditeur dédié ProductIdentity (Adjustment 8)
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [idName, setIdName] = useState('');
  const [idBrand, setIdBrand] = useState('');
  const [idHook, setIdHook] = useState('');

  // Modals pour TemplatePicker et VibePicker
  const [showModelModal, setShowModelModal] = useState(false);
  const [showVibeModal, setShowVibeModal] = useState(false);

  // Modal de confirmation d'import et reset
  const [pendingImportJson, setPendingImportJson] = useState<string | null>(null);
  const [showImportConfirmModal, setShowImportConfirmModal] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [bannerMessage, setBannerMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  // Métriques globales du dossier
  const stats = useMemo(() => {
    let validCount = 0;
    let draftCount = 0;
    let emptyCount = 0;
    let totalChars = 0;

    for (const key of ALL_DOSSIER_FIELD_KEYS) {
      const field = dossier.fields?.[key];
      const val = field?.value ?? '';
      totalChars += val.length;
      if (field?.status === 'valid') validCount++;
      else if (field?.status === 'draft') draftCount++;
      else emptyCount++;
    }

    return { validCount, draftCount, emptyCount, totalChars, totalFields: ALL_DOSSIER_FIELD_KEYS.length };
  }, [dossier]);

  // Export JSON
  const handleExport = () => {
    const { jsonString, filename } = exportDossier();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setBannerMessage({ type: 'success', text: `Dossier téléchargé avec succès : ${filename}` });
    window.setTimeout(() => setBannerMessage(null), 4000);
  };

  // Début du flux d'import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content !== 'string') return;

      // Test préalable sans écraser
      const testResult = importDossier(content, false);
      if (!testResult.success && !testResult.requireConfirmation) {
        setBannerMessage({ type: 'error', text: testResult.error ?? 'Fichier JSON invalide.' });
        return;
      }

      setPendingImportJson(content);
      setShowImportConfirmModal(true);
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Exécution confirmée de l'import
  const handleConfirmImport = () => {
    if (!pendingImportJson) return;
    const result = importDossier(pendingImportJson, true);
    setShowImportConfirmModal(false);
    setPendingImportJson(null);

    if (result.success) {
      setBannerMessage({
        type: 'success',
        text: 'Votre dossier de projet a été restauré avec succès depuis le fichier JSON.',
      });
    } else {
      setBannerMessage({
        type: 'error',
        text: result.error ?? 'Erreur lors de la restauration du dossier.',
      });
    }
    window.setTimeout(() => setBannerMessage(null), 5000);
  };

  // Réinitialisation du dossier
  const handleConfirmReset = () => {
    resetDossier();
    setShowResetConfirmModal(false);
    setBannerMessage({
      type: 'success',
      text: 'Le dossier de projet a été réinitialisé à l’état vierge.',
    });
    window.setTimeout(() => setBannerMessage(null), 4000);
  };

  // Ouverture de l'éditeur dédié selon le type de champ (Adjustment 8)
  const handleOpenEdit = (meta: DossierFieldMetadata) => {
    const field = dossier.fields?.[meta.key];
    const rawVal = field?.value ?? '';
    const status = field?.status ?? 'empty';

    if (meta.key === 'productIdentity') {
      const parsed = parseProductIdentity(rawVal);
      setIdName(parsed.productName);
      setIdBrand(parsed.brandName);
      setIdHook(parsed.shortHook);
      setShowIdentityModal(true);
      return;
    }

    if (meta.key === 'chosenProductModel') {
      setShowModelModal(true);
      return;
    }

    if (meta.key === 'artisticDirection') {
      setShowVibeModal(true);
      return;
    }

    // Champs texte standard
    setEditingFieldKey(meta.key);
    setEditTextValue(rawVal);
    setEditStatusValue(status === 'valid' ? 'valid' : 'draft');
    setEditError(null);
  };

  // Sauvegarde de l'éditeur texte libre standard
  const handleSaveStandardField = () => {
    if (!editingFieldKey) return;
    const validation = validateField(editingFieldKey, editTextValue);
    if (!validation.valid) {
      setEditError(validation.error ?? 'Valeur non autorisée.');
      return;
    }

    setField(editingFieldKey, editTextValue, editStatusValue);
    setEditingFieldKey(null);
  };

  // Sauvegarde de l'identité de marque structurée
  const handleSaveIdentity = () => {
    const serialized = serializeProductIdentity({
      productName: idName,
      brandName: idBrand,
      shortHook: idHook,
    });
    setField('productIdentity', serialized, idName.trim() ? 'valid' : 'draft');
    setShowIdentityModal(false);
  };

  // Rendu de la valeur du champ en texte brut (jamais en HTML - Adjustment 8)
  const renderPlainFieldValue = (meta: DossierFieldMetadata) => {
    const field = dossier.fields?.[meta.key];
    const raw = field?.value ?? '';

    if (!raw.trim()) {
      return <span className="text-xs font-mono text-ink/40 italic">Champ vide pour le moment</span>;
    }

    if (meta.key === 'productIdentity') {
      const data = parseProductIdentity(raw);
      return (
        <div className="text-xs font-mono space-y-0.5 text-ink/90">
          <div><strong className="text-ink">Produit :</strong> {data.productName || '—'}</div>
          <div><strong className="text-ink">Marque :</strong> {data.brandName || '—'}</div>
          <div><strong className="text-ink">Accroche :</strong> {data.shortHook || '—'}</div>
        </div>
      );
    }

    if (meta.key === 'chosenProductModel') {
      const model = getProductModelById(raw);
      return (
        <span className="text-xs font-mono font-bold text-ink">
          {model ? model.name : raw}
        </span>
      );
    }

    if (meta.key === 'artisticDirection') {
      const promptText = artisticDirectionToPromptText(raw);
      return (
        <p className="text-xs font-mono text-ink/90 leading-relaxed line-clamp-3">
          {promptText}
        </p>
      );
    }

    // Affichage texte brut sécurisé
    return (
      <div className="text-xs font-mono text-ink/85 whitespace-pre-wrap line-clamp-4 leading-relaxed">
        {raw}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* En-tête principal de la page Mon projet */}
      <header className="brutal-card rounded-brutal-card overflow-hidden bg-surface border-2 border-ink shadow-brutal select-none">
        <div className="p-5 sm:p-6 bg-cream border-b-2 border-ink flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-primary-red text-surface border border-ink rounded-brutal-tag font-mono text-xs font-bold uppercase">
              <FolderKanban className="w-3.5 h-3.5" aria-hidden="true" />
              ESPACE DE TRAVAIL & SAUVEGARDE
            </span>
            <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-ink">
              Mon Dossier de Projet
            </h2>
            <p className="text-xs sm:text-sm text-ink/80 max-w-2xl">
              Votre dossier rassemble l’intégralité des données, analyses et livrables de votre futur produit digital.
            </p>
          </div>

          {/* Boutons d'export et import rapide */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="brutal-btn bg-primary-red text-surface hover:bg-dark-red px-3.5 py-2 rounded-brutal-btn font-mono text-xs font-bold uppercase inline-flex items-center gap-2 shadow-brutal-xs"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>Télécharger mon dossier</span>
            </button>

            <label className="brutal-btn bg-surface text-ink hover:bg-pale-pink px-3.5 py-2 rounded-brutal-btn font-mono text-xs font-bold uppercase inline-flex items-center gap-2 border-2 border-ink shadow-brutal-xs cursor-pointer">
              <Upload className="w-4 h-4 text-primary-red" aria-hidden="true" />
              <span>Restaurer un dossier</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>

            <button
              type="button"
              onClick={() => setShowResetConfirmModal(true)}
              title="Réinitialiser le dossier"
              className="p-2 border-2 border-ink rounded-brutal-btn bg-surface text-ink hover:bg-red-50 text-xs font-mono font-bold"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Métriques d'avancement du dossier */}
        <div className="p-4 bg-surface grid grid-cols-2 sm:grid-cols-4 gap-3 text-center border-b border-ink/20">
          <div className="p-2 bg-cream border border-ink rounded">
            <span className="block font-mono text-[10px] uppercase font-bold text-ink/70">Total Champs</span>
            <span className="font-display text-lg text-ink font-bold">{stats.totalFields}</span>
          </div>
          <div className="p-2 bg-emerald-50 border border-emerald-700 rounded">
            <span className="block font-mono text-[10px] uppercase font-bold text-emerald-800">Validés</span>
            <span className="font-display text-lg text-emerald-700 font-bold">{stats.validCount}</span>
          </div>
          <div className="p-2 bg-amber-50 border border-amber-700 rounded">
            <span className="block font-mono text-[10px] uppercase font-bold text-amber-800">Brouillons</span>
            <span className="font-display text-lg text-amber-700 font-bold">{stats.draftCount}</span>
          </div>
          <div className="p-2 bg-cream border border-ink rounded">
            <span className="block font-mono text-[10px] uppercase font-bold text-ink/70">Taille Totale</span>
            <span className="font-display text-lg text-ink font-bold">{stats.totalChars.toLocaleString('fr-FR')} car.</span>
          </div>
        </div>

        {/* Explication explicite en français simple sur le stockage local (Obligatoire Mission B) */}
        <div className="p-4 sm:p-5 bg-pale-pink/60 border-t-2 border-ink flex items-start gap-3">
          <Info className="w-5 h-5 text-primary-red shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-xs sm:text-sm text-ink/90 space-y-1">
            <strong className="font-bold text-ink block uppercase font-mono text-xs">
              Important : Vos données restent exclusivement sur cet appareil
            </strong>
            <p className="leading-relaxed">
              Vos informations sont stockées uniquement dans la mémoire locale de votre navigateur (LocalStorage).
              Elles ne sont synchronisées sur aucun serveur externe. Si vous videz l’historique ou le cache de votre
              navigateur, ou si vous changez d’ordinateur, vos données seront perdues.
              <strong> Téléchargez régulièrement une sauvegarde JSON</strong> pour sécuriser votre travail.
            </p>
          </div>
        </div>
      </header>

      {/* Notifications de succès ou d'erreur */}
      {bannerMessage && (
        <div
          role="status"
          className={`p-4 border-2 border-ink rounded-brutal-card text-xs sm:text-sm font-mono font-bold flex items-center gap-2 ${
            bannerMessage.type === 'success'
              ? 'bg-emerald-100 text-emerald-950 border-emerald-800'
              : 'bg-red-100 text-red-950 border-primary-red'
          }`}
        >
          {bannerMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-700 stroke-[3]" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-primary-red stroke-[2.5]" />
          )}
          <span>{bannerMessage.text}</span>
        </div>
      )}

      {/* Liste complète des 18 champs du dossier */}
      <section className="space-y-3" aria-label="Liste des champs du dossier">
        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-ink px-1 flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary-red" aria-hidden="true" />
          Les 18 champs canoniques de votre produit
        </h3>

        <div className="space-y-3">
          {DOSSIER_FIELDS_CATALOG.map((meta) => {
            const field = dossier.fields?.[meta.key];
            const status = field?.status ?? 'empty';
            const updatedAt = field?.updatedAt ? new Date(field.updatedAt).toLocaleDateString('fr-FR') : '—';

            return (
              <div
                key={meta.key}
                className="brutal-card rounded-brutal-card p-4 sm:p-5 bg-surface border-2 border-ink shadow-brutal-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-sm uppercase text-ink font-bold">
                      {meta.label}
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 bg-cream border border-ink/40 rounded text-ink/75">
                      {meta.key}
                    </span>

                    {/* Statut du champ */}
                    {status === 'valid' && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-800 rounded-brutal-tag font-mono text-[10px] font-bold uppercase">
                        Validé
                      </span>
                    )}
                    {status === 'draft' && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-800 rounded-brutal-tag font-mono text-[10px] font-bold uppercase">
                        Brouillon
                      </span>
                    )}
                    {status === 'empty' && (
                      <span className="px-2 py-0.5 bg-cream text-ink/60 border border-ink/30 rounded-brutal-tag font-mono text-[10px] font-bold uppercase">
                        À renseigner
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-ink/70">{meta.hint}</p>

                  {/* Affichage de la valeur en texte brut pur (Adjustment 8) */}
                  <div className="p-3 bg-cream border border-ink/30 rounded">
                    {renderPlainFieldValue(meta)}
                  </div>

                  <div className="text-[10px] font-mono text-ink/60">
                    Dernière mise à jour : {updatedAt}
                  </div>
                </div>

                {/* Bouton d'action / outil dédié */}
                <div className="shrink-0 pt-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(meta)}
                    className="brutal-btn bg-surface text-ink hover:bg-pale-pink px-3 py-1.5 rounded-brutal-btn font-mono text-xs font-bold uppercase inline-flex items-center gap-1.5 border-2 border-ink shadow-brutal-xs min-h-[38px]"
                  >
                    {meta.key === 'productIdentity' ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-primary-red" aria-hidden="true" />
                        <span>Éditeur Produit</span>
                      </>
                    ) : meta.key === 'chosenProductModel' ? (
                      <>
                        <Layout className="w-3.5 h-3.5 text-primary-red" aria-hidden="true" />
                        <span>Sélecteur Modèle</span>
                      </>
                    ) : meta.key === 'artisticDirection' ? (
                      <>
                        <Palette className="w-3.5 h-3.5 text-primary-red" aria-hidden="true" />
                        <span>Studio Vibe</span>
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Modifier</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* MODAL 1 : Éditeur texte standard pour les champs non structurés */}
      {editingFieldKey && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-standard-title"
          className="fixed inset-0 z-50 bg-ink/70 flex items-center justify-center p-4"
        >
          <div className="bg-surface border-2 border-ink rounded-brutal-card p-5 sm:p-6 max-w-2xl w-full shadow-brutal space-y-4">
            <div className="flex items-center justify-between border-b-2 border-ink pb-3">
              <h4 id="edit-standard-title" className="font-display text-lg uppercase text-ink font-bold">
                Modifier le champ : {editingFieldKey}
              </h4>
              <span className="font-mono text-xs text-ink/70">
                Limite : {getFieldMaxLength(editingFieldKey).toLocaleString('fr-FR')} caractères
              </span>
            </div>

            {editError && (
              <div
                role="alert"
                className="p-3 bg-red-100 border border-primary-red rounded text-xs font-mono font-bold text-primary-red flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label htmlFor="modal-text-value" className="block font-mono text-xs font-bold uppercase mb-1">
                  Contenu textuel (Texte brut pur) :
                </label>
                <textarea
                  id="modal-text-value"
                  rows={8}
                  value={editTextValue}
                  onChange={(e) => {
                    setEditTextValue(e.target.value);
                    setEditError(null);
                  }}
                  className="w-full p-3 font-mono text-xs border-2 border-ink rounded bg-cream text-ink focus:outline-none focus:ring-2 focus:ring-primary-red"
                  placeholder="Saisissez les données pour ce champ du dossier..."
                />
                <div className="flex justify-between text-[11px] font-mono text-ink/70 mt-1">
                  <span>Caractères : {editTextValue.length.toLocaleString('fr-FR')}</span>
                  <span>Sécurité anti-secrets active</span>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs font-bold uppercase mb-1">
                  Statut de validation :
                </label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-1.5 text-xs font-mono font-bold">
                    <input
                      type="radio"
                      name="field-status"
                      value="draft"
                      checked={editStatusValue === 'draft'}
                      onChange={() => setEditStatusValue('draft')}
                      className="accent-primary-red"
                    />
                    <span>Brouillon (en cours)</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs font-mono font-bold">
                    <input
                      type="radio"
                      name="field-status"
                      value="valid"
                      checked={editStatusValue === 'valid'}
                      onChange={() => setEditStatusValue('valid')}
                      className="accent-primary-red"
                    />
                    <span>Validé (définitif)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-ink">
              <button
                type="button"
                onClick={() => setEditingFieldKey(null)}
                className="py-2 px-4 bg-surface text-ink hover:bg-cream border-2 border-ink rounded-brutal-btn font-mono text-xs font-bold uppercase"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSaveStandardField}
                className="py-2 px-5 bg-primary-red text-surface hover:bg-dark-red border-2 border-ink rounded-brutal-btn font-mono text-xs font-bold uppercase"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2 : Outil dédié ProductIdentity (Adjustment 8) */}
      {showIdentityModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="identity-modal-title"
          className="fixed inset-0 z-50 bg-ink/70 flex items-center justify-center p-4"
        >
          <div className="bg-surface border-2 border-ink rounded-brutal-card p-5 sm:p-6 max-w-xl w-full shadow-brutal space-y-4">
            <div className="flex items-center justify-between border-b-2 border-ink pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-red" aria-hidden="true" />
                <h4 id="identity-modal-title" className="font-display text-lg uppercase text-ink font-bold">
                  Éditeur d’identité produit
                </h4>
              </div>
              <span className="font-mono text-xs text-ink/70">productIdentity</span>
            </div>

            <div className="space-y-3">
              <div>
                <label htmlFor="id-product-name" className="block font-mono text-xs font-bold uppercase mb-1">
                  Nom du produit :
                </label>
                <input
                  id="id-product-name"
                  type="text"
                  value={idName}
                  onChange={(e) => setIdName(e.target.value)}
                  placeholder="ex: SimuDevis Pro"
                  className="w-full p-2.5 font-mono text-xs border-2 border-ink rounded bg-cream text-ink"
                />
              </div>

              <div>
                <label htmlFor="id-brand-name" className="block font-mono text-xs font-bold uppercase mb-1">
                  Nom de la marque ou du studio :
                </label>
                <input
                  id="id-brand-name"
                  type="text"
                  value={idBrand}
                  onChange={(e) => setIdBrand(e.target.value)}
                  placeholder="ex: Cabinet Calcul Expert"
                  className="w-full p-2.5 font-mono text-xs border-2 border-ink rounded bg-cream text-ink"
                />
              </div>

              <div>
                <label htmlFor="id-short-hook" className="block font-mono text-xs font-bold uppercase mb-1">
                  Accroche courte (Proposition de valeur en 1 phrase) :
                </label>
                <textarea
                  id="id-short-hook"
                  rows={3}
                  value={idHook}
                  onChange={(e) => setIdHook(e.target.value)}
                  placeholder="ex: Chiffrez vos chantiers et simulez vos marges en 3 clics chrono."
                  className="w-full p-2.5 font-mono text-xs border-2 border-ink rounded bg-cream text-ink"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-ink">
              <button
                type="button"
                onClick={() => setShowIdentityModal(false)}
                className="py-2 px-4 bg-surface text-ink hover:bg-cream border-2 border-ink rounded-brutal-btn font-mono text-xs font-bold uppercase"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSaveIdentity}
                className="py-2 px-5 bg-primary-red text-surface hover:bg-dark-red border-2 border-ink rounded-brutal-btn font-mono text-xs font-bold uppercase"
              >
                Enregistrer l’identité
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3 : Outil dédié TemplatePicker */}
      {showModelModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Sélecteur de modèle de produit"
          className="fixed inset-0 z-50 bg-ink/70 flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-surface border-2 border-ink rounded-brutal-card p-5 sm:p-6 max-w-4xl w-full shadow-brutal space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-ink pb-3">
              <span className="font-display text-lg uppercase font-bold text-ink">
                Choisir ou changer de modèle de produit
              </span>
              <button
                type="button"
                onClick={() => setShowModelModal(false)}
                className="py-1 px-3 bg-surface text-ink border border-ink rounded font-mono text-xs font-bold uppercase"
              >
                Fermer [ESC]
              </button>
            </div>

            <TemplatePicker />

            <div className="pt-3 border-t-2 border-ink text-right">
              <button
                type="button"
                onClick={() => setShowModelModal(false)}
                className="py-2 px-5 bg-primary-red text-surface border-2 border-ink rounded-brutal-btn font-mono text-xs font-bold uppercase"
              >
                Terminer la sélection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4 : Outil dédié VibePicker */}
      {showVibeModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Studio Vibe et identité visuelle"
          className="fixed inset-0 z-50 bg-ink/70 flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-surface border-2 border-ink rounded-brutal-card p-5 sm:p-6 max-w-4xl w-full shadow-brutal space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-ink pb-3">
              <span className="font-display text-lg uppercase font-bold text-ink">
                Ajuster la direction artistique de votre outil
              </span>
              <button
                type="button"
                onClick={() => setShowVibeModal(false)}
                className="py-1 px-3 bg-surface text-ink border border-ink rounded font-mono text-xs font-bold uppercase"
              >
                Fermer [ESC]
              </button>
            </div>

            <VibePicker />

            <div className="pt-3 border-t-2 border-ink text-right">
              <button
                type="button"
                onClick={() => setShowVibeModal(false)}
                className="py-2 px-5 bg-primary-red text-surface border-2 border-ink rounded-brutal-btn font-mono text-xs font-bold uppercase"
              >
                Terminer les réglages
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5 : Confirmation avant écrasement lors de la restauration JSON */}
      {showImportConfirmModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="import-confirm-title"
          className="fixed inset-0 z-50 bg-ink/70 flex items-center justify-center p-4"
        >
          <div className="bg-surface border-2 border-ink rounded-brutal-card p-5 sm:p-6 max-w-lg w-full shadow-brutal space-y-4">
            <div className="flex items-center gap-2 text-primary-red">
              <ShieldAlert className="w-5 h-5 shrink-0" aria-hidden="true" />
              <h4 id="import-confirm-title" className="font-display text-lg uppercase text-ink font-bold">
                Confirmer l’écrasement de votre dossier actuel
              </h4>
            </div>

            <p className="text-sm text-ink/80 leading-relaxed">
              La restauration de ce fichier JSON va <strong>remplacer l’ensemble des champs actuels</strong> de votre
              dossier de projet sur cet appareil. Une sauvegarde automatique de sécurité pré-import sera créée
              localement.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-ink">
              <button
                type="button"
                onClick={() => {
                  setShowImportConfirmModal(false);
                  setPendingImportJson(null);
                }}
                className="py-2 px-4 bg-surface text-ink hover:bg-cream border-2 border-ink rounded-brutal-btn font-mono text-xs font-bold uppercase"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                className="py-2 px-5 bg-primary-red text-surface hover:bg-dark-red border-2 border-ink rounded-brutal-btn font-mono text-xs font-bold uppercase"
              >
                Confirmer l’écrasement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6 : Confirmation avant réinitialisation vierge */}
      {showResetConfirmModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-confirm-title"
          className="fixed inset-0 z-50 bg-ink/70 flex items-center justify-center p-4"
        >
          <div className="bg-surface border-2 border-ink rounded-brutal-card p-5 sm:p-6 max-w-lg w-full shadow-brutal space-y-4">
            <div className="flex items-center gap-2 text-primary-red">
              <AlertTriangle className="w-5 h-5 shrink-0" aria-hidden="true" />
              <h4 id="reset-confirm-title" className="font-display text-lg uppercase text-ink font-bold">
                Réinitialiser le dossier de projet ?
              </h4>
            </div>

            <p className="text-sm text-ink/80 leading-relaxed">
              Tous les champs du dossier seront remis à blanc au statut <strong>empty</strong>. Cette action est
              irréversible si vous n’avez pas préalablement téléchargé une copie JSON.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-ink">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="py-2 px-4 bg-surface text-ink hover:bg-cream border-2 border-ink rounded-brutal-btn font-mono text-xs font-bold uppercase"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="py-2 px-5 bg-primary-red text-surface hover:bg-dark-red border-2 border-ink rounded-brutal-btn font-mono text-xs font-bold uppercase"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
