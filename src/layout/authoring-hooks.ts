import { useEffect } from 'react';
import { AuthoringDragInfo, Authoring } from './authoring-drag-manager';

export const useAuthoring = (target: React.RefObject<HTMLDivElement>, options: AuthoringDragInfo) => {
    useEffect(
        () => {
            if (!options.authoring) return;
            const currentTarget = target.current;
            if (currentTarget)
                Authoring.add(currentTarget, options);
            return () => {
                if (currentTarget)
                    Authoring.remove(currentTarget);
            };
        },
        [target, options]
    );
};

