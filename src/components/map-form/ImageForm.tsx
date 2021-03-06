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

interface Props extends ReduxProps {
    setMenuMode: (s: string) => void;
    cancelNodeClickHandler: () => void;
    isNodeEdited: (ar: activeRoute) => boolean;
    addNodeToActiveRoute: () => void;
    addNodeClickHandler: () => void;
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
