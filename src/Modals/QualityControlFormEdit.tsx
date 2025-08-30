import { useEffect, useState } from "react";
import {
    Box,
    Modal,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useGetData from "../Hooks/useGetdata";
import ShamsiDatePicker from "../components/ShamsiDatePicker/ShamsiDatePicker";
import useMutateData from "../Hooks/useMutateData";
import { persianToISOString } from "../utils/datehelper";
import { t } from "i18next";
import { ToastContainer, toast } from 'react-toastify';



const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700,
    maxWidth: "100%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    maxHeight: "90vh",
    overflowY: "auto",
};

interface CreateQualityControlFormProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    selectedEntryId: number | null;
}

export default function QualityControlFormEdit({ open, setOpen, selectedEntryId }: CreateQualityControlFormProps) {

    const { data: singleData } = useGetData({
        key: "controlFormQualityDataEdit",
        route: `/api/control/QualityControlEntries/${selectedEntryId}`,
        port: 5262,
    });


    const [showCalender, setShowCalender] = useState(false);
    const [InspectionDate, setInspectionDate] = useState(singleData?.inspectionDate || null);
    const [CompanyName, setCompanyName] = useState(singleData?.companyName || "");
    const [ProductName, setProductName] = useState(singleData?.productName || "");
    const [CompanyId, setCompanyId] = useState(singleData?.companyId || "");
    const [BatchNumber, setBatchNumber] = useState(singleData?.batchNumber || "");
    const [batchId, setBatchId] = useState<string | "">("");
    const [MachineName, setMachineName] = useState(singleData?.machineName || "");
    const [currentInspector, setCurrentInspector] = useState(singleData?.currentInspector || "");
    const [currentQuantityInspected, setCurrentQuantityInspected] = useState<number | "">("");
    const [currentQualityDefective, setCurrentQualityDefective] = useState<number | "">("");
    const [currentDefectType, setCurrentDefectType] = useState<string | "">("");
    const [currentSeverity, setCurrentSeverity] = useState<string | "">("");
    const [currentDefectDescription, setCurrentDefectDescription] = useState<string | "">("");
    const [RootCause, setRootCause] = useState<string | "">("");
    const [CorrectiveAction, setCorrectiveAction] = useState<string | "">("");
    const [products, setProducts] = useState<any[]>(singleData?.products || []);
    const [productId, setProductId] = useState<string | "">("");
    const [machineId, setMachineId] = useState<string | "">("");
    const [machines, setMachines] = useState<any[]>(singleData?.machines || []);
    const [defectId, setDefectId] = useState<string | "">("");
    const [currentSeverityId, setCurrentSeverityId] = useState<string | "">("");

    const { data } = useGetData({ key: 'controlFormQualityDatas', route: '/api/control/QualityControlEntries/EditOrCreateQCEPartial', port: 5262 });

    const { data: filteredData, fetchWithParams, isSuccess } = useGetData({
        key: "controlFormQualityDatas",
        route: `/api/control/QualityControlEntries/UpdateQCEMachinesCategoriesByCompany`,
        port: 5262,
        lazy: true,
    });

    useEffect(() => {
        if (data) {
            const CurrentCompanyId = data?.companies.find((company) => company.companyName === singleData?.companyName)?.companyId;
            setCompanyId(CurrentCompanyId);
            const CurrentProductId = data?.products.find((product) => product.productName === singleData?.productName)?.productId;
            setProductId(CurrentProductId);
            const CurrentMachineId = data?.machines.find((machine) => machine.machineName === singleData?.machineName)?.machineId;
            setMachineId(CurrentMachineId);
            const CurrentBatchId = data?.batches.find((batch) => batch.batchNumber === singleData?.batchNumber)?.batchId;
            setBatchId(CurrentBatchId);
            const CurrentDefectId = data?.defects.find((defect) => defect.defectType === singleData?.defect)?.defectId;
            setDefectId(CurrentDefectId);
            const CurrentSeverityId = data?.severities.find((severity) => severity.severityDescription === singleData?.severity)?.severityId;
            setCurrentSeverityId(CurrentSeverityId);
        }
    }, [data, singleData]);

    useEffect(() => {
        if (CompanyId) {
            FilterProductAndDevice(CompanyId);
        }
    }, [CompanyId])

    const FilterProductAndDevice = async (id: string) => {
        const result = await fetchWithParams({ id });
        if (result.products) setProducts(result.products);
        if (result.machines) setMachines(result.machines);
    };


    useEffect(() => {
        if (singleData) {
            setInspectionDate(singleData.inspectionDate || null);
            setCompanyName(singleData.companyName || "");
            setProductName(singleData.productName || "");
            setBatchNumber(singleData.batchNumber || "");
            setMachineName(singleData.machineName || "");
            setCurrentInspector(singleData.personName || "");
            setCurrentQuantityInspected(singleData.quantityInspected ?? "");
            setCurrentQualityDefective(singleData.qualityDefective ?? "");
            setCurrentDefectType(singleData.defect || "");
            setCurrentSeverity(singleData.severity || "");
            setCurrentDefectDescription(singleData.defectDescription || "");
            setRootCause(singleData.rootCause || "");
            setCorrectiveAction(singleData.correctiveAction || "");
            setProducts(singleData.products || []);
            setMachines(singleData.machines || []);
        }
    }, [singleData]);

    const { mutate } = useMutateData({
        key: "qualityControlEntry",
        route: "/api/control/QualityControlEntries",
        method: "put",
        query: {
            id: singleData?.qceId
        },
        port: 5262,
    });

    const handleSubmit = () => {
        mutate(
            {
                inspectionDate: persianToISOString(InspectionDate),
                quantityInspected: currentQuantityInspected,
                qualityDefective: currentQualityDefective,
                defectDescription: currentDefectDescription,
                rootCause: RootCause,
                correctiveAction: CorrectiveAction,
                batchId: batchId,
                severityId: currentSeverityId,
                defectId: defectId,
                machineId: machineId,
                productId: productId,
                personId: null,
                companyId: CompanyId,
            },
            {
                onSuccess: () => {
                    toast.success(t('Quality Control Form Edited Sucessfully'))
                    setOpen(false);
                },
                onError: () => {
                    toast.error(t("Something went wrong"));
                },
            }
        );

    }

    return (
        <>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={style}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }} onClick={() => setOpen(false)}>
                        <CloseIcon sx={{ cursor: "pointer" }} />
                    </Box>
                    <Typography variant="h6" gutterBottom>
                        فرم کنترل کیفیت
                    </Typography>
                    {/* Date Field */}
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
                        <TextField
                            id="inspection-date"
                            label="تاریخ و زمان بازرسی"
                            variant="outlined"
                            sx={{ flex: 1 }}
                            value={InspectionDate || ""}
                            onClick={() => setShowCalender(true)}
                            readOnly
                        />
                        {showCalender && (
                            <Box sx={{ position: "absolute", zIndex: 999 }}>
                                <ShamsiDatePicker setDate={setInspectionDate} setShowCalender={setShowCalender} />
                            </Box>
                        )}
                        <FormControl sx={{ flex: 1 }}>
                            <InputLabel id="company-label">شرکت</InputLabel>
                            <Select
                                labelId="company-label"
                                value={CompanyId || ''}
                                onChange={e => {
                                    setCompanyId(e.target.value)
                                    FilterProductAndDevice(e.target.value)
                                }}
                                label="شرکت">
                                {data?.companies?.map((company: any) => (
                                    <MenuItem key={company?.companyId} value={company?.companyId}>
                                        {company?.companyName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Product & Serial */}
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
                        <FormControl sx={{ flex: 1 }}>
                            <InputLabel id="product-label">محصول</InputLabel>
                            <Select
                                labelId="product-label"
                                value={productId || ''}
                                onChange={e => setProductId(e.target.value)}
                                label="محصول"
                            >
                                {products?.map((product: any) => (
                                    <MenuItem key={product?.productId} value={product?.productId}>
                                        {product?.productName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl sx={{ flex: 1 }}>
                            <InputLabel id="serial-label">سری ساخت محصول</InputLabel>
                            <Select
                                labelId="serial-label"
                                value={batchId}
                                onChange={e => setBatchId(e.target.value)}
                                label="سری ساخت محصول"
                            >
                                {data?.batches?.map((batch: any) => (
                                    <MenuItem key={batch?.batchId} value={batch?.batchId}>
                                        {batch?.batchNumber}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Device & Inspector */}
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
                        <FormControl sx={{ flex: 1 }}>
                            <InputLabel id="device-label">دستگاه</InputLabel>
                            <Select
                                labelId="device-label"
                                value={machineId || ''}
                                onChange={e => setMachineId(e.target.value)}
                                label="دستگاه"
                            >
                                {machines?.map((machine: any) => (
                                    <MenuItem key={machine.machineId} value={machine.machineId}>
                                        {machine.machineName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            id="inspector"
                            label="بازرس"
                            variant="outlined"
                            sx={{ flex: 1 }}
                            value={currentInspector}
                            onChange={e => setCurrentInspector(e.target.value)}
                        />
                    </Box>

                    {/* Inspected & Defective Units */}
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
                        <TextField
                            id="inspected-units"
                            type="number"
                            label="تعداد واحد بازرسی شده"
                            variant="outlined"
                            sx={{ flex: 1 }}
                            value={currentQuantityInspected}
                            onChange={e => setCurrentQuantityInspected(Number(e.target.value))}
                        />
                        <TextField
                            id="defective-units"
                            type="number"
                            label="تعداد واحد معیوب یافت شده"
                            variant="outlined"
                            sx={{ flex: 1 }}
                            value={currentQualityDefective}
                            onChange={e => setCurrentQualityDefective(Number(e.target.value))}
                        />
                    </Box>

                    {/* Defect Type & Severity */}
                    <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", mt: 2 }}>
                        <FormControl>
                            <Typography>نوع عیب</Typography>
                            <RadioGroup
                                value={defectId}
                                onChange={e => setDefectId(e.target.value)}
                            >
                                {
                                    data?.defects?.map((defect: any) => (
                                        <FormControlLabel key={defect.defectId} value={defect.defectId} control={<Radio />} label={defect.defectType} />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        <FormControl>
                            <Typography>شدت عیب</Typography>
                            <RadioGroup
                                value={currentSeverityId}
                                onChange={e => setCurrentSeverityId(e.target.value)}
                            >
                                {data?.severities?.map((severity: any) => (
                                    <FormControlLabel key={severity.severityId} value={severity.severityId} control={<Radio />} label={severity.severityDescription} />
                                ))}
                            </RadioGroup>
                        </FormControl>
                    </Box>

                    {/* Root Cause */}
                    <Box sx={{ mt: 2 }}>
                        <Typography>شرح عیب</Typography>
                        <textarea
                            value={currentDefectDescription}
                            onChange={e => setCurrentDefectDescription(e.target.value)}
                            style={{ width: "100%", height: 100, fontFamily: 'inherit' }}
                        />
                    </Box>

                    {/* Root Cause Possibility & Corrective Action */}
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
                        <TextField
                            id="root-cause-possibility"
                            label="علت ریشه‌ای احتمالی"
                            variant="outlined"
                            sx={{ flex: 1 }}
                            value={RootCause}
                            onChange={e => setRootCause(e.target.value)}
                        />
                        <TextField
                            id="corrective-action"
                            label="اقدام اصلاحی انجام شده"
                            variant="outlined"
                            sx={{ flex: 1 }}
                            value={CorrectiveAction}
                            onChange={e => setCorrectiveAction(e.target.value)}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>
                        <Button variant='outlined' onClick={handleSubmit} >ثبت</Button>
                    </Box>
                </Box>
            </Modal >

        </>
    );
}
