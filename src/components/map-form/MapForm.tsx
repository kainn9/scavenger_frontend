/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import MapUiBtn from '../default-map-ui-btn/MapUiBtn';
import './MapFormStyles.scss';
import { Icon } from 'semantic-ui-react';
import { connect, ConnectedProps } from 'react-redux';
import { Action, activeNode, activeRoute, ARRootState } from '../../redux/active-route/activeRouteReducer';
import {
    FILTER_NODE,
    SET_ACTIVE_IMAGE,
    SET_ACTIVE_NODE,
    SET_ACTIVE_ROUTE,
    SET_ACTIVE_TITLE,
    SET_ERROR,
    SET_PREP_STATE,
} from '../../redux/active-route/activeRouteActions';
import LineInput from '../line-input/LineInput';
import UploadBtn from '../prettier-upload-btn/UploadBtn';
import SpotifySearch from '../spotify-search/SpotifySearch';

const msp = ({ activeRoute }: { activeRoute: ARRootState }) => ({
    prepNode: activeRoute.prepNode,
    activeNode: activeRoute.activeNode,
    activeRoute: activeRoute.activeRoute,
    error: activeRoute.error,
});

const mdp = (dispatch: (action: Action) => void) => ({
    SET_PREP_STATE: (bool: boolean) => dispatch(SET_PREP_STATE(bool)),
    SET_ACTIVE_NODE: (node: activeNode | null) => dispatch(SET_ACTIVE_NODE(node)),
    SET_ACTIVE_TITLE: (input: string) => dispatch(SET_ACTIVE_TITLE(input)),
    SET_ACTIVE_ROUTE: (route: activeRoute | null) => dispatch(SET_ACTIVE_ROUTE(route)),
    FILTER_NODE: (key: Date | null) => dispatch(FILTER_NODE(key)),
    SET_ERROR: (error: string | null) => dispatch(SET_ERROR(error)),
    SET_ACTIVE_IMAGE: (imgFile: File | null) => dispatch(SET_ACTIVE_IMAGE(imgFile)),
});

const connector = connect(msp, mdp);
type reduxProps = ConnectedProps<typeof connector>;

const MapForm: React.FC<reduxProps> = function ({
    prepNode,
    activeNode,
    activeRoute,
    error,
    SET_PREP_STATE,
    SET_ACTIVE_TITLE,
    SET_ACTIVE_NODE,
    SET_ACTIVE_ROUTE,
    SET_ACTIVE_IMAGE,
    FILTER_NODE,
    SET_ERROR,
    
}) {
    // local state to toggle btwn form's collapsed displays
    const [menuMode, setMenuMode] = useState('');


    const addNodeClickHandler = () => {
        SET_PREP_STATE(true);
    };
    const cancelNodeClickHandler = () => {
        // clear prep state
        SET_PREP_STATE(false);
        // null key === unsaved node
        if (activeNode && activeNode.key === null) {
            FILTER_NODE(activeNode.key);
            //clear activeNode
            SET_ACTIVE_NODE(null);
            return;
        }

        if (activeNode) {
            // update coords of match in arr
            const routeClone = [...activeRoute];

            const arrayNode = routeClone.find((rNode) => {
                if (rNode && activeNode) return rNode.key === activeNode.key;
            });

            Object.assign(arrayNode, {lat: activeNode.lat, lng: activeNode.lng})
            SET_ACTIVE_ROUTE(routeClone);
            SET_ACTIVE_NODE(null);
        }

    };
    const deleteNodeHandler = () => {
        SET_PREP_STATE(false);
        if (activeNode) {
            FILTER_NODE(activeNode.key);
            SET_ACTIVE_NODE(null);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const inputHandler = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        SET_ACTIVE_TITLE(value);
    };
    const matchNode = (routes: activeRoute) => {
        let match = null;
        for (const node of routes) {
            if (node && activeNode && node.key === activeNode.key) match = node;
        }
        return match;
    };
    const isNodeEdited = (routes: activeRoute) => {
        let match = null;
        for (const node of routes) {
            if (node && activeNode && node.key === activeNode.key) match = node;
        }
        if (match && activeNode) {
            if (match.title !== activeNode.title || match.lat !== activeNode.lat || match.lng !== activeNode.lng || match.img !== activeNode.img ||  match.soundMedia !== activeNode.soundMedia) return true;
        }
        
        return false;
    };
    const addNodeToActiveRoute = () => {
        const routeClone = [...activeRoute];
        // get activeNode's place in array clone
        const addNode = matchNode(routeClone);

        const addNodeData = { ...activeNode };
        // dont want to overwrite lat and lng in array because inverted state logic
        if (addNode) {
            addNodeData.lat = addNode.lat;
            addNodeData.lng = addNode.lng;
        }
        // create new state for render array
        Object.assign(addNode, { ...addNodeData, key: Date.now(), });
        // assign state
        SET_ACTIVE_ROUTE(routeClone);
        // clear active
        SET_ACTIVE_NODE(null);
    };

    useEffect(() => {
        return SET_PREP_STATE(false);
    }, []);

    if (menuMode === 'main') return (
            <form className="map-form">
            <div className="mf-error">
                {error ? <><p>{error}</p> <MapUiBtn iconName="window close" text="" bottomText clickFN={() => SET_ERROR(null)}/></> : null}
            </div>
            <div className="mf-active-container">
                {activeNode ? (
                    <div className="mf-active-node">
                        <LineInput name="title" value={activeNode.title} inputHandler={inputHandler}>Enter Title</LineInput>
                        <div className="text-body">
                            <label className={true ? 'form-input-label' : 'label-shrink'}>Add Body</label>
                            <textarea />
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
                    <MapUiBtn text="Cancel" iconName="window close" bottomText clickFN={cancelNodeClickHandler} />
                    <MapUiBtn text="Menus" iconName="arrow alternate circle down" bottomText clickFN={() => setMenuMode('')} />
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
                    <MapUiBtn text="Cancel" iconName="window close" bottomText clickFN={cancelNodeClickHandler} />
                </div>
            ) : (
                <div className="mf-btns-container">
                    <MapUiBtn iconName="arrow alternate circle down" text="Menus" bottomText  clickFN={() => setMenuMode('')} />
                    <MapUiBtn text="Add Node" iconName="plus square" bottomText clickFN={addNodeClickHandler} />
                </div>
                
            )}
        </form>
    )
    else if (menuMode === "img") return (
        <form className="map-form">
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
                                <img className="preview-img" src={typeof activeNode.img === 'string' ? activeNode.img : URL.createObjectURL(activeNode.img)}/> 
                            </>
                            ): null}

                        {!activeNode.img ? (
                            <UploadBtn>Attach Image To Node</UploadBtn> 
                        ) : (
                            <MapUiBtn iconName="window close" text="Clear" bottomText clickFN={() => SET_ACTIVE_IMAGE(null)}/>
                        )}
                    </div>

                    <div className="mf-btns-container">
                        <MapUiBtn text="Cancel" iconName="window close" bottomText clickFN={cancelNodeClickHandler} />
                        <MapUiBtn iconName="arrow alternate circle down" text="Menus" bottomText  clickFN={() => setMenuMode('')} />
                        {isNodeEdited(activeRoute) ? (
                        <MapUiBtn text="Lock In" iconName="check circle" bottomText clickFN={addNodeToActiveRoute} />
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
                        <MapUiBtn iconName="arrow alternate circle down" text="Menus" bottomText  clickFN={() => setMenuMode('')} />
                        <MapUiBtn text="Add Node" iconName="plus square" bottomText clickFN={addNodeClickHandler} />
                    </div>
                </>
            )}
           
        </form>
    ); else if (menuMode === "music") return (
        <form className={`map-form ${activeNode ? 'map-form-music' : ''}`}>
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
                        {/* {activeNode} */}
                        <div className="mf-music-options">
                            <p>Search Spotify</p>
                            <p>Your Music</p>
                        </div>
                        <div className="mf-spotify-comp-container">
                        {true ? (
                            <SpotifySearch />
                        ) : (
                            //<SpotifyUserLib />
                            null
                        )}
                        </div>
                        
                    </div>

                    <div className="mf-btns-container">
                        <MapUiBtn text="Cancel" iconName="window close" bottomText clickFN={cancelNodeClickHandler} />
                        <MapUiBtn iconName="arrow alternate circle down" text="Menus" bottomText  clickFN={() => setMenuMode('')} />
                        {isNodeEdited(activeRoute) ? (
                        <MapUiBtn text="Lock In" iconName="check circle" bottomText clickFN={addNodeToActiveRoute} />
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
                        <MapUiBtn iconName="arrow alternate circle down" text="Menus" bottomText  clickFN={() => setMenuMode('')} />
                        <MapUiBtn text="Add Node" iconName="plus square" bottomText clickFN={addNodeClickHandler} />
                    </div>
                </>
            )}
           
        </form>
    )
    else return (
    <>
        <div className="map-form map-form-colap">
            <MapUiBtn iconName="arrow alternate circle up" text="" clickFN={() => setMenuMode('main')} />
            <p>Open Body Section</p>
        </div>

        <div className="map-form map-form-colap-middle">
            <MapUiBtn iconName="arrow alternate circle up" text=""  clickFN={() => setMenuMode('img')}/>
            <p>Open Image Section</p>
        </div>

        <div className="map-form map-form-colap-right">
            <MapUiBtn iconName="arrow alternate circle up" text=""  clickFN={() => setMenuMode('music')}/>
            <p>Open Music Section</p>
        </div>
 
    </>
    )
};
export default connector(MapForm);


