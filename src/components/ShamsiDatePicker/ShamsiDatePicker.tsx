import { Calendar } from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"

interface ShamsiDatePickerProps {
    setDate: (date: any) => void;
    setShowCalender: (show: boolean) => void;
}

function ShamsiDatePicker({ setDate, setShowCalender }: ShamsiDatePickerProps) {
    return (
        <Calendar
            calendar={persian}
            locale={persian_fa}
            onChange={(date) => {
                const formattedDate = date?.format("YYYY/MM/DD");
                setDate(formattedDate)
                setShowCalender(false)
            }}
        />
    )
}

export default ShamsiDatePicker
