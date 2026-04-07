import type { BaseModel } from '@/utils/BaseModel';
import { useState, useEffect } from 'preact/hooks';

export function useModel<T extends BaseModel<any> | null>(model: T): T {
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
