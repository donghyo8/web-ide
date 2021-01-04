import { SET_PROJECT, PUSH_OPEN_FILE, SET_OPEN_FILES, PUSH_OPEN_FOLDER,
    REMOVE_OPEN_FILE, DROP_FILE, SELECT_FILE, RESET_PROJECT } from '../actions';

const init_state = {
    project: { files: [] },
    openFiles: [],
    selectFile: null,
}

function ProjectReducer (state=init_state, action) {
    const fileInOpenFiles = state.openFiles.find(e => (e === action.file));
    const fileInOpenFilesIndex = state.openFiles.findIndex(e => (e === action.file));

    switch(action.type) {
        case SET_PROJECT:
            state.project = action.project;
            break;
        case PUSH_OPEN_FOLDER:
            if(!fileInOpenFiles) state.openFiles.push(action.file);
            state.selectFile = action.file;
        case SET_OPEN_FILES:
            state.openFiles = action.files;
            break;
        case SELECT_FILE:
        case PUSH_OPEN_FILE:
            if(!fileInOpenFiles) state.openFiles.push(action.file);
            state.selectFile = action.file;
            break;
        case REMOVE_OPEN_FILE:
            if(fileInOpenFilesIndex !== -1) state.openFiles.splice(fileInOpenFilesIndex, 1);
            if(state.selectFile === action.file) state.selectFile = state.openFiles[state.openFiles.length-1];
            else if(state.openFiles.length === 0) state.selectFile = null;
            break;
        case DROP_FILE:
            if(fileInOpenFilesIndex !== -1) state.openFiles.pop(fileInOpenFilesIndex, 1);
            break;
        case RESET_PROJECT:
            state = hardCopy(init_state);
        default: break;
    }

    return assignNewObject(state);
}

function assignNewObject(obj) {
    return Object.assign({}, obj);
}

function hardCopy(obj) {
    return JSON.parse(JSON.stringify(obj))
}

export default ProjectReducer;