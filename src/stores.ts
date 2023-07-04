import { writable, type Writable } from 'svelte/store';
import type { SnackbarState } from './types';

export const snackbarState: Writable<SnackbarState | undefined> = writable(undefined);
