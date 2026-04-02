import type { ViewModel } from '@/utils/ViewModel';
import { useState, useEffect } from 'preact/hooks';

export function useViewModel<T extends ViewModel<any> | null>(model: T): T {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    if (!model) {
      return;
    }
    return model.subscribe(() => {
      forceUpdate({});
    });
  }, [model]);

  return model;
}
