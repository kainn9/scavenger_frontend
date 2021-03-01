import React from 'react';
import { SET_ACTIVE_IMAGE, SET_ERROR } from '../../redux/active-route/activeRouteActions';
import { Action } from '../../redux/active-route/activeRouteReducer';
import './UploadBtnStyles.scss';
import { connect, ConnectedProps } from 'react-redux';

const mdp = (dispatch: (action: Action) => void) => ({
    SET_ACTIVE_IMAGE: (imgFile: File | null) => dispatch(SET_ACTIVE_IMAGE(imgFile)),
    SET_ERROR: (error: string | null) => dispatch(SET_ERROR(error)),
});

const connector = connect(null, mdp);
type reduxProps = ConnectedProps<typeof connector>;

const UploadBtn: React.FC<reduxProps> = function ({ children, SET_ACTIVE_IMAGE, SET_ERROR }) {
    /**
     * validates upper/max limit for file size and image dimensions(2mb and 2500 by 2500 pixels currently)
     * @param  file - fileObject, the image file that the use is trying to upload
     *  @param  size - number, size restriction 1,048,576 === 1mb
     *  @param  maxWidth - number, width restriction in pixels
     *  @param  maxLength - number, length restriction in pixels
     *  @returns boolean - true for valid : false for invalid
     * */
    const validateFile = async (file: File, size: number, maxWidth: number, maxLength: number) => {
        // 2mb restriction
        if (file) {
            if (file.size >= size) {
                return false;
            }

            // promise to wait for image height and length to resolve for validation
            const imagePromise: Promise<boolean> = new Promise((resolve) => {
                const testImg = new Image();
                testImg.src = URL.createObjectURL(file);
                testImg.onload = () => {
                    if (testImg.height > maxLength || testImg.width > maxWidth) resolve(false);
                    else resolve(true);
                };
            });
            const isDimensionsValid: boolean | Promise<boolean> = await imagePromise;
            return isDimensionsValid;
        }
        return null;
    };
    return (
        <label className="custom-file-upload">
            <input
                type="file"
                onChange={async ({ target: { files } }) => {
                    const validation = files ? await validateFile(files[0], 20971520000, 2500000, 250000) : null;
                    if (validation && files) SET_ACTIVE_IMAGE(files[0]);
                    else if (validation === null) {
                        SET_ERROR('Error, cannot set empty image');
                    } else {
                        SET_ERROR('Error, Image must be smaller than 2mb and less than 2500x 2500px');
                    }
                    setTimeout(() => SET_ERROR(null), 7000);
                }}
            />
            {children}
        </label>
    );
};

export default connector(UploadBtn);
