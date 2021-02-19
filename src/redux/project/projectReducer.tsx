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
interface RootState {
    currentProject: Project | null;
}
interface Action {
    type: string;
    payload: Project;
}
const INIT_STATE = {
    currentProject: null,
};

const cartReducer = function (prevState = INIT_STATE, { type, payload }: Action): RootState {
    switch (type) {
        case 'UPDATE_PROJECT_VIEW':
            console.log('insubed');
            return {
                ...prevState,
                currentProject: payload,
            };

        default:
            return prevState;
    }
};

export default cartReducer;
