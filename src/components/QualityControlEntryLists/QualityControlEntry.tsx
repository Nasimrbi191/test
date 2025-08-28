import {
    Paper, Table, TableBody, TableCell, tableCellClasses,
    TableContainer, TableHead, TableRow, Tooltip, Chip,
    Button
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import useGetData from '../../Hooks/useGetdata';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import QualityControlFormCreate from '../../Modals/QualityControlFormCreate';


function QualityControlEntry() {
    const { t } = useTranslation();
    const { data, isLoading, error } = useGetData({ key: "qualityControlEntry", route: "/api/control/QualityControlEntries", port: 5262 });
    const [isShowAddFormModal, setIsShowAddFormModal] = useState(false);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading data</p>;


    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: "#FF9800",
            color: theme.palette.common.white,
            fontWeight: 600,
            fontSize: "14px",
            textTransform: "uppercase",
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 13,
            color: theme.palette.text.primary,
        },
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: 180,
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: "#fff5fb",
        },
        '&:hover': {
            backgroundColor: '#ffe6f7',
            // transform: 'scale(1.005)',
            transition: 'all 0.2s ease-in-out',
        },
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    // --- severity color map ---
    const severityColor: Record<string, "success" | "warning" | "error"> = {
        "جزئی": "success",
        "متوسط": "warning",
        "شدید": "error",
    };

    return (
        <>
            {isShowAddFormModal && <QualityControlFormCreate open={isShowAddFormModal} setOpen={setIsShowAddFormModal} />}
            <div style={{ marginBlock: '40px', maxWidth: "100%", overflowX: "auto" }}>
                <Button
                    onClick={() => setIsShowAddFormModal(true)}
                    variant="outlined" sx={{ marginBottom: '16px' }} color="primary" startIcon={<AddIcon />}>{t('Add Quality Control Form')}</Button>
                <TableContainer
                    component={Paper}
                    sx={{
                        borderRadius: '16px',
                        boxShadow: '0 6px 16px rgba(169,16,121,0.2)',
                        overflowX: 'auto',
                    }}>
                    <Table stickyHeader aria-label="quality control table" sx={{ minWidth: 900, overflow: 'auto' }}>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>{t('id')}</StyledTableCell>
                                <StyledTableCell align="center">{t('InspectionDate')}</StyledTableCell>
                                <StyledTableCell>{t('ProductName')}</StyledTableCell>
                                <StyledTableCell>{t('BatchNumber')}</StyledTableCell>
                                <StyledTableCell align="center">{t('QuantityInspected')}</StyledTableCell>
                                <StyledTableCell align="center">{t('QuantityDefective')}</StyledTableCell>
                                <StyledTableCell>{t('DefectType')}</StyledTableCell>
                                <StyledTableCell>{t('DefectDescription')}</StyledTableCell>
                                <StyledTableCell align="center">{t('Severity')}</StyledTableCell>
                                <StyledTableCell>{t('RootCause')}</StyledTableCell>
                                <StyledTableCell>{t('CorrectiveAction')}</StyledTableCell>
                                <StyledTableCell>{t('InspectorName')}</StyledTableCell>
                                <StyledTableCell>{t('MachineName')}</StyledTableCell>
                                <StyledTableCell>{t('CompanyName')}</StyledTableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {data?.map((row: any) => (
                                <StyledTableRow key={row.qceId}>
                                    <StyledTableCell>{row.qceId}</StyledTableCell>
                                    <StyledTableCell align="center">{row.inspectionDate}</StyledTableCell>
                                    <StyledTableCell>{row.productName}</StyledTableCell>
                                    <StyledTableCell>{row.batchNumber}</StyledTableCell>
                                    <StyledTableCell align="center">{row.quantityInspected}</StyledTableCell>
                                    <StyledTableCell align="center">{row.qualityDefective}</StyledTableCell>
                                    <StyledTableCell>{row.defect}</StyledTableCell>
                                    <StyledTableCell>
                                        <Tooltip title={row.defectDescription}>
                                            <span>{row.defectDescription}</span>
                                        </Tooltip>
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Chip
                                            size="small"
                                            label={row.severity}
                                            color={severityColor[row.severity] || "default"}
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>{row.rootCause || '-'}</StyledTableCell>
                                    <StyledTableCell>{row.correctiveAction || '-'}</StyledTableCell>
                                    <StyledTableCell>{row.personName || '-'}</StyledTableCell>
                                    <StyledTableCell>{row.machineName}</StyledTableCell>
                                    <StyledTableCell>{row.companyName}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    )
}

export default QualityControlEntry
