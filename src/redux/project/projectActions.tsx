interface Project {
    title: string;
    videoUrl: string;
    imageUrl: string;
    id: number;
    icons: Array<{ title: string; icon: string }>;
    descrip: string;
    features: Array<string>;
    githubPath: string;
}
export const UPDATE_PROJECT_VIEW = function (project: Project | null): { type: string; payload: Project | null } {
    return {
        type: 'UPDATE_PROJECT_VIEW',
        payload: project,
    };
};
