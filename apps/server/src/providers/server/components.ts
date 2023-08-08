export type Component = string | NestedComponents;

export interface NestedComponents {
	[key: string]: Component;
}

const components: NestedComponents = {
	task: 'task'
};

export default components;
