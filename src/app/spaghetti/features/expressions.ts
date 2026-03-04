export type NumberExpression = {
  kind: 'lit'
  value: number
}

export type Vec2Expression = {
  kind: 'lit'
  x: number
  y: number
}

export const resolveNumberExpression = (expression: NumberExpression): number => expression.value

export const resolveVec2Expression = (
  expression: Vec2Expression,
): { x: number; y: number } => ({
  x: expression.x,
  y: expression.y,
})
