import type { PortType } from '../schema/spaghettiTypes'

export type FieldNode = {
  kind: 'leaf' | 'object' | 'array'
  label?: string
  type: PortType
  children?: Record<string, FieldNode>
  item?: FieldNode
}

const makeNumberLeaf = (unit: PortType['unit']): FieldNode => ({
  kind: 'leaf',
  type: {
    kind: 'number',
    ...(unit === undefined ? {} : { unit }),
  },
})

const makeVec2Node = (unit: PortType['unit'], label: string): FieldNode => ({
  kind: 'object',
  label,
  type: {
    kind: 'vec2',
    ...(unit === undefined ? {} : { unit }),
  },
  children: {
    x: {
      ...makeNumberLeaf(unit),
      label: 'X',
    },
    y: {
      ...makeNumberLeaf(unit),
      label: 'Y',
    },
  },
})

const makeVec3Node = (unit: PortType['unit'], label: string): FieldNode => ({
  kind: 'object',
  label,
  type: {
    kind: 'vec3',
    ...(unit === undefined ? {} : { unit }),
  },
  children: {
    x: {
      ...makeNumberLeaf(unit),
      label: 'X',
    },
    y: {
      ...makeNumberLeaf(unit),
      label: 'Y',
    },
    z: {
      ...makeNumberLeaf(unit),
      label: 'Z',
    },
  },
})

export const getFieldTree = (portType: PortType): FieldNode => {
  if (portType.kind === 'vec2') {
    return makeVec2Node(portType.unit, 'Vec2')
  }

  if (portType.kind === 'vec3') {
    return makeVec3Node(portType.unit, 'Vec3')
  }

  if (portType.kind === 'spline2') {
    return {
      kind: 'object',
      label: 'Spline2',
      type: portType,
      children: {
        end: makeVec2Node('mm', 'End'),
        start: makeVec2Node('mm', 'Start'),
      },
    }
  }

  if (portType.kind === 'profileLoop') {
    return {
      kind: 'object',
      label: 'Profile Loop',
      type: portType,
      children: {
        area: {
          ...makeNumberLeaf(undefined),
          label: 'Area',
        },
        centroid: makeVec2Node('mm', 'Centroid'),
      },
    }
  }

  return {
    kind: 'leaf',
    type: portType,
  }
}

export const isCompositeFieldNode = (node: FieldNode): boolean => node.kind !== 'leaf'

export const getFieldNodeAtPath = (
  root: FieldNode,
  path: readonly string[] | undefined,
): FieldNode | undefined => {
  if (path === undefined || path.length === 0) {
    return root
  }

  let current: FieldNode | undefined = root
  for (const segment of path) {
    if (current === undefined) {
      return undefined
    }
    if (current.kind === 'object') {
      current = current.children?.[segment]
      continue
    }
    if (current.kind === 'array') {
      if (segment !== '*') {
        return undefined
      }
      current = current.item
      continue
    }
    return undefined
  }

  return current
}

type LeafPathRecord = {
  path: string[]
  node: FieldNode
}

export type FieldChildRecord = {
  key: string
  path: string[]
  node: FieldNode
}

export const listImmediateFieldChildren = (root: FieldNode): FieldChildRecord[] => {
  if (root.kind === 'array') {
    return root.item !== undefined
      ? [
          {
            key: '*',
            path: ['*'],
            node: root.item,
          },
        ]
      : []
  }

  if (root.kind !== 'object') {
    return []
  }

  return Object.entries(root.children ?? {})
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, child]) => ({
      key,
      path: [key],
      node: child,
    }))
}

export const listLeafFieldPaths = (root: FieldNode): LeafPathRecord[] => {
  const records: LeafPathRecord[] = []

  const walk = (node: FieldNode, path: string[]) => {
    if (node.kind === 'leaf') {
      records.push({
        path,
        node,
      })
      return
    }

    if (node.kind === 'array') {
      if (node.item !== undefined) {
        walk(node.item, [...path, '*'])
      }
      return
    }

    const entries = Object.entries(node.children ?? {}).sort((a, b) =>
      a[0].localeCompare(b[0]),
    )
    for (const [key, child] of entries) {
      walk(child, [...path, key])
    }
  }

  walk(root, [])
  return records
}
