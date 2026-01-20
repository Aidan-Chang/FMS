import { InjectionToken } from '@angular/core';

export interface Property {
  name: string;
  version: string;
  owner: string;
}

export const PROPERTY = new InjectionToken<Property>('PROPERTY');