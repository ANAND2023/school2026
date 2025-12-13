import React, { useState } from 'react'
import ImageCaptureCrop from '../formComponent/ImageCaptureCrop'

const Image = () => {
    const [values, setValues] = useState({
        studentPhoto: null,
    })
        const handleImageProcessed = (fileObject, imageFieldName) => {
        setValues((preV) => ({
            ...preV,
            [imageFieldName]: fileObject, // fileObject will be a File or null
        }));
    };
  return (
    <div>
        {/* <div className="text-center"> */}
                            {/* <label className="form-label">Student Photo</label> */}
                            <ImageCaptureCrop
                                label="ddddd"
                                onImageCropped={(file) => handleImageProcessed(file, 'studentPhoto')}
                                initialImageUrl={typeof values.studentPhoto === 'string' ? values.studentPhoto : null}
                                aspectRatio={1}
                                previewSize={80}
                            />
                        {/* </div> */}
    </div>
  )
}

export default Image