import { useCallback } from 'react';
import { shallow } from 'zustand/shallow';
import { isEdgeVisible } from '@xyflow/system';

import { useStore } from './useStore';
import { type ReactFlowState, ReactFlowProps } from '../types';

/**
 * Hook for getting the visible edge ids from the store.
 *
 * @internal
 * @param onlyRenderVisible
 * @returns array with visible edge ids
 */
export function useVisibleEdgeIds(onlyRenderVisible: boolean, filterEdges: ReactFlowProps['filterEdges']): string[] {
  const edgeIds = useStore(
    useCallback(
      (s: ReactFlowState) => {
        const edges = filterEdges ? filterEdges(s.edges, s) : s.edges;
        if (!onlyRenderVisible) {
          return edges.map((edge) => edge.id);
        }

        const visibleEdgeIds = [];

        if (s.width && s.height) {
          for (const edge of edges) {
            const sourceNode = s.nodeLookup.get(edge.source);
            const targetNode = s.nodeLookup.get(edge.target);

            if (
              sourceNode &&
              targetNode &&
              isEdgeVisible({
                sourceNode,
                targetNode,
                width: s.width,
                height: s.height,
                transform: s.transform,
              })
            ) {
              visibleEdgeIds.push(edge.id);
            }
          }
        }

        return visibleEdgeIds;
      },
      [onlyRenderVisible]
    ),
    shallow
  );

  return edgeIds;
}
