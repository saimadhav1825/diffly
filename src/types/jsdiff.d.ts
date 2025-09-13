declare module 'diff' {
  export interface Change {
    added?: boolean;
    removed?: boolean;
    value: string;
  }

  export function diffWords(oldStr: string, newStr: string): Change[];
  export function diffLines(oldStr: string, newStr: string): Change[];
  export function diffChars(oldStr: string, newStr: string): Change[];
  export function diffSentences(oldStr: string, newStr: string): Change[];
  export function diffCss(oldStr: string, newStr: string): Change[];
  export function diffJson(oldObj: unknown, newObj: unknown): Change[];
  export function diffArrays(oldArr: unknown[], newArr: unknown[]): Change[];
  export function createPatch(fileName: string, oldStr: string, newStr: string, oldHeader?: string, newHeader?: string): string;
  export function applyPatch(source: string, patch: string): string;
  export function parsePatch(patch: string): unknown[];
  export function merge(mine: string, theirs: string, base: string): string;
  export function canonicalize(obj: unknown, stack?: unknown[], replacementStack?: unknown[]): unknown;
}