import type { FontAwesomeIconProps } from '@fortawesome/svelte-fontawesome';
import { faGear, faList, faFlag } from '@fortawesome/free-solid-svg-icons';
import { faHouse } from '@fortawesome/free-regular-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';

export interface PageRoute {
	path: string;
	title: string;
	icon: FontAwesomeIconProps['icon'];
}

export const pageRoutes: PageRoute[] = [
	{
		path: '/',
		title: 'Moje úkoly',
		icon: faHouse
	},
	{
		path: '/tasks',
		title: 'Všechny aktivní úkoly',
		icon: faList
	},
	{
		path: '/completed',
		title: 'Splněné úkoly',
		icon: faCheck
	},
	{
		path: '/tags',
		title: 'Štítky',
		icon: faFlag
	},
	{
		path: '/settings',
		title: 'Nastavení',
		icon: faGear
	}
];

export function getPageTitle(path: string): string | undefined {
	const page = pageRoutes.find((p) => p.path === path);
	return page ? page.title : undefined;
}
