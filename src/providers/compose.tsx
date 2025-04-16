
import React, { ComponentType } from 'react';
type ProviderComponent = ComponentType<{ children: React.ReactNode }>;
const composeProviders =
  (...providers: ProviderComponent[]) =>
  ({ children }: { children: React.ReactNode }) =>
    providers.reduceRight(
      (child, Provider) => <Provider>{child}</Provider>,
      children
    );

export default composeProviders;
