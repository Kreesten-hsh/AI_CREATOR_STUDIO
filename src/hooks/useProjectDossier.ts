import { useCallback } from 'react';
import { useProgress } from './useProgress';
import type {
  DossierFieldStatus,
  DossierFieldValue,
  ProjectDossier,
  ProjectDossierFieldKey,
} from '../types/dossier';
import {
  exportDossierJson,
  importDossierJson,
  validateDossierField,
  type ImportDossierResult,
} from '../utils/dossierStorage';
import { resolveDossierFieldKey } from '../types/dossier';

export interface UseProjectDossierResult {
  dossier: ProjectDossier;
  getField: (fieldKeyOrAlias: string) => DossierFieldValue | undefined;
  setField: (
    key: ProjectDossierFieldKey,
    value: string,
    status?: DossierFieldStatus
  ) => { success: boolean; error?: string };
  validateField: (key: ProjectDossierFieldKey, value: string) => { valid: boolean; error?: string };
  exportDossier: () => { jsonString: string; filename: string };
  importDossier: (rawJson: string, confirmOverwrite: boolean) => ImportDossierResult;
  resetDossier: () => void;
}

export function useProjectDossier(): UseProjectDossierResult {
  const { state, updateDossierField, setDossier, resetDossier } = useProgress();

  const getField = useCallback(
    (fieldKeyOrAlias: string): DossierFieldValue | undefined => {
      const canonicalKey = resolveDossierFieldKey(fieldKeyOrAlias);
      if (!canonicalKey) return undefined;
      return state.dossier?.fields?.[canonicalKey];
    },
    [state.dossier]
  );

  const setField = useCallback(
    (
      key: ProjectDossierFieldKey,
      value: string,
      status?: DossierFieldStatus
    ): { success: boolean; error?: string } => {
      return updateDossierField(key, value, status);
    },
    [updateDossierField]
  );

  const validateField = useCallback((key: ProjectDossierFieldKey, value: string) => {
    return validateDossierField(key, value);
  }, []);

  const exportDossier = useCallback(() => {
    return exportDossierJson(state.dossier, state.profile.studentName);
  }, [state.dossier, state.profile.studentName]);

  const importDossier = useCallback(
    (rawJson: string, confirmOverwrite: boolean): ImportDossierResult => {
      const res = importDossierJson(rawJson, {
        confirmOverwrite,
        currentDossier: state.dossier,
      });
      if (res.success && res.dossier) {
        setDossier(res.dossier);
      }
      return res;
    },
    [setDossier, state.dossier]
  );

  return {
    dossier: state.dossier,
    getField,
    setField,
    validateField,
    exportDossier,
    importDossier,
    resetDossier,
  };
}
