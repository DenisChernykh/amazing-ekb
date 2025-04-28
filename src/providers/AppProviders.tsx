// AppProviders.tsx
import { ReactNode, ComponentType } from 'react';
import TelegramProvider from './client/TelegramProvider';
import composeProviders from './compose';
import  FilterProvider  from './client/FilterProvider';

const AppProviders = composeProviders(
  TelegramProvider as ComponentType<{ children: ReactNode }>,
  FilterProvider as ComponentType<{ children: ReactNode }>
);

export default AppProviders;
