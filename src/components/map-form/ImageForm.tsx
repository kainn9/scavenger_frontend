import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import { SET_ACTIVE_IMAGE, SET_ERROR } from '../../redux/active-route/activeRouteActions';
import { Action, activeRoute, ARRootState } from '../../redux/active-route/activeRouteReducer';
import MapUiBtn from '../default-map-ui-btn/MapUiBtn';
import UploadBtn from '../prettier-upload-btn/UploadBtn';

// redux
const msp = ({ activeRoute }: { activeRoute: ARRootState }) => ({
    prepNode: activeRoute.prepNode,
    activeNode: activeRoute.activeNode,
    activeRoute: activeRoute.activeRoute,
    error: activeRoute.error,
});

const mdp = (dispatch: (action: Action) => void) => ({
    SET_ERROR: (error: string | null) => dispatch(SET_ERROR(error)),
    SET_ACTIVE_IMAGE: (imgFile: File | null) => dispatch(SET_ACTIVE_IMAGE(imgFile)),
});

const connector = connect(msp, mdp);
type ReduxProps = ConnectedProps<typeof connector>;
/**
 * mapForm subcomponent is form for setting img value
 * @param props.setMenuMode function sets value for menuMode(mapform local state that determines which subform to display)
 * @param props.addNodeClickHandler function(onClick for addNode) updates prepstate in redux, this enables the onClick function on the googleMap so the user can create a node
 * @param props.cancelNodeClickHandler function unselects current active node and reverts any changes or deletes it from render state if unsaved, also toggles prepstate to disables map OnClick
 * @param props.isNodeEdited function compares activeNode to its corrosponding object in activeRoute array to see if activeNode is edited
 * @param props.addNodeToActiveRoute function saves activeNode/activeNode changes to its corrosponding reference in the activeRoute
 * @param props.deleteNodeHandler function clears and removes currentActive node from its own state and activeRoute, also toggles prepstate to disables map OnClick
 * @prepNode redux state, prepNode -> true: mapOnClick enabled, fale: mapOnClick disabled
 * @activeNode redux state, current node selected
 * @activeRoute redux state, current activeRoute
 * @error error message/string
 * @SET_ACTIVE_IMAGE redux action, updates/sets current activeNode.text
 * @SET_ERROR redux action, sets error string/message in redux
 */

interface Props extends ReduxProps {
    setMenuMode: (s: string) => void;
    cancelNodeClickHandler: () => void;
    isNodeEdited: (ar: activeRoute) => boolean;
    addNodeToActiveRoute: () => void;
    addNodeClickHandler: () => void;
    deleteNodeHandler: () => void;
}

const ImageForm: React.FC<Props> = function ({
    // redux state
    activeNode,
    prepNode,
    error,
    activeRoute,
    //redux action methods
    SET_ERROR,
    SET_ACTIVE_IMAGE,
    //parent methods
    cancelNodeClickHandler,
    setMenuMode,
    isNodeEdited,
    addNodeToActiveRoute,
    addNodeClickHandler,
    deleteNodeHandler,
}) {
    return (
        <form
            className={`map-form ${activeNode && activeNode.img ? 'map-form-img' : ''}`}
            onSubmit={(e) => e.preventDefault()}
        >
            {activeNode ? (
                <>
                    <div className="mf-error">
                        {error ? (
                            <>
                                <p>{error}</p>
                                <MapUiBtn iconName="window close" text="" bottomText clickFN={() => SET_ERROR(null)} />
                            </>
                        ) : null}
                    </div>

                    <div className="mf-active-container mf-active-img-mode">
                        {activeNode && activeNode.img ? (
                            <>
                                <label>Image Preview</label>
                                <img
                                    className="preview-img"
                                    src={
                                        typeof activeNode.img === 'string'
                                            ? activeNode.img
                                            : URL.createObjectURL(activeNode.img)
                                    }
                                />
                            </>
                        ) : null}

                        {!activeNode.img ? (
                            <UploadBtn>Attach Image To Node</UploadBtn>
                        ) : (
                            <MapUiBtn
                                iconName="window close"
                                text="Clear"
                                bottomText
                                clickFN={() => SET_ACTIVE_IMAGE(null)}
                            />
                        )}
                    </div>

                    <div className="mf-btns-container">
                        <MapUiBtn text="Unselect" iconName="window close" bottomText clickFN={cancelNodeClickHandler} />
                        <MapUiBtn
                            iconName="arrow alternate circle down"
                            text="Menus"
                            bottomText
                            clickFN={() => setMenuMode('')}
                        />
                        <MapUiBtn
                            text="Remove"
                            iconName="window close"
                            fontColor="red"
                            bottomText
                            clickFN={deleteNodeHandler}
                        />

                        {isNodeEdited(activeRoute) ? (
                            <MapUiBtn
                                text="Lock In"
                                iconName="check circle"
                                bottomText
                                clickFN={addNodeToActiveRoute}
                            />
                        ) : null}
                    </div>
                </>
            ) : (
                <>
                    <div className="mf-active-container ">
                        <div className="mf-empty-pc">
                            {!prepNode ? (
                                <>
                                    <p>NO NODES SELECTED</p>
                                    <Icon className="exclamation circle" />
                                </>
                            ) : (
                                <>
                                    <p>CLICK MAP TO PLACE NODE</p>
                                    <Icon className="map pin" />
                                </>
                            )}
                        </div>
                    </div>

                    <div className="mf-btns-container">
                        <MapUiBtn
                            iconName="arrow alternate circle down"
                            text="Menus"
                            bottomText
                            clickFN={() => setMenuMode('')}
                        />
                        <MapUiBtn text="Add Node" iconName="plus square" bottomText clickFN={addNodeClickHandler} />
                    </div>
                </>
            )}
        </form>
    );
};

export default connector(ImageForm);
