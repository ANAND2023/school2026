import React, { useState } from 'react'
import moment from 'moment';
import Input from '../../../components/formComponent/Input';
import { useTranslation } from 'react-i18next';
import Heading from '../../../components/UI/Heading';
import { notify } from '../../../utils/ustil2';
import { bloodBankStickerPrintApi } from '../../../networkServices/blooadbankApi';
const BloodBankSticker = () => {
    const [t] = useTranslation();

    const [payload, setPayload] = useState({
        prefix: new Date() ? moment(new Date()).format("YYYY") : '',
        fromNumber: 1,
        toNumber: 1,
        numberOfPrint: 1
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPayload((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleChangeNumber = (e) => {
        const { name, value } = e.target;
        // Convert to number safely
        if (value === '') {
            setPayload((prev) => ({
                ...prev,
                [name]: '',
            }));
            return;
        }
        const numericValue = value === '' ? '' : Number(value);

        // Validation logic
        if (name === 'fromNumber' && payload.toNumber && numericValue >= Number(payload.toNumber)) {
            // Optionally show a warning or ignore the input
            notify("From No should be less than To No", "warn");
            return;
        }

        // if (name === 'toNumber' && payload.fromNumber && numericValue <= Number(payload.fromNumber)) {
        //     notify("To No should be greater than From No", "warn");
        //     return;
        // }

        setPayload((prev) => ({
            ...prev,
            [name]: numericValue,
        }));
    }
    const handleSearch = async () => {
        try {
            const data = {
                prefix: payload?.prefix,
                fromNumber: payload?.fromNumber,
                toNumber: payload?.toNumber,
                numberOfPrint: payload?.numberOfPrint,
                EntryBy: "Emp001",
                EntryByName: "Adminstrator"
            }
            const response = await bloodBankStickerPrintApi(data)
            if (response?.success) {
                const urls = Array?.isArray(response?.data) ? response?.data : [response?.data];

                urls.forEach((url) => {
                    if (typeof url === "string" && url?.trim()) {
                        window.open(url, "_blank");
                    }
                });
            } else {
                notify(response?.success, "error")
            }
        } catch (error) {
            notify(error?.success, "success")
        }
    }

    return (
        <div className='mt-2 card'>
            <Heading isBreadcrumb={true} title={"Blood Bank Sticker"} />
            <div className='row p-2'>
                <Input
                    type="text"
                    className="form-control"
                    id="prefix"
                    lable={t("From Year")}
                    name="prefix"
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    value={payload?.prefix}
                    onChange={
                        handleChange
                    }
                />
                <Input
                    type="number"
                    className="form-control"
                    id="fromNumber"
                    lable={t("From No")}
                    name="fromNumber"
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    value={payload?.fromNumber}
                    onChange={
                        handleChangeNumber
                    }
                />
                <Input
                    type="number"
                    className="form-control"
                    id="toNumber"
                    lable={t("To No")}
                    name="toNumber"
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    value={payload?.toNumber}
                    onChange={
                        handleChangeNumber
                    }
                />

                <Input
                    type="number"
                    className="form-control"
                    id="numberOfPrint"
                    lable={t("No Of Print")}
                    name="numberOfPrint"
                    respclass="col-xl-2 col-md-4 col-sm-4 col-12"
                    value={payload?.numberOfPrint}
                    onChange={
                        handleChange
                    }
                />

                <button
                    className="btn btn-sm btn-success ml-2 px-3"
                    onClick={handleSearch}
                >
                    {t("Print")}
                </button>
            </div>
        </div>
    )
}

export default BloodBankSticker