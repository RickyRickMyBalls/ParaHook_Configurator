export type VisualStyleMenuRecipeId = 'square' | 'circle'

export type VisualStyleMenuRecipeDefinition = {
  id: VisualStyleMenuRecipeId
  label: string
  innerEdgeControlShape: 'cardGrid' | 'quarterPie'
  spacerRing: boolean
  outerVisualStyleControlShape: 'cardRing' | 'ring'
  outerInteraction: 'click' | 'direction'
  innerInteraction: 'click'
}

export const DEFAULT_VISUAL_STYLE_MENU_RECIPE_ID: VisualStyleMenuRecipeId = 'square'

export const visualStyleMenuRecipeDefinitions = [
  {
    id: 'square',
    label: 'Square',
    innerEdgeControlShape: 'cardGrid',
    spacerRing: false,
    outerVisualStyleControlShape: 'cardRing',
    outerInteraction: 'click',
    innerInteraction: 'click',
  },
  {
    id: 'circle',
    label: 'Circle',
    innerEdgeControlShape: 'quarterPie',
    spacerRing: true,
    outerVisualStyleControlShape: 'ring',
    outerInteraction: 'direction',
    innerInteraction: 'click',
  },
] as const satisfies readonly VisualStyleMenuRecipeDefinition[]

export const visualStyleMenuRecipeOptions = visualStyleMenuRecipeDefinitions.map(
  ({ id, label }) => ({
    value: id,
    label,
  }),
)

export const isVisualStyleMenuRecipeId = (
  value: unknown,
): value is VisualStyleMenuRecipeId =>
  value === 'square' || value === 'circle'

export const normalizeVisualStyleMenuRecipeId = (
  value: unknown,
): VisualStyleMenuRecipeId =>
  isVisualStyleMenuRecipeId(value) ? value : DEFAULT_VISUAL_STYLE_MENU_RECIPE_ID

export const getVisualStyleMenuRecipeDefinition = (
  value: unknown,
): VisualStyleMenuRecipeDefinition => {
  const recipeId = normalizeVisualStyleMenuRecipeId(value)
  return (
    visualStyleMenuRecipeDefinitions.find((definition) => definition.id === recipeId) ??
    visualStyleMenuRecipeDefinitions[0]
  )
}
