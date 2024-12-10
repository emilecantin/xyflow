import { useCallback } from 'react';
import { shallow } from 'zustand/shallow';
import { getNodesInside } from '@xyflow/system';

import { useStore } from './useStore';
import type { Node, ReactFlowState, ReactFlowProps } from '../types';

const selector = (onlyRenderVisible: boolean, filterNodes?: ReactFlowProps['filterNodes']) => (s: ReactFlowState) => {
  let nodes = s.nodeLookup;
  if (typeof filterNodes === 'function') {
    nodes = filterNodes(nodes, s);
  }
  if (onlyRenderVisible) {
    nodes = getNodesInside<Node>(nodes, { x: 0, y: 0, width: s.width, height: s.height }, s.transform, true);
  }
  return Array.from(nodes.keys());
};

/**
 * Hook for getting the visible node ids from the store.
 *
 * @internal
 * @param onlyRenderVisible
 * @returns array with visible node ids
 */
export function useVisibleNodeIds(onlyRenderVisible: boolean, filterNodes?: ReactFlowProps['filterNodes']) {
  const nodeIds = useStore(useCallback(selector(onlyRenderVisible, filterNodes), [onlyRenderVisible]), shallow);

  return nodeIds;
}
