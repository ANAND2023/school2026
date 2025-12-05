// import React from 'react'

// export const ViewTumorMeeting = ({dataList}) => {
//     console.log("firstdataListdataListdataListdataListdataListdataListdataListdataList",dataList)
//   return (
//     <div>ViewTumorMeeting</div>
//   )
// }




import React from 'react'
import { useTranslation } from 'react-i18next';
import Heading from '../UI/Heading';
import Tables from '../UI/customTable';
import moment from 'moment';

const ViewTumorMeeting = ({ dataList }) => {
    // console.log("props",props)
    console.log("dataListListdataListListdataListList", dataList)
    const { t } = useTranslation();
    const Thead = [
        { name: t("S.No."), width: "3%" },
        { name: t("Meeting No"), width: "3%" },
        { name: t("Meeting Date"), width: "3%" },
        { name: t("Description"), width: "90%" },
    ]
    return (
        <div

        >
            {dataList?.length > 0 && (
                <div>

                    <Tables thead={Thead}
                        // scrollView="scrollView"
                        tbody={dataList?.map((item, index) => ({
                            "S.No": index + 1,
                            "Meeting_No": item?.Meeting_No,

                            "Meeting_Date": item?.Meeting_Date,

                            "description": (
                                <div
                                style={{
      whiteSpace: "normal",   // allow wrapping
      wordWrap: "break-word", // break long words
      overflowWrap: "anywhere", // modern way
      maxWidth: "100%" // optional: fix column width
    }}
                                dangerouslySetInnerHTML={{ __html: item?.descr }} />
                            ),

                        }))} />
                </div>
            )}
        </div>
    )
}

export default ViewTumorMeeting