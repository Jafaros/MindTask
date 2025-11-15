import type { FontAwesomeIconProps } from '@fortawesome/svelte-fontawesome';
import { faGear, faList } from '@fortawesome/free-solid-svg-icons';
import { faHouse } from '@fortawesome/free-regular-svg-icons';

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
		title: 'Všechny úkoly',
		icon: faList
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
