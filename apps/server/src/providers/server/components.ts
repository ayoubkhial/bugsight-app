export type Component = string | NestedComponents;

export interface NestedComponents {
	[key: string]: Component;
}

const components: NestedComponents = {
	user: 'user',
	issue: 'issue',
	project: 'project',
	sprint: 'sprint'
};

export default components;
