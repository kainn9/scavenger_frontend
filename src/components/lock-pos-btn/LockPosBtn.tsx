import { Icon } from 'semantic-ui-react';
import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Action, CLRootState, currentLocation, isLocked } from '../../redux/current-location/currentLocationReducer';
import { PLACE_CL_MARKER, TOGGLE_IS_LOCKED } from '../../redux/current-location/currentLocationActions';

const msp = ({ currentLocation }: { currentLocation: CLRootState }) => ({
    isLocked: currentLocation.isLocked,
});
const mdp = (dispatch: (action: Action) => void) => ({
    PLACE_CL_MARKER: (cl: currentLocation) => dispatch(PLACE_CL_MARKER(cl)),
    TOGGLE_IS_LOCKED: (isLocked: isLocked) => dispatch(TOGGLE_IS_LOCKED(isLocked)),
});
const connector = connect(msp, mdp);
type reduxProps = ConnectedProps<typeof connector>;

const LockPosBtn: React.FC<reduxProps> = function ({ isLocked, TOGGLE_IS_LOCKED, PLACE_CL_MARKER }) {
    const lockPosition = () => {
        if (isLocked) {
            clearInterval(isLocked);
            TOGGLE_IS_LOCKED(null);
        } else {
            const interval = setInterval(() => {
                navigator.geolocation.getCurrentPosition(({ coords }) => {
                    return PLACE_CL_MARKER({ lat: coords.latitude, lng: coords.longitude });
                });
            }, 250);
            TOGGLE_IS_LOCKED(interval);
        }
    };
    useEffect(() => {
        if (isLocked) return clearInterval(isLocked);
    }, []);
    return (
        <div className="map-ui-btn" onClick={lockPosition}>
            {isLocked ? <p>Unlock</p> : <p>Lock</p>}
            <Icon className={isLocked ? 'lock' : 'lock open'} />
        </div>
    );
};

export default connector(LockPosBtn);
