import type { ReactNode } from 'react'
import { PropertiesMaterialsSectionContent } from './PropertiesMaterialsSectionContent'
import type { PropertiesSectionContext, PropertiesSectionDefinition } from './propertiesSectionContract'

const renderMaterialsSectionContent = (context: PropertiesSectionContext): ReactNode => (
  <PropertiesMaterialsSectionContent context={context} />
)

export const propertiesMaterialsSectionDefinition: PropertiesSectionDefinition = {
  id: 'materials',
  label: 'Materials',
  summary: 'First hosted section',
  supports: (selectedTarget) => selectedTarget?.kind === 'object',
  renderContent: renderMaterialsSectionContent,
}
