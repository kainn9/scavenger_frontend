import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Icon } from 'semantic-ui-react';
import { SET_ERROR } from '../../redux/active-route/activeRouteActions';
import { Action, activeRoute, ARRootState } from '../../redux/active-route/activeRouteReducer';
import MapUiBtn from '../default-map-ui-btn/MapUiBtn';
import SpotifySearch from '../spotify-search/SpotifySearch';
// redux
const msp = ({ activeRoute }: { activeRoute: ARRootState }) => ({
    prepNode: activeRoute.prepNode,
    activeNode: activeRoute.activeNode,
    activeRoute: activeRoute.activeRoute,
    error: activeRoute.error,
});

const mdp = (dispatch: (action: Action) => void) => ({
    SET_ERROR: (error: string | null) => dispatch(SET_ERROR(error)),
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

const SoundForm: React.FC<Props> = function ({
    // redux state
    activeNode,
    prepNode,
    error,
    activeRoute,
    //redux action methods
    SET_ERROR,
    //parent methods
    cancelNodeClickHandler,
    setMenuMode,
    isNodeEdited,
    addNodeToActiveRoute,
    addNodeClickHandler,
}) {
    return (
        <form className={`map-form ${activeNode ? 'map-form-music' : ''}`} onSubmit={(e) => e.preventDefault()}>
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

                    <div className="mf-active-container mf-active-music-mode">
                        <div className="mf-music-options">
                            <p>Search Spotify</p>
                            <p>Your Music</p>
                        </div>
                        <div className="mf-spotify-comp-container">{true ? <SpotifySearch /> : null}</div>
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
                    <div className="mf-active-container">
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

export default connector(SoundForm);
