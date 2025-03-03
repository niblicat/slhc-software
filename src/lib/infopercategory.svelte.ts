import information from '$lib/information.json';
import { PageCategory, type InformationPerCategory } from './MyTypes';
import { getPageCategory } from './utility';

export function getInformationPerCategory(): InformationPerCategory[] | null {
    const result: InformationPerCategory[] | null = information.map(item => {
        const category: PageCategory = getPageCategory(item.category);
        if (category === PageCategory.Other) return null;
        
        return {
            category,
            header: item.header,
            points: item.points,
            sub: item.sub
        } as InformationPerCategory;
    })
    .filter((item): item is InformationPerCategory => item !== null);
    
    return result;
}