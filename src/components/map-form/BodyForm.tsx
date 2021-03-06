import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import { SET_ACTIVE_TEXT, SET_ACTIVE_TITLE, SET_ERROR } from '../../redux/active-route/activeRouteActions';
import { Action, activeRoute, ARRootState } from '../../redux/active-route/activeRouteReducer';
import MapUiBtn from '../default-map-ui-btn/MapUiBtn';
import LineInput from '../line-input/LineInput';

//redux
const msp = ({ activeRoute }: { activeRoute: ARRootState }) => ({
    prepNode: activeRoute.prepNode,
    activeNode: activeRoute.activeNode,
    activeRoute: activeRoute.activeRoute,
    error: activeRoute.error,
});
const mdp = (dispatch: (action: Action) => void) => ({
    SET_ACTIVE_TITLE: (input: string) => dispatch(SET_ACTIVE_TITLE(input)),
    SET_ACTIVE_TEXT: (input: string) => dispatch(SET_ACTIVE_TEXT(input)),
    SET_ERROR: (error: string | null) => dispatch(SET_ERROR(error)),
});
const connector = connect(msp, mdp);
type ReduxProps = ConnectedProps<typeof connector>;

interface Props extends ReduxProps {
    setMenuMode: (s: string) => void;
    addNodeClickHandler: () => void;
    cancelNodeClickHandler: () => void;
    isNodeEdited: (activeRoute: activeRoute) => boolean;
    addNodeToActiveRoute: () => void;
    deleteNodeHandler: () => void;
}
const BodyForm: React.FC<Props> = function ({
    // redux state
    prepNode,
    activeNode,
    activeRoute,
    error,
    // redux action methods
    SET_ACTIVE_TITLE,
    SET_ACTIVE_TEXT,
    SET_ERROR,
    //parent methods
    setMenuMode,
    addNodeClickHandler,
    cancelNodeClickHandler,
    isNodeEdited,
    addNodeToActiveRoute,
    deleteNodeHandler,
}) {
    return (
        <form className="map-form" onSubmit={(e) => e.preventDefault()}>
            <div className="mf-error">
                {error ? (
                    <>
                        <p>{error}</p>{' '}
                        <MapUiBtn iconName="window close" text="" bottomText clickFN={() => SET_ERROR(null)} />
                    </>
                ) : null}
            </div>
            <div className="mf-active-container">
                {activeNode ? (
                    <div className="mf-active-node">
                        <LineInput
                            name="title"
                            value={activeNode.title}
                            inputHandler={({ target: { value } }) => SET_ACTIVE_TITLE(value)}
                        >
                            Enter Title
                        </LineInput>
                        <div className="text-body">
                            <label>Add Body</label>
                            <textarea
                                name="body-text"
                                value={activeNode.text}
                                onChange={({ target: { value } }) => SET_ACTIVE_TEXT(value)}
                            />
                        </div>
                    </div>
                ) : prepNode ? (
                    <div className="mf-empty-pc">
                        <p>CLICK MAP TO PLACE NODE</p>
                        <Icon className="map pin" />
                    </div>
                ) : (
                    <div className="mf-empty-pc">
                        <p>NO NODES SELECTED</p>
                        <Icon className="exclamation circle" />
                    </div>
                )}
            </div>
            {activeNode ? (
                <div className="mf-btns-container">
                    <MapUiBtn text="Unselect" iconName="window close" bottomText clickFN={cancelNodeClickHandler} />
                    <MapUiBtn
                        text="Menus"
                        iconName="arrow alternate circle down"
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
                        <MapUiBtn text="Lock In" iconName="check circle" bottomText clickFN={addNodeToActiveRoute} />
                    ) : null}
                </div>
            ) : prepNode ? (
                <div className="mf-btns-container">
                    <MapUiBtn text="Unselect" iconName="window close" bottomText clickFN={cancelNodeClickHandler} />
                </div>
            ) : (
                <div className="mf-btns-container">
                    <MapUiBtn
                        iconName="arrow alternate circle down"
                        text="Menus"
                        bottomText
                        clickFN={() => setMenuMode('')}
                    />
                    <MapUiBtn text="Add Node" iconName="plus square" bottomText clickFN={addNodeClickHandler} />
                </div>
            )}
        </form>
    );
};

export default connector(BodyForm);
